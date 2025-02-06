-- Insert default admin role
INSERT INTO public.admin_roles (name, description)
VALUES ('super_admin', 'Super Administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- Insert basic permissions
INSERT INTO public.admin_permissions (name, description)
VALUES 
    ('users.view', 'Can view users'),
    ('users.create', 'Can create users'),
    ('users.update', 'Can update users'),
    ('users.delete', 'Can delete users')
ON CONFLICT (name) DO NOTHING;

-- Insert admin user with hardcoded UUID
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
)
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"full_name": "Super Admin"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert directly into admin_users with hardcoded values
INSERT INTO public.admin_users (
    id,
    email,
    full_name,
    role_id,
    is_super_admin
)
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'admin@example.com',
    'Super Admin',
    (SELECT id FROM public.admin_roles WHERE name = 'super_admin'),
    true
)
ON CONFLICT (id) DO NOTHING;

-- Assign all permissions to super_admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    r.id AS role_id,
    p.id AS permission_id
FROM public.admin_roles r
CROSS JOIN public.admin_permissions p
WHERE r.name = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;
