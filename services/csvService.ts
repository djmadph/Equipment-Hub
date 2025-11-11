
import { LogEntry } from '../types';

export const exportToCSV = (logs: LogEntry[], filename: string) => {
    const headers = ['Requestor', 'Item', 'Purpose', 'Borrow Date', 'Return Date', 'Status', 'Cleared By'];
    
    const sanitizeCell = (cellData: any): string => {
        if (cellData == null) return '';
        let cell = String(cellData);
        if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
    };

    const csvRows = [headers.join(',')];
    logs.forEach(row => {
        const borrowDateStr = row.borrowDate?.toDate ? row.borrowDate.toDate().toLocaleDateString('en-US') : 'N/A';
        const returnDateStr = row.returnDate?.toDate ? row.returnDate.toDate().toLocaleDateString('en-US') : 'N/A';
        const rowData = [
            row.requestor,
            row.item,
            row.purpose,
            borrowDateStr,
            returnDateStr,
            row.status,
            row.clearedBy
        ].map(sanitizeCell).join(',');
        csvRows.push(rowData);
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const date = new Date();
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${dateString}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
