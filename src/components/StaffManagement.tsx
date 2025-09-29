import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Search, Mail, User } from 'lucide-react';
import { StaffMember } from '../types';
import { Modal } from './Modal';
import { StaffForm } from './StaffForm';

interface StaffManagementProps {
  staff: StaffMember[];
  onAddStaff: (staff: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  onUpdateStaff: (id: string, staff: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  onDeleteStaff: (id: string) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
  staff,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (member: StaffMember) => {
    setEditingStaff(member);
    setIsModalOpen(true);
  };

  const handleSubmit = (staffData: Omit<StaffMember, 'id' | 'createdAt'>) => {
    if (editingStaff) {
      onUpdateStaff(editingStaff.id, staffData);
    } else {
      onAddStaff(staffData);
    }
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Staff': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Upravljanje osobljem</h1>
        <button
          onClick={handleAddStaff}
          className="flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
        >
          <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
          Dodaj osoblje
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pretraži osoblje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((member) => (
            <div key={member.id} className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm lg:text-base font-semibold text-gray-900 truncate">{member.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs lg:text-sm font-medium rounded-full ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1 flex-shrink-0">
                  <button
                    onClick={() => handleEditStaff(member)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteStaff(member.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-xs lg:text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-3 w-3 lg:h-4 lg:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div>
                  <span className="font-medium">Odeljenje:</span> {member.department}
                </div>
                <div>
                  <span className="font-medium">Pridružio se:</span> {member.createdAt}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Nema članova osoblja koji odgovaraju pretrazi.' : 'Nema pronađenih članova osoblja.'}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStaff(null);
        }}
        title={editingStaff ? 'Izmeni člana osoblja' : 'Dodaj novog člana osoblja'}
      >
        <StaffForm
          staff={editingStaff}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingStaff(null);
          }}
        />
      </Modal>
    </div>
  );
};