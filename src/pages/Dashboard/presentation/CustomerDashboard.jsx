import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Star,
  TrendingUp,
  ShoppingBag,
  X
} from 'lucide-react';
import { getCustomerOrders } from '../../Checkout/application/order';
import { canReviewOrder, createReview } from '../../Reviews/application/review';
import appState from '../../../data/AppState';
import Loading from '../../../components/Loading';
import QueryError from '../../../components/QueryError';
import { toast } from 'react-toastify';

function CustomerDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviewModal, setReviewModal] = useState({ open: false, product: null, orderId: null, farmerId: null });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: () => getCustomerOrders(appState.getUserData()._id)
  });

  const reviewMutation = useMutation({
    mutationFn: (reviewData) => createReview(reviewData),
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      setReviewModal({ open: false, product: null, orderId: null, farmerId: null });
      setRating(5);
      setComment('');
      queryClient.invalidateQueries(['customerOrders']);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit review');
    }
  });

  useEffect(() => {
    if (!appState.isCustomer()) {
      toast.error('Only customers can access this page');
      navigate('/shop');
    }
  }, [navigate]);

  if (isLoading) return <Loading />;
  if (isError) return <QueryError error={error} />;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'confirmed':
      case 'preparing':
        return <Package className="text-blue-500" size={20} />;
      case 'shipped':
      case 'ready':
        return <Truck className="text-purple-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Package size={20} />;
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

  const handleReview = (product, orderId, farmerId) => {
    // Extract the ID if farmerId is an object, otherwise use as-is
    const farmerIdValue = typeof farmerId === 'object' ? farmerId._id : farmerId;
    setReviewModal({ open: true, product, orderId, farmerId: farmerIdValue });
  };

  const submitReview = () => {
    if (!reviewModal.product || !reviewModal.orderId) return;

    reviewMutation.mutate({
      orderId: reviewModal.orderId,
      customerId: appState.getUserData()._id,
      productId: reviewModal.product.productId,
      farmerId: reviewModal.farmerId,
      rating,
      comment
    });
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders?.filter(o => o.status === filterStatus);

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    delivered: orders?.filter(o => o.status === 'delivered').length || 0,
    cancelled: orders?.filter(o => o.status === 'cancelled').length || 0
  };

  return (
    <div className="min-h-screen px-[5vw] mt-[14vh] mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your orders and share your experience</p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white font-semibold rounded-xl shadow-premium transition-all duration-300"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="premium-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-premium-700">{stats.total}</p>
              </div>
              <Package className="text-premium-500" size={40} />
            </div>
          </div>

          <div className="premium-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="text-yellow-500" size={40} />
            </div>
          </div>

          <div className="premium-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Delivered</p>
                <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="text-green-500" size={40} />
            </div>
          </div>

          <div className="premium-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Cancelled</p>
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="text-red-500" size={40} />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-premium-500 to-premium-600 text-white shadow-premium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Package size={80} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
            </h2>
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
            {filteredOrders.map((order) => (
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
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold mb-3">Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × ₦{item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold">₦{(item.quantity * item.price).toFixed(2)}</p>
                        
                        {/* Review Button for Delivered Orders */}
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => handleReview(item, order._id, order.farmerId)}
                            className="ml-4 flex items-center gap-1 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-500 text-yellow-600 hover:text-white rounded-lg transition-all duration-300 text-sm font-semibold"
                          >
                            <Star size={16} />
                            Review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Farmer:</span>
                    <span className="font-semibold">{order.farmerId?.name || 'Unknown'}</span>
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

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setReviewModal({ open: false, product: null, orderId: null, farmerId: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Write a Review</h2>
                <button
                  onClick={() => setReviewModal({ open: false, product: null, orderId: null, farmerId: null })}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <p className="font-semibold text-lg mb-2">{reviewModal.product?.name}</p>
                <p className="text-gray-600 text-sm">
                  How was your experience with this product?
                </p>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-premium-500 focus:border-transparent resize-none"
                  rows="4"
                  maxLength="500"
                />
                <p className="text-xs text-gray-500 mt-1">{comment.length}/500</p>
              </div>

              {/* Submit Button */}
              <button
                onClick={submitReview}
                disabled={reviewMutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white font-semibold rounded-xl shadow-premium transition-all duration-300 disabled:opacity-50"
              >
                {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CustomerDashboard;
