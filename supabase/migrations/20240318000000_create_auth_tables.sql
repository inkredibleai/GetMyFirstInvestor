-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    user_type text check (user_type in ('founder', 'investor', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create admin_roles table
create table if not exists public.admin_roles (
    user_id uuid references auth.users on delete cascade primary key,
    role text not null check (role = 'admin'),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create admin_users table
create table if not exists public.admin_users (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    phone_number text,
    department text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.admin_roles enable row level security;
alter table public.admin_users enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using (true);

create policy "Users can insert their own profile"
    on profiles for insert
    with check (auth.uid() = id);

create policy "Users can update own profile"
    on profiles for update
    using (auth.uid() = id);

create policy "Only admins can view admin_roles"
    on admin_roles for select
    using (auth.uid() in (select user_id from admin_roles));

create policy "Only admins can insert admin_roles"
    on admin_roles for insert
    using (auth.uid() in (select user_id from admin_roles));

create policy "Only admins can view admin_users"
    on admin_users for select
    using (auth.uid() in (select user_id from admin_roles));

create policy "Only admins can insert admin_users"
    on admin_users for insert
    using (auth.uid() in (select user_id from admin_roles) or not exists (select 1 from admin_users));

-- Create function to handle new user profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
    is_admin boolean;
begin
    -- Check if user is marked as admin in metadata
    is_admin := (new.raw_user_meta_data->>'is_admin')::boolean;
    
    -- Insert into profiles
    insert into public.profiles (id, email, full_name, user_type)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', null),
        case when is_admin then 'admin' else coalesce(new.raw_user_meta_data->>'user_type', 'founder') end
    );

    -- If admin user, also insert into admin_users
    if is_admin then
        insert into public.admin_users (id, email, full_name)
        values (
            new.id,
            new.email,
            coalesce(new.raw_user_meta_data->>'full_name', null)
        );
    end if;

    return new;
end;
$$;

-- Create trigger for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();