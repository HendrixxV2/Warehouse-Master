import { Pencil, Trash2 } from 'lucide-react';

export default function DataTable({
  columns, rows, loading, onEdit, onDelete, emptyLabel = 'Sin registros',
}) {
  return (
    <div className="rounded-2xl border border-line bg-elevated shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-subtle/60 border-b border-line">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`text-left px-4 h-11 text-[11px] font-semibold uppercase tracking-wide text-fg-muted ${c.align === 'right' ? 'text-right' : ''}`}
                >
                  {c.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-right px-4 h-11 text-[11px] font-semibold uppercase tracking-wide text-fg-muted w-24">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-line/60">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3">
                      <div className="h-3 rounded bg-subtle animate-pulse" />
                    </td>
                  ))}
                  <td />
                </tr>
              ))
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-16 text-center text-fg-muted">
                  <p className="text-[13px]">{emptyLabel}</p>
                </td>
              </tr>
            )}

            {!loading && rows.map((row) => (
              <tr key={row.id} className="border-b border-line/60 hover:bg-subtle/40 transition-colors group">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 text-fg ${c.align === 'right' ? 'text-right' : ''} ${c.mono ? 'mono' : ''}`}>
                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="size-7 grid place-items-center rounded-md text-fg-muted hover:bg-subtle hover:text-fg transition focus-ring"
                          title="Editar"
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="size-7 grid place-items-center rounded-md text-fg-muted hover:bg-danger/10 hover:text-danger transition focus-ring"
                          title="Eliminar"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}