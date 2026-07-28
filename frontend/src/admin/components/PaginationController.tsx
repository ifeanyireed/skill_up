import React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export interface PaginationControllerProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  itemLabel?: string
}

export function PaginationController({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  itemLabel = 'records'
}: PaginationControllerProps) {
  if (totalItems <= 0) return null

  const safeTotalPages = Math.max(1, totalPages)
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages)

  const startIndex = (safeCurrentPage - 1) * pageSize + 1
  const endIndex = Math.min(safeCurrentPage * pageSize, totalItems)

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= safeTotalPages && page !== safeCurrentPage) {
      onPageChange(page)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'var(--adm-surface)',
        padding: '0.75rem 1.25rem',
        borderRadius: 'var(--adm-radius)',
        border: '1px solid var(--adm-border)',
        fontSize: '13px',
        color: 'var(--adm-text-2)'
      }}
    >
      {/* Left side: Item count summary and page size selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div>
          Showing <span style={{ fontWeight: 600, color: 'var(--adm-text-1)' }}>{startIndex}</span> to{' '}
          <span style={{ fontWeight: 600, color: 'var(--adm-text-1)' }}>{endIndex}</span> of{' '}
          <span style={{ fontWeight: 600, color: 'var(--adm-text-1)' }}>{totalItems}</span> {itemLabel}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '12px', color: 'var(--adm-text-3)' }}>Rows per page:</span>
          <select
            className="admin-select"
            style={{ width: 'auto', height: '30px', fontSize: '12px', padding: '0 0.5rem' }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side: Page navigation controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
        {/* First Page */}
        <button
          className="admin-btn admin-btn-ghost admin-btn-sm"
          onClick={() => handlePageClick(1)}
          disabled={safeCurrentPage === 1}
          title="First Page"
          style={{ padding: '0.25rem 0.4rem' }}
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Previous Page */}
        <button
          className="admin-btn admin-btn-ghost admin-btn-sm"
          onClick={() => handlePageClick(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          title="Previous Page"
          style={{ padding: '0.25rem 0.5rem' }}
        >
          <ChevronLeft size={14} /> Previous
        </button>

        {/* Page Numbers */}
        <div style={{ display: 'flex', gap: '0.25rem', padding: '0 0.25rem' }}>
          {Array.from({ length: safeTotalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === safeTotalPages || Math.abs(p - safeCurrentPage) <= 1)
            .map((p, idx, arr) => {
              const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1
              return (
                <React.Fragment key={p}>
                  {showEllipsisBefore && (
                    <span style={{ padding: '0.25rem 0.25rem', color: 'var(--adm-text-3)', fontSize: '12px' }}>...</span>
                  )}
                  <button
                    className={`admin-btn admin-btn-sm ${safeCurrentPage === p ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                    onClick={() => handlePageClick(p)}
                    style={{ minWidth: '28px', height: '28px', padding: '0 0.375rem', justifyContent: 'center' }}
                  >
                    {p}
                  </button>
                </React.Fragment>
              )
            })}
        </div>

        {/* Next Page */}
        <button
          className="admin-btn admin-btn-ghost admin-btn-sm"
          onClick={() => handlePageClick(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          title="Next Page"
          style={{ padding: '0.25rem 0.5rem' }}
        >
          Next <ChevronRight size={14} />
        </button>

        {/* Last Page */}
        <button
          className="admin-btn admin-btn-ghost admin-btn-sm"
          onClick={() => handlePageClick(safeTotalPages)}
          disabled={safeCurrentPage === safeTotalPages}
          title="Last Page"
          style={{ padding: '0.25rem 0.4rem' }}
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  )
}
