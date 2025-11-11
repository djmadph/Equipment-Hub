
import React from 'react';
import { LogEntry } from '../types';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../index';

interface LogTableProps {
    logs: LogEntry[];
    isAdminLoggedIn: boolean;
    fetchLogs: () => void;
}

const LogTable: React.FC<LogTableProps> = ({ logs, isAdminLoggedIn, fetchLogs }) => {

    const handleStatusChange = async (id: string, newStatus: 'PENDING' | 'BORROWED' | 'RETURNED') => {
        try {
            const docRef = doc(db, 'logs', id);
            const entry = logs.find(log => log.id === id);
            if (!entry) return;

            const updateData: { status: string; clearedBy?: string } = { status: newStatus };
            if (entry.status === 'PENDING' && newStatus === 'BORROWED') {
                updateData.clearedBy = 'Kurt C.';
            }

            await updateDoc(docRef, updateData);
            fetchLogs();
        } catch (error) {
            console.error("Error updating status: ", error);
            alert("Failed to update status. Please try again.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this log entry? This cannot be undone.')) {
            try {
                const docRef = doc(db, 'logs', id);
                await deleteDoc(docRef);
                fetchLogs();
            } catch (error) {
                console.error("Error deleting log: ", error);
                alert("Failed to delete log. Please try again.");
            }
        }
    };
    
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'RETURNED': return 'bg-status-returned-bg text-status-returned-text';
            case 'BORROWED': return 'bg-status-borrowed-bg text-status-borrowed-text';
            case 'PENDING':
            default: return 'bg-status-pending-bg text-status-pending-text';
        }
    };
    
    return (
        <div className="overflow-x-auto border border-brand-border rounded-lg bg-brand-row">
            <table className="w-full border-collapse min-w-[1200px]">
                <thead className="bg-brand-header">
                    <tr>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Requestor</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Item</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Purpose</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Borrow Date</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Return Date</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Status</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Cleared By</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="text-center p-8 text-brand-text-light">
                                No log entries found.
                            </td>
                        </tr>
                    ) : (
                        logs.map((entry) => (
                            <tr key={entry.id} className="hover:bg-brand-header border-b border-brand-border last:border-b-0">
                                <td className="p-4 whitespace-nowrap">{entry.requestor}</td>
                                <td className="p-4 whitespace-nowrap">{entry.item}</td>
                                <td className="p-4 whitespace-nowrap">{entry.purpose}</td>
                                <td className="p-4 whitespace-nowrap">{entry.borrowDate?.toDate().toLocaleDateString('en-US') || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">{entry.returnDate?.toDate().toLocaleDateString('en-US') || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">
                                    {isAdminLoggedIn ? (
                                        <select
                                            value={entry.status}
                                            onChange={(e) => handleStatusChange(entry.id, e.target.value as any)}
                                            className="bg-brand-header text-brand-text border border-brand-border rounded-md p-1.5 text-xs font-sans"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="BORROWED">BORROWED</option>
                                            <option value="RETURNED">RETURNED</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-block py-1.5 px-3 rounded-full font-semibold text-xs ${getStatusBadgeClass(entry.status)}`}>
                                            {entry.status}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 whitespace-nowrap">{entry.clearedBy}</td>
                                <td className="p-4 whitespace-nowrap">
                                    {isAdminLoggedIn && (
                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            disabled={entry.status === 'BORROWED'}
                                            className="py-1 px-3 text-xs font-semibold rounded-md transition-all border border-brand-danger text-brand-danger hover:bg-brand-danger hover:text-white disabled:border-brand-border disabled:text-brand-text-light disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                                            title={entry.status === 'BORROWED' ? 'Cannot delete a borrowed item.' : ''}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LogTable;
