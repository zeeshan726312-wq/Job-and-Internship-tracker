/**
 * Data Export Utilities for CSV and Printable PDF Reports
 */

export const exportToCSV = (filename, rows) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);

  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printSummaryReport = (title, dataList, columns) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const tableHeaders = columns.map(c => `<th style="padding:10px; border:1px solid #ddd; background:#f4f6f8;">${c.header}</th>`).join('');
  const tableRows = dataList
    .map(item => {
      const cells = columns.map(c => `<td style="padding:8px; border:1px solid #ddd;">${c.accessor(item) || ''}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — TrackerPro Report</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; }
          h1 { color: #059669; font-size: 24px; margin-bottom: 5px; }
          p { color: #64748b; font-size: 12px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { text-align: left; font-weight: bold; }
          .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated on ${new Date().toLocaleString()} by TrackerPro 2.0 Command Hub</p>
        <table>
          <thead><tr>${tableHeaders}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div class="footer">Confidential System Report • Job & Internship Tracker Pro</div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
