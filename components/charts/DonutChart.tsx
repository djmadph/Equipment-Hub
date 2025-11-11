
import React from 'react';

interface DonutChartProps {
    title: string;
    data: { label: string; value: number; color: string }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ title, data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulative = 0;

    const gradients = data.map(item => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        const start = cumulative;
        cumulative += percentage;
        const end = cumulative;
        return `${item.color} ${start}% ${end}%`;
    });
    
    const conicGradient = `conic-gradient(${gradients.join(', ')})`;

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 mt-0">{title}</h3>
            {total > 0 ? (
                 <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8">
                    <div 
                        className="relative w-40 h-40 rounded-full"
                        style={{ background: conicGradient }}
                    >
                        <div className="absolute inset-5 bg-brand-row rounded-full flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-3xl font-bold">{total}</span>
                                <span className="block text-xs text-brand-text-light -mt-1">Total</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center text-sm">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                <span className="text-brand-text-light">{item.label}:</span>
                                <span className="font-semibold text-brand-text ml-1">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                     <p className="text-brand-text-light text-center py-10">No equipment to display.</p>
                </div>
            )}
        </div>
    );
};

export default DonutChart;
