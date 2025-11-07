import appState from '../../../data/AppState';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Check if user is admin
 * @param {string} userId 
 * @returns {Promise<boolean>}
 */
export async function isAdmin(userId) {
  try {
    const response = await fetch(`${API_URL}/admin/isAdmin/${userId}`);
    const data = await response.json();
    return data.response?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Update price of a single item
 * @param {string} itemId 
 * @param {number} price 
 * @returns {Promise<Object>}
 */
export async function updateItemPrice(itemId, price) {
  try {
    const response = await fetch(`${API_URL}/admin/updatePrice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemId,
        adminId: appState.getUserData()._id,
        price: parseFloat(price)
      })
    });
    const data = await response.json();
    
    if (data.statusCode !== 200) {
      throw new Error(data.message || 'Failed to update price');
    }
    
    return data.data; // Return data.data not data.response
  } catch (error) {
    console.error('Error updating item price:', error);
    throw error;
  }
}

/**
 * Bulk update prices for multiple items
 * @param {Array<{itemId: string, price: number}>} updates 
 * @returns {Promise<Object>}
 */
export async function bulkUpdatePrices(updates) {
  try {
    const response = await fetch(`${API_URL}/admin/bulkUpdatePrices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adminId: appState.getUserData()._id,
        updates
      })
    });
    const data = await response.json();
    
    if (data.statusCode !== 200) {
      throw new Error(data.message || 'Failed to bulk update prices');
    }
    
    return data.data; // Return data.data not data.response
  } catch (error) {
    console.error('Error bulk updating prices:', error);
    throw error;
  }
}

/**
 * Delete an item
 * @param {string} itemId 
 * @returns {Promise<Object>}
 */
export async function deleteItem(itemId) {
  try {
    const response = await fetch(`${API_URL}/admin/deleteItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemId,
        adminId: appState.getUserData()._id
      })
    });
    const data = await response.json();
    
    if (data.statusCode !== 200) {
      throw new Error(data.message || 'Failed to delete item');
    }
    
    return data.data; // Return data.data not data.response
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}
