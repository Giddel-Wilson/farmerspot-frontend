import { useState, useEffect, useRef } from 'react';
import Loading from '../../../components/Loading';
import search, { getAutocompleteSuggestions } from '../application/search';
import { toast } from 'react-toastify';
import ShopItem from '../../../components/ShopItem';
import PropTypes from 'prop-types';

function Search() {
  const [loading, setLoading] = useState(false);
  /**
   * @type {[Item[]|null, function]}
   */
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery.length >= 2) {
      const results = await getAutocompleteSuggestions(searchQuery);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (value) => {
    setQuery(value);
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new timer for debounced search
    const timer = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
    
    setDebounceTimer(timer);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    // Automatically search when suggestion is clicked
    searchForQuery(suggestion);
  };

  const searchForQuery = async (searchQuery = query) => {
    setLoading(true);
    setShowSuggestions(false);
    if (searchQuery.length >= 3 && searchQuery) {
      const data = await search(searchQuery);
      setLoading(false);
      setItems(data);
      return;
    }
    setLoading(false);
    toast.info('Enter atleast 3 characters to search');
  };

  return (
    <>
      <section className="mt-[8vh] min-h-[100vh]">
        <div className="flex flex-row lg:mx-16 p-5 items-center relative">
          <div className="relative w-full mr-3">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                handleInputChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchForQuery();
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              autoFocus={true}
              type="text"
              placeholder="Enter your query"
              className="input input-bordered w-full py-3 px-2"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 border-b last:border-b-0"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => searchForQuery()} className="btn btn-accent px-4">
            Search
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : items != null ? (
          <LoadedPage items={items} />
        ) : (
          <div className="h-[50vh] flex flex-col justify-center items-center">
            <h2 className="text-gray-500">Search for products</h2>
          </div>
        )}
      </section>
    </>
  );
}

function LoadedPage({ items }) {
  return (
    <>
      <section className=" min-h-[92vh] w-[100%] p-6 lg:px-24 ">
        <h1 className="text-3xl font-bold">{items.length > 0 ? 'Results' : 'No Results'}</h1>
        <div className=" w-[100%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5  mt-5">
          {items.map((e) => (
            <ShopItem key={e._id} itemId={e._id} />
          ))}
        </div>
      </section>
    </>
  );
}

LoadedPage.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

export default Search;
