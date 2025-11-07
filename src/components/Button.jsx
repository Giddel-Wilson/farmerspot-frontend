import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

function NavigationButton({ text = 'Button', additionalClasses = '', path = '/' }) {
  const navigate = useNavigate();
  return (
    <button
      className={`group relative px-8 py-3.5 bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white font-semibold rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ${additionalClasses}`}
      onClick={() => {
        navigate(path);
      }}
    >
      <span className="relative z-10">{text}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
    </button>
  );
}

NavigationButton.propTypes = {
  text: PropTypes.string.isRequired,
  additionalClasses: PropTypes.string,
  path: PropTypes.string.isRequired
}

export function ClickActionButton ({
  text = 'Button',
  additionalClasses = '',
  onClick
}) {
  return (
    <button 
      className={`group relative px-8 py-3.5 bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white font-semibold rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ${additionalClasses}`}
      onClick={onClick}
    >
      <span className="relative z-10">{text}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
    </button>
  );
}


ClickActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  additionalClasses: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default NavigationButton

