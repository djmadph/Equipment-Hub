import React, { useState, useEffect } from 'react';
import { CollateralItem } from '../types';
import { db } from '../index';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

interface CollateralModalProps {
    isOpen: boolean;
    onClose: () => void;
    collateralItem: CollateralItem | null;
    fetchCollaterals: () => void;
}

const CollateralModal: React.FC<CollateralModalProps> = ({ isOpen, onClose, collateralItem, fetchCollaterals }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [quantity, setQuantity] = useState<number | ''>('');
    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (collateralItem) {
            setName(collateralItem.name);
            setLocation(collateralItem.location);
            setQuantity(collateralItem.quantity);
            setRemarks(collateralItem.remarks);
        } else {
            setName('');
            setLocation('');
            setQuantity('');
            setRemarks('');
        }
    }, [collateralItem, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = {
            name,
            location,
            quantity: Number(quantity),
            remarks,
        };

        try {
            if (collateralItem) {
                const docRef = doc(db, 'collaterals', collateralItem.id);
                await updateDoc(docRef, data);
                alert('Collateral updated successfully!');
            } else {
                await addDoc(collection(db, 'collaterals'), data);
                alert('Collateral added successfully!');
            }
            fetchCollaterals();
            onClose();
        } catch (error) {
            console.error("Error saving collateral:", error);
            alert("Failed to save collateral. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-brand-row p-8 rounded-lg w-full max-w-lg shadow-2xl shadow-black/40" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold mb-6">{collateralItem ? 'Edit Collateral' : 'Add New Collateral'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="collateral-name" className="block mb-2 text-sm text-brand-text-light">Name</label>
                            <input
                                type="text"
                                id="collateral-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="collateral-location" className="block mb-2 text-sm text-brand-text-light">Location</label>
                            <input
                                type="text"
                                id="collateral-location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="collateral-quantity" className="block mb-2 text-sm text-brand-text-light">Quantity</label>
                        <input
                            type="number"
                            id="collateral-quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                            className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                            required
                            min="0"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="collateral-remarks" className="block mb-2 text-sm text-brand-text-light">Remarks</label>
                        <textarea
                            id="collateral-remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-brand-border text-brand-text-light hover:bg-brand-header">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold rounded-lg border-none bg-brand-accent text-white disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : 'Save Collateral'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollateralModal;
