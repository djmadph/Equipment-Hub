
import React, { useState } from 'react';
import { EquipmentItem } from '../types';
import { PlusIcon } from './Icons';
import EquipmentCard from './EquipmentCard';
import EquipmentModal from './EquipmentModal';

interface EquipmentViewProps {
    isAdminLoggedIn: boolean;
    equipment: EquipmentItem[];
    fetchEquipment: () => void;
}

const EquipmentView: React.FC<EquipmentViewProps> = ({ isAdminLoggedIn, equipment, fetchEquipment }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<EquipmentItem | null>(null);

    const handleOpenAddModal = () => {
        setEditingEquipment(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: EquipmentItem) => {
        setEditingEquipment(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEquipment(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold m-0">Available Equipment</h2>
                {isAdminLoggedIn && (
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border border-brand-accent bg-brand-accent text-white hover:bg-opacity-80 transition-all"
                    >
                        <PlusIcon />
                        Add Equipment
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-5">
                {equipment.map(item => (
                    <EquipmentCard 
                        key={item.id} 
                        item={item} 
                        isAdminLoggedIn={isAdminLoggedIn} 
                        onEdit={handleOpenEditModal}
                        fetchEquipment={fetchEquipment}
                    />
                ))}
            </div>

            {isModalOpen && (
                <EquipmentModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    equipmentItem={editingEquipment}
                    fetchEquipment={fetchEquipment}
                />
            )}
        </div>
    );
};

export default EquipmentView;
