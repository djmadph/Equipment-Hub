
import React from 'react';
import { LogEntry, EquipmentItem } from '../types';
import DashboardMetricCard from './DashboardMetricCard';
import BarChart from './charts/BarChart';
import DonutChart from './charts/DonutChart';
import { CollectionIcon, UsersIcon, ClockIcon, ExclamationIcon } from './Icons';

interface DashboardViewProps {
    logs: LogEntry[];
    equipment: EquipmentItem[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ logs, equipment }) => {

    const totalEquipment = equipment.length;
    const itemsOnLoan = logs.filter(log => log.status === 'BORROWED').length;
    const pendingRequests = logs.filter(log => log.status === 'PENDING').length;
    const overdueItems = logs.filter(log => log.status === 'BORROWED' && log.returnDate && log.returnDate.toDate() < new Date()).length;

    const getMostBorrowedItems = () => {
        if (logs.length === 0) return [];
        // FIX: The generic type argument on `reduce` was causing an "Untyped function call" error.
        // By casting the initial value, we ensure `itemCounts` is correctly typed as `Record<string, number>`,
        // which resolves the subsequent error in the `sort` method.
        const itemCounts = logs.reduce((acc, log) => {
            acc[log.item] = (acc[log.item] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(itemCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([label, value]) => ({ label, value }));
    };
    
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'RETURNED': return 'bg-status-returned-bg text-status-returned-text';
            case 'BORROWED': return 'bg-status-borrowed-bg text-status-borrowed-text';
            case 'PENDING':
            default: return 'bg-status-pending-bg text-status-pending-text';
        }
    };

    const mostBorrowedData = getMostBorrowedItems();
    const equipmentStatusData = [
        { label: 'Available', value: totalEquipment - itemsOnLoan, color: '#2ecc71' },
        { label: 'On Loan', value: itemsOnLoan, color: '#f39c12' },
    ];
    
    const recentLogs = logs.slice(0, 5);

    return (
        <div>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardMetricCard title="Total Equipment" value={totalEquipment} icon={<CollectionIcon />} />
                <DashboardMetricCard title="Items on Loan" value={itemsOnLoan} icon={<UsersIcon />} />
                <DashboardMetricCard title="Pending Requests" value={pendingRequests} icon={<ClockIcon />} />
                <DashboardMetricCard title="Overdue Items" value={overdueItems} icon={<ExclamationIcon />} color="text-brand-danger" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                <div className="lg:col-span-3 bg-brand-row border border-brand-border rounded-lg p-6">
                    <BarChart title="Most Borrowed Items" data={mostBorrowedData} />
                </div>
                <div className="lg:col-span-2 bg-brand-row border border-brand-border rounded-lg p-6">
                    <DonutChart title="Equipment Status" data={equipmentStatusData} />
                </div>
            </div>

             {/* Recent Activity */}
             <div className="bg-brand-row border border-brand-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 mt-0">Recent Activity</h3>
                {recentLogs.length > 0 ? (
                    <ul className="space-y-4">
                        {recentLogs.map(log => (
                            <li key={log.id} className="flex items-center justify-between p-3 bg-brand-header rounded-md">
                                <div>
                                    <p className="font-semibold text-brand-text">{log.requestor} <span className="font-normal text-brand-text-light">requested</span> {log.item}</p>
                                    <p className="text-sm text-brand-text-light">{log.borrowDate?.toDate().toLocaleDateString('en-US')}</p>
                                </div>
                                <span className={`inline-block py-1.5 px-3 rounded-full font-semibold text-xs ${getStatusBadgeClass(log.status)}`}>
                                    {log.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-brand-text-light text-center py-4">No recent activity to show.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardView;