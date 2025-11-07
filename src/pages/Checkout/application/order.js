import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Create a new order
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>}
 */
export async function createOrder(orderData) {
  try {
    const res = await axios.post(import.meta.env.VITE_API_URL + '/orders/create', orderData);
    
    if (res.data.statusCode === 200) {
      toast.success('Order placed successfully!');
      return res.data.data;
    } else {
      toast.error(res.data.message);
      return null;
    }
  } catch (err) {
    toast.error('Error creating order: ' + err.message);
    return null;
  }
}

/**
 * Get customer orders
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>}
 */
export async function getCustomerOrders(customerId) {
  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + `/orders/customer/${customerId}`);
    
    if (res.data.statusCode === 200) {
      return res.data.data;
    } else {
      toast.error(res.data.message);
      return [];
    }
  } catch (err) {
    toast.error('Error fetching orders');
    return [];
  }
}

/**
 * Get farmer orders
 * @param {string} farmerId - Farmer ID
 * @returns {Promise<Array>}
 */
export async function getFarmerOrders(farmerId) {
  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + `/orders/farmer/${farmerId}`);
    
    if (res.data.statusCode === 200) {
      return res.data.data;
    } else {
      toast.error(res.data.message);
      return [];
    }
  } catch (err) {
    toast.error('Error fetching orders');
    return [];
  }
}

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>}
 */
export async function getOrderById(orderId) {
  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + `/orders/${orderId}`);
    
    if (res.data.statusCode === 200) {
      return res.data.data;
    } else {
      toast.error(res.data.message);
      return null;
    }
  } catch (err) {
    toast.error('Error fetching order');
    return null;
  }
}

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @param {string} note - Optional note
 * @returns {Promise<Object>}
 */
export async function updateOrderStatus(orderId, status, note = '') {
  try {
    const res = await axios.patch(
      import.meta.env.VITE_API_URL + `/orders/${orderId}/status`,
      { status, note }
    );
    
    if (res.data.statusCode === 200) {
      return res.data.data;
    } else {
      throw new Error(res.data.message || 'Failed to update order status');
    }
  } catch (err) {
    // Extract error message from axios error response
    const errorMessage = err.response?.data?.message || err.message || 'Error updating order status';
    console.error('Error updating order status:', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Cancel order
 * @param {string} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>}
 */
export async function cancelOrder(orderId, reason) {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL + `/orders/${orderId}/cancel`,
      { reason }
    );
    
    if (res.data.statusCode === 200) {
      toast.success('Order cancelled');
      return res.data.data;
    } else {
      toast.error(res.data.message);
      return null;
    }
  } catch (err) {
    toast.error('Error cancelling order');
    return null;
  }
}

/**
 * Get farmer statistics
 * @param {string} farmerId - Farmer ID
 * @returns {Promise<Object>}
 */
export async function getFarmerStats(farmerId) {
  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + `/orders/farmer/${farmerId}/stats`);
    
    if (res.data.statusCode === 200) {
      return res.data.data;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}
