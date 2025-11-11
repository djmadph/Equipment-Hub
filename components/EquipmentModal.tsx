
import React, { useState, useEffect } from 'react';
import { EquipmentItem } from '../types';
import { db } from '../index';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface EquipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    equipmentItem: EquipmentItem | null;
    fetchEquipment: () => void;
}

const EquipmentModal: React.FC<EquipmentModalProps> = ({ isOpen, onClose, equipmentItem, fetchEquipment }) => {
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (equipmentItem) {
            setName(equipmentItem.name);
            setImageUrl(equipmentItem.imageUrl);
        } else {
            setName('');
            setImageUrl('');
        }
    }, [equipmentItem]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = {
            name,
            imageUrl,
        };

        try {
            if (equipmentItem) {
                // Update existing item
                const docRef = doc(db, 'equipment', equipmentItem.id);
                await updateDoc(docRef, data);
                alert('Equipment updated successfully!');
            } else {
                // Add new item
                await addDoc(collection(db, 'equipment'), data);
                alert('Equipment added successfully!');
            }
            fetchEquipment();
            onClose();
        } catch (error) {
            console.error("Error saving equipment:", error);
            alert("Failed to save equipment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-brand-row p-8 rounded-lg w-full max-w-md shadow-2xl shadow-black/40" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold mb-6">{equipmentItem ? 'Edit Equipment' : 'Add New Equipment'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="equipment-name" className="block mb-2 text-sm text-brand-text-light">Equipment Name</label>
                        <input
                            type="text"
                            id="equipment-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="equipment-image-url" className="block mb-2 text-sm text-brand-text-light">Image URL</label>
                        <input
                            type="text"
                            id="equipment-image-url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-brand-border text-brand-text-light hover:bg-brand-header">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold rounded-lg border-none bg-brand-accent text-white disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : 'Save Equipment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentModal;
