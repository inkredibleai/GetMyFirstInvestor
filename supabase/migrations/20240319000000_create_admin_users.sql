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
alter table public.admin_users enable row level security;

-- Create policies
create policy "Admin users are viewable by admins only"
    on admin_users for select
    using (auth.uid() in (select user_id from admin_roles));

create policy "Only admins can insert admin users"
    on admin_users for insert
    with check (auth.uid() in (select user_id from admin_roles));

create policy "Only admins can update admin users"
    on admin_users for update
    using (auth.uid() in (select user_id from admin_roles));

-- Create function to handle new admin users
create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.admin_users (id, email, full_name)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', null)
    );
    return new;
end;
$$;

-- Create trigger for new admin users
create trigger on_admin_user_created
    after insert on auth.users
    for each row
    when (new.raw_user_meta_data->>'is_admin' = 'true')
    execute procedure public.handle_new_admin_user();