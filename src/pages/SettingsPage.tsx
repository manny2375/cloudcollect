import React, { useState } from 'react';
import { Building, Mail, Phone, Globe, MapPin, CreditCard, Save, DollarSign, Key, Lock } from 'lucide-react';

interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  taxId: string;
  logo?: string;
  primaryColor: string;
  accentColor: string;
  authorizeNet: {
    apiLoginId: string;
    transactionKey: string;
    environment: 'sandbox' | 'production';
  };
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'Demo Company',
    email: 'contact@demo.com',
    phone: '(555) 123-4567',
    website: 'https://www.democompany.com',
    address: '123 Business Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    taxId: '12-3456789',
    primaryColor: '#4F46E5',
    accentColor: '#10B981',
    authorizeNet: {
      apiLoginId: '',
      transactionKey: '',
      environment: 'sandbox'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [showTransactionKey, setShowTransactionKey] = useState(false);

  const validateWebsite = (url: string) => {
    if (!url) return '';
    
    try {
      const urlToTest = url.match(/^https?:\/\//) ? url : `https://${url}`;
      new URL(urlToTest);
      return urlToTest;
    } catch {
      return '';
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validUrl = validateWebsite(value);
    
    setSettings(prev => ({
      ...prev,
      website: value
    }));

    setWebsiteError(validUrl ? '' : 'Please enter a valid URL');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validUrl = validateWebsite(settings.website);
    if (!validUrl) {
      setWebsiteError('Please enter a valid URL');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const formattedSettings = {
        ...settings,
        website: validUrl
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Settings saved successfully');
    } catch (error) {
      setSaveMessage('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your company information and branding
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Company Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  value={settings.name}
                  onChange={e => setSettings({ ...settings, name: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <Building className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  value={settings.email}
                  onChange={e => setSettings({ ...settings, email: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={e => setSettings({ ...settings, phone: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  value={settings.website}
                  onChange={handleWebsiteChange}
                  placeholder="https://www.example.com"
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                    websiteError ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Globe className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {websiteError && (
                <p className="mt-1 text-sm text-red-600">{websiteError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax ID / EIN
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  value={settings.taxId}
                  onChange={e => setSettings({ ...settings, taxId: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  value={settings.address}
                  onChange={e => setSettings({ ...settings, address: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={settings.city}
                onChange={e => setSettings({ ...settings, city: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  value={settings.state}
                  onChange={e => setSettings({ ...settings, state: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={settings.zip}
                  onChange={e => setSettings({ ...settings, zip: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Payment Gateway</h2>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Authorize.net</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                API Login ID
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  value={settings.authorizeNet.apiLoginId}
                  onChange={e => setSettings({
                    ...settings,
                    authorizeNet: {
                      ...settings.authorizeNet,
                      apiLoginId: e.target.value
                    }
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your API Login ID"
                  required
                />
                <Key className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transaction Key
              </label>
              <div className="mt-1 relative">
                <input
                  type={showTransactionKey ? "text" : "password"}
                  value={settings.authorizeNet.transactionKey}
                  onChange={e => setSettings({
                    ...settings,
                    authorizeNet: {
                      ...settings.authorizeNet,
                      transactionKey: e.target.value
                    }
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your Transaction Key"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowTransactionKey(!showTransactionKey)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <Lock className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Environment
              </label>
              <select
                value={settings.authorizeNet.environment}
                onChange={e => setSettings({
                  ...settings,
                  authorizeNet: {
                    ...settings.authorizeNet,
                    environment: e.target.value as 'sandbox' | 'production'
                  }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="sandbox">Sandbox (Testing)</option>
                <option value="production">Production (Live)</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Use sandbox for testing and switch to production when ready to accept real payments.
              </p>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Branding</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="h-8 w-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Accent Color
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={e => setSettings({ ...settings, accentColor: e.target.value })}
                  className="h-8 w-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={e => setSettings({ ...settings, accentColor: e.target.value })}
                  className="block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Company Logo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end space-x-4">
          {saveMessage && (
            <p className={`text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {saveMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={isSaving || !!websiteError}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;