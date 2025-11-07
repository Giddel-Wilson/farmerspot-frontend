const API_URL = import.meta.env.VITE_API_URL;

/**
 * Create a review for a product
 * @param {Object} reviewData 
 * @returns {Promise<Object>}
 */
export async function createReview(reviewData) {
  try {
    const response = await fetch(`${API_URL}/review/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });
    const data = await response.json();
    
    if (data.statusCode !== 200) {
      throw new Error(data.message || 'Failed to create review');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

/**
 * Get reviews for a product
 * @param {string} productId 
 * @returns {Promise<Object>}
 */
export async function getProductReviews(productId) {
  try {
    const response = await fetch(`${API_URL}/review/product/${productId}`);
    const data = await response.json();
    
    if (data.statusCode !== 200) {
      throw new Error(data.message || 'Failed to fetch reviews');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
}

/**
 * Get reviews for a farmer
 * @param {string} farmerId 
 * @returns {Promise<Object>}
 */
export async function getFarmerReviews(farmerId) {
  try {
    const response = await fetch(`${API_URL}/review/farmer/${farmerId}`);
    const data = await response.json();
    
    if (data.statusCode !== 200) {
      throw new Error(data.message || 'Failed to fetch farmer reviews');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching farmer reviews:', error);
    throw error;
  }
}

/**
 * Check if customer can review an order
 * @param {string} orderId 
 * @param {string} customerId 
 * @returns {Promise<Object>}
 */
export async function canReviewOrder(orderId, customerId) {
  try {
    const response = await fetch(`${API_URL}/review/can-review/${orderId}/${customerId}`);
    const data = await response.json();
    
    if (data.statusCode !== 200) {
      throw new Error(data.message || 'Failed to check review status');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error checking review status:', error);
    throw error;
  }
}
