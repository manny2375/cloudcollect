import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText, 
  Plus,
  Edit,
  CreditCard,
  Download,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useDebtor } from '../hooks/useAPI';
import { formatCurrency, formatDate, formatPhoneNumber } from '../utils/formatters';
import { generateDemandLetter, generateAccountStatement, generatePaymentAgreement } from '../utils/documentGenerator';

const AccountDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { debtor, loading, error } = useDebtor(id!);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !debtor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error-600 mb-2">Account Not Found</h2>
          <p className="text-neutral-600 mb-4">{error || 'The requested account could not be found.'}</p>
          <Link to="/dashboard/accounts" className="btn btn-primary">
            Back to Accounts
          </Link>
        </div>
      </div>
    );
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    // TODO: Implement API call to add note
    setNewNote('');
    setIsAddingNote(false);
  };

  const handleGenerateDocument = async (type: 'demand' | 'statement' | 'agreement') => {
    const companyInfo = {
      name: 'Demo Company',
      address: '123 Business Ave',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      phone: '(555) 123-4567'
    };

    try {
      switch (type) {
        case 'demand':
          await generateDemandLetter(debtor, companyInfo);
          break;
        case 'statement':
          await generateAccountStatement(debtor, companyInfo);
          break;
        case 'agreement':
          await generatePaymentAgreement(debtor, {}, companyInfo);
          break;
      }
    } catch (error) {
      console.error('Error generating document:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: Download },
    { id: 'actions', label: 'Actions', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard/accounts" 
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {debtor.first_name} {debtor.last_name}
            </h1>
            <p className="text-neutral-500">Account #{debtor.account_number}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => handleGenerateDocument('demand')}
            className="btn btn-secondary btn-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Demand Letter
          </button>
          <button 
            onClick={() => handleGenerateDocument('statement')}
            className="btn btn-secondary btn-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Statement
          </button>
          <button className="btn btn-primary btn-sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Account
          </button>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Current Balance</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatCurrency(debtor.current_balance)}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-error-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Original Balance</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatCurrency(debtor.original_balance)}
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-neutral-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Status</p>
              <span className={`badge ${
                debtor.status === 'active' ? 'badge-primary' : 
                debtor.status === 'paid' ? 'badge-success' : 
                debtor.status === 'disputed' ? 'badge-warning' : 
                'badge-neutral'
              }`}>
                {debtor.status.charAt(0).toUpperCase() + debtor.status.slice(1)}
              </span>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Last Payment</p>
              <p className="text-sm font-medium text-neutral-900">
                {debtor.last_payment_date ? formatDate(debtor.last_payment_date) : 'No payments'}
              </p>
              {debtor.last_payment_amount && (
                <p className="text-xs text-neutral-500">
                  {formatCurrency(debtor.last_payment_amount)}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Address</p>
              <p className="text-sm text-neutral-600">
                {debtor.address}<br />
                {debtor.city}, {debtor.state} {debtor.zip}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Email</p>
              <p className="text-sm text-neutral-600">{debtor.email || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Phone Numbers</p>
              {debtor.phones && debtor.phones.length > 0 ? (
                debtor.phones.map((phone, index) => (
                  <p key={index} className="text-sm text-neutral-600">
                    {formatPhoneNumber(phone.number)} ({phone.type})
                    {phone.is_primary && <span className="text-primary-600 ml-1">(Primary)</span>}
                  </p>
                ))
              ) : (
                <p className="text-sm text-neutral-600">Not provided</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-neutral-900 mb-3">Account Details</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-neutral-600">Creditor</dt>
                      <dd className="text-sm font-medium text-neutral-900">{debtor.creditor_name || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-neutral-600">Client</dt>
                      <dd className="text-sm font-medium text-neutral-900">{debtor.client_name || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-neutral-600">Portfolio</dt>
                      <dd className="text-sm font-medium text-neutral-900">{debtor.portfolio_id || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-neutral-600">Case File #</dt>
                      <dd className="text-sm font-medium text-neutral-900">{debtor.case_file_number || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-900 mb-3">Important Dates</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-neutral-600">Date Loaded</dt>
                      <dd className="text-sm font-medium text-neutral-900">{formatDate(debtor.date_loaded)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-neutral-600">Purchase Date</dt>
                      <dd className="text-sm font-medium text-neutral-900">{formatDate(debtor.purchase_date)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-neutral-600">Origination Date</dt>
                      <dd className="text-sm font-medium text-neutral-900">{formatDate(debtor.origination_date)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-neutral-600">Charged Off Date</dt>
                      <dd className="text-sm font-medium text-neutral-900">{formatDate(debtor.charged_off_date)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-neutral-900">Payment History</h4>
                <button className="btn btn-primary btn-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Payment
                </button>
              </div>

              {debtor.payments && debtor.payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {debtor.payments.map((payment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {formatDate(payment.payment_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {payment.method.toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`badge ${
                              payment.status === 'completed' ? 'badge-success' :
                              payment.status === 'pending' ? 'badge-warning' :
                              'badge-error'
                            }`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {payment.reference || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="mx-auto h-12 w-12 text-neutral-400" />
                  <h3 className="mt-2 text-sm font-medium text-neutral-900">No payments recorded</h3>
                  <p className="mt-1 text-sm text-neutral-500">Get started by recording the first payment.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-neutral-900">Account Notes</h4>
                <button 
                  onClick={() => setIsAddingNote(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </button>
              </div>

              {isAddingNote && (
                <div className="card p-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note..."
                    className="input w-full h-24 resize-none"
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <button 
                      onClick={() => setIsAddingNote(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddNote}
                      className="btn btn-primary btn-sm"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {debtor.notes && debtor.notes.length > 0 ? (
                <div className="space-y-4">
                  {debtor.notes.map((note, index) => (
                    <div key={index} className="card p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-neutral-900">
                          {note.created_by || 'System'}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {formatDate(note.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-neutral-400" />
                  <h3 className="mt-2 text-sm font-medium text-neutral-900">No notes yet</h3>
                  <p className="mt-1 text-sm text-neutral-500">Add notes to track communications and updates.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-neutral-900">Documents</h4>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleGenerateDocument('demand')}
                    className="btn btn-secondary btn-sm"
                  >
                    Generate Demand Letter
                  </button>
                  <button 
                    onClick={() => handleGenerateDocument('statement')}
                    className="btn btn-secondary btn-sm"
                  >
                    Generate Statement
                  </button>
                  <button className="btn btn-primary btn-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </button>
                </div>
              </div>

              {debtor.documents && debtor.documents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Uploaded
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {debtor.documents.map((doc, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                            {doc.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {doc.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {formatDate(doc.uploaded_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            <button className="text-primary-600 hover:text-primary-900">
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-neutral-400" />
                  <h3 className="mt-2 text-sm font-medium text-neutral-900">No documents</h3>
                  <p className="mt-1 text-sm text-neutral-500">Upload documents or generate letters for this account.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-neutral-900">Actions & Tasks</h4>
                <button className="btn btn-primary btn-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Action
                </button>
              </div>

              {debtor.actions && debtor.actions.length > 0 ? (
                <div className="space-y-3">
                  {debtor.actions.map((action, index) => (
                    <div key={index} className="card p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            action.status === 'completed' ? 'bg-success-500' :
                            action.status === 'pending' ? 'bg-warning-500' :
                            'bg-error-500'
                          }`} />
                          <div>
                            <h5 className="font-medium text-neutral-900">{action.type}</h5>
                            <p className="text-sm text-neutral-600">{action.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-neutral-500">
                              <span>Created: {formatDate(action.created_at)}</span>
                              {action.due_date && (
                                <span>Due: {formatDate(action.due_date)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`badge ${
                          action.status === 'completed' ? 'badge-success' :
                          action.status === 'pending' ? 'badge-warning' :
                          'badge-error'
                        }`}>
                          {action.status.charAt(0).toUpperCase() + action.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-neutral-400" />
                  <h3 className="mt-2 text-sm font-medium text-neutral-900">No actions</h3>
                  <p className="mt-1 text-sm text-neutral-500">Create actions to track collection activities.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailPage;