
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Filter, Package } from 'lucide-react';

const Assets = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    equipmentTypeId: '',
    baseId: '',
    quantity: '',
    unitValue: '',
    status: 'available',
    notes: ''
  });
  const [filters, setFilters] = useState({
    search: '',
    baseId: '',
    equipmentType: '',
    status: ''
  });
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
    fetchReferenceData();
  }, [filters]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAssets(filters);
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
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
      await apiService.createAsset(formData);
      setShowForm(false);
      setFormData({
        name: '',
        serialNumber: '',
        equipmentTypeId: '',
        baseId: '',
        quantity: '',
        unitValue: '',
        status: 'available',
        notes: ''
      });
      fetchAssets();
    } catch (error) {
      console.error('Error creating asset:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Asset Registry</h1>
          <p className="text-gray-600 mt-1">Complete inventory of military assets</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search assets..."
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
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <Package size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{asset.name}</h3>
                  <p className="text-sm text-gray-600">{asset.equipmentType}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                {asset.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Serial Number:</span>
                <span className="font-medium">{asset.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base:</span>
                <span className="font-medium">{asset.baseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{asset.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unit Value:</span>
                <span className="font-medium">${asset.unitValue?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium text-emerald-600">
                  ${(asset.quantity * asset.unitValue)?.toFixed(2)}
                </span>
              </div>
            </div>
            
            {asset.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600">{asset.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {assets.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-600">Add your first asset to get started.</p>
        </div>
      )}

      {/* Asset Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Add New Asset</h2>
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
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment Type *
                  </label>
                  <select
                    value={formData.equipmentTypeId}
                    onChange={(e) => setFormData({...formData, equipmentTypeId: e.target.value})}
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
                    Unit Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitValue}
                    onChange={(e) => setFormData({...formData, unitValue: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="available">Available</option>
                  <option value="assigned">Assigned</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
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
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
