import React, { useState, useMemo, useRef, useEffect } from "react";

/* ============================================================
   MIND · Rutas — listado + detalle + configurador de servicios
   DS: Lima #D0DF00 · Roboto tabular-nums · iconos stroke
   ============================================================ */

const C = {
  lima: "#D0DF00", oliva: "#A3B500", danger: "#DC2626", ok: "#22C55E",
  blue: "#3B82F6", blueBg: "#EFF6FF", blueBd: "#BFDBFE",
  offBg: "#F3F4F6", ink: "#1F2937", sub: "#4B5563", sub2: "#6B7280",
  border: "#D1D5DB", borderSoft: "#E5E7EB",
};

const Ic = ({ d, size = 18, sw = 1.8, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const I = {
  menu: <Ic d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>} />,
  gear: <Ic d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>} size={15} />,
  shield: <Ic d={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>} size={15} />,
  globe: <Ic d={<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></>} />,
  bell: <Ic d={<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>} />,
  search: <Ic d={<><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.6" y2="16.6"/></>} size={16} />,
  sliders: <Ic d={<><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>} size={16} />,
  download: <Ic d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} size={16} />,
  upload: <Ic d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>} size={16} />,
  bolt: <Ic d={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>} size={16} />,
  funnel: <Ic d={<polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3"/>} size={13} sw={2} />,
  dots: <Ic d={<><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></>} size={18} fill="currentColor" sw={0.5} />,
  plus: <Ic d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} size={16} sw={2.2} />,
  x: <Ic d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} size={18} />,
  chevL: <Ic d={<polyline points="15 18 9 12 15 6"/>} size={16} sw={2} />,
  chevR: <Ic d={<polyline points="9 18 15 12 9 6"/>} size={16} sw={2} />,
  chevD: <Ic d={<polyline points="6 9 12 15 18 9"/>} size={14} sw={2} />,
  arrowL: <Ic d={<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>} size={16} />,
  share: <Ic d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></>} size={15} />,
  power: <Ic d={<><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/><line x1="12" y1="2" x2="12" y2="12"/></>} size={15} />,
  route: <Ic d={<><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h6a3 3 0 0 0 3-3V8"/></>} size={15} />,
  pencil: <Ic d={<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></>} size={15} />,
  head: <Ic d={<><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></>} size={22} />,
  chat: <Ic d={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} size={22} />,
  clock: <Ic d={<><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></>} size={15} />,
  cal: <Ic d={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} size={15} />,
};

/* iconos por módulo */
const MOD = {
  Clientes: <Ic d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} size={18} />,
  Unidades: <Ic d={<><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>} size={18} />,
  Operadores: <Ic d={<><path d="M2 18a10 10 0 0 1 20 0"/><line x1="1" y1="18" x2="23" y2="18"/><path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></>} size={18} />,
  Supervisores: <Ic d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} size={18} />,
  Rutas: <Ic d={<><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.2 6H15M18 8.2V15M8 8l8 8"/></>} size={18} />,
  Ubicaciones: <Ic d={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>} size={18} />,
  Aprobaciones: <Ic d={<><path d="M9 2h6a1 1 0 0 1 1 1v1H8V3a1 1 0 0 1 1-1z"/><rect x="4" y="4" width="16" height="18" rx="2"/><path d="M9 14l2 2 4-4"/></>} size={18} />,
  "Programación Maestra": <Ic d={<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>} size={18} />,
  Viajes: <Ic d={<><polygon points="1 6 8 3 16 6 23 3 23 18 16 21 8 18 1 21 1 6"/><line x1="8" y1="3" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="21"/></>} size={18} />,
  Monitoreo: <Ic d={<><circle cx="12" cy="12" r="9"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="3"/></>} size={18} />,
  Incidencias: <Ic d={<><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} size={18} />,
  Planeación: <Ic d={<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>} size={18} />,
  Guardias: <Ic d={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>} size={18} />,
};

const up = (c = C.ok) => <span style={{ color: c, fontWeight: 600 }}>&#8593;</span>;
const dn = (c = C.danger) => <span style={{ color: c, fontWeight: 600 }}>&#8595;</span>;

/* MOCK */
const CLIENTES = ["Comercio Norte", "Panificadora Centro", "Bebidas del Golfo", "Retail Sur", "Logística MX"];
const INDUSTRIAS = ["Retail", "Alimentos", "Bebidas", "Manufactura", "3PL"];
const PLANTAS = ["Planta A", "CEDIS Norte", "Planta Bajío", "CEDIS Sur"];
const TIPOS = ["Normal", "Variable", "Viaje Autorizado", "Especial", "Adicional"];
const FUENTES = ["TourSolver", "Bustrax", "Manual"];
const NOMBRES = ["NISSAN TIERRA MAYA II", "SAM'S PLAYA DEL CARMEN", "CINÉPOLIS CANCÚN", "COCA-COLA MÉRIDA", "OXXO CHETUMAL", "WALMART TULUM"];

const rutas = Array.from({ length: 1416 }).map((_, i) => {
  const sentido = i % 2 ? "Salida" : "Entrada";
  const activo = i % 100 < 61;
  return {
    id: `R-${1000 + i}`, ruta: `${NOMBRES[i % NOMBRES.length]} ${i + 1}`,
    cliente: CLIENTES[i % CLIENTES.length], industria: INDUSTRIAS[i % INDUSTRIAS.length],
    planta: PLANTAS[i % PLANTAS.length], tipo: TIPOS[i % TIPOS.length],
    estado: activo ? "Activo" : "Inactivo", sentido,
    origen: ["CEDIS Norte", "Terminal Sur", "Base Aeropuerto", "Patio Central"][i % 4],
    destino: ["Zona Hotelera", "Parque Industrial", "Centro", "Puerto"][i % 4],
    distancia: (20 + (i * 7.3) % 90).toFixed(2) + " km",
    viajes: (i * 37) % 900, paradas: 2 + (i % 12), fuente: FUENTES[i % FUENTES.length],
  };
});
const ALL_COLS = [
  { k: "id", label: "ID De Ruta" }, { k: "ruta", label: "Ruta" }, { k: "cliente", label: "Cliente" },
  { k: "industria", label: "Industria" }, { k: "planta", label: "Planta" }, { k: "tipo", label: "Tipo" },
  { k: "estado", label: "Estado" }, { k: "sentido", label: "Sentido" }, { k: "origen", label: "Origen" },
  { k: "destino", label: "Destino" }, { k: "distancia", label: "Distancia" }, { k: "viajes", label: "Viajes" },
  { k: "paradas", label: "Paradas" }, { k: "fuente", label: "Fuente" },
];

/* calendario de excepciones a nivel cliente (fuente única; los servicios lo heredan) */
const FESTIVOS_MX = [
  { nombre: "Día no laboral", inicio: "2026-07-10", fin: "2026-07-10", anual: false },
  { nombre: "Semana Santa", inicio: "2027-03-29", fin: "2027-04-04", anual: true },
  { nombre: "Navidad y Año Nuevo", inicio: "2026-12-24", fin: "2027-01-02", anual: true },
];
const CLIENT_CAL = {
  "Comercio Norte": {
    nombre: "Calendario escolar 2026–2027",
    periodos: [
      { nombre: "Consejo Técnico Escolar", inicio: "2026-07-10", fin: "2026-07-10", anual: false },
      { nombre: "Vacaciones de verano", inicio: "2026-07-15", fin: "2026-08-20", anual: true },
      { nombre: "Semana Santa", inicio: "2027-03-29", fin: "2027-04-04", anual: true },
    ],
  },
};
const clientCal = cliente => CLIENT_CAL[cliente] || { nombre: "Días festivos oficiales", periodos: FESTIVOS_MX };
const dayInPeriod = (d, p) => {
  const md = x => (x.getMonth() + 1) * 100 + x.getDate();
  const s = new Date(p.inicio + "T00:00:00"), e = new Date((p.fin || p.inicio) + "T00:00:00");
  if (p.anual) { const D = md(d), S = md(s), E = md(e); return S <= E ? (D >= S && D <= E) : (D >= S || D <= E); }
  return d >= s && d <= e;
};

