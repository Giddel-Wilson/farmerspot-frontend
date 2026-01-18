import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import appState from '../../data/AppState';
import cartEmitter, { getCartCount } from '../../pages/Cart/application/cart_event';

import logo from '../../assets/logo.png';

import { Search, User, ShoppingCart, LucideShoppingBag, Menu } from 'lucide-react';

import PropTypes from 'prop-types';

function NavBar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-[2] h-[8vh] w-[100%] bg-white/80 backdrop-blur-xl flex px-2 md:px-10 items-center shadow-lg border-b border-gray-100"
      >
        <Link to={'/shop'} className="group">
          <img className="h-[5rem] w-[5rem] py-3 object-contain transition-transform duration-300 group-hover:scale-110" src={logo} alt="" />
        </Link>
        <div className="flex flex-1"></div>

        {/* Desktop Icons */}
        <div className="group">
          <div 
            onClick={() => navigate('/search')} 
            className="cursor-pointer mx-3 p-2.5 rounded-xl hover:bg-premium-50 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Search className="text-gray-700 group-hover:text-premium-600" size={22} />
          </div>
        </div>

        <div className="hidden md:flex group">
          <div 
            onClick={() => navigate('/shop')}
            className="cursor-pointer mx-3 p-2.5 rounded-xl hover:bg-premium-50 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <LucideShoppingBag className="text-gray-700 group-hover:text-premium-600" size={22} />
          </div>
        </div>

        {appState.isLoggedIn && (
          <div className="hidden md:flex group">
            <div 
              onClick={() => navigate('/profile')} 
              className="cursor-pointer mx-3 p-2.5 rounded-xl hover:bg-premium-50 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <User className="text-gray-700 group-hover:text-premium-600" size={22} />
            </div>
          </div>
        )}

        <CartNotifier />

        <div className="dropdown dropdown-end ml-2">
          <label tabIndex={0} className="btn btn-ghost hover:bg-premium-50 border-0 rounded-xl">
            <Menu className="text-gray-700" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-3 shadow-premium bg-white rounded-2xl w-56 border border-gray-100 mt-2"
          >
            <NavBarItem text="Home" route="/home" />
            <NavBarItem text="About" route="/about" />
            <NavBarItem text="Contact Us" route="/contact" />
            
            {!appState.isLoggedIn && (
              <>
                <NavBarItem text="Login" route="/auth" />
                <NavBarItem text="Sign Up" route="/register" />
              </>
            )}
            
            {appState.isCustomer() && <NavBarItem text="My Orders" route="/orders" />}
            {appState.isFarmer() && <NavBarItem text="Manage Orders" route="/farmer/orders" />}
            {appState.isAdmin() && <NavBarItem text="Admin Dashboard" route="/admin/dashboard" />}
            
            {appState.isLoggedIn && (
              <li
                onClick={() => {
                  appState.logOutUser();
                  queryClient.removeQueries(['profile']);
                  queryClient.removeQueries(['cart']);
                  queryClient.removeQueries(['explore']);
                  queryClient.removeQueries(['items']);

                  navigate('/auth');
                }}
                className="hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <h6 className="text-red-600 font-medium">Logout</h6>
              </li>
            )}
          </ul>
        </div>
      </motion.header>
    </>
  );
}

function NavBarItem({ text = 'NavItem', route = '/' }) {
  const navigate = useNavigate();
  return (
    <li onClick={() => navigate(route)} className="hover:bg-premium-50 rounded-xl transition-all duration-200">
      <h6 className="font-medium text-gray-700 hover:text-premium-600">{text}</h6>
    </li>
  );
}

NavBarItem.propTypes = {
  text: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired
};

const CartNotifier = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  if (!appState.isCustomer()) return;

  useEffect(() => {
    console.info('NavBar.jsx: Adding Listener...');
    setCartCount(getCartCount());

    const listener = (count) => {
      console.info('Cart Counter notified: ', count);
      setCartCount(count);
    };

    cartEmitter.on('cartUpdate', listener);

    return () => {
      console.info('NavBar.jsx: Removing Listener...');
      cartEmitter.off('cartUpdate', listener);
    };
  }, []);

  return (
    <div className="group flex mr-3 relative" onClick={() => navigate('/cart')}>
      <div className="cursor-pointer p-2.5 rounded-xl hover:bg-premium-50 transition-all duration-300 hover:scale-110 active:scale-95">
        <ShoppingCart className="text-gray-700 group-hover:text-premium-600" size={22} />
      </div>
      {cartCount > 0 && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-5 h-5 text-center text-[11px] font-bold flex items-center justify-center absolute right-0 top-0 shadow-lg"
        >
          {cartCount}
        </motion.span>
      )}
    </div>
  );
};

export default NavBar;
