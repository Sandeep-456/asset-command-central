
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Filter, Download } from 'lucide-react';

const Purchases = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    equipmentType: '',
    quantity: '',
    unitCost: '',
    vendor: '',
    purchaseOrder: '',
    baseId: '',
    notes: ''
  });
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    baseId: '',
    equipmentType: ''
  });
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
    fetchReferenceData();
  }, [filters]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPurchases(filters);
      setPurchases(data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [basesData, equipmentTypesData] = await Promise.all([
        apiService.getBases(),
        apiService.getEquipmentTypes()
      ]);
      setBases(basesData);
      setEquipmentTypes(equipmentTypesData);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createPurchase(formData);
      setShowForm(false);
      setFormData({
        equipmentType: '',
        quantity: '',
        unitCost: '',
        vendor: '',
        purchaseOrder: '',
        baseId: '',
        notes: ''
      });
      fetchPurchases();
    } catch (error) {
      console.error('Error creating purchase:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
          <p className="text-gray-600 mt-1">Track and manage asset purchases</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} />
          <span>New Purchase</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search purchases..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div>
            <select
              name="baseId"
              value={filters.baseId}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Bases</option>
              {bases.map(base => (
                <option key={base.id} value={base.id}>{base.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="equipmentType"
              value={filters.equipmentType}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Equipment</option>
              {equipmentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Equipment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Unit Cost</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Vendor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Base</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {purchase.equipmentType}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {purchase.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    ${purchase.unitCost?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    ${(purchase.quantity * purchase.unitCost)?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {purchase.vendor}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {purchase.baseName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {purchases.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No purchases found
          </div>
        )}
      </div>

      {/* Purchase Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">New Purchase</h2>
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
                    Equipment Type *
                  </label>
                  <select
                    value={formData.equipmentType}
                    onChange={(e) => setFormData({...formData, equipmentType: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Select equipment type</option>
                    {equipmentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base *
                  </label>
                  <select
                    value={formData.baseId}
                    onChange={(e) => setFormData({...formData, baseId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Select base</option>
                    {bases.map(base => (
                      <option key={base.id} value={base.id}>{base.name}</option>
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
                    Unit Cost *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitCost}
                    onChange={(e) => setFormData({...formData, unitCost: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor *
                  </label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Order
                  </label>
                  <input
                    type="text"
                    value={formData.purchaseOrder}
                    onChange={(e) => setFormData({...formData, purchaseOrder: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
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
                  Create Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