/* ============================================================ */
export default function App() {
  const [screen, setScreen] = useState("list"); // list | detail | config
  const [selRuta, setSelRuta] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ fontFamily: "Roboto, system-ui, sans-serif", color: C.ink, background: "#fff", minHeight: "100vh", fontVariantNumeric: "tabular-nums" }}>
      <TopBar onToggle={() => setCollapsed(c => !c)} />
      <div style={{ display: "flex" }}>
        <Sidebar collapsed={collapsed} active={screen === "clientes" ? "Clientes" : "Rutas"}
          onNav={it => { if (it === "Clientes") setScreen("clientes"); else if (it === "Rutas") setScreen("list"); }} />
        <main style={{ flex: 1, minWidth: 0, background: "#FAFAFA", minHeight: "calc(100vh - 64px)" }}>
          {screen === "list" && <RoutesList onOpen={r => { setSelRuta(r); setScreen("detail"); }} />}
          {screen === "detail" && <RouteDetail ruta={selRuta} onBack={() => setScreen("list")} onConfig={() => setScreen("config")} />}
          {screen === "config" && <ConfiguradorServicios ruta={selRuta} onBack={() => setScreen("detail")} />}
          {screen === "clientes" && <ClienteDetail />}
        </main>
      </div>
      <Floaters />
    </div>
  );
}

/* ---------- TOP BAR ---------- */
function TopBar({ onToggle }) {
  const pill = (icon, label, active) => (
    <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, border: "none",
      background: active ? C.offBg : "transparent", color: active ? C.ink : C.sub2, fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer" }}>
      {icon}{label}
    </button>
  );
  return (
    <header style={{ height: 64, background: "#fff", borderBottom: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center",
      padding: "0 18px", gap: 14, position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 800, letterSpacing: 2, fontSize: 16, lineHeight: 1 }}>TRAXION</div>
          <div style={{ fontSize: 6.5, letterSpacing: 1.5, color: C.sub2, fontWeight: 600 }}>VIDA EN MOVIMIENTO</div>
        </div>
        <svg width="26" height="22" viewBox="0 0 26 22">
          <line x1="8" y1="11" x2="18" y2="5" stroke={C.lima} strokeWidth="1.5"/><line x1="8" y1="11" x2="18" y2="17" stroke={C.lima} strokeWidth="1.5"/><line x1="8" y1="11" x2="22" y2="11" stroke={C.lima} strokeWidth="1.5"/>
          <circle cx="7" cy="11" r="3.5" fill={C.lima}/><circle cx="19" cy="5" r="2.5" fill={C.lima}/><circle cx="19" cy="17" r="2.5" fill={C.lima}/><circle cx="23" cy="11" r="2" fill={C.lima}/>
        </svg>
      </div>
      <button onClick={onToggle} style={{ background: "none", border: "none", color: C.sub, cursor: "pointer", padding: 6 }}>{I.menu}</button>
      <div style={{ width: 1, height: 30, background: C.borderSoft, margin: "0 4px" }} />
      <div style={{ display: "flex", gap: 4 }}>
        {pill(I.gear, "Operación", true)}
        {pill(I.shield, "Administración", false)}
      </div>
      <div style={{ flex: 1 }} />
      <button style={{ background: "none", border: "none", color: C.sub, cursor: "pointer", padding: 6 }}>{I.globe}</button>
      <div style={{ position: "relative" }}>
        <button style={{ background: "none", border: "none", color: C.sub, cursor: "pointer", padding: 6 }}>{I.bell}</button>
        <span style={{ position: "absolute", top: 0, right: 0, background: C.danger, color: "#fff", fontSize: 10, fontWeight: 700,
          borderRadius: 10, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>9</span>
      </div>
      <button style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "6px 4px" }}>
        <span style={{ width: 9, height: 9, borderRadius: 8, background: C.ok }} />
        <span style={{ color: C.oliva, fontWeight: 700, fontSize: 13 }}>LIPU CANCÚN</span>
        <span style={{ color: C.sub2 }}>{I.chevD}</span>
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 34, height: 34, borderRadius: 20, background: C.lima, color: C.ink, display: "flex",
          alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>S</div>
        <span style={{ color: C.sub2 }}>{I.chevD}</span>
      </div>
    </header>
  );
}

