import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const ReportTable = ({
  columns = [],
  data = [],
  initialPageSize = 10,
  searchPlaceholder = 'Search records...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(
        val => val !== null && val !== undefined && String(val).toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={13} style={{ opacity: 0.4 }} />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={13} color="var(--accent-blue)" /> : <ArrowDown size={13} color="var(--accent-blue)" />;
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
      {/* Search & Meta Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '36px' }}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="input-field"
            style={{ width: '80px', padding: '6px 8px' }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>of <strong>{sortedData.length}</strong> records</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{ cursor: col.sortable !== false ? 'pointer' : 'default' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{col.label}</span>
                    {col.sortable !== false && getSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No matching business records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr key={row.id || row.transaction_id || row.customer_id || rIdx}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] !== null && row[col.key] !== undefined ? String(row[col.key]) : '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.80rem' }}
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.80rem' }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportTable;
