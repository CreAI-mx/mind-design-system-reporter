// Paleta fija para la taxonomía configurable. La base de datos guarda el
// token (p. ej. 'sky') y aquí vive el mapa de clases, porque Tailwind solo
// genera las clases que ve escritas en el código.

export interface ColorClasses {
  /** Texto acentuado: labels de grupo, encabezados de columna kanban. */
  text: string
  /** Pill/badge de estado. */
  badge: string
  /** Zona de drop del kanban al arrastrar. */
  drop: string
  /** Muestra sólida para el selector de color en settings. */
  swatch: string
}

export const COLOR_TOKENS: Record<string, ColorClasses> = {
  gray: {
    text: 'text-gray-500 dark:text-gray-400',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    drop: 'border-gray-300 bg-gray-50 dark:bg-gray-800/30',
    swatch: 'bg-gray-400',
  },
  lipu: {
    text: 'text-lipu-500 dark:text-lipu-600',
    badge: 'bg-lipu-600/20 text-lipu-500 dark:bg-lipu-600/10 dark:text-lipu-600',
    drop: 'border-lipu-500/40 bg-lipu-600/5 dark:bg-lipu-600/10',
    swatch: 'bg-lipu-500',
  },
  sky: {
    text: 'text-sky-600 dark:text-sky-400',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    drop: 'border-sky-300 bg-sky-50 dark:bg-sky-900/20',
    swatch: 'bg-sky-500',
  },
  teal: {
    text: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    drop: 'border-teal-300 bg-teal-50 dark:bg-teal-900/20',
    swatch: 'bg-teal-500',
  },
  green: {
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    drop: 'border-green-300 bg-green-50 dark:bg-green-900/20',
    swatch: 'bg-green-500',
  },
  yellow: {
    text: 'text-yellow-600 dark:text-yellow-400',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    drop: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
    swatch: 'bg-yellow-400',
  },
  orange: {
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    drop: 'border-orange-300 bg-orange-50 dark:bg-orange-900/20',
    swatch: 'bg-orange-500',
  },
  red: {
    text: 'text-red-500 dark:text-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    drop: 'border-red-300 bg-red-50 dark:bg-red-900/20',
    swatch: 'bg-red-500',
  },
  rose: {
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    drop: 'border-rose-300 bg-rose-50 dark:bg-rose-900/20',
    swatch: 'bg-rose-500',
  },
  purple: {
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    drop: 'border-purple-300 bg-purple-50 dark:bg-purple-900/20',
    swatch: 'bg-purple-500',
  },
  indigo: {
    text: 'text-indigo-600 dark:text-indigo-400',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    drop: 'border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20',
    swatch: 'bg-indigo-500',
  },
}

export const COLOR_TOKEN_KEYS = Object.keys(COLOR_TOKENS)

/** Clases para un token; cae a gris si el token no existe. */
export function colorClasses(token: string | undefined): ColorClasses {
  return COLOR_TOKENS[token ?? 'gray'] ?? COLOR_TOKENS.gray
}
