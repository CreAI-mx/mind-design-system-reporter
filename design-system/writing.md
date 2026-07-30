# Writing & Microcopy

> Guidelines for labels, button copy, error messages, placeholder text, and empty-state messaging in `console/`. This is an internal operational tool — language should be precise, compact, and action-oriented. The interface is in **Spanish (Mexico)**, and all new UI copy should follow that convention.

---

## Voice & tone

| Principle | What it means in practice |
|---|---|
| **Precise over friendly** | This is an ops tool, not a consumer product. Skip conversational filler. |
| **Compact** | Labels and buttons fit on one line. If a label needs a sentence to make sense, the UI architecture is wrong. |
| **Active voice** | Actions belong to the user, not the system. |
| **No jargon from the system** | Don't expose internal IDs, class names, or error codes to the user. Translate them. |
| **Consistent terminology** | Pick one word and use it everywhere. Don't swap "artifact" / "componente" / "elemento" across screens. |

| ✅ Do | ❌ Don't |
|---|---|
| "Guardar cambios" | "¡Listo para guardar!" |
| "Error al conectar con el servidor" | "Error 503: Service Unavailable" |
| "Contrato" (siempre el mismo término) | "Contrato" en un lugar, "documento" en otro |
| "Eliminar artifact" | "El artifact será eliminado" |

---

## Buttons & CTAs

- **Primary action**: specific verb + noun.
- **Destructive action**: always uses danger variant (red). Copy matches severity — "Eliminar", not "Borrar" for irreversible actions.
- **Cancel**: "Cancelar" always. Not "Cerrar", not "Volver", not "No".
- **Confirm dialogs**: repeat the action verb, not just "Aceptar".
- **Loading state**: disable the button, add spinner, keep the verb in gerund.
- **Secondary/ghost**: noun-only or verb-only is fine at this weight.

| Context | ✅ Do | ❌ Don't |
|---|---|---|
| Create | "Crear contrato" | "Nuevo", "+" |
| Save | "Guardar cambios" | "OK", "Aceptar", "Listo" |
| Destructive confirm | "Eliminar contrato" | "Sí", "Confirmar", "Aceptar" |
| Cancel | "Cancelar" | "Cerrar", "Volver", "No" |
| Loading | "Guardando…" | "Espera…", "Cargando…" |
| Secondary | "Exportar", "Filtros" | "Haz clic aquí para exportar" |
| Approve | "Aprobar solicitud" | "Aprobar" (when noun is ambiguous) |

---

## Labels & field names

- Use sentence case: "Nombre del contrato", not "NOMBRE DEL CONTRATO".
- Omit obvious nouns when context is clear.
- Required fields: mark with `*` on the label. Don't say "requerido" in the placeholder.
- Units belong in the label, not the placeholder.

| ✅ Do | ❌ Don't |
|---|---|
| "Nombre del contrato \*" | "NOMBRE DEL CONTRATO" |
| "Nombre \*" (inside "Nuevo contrato" form) | "Nombre del contrato \*" (redundant with context) |
| "Duración (días)" | placeholder "Ej. 30 días" |
| "Fecha de inicio \*" | "Fecha de inicio (requerido)" |
| "Monto total (MXN)" | "Monto total" + placeholder "$0.00" |

---

## Placeholders

- Describe format or example value, not the field name.
- Avoid "Ingresa…" / "Escribe…" — the fact it's an input is self-evident.
- Search inputs: "Buscar…" with ellipsis. Nothing else.

| Field type | ✅ Do | ❌ Don't |
|---|---|---|
| ID / code | `Ej. CDMX-2026-001` | `Escribe el ID del contrato` |
| Date | `Ej. 15/01/2026` | `Selecciona una fecha` |
| Search | `Buscar…` | `Buscar contratos por nombre o ID…` |
| Name | `Ej. Ruta Norte CDMX` | `Ingresa el nombre` |
| Percentage | `Ej. 85` | `0-100` |

---

## Error messages

| Type | Pattern | ✅ Example | ❌ Don't |
|---|---|---|---|
| Validation — required | "Campo requerido" | "Campo requerido" | "Este campo es obligatorio y no puede estar vacío" |
| Validation — format | "Formato inválido. Ej. [format]" | "Formato inválido. Ej. 2026-01-15" | "El valor ingresado no es válido" |
| Validation — range | "[Value] debe ser entre [min] y [max]" | "El porcentaje debe ser entre 0 y 100" | "Valor fuera de rango" |
| Server — generic | "No se pudo [action]. Intenta de nuevo." | "No se pudo guardar. Intenta de nuevo." | "Error 500", "Algo salió mal" |
| Empty select | "Selecciona una opción" | "Selecciona un módulo" | "Este campo es requerido" |

