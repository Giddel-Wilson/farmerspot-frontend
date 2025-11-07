import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import getCart from '../../Cart/application/cart';
import { getItem, getUserFromId } from '../../shop/application/shop';
import { createOrder } from '../application/order';
import appState from '../../../data/AppState';
import Loading from '../../../components/Loading';
import { MapPin, Calendar, CreditCard, Truck } from 'lucide-react';

function Checkout() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    phone: ''
  });
  
  const [deliverySlot, setDeliverySlot] = useState({
    date: '',
    timeSlot: '9AM-12PM'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart()
  });

  useEffect(() => {
    if (!appState.isCustomer()) {
      toast.error('Only customers can checkout');
      navigate('/shop');
    }
  }, [navigate]);

  if (isLoading) return <Loading />;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate('/shop')}
          className="btn btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleCheckout = async () => {
    // Validation
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.phone) {
      toast.error('Please fill in all delivery address fields');
      return;
    }

    if (!deliverySlot.date) {
      toast.error('Please select a delivery date');
      return;
    }

    setIsSubmitting(true);

    try {
      // Fetch all product details
      const itemDetails = await Promise.all(
        cartItems.map(async (cartItem) => {
          const product = await getItem(cartItem.item);
          const farmer = await getUserFromId(product.listedBy);
          return {
            product,
            farmer,
            quantity: cartItem.count
          };
        })
      );

      // Group by farmer
      const ordersByFarmer = {};
      itemDetails.forEach(({ product, farmer, quantity }) => {
        if (!ordersByFarmer[farmer._id]) {
          ordersByFarmer[farmer._id] = {
            farmerId: farmer._id,
            items: []
          };
        }
        ordersByFarmer[farmer._id].items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          subtotal: product.price * quantity
        });
      });

      // Create orders for each farmer
      const orders = await Promise.all(
        Object.values(ordersByFarmer).map(async (farmerOrder) => {
          const totalAmount = farmerOrder.items.reduce((sum, item) => sum + item.subtotal, 0);
          
          const orderData = {
            customerId: appState.getUserData()._id,
            farmerId: farmerOrder.farmerId,
            items: farmerOrder.items,
            totalAmount,
            paymentMethod,
            deliveryAddress,
            deliverySlot: {
              date: new Date(deliverySlot.date),
              timeSlot: deliverySlot.timeSlot
            },
            deliveryFee: 0,
            notes
          };

          return await createOrder(orderData);
        })
      );

      if (orders.every(order => order !== null)) {
        toast.success(`${orders.length} order(s) placed successfully!`);
        navigate('/orders');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.count * 100); // Placeholder, will be calculated properly
    }, 0);
  };

  return (
    <div className="min-h-screen px-[10vw] mt-[14vh] mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="premium-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-premium-600" size={24} />
                <h2 className="text-2xl font-bold">Delivery Address</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Street Address</label>
                  <input
                    type="text"
                    className="premium-input w-full"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">City</label>
                    <input
                      type="text"
                      className="premium-input w-full"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                      placeholder="Lagos"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">State</label>
                    <input
                      type="text"
                      className="premium-input w-full"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                      placeholder="Lagos State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="premium-input w-full"
                    value={deliveryAddress.phone}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Slot */}
            <div className="premium-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-premium-600" size={24} />
                <h2 className="text-2xl font-bold">Delivery Schedule</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Delivery Date</label>
                  <input
                    type="date"
                    className="premium-input w-full"
                    value={deliverySlot.date}
                    onChange={(e) => setDeliverySlot({ ...deliverySlot, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Time Slot</label>
                  <select
                    className="premium-input w-full"
                    value={deliverySlot.timeSlot}
                    onChange={(e) => setDeliverySlot({ ...deliverySlot, timeSlot: e.target.value })}
                  >
                    <option value="9AM-12PM">9:00 AM - 12:00 PM</option>
                    <option value="12PM-3PM">12:00 PM - 3:00 PM</option>
                    <option value="3PM-6PM">3:00 PM - 6:00 PM</option>
                    <option value="6PM-9PM">6:00 PM - 9:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="premium-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-premium-600" size={24} />
                <h2 className="text-2xl font-bold">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-xl hover:border-premium-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="radio radio-primary"
                  />
                  <div>
                    <div className="font-semibold">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive your order</div>
                  </div>
                </label>

                {/* <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-xl hover:border-premium-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="radio radio-primary"
                  />
                  <div>
                    <div className="font-semibold">Pay Online (Paystack)</div>
                    <div className="text-sm text-gray-600">Pay securely with card or bank transfer</div>
                  </div>
                </label> */}
              </div>
            </div>

            {/* Order Notes */}
            <div className="premium-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="text-premium-600" size={24} />
                <h2 className="text-2xl font-bold">Delivery Instructions</h2>
              </div>

              <textarea
                className="premium-input w-full"
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for delivery? (Optional)"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="premium-card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>Item {index + 1} x {item.count}</span>
                    <span className="font-semibold">₦{(item.count * 1000).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₦{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">₦0.00</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-4">
                  <span>Total</span>
                  <span className="text-premium-600">₦{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full mt-6 bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white py-4 rounded-xl font-semibold shadow-premium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Checkout;
