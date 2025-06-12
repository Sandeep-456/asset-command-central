
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, ArrowRight } from 'lucide-react';

const Transfers = () => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    fromBaseId: '',
    toBaseId: '',
    quantity: '',
    reason: '',
    notes: ''
  });
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
    fetchReferenceData();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTransfers();
      setTransfers(data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [assetsData, basesData] = await Promise.all([
        apiService.getAssets(),
        apiService.getBases()
      ]);
      setAssets(assetsData);
      setBases(basesData);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createTransfer(formData);
      setShowForm(false);
      setFormData({
        assetId: '',
        fromBaseId: '',
        toBaseId: '',
        quantity: '',
        reason: '',
        notes: ''
      });
      fetchTransfers();
    } catch (error) {
      console.error('Error creating transfer:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Transfers</h1>
          <p className="text-gray-600 mt-1">Manage asset transfers between bases</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} />
          <span>New Transfer</span>
        </button>
      </div>

      {/* Transfers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Asset</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">From Base</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">To Base</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(transfer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {transfer.assetName}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transfer.fromBaseName}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <ArrowRight size={16} className="text-gray-400" />
                      <span>{transfer.toBaseName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transfer.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transfer.reason}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transfer.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : transfer.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transfer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {transfers.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No transfers found
          </div>
        )}
      </div>

      {/* Transfer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">New Transfer</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset *
                  </label>
                  <select
                    value={formData.assetId}
                    onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Base *
                  </label>
                  <select
                    value={formData.fromBaseId}
                    onChange={(e) => setFormData({...formData, fromBaseId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Select source base</option>
                    {bases.map(base => (
                      <option key={base.id} value={base.id}>{base.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Base *
                  </label>
                  <select
                    value={formData.toBaseId}
                    onChange={(e) => setFormData({...formData, toBaseId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Select destination base</option>
                    {bases.filter(base => base.id !== formData.fromBaseId).map(base => (
                      <option key={base.id} value={base.id}>{base.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason *
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select reason</option>
                  <option value="Redeployment">Redeployment</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Redistribution">Redistribution</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Create Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;
