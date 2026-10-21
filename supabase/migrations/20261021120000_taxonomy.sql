-- Taxonomía configurable: grupos, módulos y estados.
-- No toca `artifacts` ni `tags`. Correr en el SQL Editor de Supabase.

-- ── Tablas ──────────────────────────────────────────────────────────

create table if not exists module_groups (
  key        text primary key,
  label      text not null,
  color      text not null default 'gray',
  sort_order int  not null default 0
);

create table if not exists modules (
  key         text primary key,
  group_key   text not null references module_groups (key)
                on update cascade on delete restrict,
  label       text not null,
  description text not null default '',
  sort_order  int  not null default 0
);

create table if not exists statuses (
  key            text primary key,
  label          text not null,
  color          text not null default 'gray',
  sort_order     int  not null default 0,
  counts_as_done boolean not null default false,
  is_default     boolean not null default false
);

-- Garantiza un único estado por defecto.
create unique index if not exists statuses_single_default
  on statuses (is_default) where is_default;

-- ── Seeds (datos actuales, mismas keys: ningún artifact cambia) ─────

insert into module_groups (key, label, color, sort_order) values
  ('management',     'Management',     'sky',    1),
  ('operations',     'Operations',     'lipu',   2),
  ('administration', 'Administration', 'purple', 3)
on conflict (key) do nothing;

insert into modules (key, group_key, label, description, sort_order) values
  ('management/clients',          'management',     'Clientes',             'RFCs, plantas, prospectos, ciclo de vida',                              1),
  ('management/units',            'management',     'Unidades',             'Vehículos, asignaciones, bitácora, Mecanix, syncs',                     2),
  ('management/operators',        'management',     'Operadores',           'Conductores, reglas de status, préstamos, syncs RRHH/MDM',             3),
  ('management/supervisors',      'management',     'Supervisores',         'Gestión de usuarios, roles y permisos V2',                              4),
  ('management/routes',           'management',     'Rutas',                'Servicios, variantes, master schedule, sync Bustrax',                   5),
  ('management/locations',        'management',     'Ubicaciones',          'Catálogo lipu_locations, PostGIS',                                      6),
  ('management/approvals',        'management',     'Aprobaciones',         'Solicitudes, tipos, máquina de estados, operaciones bulk',              7),
  ('operations/master-schedule',  'operations',     'Master Schedule',      'Programación maestra, board, asignaciones, provisionales, exports',    8),
  ('operations/trips',            'operations',     'Viajes',               'Ciclo de vida, dashboard, superficie Silia, flujo de confirmación',    9),
  ('operations/monitoring',       'operations',     'Monitoreo',            'Board, alertas, Traffilog, activity logs',                             10),
  ('operations/incidents',        'operations',     'Incidentes',           'operations_incidents, idempotencia, producers',                        11),
  ('operations/planning',         'operations',     'Planeación',           'Import de optimización ToursSolver',                                   12),
  ('operations/guards',           'operations',     'Guardias',             'Zonas, planes, scoring de candidatos ML',                              13),
  ('operations/dashboard',        'operations',     'Dashboard de Impacto', 'Métricas de impacto operacional',                                      14),
  ('operations/agents',           'operations',     'Agentes',              'Agentes de operación',                                                 15),
  ('administration/bitacora',     'administration', 'Bitácora',             'Registro de eventos y actividad',                                      16),
  ('administration/users',        'administration', 'Usuarios',             'Gestión de usuarios del sistema',                                      17),
  ('administration/roles',        'administration', 'Roles',                'Roles y permisos del sistema',                                         18),
  ('administration/config',       'administration', 'Configuración',        'Configuración general del sistema',                                    19)
on conflict (key) do nothing;

insert into statuses (key, label, color, sort_order, counts_as_done, is_default) values
  ('borrador',    'Borrador',    'gray',   1, false, true),
  ('en-revision', 'En revisión', 'yellow', 2, false, false),
  ('aprobado',    'Aprobado',    'green',  3, true,  false),
  ('entregado',   'Entregado',   'lipu',   4, true,  false),
  ('deprecado',   'Deprecado',   'red',    5, false, false)
on conflict (key) do nothing;

-- ── RLS: lectura abierta, escritura solo para admins autenticados ───

alter table module_groups enable row level security;
alter table modules       enable row level security;
alter table statuses      enable row level security;

drop policy if exists "taxonomy read"  on module_groups;
drop policy if exists "taxonomy write" on module_groups;
create policy "taxonomy read" on module_groups
  for select using (true);
create policy "taxonomy write" on module_groups
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "taxonomy read"  on modules;
drop policy if exists "taxonomy write" on modules;
create policy "taxonomy read" on modules
  for select using (true);
create policy "taxonomy write" on modules
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "taxonomy read"  on statuses;
drop policy if exists "taxonomy write" on statuses;
create policy "taxonomy read" on statuses
  for select using (true);
create policy "taxonomy write" on statuses
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
