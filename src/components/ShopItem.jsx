import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import appState from '../data/AppState';
import { addToCart, removeFromCart } from '../pages/Cart/application/cart';
import { getItem, getUserFromId } from '../pages/shop/application/shop';
import TimeAgo from 'react-timeago';

import { Trash, Clock, Minus, Plus } from 'lucide-react';

import ImageView from './ImageView';
import { cn } from '../utils/cn';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ShimmerShopItem from './ShimmerShopItem';
import { toast } from 'react-toastify';

import useShopItemMutations from '../hooks/ShopItemHook';
import PropTypes from 'prop-types';

/**
 *
 * @param {Object} props
 * @param {string} props.itemId
 * @param {number} props.itemCount
 * @param {boolean} props.isCart
 * @param {boolean} props.isInCart
 * @param {function(Item): void} props.onDelete
 * @returns {JSX.Element}
 */
function ShopItem({ itemId, itemCount = 1, isCart = false, isInCart = false, onDelete }) {
  /** @type {[number, function]} */
  const [count, setCount] = useState(itemCount);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['item', itemId],
    queryFn: async () => {
      const item = await getItem(itemId);

      if (!item) throw Error('An error occured while loading item!');

      const user = await getUserFromId(item?.listedBy);

      if (!user) throw Error('An error occured while loading item!');
      return {
        item,
        user
      };
    }
  });

  const { deleteItemFromCartMutation, deleteItemMutation, updateCartMutation } =
    useShopItemMutations(itemId);

  // Sync count when itemCount prop changes (cart updates)
  useEffect(() => {
    setCount(itemCount);
  }, [itemCount]);

  if (isLoading) {
    return <ShimmerShopItem id={itemId} key={itemId} />;
  }

  // If Item removed show this card
  if (isError) {
    return (
      <div
        id={itemId}
        className="flex flex-col items-center justify-center p-10 text-2xl text-center bg-red-100 rounded-lg text-bold"
      >
        <h1>{error.message}</h1>
        <div className="h-4"></div>
        <button
          className="btn btn-error"
          onClick={async (e) => {
            if (isCart) {
              e.stopPropagation();
              await removeFromCart(itemId);
              if (onDelete) onDelete();
            } else {
              toast.error('An unforseeable error occured!');
            }
          }}
        >
          Remove From Cart
        </button>
      </div>
    );
  }
  const { item, user: lister } = data;

  return (
    <>
      {
        <motion.div
          onClick={() => {
            navigate('/item/' + item._id);
          }}
          key={item._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          viewport={{ once: true }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="relative transition-all duration-300 bg-white rounded-2xl cursor-pointer shadow-lg hover:shadow-premium border border-gray-100 overflow-hidden group"
        >
          <div className="relative m-3">
            <div className="w-full h-48 overflow-hidden rounded-xl">
              <ImageView
                _id={item._id}
                url={item.images[0]}
                shimmerClass={'max-h-48 rounded-xl'}
                imageClass={
                  'h-48 w-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500'
                }
              />
            </div>
            {!isCart && (
              <div className="absolute top-2 left-2 px-4 py-2 text-xs font-semibold text-white shadow-lg bg-gradient-to-r from-premium-500 to-premium-600 rounded-xl">
                23% off
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-gray-100 to-gray-50 inline-flex flex-row mx-3 items-center justify-start px-4 gap-2 py-2 rounded-xl text-xs font-medium text-gray-600">
            <Clock size={14} />
            <TimeAgo date={item.listedAt} live={false} />
          </div>
          <div className="px-4 pb-4 rounded-lg">
            <h1 className="text-xl font-bold text-gray-900 hover:text-premium-600 hover:cursor-pointer mt-3 transition-colors">
              {item.name}
            </h1>
            {appState.userData._id != lister._id && (
              <p className="text-sm text-gray-500 mt-1">{lister.name}</p>
            )}

            <p className="text-2xl font-extrabold bg-gradient-to-r from-premium-600 to-premium-500 bg-clip-text text-transparent mt-2">{'₦' + item.price + '/kg'}</p>

            {/* Add Button for Customer (only if not in cart) */}
            {appState.isCustomer() && !isCart && !isInCart && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await addToCart(item._id, count);
                  // Invalidate cart query to trigger re-fetch and update UI
                  queryClient.invalidateQueries(['cart']);
                }}
                className={cn(
                  'h-[48px] z-10 absolute right-3 bottom-3 flex items-center justify-center transition-all duration-300 rounded-xl shadow-lg hover:shadow-premium',
                  'bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700'
                )}
              >
                <p className={cn('px-6 py-2 text-base font-semibold text-white')}>ADD</p>
              </button>
            )}

            {/* Quantity Controls for items in cart (on shop page) */}
            {appState.isCustomer() && !isCart && isInCart && count > 0 && (
              <div className="absolute bottom-3 right-3 w-[50%] h-[48px] flex flex-row items-center justify-center border-2 border-premium-200 rounded-xl overflow-hidden shadow-lg bg-white">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    const newCount = count - 1;
                    setCount(newCount);
                    updateCartMutation.mutate(newCount);
                  }}
                  className="cursor-pointer flex-1 h-[100%] flex justify-center items-center hover:bg-gray-100 transition-colors"
                >
                  <Minus size={20} className="text-gray-700" />
                </div>
                <div className="flex-1 h-[100%] flex justify-center items-center text-center bg-gradient-to-r from-premium-50 to-premium-100 font-bold text-premium-700">
                  {count}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    const newCount = count + 1;
                    setCount(newCount);
                    updateCartMutation.mutate(newCount);
                  }}
                  className="cursor-pointer flex-1 h-[100%] flex justify-center items-center text-center hover:bg-gray-100 transition-colors"
                >
                  <Plus size={20} className="text-gray-700" />
                </div>
              </div>
            )}

            {/* Show ADD button again when count reaches 0 */}
            {appState.isCustomer() && !isCart && isInCart && count === 0 && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await addToCart(item._id, 1);
                  // Invalidate cart query to trigger re-fetch and update UI
                  queryClient.invalidateQueries(['cart']);
                }}
                className={cn(
                  'h-[48px] z-10 absolute right-3 bottom-3 flex items-center justify-center transition-all duration-300 rounded-xl shadow-lg hover:shadow-premium',
                  'bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700'
                )}
              >
                <p className={cn('px-6 py-2 text-base font-semibold text-white')}>ADD</p>
              </button>
            )}

            {/* Spacing for the absolute actions */}
            <div className="h-[8vh]"></div>

            {/* Delete Button (Customer|Admin|Farmer) */}
            {(isCart || appState.isAdmin() || appState.isOwner(item.listedBy)) && (
              <div className="absolute bottom-3 right-3 w-full gap-3 flex flex-row">
                <div className="flex-grow"></div>
                
                {/* Edit Price Button (Admin Only) */}
                {appState.isAdmin() && !isCart && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const newPrice = prompt(`Edit price for ${item.name}\nCurrent: ₦${item.price}`, item.price);
                      if (newPrice !== null && !isNaN(newPrice) && parseFloat(newPrice) >= 0) {
                        try {
                          const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/updatePrice`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              itemId: item._id,
                              adminId: appState.getUserData()._id,
                              price: parseFloat(newPrice)
                            })
                          });
                          const data = await response.json();
                          if (data.statusCode === 200) {
                            toast.success(`Price updated from ₦${data.data.oldPrice} to ₦${data.data.newPrice}`);
                            queryClient.invalidateQueries(['item', item._id]);
                            queryClient.invalidateQueries(['items']);
                          } else {
                            toast.error(data.message || 'Failed to update price');
                          }
                        } catch (err) {
                          toast.error('Error updating price: ' + err.message);
                        }
                      } else if (newPrice !== null) {
                        toast.error('Invalid price. Please enter a positive number.');
                      }
                    }}
                    className={cn(
                      'h-[48px] flex items-center justify-center transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl',
                      'bg-blue-50 hover:bg-blue-500 border-2 border-blue-200 hover:border-blue-500'
                    )}
                  >
                    <p
                      className={cn(
                        'px-4 py-2 text-sm font-bold transition-all duration-300',
                        'text-blue-500 hover:text-white'
                      )}
                    >
                      Edit Price
                    </p>
                  </button>
                )}
                
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (isCart) {
                      deleteItemFromCartMutation.mutate();
                      return;
                    }
                    deleteItemMutation.mutate();
                  }}
                  className={cn(
                    'h-[48px] flex items-center justify-center transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl',
                    'bg-red-50 hover:bg-red-500 border-2 border-red-200 hover:border-red-500'
                  )}
                >
                  <p
                    className={cn(
                      'px-4 py-2 text-lg font-bold transition-all duration-300',
                      'text-red-500 hover:text-white'
                    )}
                  >
                    <Trash />
                  </p>
                </button>
                {appState.isCustomer() && isCart && (
                  <div className="w-[50%] h-[48px] flex flex-row items-center justify-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();

                        if (count === 1) {
                          deleteItemFromCartMutation.mutate();
                          return;
                        }

                        if (count > 0) {
                          const newCount = count - 1;
                          setCount(newCount);
                          updateCartMutation.mutate(newCount);
                        }
                      }}
                      className="cursor-pointer flex-1 h-[100%] flex justify-center items-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={20} className="text-gray-700" />
                    </div>
                    <div className="flex-1 h-[100%] flex justify-center items-center text-center bg-gradient-to-r from-premium-50 to-premium-100 font-bold text-premium-700">
                      {count}
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        const newCount = count + 1;
                        setCount(newCount);
                        updateCartMutation.mutate(newCount);
                      }}
                      className="cursor-pointer flex-1 h-[100%] flex justify-center items-center text-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={20} className="text-gray-700" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      }
    </>
  );
}

ShopItem.propTypes = {
  itemId: PropTypes.string.isRequired,
  itemCount: PropTypes.number.isRequired,
  isCart: PropTypes.bool.isRequired,
  isInCart: PropTypes.bool,
  onDelete: PropTypes.func.isRequired
};

export default ShopItem;
