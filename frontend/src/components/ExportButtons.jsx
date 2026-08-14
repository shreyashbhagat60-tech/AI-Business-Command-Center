import React, { useState } from 'react';
import { Download, FileText, Table as TableIcon, Printer, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ExportButtons = ({
  data = [],
  fileName = 'Business_Report',
  title = 'AI Business Intelligence Report',
  columns = []
}) => {
  const [downloading, setDownloading] = useState(null);

  // 1. Export as CSV
  const handleExportCSV = () => {
    if (!data || data.length === 0) return;
    setDownloading('csv');
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('CSV export failed:', e);
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  // 2. Export as Excel (XLSX)
  const handleExportExcel = () => {
    if (!data || data.length === 0) return;
    setDownloading('excel');
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report Data');
      XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (e) {
      console.error('Excel export failed:', e);
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  // 3. Export as PDF
  const handleExportPDF = () => {
    if (!data || data.length === 0) return;
    setDownloading('pdf');
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text(title, 14, 18);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated on: ${new Date().toLocaleString()} | AI Business Command Center`, 14, 25);

      const tableCols = columns.length > 0
        ? columns.map(c => c.label)
        : Object.keys(data[0] || {});

      const tableRows = data.slice(0, 40).map(row => {
        if (columns.length > 0) {
          return columns.map(c => row[c.key] !== undefined ? String(row[c.key]) : '');
        }
        return Object.values(row).map(v => String(v));
      });

      autoTable(doc, {
        head: [tableCols],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255] }
      });

      doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <button
        onClick={handleExportCSV}
        disabled={data.length === 0 || downloading !== null}
        className="btn-secondary"
        style={{ padding: '7px 12px', fontSize: '0.80rem' }}
        title="Download CSV"
      >
        {downloading === 'csv' ? <Check size={14} color="#10b981" /> : <Download size={14} />}
        <span>CSV</span>
      </button>

      <button
        onClick={handleExportExcel}
        disabled={data.length === 0 || downloading !== null}
        className="btn-secondary"
        style={{ padding: '7px 12px', fontSize: '0.80rem' }}
        title="Download Excel Workbook"
      >
        {downloading === 'excel' ? <Check size={14} color="#10b981" /> : <TableIcon size={14} />}
        <span>Excel</span>
      </button>

      <button
        onClick={handleExportPDF}
        disabled={data.length === 0 || downloading !== null}
        className="btn-secondary"
        style={{ padding: '7px 12px', fontSize: '0.80rem' }}
        title="Download Formatted PDF"
      >
        {downloading === 'pdf' ? <Check size={14} color="#10b981" /> : <FileText size={14} />}
        <span>PDF</span>
      </button>
    </div>
  );
};

export default ExportButtons;