/* ---------- SIDEBAR ---------- */
function Sidebar({ collapsed, active: activeItem = "Rutas", onNav }) {
  const [open, setOpen] = useState({ Gestión: true, Operación: true });
  const groups = {
    Gestión: ["Clientes", "Unidades", "Operadores", "Supervisores", "Rutas", "Ubicaciones", "Aprobaciones"],
    Operación: ["Programación Maestra", "Viajes", "Monitoreo", "Incidencias", "Planeación", "Guardias"],
  };
  return (
    <aside style={{ width: collapsed ? 64 : 240, background: "#fff", borderRight: `1px solid ${C.borderSoft}`, padding: collapsed ? "12px 6px" : "16px 8px",
      height: "calc(100vh - 64px)", position: "sticky", top: 64, overflowY: "auto", overflowX: "hidden", flexShrink: 0, transition: "width .18s ease" }}>
      {Object.entries(groups).map(([g, items]) => (
        <div key={g} style={{ marginBottom: 10 }}>
          {!collapsed && (
            <button onClick={() => setOpen(o => ({ ...o, [g]: !o[g] }))}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px",
                background: "none", border: "none", cursor: "pointer", color: C.ink, fontSize: 13, fontWeight: 700 }}>
              {g}<span style={{ transform: open[g] ? "none" : "rotate(-90deg)", transition: ".15s", color: C.sub2 }}>{I.chevD}</span>
            </button>
          )}
          {(collapsed || open[g]) && items.map(it => {
            const active = it === activeItem;
            return (
              <div key={it} style={{ position: "relative" }} title={collapsed ? it : undefined}>
                {active && <span style={{ position: "absolute", left: 0, top: 6, bottom: 6, width: 3, background: C.lima, borderRadius: 3 }} />}
                <button onClick={() => onNav && onNav(it)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: collapsed ? 0 : 12,
                  justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "11px 0" : "10px 14px",
                  background: active ? C.offBg : "transparent", border: "none", borderRadius: 8, cursor: "pointer",
                  color: active ? C.ink : C.sub, fontSize: 13, fontWeight: active ? 600 : 400, minHeight: 40 }}>
                  <span style={{ color: active ? C.oliva : C.sub2, display: "flex" }}>{MOD[it] || I.route}</span>
                  {!collapsed && it}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

function Floaters() {
  const b = icon => (
    <button style={{ width: 52, height: 52, borderRadius: 30, background: C.lima, color: C.ink, border: "none", cursor: "pointer",
      boxShadow: "0 4px 14px rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</button>
  );
  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, display: "flex", flexDirection: "column", gap: 12, zIndex: 30 }}>
      {b(I.head)}{b(I.chat)}
    </div>
  );
}

/* ---------- BOTONES ---------- */
const Btn = ({ kind = "outline", children, icon, onClick, style }) => {
  const map = {
    primary: { background: C.lima, color: C.ink, border: `1px solid ${C.lima}` },
    danger: { background: C.danger, color: "#fff", border: `1px solid ${C.danger}` },
    outline: { background: "#fff", color: C.sub, border: `1px solid ${C.border}` },
  };
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 8,
      fontSize: 12.5, fontWeight: 600, cursor: "pointer", minHeight: 38, whiteSpace: "nowrap", ...map[kind], ...style }}>
      {icon}{children}
    </button>
  );
};

/* custom lima checkbox */
const Check = ({ checked }) => (
  <span style={{ width: 20, height: 20, borderRadius: 5, background: checked ? C.lima : "#fff",
    border: `1.5px solid ${checked ? C.lima : C.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}>
    {checked && <Ic d={<polyline points="20 6 9 17 4 12"/>} size={13} sw={3} />}
  </span>
);

/* tooltip propio (no nativo) */
function InfoTip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ width: 16, height: 16, borderRadius: 10, border: `1.5px solid ${C.sub2}`, color: C.sub2, fontSize: 10.5, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "help", fontStyle: "italic" }}>i</span>
      {show && <span style={{ position: "absolute", left: 24, top: -6, width: 260, background: C.ink, color: "#fff", fontSize: 11.5, lineHeight: 1.45, padding: "9px 11px", borderRadius: 8, zIndex: 50, boxShadow: "0 6px 20px rgba(0,0,0,.28)", fontWeight: 400 }}>{text}</span>}
    </span>
  );
}

/* toggle switch lima */
const Toggle = ({ on, onClick }) => (
  <button onClick={onClick} style={{ width: 44, height: 24, borderRadius: 14, border: "none", cursor: "pointer",
    background: on ? C.lima : C.border, position: "relative", flexShrink: 0, transition: ".15s" }}>
    <span style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: 12, background: "#fff", transition: ".15s", boxShadow: "0 1px 2px rgba(0,0,0,.3)" }} />
  </button>
);

/* radio lima */
const Radio = ({ on }) => (
  <span style={{ width: 18, height: 18, borderRadius: 12, border: `1.5px solid ${on ? C.oliva : C.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {on && <span style={{ width: 9, height: 9, borderRadius: 6, background: C.oliva }} />}
  </span>
);

/* campos de periodo compartidos (Configurador + modal masivo) */
const perInputBase = { width: "100%", padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12.5, outline: "none", boxSizing: "border-box", background: "#fff", color: C.ink };
function PeriodoNombre({ style, ...props }) {
  return <input placeholder="Nombre del periodo" {...props} style={{ ...perInputBase, ...style }} />;
}
const navSm = { width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer", color: C.sub, display: "flex", alignItems: "center", justifyContent: "center" };
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const TODAY = new Date(2026, 6, 10);
const isoDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseISO = v => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? (([y, m, d]) => new Date(y, m - 1, d))(v.split("-").map(Number)) : null);
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function PeriodoFecha({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const sel = parseISO(value);
  const [view, setView] = useState(sel || TODAY);
  const y = view.getFullYear(), m = view.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const dim = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(new Date(y, m, d));
  const pick = d => { onChange({ target: { value: isoDate(d) } }); setOpen(false); };
  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(o => !o)} style={{ ...perInputBase, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", overflow: "hidden",
        border: `1px solid ${open ? C.lima : C.border}`, boxShadow: open ? "0 0 0 3px rgba(208,223,0,.25)" : "none", color: value ? C.ink : C.sub2 }}>
        <span style={{ color: C.sub2, display: "flex", flexShrink: 0 }}>{I.cal}</span>{value || "YYYY-MM-DD"}
      </div>
      {open && (<>
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 90 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, maxWidth: "calc(100vw - 24px)", maxHeight: "90vh", overflowY: "auto", background: "#fff", border: `1px solid ${C.borderSoft}`, borderRadius: 12, boxShadow: "0 16px 50px rgba(0,0,0,.28)", zIndex: 91, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button onClick={() => setView(new Date(y, m - 1, 1))} style={navSm}>{I.chevL}</button>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{MESES[m]} de {y}</span>
            <button onClick={() => setView(new Date(y, m + 1, 1))} style={navSm}>{I.chevR}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
            {WDAYS.map(w => <div key={w} style={{ textAlign: "center", fontSize: 11, color: C.sub2, fontWeight: 600, padding: "4px 0" }}>{w}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
            {cells.map((d, i) => d === null ? <div key={i} /> : (
              <button key={i} onClick={() => pick(d)} style={{ height: 36, borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13,
                fontWeight: sameDay(d, sel) ? 700 : 500, background: sameDay(d, sel) ? "#2563EB" : "transparent", color: sameDay(d, sel) ? "#fff" : C.ink,
                boxShadow: !sameDay(d, sel) && sameDay(d, TODAY) ? `inset 0 0 0 1px ${C.border}` : "none" }}
                onMouseEnter={e => { if (!sameDay(d, sel)) e.currentTarget.style.background = C.offBg; }}
                onMouseLeave={e => { if (!sameDay(d, sel)) e.currentTarget.style.background = "transparent"; }}>{d.getDate()}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => { onChange({ target: { value: "" } }); setOpen(false); }} style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.sub }}>Limpiar</button>
            <button onClick={() => pick(TODAY)} style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", background: C.lima, cursor: "pointer", fontSize: 13, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{I.cal} Hoy</button>
          </div>
        </div>
      </>)}
    </div>
  );
}

/* barra de scroll horizontal lima (arriba de la tabla, con chevrons) */
const scrollChev = { width: 22, height: 22, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: C.oliva, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
function HScroll({ children }) {
  const scRef = useRef(null);
  const [thumb, setThumb] = useState({ w: 100, l: 0 });
  const update = () => {
    const el = scRef.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const w = Math.max((el.clientWidth / el.scrollWidth) * 100, 6);
    const l = max > 0 ? (el.scrollLeft / max) * (100 - w) : 0;
    setThumb({ w, l });
  };
  useEffect(() => {
    update();
    const el = scRef.current; if (!el) return;
    el.addEventListener("scroll", update); window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const nudge = d => { if (scRef.current) scRef.current.scrollBy({ left: d * 320, behavior: "smooth" }); };
  const startDrag = e => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect(), el = scRef.current;
    const move = ev => { const pct = Math.min(Math.max((ev.clientX - rect.left) / rect.width, 0), 1); el.scrollLeft = pct * (el.scrollWidth - el.clientWidth); };
    move(e);
    const end = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", end); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", end);
  };
  return (
    <div>
      <style>{`.mind-hscroll::-webkit-scrollbar{display:none}`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px 6px" }}>
        <button onClick={() => nudge(-1)} style={scrollChev}>{I.chevL}</button>
        <div onMouseDown={startDrag} style={{ position: "relative", flex: 1, height: 8, background: "#EEF1DC", borderRadius: 6, cursor: "pointer" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${thumb.l}%`, width: `${thumb.w}%`, background: C.lima, borderRadius: 6 }} />
        </div>
        <button onClick={() => nudge(1)} style={scrollChev}>{I.chevR}</button>
      </div>
      <div ref={scRef} className="mind-hscroll" style={{ overflowX: "auto", scrollbarWidth: "none" }}>{children}</div>
    </div>
  );
}

/* fila de periodo: inicia con una sola fecha (día único); "+ Fecha fin" revela el rango */
function PeriodoRow({ p, onChange, onRemove }) {
  const [showFin, setShowFin] = useState(!!p.fin);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.3fr 1.3fr auto", gap: 10, alignItems: "start", marginBottom: 10 }}>
      <PeriodoNombre value={p.nombre} onChange={e => onChange({ nombre: e.target.value })} placeholder="Ej. Vacaciones de verano" />
      <PeriodoFecha value={p.inicio} onChange={e => onChange({ inicio: e.target.value })} />
      {showFin ? (
        <div>
          <PeriodoFecha value={p.fin} onChange={e => onChange({ fin: e.target.value })} />
          <button onClick={() => { setShowFin(false); onChange({ fin: "" }); }} style={{ background: "none", border: "none", color: C.ink, fontSize: 11, fontWeight: 600, cursor: "pointer", padding: "5px 0 0" }}>Quitar fecha fin</button>
        </div>
      ) : (
        <button onClick={() => setShowFin(true)} style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#fff", border: `1px dashed ${C.border}`, color: C.sub, fontSize: 12.5, fontWeight: 600, cursor: "pointer", padding: "9px 12px", borderRadius: 8 }}>{I.plus} Fecha fin</button>
      )}
      {onRemove
        ? <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub2, padding: 4, marginTop: 8 }}>{I.x}</button>
        : <span />}
    </div>
  );
}

/* ============================================================ PANTALLA 1 — LISTADO */
function RoutesList({ onOpen }) {
  const [visCols, setVisCols] = useState(ALL_COLS.map(c => c.k));
  const [showCols, setShowCols] = useState(false);
  const [q, setQ] = useState(""); const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null); const [sel, setSel] = useState(new Set());
  const [rpp, setRpp] = useState(50); const [page, setPage] = useState(1);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkPeriodos, setBulkPeriodos] = useState([{ id: 1, nombre: "", inicio: "", fin: "" }]);
  const [confirmMsg, setConfirmMsg] = useState(null);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return rutas.filter(r => {
      if (ql && !`${r.ruta} ${r.cliente} ${r.id}`.toLowerCase().includes(ql)) return false;
      for (const [k, v] of Object.entries(filters)) if (v && !String(r[k]).toLowerCase().includes(v.toLowerCase())) return false;
      return true;
    });
  }, [q, filters]);
  const total = filtered.length, pages = Math.max(1, Math.ceil(total / rpp)), pg = Math.min(page, pages);
  const rows = filtered.slice((pg - 1) * rpp, pg * rpp);
  const cols = ALL_COLS.filter(c => visCols.includes(c.k));
  const toggleSel = id => setSel(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allOnPage = rows.length > 0 && rows.every(r => sel.has(r.id));
  const selectedRutas = rutas.filter(r => sel.has(r.id));
  const bulkClients = [...new Set(selectedRutas.map(r => r.cliente))];
  const bInput = { width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" };
  const bulkValidos = bulkPeriodos.filter(p => p.nombre && p.inicio);
  const applyBulk = () => {
    setConfirmMsg(`${bulkValidos.length} periodo(s) aplicado(s) a ${sel.size} ruta(s).`);
    setShowBulk(false); setSel(new Set()); setBulkPeriodos([{ id: Date.now(), nombre: "", inicio: "", fin: "" }]);
    setTimeout(() => setConfirmMsg(null), 7000);
  };
  const bulkReady = bulkValidos.length > 0;
  const lbl = { fontSize: 12.5, fontWeight: 700, color: C.ink, display: "block", marginBottom: 6 };

  return (
    <div>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.borderSoft}`, padding: "18px 24px", display: "flex", alignItems: "center" }}>
        <h1 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>Rutas</h1><div style={{ flex: 1 }} />
        <Btn kind="primary" icon={I.plus}>Agregar</Btn>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
        <Kpi label="Operación" big="1416 Rutas" a={<>Activo 857 {up()}</>} b={<>Inactivo 559 {dn("#2563EB")}</>} />
        <Kpi label="Operación" big="835 Servicios" a={<>Entrada 473 {dn("#2563EB")}</>} b={<>Salida 362 {up()}</>} />
        <Kpi label="Operación" big="65663 Viajes" a={<>Este mes 4 210 {up()}</>} b={<>Cancelados 118 {dn()}</>} />
      </div>
      {confirmMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#F0FDF4", border: `1px solid #BBF7D0`, borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#166534" }}>
          <span style={{ color: "#16A34A" }}><Ic d={<polyline points="20 6 9 17 4 12"/>} size={16} sw={2.5} /></span>{confirmMsg}
        </div>)}
      <div style={{ background: "#fff", border: `1px solid ${C.borderSoft}`, borderRadius: 8 }}>
        <div style={{ display: "flex", alignItems: "center", padding: 16, gap: 12, borderBottom: `1px solid ${C.borderSoft}` }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Lista de rutas</h2><div style={{ flex: 1 }} />
          {sel.size > 1 && (<>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 8px 8px 12px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
              {sel.size} rutas seleccionadas
              <button onClick={() => setSel(new Set())} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub2, display: "flex", padding: 0 }}><Ic d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} size={15} /></button>
            </div>
            <Btn icon={I.cal} onClick={() => setShowBulk(true)}>Aplicar periodos no laborales</Btn>
          </>)}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: 10, color: C.sub2 }}>{I.search}</span>
            <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="Buscar"
              style={{ padding: "9px 12px 9px 32px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, width: 200, outline: "none" }} />
          </div>
          <Btn icon={I.sliders} onClick={() => setShowCols(true)}>Columnas</Btn>
          <Btn icon={I.download}>Exportar</Btn>
        </div>
        <HScroll>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 1200, fontSize: 13, whiteSpace: "nowrap" }}>
            <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <th style={th(48)}><span style={{ cursor: "pointer", display: "inline-flex" }} onClick={() =>
                setSel(s => { const n = new Set(s); allOnPage ? rows.forEach(r => n.delete(r.id)) : rows.forEach(r => n.add(r.id)); return n; })}><Check checked={allOnPage} /></span></th>
              {cols.map(c => (
                <th key={c.k} style={th()}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{c.label}</span>
                    <button onClick={() => setOpenFilter(openFilter === c.k ? null : c.k)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: filters[c.k] ? C.oliva : C.border }}>{I.funnel}</button>
                  </div>
                  {openFilter === c.k && (
                    <div style={{ position: "absolute", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, marginTop: 6, boxShadow: "0 6px 20px rgba(0,0,0,.12)", zIndex: 20 }}>
                      <input autoFocus placeholder={`Filtrar ${c.label}`} defaultValue={filters[c.k] || ""}
                        onChange={e => { setFilters(f => ({ ...f, [c.k]: e.target.value })); setPage(1); }}
                        style={{ padding: "7px 9px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, width: 150, outline: "none" }} />
                    </div>)}
                </th>))}
              <th style={th(44)} />
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} onClick={() => onOpen(r)} style={{ borderBottom: `1px solid ${C.borderSoft}`, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <td style={td} onClick={e => { e.stopPropagation(); toggleSel(r.id); }}><span style={{ cursor: "pointer", display: "inline-flex" }}><Check checked={sel.has(r.id)} /></span></td>
                  {cols.map(c => (
                    <td key={c.k} style={{ ...td, fontWeight: c.k === "ruta" ? 600 : 400 }}>
                      {c.k === "estado"
                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 8, background: r.estado === "Activo" ? C.ok : C.danger }} />{r.estado}</span>
                        : String(r[c.k])}
                    </td>))}
                  <td style={td} onClick={e => e.stopPropagation()}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: C.sub2, padding: 4 }}>{I.dots}</button></td>
                </tr>))}
            </tbody>
          </table>
        </HScroll>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: C.sub2 }}>{total === 0 ? "0" : `${(pg - 1) * rpp + 1}-${Math.min(pg * rpp, total)}`} de {total} Elementos</span>
          <div style={{ flex: 1 }} />
          <label style={{ fontSize: 12, color: C.sub2, display: "flex", alignItems: "center", gap: 6 }}>Filas por página
            <select value={rpp} onChange={e => { setRpp(+e.target.value); setPage(1); }} style={{ padding: "5px 8px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12 }}>
              {[25, 50, 100].map(n => <option key={n}>{n}</option>)}</select></label>
          <Pagination page={pg} pages={pages} onPage={setPage} />
        </div>
      </div>
      {showCols && <CustomizeCols vis={visCols} setVis={setVisCols} onClose={() => setShowCols(false)} />}
      {showBulk && (
        <Overlay onClose={() => setShowBulk(false)} width={720}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Aplicar periodos no laborales</h3><div style={{ flex: 1 }} />
            <button onClick={() => setShowBulk(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub2 }}>{I.x}</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.3fr 1.3fr auto", gap: 10, marginBottom: 8 }}>
              <div style={lbl}>Nombre del periodo</div>
              <div style={lbl}>Fecha inicio</div>
              <div style={lbl}>Fecha fin <span style={{ fontWeight: 400, color: C.sub2 }}>(opcional)</span></div>
              <div />
            </div>
            {bulkPeriodos.map(p => (
              <PeriodoRow key={p.id} p={p}
                onChange={patch => setBulkPeriodos(ps => ps.map(x => x.id === p.id ? { ...x, ...patch } : x))}
                onRemove={bulkPeriodos.length > 1 ? () => setBulkPeriodos(ps => ps.filter(x => x.id !== p.id)) : undefined} />
            ))}
            <button onClick={() => setBulkPeriodos(ps => [...ps, { id: Date.now(), nombre: "", inicio: "", fin: "" }])}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: `1px solid ${C.border}`, color: C.sub, fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 4, padding: "8px 14px", borderRadius: 8 }}>{I.plus} Agregar periodo</button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn onClick={() => setShowBulk(false)}>Cancelar</Btn>
            <Btn kind="primary" onClick={applyBulk} style={{ opacity: bulkReady ? 1 : 0.5, pointerEvents: bulkReady ? "auto" : "none" }}>Aplicar</Btn>
          </div>
        </Overlay>)}
      </div>
    </div>
  );
}
const th = w => ({ textAlign: "left", padding: "12px 14px", position: "relative", width: w, background: "#fff" });
const td = { padding: "11px 14px", color: C.ink };

