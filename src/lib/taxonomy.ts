import { supabase } from './supabase'
import type { Taxonomy, TaxonomyGroup, TaxonomyModule, TaxonomyStatus } from './types'

// Fallback con la taxonomía sembrada: mantiene la app funcionando si la
// migración aún no se corre (se loguea un warning para detectarlo).
const DEFAULT_TAXONOMY: Taxonomy = {
  groups: [
    { key: 'management', label: 'Management', color: 'sky', sortOrder: 1 },
    { key: 'operations', label: 'Operations', color: 'lipu', sortOrder: 2 },
    { key: 'administration', label: 'Administration', color: 'purple', sortOrder: 3 },
  ],
  modules: [
    { key: 'management/clients', groupKey: 'management', label: 'Clientes', description: 'RFCs, plantas, prospectos, ciclo de vida', sortOrder: 1 },
    { key: 'management/units', groupKey: 'management', label: 'Unidades', description: 'Vehículos, asignaciones, bitácora, Mecanix, syncs', sortOrder: 2 },
    { key: 'management/operators', groupKey: 'management', label: 'Operadores', description: 'Conductores, reglas de status, préstamos, syncs RRHH/MDM', sortOrder: 3 },
    { key: 'management/supervisors', groupKey: 'management', label: 'Supervisores', description: 'Gestión de usuarios, roles y permisos V2', sortOrder: 4 },
    { key: 'management/routes', groupKey: 'management', label: 'Rutas', description: 'Servicios, variantes, master schedule, sync Bustrax', sortOrder: 5 },
    { key: 'management/locations', groupKey: 'management', label: 'Ubicaciones', description: 'Catálogo lipu_locations, PostGIS', sortOrder: 6 },
    { key: 'management/approvals', groupKey: 'management', label: 'Aprobaciones', description: 'Solicitudes, tipos, máquina de estados, operaciones bulk', sortOrder: 7 },
    { key: 'operations/master-schedule', groupKey: 'operations', label: 'Master Schedule', description: 'Programación maestra, board, asignaciones, provisionales, exports', sortOrder: 8 },
    { key: 'operations/trips', groupKey: 'operations', label: 'Viajes', description: 'Ciclo de vida, dashboard, superficie Silia, flujo de confirmación', sortOrder: 9 },
    { key: 'operations/monitoring', groupKey: 'operations', label: 'Monitoreo', description: 'Board, alertas, Traffilog, activity logs', sortOrder: 10 },
    { key: 'operations/incidents', groupKey: 'operations', label: 'Incidentes', description: 'operations_incidents, idempotencia, producers', sortOrder: 11 },
    { key: 'operations/planning', groupKey: 'operations', label: 'Planeación', description: 'Import de optimización ToursSolver', sortOrder: 12 },
    { key: 'operations/guards', groupKey: 'operations', label: 'Guardias', description: 'Zonas, planes, scoring de candidatos ML', sortOrder: 13 },
    { key: 'operations/dashboard', groupKey: 'operations', label: 'Dashboard de Impacto', description: 'Métricas de impacto operacional', sortOrder: 14 },
    { key: 'operations/agents', groupKey: 'operations', label: 'Agentes', description: 'Agentes de operación', sortOrder: 15 },
    { key: 'administration/bitacora', groupKey: 'administration', label: 'Bitácora', description: 'Registro de eventos y actividad', sortOrder: 16 },
    { key: 'administration/users', groupKey: 'administration', label: 'Usuarios', description: 'Gestión de usuarios del sistema', sortOrder: 17 },
    { key: 'administration/roles', groupKey: 'administration', label: 'Roles', description: 'Roles y permisos del sistema', sortOrder: 18 },
    { key: 'administration/config', groupKey: 'administration', label: 'Configuración', description: 'Configuración general del sistema', sortOrder: 19 },
  ],
  statuses: [
    { key: 'borrador', label: 'Borrador', color: 'gray', sortOrder: 1, countsAsDone: false, isDefault: true },
    { key: 'en-revision', label: 'En revisión', color: 'yellow', sortOrder: 2, countsAsDone: false, isDefault: false },
    { key: 'aprobado', label: 'Aprobado', color: 'green', sortOrder: 3, countsAsDone: true, isDefault: false },
    { key: 'entregado', label: 'Entregado', color: 'lipu', sortOrder: 4, countsAsDone: true, isDefault: false },
    { key: 'deprecado', label: 'Deprecado', color: 'red', sortOrder: 5, countsAsDone: false, isDefault: false },
  ],
}

type Row = Record<string, unknown>

const toGroup = (r: Row): TaxonomyGroup => ({
  key: r.key as string,
  label: r.label as string,
  color: r.color as string,
  sortOrder: r.sort_order as number,
})

const toModule = (r: Row): TaxonomyModule => ({
  key: r.key as string,
  groupKey: r.group_key as string,
  label: r.label as string,
  description: r.description as string,
  sortOrder: r.sort_order as number,
})

const toStatus = (r: Row): TaxonomyStatus => ({
  key: r.key as string,
  label: r.label as string,
  color: r.color as string,
  sortOrder: r.sort_order as number,
  countsAsDone: r.counts_as_done as boolean,
  isDefault: r.is_default as boolean,
})

/** Lee la taxonomía completa (solo servidor). */
export async function getTaxonomy(): Promise<Taxonomy> {
  const [groups, modules, statuses] = await Promise.all([
    supabase.from('module_groups').select('*').order('sort_order').order('key'),
    supabase.from('modules').select('*').order('sort_order').order('key'),
    supabase.from('statuses').select('*').order('sort_order').order('key'),
  ])

  if (groups.error || modules.error || statuses.error) {
    console.warn(
      '[taxonomy] No se pudo leer la taxonomía de Supabase, usando valores por defecto. ¿Corriste la migración?',
      groups.error?.message ?? modules.error?.message ?? statuses.error?.message
    )
    return DEFAULT_TAXONOMY
  }

  return {
    groups: (groups.data ?? []).map(toGroup),
    modules: (modules.data ?? []).map(toModule),
    statuses: (statuses.data ?? []).map(toStatus),
  }
}
