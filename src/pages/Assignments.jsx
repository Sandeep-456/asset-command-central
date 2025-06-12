
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, User, AlertTriangle } from 'lucide-react';

const Assignments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showExpenditureForm, setShowExpenditureForm] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    assetId: '',
    personnelName: '',
    personnelRank: '',
    personnelId: '',
    assignmentDate: '',
    expectedReturnDate: '',
    purpose: '',
    notes: ''
  });
  const [expenditureForm, setExpenditureForm] = useState({
    assetId: '',
    quantity: '',
    reason: '',
    expenditureDate: '',
    authorizedBy: '',
    notes: ''
  });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchAssets();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'assignments') {
        const data = await apiService.getAssignments();
        setAssignments(data);
      } else {
        const data = await apiService.getExpenditures();
        setExpenditures(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      const data = await apiService.getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createAssignment(assignmentForm);
      setShowAssignmentForm(false);
      setAssignmentForm({
        assetId: '',
        personnelName: '',
        personnelRank: '',
        personnelId: '',
        assignmentDate: '',
        expectedReturnDate: '',
        purpose: '',
        notes: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleExpenditureSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createExpenditure(expenditureForm);
      setShowExpenditureForm(false);
      setExpenditureForm({
        assetId: '',
        quantity: '',
        reason: '',
        expenditureDate: '',
        authorizedBy: '',
        notes: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating expenditure:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Assignments & Expenditures</h1>
          <p className="text-gray-600 mt-1">Track personnel assignments and asset expenditures</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAssignmentForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <User size={20} />
            <span>New Assignment</span>
          </button>
          <button
            onClick={() => setShowExpenditureForm(true)}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <AlertTriangle size={20} />
            <span>Record Expenditure</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('expenditures')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'expenditures'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Expenditures
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'assignments' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Asset</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Personnel</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Purpose</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Return Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(assignment.assignmentDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {assignment.assetName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {assignment.personnelName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {assignment.personnelRank}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {assignment.purpose}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {assignment.expectedReturnDate ? new Date(assignment.expectedReturnDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : assignment.status === 'returned'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {assignments.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No assignments found
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Asset</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Authorized By</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenditures.map((expenditure) => (
                    <tr key={expenditure.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(expenditure.expenditureDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {expenditure.assetName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {expenditure.quantity}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {expenditure.reason}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {expenditure.authorizedBy}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Expended
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {expenditures.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No expenditures found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assignment Form Modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">New Assignment</h2>
              <button
                onClick={() => setShowAssignmentForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAssignmentSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset *
                  </label>
                  <select
                    value={assignmentForm.assetId}
                    onChange={(e) => setAssignmentForm({...assignmentForm, assetId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select asset</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>{asset.name} ({asset.equipmentType})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personnel Name *
                  </label>
                  <input
                    type="text"
                    value={assignmentForm.personnelName}
                    onChange={(e) => setAssignmentForm({...assignmentForm, personnelName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personnel Rank *
                  </label>
                  <input
                    type="text"
                    value={assignmentForm.personnelRank}
                    onChange={(e) => setAssignmentForm({...assignmentForm, personnelRank: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personnel ID
                  </label>
                  <input
                    type="text"
                    value={assignmentForm.personnelId}
                    onChange={(e) => setAssignmentForm({...assignmentForm, personnelId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Date *
                  </label>
                  <input
                    type="date"
                    value={assignmentForm.assignmentDate}
                    onChange={(e) => setAssignmentForm({...assignmentForm, assignmentDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Return Date
                  </label>
                  <input
                    type="date"
                    value={assignmentForm.expectedReturnDate}
                    onChange={(e) => setAssignmentForm({...assignmentForm, expectedReturnDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose *
                </label>
                <input
                  type="text"
                  value={assignmentForm.purpose}
                  onChange={(e) => setAssignmentForm({...assignmentForm, purpose: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={assignmentForm.notes}
                  onChange={(e) => setAssignmentForm({...assignmentForm, notes: e.target.value})}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAssignmentForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expenditure Form Modal */}
      {showExpenditureForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Record Expenditure</h2>
              <button
                onClick={() => setShowExpenditureForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleExpenditureSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset *
                  </label>
                  <select
                    value={expenditureForm.assetId}
                    onChange={(e) => setExpenditureForm({...expenditureForm, assetId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">Select asset</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>{asset.name} ({asset.equipmentType})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={expenditureForm.quantity}
                    onChange={(e) => setExpenditureForm({...expenditureForm, quantity: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expenditure Date *
                  </label>
                  <input
                    type="date"
                    value={expenditureForm.expenditureDate}
                    onChange={(e) => setExpenditureForm({...expenditureForm, expenditureDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authorized By *
                  </label>
                  <input
                    type="text"
                    value={expenditureForm.authorizedBy}
                    onChange={(e) => setExpenditureForm({...expenditureForm, authorizedBy: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason *
                </label>
                <select
                  value={expenditureForm.reason}
                  onChange={(e) => setExpenditureForm({...expenditureForm, reason: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select reason</option>
                  <option value="Training">Training</option>
                  <option value="Combat Operations">Combat Operations</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Damage">Damage</option>
                  <option value="Lost">Lost</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={expenditureForm.notes}
                  onChange={(e) => setExpenditureForm({...expenditureForm, notes: e.target.value})}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowExpenditureForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Record Expenditure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
