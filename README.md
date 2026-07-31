# MIND Design System Reporter

Herramienta interna para documentar, rastrear y comparar artifacts de diseño, integrada con el Design System de MIND.

Combina dos superficies en una sola app:

- **Design System Viewer** — visualización interactiva del DS con buscador global y exportación de contexto para Claude Design.
- **Artifact Manager** — ciclo de vida completo de artifacts: crear, versionar, comparar diffs, comentar, filtrar y gestionar en vista lista o kanban.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Base de datos | Supabase (PostgreSQL) |
| Storage | Supabase Storage (imágenes) |
| Iconos | Lucide React + Font Awesome |
| Markdown | react-markdown + remark-gfm |
| Búsqueda local | Fuse.js |
| Temas | next-themes (light / dark) |

---

## Requisitos

- Node.js 18+
- Cuenta de Supabase con un proyecto activo
- Variables de entorno configuradas (ver abajo)

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
```

Ambas se obtienen en **Supabase → Project Settings → API**.

---

## Instalación

```bash
npm install
npm run dev
```

La app corre en `http://localhost:3000`.

---

## Base de datos (Supabase)

Ejecuta estas migraciones en el SQL Editor de tu proyecto Supabase.

### Tabla `artifacts`

```sql
create table if not exists artifacts (
  id           text primary key default gen_random_uuid()::text,
  name         text not null default '',
  module       text not null default '',
  version      text not null default '1.0',
  version_note text not null default '',
  status       text not null default 'borrador',
  description  text not null default '',
  tags         text[] not null default '{}',
  links        text[] not null default '{}',
  code         text not null default '',
  code_url     text not null default '',
  image_urls   text[] not null default '{}',
  date         text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  parent_id    text references artifacts(id) on delete set null
);

-- Deshabilitar RLS para uso interno
alter table artifacts disable row level security;
```

### Tabla `tags`

```sql
create table if not exists tags (
  name text primary key
);

alter table tags disable row level security;
```

### Tabla `comments`

```sql
create table if not exists comments (
  id          text primary key default gen_random_uuid()::text,
  artifact_id text not null references artifacts(id) on delete cascade,
  body        text not null,
  author      text not null default 'Anónimo',
  token       text,
  created_at  timestamptz not null default now()
);

alter table comments disable row level security;
```

### Storage bucket `artifact-images`

En **Supabase → Storage**, crea un bucket público llamado `artifact-images`.

---

## Design System

Los archivos del DS viven en `design-system/` en la raíz del proyecto. El servidor los lee en tiempo de build/render:

```
design-system/
├── README.md          # Overview general
├── foundations.md     # Color, Typography, etc.
├── components.md      # Botones, Cards, Inputs…
├── layout.md
├── motion.md
├── accessibility.md
├── patterns.md
├── writing.md
├── do-dont.md
├── spacing.md
├── states.md
├── icons.md           # Referencia de iconos (solo para exportar)
├── tokens.json        # Design tokens (colores, sombras, tipografía, motion)
├── components.json    # Especificaciones de componentes
└── icons.json         # Catálogo de iconos con metadatos
```

