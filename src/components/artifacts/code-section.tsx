'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Code2, Monitor, Check, Copy, Download, RefreshCw, Maximize2, Minimize2, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Build the srcdoc HTML injected into the iframe ─────────── */
function buildPreviewHtml(raw: string): string {
  // Embed user code as a JSON string — handles all escaping automatically.
  // Also guard against </script> closing the outer tag mid-attribute.
  const safeCode = JSON.stringify(raw).replace(/<\/script>/gi, '<\\/script>')

  // ── Inner JS that runs inside the iframe ──────────────────────────────
  // Written as a template literal so \\s → \s in output (correct regex chars).
  const script = `
(function () {
  var raw = ${safeCode};

  function showError(msg) {
    var el = document.getElementById('preview-error');
    el.style.display = 'block';
    el.textContent = msg;
    try { window.parent.postMessage({ type: 'preview-error' }, '*'); } catch (_) {}
  }

  window.onerror = function (msg, _src, _line, _col, err) {
    showError('Runtime error:\\n' + (err ? err.stack || err.message : msg));
    return true;
  };

  /* Strip ES module syntax and prepare the code for Babel + global scope */
  function prepare(code) {
    // Remove multi-line and single-line import statements
    code = code.replace(/^\\s*import\\s[\\s\\S]*?from\\s+['"][^'"]+['"]\\s*;?\\s*$/gm, '');
    // Remove bare side-effect imports: import 'foo'
    code = code.replace(/^\\s*import\\s+['"][^'"]+['"]\\s*;?\\s*$/gm, '');
    // Strip "export default" from function/class declarations
    code = code.replace(/\\bexport\\s+default\\s+function\\s+/g, 'function ');
    code = code.replace(/\\bexport\\s+default\\s+class\\s+/g, 'class ');
    // Convert standalone "export default Identifier" → window assignment
    code = code.replace(
      /^\\s*export\\s+default\\s+([A-Za-z_$][A-Za-z0-9_$]*)\\s*;?\\s*$/m,
      'window.__COMP__ = $1;'
    );
    // Strip named export keyword but keep the declaration
    code = code.replace(/^\\s*export\\s+(const|let|var|function|class)\\s+/gm, '$1 ');

    // Preamble: make all common React hooks available as plain identifiers
    var pre = 'var _R=React,' +
      'useState=_R.useState,useEffect=_R.useEffect,useRef=_R.useRef,' +
      'useMemo=_R.useMemo,useCallback=_R.useCallback,useReducer=_R.useReducer,' +
      'useContext=_R.useContext,createContext=_R.createContext,' +
      'memo=_R.memo,forwardRef=_R.forwardRef,Fragment=_R.Fragment,' +
      'cloneElement=_R.cloneElement,isValidElement=_R.isValidElement,' +
      'Children=_R.Children,useLayoutEffect=_R.useLayoutEffect,' +
      'useImperativeHandle=_R.useImperativeHandle,' +
      'useTransition=(_R.useTransition||function(){return[false,function(f){f();}]}),' +
      'useDeferredValue=(_R.useDeferredValue||function(v){return v;});\\n';

    // Suffix: capture whatever was the default export onto window.__COMP__
    var suf = '\\ntry{if(typeof App!=="undefined")window.__COMP__=window.__COMP__||App;}catch(_){}';

    return pre + code + suf;
  }

  document.addEventListener('DOMContentLoaded', function () {
    try {
      var prepared = prepare(raw);

      /* Use Babel programmatically — NOT type="text/babel".
         The react preset only transforms JSX; it does NOT produce import/require.
         With runtime:'classic', JSX becomes React.createElement() using the global React. */
      var result = Babel.transform(prepared, {
        presets: [['react', { runtime: 'classic' }]],
        filename: 'component.jsx'
      });

      /* Inject as a plain <script> — runs in global scope.
         Function declarations become window properties (window.App etc.).
         The suffix we appended also runs here, capturing const components via window.__COMP__. */
      var el = document.createElement('script');
      el.textContent = result.code;
      document.head.appendChild(el);

      var Comp = window.__COMP__ || window.App || null;
      if (!Comp) {
        showError(
          'No se encontró componente para renderizar.\\n' +
          'El archivo debe exportar un componente por defecto: "export default function App() { ... }"'
        );
        return;
      }

      ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Comp));
      try { window.parent.postMessage({ type: 'preview-ready' }, '*'); } catch (_) {}
    } catch (err) {
      showError('Error al procesar:\\n' + (err.stack || err.message));
    }
  });
})();
`

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: Roboto, system-ui, -apple-system, sans-serif; }
  #preview-error {
    display: none; margin: 16px; padding: 14px 16px;
    background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 10px;
    color: #B91C1C; font-family: monospace; font-size: 11px;
    white-space: pre-wrap; line-height: 1.5;
  }
