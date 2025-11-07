import { toast } from 'react-toastify';
import axios from 'axios';

/**
 *  Uploads a file to Cloudinary
 * @param {File} file
 * @returns {Promise<string?>} url
 */
export async function handleUpload(file) {
  if (!file) {
    toast.error('Please choose a file first!');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await axios.post(import.meta.env.VITE_API_URL + '/upload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.data.statusCode === 200) {
      return res.data.data.url;
    } else {
      console.error('Upload failed:', res.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
}

/**
 * Saves data to backend
 * @param {Object} data
 * @param {string} data.listedBy - The ID of the user who listed the item.
 * @param {string} data.name - The name of the item.
 * @param {string} data.description - The description of the item.
 * @param {string} data.price - The price of the item.
 * @param {string} data.file - The file of the item.

 * @returns {Promise<boolean>} true if successful, false otherwise
 */

export async function addItem(data) {
  const { listedBy, name, description, price, file } = data;

  try {
    const img = await handleUpload(file);

    const res = await axios.post(import.meta.env.VITE_API_URL + '/list/addItem', {
      listedBy,
      name,
      description,
      images: [img],
      price,
      comments: []
    });

    if (res.data.statusCode === 200) {
      toast.success(res.data.message);
      return true;
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (err) {
    console.warn(err);
    toast.error('Error uploading image');
    return false;
  }
}
