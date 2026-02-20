import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { Button } from './Button';
import { Select } from './Select';

export interface UserToEdit {
    id: number | string;
    name: string;
    identifier: string;
    role: string;
    status: string;
}

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserToEdit | null;
    onSave: (data: any) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            name: '',
            identifier: '',
            role: 'Student',
            status: 'Active'
        }
    });

    const currentRole = watch('role');
    const currentStatus = watch('status');

    useEffect(() => {
        if (user && isOpen) {
            reset({
                name: user.name,
                identifier: user.identifier,
                role: user.role,
                status: user.status
            });
        }
    }, [user, isOpen, reset]);

    const onSubmit = (data: any) => {
        onSave({ id: user?.id, ...data });
        onClose();
    };

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit User Account"
            description={`Modify institutional details for ${user.name}.`}
            maxWidth="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                    <input {...register("name")} required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition" />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                        <Select
                            value={currentRole}
                            onChange={(v) => setValue("role", v)}
                            options={[
                                { label: "Student", value: "Student" },
                                { label: "Lecturer", value: "Lecturer" },
                                { label: "Admin", value: "Admin" }
                            ]}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">ID Number</label>
                        <input {...register("identifier")} required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Account Status</label>
                    <Select
                        value={currentStatus}
                        onChange={(v) => setValue("status", v)}
                        options={[
                            { label: "Active Pipeline", value: "Active" },
                            { label: "Suspended", value: "Suspended" },
                            { label: "Inactive / Graduated", value: "Inactive" }
                        ]}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </Modal>
    );
};

