import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:invoke>
<invoke name="react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Truck, Star, TrendingUp, ShoppingBag } from 'lucide-react';
import { getCustomerOrders } from '../../Checkout/application/order';
import { canReviewOrder, createReview } from '../../Reviews/application/review';
import appState from '../../../data/AppState';
import Loading from '../../../components/Loading';
import QueryError from '../../../components/QueryError';
import { toast } from 'react-toastify';

function Orders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewModal, setReviewModal] = useState({ open: false, product: null, orderId: null });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getCustomerOrders(appState.getUserData()._id)
  });

  useEffect(() => {
    if (!appState.isCustomer()) {
      navigate('/shop');
    }
  }, [navigate]);

  if (isLoading) return <Loading />;
  if (isError) return <QueryError error={error} />;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" />;
      case 'confirmed':
      case 'preparing':
        return <Package className="text-blue-500" />;
      case 'shipped':
      case 'ready':
        return <Truck className="text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="text-green-500" />;
      case 'cancelled':
        return <XCircle className="text-red-500" />;
      default:
        return <Package />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen px-[10vw] mt-[14vh] mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Package size={80} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to place your first order</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white px-8 py-3 rounded-xl font-semibold shadow-premium transition-all duration-300 hover:scale-105"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="premium-card p-6 cursor-pointer hover:shadow-premium-lg transition-all duration-300"
                onClick={() => navigate(`/order/${order._id}`)}
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
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Farmer:</span>
                    <span className="font-semibold">{order.farmerId?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-semibold">{order.items.length} item(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-semibold uppercase">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-semibold">
                      {new Date(order.deliverySlot.date).toLocaleDateString('en-NG')} - {order.deliverySlot.timeSlot}
                    </span>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-premium-600 to-premium-500 bg-clip-text text-transparent">
                      ₦{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Orders;
