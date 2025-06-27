import React, { useState } from 'react';
import { UserPlus, Edit, Trash2, Search, Shield, Mail, Phone } from 'lucide-react';

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  
  // Mock data - replace with real data from D1
  const users = [
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
  ];

  const roles = ['Administrator', 'Manager', 'Collector', 'Viewer'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-primary-500 mr-2" />
                      <span className="badge badge-primary">
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">{user.department}</div>
                    <div className="text-sm text-neutral-500">{user.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${
                      user.status === 'active' ? 'badge-success' :
                      user.status === 'inactive' ? 'badge-neutral' :
                      'badge-error'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {new Date(user.last_login).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-error-600 hover:text-error-900 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
    </div>
  );
};

export default UsersPage;