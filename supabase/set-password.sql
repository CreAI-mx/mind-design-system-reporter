-- Restablece la contraseña de un usuario (solo para admins, desde el SQL Editor).
-- Úsalo para asignar las contraseñas iniciales del equipo o cuando alguien la olvide.
-- Cada quien puede cambiarla después desde la app en Configuración → Cuenta.
--
-- 1) Edita el correo y la contraseña.
-- 2) Run.
-- 3) IMPORTANTE: borra esta query del historial del SQL Editor después de usarla
--    (la contraseña queda en texto plano en el historial).

update auth.users
set encrypted_password = crypt('CAMBIA-ESTA-CONTRASEÑA', gen_salt('bf'))
where email = 'correo@dominio.com';
