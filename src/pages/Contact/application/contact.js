import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Submit contact form data to the backend
 * @param {Object} formData
 * @param {string} formData.name - Contact name
 * @param {string} formData.email - Contact email
 * @param {string} formData.phone - Contact phone (optional)
 * @param {string} formData.subject - Message subject
 * @param {string} formData.message - Message content
 * @returns {Promise<boolean>}
 */
export async function submitContactForm(formData) {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL + '/contact/submit',
      formData
    );

    if (res.data.statusCode === 200) {
      toast.success(res.data.message || 'Message sent successfully! We will get back to you soon.');
      return true;
    } else {
      toast.error(res.data.message || 'Failed to send message');
      return false;
    }
  } catch (error) {
    console.error('Contact form error:', error);
    toast.error('An error occurred while sending your message. Please try again.');
    return false;
  }
}
