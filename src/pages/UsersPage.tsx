import React, { useState } from 'react';
import { UserPlus, Edit, Trash2, Search, Shield, Mail, Phone, X, Save } from 'lucide-react';
import { apiClient } from '../hooks/useAPI';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  position?: string;
  phone?: string;
  last_login?: string;
}

interface EditUserData {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  position?: string;
  phone?: string;
}

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditUserData>({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    status: 'active',
    department: '',
    position: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Mock data - replace with real data from API
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      role: 'Administrator',
      status: 'active',
      department: 'Administration',
      position: 'System Administrator',
      phone: '(555) 123-4567',
      last_login: '2025-01-15T10:30:00Z'
    },
    {
      id: '2',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@example.com',
      role: 'Manager',
      status: 'active',
      department: 'Collections',
      position: 'Collection Manager',
      phone: '(555) 234-5678',
      last_login: '2025-01-15T09:15:00Z'
    }
  ]);

  const roles = ['Administrator', 'Manager', 'Collector', 'Viewer'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const handleEditClick = (user: User) => {
    setEditingUser(user.id);
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department || '',
      position: user.position || '',
      phone: user.phone || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({
      first_name: '',
      last_name: '',
      email: '',
      role: '',
      status: 'active',
      department: '',
      position: '',
      phone: ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    setIsLoading(true);
    try {
      // Update user in database
      await apiClient.request(`/users/${editingUser}`, {
        method: 'PUT',
        body: JSON.stringify(editFormData)
      });

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser 
            ? { ...user, ...editFormData }
            : user
        )
      );

      setEditingUser(null);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-success-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
      successMessage.textContent = 'User updated successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);

    } catch (error) {
      console.error('Error updating user:', error);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-error-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
      errorMessage.textContent = 'Failed to update user';
      document.body.appendChild(errorMessage);
      setTimeout(() => document.body.removeChild(errorMessage), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (userId: string) => {
    setShowDeleteConfirm(userId);
  };

  const handleConfirmDelete = async () => {
    if (!showDeleteConfirm) return;

    setIsLoading(true);
    try {
      // Delete user from database
      await apiClient.request(`/users/${showDeleteConfirm}`, {
        method: 'DELETE'
      });

      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== showDeleteConfirm));
      setShowDeleteConfirm(null);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-success-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
      successMessage.textContent = 'User deleted successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);

    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-error-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
      errorMessage.textContent = 'Failed to delete user';
      document.body.appendChild(errorMessage);
      setTimeout(() => document.body.removeChild(errorMessage), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof EditUserData, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage system users and their roles
        </p>
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-3 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              </div>
              
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="input"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <button className="btn btn-primary">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editFormData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            className="input text-sm w-24"
                            placeholder="First name"
                          />
                          <input
                            type="text"
                            value={editFormData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            className="input text-sm w-24"
                            placeholder="Last name"
                          />
                        </div>
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="input text-sm w-full"
                          placeholder="Email"
                        />
                        <input
                          type="tel"
                          value={editFormData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="input text-sm w-full"
                          placeholder="Phone"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
                          {user.first_name[0]}{user.last_name[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-neutral-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-neutral-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <select
                        value={editFormData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="input text-sm"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-primary-500 mr-2" />
                        <span className="badge badge-primary">
                          {user.role}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editFormData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="input text-sm w-full"
                          placeholder="Department"
                        />
                        <input
                          type="text"
                          value={editFormData.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          className="input text-sm w-full"
                          placeholder="Position"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-neutral-900">{user.department}</div>
                        <div className="text-sm text-neutral-500">{user.position}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <select
                        value={editFormData.status}
                        onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive' | 'suspended')}
                        className="input text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    ) : (
                      <span className={`badge ${
                        user.status === 'active' ? 'badge-success' :
                        user.status === 'inactive' ? 'badge-neutral' :
                        'badge-error'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingUser === user.id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={isLoading}
                          className="text-success-600 hover:text-success-900 transition-colors disabled:opacity-50"
                          title="Save changes"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                          className="text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-primary-600 hover:text-primary-900 transition-colors hover:scale-110"
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="text-error-600 hover:text-error-900 transition-colors hover:scale-110"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-neutral-200">
          <div className="text-sm text-neutral-500">
            Showing {filteredUsers.length} users
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-error-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900">Delete User</h3>
                <p className="text-sm text-neutral-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-neutral-700 mb-6">
              Are you sure you want to delete this user? All associated data will be permanently removed.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isLoading}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="btn btn-error"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;