import React, { useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { db } from '../index';
import { collection, addDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    adminUser: AdminUser | null;
    fetchAdmins: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, adminUser, fetchAdmins }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (adminUser) {
            setUsername(adminUser.username);
            setPassword(''); // Don't pre-fill password for security
        } else {
            setUsername('');
            setPassword('');
        }
        setError('');
    }, [adminUser, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!password) {
            setError('Password cannot be empty.');
            return;
        }
        setIsSubmitting(true);
        
        // SECURITY WARNING: Storing plain-text passwords is not secure.
        // Use a proper authentication service like Firebase Authentication in a real application.
        try {
            if (adminUser) {
                // Update existing admin (password only)
                const docRef = doc(db, 'admins', adminUser.id);
                await updateDoc(docRef, { password });
                alert('Admin password updated successfully!');
            } else {
                // Add new admin, but first check if username exists
                const adminsRef = collection(db, 'admins');
                const q = query(adminsRef, where("username", "==", username));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty || username === 'Kurt C.') {
                    setError('This username is already taken.');
                    setIsSubmitting(false);
                    return;
                }
                
                await addDoc(collection(db, 'admins'), { username, password });
                alert('New admin added successfully!');
            }
            fetchAdmins();
            onClose();
        } catch (err) {
            console.error("Error saving admin:", err);
            setError("Failed to save admin credentials. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-brand-row p-8 rounded-lg w-full max-w-md shadow-2xl shadow-black/40" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold mb-6">{adminUser ? 'Change Admin Password' : 'Add New Admin'}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-brand-danger text-center text-sm mb-4">{error}</p>}
                    <div className="mb-4">
                        <label htmlFor="admin-username" className="block mb-2 text-sm text-brand-text-light">Username</label>
                        <input
                            type="text"
                            id="admin-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
                            required
                            disabled={!!adminUser}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="admin-password" className="block mb-2 text-sm text-brand-text-light">{adminUser ? 'New Password' : 'Password'}</label>
                        <input
                            type="password"
                            id="admin-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 text-base rounded-lg border border-brand-border bg-brand-header text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-brand-border text-brand-text-light hover:bg-brand-header">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold rounded-lg border-none bg-brand-accent text-white disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminModal;
