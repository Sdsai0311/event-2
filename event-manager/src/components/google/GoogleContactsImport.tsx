import React, { useState } from 'react';
import { Users, Download, Search, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { GoogleConnect } from './GoogleConnect';
import { Modal } from '../ui/Modal';

interface Contact {
    id: string;
    name: string;
    email: string;
}

interface GoogleContactsImportProps {
    onImport: (contacts: Contact[]) => void;
}

export const GoogleContactsImport: React.FC<GoogleContactsImportProps> = ({ onImport }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const { googleAccessToken } = useAuthStore();

    const fetchContacts = async () => {
        if (!googleAccessToken) return;

        setIsLoading(true);
        try {
            // Mock fetching contacts
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockContacts = [
                { id: '1', name: 'John Doe', email: 'john@example.com' },
                { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
                { id: '3', name: 'Alice Cooper', email: 'alice@example.com' },
                { id: '4', name: 'Bob Wilson', email: 'bob@example.com' },
            ];
            setContacts(mockContacts);
        } catch (error) {
            console.error('Failed to fetch contacts', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleImport = () => {
        const toImport = contacts.filter(c => selectedIds.has(c.id));
        onImport(toImport);
        setIsModalOpen(false);
        setSelectedIds(new Set());
    };

    const openModal = () => {
        setIsModalOpen(true);
        if (googleAccessToken && contacts.length === 0) {
            fetchContacts();
        }
    };

    if (!googleAccessToken) {
        return <GoogleConnect />;
    }

    return (
        <>
            <Button variant="outline" onClick={openModal}>
                <Users className="h-4 w-4 mr-2" />
                Import from Google
            </Button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Import Google Contacts"
            >
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                        />
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                        {isLoading ? (
                            <div className="py-8 text-center text-gray-500">Loading contacts...</div>
                        ) : contacts.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">No contacts found</div>
                        ) : (
                            contacts.map(contact => (
                                <div
                                    key={contact.id}
                                    onClick={() => toggleSelect(contact.id)}
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedIds.has(contact.id)
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{contact.name}</p>
                                        <p className="text-xs text-gray-500">{contact.email}</p>
                                    </div>
                                    {selectedIds.has(contact.id) && (
                                        <div className="bg-indigo-600 rounded-full p-1 text-white">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                        <p className="text-xs text-gray-500">
                            {selectedIds.size} contact(s) selected
                        </p>
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                disabled={selectedIds.size === 0}
                                onClick={handleImport}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Import Selected
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};
