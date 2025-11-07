import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { getFarmerOrders, getFarmerStats, updateOrderStatus } from '../../Checkout/application/order';
import appState from '../../../data/AppState';
import Loading from '../../../components/Loading';
import QueryError from '../../../components/QueryError';
import { toast } from 'react-toastify';

function FarmerOrders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['farmerOrders'],
    queryFn: () => getFarmerOrders(appState.getUserData()._id)
  });

  const { data: stats } = useQuery({
    queryKey: ['farmerStats'],
    queryFn: () => getFarmerStats(appState.getUserData()._id)
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['farmerOrders']);
      queryClient.invalidateQueries(['farmerStats']);
    }
  });

  useEffect(() => {
    if (!appState.isFarmer()) {
      toast.error('Only farmers can access this page');
      navigate('/shop');
    }
  }, [navigate]);

  if (isLoading) return <Loading />;
  if (isError) return <QueryError error={error} />;

  const pendingOrders = orders?.filter((o) => o.status === 'pending') || [];

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

  return (
    <div className="min-h-screen px-[10vw] mt-[14vh] mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Order Management</h1>

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
                  <p className="text-gray-600 text-sm">Delivered</p>
                  <p className="text-3xl font-bold text-green-600">{stats.deliveredOrders}</p>
                </div>
                <CheckCircle className="text-green-500" size={40} />
              </div>
            </div>

            <div className="premium-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-premium-700">₦{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="text-premium-500" size={40} />
              </div>
            </div>
          </div>
        )}

        {/* Pending Orders Alert */}
        {pendingOrders.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Clock className="text-yellow-400" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You have <strong>{pendingOrders.length}</strong> pending order(s) waiting for confirmation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Package size={80} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600">No orders yet</h2>
            <p className="text-gray-500">Orders from customers will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
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
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">Customer Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>{' '}
                      <span className="font-medium">{order.customerId?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>{' '}
                      <span className="font-medium">{order.deliveryAddress.phone}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Address:</span>{' '}
                      <span className="font-medium">
                        {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                        {order.deliveryAddress.state}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery Date:</span>{' '}
                      <span className="font-medium">
                        {new Date(order.deliverySlot.date).toLocaleDateString('en-NG')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time Slot:</span>{' '}
                      <span className="font-medium">{order.deliverySlot.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white p-3 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ₦{item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-premium-600">₦{item.subtotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total and Actions */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-premium-600 to-premium-500 bg-clip-text text-transparent">
                      ₦{order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Status Update Buttons */}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="flex flex-wrap gap-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(order._id, 'confirmed')}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Confirm Order
                          </button>
                          <button
                            onClick={() => handleStatusChange(order._id, 'cancelled')}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'preparing')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Mark as Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'ready')}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Mark as Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'shipped')}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Mark as Shipped
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'delivered')}
                          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="mt-3 flex gap-4 text-sm">
                    <span className="text-gray-600">
                      Payment: <span className="font-semibold uppercase">{order.paymentMethod}</span>
                    </span>
                    <span className="text-gray-600">
                      Status:{' '}
                      <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </span>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Customer Note:</strong> {order.notes}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default FarmerOrders;
