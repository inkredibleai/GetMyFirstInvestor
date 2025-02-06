-- Insert admin user into auth.users if not exists
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if admin user already exists
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'admin@fundmystartup.com';

    -- If admin user doesn't exist, create it
    IF admin_user_id IS NULL THEN
        -- Insert into auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_token,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@fundmystartup.com',
            crypt('1234567', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '',
            '',
            ''
        )
        RETURNING id INTO admin_user_id;

        -- Insert into profiles
        INSERT INTO public.profiles (
            id,
            email,
            full_name,
            user_type,
            created_at,
            updated_at
        )
        VALUES (
            admin_user_id,
            'admin@fundmystartup.com',
            'Admin',
            'admin',
            NOW(),
            NOW()
        );

        -- Insert into admin_roles
        INSERT INTO public.admin_roles (
            user_id,
            role,
            created_at
        )
        VALUES (
            admin_user_id,
            'admin',
            NOW()
        );
    END IF;
END
$$;