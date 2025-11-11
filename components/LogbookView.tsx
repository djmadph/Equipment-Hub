import React, { useState } from 'react';
import { LogEntry, EquipmentItem } from '../types';
import RequestForm from './RequestForm';
import LogTable from './LogTable';
// FIX: Import Timestamp to use it as a type guard for filtering.
import { writeBatch, doc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../index';
import { exportToCSV } from '../services/csvService';

interface LogbookViewProps {
    isAdminLoggedIn: boolean;
    logs: LogEntry[];
    equipment: EquipmentItem[];
    fetchLogs: () => void;
    onLoginClick: () => void;
    onLogoutClick: () => void;
}

const LogbookView: React.FC<LogbookViewProps> = ({ isAdminLoggedIn, logs, equipment, fetchLogs, onLoginClick, onLogoutClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleApproveToday = async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const requestsToApprove = logs.filter(log => {
            if (log.status !== 'PENDING' || !log.borrowDate?.toDate) {
                return false;
            }
            const borrowDate = log.borrowDate.toDate();
            borrowDate.setHours(0, 0, 0, 0);
            return borrowDate.getTime() === today.getTime();
        });

        if (requestsToApprove.length === 0) {
            alert("No pending requests for today to approve.");
            return;
        }

        if (window.confirm(`Are you sure you want to approve ${requestsToApprove.length} request(s) for today?`)) {
            const batch = writeBatch(db);
            requestsToApprove.forEach(log => {
                const docRef = doc(db, 'logs', log.id);
                batch.update(docRef, { status: 'BORROWED', clearedBy: 'Kurt C.' });
            });

            try {
                await batch.commit();
                alert(`${requestsToApprove.length} request(s) have been successfully approved.`);
                fetchLogs();
            } catch (error) {
                console.error("Error batch approving requests: ", error);
                alert("An error occurred while approving requests. Please try again.");
            }
        }
    };

    // FIX: Refactored filtering logic to be type-safe by checking specific properties instead of using Object.values.
    const filteredLogs = logs.filter(entry => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            String(entry.requestor).toLowerCase().includes(searchTermLower) ||
            String(entry.item).toLowerCase().includes(searchTermLower) ||
            String(entry.purpose).toLowerCase().includes(searchTermLower) ||
            String(entry.status).toLowerCase().includes(searchTermLower) ||
            String(entry.clearedBy).toLowerCase().includes(searchTermLower) ||
            (entry.borrowDate instanceof Timestamp && entry.borrowDate.toDate().toLocaleDateString('en-US').toLowerCase().includes(searchTermLower)) ||
            (entry.returnDate instanceof Timestamp && entry.returnDate.toDate().toLocaleDateString('en-US').toLowerCase().includes(searchTermLower))
        );
    });

    return (
        <div>
            <RequestForm equipment={equipment} fetchLogs={fetchLogs} />
            <div className="mb-5 flex justify-between items-center gap-5 flex-wrap">
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search log by requestor, item, purpose..."
                    className="flex-grow min-w-[250px] p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                />
                <div className="flex items-center gap-4">
                    {isAdminLoggedIn && (
                         <button onClick={handleApproveToday} className="px-5 py-3 text-sm font-semibold rounded-lg border border-brand-accent bg-transparent text-brand-accent hover:bg-brand-accent hover:text-white transition-all">
                            Approve Today's Pending
                        </button>
                    )}
                    <button onClick={() => exportToCSV(logs, 'camera-log-export')} className="px-5 py-3 text-sm font-semibold rounded-lg border border-brand-success bg-transparent text-brand-success hover:bg-brand-success hover:text-white transition-all">
                        Export to Excel
                    </button>
                    <div className="flex items-center gap-4">
                        {isAdminLoggedIn ? (
                            <>
                                <span className="text-brand-text-light">Welcome, Kurt C.</span>
                                <button onClick={onLogoutClick} className="px-5 py-3 text-sm font-semibold rounded-lg border border-brand-danger bg-transparent text-brand-danger hover:bg-brand-danger hover:text-white transition-all">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={onLoginClick} className="px-5 py-3 text-sm font-semibold rounded-lg border border-brand-success bg-transparent text-brand-success hover:bg-brand-success hover:text-white transition-all">
                                Admin Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <LogTable logs={filteredLogs} isAdminLoggedIn={isAdminLoggedIn} fetchLogs={fetchLogs} />
        </div>
    );
};

export default LogbookView;