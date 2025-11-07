import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { signUp } from '../application/auth';
import appState from '../../../data/AppState';
import getCart from '../../Cart/application/cart';
import ButtonLoader from '../../../components/ButtonLoader';
import GLoginButton from './components/GLoginButton';

import farm from '../../../assets/farm.webp';
import icon from '../../../assets/logo.png';
import PasswordField from './components/PasswordField';

function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    userType: '',
    phone: ''
  });

  useEffect(() => {
    getLocation(setData, data);
    if (appState.isUserLoggedIn()) {
      navigate('/shop');
      toast('Logged in as ' + appState.getUserData().name);
    }
  }, []);

  const handleSignUp = async () => {
    if (data.email.length === 0) {
      toast.error('Enter your email to sign up');
      return;
    }

    if (data.password.length === 0) {
      toast.error('Enter your password to sign up');
      return;
    }

    if (data.userType.length === 0) {
      toast.error('Select your user type to register');
      return;
    }

    if (data.phone.length < 10) {
      toast.error('Enter a correct phone number to continue');
      return;
    }
    if (data.longitude === '' || data.latitude === '') {
      toast.error('Unable to get your location, try reloading the page or providing access.');
      return;
    }

    try {
      setLoading(true);
      const res = await signUp(data);
      if (res.statusCode === 200) {
        await getCart();
        navigate('/home');
      }
    } catch (error) {
      toast.error('Sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="float-right relative h-screen w-screen lg:w-[40%]">
        {/* Top Right Icon and Text */}
        <div className="absolute right-6 top-6 cursor-pointer z-[1] group" onClick={() => navigate('/')}>
          <img className="h-[75px] object-contain mr-1 transition-transform duration-300 group-hover:scale-110" src={icon} alt="" />
        </div>

        {/* Center Item  */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 max-w-lg mx-auto overflow-y-auto py-20">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-premium-600 to-premium-500 bg-clip-text text-transparent">Register to Farmerspot</h1>
          <p className="font-light text-gray-600 mt-2">Create an account</p>
          <div className="pt-8"></div>
          {/* Name Field */}
          <div className="flex flex-col w-[100%]">
            <label htmlFor="input" className="font-semibold text-gray-700 mb-2">Name</label>
            <input
              name="name"
              onChange={handleFieldChange}
              type="text"
              placeholder="Your full name"
              className="premium-input w-full mt-1 px-4 py-3"
            ></input>
          </div>
          <div className="pt-4"></div>
          {/* Email Field */}
          <div className="flex flex-col w-[100%]">
            <label htmlFor="input" className="font-semibold text-gray-700 mb-2">Email</label>
            <input
              name="email"
              onChange={handleFieldChange}
              type="email"
              placeholder="your@email.com"
              className="premium-input w-full mt-1 px-4 py-3"
            ></input>
          </div>
          <div className="pt-4"></div>
          {/* Password Field */}
          <PasswordField handleFieldChange={handleFieldChange} />
          <div className="pt-4"></div>
          {/* Customer Type */}
          <div className="flex flex-col w-[100%]">
            <label htmlFor="userType" className="font-semibold text-gray-700 mb-2">User Type</label>
            <select
              id="userType"
              name="userType"
              value={data.userType}
              onChange={handleFieldChange}
              className="premium-input w-full mt-1 px-4 py-3 appearance-none bg-white cursor-pointer"
            >
              <option value="">Select User Type</option>
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>
          <div className="pt-4"></div>
          {/* Phone Field */}
          <div className="flex flex-col w-[100%]">
            <label htmlFor="input" className="font-semibold text-gray-700 mb-2">Phone</label>
            <input
              name="phone"
              onChange={handleFieldChange}
              type="phone"
              placeholder="+1 234 567 8900"
              className="premium-input w-full mt-1 px-4 py-3"
            ></input>
          </div>
          <div className="pt-6"></div>
          <div className="flex flex-col w-full items-center gap-4">
            <button
              onClick={handleSignUp}
              className={`group relative w-full px-8 py-3.5 bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white font-semibold rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              <span className="relative z-10">{loading ? <ButtonLoader /> : 'Sign Up'}</span>
              {!loading && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>}
            </button>
            <GLoginButton />
          </div>
          <div className="mt-8">
            <p className="text-gray-600">
              {'Already have an account? '}
              <Link to="/auth" className="text-premium-600 font-bold hover:text-premium-700 transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
      {/* Image Part */}
      <section className="hidden lg:block float-left h-screen lg:w-[60%] relative overflow-hidden">
        <img className="w-[100%] h-[100%] object-cover" src={farm} alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-premium-900/20 to-transparent"></div>
      </section>
    </>
  );

  function handleFieldChange(e) {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }
}

export default SignUp;

/**
 * A function to get the current location of the user.
 * @param {function} setData
 */
const getLocation = (setData, data) => {
  function success(pos) {
    const crd = pos.coords;
    console.info('Your current position is:');
    console.info(`Latitude : ${crd.latitude}`);
    console.info(`Longitude: ${crd.longitude}`);

    setData({ ...data, latitude: crd.latitude, longitude: crd.longitude });
  }

  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  if (navigator.geolocation) {
    navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
      if (result.state === 'granted') {
        navigator.geolocation.getCurrentPosition(success, errors, options);
      } else if (result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(success, errors, options);
      } else if (result.state === 'denied') {
        toast.error('Please grant the location permission to continue');
      }
    });
  } else {
    console.warn('Geolocation is not supported by this browser.');
  }
};
