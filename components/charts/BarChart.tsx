
import React from 'react';

interface BarChartProps {
    title: string;
    data: { label: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ title, data }) => {
    const maxValue = data.length > 0 ? Math.max(...data.map(item => item.value)) : 0;

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4 mt-0">{title}</h3>
            {data.length > 0 ? (
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="grid grid-cols-4 items-center gap-4 text-sm">
                            <div className="col-span-1 text-brand-text-light truncate pr-2 text-right">{item.label}</div>
                            <div className="col-span-3 flex items-center">
                                <div className="w-full bg-brand-header rounded-full h-6">
                                    <div
                                        className="bg-brand-accent h-6 rounded-full flex items-center justify-end px-2"
                                        style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                                    >
                                       <span className="text-xs font-bold text-white">{item.value}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className="text-brand-text-light text-center py-10">No data available to display.</p>
            )}
        </div>
    );
};

export default BarChart;
