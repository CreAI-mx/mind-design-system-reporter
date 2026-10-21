-- Asigna el rol admin a los usuarios del equipo.
-- Correr DESPUÉS de crear cada usuario en Authentication → Users
-- (Add user / Invite user, con "Auto Confirm User" marcado).
-- Recuerda también desactivar el registro público:
-- Authentication → Providers → Email → "Allow new users to sign up" = off.

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
where email in (
  'angeloortiz@silia.com',
  'paolapalomino@creai.mx',
  'omaracosta@creai.mx',
  'ayanniperez@creai.mx',
  'nahuelmartinez@creai.mx'
);

-- Verificación: debe listar los 5 correos con role = admin.
select email, raw_app_meta_data ->> 'role' as role
from auth.users
order by email;
