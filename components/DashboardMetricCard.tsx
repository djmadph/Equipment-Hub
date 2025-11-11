
import React from 'react';

interface DashboardMetricCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color?: string;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({ title, value, icon, color = 'text-brand-text' }) => {
    return (
        <div className="bg-brand-row border border-brand-border rounded-lg p-6 flex items-center justify-between">
            <div>
                <p className="text-brand-text-light text-sm font-medium uppercase tracking-wider m-0">{title}</p>
                <p className={`text-4xl font-bold mt-2 mb-0 ${color}`}>{value}</p>
            </div>
            <div className="text-brand-text-light opacity-30">
                {icon}
            </div>
        </div>
    );
};

export default DashboardMetricCard;