</style>
</head>
<body>
<div id="root"></div>
<div id="preview-error"></div>
<script>${script}</script>
</body>
</html>`
}

/* ── Main component ─────────────────────────────────────────── */
type Tab = 'code' | 'preview'
type PreviewHeight = 400 | 600 | 800

export function CodeSection({ code, filename = 'component.jsx' }: { code: string; filename?: string }) {
  const [tab, setTab] = useState<Tab>('code')
  const [copied, setCopied] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [previewState, setPreviewState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState<PreviewHeight>(600)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const lines = code.split('\n').length
  const html = useMemo(() => buildPreviewHtml(code), [code, previewKey]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Listen for messages from the iframe */
  useEffect(() => {
    if (tab !== 'preview') return
    setPreviewState('loading')

    function handler(e: MessageEvent) {
      if (e.data?.type === 'preview-ready') setPreviewState('ready')
      if (e.data?.type === 'preview-error') setPreviewState('error')
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [tab, previewKey])

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function download() {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function reload() {
    setPreviewKey((k) => k + 1)
    setPreviewState('loading')
  }

  return (
    <div className={cn(
      'bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden transition-all',
      expanded && 'fixed inset-4 z-50 shadow-2xl'
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-200 dark:border-night-801">
        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
          <TabBtn active={tab === 'code'} onClick={() => setTab('code')}>
            <Code2 className="w-3 h-3" />
            Código
          </TabBtn>
          <TabBtn active={tab === 'preview'} onClick={() => setTab('preview')}>
            <Monitor className="w-3 h-3" />
            Vista previa
          </TabBtn>
        </div>

        <div className="flex-1" />

        {/* Code tab actions */}
        {tab === 'code' && (
          <>
            <span className="text-xs text-gray-400">{lines} líneas</span>
            <button
              onClick={download}
              title={`Descargar ${filename}`}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            >
              <Download className="w-3 h-3" />
              Descargar
            </button>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </>
        )}

        {/* Preview tab actions */}
        {tab === 'preview' && (
          <>
            {/* Height selector */}
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 text-[10px] font-mono">
              {([400, 600, 800] as PreviewHeight[]).map((h) => (
                <button
                  key={h}
                  onClick={() => setHeight(h)}
                  className={cn(
                    'px-2 py-1 transition-colors',
                    height === h
                      ? 'bg-lipu-500 text-lipu-text'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801'
                  )}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Status indicator */}
            {previewState === 'loading' && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Cargando…
              </span>
            )}
            {previewState === 'ready' && (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Activo
              </span>
            )}
            {previewState === 'error' && (
              <span className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" />
                Error
              </span>
            )}

            <button
              onClick={reload}
              title="Recargar"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-801 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        <button
          onClick={() => setExpanded((v) => !v)}
          title={expanded ? 'Reducir' : 'Expandir'}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-801 transition-colors"
        >
          {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Code view */}
      {tab === 'code' && (
        <pre className={cn(
          'overflow-auto p-5 text-xs text-gray-100 leading-relaxed bg-gray-900 dark:bg-night-805 font-mono',
          expanded ? 'h-[calc(100%-57px)]' : 'max-h-[560px]'
        )}>
          <code>{code}</code>
        </pre>
      )}

      {/* Preview view */}
      {tab === 'preview' && (
        <div className="relative bg-gray-100 dark:bg-night-804">
          {/* CDN notice */}
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-yellow-50 dark:bg-yellow-900/10 border-b border-yellow-200 dark:border-yellow-800/30">
            <AlertCircle className="w-3 h-3 text-yellow-500 shrink-0" />
            <p className="text-[10px] text-yellow-700 dark:text-yellow-400">
              Requiere conexión a internet (React + Babel desde CDN). Solo funciona con componentes que no importan librerías externas más allá de React.
            </p>
          </div>

          {/* Loading overlay */}
          {previewState === 'loading' && (
            <div
              className="absolute inset-0 top-8 flex flex-col items-center justify-center gap-3 bg-white/80 dark:bg-night-803/80 z-10"
              style={{ height: expanded ? 'calc(100% - 57px - 32px)' : height }}
            >
              <Loader2 className="w-6 h-6 animate-spin text-lipu-500" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cargando React y transpilando JSX…
              </p>
            </div>
          )}

          <iframe
            ref={iframeRef}
            key={previewKey}
            srcDoc={html}
            title="Vista previa del artifact"
            className="w-full bg-white border-0 block"
            style={{ height: expanded ? 'calc(100vh - 57px - 32px - 2rem)' : height }}
            onLoad={() => {
              // Fallback: if no postMessage after 4s, assume ready
              setTimeout(() => setPreviewState((s) => s === 'loading' ? 'ready' : s), 4000)
            }}
          />
        </div>
      )}

      {/* Expanded backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={() => setExpanded(false)}
        />
      )}
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-lipu-500 text-lipu-text'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801 bg-white dark:bg-night-802'
      )}
    >
      {children}
    </button>
  )
}