El viewer mapea cada archivo `.md` a una sección de navegación. Para añadir contenido, edita directamente los archivos markdown.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                        # DS Viewer (raíz)
│   ├── artifacts/
│   │   ├── page.tsx                    # Lista de artifacts
│   │   ├── new/page.tsx                # Crear artifact
│   │   ├── [id]/
│   │   │   ├── page.tsx               # Detalle de artifact
│   │   │   ├── edit/page.tsx          # Editar artifact
│   │   │   └── compare/page.tsx       # Comparar con versión anterior
│   │   ├── dashboard/page.tsx         # Métricas y progreso
│   │   └── archive/page.tsx           # Archivo de eliminados
│   └── api/
│       ├── artifacts/
│       │   ├── route.ts               # GET /api/artifacts, POST
│       │   ├── bulk/route.ts          # POST bulk status/tag
│       │   └── [id]/
│       │       ├── route.ts           # GET, PUT, DELETE
│       │       ├── restore/route.ts   # POST restaurar del archivo
│       │       └── comments/
│       │           ├── route.ts       # GET, POST comentarios
│       │           └── [commentId]/route.ts  # DELETE comentario
│       ├── tags/route.ts              # GET, POST tags
│       ├── upload/image/route.ts      # POST subir imagen a Storage
│       └── design-system/download/route.ts   # GET exportar contexto DS
├── components/
│   ├── artifacts/
│   │   ├── artifact-list.tsx          # Lista + kanban + filtros + bulk ops
│   │   ├── artifact-form.tsx          # Formulario crear/editar
│   │   ├── artifact-kanban.tsx        # Vista kanban con drag-and-drop
│   │   ├── artifact-context-button.tsx # Copiar contexto para Claude Design
│   │   ├── artifact-duplicate-button.tsx # Duplicar con versión bump
│   │   ├── artifact-picker.tsx        # Selector de artifact (para parent)
│   │   ├── compare-view.tsx           # Diff visual entre versiones
│   │   ├── comments-section.tsx       # Comentarios con ownership por token
│   │   ├── tag-input.tsx              # Input combobox para tags
│   │   ├── status-badge.tsx           # Badge de estado
│   │   ├── code-section.tsx           # Visualizador de código
│   │   └── image-gallery.tsx          # Galería de imágenes
│   ├── design-system/
│   │   ├── ds-viewer.tsx              # Viewer principal + buscador global
│   │   ├── ds-primitives.tsx          # Primitivas de UI del DS
│   │   └── sections/                  # Secciones vivas del DS
│   │       ├── colors.tsx
│   │       ├── typography.tsx
│   │       ├── shadows.tsx
│   │       ├── buttons.tsx
│   │       ├── badges.tsx
│   │       ├── cards.tsx
│   │       ├── inputs.tsx
│   │       ├── tables.tsx
│   │       ├── empty-states.tsx
│   │       ├── skeletons.tsx
│   │       ├── motion.tsx
│   │       └── icons.tsx
│   └── layout/
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── theme-toggle.tsx
└── lib/
    ├── artifacts.ts    # CRUD Supabase + mapeo row ↔ Artifact
    ├── comments.ts     # CRUD comentarios con verificación de token
    ├── tags.ts         # readTags / ensureTags
    ├── archive.ts      # Lógica de archivo
    ├── types.ts        # Tipos globales (Artifact, ArtifactStatus…)
    ├── modules.ts      # Módulos y grupos del sistema
    ├── supabase.ts     # Cliente Supabase
    └── utils.ts        # cn(), formatDate()
```

---

## Funcionalidades principales

### Artifact Manager

| Feature | Descripción |
|---|---|
| CRUD completo | Crear, editar, duplicar y eliminar artifacts |
| Estados | `borrador → en-revision → aprobado → entregado → deprecado` |
| Tags | Etiquetas persistentes reutilizables con filtro global |
| Versionado | Vinculación parent→child, historial de versiones en detalle |
| Diff de versiones | Comparación visual línea a línea (algoritmo LCS) |
| Comentarios | Sistema con ownership por token de navegador |
| Vista lista | Tabla filtrable con búsqueda fuzzy, paginación y export CSV |
| Vista kanban | Columnas por estado con drag-and-drop nativo (HTML5) |
| Bulk operations | Cambiar estado o agregar tag a múltiples artifacts a la vez |
| Dashboard | Gráficas de distribución por estado, módulo y grupo |
| Archivo | Artifacts eliminados con opción de restaurar |
| Contexto Claude | Copia prompt completo del artifact para Claude Design |

### Design System Viewer

| Feature | Descripción |
|---|---|
| Navegación estructurada | Foundations / Components / Guidelines |
| Secciones vivas | Colors, Typography, Shadows, Buttons, Badges, Cards, Inputs, Tables, Empty States, Skeletons, Motion, Icons |
| Buscador global | Paleta ⌘K que busca en todo el DS (markdown + secciones vivas) |
| Exportar contexto | Selecciona secciones, descarga `.md` o copia al clipboard |
| Estimador de tokens | Calcula tokens aproximados para Claude (`chars / 4`) |
| Tema | Light / dark mode persistente |

---

## Ownership de comentarios

Los comentarios no requieren autenticación. El sistema usa un token UUID generado en el navegador (`localStorage`) que se almacena en la base de datos junto al comentario. El DELETE verifica el token vía header `x-comment-token` — si no coincide, responde 403. El GET nunca expone el token.

Esto significa que el "autor" de un comentario está ligado al navegador que lo creó, no a una identidad persistente.

---

## Scripts

```bash
npm run dev      # Desarrollo local
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # ESLint
```
