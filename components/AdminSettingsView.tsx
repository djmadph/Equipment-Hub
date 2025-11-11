import React, { useState } from 'react';
import { AdminUser } from '../types';
import AdminModal from './AdminModal';
import { TrashIcon, PencilIcon, PlusIcon } from './Icons';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../index';

interface AdminSettingsViewProps {
    admins: AdminUser[];
    fetchAdmins: () => void;
}

const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ admins, fetchAdmins }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

    const handleOpenAddModal = () => {
        setEditingAdmin(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (admin: AdminUser) => {
        setEditingAdmin(admin);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAdmin(null);
    };

    const handleDelete = async (admin: AdminUser) => {
        if (admins.length <= 1) {
            alert('You cannot delete the last admin account.');
            return;
        }

        if (admin.username === 'Kurt C.') {
            alert('The default fallback admin account cannot be deleted from here.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete the admin user "${admin.username}"?`)) {
            try {
                await deleteDoc(doc(db, 'admins', admin.id));
                alert(`Admin "${admin.username}" has been deleted.`);
                fetchAdmins();
            } catch (error) {
                console.error("Error deleting admin: ", error);
                alert("Failed to delete admin. Please try again.");
            }
        }
    };

    return (
        <div className="bg-brand-row border border-brand-border rounded-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold m-0">Manage Admin Credentials</h2>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border border-brand-accent bg-brand-accent text-white hover:bg-opacity-80 transition-all"
                >
                    <PlusIcon />
                    Add New Admin
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                    <thead className="bg-brand-header">
                        <tr>
                            <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-brand-text-light">Username</th>
                            <th className="p-4 text-right font-semibold text-xs uppercase tracking-wider text-brand-text-light">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="text-center p-8 text-brand-text-light">
                                    No admin users found in the database.
                                </td>
                            </tr>
                        ) : (
                            admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-brand-header border-b border-brand-border last:border-b-0">
                                    <td className="p-4 whitespace-nowrap font-medium">{admin.username}</td>
                                    <td className="p-4 whitespace-nowrap text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenEditModal(admin)}
                                            className="p-2 rounded-full bg-brand-accent/80 text-white hover:bg-brand-accent"
                                            title="Change Password"
                                        >
                                            <PencilIcon />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(admin)}
                                            className="p-2 rounded-full bg-brand-danger/80 text-white hover:bg-brand-danger"
                                            title="Delete Admin"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <p className="text-xs text-brand-text-light mt-4 italic">
                    Note: The default 'Kurt C.' admin is a fallback and not stored in the database. To remove it, the source code must be changed.
                </p>
            </div>

            {isModalOpen && (
                <AdminModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    adminUser={editingAdmin}
                    fetchAdmins={fetchAdmins}
                />
            )}
        </div>
    );
};

export default AdminSettingsView;
