import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  DollarSign,
  Users,
  AlertCircle
} from 'lucide-react';
import { getFarmerOrders, getFarmerStats, updateOrderStatus } from '../../Checkout/application/order';
import { getFarmerReviews } from '../../Reviews/application/review';
import appState from '../../../data/AppState';
import Loading from '../../../components/Loading';
import QueryError from '../../../components/QueryError';
import { toast } from 'react-toastify';

function FarmerDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'reviews'
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: orders, isLoading: ordersLoading, isError: ordersError, error: ordersErrorMsg } = useQuery({
    queryKey: ['farmerOrders'],
    queryFn: () => getFarmerOrders(appState.getUserData()._id)
  });

  const { data: stats } = useQuery({
    queryKey: ['farmerStats'],
    queryFn: () => getFarmerStats(appState.getUserData()._id)
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['farmerReviews'],
    queryFn: () => getFarmerReviews(appState.getUserData()._id)
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success('Order status updated successfully');
      queryClient.invalidateQueries(['farmerOrders']);
      queryClient.invalidateQueries(['farmerStats']);
    },
    onError: (error) => {
      toast.error('Failed to update status: ' + error.message);
    }
  });

  useEffect(() => {
    if (!appState.isFarmer()) {
      toast.error('Only farmers can access this page');
      navigate('/shop');
    }
  }, [navigate]);

  if (ordersLoading) return <Loading />;
  if (ordersError) return <QueryError error={ordersErrorMsg} />;

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ready':
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders?.filter(o => o.status === filterStatus);

  const pendingOrders = orders?.filter((o) => o.status === 'pending') || [];

  return (
    <div className="min-h-screen px-[5vw] mt-[14vh] mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Farmer Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your orders and see customer feedback</p>
          </div>
          <button
            onClick={() => navigate('/additem')}
            className="px-6 py-3 bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white font-semibold rounded-xl shadow-premium transition-all duration-300"
          >
            Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="premium-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-premium-700">{stats.totalOrders}</p>
                </div>
                <Package className="text-premium-500" size={40} />
              </div>
            </div>

            <div className="premium-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <Clock className="text-yellow-500" size={40} />
              </div>
            </div>

            <div className="premium-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
                </div>
                <CheckCircle className="text-green-500" size={40} />
              </div>
            </div>

            <div className="premium-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-premium-700">₦{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="text-premium-500" size={40} />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-premium-500 to-premium-600 text-white shadow-premium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={20} />
              Orders
            </div>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-premium-500 to-premium-600 text-white shadow-premium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star size={20} />
              Reviews ({reviewsData?.totalReviews || 0})
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'orders' ? (
          <>
            {/* Pending Alert */}
            {pendingOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card bg-yellow-50 border-2 border-yellow-300 p-4 mb-6"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-yellow-600" size={24} />
                  <p className="text-yellow-800 font-semibold">
                    You have <strong>{pendingOrders.length}</strong> pending order(s) waiting for confirmation.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {!filteredOrders || filteredOrders.length === 0 ? (
                <div className="premium-card p-12 text-center">
                  <Package size={60} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600">
                    No {filterStatus === 'all' ? '' : filterStatus} orders
                  </h3>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="premium-card p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-premium-700">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-NG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="text-premium-600" size={20} />
                        <h4 className="font-semibold">Customer Details</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-semibold">{order.customerId?.name || 'Unknown'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <span className="ml-2 font-semibold">{order.deliveryAddress.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-semibold mb-3">Items ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} × ₦{item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-bold">₦{(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Actions */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-semibold mb-3">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(order._id, 'confirmed')}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                              >
                                Confirm Order
                              </button>
                              <button
                                onClick={() => handleStatusChange(order._id, 'cancelled')}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(order._id, 'preparing')}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                            >
                              Start Preparing
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => handleStatusChange(order._id, 'ready')}
                              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all"
                            >
                              Mark as Ready
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button
                              onClick={() => handleStatusChange(order._id, 'delivered')}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all"
                            >
                              Mark as Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-extrabold bg-gradient-to-r from-premium-600 to-premium-500 bg-clip-text text-transparent">
                        ₦{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Reviews Tab */
          <div className="space-y-6">
            {reviewsLoading ? (
              <Loading />
            ) : !reviewsData?.reviews || reviewsData.reviews.length === 0 ? (
              <div className="premium-card p-12 text-center">
                <Star size={60} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
                <p className="text-gray-500">Your customers will leave reviews here</p>
              </div>
            ) : (
              <>
                {/* Overall Rating */}
                <div className="premium-card p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-premium-700 mb-2">
                        {reviewsData.averageRating}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={star <= Math.round(reviewsData.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{reviewsData.totalReviews} reviews</p>
                    </div>
                    <div className="flex-1 border-l pl-6">
                      <h3 className="font-semibold text-lg mb-2">Customer Satisfaction</h3>
                      <p className="text-gray-600">
                        Your customers are {reviewsData.averageRating >= 4 ? 'very happy' : reviewsData.averageRating >= 3 ? 'satisfied' : 'need attention'} with your products
                      </p>
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                {reviewsData.reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="premium-card p-6"
                  >
                    <div className="flex gap-4">
                      {review.productId?.images && (
                        <img
                          src={review.productId.images[0]}
                          alt={review.productId.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{review.productId?.name}</h4>
                            <p className="text-sm text-gray-600">
                              by {review.customerId?.name} •{' '}
                              {new Date(review.createdAt).toLocaleDateString('en-NG')}
                            </p>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 mt-2">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default FarmerDashboard;
