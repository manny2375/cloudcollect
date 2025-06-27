import React, { useState } from 'react';
import { Shield, Edit, Trash2, Plus, Users, Lock } from 'lucide-react';

const RolesPage: React.FC = () => {
  // Mock data - replace with real data from D1
  const roles = [
    {
      id: '1',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      permissions: ['accounts:view', 'accounts:edit', 'payments:process', 'reports:view', 'users:manage', 'roles:manage'],
      userCount: 2,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Department manager with elevated privileges',
      permissions: ['accounts:view', 'accounts:edit', 'payments:process', 'reports:view'],
      userCount: 5,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Collector',
      description: 'Standard collector role with account management',
      permissions: ['accounts:view', 'accounts:edit', 'payments:process'],
      userCount: 12,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'Viewer',
      description: 'Read-only access to accounts and reports',
      permissions: ['accounts:view', 'reports:view'],
      userCount: 3,
      created_at: '2025-01-01T00:00:00Z'
    }
  ];

  const permissions = [
    { code: 'accounts:view', name: 'View Accounts', description: 'Can view account details' },
    { code: 'accounts:edit', name: 'Edit Accounts', description: 'Can edit account details' },
    { code: 'payments:process', name: 'Process Payments', description: 'Can process payments' },
    { code: 'reports:view', name: 'View Reports', description: 'Can view reports' },
    { code: 'users:manage', name: 'Manage Users', description: 'Can manage users' },
    { code: 'roles:manage', name: 'Manage Roles', description: 'Can manage roles' },
    { code: 'documents:view', name: 'View Documents', description: 'Can view documents' },
    { code: 'documents:upload', name: 'Upload Documents', description: 'Can upload documents' },
    { code: 'settings:manage', name: 'Manage Settings', description: 'Can manage system settings' }
  ];

  const getPermissionName = (code: string) => {
    return permissions.find(p => p.code === code)?.name || code;
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Role Management</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage system roles and permissions
        </p>
      </div>

      {/* Roles Table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-neutral-900">Roles</h2>
            <button className="btn btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Users
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {roles.map(role => (
                <tr key={role.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {role.name}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {role.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission, index) => (
                        <span
                          key={index}
                          className="badge badge-primary text-xs"
                        >
                          {getPermissionName(permission)}
                        </span>
                      ))}
                      {role.permissions.length > 3 && (
                        <span className="badge badge-neutral text-xs">
                          +{role.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-neutral-400 mr-2" />
                      <span className="text-sm text-neutral-900">{role.userCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {new Date(role.created_at).toLocaleDateString()}
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
      </div>

      {/* Available Permissions */}
      <div className="card">
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center">
            <Lock className="w-5 h-5 text-neutral-500 mr-2" />
            <h2 className="text-lg font-medium text-neutral-900">Available Permissions</h2>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissions.map(permission => (
            <div key={permission.code} className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <h3 className="font-medium text-neutral-900">{permission.name}</h3>
              <p className="text-sm text-neutral-500 mt-1">{permission.description}</p>
              <code className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded mt-2 block">
                {permission.code}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RolesPage;