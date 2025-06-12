
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  Activity,
  Filter,
  X,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [netMovementDetails, setNetMovementDetails] = useState(null);
  const [showNetMovementModal, setShowNetMovementModal] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    baseId: '',
    equipmentType: ''
  });
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchReferenceData();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDashboardMetrics(filters);
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const handleNetMovementClick = async () => {
    try {
      const details = await apiService.getNetMovementDetails(filters);
      setNetMovementDetails(details);
      setShowNetMovementModal(true);
    } catch (error) {
      console.error('Error fetching net movement details:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      baseId: '',
      equipmentType: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Opening Balance',
      value: metrics?.openingBalance || 0,
      icon: Package,
      color: 'blue',
      description: 'Assets at period start'
    },
    {
      title: 'Closing Balance',
      value: metrics?.closingBalance || 0,
      icon: Package,
      color: 'green',
      description: 'Assets at period end'
    },
    {
      title: 'Net Movement',
      value: metrics?.netMovement || 0,
      icon: Activity,
      color: 'purple',
      description: 'Click for details',
      clickable: true,
      onClick: handleNetMovementClick
    },
    {
      title: 'Assigned Assets',
      value: metrics?.assignedAssets || 0,
      icon: Users,
      color: 'orange',
      description: 'Currently assigned'
    },
    {
      title: 'Expended Assets',
      value: metrics?.expendedAssets || 0,
      icon: TrendingDown,
      color: 'red',
      description: 'Total expended'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of military asset operations</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <RefreshCw size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-800">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
            <select
              name="equipmentType"
              value={filters.equipmentType}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Types</option>
              {equipmentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X size={16} />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          const colorClasses = {
            blue: 'bg-blue-500 text-white',
            green: 'bg-green-500 text-white',
            purple: 'bg-purple-500 text-white',
            orange: 'bg-orange-500 text-white',
            red: 'bg-red-500 text-white'
          };

          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
                metric.clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
              }`}
              onClick={metric.onClick}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[metric.color]}`}>
                  <Icon size={24} />
                </div>
                {metric.clickable && (
                  <ArrowUpRight size={20} className="text-gray-400" />
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {metric.title}
                </h3>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {metric.value.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-medium text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {metrics?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          )) || (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Net Movement Modal */}
      {showNetMovementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Net Movement Details</h2>
              <button
                onClick={() => setShowNetMovementModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ArrowUpRight className="text-green-600" size={20} />
                    <h3 className="font-medium text-green-800">Purchases</h3>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {netMovementDetails?.purchases?.length || 0}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ArrowUpRight className="text-blue-600" size={20} />
                    <h3 className="font-medium text-blue-800">Transfers In</h3>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {netMovementDetails?.transfersIn?.length || 0}
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ArrowDownRight className="text-red-600" size={20} />
                    <h3 className="font-medium text-red-800">Transfers Out</h3>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {netMovementDetails?.transfersOut?.length || 0}
                  </div>
                </div>
              </div>
              
              {/* Detailed lists would go here */}
              <div className="text-center text-gray-500 py-8">
                Detailed transaction lists would be displayed here
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
