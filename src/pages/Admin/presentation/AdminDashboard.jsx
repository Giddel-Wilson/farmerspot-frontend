import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Package, Edit2, Save, X } from 'lucide-react';
import { getAllItems } from '../../shop/application/shop';
import { updateItemPrice, bulkUpdatePrices } from '../application/admin';
import appState from '../../../data/AppState';
import Loading from '../../../components/Loading';
import QueryError from '../../../components/QueryError';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingItems, setEditingItems] = useState({});
  const [bulkChanges, setBulkChanges] = useState({});

  const { data: items, isLoading, isError, error } = useQuery({
    queryKey: ['items'],
    queryFn: getAllItems
  });

  const updatePriceMutation = useMutation({
    mutationFn: ({ itemId, price }) => updateItemPrice(itemId, price),
    onSuccess: (data) => {
      toast.success(`Price updated from ₦${data.oldPrice} to ₦${data.newPrice}`);
      queryClient.invalidateQueries(['items']);
      queryClient.invalidateQueries(['item', data.item._id]);
      setEditingItems({});
      setBulkChanges({});
    },
    onError: (error) => {
      toast.error('Failed to update price: ' + error.message);
    }
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: (updates) => bulkUpdatePrices(updates),
    onSuccess: (data) => {
      toast.success(`Updated ${data.updated} items successfully`);
      if (data.failed > 0) {
        toast.warning(`Failed to update ${data.failed} items`);
      }
      queryClient.invalidateQueries(['items']);
      setBulkChanges({});
      setEditingItems({});
    },
    onError: (error) => {
      toast.error('Failed to bulk update prices: ' + error.message);
    }
  });

  useEffect(() => {
    if (!appState.isAdmin()) {
      toast.error('Only admins can access this page');
      navigate('/shop');
    }
  }, [navigate]);

  if (isLoading) return <Loading />;
  if (isError) return <QueryError error={error} />;

  const handleEditClick = (itemId, currentPrice) => {
    setEditingItems({ ...editingItems, [itemId]: true });
    setBulkChanges({ ...bulkChanges, [itemId]: currentPrice });
  };

  const handleCancelEdit = (itemId) => {
    const newEditing = { ...editingItems };
    const newChanges = { ...bulkChanges };
    delete newEditing[itemId];
    delete newChanges[itemId];
    setEditingItems(newEditing);
    setBulkChanges(newChanges);
  };

  const handlePriceChange = (itemId, newPrice) => {
    setBulkChanges({ ...bulkChanges, [itemId]: parseFloat(newPrice) });
  };

  const handleSingleUpdate = (itemId) => {
    const newPrice = bulkChanges[itemId];
    if (newPrice !== undefined && newPrice >= 0) {
      updatePriceMutation.mutate({ itemId, price: newPrice });
    }
  };

  const handleBulkUpdate = () => {
    const updates = Object.entries(bulkChanges).map(([itemId, price]) => ({
      itemId,
      price
    }));
    
    if (updates.length === 0) {
      toast.warning('No changes to save');
      return;
    }
    
    bulkUpdateMutation.mutate(updates);
  };

  const hasChanges = Object.keys(bulkChanges).length > 0;

  return (
    <div className="min-h-screen px-[5vw] mt-[14vh] mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage product prices</p>
          </div>
          
          {hasChanges && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleBulkUpdate}
              disabled={bulkUpdateMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white font-semibold rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-300"
            >
              <Save size={20} />
              Save All Changes ({Object.keys(bulkChanges).length})
            </motion.button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="premium-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="text-premium-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
            </div>
            <p className="text-3xl font-bold text-premium-700">{items?.length || 0}</p>
          </div>
          
          <div className="premium-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Edit2 className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-700">Editing</h3>
            </div>
            <p className="text-3xl font-bold text-blue-700">{Object.keys(editingItems).length}</p>
          </div>
          
          <div className="premium-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-700">Pending Changes</h3>
            </div>
            <p className="text-3xl font-bold text-green-700">{Object.keys(bulkChanges).length}</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Farmer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Current Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{item.listedBy}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.stock > 50 ? 'bg-green-100 text-green-800' :
                        item.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingItems[item._id] ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={bulkChanges[item._id] || item.price}
                          onChange={(e) => handlePriceChange(item._id, e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-500 focus:border-transparent"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <p className="font-bold text-premium-700">₦{item.price}/{item.unit}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {editingItems[item._id] ? (
                          <>
                            <button
                              onClick={() => handleSingleUpdate(item._id)}
                              className="p-2 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white rounded-lg transition-all duration-300"
                              title="Save"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={() => handleCancelEdit(item._id)}
                              className="p-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition-all duration-300"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditClick(item._id, item.price)}
                            className="p-2 bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg transition-all duration-300"
                            title="Edit Price"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
