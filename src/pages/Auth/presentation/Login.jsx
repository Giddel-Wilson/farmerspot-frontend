import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import appState from '../../../data/AppState';
import getCart from '../../Cart/application/cart';
import login from '../application/auth';
import ButtonLoader from '../../../components/ButtonLoader';
import GLoginButton from './components/GLoginButton';

import farm from '../../../assets/farm.webp';
import icon from '../../../assets/logo.png';
import PasswordField from './components/PasswordField';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email.length === 0) {
      toast.error('Enter your email to login 😥');
      return;
    }

    if (password.length === 0) {
      toast.error('Enter your password to login 😥');
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.statusCode === 200) {
        await getCart();
        navigate('/home');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error while logging in');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appState.isUserLoggedIn()) {
      navigate('/shop');
      toast('Logged in as ' + appState.getUserData().name);
    }
  }, []);

  return (
    <>
      <section className="float-right relative h-screen w-screen lg:w-[40%]">
        {/* Top Right Icon and Text */}
        <div className="absolute right-6 top-6 cursor-pointer z-[1] group" onClick={() => navigate('/')}>
          <img className="h-[75px] object-contain mr-1 transition-transform duration-300 group-hover:scale-110" src={icon} alt="" />
        </div>

        {/* Center Item  */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 max-w-lg mx-auto">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-premium-600 to-premium-500 bg-clip-text text-transparent">Welcome to Farmerspot</h1>
          <p className="font-light text-gray-600 mt-2">Please enter your details</p>
          <div className="pt-10"></div>

          {/* Email Field */}

          <div className="flex flex-col w-[100%]">
            <label htmlFor="input" className="font-semibold text-gray-700 mb-2">Email</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase());
              }}
              type="email"
              placeholder="your@email.com"
              className="premium-input w-full mt-1 px-4 py-3"
            />
          </div>
          <div className="pt-4"></div>
          {/* Password Field */}
          <PasswordField handleFieldChange={(e) => setPassword(e.target.value)} />
          <div className="pt-6"></div>
          {/* Button */}
          <button
            onClick={handleLogin}
            className={`group relative w-full px-8 py-3.5 bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white font-semibold rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ${loading ? ' cursor-not-allowed opacity-70' : ''}`}
            disabled={loading}
          >
            <span className="relative z-10">{loading ? <ButtonLoader /> : 'Login'}</span>
            {!loading && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>}
          </button>
          <div className="mt-4 w-full">
            <GLoginButton />
          </div>
          <div className="mt-10">
            <p className="text-gray-600">
              {"Don't have an account? "}
              <Link to="/register" className="text-premium-600 font-bold hover:text-premium-700 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
      {/* Image Part */}
      <section className="hidden lg:block float-left h-screen lg:w-[60%] bg-green-300">
        <img className="w-[100%] h-[100%] object-cover" src={farm} alt="" />
      </section>
    </>
  );
}

export default Login;
