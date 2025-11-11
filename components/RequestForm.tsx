import React, { useState } from 'react';
import { EquipmentItem } from '../types';
import { collection, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { db } from '../index';
import { sendNotificationEmail } from '../services/emailService';

interface RequestFormProps {
    equipment: EquipmentItem[];
    fetchLogs: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ equipment, fetchLogs }) => {
    const [requestorName, setRequestorName] = useState('');
    const [purpose, setPurpose] = useState('');
    const [borrowDate, setBorrowDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [itemToAdd, setItemToAdd] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddItem = () => {
        if (itemToAdd && !selectedItems.has(itemToAdd)) {
            setSelectedItems(prev => new Set(prev).add(itemToAdd));
            setItemToAdd('');
        }
    };

    const handleRemoveItem = (item: string) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(item);
            return newSet;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItems.size === 0) {
            alert('Please add at least one item to your request.');
            return;
        }
        setIsSubmitting(true);

        const borrowTimestamp = Timestamp.fromDate(new Date(borrowDate));
        const returnTimestamp = Timestamp.fromDate(new Date(returnDate));
        
        const commonData = {
            requestor: requestorName,
            purpose: purpose,
            borrowDate: borrowTimestamp,
            returnDate: returnTimestamp,
            status: 'PENDING',
            clearedBy: ''
        };

        const newEntries = Array.from(selectedItems).map(item => ({ ...commonData, item }));

        try {
            const batch = writeBatch(db);
            const logsCollection = collection(db, 'logs');
            newEntries.forEach(entry => {
                const docRef = doc(logsCollection);
                batch.set(docRef, entry);
            });
            await batch.commit();

            const emailParams = {
                requestor_name: requestorName,
                purpose: purpose,
                items_list: Array.from(selectedItems).join('\n - '),
                borrow_date: new Date(borrowDate).toLocaleDateString('en-US'),
                return_date: new Date(returnDate).toLocaleDateString('en-US')
            };
            await sendNotificationEmail(emailParams);

            alert('Your request has been submitted for approval!');
            // Reset form
            setRequestorName('');
            setPurpose('');
            setBorrowDate('');
            setReturnDate('');
            setSelectedItems(new Set());
            fetchLogs();
        } catch (error) {
            console.error("Error adding request: ", error);
            alert("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-brand-row border border-brand-border rounded-lg p-6 md:p-8 mb-10">
            <h2 className="mt-0 text-2xl font-semibold text-center mb-6">Borrow Equipment</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-group">
                        <label htmlFor="requestor-name" className="block mb-2 text-sm text-brand-text-light">Your Name</label>
                        <input type="text" id="requestor-name" value={requestorName} onChange={(e) => setRequestorName(e.target.value)} className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="purpose" className="block mb-2 text-sm text-brand-text-light">Purpose</label>
                        <input type="text" id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="borrow-date" className="block mb-2 text-sm text-brand-text-light">Borrow Date</label>
                        <input type="date" id="borrow-date" value={borrowDate} onChange={(e) => setBorrowDate(e.target.value)} className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="return-date" className="block mb-2 text-sm text-brand-text-light">Return Date</label>
                        <input type="date" id="return-date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent" required />
                    </div>

                    <div className="form-group md:col-span-2">
                        <label htmlFor="item-select" className="block mb-2 text-sm text-brand-text-light">Items to Borrow</label>
                        <div className="flex gap-3 items-end">
                            <div className="flex-grow">
                                <select id="item-select" value={itemToAdd} onChange={(e) => setItemToAdd(e.target.value)} className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent">
                                    <option value="">-- Select an Item to Add --</option>
                                    {equipment.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                                </select>
                            </div>
                            <button type="button" onClick={handleAddItem} className="px-4 py-3 text-sm font-semibold rounded-lg border-none bg-brand-text-light text-brand-bg cursor-pointer">Add Item</button>
                        </div>
                    </div>

                    {selectedItems.size > 0 &&
                        <ul className="md:col-span-2 list-none p-0 m-0 mt-3 flex flex-wrap gap-3">
                            {Array.from(selectedItems).map(item => (
                                <li key={item} className="bg-brand-header border border-brand-border rounded-md py-2 px-3 text-sm flex items-center gap-2">
                                    <span>{item}</span>
                                    {/* FIX: Cast `item` to string to resolve potential type mismatch if it's inferred as `unknown`. */}
                                    <button type="button" onClick={() => handleRemoveItem(item as string)} className="bg-none border-none text-brand-text-light cursor-pointer text-lg p-0 leading-none hover:text-brand-danger">×</button>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full mt-5 p-3.5 text-base font-semibold rounded-lg border-none bg-brand-accent text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default RequestForm;