Never expose raw API error strings, stack traces, or HTTP status codes to the user.

---

## Empty states

Three-part structure: icon → title → description → optional CTA.

| Part | ✅ Do | ❌ Don't |
|---|---|---|
| **Title** | "Sin contratos" | "No encontramos contratos en la base de datos" |
| **Title** | "Sin resultados para 'ruta norte'" | "No hay datos" |
| **Description** | "Crea el primer contrato para comenzar." | "No existen registros en el sistema en este momento." |
| **Description** | _(omit if CTA is self-explanatory)_ | Repeat what the title already says |
| **CTA** | "Crear contrato" (same verb as list header) | "Agregar", "Nuevo elemento" |

---

## Confirmation dialogs

Structure: `¿[Verb] [noun]?` → one-sentence consequence → Cancel + confirm CTA.

```
✅ Correct structure

¿Eliminar contrato?
Esta acción no se puede deshacer. El contrato y sus documentos
serán eliminados permanentemente.

[Cancelar]   [Eliminar contrato]
```

```
❌ Avoid

¿Estás seguro?
¿Deseas continuar?

[No]   [Sí]
```

Rules:
- Title names the action + the object. Never just "¿Estás seguro?".
- Consequence is one sentence. No bullet lists.
- Confirm button repeats the title verb: "Eliminar contrato", not "Confirmar" or "Sí".
- Cancel is always "Cancelar" — never "No", "Regresar", or "Cerrar".

---

## Navigation & section labels

| Context | ✅ Do | ❌ Don't |
|---|---|---|
| Module name | "Contratos", "Rutas", "Aprobaciones" | "Gestión de contratos", "Ver rutas" |
| Section header | "Información general" | "Información General", "INFORMACIÓN GENERAL" |
| Tab label | "Detalles", "Documentos", "Actividad" | "Ver detalles del contrato", "Lista de docs." |
| Table column | "Fecha creación", "Estado" | "Fecha de creación del registro", "Status" |
| Sidebar item | "Bitácora", "Métricas" | "Ver bitácora de actividad" |

---

## Dates & numbers

| Format | ✅ Do | ❌ Don't |
|---|---|---|
| Date display | `15/01/2026` | `01-15-2026`, `Jan 15 2026` |
| Date input | `2026-01-15` (ISO, with visible hint) | `15/01/2026` in a raw input |
| Relative date | "Hace 2 horas", "Ayer" (< 7 days only) | "Hace 5 días" (use absolute instead) |
| Large number | `1,234.56` | `1234.56`, `1.234,56` |
| Percentage | `85%` | `85 %`, `85 pct` |
| Currency | `$1,234.56 MXN` | `$1,234.56`, `MXN 1234.56` |

---

## Status labels

Statuses must be consistent across the app — don't rephrase them per screen.

| Status key | ✅ Display label | ❌ Don't |
|---|---|---|
| `borrador` | Borrador | BORRADOR, Draft, Borrador ✏️ |
| `en-revision` | En revisión | En Revisión, Revisando, Pendiente |
| `aprobado` | Aprobado | APROBADO, Aprobado ✓, Approved |
| `entregado` | Entregado | Completado, Done, Finalizado |
| `deprecado` | Deprecado | Archivado, Inactivo, Obsoleto |

---

## Real copy examples by module

These are the correct terms for the main modules — use them verbatim to avoid terminology drift.

| Module | Object noun | Create CTA | Delete confirm title | Empty title |
|---|---|---|---|---|
| Contratos | contrato | "Crear contrato" | "¿Eliminar contrato?" | "Sin contratos" |
| Rutas | ruta | "Crear ruta" | "¿Eliminar ruta?" | "Sin rutas" |
| Aprobaciones | solicitud | "Enviar solicitud" | "¿Rechazar solicitud?" | "Sin solicitudes" |
| Artifacts | artifact | "Crear artifact" | "¿Eliminar artifact?" | "Sin artifacts" |
| Usuarios | usuario | "Crear usuario" | "¿Eliminar usuario?" | "Sin usuarios" |
