
import React from 'react';
import { EquipmentItem } from '../types';
import { PencilIcon, TrashIcon } from './Icons';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../index';


interface EquipmentCardProps {
    item: EquipmentItem;
    isAdminLoggedIn: boolean;
    onEdit: (item: EquipmentItem) => void;
    fetchEquipment: () => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ item, isAdminLoggedIn, onEdit, fetchEquipment }) => {

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
            try {
                await deleteDoc(doc(db, 'equipment', item.id));
                alert(`"${item.name}" has been deleted.`);
                fetchEquipment();
            } catch (error) {
                console.error("Error deleting equipment: ", error);
                alert("Failed to delete equipment. Please try again.");
            }
        }
    };

    return (
        <div className="relative bg-brand-row border border-brand-border rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 group">
            <img 
                src={item.imageUrl || 'https://placehold.co/400x300/212122/e5e5e5?text=No+Image'} 
                alt={item.name}
                className="w-full h-48 object-cover bg-brand-header" 
            />
            <div className="p-5">
                <h3 className="m-0 text-base font-semibold truncate">{item.name}</h3>
            </div>
            {isAdminLoggedIn && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-full bg-brand-accent/80 text-white hover:bg-brand-accent"
                    >
                        <PencilIcon />
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="p-2 rounded-full bg-brand-danger/80 text-white hover:bg-brand-danger"
                    >
                        <TrashIcon />
                    </button>
                </div>
            )}
        </div>
    );
};

export default EquipmentCard;
