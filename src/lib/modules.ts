import type { ArtifactModule } from './types'

export const MODULES: ArtifactModule[] = [
  // Management
  {
    group: 'management',
    key: 'management/clients',
    label: 'Clientes',
    description: 'RFCs, plantas, prospectos, ciclo de vida',
  },
  {
    group: 'management',
    key: 'management/units',
    label: 'Unidades',
    description: 'Vehículos, asignaciones, bitácora, Mecanix, syncs',
  },
  {
    group: 'management',
    key: 'management/operators',
    label: 'Operadores',
    description: 'Conductores, reglas de status, préstamos, syncs RRHH/MDM',
  },
  {
    group: 'management',
    key: 'management/supervisors',
    label: 'Supervisores',
    description: 'Gestión de usuarios, roles y permisos V2',
  },
  {
    group: 'management',
    key: 'management/routes',
    label: 'Rutas',
    description: 'Servicios, variantes, master schedule, sync Bustrax',
  },
  {
    group: 'management',
    key: 'management/locations',
    label: 'Ubicaciones',
    description: 'Catálogo lipu_locations, PostGIS',
  },
  {
    group: 'management',
    key: 'management/approvals',
    label: 'Aprobaciones',
    description: 'Solicitudes, tipos, máquina de estados, operaciones bulk',
  },

  // Operations
  {
    group: 'operations',
    key: 'operations/master-schedule',
    label: 'Master Schedule',
    description: 'Programación maestra, board, asignaciones, provisionales, exports',
  },
  {
    group: 'operations',
    key: 'operations/trips',
    label: 'Viajes',
    description: 'Ciclo de vida, dashboard, superficie Silia, flujo de confirmación',
  },
  {
    group: 'operations',
    key: 'operations/monitoring',
    label: 'Monitoreo',
    description: 'Board, alertas, Traffilog, activity logs',
  },
  {
    group: 'operations',
    key: 'operations/incidents',
    label: 'Incidentes',
    description: 'operations_incidents, idempotencia, producers',
  },
  {
    group: 'operations',
    key: 'operations/planning',
    label: 'Planeación',
    description: 'Import de optimización ToursSolver',
  },
  {
    group: 'operations',
    key: 'operations/guards',
    label: 'Guardias',
    description: 'Zonas, planes, scoring de candidatos ML',
  },
  {
    group: 'operations',
    key: 'operations/dashboard',
    label: 'Dashboard de Impacto',
    description: 'Métricas de impacto operacional',
  },
  {
    group: 'operations',
    key: 'operations/agents',
    label: 'Agentes',
    description: 'Agentes de operación',
  },

  // Administration
  {
    group: 'administration',
    key: 'administration/bitacora',
    label: 'Bitácora',
    description: 'Registro de eventos y actividad',
  },
  {
    group: 'administration',
    key: 'administration/users',
    label: 'Usuarios',
    description: 'Gestión de usuarios del sistema',
  },
  {
    group: 'administration',
    key: 'administration/roles',
    label: 'Roles',
    description: 'Roles y permisos del sistema',
  },
  {
    group: 'administration',
    key: 'administration/config',
    label: 'Configuración',
    description: 'Configuración general del sistema',
  },
]

export const MODULE_GROUPS = {
  management: { label: 'Management', color: 'text-sky-600 dark:text-sky-400' },
  operations: { label: 'Operations', color: 'text-lipu-500 dark:text-lipu-600' },
  administration: { label: 'Administration', color: 'text-purple-600 dark:text-purple-400' },
}

export function getModule(key: string): ArtifactModule | undefined {
  return MODULES.find((m) => m.key === key)
}
