import React, { useState } from 'react';
import { CollateralItem } from '../types';
import { PlusIcon } from './Icons';
import CollateralsTable from './CollateralsTable';
import CollateralModal from './CollateralModal';

interface CollateralsViewProps {
    isAdminLoggedIn: boolean;
    collaterals: CollateralItem[];
    fetchCollaterals: () => void;
}

const CollateralsView: React.FC<CollateralsViewProps> = ({ isAdminLoggedIn, collaterals, fetchCollaterals }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollateral, setEditingCollateral] = useState<CollateralItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenAddModal = () => {
        setEditingCollateral(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: CollateralItem) => {
        setEditingCollateral(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCollateral(null);
    };

    const filteredCollaterals = collaterals.filter(item => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(searchTermLower) ||
            item.location.toLowerCase().includes(searchTermLower) ||
            item.remarks.toLowerCase().includes(searchTermLower)
        );
    });

    return (
        <div>
            <div className="mb-5 flex justify-between items-center gap-5 flex-wrap">
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, location, or remarks..."
                    className="flex-grow min-w-[250px] p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                />
                {isAdminLoggedIn && (
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border border-brand-accent bg-brand-accent text-white hover:bg-opacity-80 transition-all"
                    >
                        <PlusIcon />
                        Add New Collateral
                    </button>
                )}
            </div>
            
            <CollateralsTable
                collaterals={filteredCollaterals}
                isAdminLoggedIn={isAdminLoggedIn}
                onEdit={handleOpenEditModal}
                fetchCollaterals={fetchCollaterals}
            />

            {isModalOpen && (
                <CollateralModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    collateralItem={editingCollateral}
                    fetchCollaterals={fetchCollaterals}
                />
            )}
        </div>
    );
};

export default CollateralsView;
