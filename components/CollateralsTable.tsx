import React from 'react';
import { CollateralItem } from '../types';
import { PencilIcon, TrashIcon } from './Icons';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../index';

interface CollateralsTableProps {
    collaterals: CollateralItem[];
    isAdminLoggedIn: boolean;
    onEdit: (item: CollateralItem) => void;
    fetchCollaterals: () => void;
}

const CollateralsTable: React.FC<CollateralsTableProps> = ({ collaterals, isAdminLoggedIn, onEdit, fetchCollaterals }) => {

    const handleDelete = async (item: CollateralItem) => {
        if (window.confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
            try {
                await deleteDoc(doc(db, 'collaterals', item.id));
                alert(`"${item.name}" has been deleted.`);
                fetchCollaterals();
            } catch (error) {
                console.error("Error deleting collateral: ", error);
                alert("Failed to delete collateral. Please try again.");
            }
        }
    };

    return (
        <div className="overflow-x-auto border border-brand-border rounded-lg bg-brand-row">
            <table className="w-full border-collapse min-w-[900px]">
                <thead className="bg-brand-header">
                    <tr>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Name</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Location</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Quantity</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Remarks</th>
                        {isAdminLoggedIn && <th className="p-4 text-right font-semibold text-xs uppercase tracking-wider text-brand-text-light">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {collaterals.length === 0 ? (
                        <tr>
                            <td colSpan={isAdminLoggedIn ? 5 : 4} className="text-center p-8 text-brand-text-light">
                                No collateral items found.
                            </td>
                        </tr>
                    ) : (
                        collaterals.map((item) => (
                            <tr key={item.id} className="hover:bg-brand-header border-b border-brand-border last:border-b-0">
                                <td className="p-4 whitespace-nowrap font-medium">{item.name}</td>
                                <td className="p-4 whitespace-nowrap">{item.location}</td>
                                <td className="p-4 whitespace-nowrap">{item.quantity}</td>
                                <td className="p-4 ">{item.remarks}</td>
                                {isAdminLoggedIn && (
                                    <td className="p-4 whitespace-nowrap text-right space-x-2">
                                        <button 
                                            onClick={() => onEdit(item)}
                                            className="p-2 rounded-full bg-brand-accent/80 text-white hover:bg-brand-accent"
                                            title="Edit Collateral"
                                        >
                                            <PencilIcon />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item)}
                                            className="p-2 rounded-full bg-brand-danger/80 text-white hover:bg-brand-danger"
                                            title="Delete Collateral"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CollateralsTable;