function Kpi({ label, big, a, b }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.borderSoft}`, borderRadius: 8, padding: 20 }}>
      <div style={{ fontSize: 11, color: C.sub2, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 21, fontWeight: 700, marginBottom: 10 }}>{big}</div>
      <div style={{ display: "flex", gap: 18, fontSize: 13, color: C.sub }}><span>{a}</span><span>{b}</span></div>
    </div>
  );
}
function Pagination({ page, pages, onPage }) {
  const nums = [];
  if (pages <= 7) for (let i = 1; i <= pages; i++) nums.push(i);
  else { nums.push(1); if (page > 4) nums.push("…"); for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i); if (page < pages - 3) nums.push("…"); nums.push(pages); }
  const cell = a => ({ minWidth: 30, height: 30, borderRadius: 6, border: a ? "none" : `1px solid ${C.border}`, background: a ? C.lima : "#fff", color: a ? C.ink : C.sub, fontWeight: a ? 700 : 500, cursor: "pointer", fontSize: 13 });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <button style={cell(false)} onClick={() => onPage(Math.max(1, page - 1))}>{I.chevL}</button>
      {nums.map((n, i) => n === "…" ? <span key={i} style={{ color: C.sub2, padding: "0 4px" }}>…</span> : <button key={i} style={cell(n === page)} onClick={() => onPage(n)}>{n}</button>)}
      <button style={cell(false)} onClick={() => onPage(Math.min(pages, page + 1))}>{I.chevR}</button>
    </div>
  );
}
function CustomizeCols({ vis, setVis, onClose }) {
  const [local, setLocal] = useState(new Set(vis));
  const toggle = k => setLocal(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Personalizar columnas</h3><div style={{ flex: 1 }} />
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub2 }}>{I.x}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
        {ALL_COLS.map(c => (
          <label key={c.k} onClick={() => toggle(c.k)} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <Check checked={local.has(c.k)} />{c.label}</label>))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn kind="primary" onClick={() => { setVis(ALL_COLS.map(c => c.k).filter(k => local.has(k))); onClose(); }}>Aplicar</Btn></div>
    </Overlay>
  );
}
function Overlay({ children, onClose, width = 560 }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: 24, width, maxWidth: "100%", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>{children}</div>
    </div>
  );
}

/* ============================================================ PANTALLA 2 — DETALLE (ancho completo) */
function RouteDetail({ ruta, onBack, onConfig }) {
  const [tab, setTab] = useState("servicios");
  const tabs = [["generales", "Datos generales"], ["paradas", "Paradas"], ["servicios", "Servicios"], ["requisitos", "Requisitos"], ["bitacora", "Bitácora"]];
  return (
    <div>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.borderSoft}`, padding: "18px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, color: C.ink }}>
          <span onClick={onBack} style={{ cursor: "pointer", color: C.ink, fontWeight: 600 }}>Rutas</span>
          <span style={{ margin: "0 6px", color: C.sub2 }}>›</span>
          <span style={{ color: C.ink, fontWeight: 700 }}>{ruta.ruta.length > 26 ? ruta.ruta.slice(0, 26) + "…" : ruta.ruta}</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "nowrap", justifyContent: "flex-end", alignItems: "center" }}>
          <Btn icon={I.share}>Compartir ruta</Btn>
          <Btn icon={I.download}>Descargar ruta</Btn>
          <Btn kind="danger" icon={I.power}>Desactivar ruta</Btn>
          <Btn kind="primary" icon={I.plus} onClick={onConfig}>Agregar servicio</Btn>
          <Btn icon={I.route}>Calibrar desde Traffilog</Btn>
        </div>
      </div>
      <div style={{ padding: 24 }}>
      <div style={{ background: "#fff", border: `1px solid ${C.borderSoft}`, borderRadius: 8 }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.borderSoft}`, padding: "0 16px", overflowX: "auto" }}>
          {tabs.map(([k, label]) => {
            const dis = k !== "servicios";
            const active = tab === k;
            return (
              <button key={k} disabled={dis} onClick={() => !dis && setTab(k)} style={{ padding: "13px 16px", background: "none", border: "none", cursor: dis ? "not-allowed" : "pointer",
                fontSize: 13.5, whiteSpace: "nowrap", fontWeight: active ? 700 : 500, color: dis ? "#C4C8CE" : active ? C.oliva : C.sub2,
                borderBottom: active ? `2px solid ${C.lima}` : "2px solid transparent", marginBottom: -1 }}>{label}</button>);
          })}
        </div>
        <div style={{ padding: 24 }}>
          {tab === "generales" && <TabGenerales ruta={ruta} />}
          {tab === "paradas" && <TabParadas ruta={ruta} />}
          {tab === "servicios" && <TabServicios onConfig={onConfig} cliente={ruta.cliente} />}
          {tab === "requisitos" && <TabRequisitos />}
          {tab === "bitacora" && <TabBitacora />}
        </div>
      </div>
      </div>
    </div>
  );
}

function SchematicMap({ height = 300, stops = 5, legend = true }) {
  const pts = Array.from({ length: stops }).map((_, i) => { const t = i / (stops - 1); return { x: 60 + t * 460, y: 150 + Math.sin(t * Math.PI * 1.4) * 70 }; });
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  return (
    <div style={{ position: "relative", border: `1px solid ${C.borderSoft}`, borderRadius: 8, overflow: "hidden", background: "#F8FAF7" }}>
      <svg viewBox="0 0 580 300" style={{ width: "100%", height }}>
        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#E9EDE3" strokeWidth="1" /></pattern></defs>
        <rect width="580" height="300" fill="url(#grid)" />
        <path d={path} fill="none" stroke={C.lima} strokeWidth="4" strokeLinecap="round" />
        {pts.map((p, i) => {
          if (i === 0) return <g key={i}><circle cx={p.x} cy={p.y} r="9" fill="#111" /><circle cx={p.x} cy={p.y} r="4" fill="#fff" /></g>;
          if (i === pts.length - 1) return <g key={i} transform={`translate(${p.x},${p.y})`}><path d="M0,-16 C8,-16 12,-10 12,-4 C12,4 0,14 0,14 C0,14 -12,4 -12,-4 C-12,-10 -8,-16 0,-16Z" fill="#2563EB" /><circle cy="-4" r="4" fill="#fff" /></g>;
          return <g key={i}><circle cx={p.x} cy={p.y} r="12" fill={C.blue} /><text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">{i}</text></g>;
        })}
      </svg>
      <div style={{ position: "absolute", top: 10, right: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        {["+", "−"].map(s => <button key={s} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 600 }}>{s}</button>)}
      </div>
      {legend && <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(255,255,255,.92)", border: `1px solid ${C.borderSoft}`, borderRadius: 6, padding: "6px 10px", fontSize: 11, color: C.sub, display: "flex", gap: 14 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 16, height: 3, background: C.lima }} />Ruta guardada</span></div>}
    </div>
  );
}
function TabGenerales({ ruta }) {
  const field = (label, val, sel) => (
    <div><label style={{ fontSize: 12, color: C.sub2, display: "block", marginBottom: 5 }}>{label}</label>
      <div style={{ padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.offBg, color: C.sub, fontSize: 13, display: "flex", justifyContent: "space-between" }}>{val}{sel && I.chevD}</div></div>);
  return (
    <div><SchematicMap height={300} stops={ruta.paradas > 6 ? 6 : ruta.paradas} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
        {field("Ruta ID", ruta.id)}{field("Nombre de ruta", ruta.ruta)}{field("Tipo de ruta", ruta.tipo, true)}{field("Sentido", ruta.sentido, true)}</div>
    </div>
  );
}
function TabParadas({ ruta }) {
  const n = ruta.paradas > 8 ? 8 : ruta.paradas;
  const stops = Array.from({ length: n }).map((_, i) => ({ n: i + 1, t: `${String(6 + i).padStart(2, "0")}:${["00", "15", "30", "45"][i % 4]}`, name: i === 0 ? ruta.origen : i === n - 1 ? ruta.destino : `Parada ${i}` }));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}><Btn icon={I.pencil}>Solicitar edición de paradas</Btn></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ borderBottom: `1px solid ${C.border}`, color: C.sub2, fontSize: 11, textTransform: "uppercase" }}>
              <th style={{ textAlign: "left", padding: "8px 6px" }}>#</th><th style={{ textAlign: "left", padding: "8px 6px" }}>Tiempo</th><th style={{ textAlign: "left", padding: "8px 6px" }}>Nombre</th></tr></thead>
            <tbody>{stops.map(s => <tr key={s.n} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
              <td style={{ padding: "10px 6px", color: C.sub2 }}>⠿ {s.n}</td><td style={{ padding: "10px 6px" }}>{s.t}</td><td style={{ padding: "10px 6px" }}>{s.name}</td></tr>)}</tbody>
          </table>
          <div style={{ marginTop: 12 }}><Btn kind="primary" icon={I.plus}>Agregar parada</Btn></div>
        </div>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}><Btn icon={I.route}>Calibrar ruta</Btn><Btn icon={I.plus}>Puntos de conformación</Btn></div>
          <SchematicMap height={280} stops={n} legend={false} />
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: C.sub, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 16, height: 3, background: C.lima }} />Ruta guardada</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 16, borderTop: "2px dashed #9CA3AF" }} />Vista previa (OSRM)</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 6, background: "#F97316" }} />Conformación (no es parada)</span></div>
        </div>
      </div>
    </div>
  );
}

/* ---- SERVICIOS: calendario semanal LUN–DOM, bloques azules ---- */
function TabServicios({ onConfig, cliente }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [rowH, setRowH] = useState(48);
  const scrollRef = useRef(null);
  const days = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
  const base = new Date(2026, 6, 6 + weekOffset * 7);
  const dates = days.map((_, i) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
  const fmt = d => `${d.getDate()} ${["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"][d.getMonth()]}`;
  const today = new Date(2026, 6, 10);
  const isToday = d => d.toDateString() === today.toDateString();
  const cal = clientCal(cliente);
  const [noLab, setNoLab] = useState(false);
  const [heredar, setHeredar] = useState(true);
  const [ownPeriodos, setOwnPeriodos] = useState([]);
  const [omit, setOmit] = useState(new Set());
  const toggleOmit = n => setOmit(s => { const x = new Set(s); x.has(n) ? x.delete(n) : x.add(n); return x; });
  const activePeriodos = noLab ? [...(heredar ? cal.periodos.filter(p => !omit.has(p.nombre)) : []), ...ownPeriodos.filter(p => p.inicio)] : [];
  const offDay = d => activePeriodos.find(p => dayInPeriod(d, p));
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 10.5 * rowH; }, [rowH]);

  // servicio recurrente en los 7 días (imita imagen)
  const svc = { start: 11 + 45 / 60, end: 13 + 30 / 60, label: "Turno 1", range: "11:45 - 13:30", tag: "ENTRADA" };

  return (
    <div>
      {/* Periodos no laborales (colapsable, arriba del calendario) */}
      <div style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 10, padding: 18, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <Toggle on={noLab} onClick={() => setNoLab(v => !v)} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Periodos no laborales</span>
            <InfoTip text="Rangos en los que el servicio se inactiva automáticamente (p. ej. vacaciones de verano o Semana Santa en clientes escolares). No borra el servicio: lo pausa en el calendario y se reactiva al terminar el periodo." />
          </div>
        </div>
        {noLab && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <label onClick={() => setHeredar(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}><Check checked={heredar} /> Heredar del cliente</label>
            </div>
            {heredar && (
              <div style={{ background: "#FAFAFA", border: `1px solid ${C.borderSoft}`, borderRadius: 8, padding: "4px 12px", marginBottom: 18 }}>
                {cal.periodos.map((p, i) => {
                  const on = !omit.has(p.nombre);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < cal.periodos.length - 1 ? `1px solid ${C.borderSoft}` : "none", opacity: on ? 1 : 0.5 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1, textDecoration: on ? "none" : "line-through" }}>{p.nombre}</span>
                      <span style={{ fontSize: 12, color: C.sub, textDecoration: on ? "none" : "line-through" }}>{p.inicio}{p.fin && p.fin !== p.inicio ? ` → ${p.fin}` : ""}</span>
                      <Toggle on={on} onClick={() => toggleOmit(p.nombre)} />
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Excepciones propias de este servicio</div>
            {ownPeriodos.map(p => (
              <PeriodoRow key={p.id} p={p}
                onChange={patch => setOwnPeriodos(ps => ps.map(x => x.id === p.id ? { ...x, ...patch } : x))}
                onRemove={() => setOwnPeriodos(ps => ps.filter(x => x.id !== p.id))} />
            ))}
            <button onClick={() => setOwnPeriodos(ps => [...ps, { id: Date.now(), nombre: "", inicio: "", fin: "" }])}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: `1px solid ${C.border}`, color: C.sub, fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 4, padding: "8px 14px", borderRadius: 8 }}>{I.plus} Agregar periodo</button>
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Calendario de servicios</h3><div style={{ flex: 1 }} />
        <button onClick={() => setWeekOffset(w => w - 1)} style={navBtn}>{I.chevL}</button>
        <span style={{ fontSize: 13, fontWeight: 600, minWidth: 150, textAlign: "center" }}>{fmt(dates[0])} — {fmt(dates[6])} {base.getFullYear()}</span>
        <button onClick={() => setWeekOffset(w => w + 1)} style={navBtn}>{I.chevR}</button>
        <select value={rowH} onChange={e => setRowH(+e.target.value)} style={{ padding: "8px 10px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12.5, marginLeft: 8 }}>
          {[24, 48, 72].map(h => <option key={h} value={h}>{h}px</option>)}</select>
      </div>
      <div style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "70px repeat(7,1fr)", borderBottom: `1px solid ${C.border}`, background: "#fff" }}>
          <div style={{ padding: "12px 8px", fontSize: 11, color: C.sub2, fontWeight: 700 }}>HORA</div>
          {days.map((d, i) => {
            const off = offDay(dates[i]);
            return (
              <div key={d} style={{ padding: "12px 6px", textAlign: "center", borderLeft: `1px solid ${C.borderSoft}`, background: off ? C.offBg : "#fff" }}>
                <div style={{ fontSize: 11, color: C.sub2, fontWeight: 700 }}>{d}</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: 14, alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, background: isToday(dates[i]) ? C.lima : "transparent", color: off && !isToday(dates[i]) ? C.sub2 : C.ink }}>{dates[i].getDate()}</span></div>
                {off && <div title={off.nombre} style={{ fontSize: 9.5, color: C.sub2, fontWeight: 600, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>No laboral</div>}
              </div>);
          })}
        </div>
        <div ref={scrollRef} style={{ maxHeight: 420, overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "70px repeat(7,1fr)" }}>
            <div>{Array.from({ length: 24 }).map((_, h) => (
              <div key={h} style={{ height: rowH, fontSize: 11, color: C.sub2, padding: "2px 8px", borderBottom: `1px solid ${C.borderSoft}` }}>{String(h).padStart(2, "0")}:00</div>))}</div>
            {days.map((_, di) => {
              const off = offDay(dates[di]);
              return (
                <div key={di} style={{ position: "relative", borderLeft: `1px solid ${C.borderSoft}` }}>
                  {Array.from({ length: 24 }).map((_, h) => <div key={h} style={{ height: rowH, borderBottom: `1px solid ${C.borderSoft}`, background: off ? "rgba(0,0,0,.035)" : isToday(dates[di]) ? "rgba(208,223,0,.05)" : "#fff" }} />)}
                  <div onClick={off ? undefined : onConfig} title={off ? off.nombre : "Abrir configurador"}
                    style={{ position: "absolute", top: svc.start * rowH + 2, left: 4, right: 4, height: (svc.end - svc.start) * rowH - 4,
                      background: C.blueBg, border: `1px solid ${C.blueBd}`, borderRadius: 6, padding: "6px 8px", cursor: off ? "default" : "pointer", overflow: "hidden",
                      borderTop: isToday(dates[di]) ? `3px solid ${C.lima}` : `1px solid ${C.blueBd}`,
                      opacity: off ? 0.4 : 1, filter: off ? "grayscale(1)" : "none" }}>
                    <div style={{ fontSize: 12, lineHeight: 1.3, color: C.ink }}><b>{svc.label}</b>, {svc.range}</div>
                    <div style={{ fontSize: 11, color: C.sub, marginTop: 2, fontWeight: 600 }}>{svc.tag}</div>
                    {off && <div style={{ fontSize: 10, color: C.sub2, fontWeight: 700, marginTop: 2 }}>Pausado · no laboral</div>}
                  </div>
                </div>);
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, fontSize: 11.5, color: C.sub, marginTop: 10, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 3, background: C.blueBg, border: `1px solid ${C.blueBd}` }} />Servicio programado</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 3, background: C.offBg, border: `1px solid ${C.border}` }} />Periodo no laboral (heredado del cliente)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 14, background: C.lima }} />Hoy</span>
      </div>
    </div>
  );
}
const navBtn = { width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer", color: C.sub, display: "flex", alignItems: "center", justifyContent: "center" };

function TabRequisitos() {
  const Section = ({ title, items }) => {
    const [chips, setChips] = useState(items);
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{title}</h3><div style={{ flex: 1 }} /><Btn icon={I.plus}>Agregar personalizada</Btn></div>
        <p style={{ fontSize: 12, color: C.sub2, margin: "0 0 10px" }}>Requisitos que no están en el catálogo estándar de la unidad de negocio.</p>
        <div style={{ padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.sub, display: "flex", justifyContent: "space-between", marginBottom: 10 }}>{chips.length} características seleccionadas {I.chevD}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{chips.map(c => (
          <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.offBg, borderRadius: 16, padding: "6px 12px", fontSize: 12.5 }}>{c}
            <button onClick={() => setChips(x => x.filter(y => y !== c))} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub2, display: "flex", padding: 0 }}>{I.x}</button></span>))}</div>
      </div>
    );
  };
  return (<div>
    <Section title="Requisitos de Unidad" items={["Aire acondicionado", "GPS", "Asientos ejecutivos", "Cinturones de seguridad", "Extintor", "Botiquín de primeros auxilios"]} />
    <Section title="Requisitos de Operador" items={["Licencia Federal", "Uniforme", "Capacitación periódica obligatoria", "Examen toxicológico", "Examen psicométrico"]} /></div>);
}
function TabBitacora() {
  const events = Array.from({ length: 10 }).map((_, i) => ({
    title: ["Unidad reasignada (programación maestra)", "Parada agregada", "Requisito de operador actualizado", "Ruta recalibrada", "Servicio creado"][i % 5],
    date: `2026-07-0${9 - (i % 9)} · 1${i % 6}:0${i % 6} · P. Álvarez`,
    change: [`Unidad: U-204 → U-311`, `Parada: — → Terminal Sur`, `Examen: opcional → obligatorio`, `Distancia: 71.20 KM → 73.03 KM`, `Estado: borrador → publicado`][i % 5],
  }));
  return (
    <div>
      <div style={{ position: "relative", paddingLeft: 24 }}>
        <div style={{ position: "absolute", left: 5, top: 4, bottom: 4, width: 2, background: C.borderSoft }} />
        {events.map((e, i) => (
          <div key={i} style={{ position: "relative", paddingBottom: 20 }}>
            <span style={{ position: "absolute", left: -23, top: 4, width: 10, height: 10, borderRadius: 6, background: C.lima, border: "2px solid #fff", boxShadow: `0 0 0 1px ${C.border}` }} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{e.title}</div><div style={{ fontSize: 12, color: C.sub2 }}>{e.date}</div></div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>{e.change}</div></div>))}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 12, borderTop: `1px solid ${C.borderSoft}`, paddingTop: 12 }}>
        <span style={{ fontSize: 12, color: C.sub2 }}>1-10 de 33 elementos</span><div style={{ flex: 1 }} /><Pagination page={1} pages={4} onPage={() => {}} /></div>
    </div>
  );
}

/* ============================================================ PANTALLA 3 — CONFIGURADOR DE SERVICIOS */
/* ============================================================ PANTALLA — CLIENTE (detalle) */
function ClienteDetail() {
  const [ctab, setCtab] = useState("requisitos");
  const [seg, setSeg] = useState("unidades");
  const [col, setCol] = useState(false);
  const [checked, setChecked] = useState(new Set());
  const [periodosCliente, setPeriodosCliente] = useState([
    { id: 1, nombre: "Vacaciones de verano", inicio: "2026-07-15", fin: "2026-08-20" },
    { id: 2, nombre: "Semana Santa", inicio: "2027-03-29", fin: "2027-04-04" },
  ]);
  const tabs = [["info", "Información"], ["plantas", "Plantas"], ["requisitos", "Requisitos del servicio"], ["periodos", "Periodos no laborales"], ["docs", "Documentos"]];
  const feats = seg === "unidades"
    ? ["Aire acondicionado", "GPS", "CCTV (cámaras interiores)", "Cinturones de seguridad", "Extintor", "Botiquín de primeros auxilios", "Asientos ejecutivos"]
    : ["Licencia Federal", "Uniforme", "Capacitación periódica obligatoria", "Examen toxicológico", "Examen psicométrico"];
  const toggle = f => setChecked(s => { const n = new Set(s); n.has(f) ? n.delete(f) : n.add(f); return n; });
  const disGhost = { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 8, fontSize: 13.5, fontWeight: 600, background: "#fff", border: `1px solid ${C.borderSoft}`, color: "#C4C8CE", cursor: "not-allowed", minHeight: 42 };
  const trash = <Ic d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>} size={15} />;
  const userCircle = <Ic d={<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>} size={26} />;

  return (
    <div>
      {/* header band */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.borderSoft}`, padding: "18px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13 }}>
          <span style={{ color: C.ink, fontWeight: 600 }}>Clientes</span>
          <span style={{ margin: "0 6px", color: C.sub2 }}>›</span>
          <span style={{ color: C.ink, fontWeight: 700 }}>RED AMBIENTAL</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button disabled style={disGhost}>{I.power} Desactivar</button>
          <button disabled style={disGhost}>{trash} Eliminar</button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {/* client card */}
        <div style={{ background: "#fff", border: `1px solid ${C.borderSoft}`, borderRadius: 10, padding: 24, display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 32, background: C.offBg, display: "flex", alignItems: "center", justifyContent: "center", color: C.sub }}>{userCircle}</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>RED AMBIENTAL</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.sub, marginTop: 3 }}>
              <span style={{ width: 8, height: 8, borderRadius: 8, background: C.ok }} />Activo</div>
          </div>
          <div style={{ flex: 1 }} />
          {[["RFC", "RRE9712222V9"], ["Industria", "Ambiental"], ["UDN", "LIPU Cancun"]].map(([l, v]) => (
            <div key={l} style={{ textAlign: "center", minWidth: 120 }}>
              <div style={{ fontSize: 11, color: C.sub2, letterSpacing: 0.4, marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* tabs card */}
        <div style={{ background: "#fff", border: `1px solid ${C.borderSoft}`, borderRadius: 8 }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${C.borderSoft}`, padding: "0 16px", overflowX: "auto" }}>
            {tabs.map(([k, label]) => (
              <button key={k} onClick={() => setCtab(k)} style={{ padding: "13px 16px", background: "none", border: "none", cursor: "pointer",
                fontSize: 13.5, whiteSpace: "nowrap", fontWeight: ctab === k ? 700 : 500, color: ctab === k ? C.oliva : C.sub2,
                borderBottom: ctab === k ? `2px solid ${C.lima}` : "2px solid transparent", marginBottom: -1 }}>{label}</button>))}
          </div>
          <div style={{ padding: 24 }}>
            {ctab === "periodos" ? (
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Periodos no laborales del cliente</div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.3fr 1.3fr auto", gap: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>Nombre del periodo</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>Fecha inicio</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>Fecha fin <span style={{ fontWeight: 400, color: C.sub2 }}>(opcional)</span></div>
                  <div />
                </div>
                {periodosCliente.length === 0 && <div style={{ fontSize: 12.5, color: C.sub2, padding: "2px 0 12px" }}>Aún no hay periodos configurados.</div>}
                {periodosCliente.map(p => (
                  <PeriodoRow key={p.id} p={p}
                    onChange={patch => setPeriodosCliente(ps => ps.map(x => x.id === p.id ? { ...x, ...patch } : x))}
                    onRemove={() => setPeriodosCliente(ps => ps.filter(x => x.id !== p.id))} />
                ))}
                <button onClick={() => setPeriodosCliente(ps => [...ps, { id: Date.now(), nombre: "", inicio: "", fin: "", unico: false }])}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: `1px solid ${C.border}`, color: C.sub, fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 4, padding: "8px 14px", borderRadius: 8 }}>{I.plus} Agregar periodo</button>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.borderSoft}` }}>
                  <Btn kind="primary">Guardar</Btn>
                </div>
              </div>
            ) : ctab !== "requisitos"
              ? <div style={{ padding: "40px 0", textAlign: "center", color: C.sub2, fontSize: 13 }}>Sección en construcción.</div>
              : (<>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "inline-flex", background: C.offBg, borderRadius: 10, padding: 4, gap: 4 }}>
                    {[["unidades", "Unidades"], ["operadores", "Operadores"]].map(([s, t]) => (
                      <button key={s} onClick={() => setSeg(s)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13.5,
                        fontWeight: 600, background: seg === s ? "#fff" : "transparent", color: seg === s ? C.ink : C.sub2, boxShadow: seg === s ? "0 1px 2px rgba(0,0,0,.12)" : "none" }}>{t}</button>))}
                  </div>
                  <div style={{ flex: 1 }} />
                  <Btn kind="primary" style={{ opacity: 0.55, pointerEvents: "none" }}>Guardar</Btn>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.sub2, textTransform: "uppercase", letterSpacing: 0.5 }}>Requisitos para {seg === "unidades" ? "unidades" : "operadores"}</span>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => setCol(c => !c)} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub, transform: col ? "rotate(-90deg)" : "none" }}>{I.chevD}</button>
                </div>

                {!col && (<>
                  {seg === "unidades" && (
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 14, fontWeight: 700, display: "block", marginBottom: 8 }}>Capacidad mínima (asientos)</label>
                      <input style={{ width: "100%", maxWidth: 400, padding: "11px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    </div>)}

                  <div style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", background: "#FAFAFA", borderBottom: `1px solid ${C.border}`, padding: "12px 16px" }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>Característica</span><div style={{ flex: 1 }} />
                      <span style={{ fontSize: 13, fontWeight: 700 }}>Sí / No</span>
                    </div>
                    {feats.map((f, i) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: i < feats.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                        <span style={{ fontSize: 13.5 }}>{f}</span><div style={{ flex: 1 }} />
                        <span onClick={() => toggle(f)} style={{ cursor: "pointer", display: "inline-flex" }}><Check checked={checked.has(f)} /></span>
                      </div>))}
                  </div>
                </>)}
              </>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ PANTALLA 3 — CONFIGURADOR DE SERVICIOS */
function ConfiguradorServicios({ ruta, onBack }) {
  const [openSvc, setOpenSvc] = useState(true);
  const [openVar, setOpenVar] = useState(true);
  const [indef, setIndef] = useState(true);
  const [fInicio, setFInicio] = useState("2026-07-09");
  const [fFin, setFFin] = useState("");
  const [dias, setDias] = useState(new Set(["L", "M", "X", "J", "V", "S", "D"]));
  const [semanas, setSemanas] = useState(new Set([1, 2, 3, 4]));
  const nombre = ruta?.ruta || "NISSAN TIERRA MAYA II";

  const toggle = (set, val, setter) => { const n = new Set(set); n.has(val) ? n.delete(val) : n.add(val); setter(n); };
  const circle = (label, on, onClick) => (
    <button onClick={onClick} style={{ width: 38, height: 38, borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
      background: on ? C.lima : C.offBg, color: on ? C.ink : C.sub2 }}>{label}</button>);
  const Field = ({ label, children }) => (
    <div><label style={{ fontSize: 13, fontWeight: 700, color: C.ink, display: "block", marginBottom: 7 }}>{label}</label>{children}</div>);
  const input = { width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" };
  const selectRow = (val, dis) => (
    <div style={{ ...input, background: dis ? C.offBg : "#fff", color: dis ? C.sub2 : C.ink, display: "flex", justifyContent: "space-between", alignItems: "center" }}>{val}{!dis && I.chevD}</div>);
  const timeBox = v => (
    <div style={{ ...input, display: "flex", justifyContent: "space-between", alignItems: "center", color: C.ink }}>{v}<span style={{ color: C.sub2 }}>{I.clock}</span></div>);

  return (
    <div style={{ padding: "24px 28px" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 18 }}>{I.arrowL} Volver a {nombre}</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>Configurador de Servicios — {nombre}</h1><div style={{ flex: 1 }} />
        <Btn icon={I.upload}>Cargar por CSV</Btn><Btn icon={I.bolt}>Múltiples servicios</Btn><Btn kind="primary" icon={I.plus}>Nuevo servicio</Btn>
      </div>

      {/* Servicio 01 */}
      <div style={{ background: "#fff", border: `1px solid ${C.borderSoft}`, borderRadius: 10, padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: openSvc ? 24 : 0 }}>
          <button onClick={() => setOpenSvc(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub, transform: openSvc ? "none" : "rotate(-90deg)" }}>{I.chevD}</button>
          <span style={{ fontSize: 13, color: C.sub2, fontWeight: 700 }}>01</span>
          <span style={{ fontSize: 16, fontWeight: 700 }}>ENTRADA</span><div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: C.sub2, background: C.offBg, padding: "4px 10px", borderRadius: 6 }}>1v · LMXJVSD</span>
        </div>
        {openSvc && <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
            <Field label="Nombre del servicio"><input defaultValue="ENTRADA" style={input} /></Field>
            <Field label="Fecha inicio"><PeriodoFecha value={fInicio} onChange={e => setFInicio(e.target.value)} /></Field>
            <div>
              <Field label="Fecha fin">{indef
                ? <div style={{ ...input, background: C.offBg, color: C.sub2, display: "flex", justifyContent: "space-between" }}>YYYY-MM-DD <span>{I.cal}</span></div>
                : <PeriodoFecha value={fFin} onChange={e => setFFin(e.target.value)} />}</Field>
              <label onClick={() => setIndef(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, cursor: "pointer", fontSize: 13 }}><Check checked={indef} /> Fecha indefinida</label>
              <p style={{ fontSize: 12, color: C.sub2, margin: "6px 0 0" }}>Vigencia del servicio en catálogo. Es distinta a la vigencia del horario de cada variante.</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
            <Field label="Estado">{selectRow("Activo")}</Field>
            <Field label="Notas"><input placeholder="Ej. Indicaciones para logística/facturación..." style={{ ...input, color: C.sub2 }} /></Field>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Variantes de días</h3>
          <div style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: openVar ? 20 : 0 }}>
              <button onClick={() => setOpenVar(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub, transform: openVar ? "none" : "rotate(-90deg)" }}>{I.chevD}</button>
              <span style={{ width: 9, height: 9, borderRadius: 6, background: C.blue }} />
              <input defaultValue="Variante 1" style={{ padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontWeight: 600, width: 280 }} />
              <div style={{ flex: 1 }} />
              <button style={{ background: "#FEF2F2", border: `1px solid #FECACA`, color: C.danger, borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700 }}>X</button>
            </div>
            {openVar && <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
                <Field label="Turno">{selectRow("1")}</Field>
                <Field label="Horario">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{timeBox("11:45 a. m.")}<span style={{ color: C.sub2 }}>→</span>{timeBox("01:30 p. m.")}</div></Field>
                <Field label="Recorrido">{selectRow("Sencillo")}</Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
                <Field label="Sentido">{selectRow("Entrada", true)}</Field>
                <Field label="Tipo ruta">{selectRow("Normal", true)}</Field>
                <Field label="Estado">{selectRow("Activo")}</Field>
              </div>
              <div style={{ marginBottom: 24, maxWidth: 360 }}><Field label="Ruleta">{selectRow("No")}</Field></div>
              <div style={{ display: "flex", gap: 40, marginBottom: 24, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Días</div>
                  <div style={{ display: "flex", gap: 8 }}>{["L", "M", "X", "J", "V", "S", "D"].map(d => circle(d, dias.has(d), () => toggle(dias, d, setDias)))}</div></div>
                <div><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Semana:</div>
                  <div style={{ display: "flex", gap: 8 }}>{[1, 2, 3, 4].map(s => circle(s, semanas.has(s), () => toggle(semanas, s, setSemanas)))}</div></div>
              </div>
              <div style={{ background: "#FAFAFA", border: `1px solid ${C.borderSoft}`, borderRadius: 10, padding: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Historial de configuración del horario</div>
                <p style={{ fontSize: 12.5, color: C.sub2, margin: "4px 0 14px" }}>Cambios de programación (días, semanas, horario) y la fecha en que aplican en el calendario.</p>
                <div style={{ background: "#fff", border: `1px solid ${C.borderSoft}`, borderRadius: 8, padding: 14, position: "relative", paddingLeft: 26 }}>
                  <span style={{ position: "absolute", left: 12, top: 18, width: 9, height: 9, borderRadius: 6, background: C.lima }} />
                  <div style={{ fontSize: 13, fontWeight: 600 }}>En vigor desde el 2026-07-09</div>
                  <div style={{ fontSize: 13, color: C.sub, margin: "4px 0" }}>Semanas 1, 2, 3, 4 · Días L, M, X, J, V, S, D · 11:45–13:30 · Turno 1</div>
                  <div style={{ fontSize: 13, color: C.sub2 }}>• Configuración inicial</div>
                </div>
              </div>
            </>}
          </div>

          <div style={{ marginTop: 16, border: `1px solid ${C.borderSoft}`, borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <span style={{ transform: "rotate(-90deg)", color: C.sub }}>{I.chevD}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Paradas y horarios</span>
            <span style={{ fontSize: 13, color: C.sub2 }}>· 13 paradas heredadas</span>
          </div>
        </>}
      </div>
    </div>
  );
}
