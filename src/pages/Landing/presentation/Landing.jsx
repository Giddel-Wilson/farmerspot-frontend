import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import NavigationButton from '../../../components/Button';

import { data, features } from '../../../data/data';
import { getFourItems } from '../../shop/application/shop';

import exploreImage from '../../../assets/explore.webp';
import { useQuery } from '@tanstack/react-query';

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="mt-[8vh] w-[100%] overflow-hidden snap snap-y snap-mandatory">
        <TopSection />
        <StatsSection />
        <OurMottoSection />
        <section className="mx-8 px-4">
          <div className="flex flex-col md:flex-row">
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 1 }}
              viewport={{ once: true }}
              className="w-[100%] p-8 md:w-[30%] my-5 flex flex-col justify-center items-center bg-gradient-to-br from-premium-500 to-premium-600 rounded-3xl shadow-premium"
            >
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Our Features</h1>
            </motion.div>
            <div className="w-[100%] md:w-[70%] grid grid-cols-1 md:grid-cols-2 gap-5 md:m-5">
              {features.map((e, i) => {
                return (
                  <motion.div key={i} whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.3 }}>
                    <motion.div
                      transition={{ delay: 0.25, duration: 1 }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      key={i}
                      className="group p-8 bg-white h-[100%] w-[100%] flex flex-col justify-evenly rounded-2xl shadow-lg hover:shadow-premium border border-gray-100 transition-all duration-300"
                    >
                      <div className="bg-gradient-to-br from-premium-400 to-premium-600 rounded-2xl h-[75px] w-[75px] flex justify-center items-center text-white text-2xl shadow-lg">
                        {e.icon}
                      </div>

                      <h1 className="text-2xl font-bold mt-4 text-gray-900">{e.title}</h1>
                      <p className="text-gray-600 mt-2">{e.description}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
        {/* <ExploreProducts /> */}
        <section
          className="bg-cover bg-center bg-fixed relative rounded-3xl mx-8 overflow-hidden"
          style={{
            backgroundImage: `url(/landing_bg.webp)`
          }}
        >
          <div className="overlay absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 relative">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 leading-tight relative"
            >
              Help us with our mission.
              <br />
              <span className="bg-gradient-to-r from-premium-400 to-premium-300 bg-clip-text text-transparent">
                Check out now
              </span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <NavigationButton text="Shop Now" path="/shop" />
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

function StatsSection() {
  const stats = [
    { number: '500+', label: 'Happy Customers', icon: '😊' },
    { number: '100+', label: 'Local Farmers', icon: '🌾' },
    { number: '50+', label: 'Fresh Products', icon: '🥬' },
    { number: '24/7', label: 'Support Available', icon: '💬' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-premium-50/30 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-premium-600 to-premium-500 bg-clip-text text-transparent">
              Why Choose Farmerspot?
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of customers connecting with local farmers for the freshest produce
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-premium border border-gray-100 transition-all duration-300 text-center"
            >
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-premium-600 to-premium-500 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopSection() {
  return (
    <section
      className="relative h-[92vh] w-[100%] bg-slate-900 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(/landing_bg.webp)`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      <div className="absolute top-[15vh] md:top-[25vh] left-2 md:left-10 max-w-3xl p-10">
        <motion.h1
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="font-extrabold tracking-tight text-5xl md:text-7xl text-white leading-tight"
        >
          Fresh & Natural
          <br />
          <span className="bg-gradient-to-r from-premium-400 to-premium-300 bg-clip-text text-transparent">
            Local Products
          </span>
        </motion.h1>
        <motion.h3
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="text-lg md:text-xl text-gray-200 mt-6 font-light"
        >
          Support Local Farmers and Get Fresh, High-Quality Products
        </motion.h3>

        <motion.div
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex gap-5 mt-8"
        >
          <NavigationButton text="Learn More" path="/about" />
          <NavigationButton text="Explore Products" path="/shop" />
        </motion.div>
      </div>
    </section>
  );
}

function OurMottoSection() {
  return (
    <motion.section
      transition={{ duration: 1.25 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="my-10"
    >
      <div className="my-10 mx-2 md:mx-10 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 shadow-lg">
        <h1 className="pt-4 text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-premium-600 to-premium-500 bg-clip-text text-transparent mb-8">
          Our Motto
        </h1>
        <div className="flex flex-col md:flex-row lg:flex-row p-3 md:p-8 gap-4 md:gap-6 lg:gap-8">
          {data.map((e) => {
            return (
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                key={e.name}
                className="group flex flex-row flex-1 bg-white border-2 border-gray-100 p-6 rounded-2xl text-center mb-1 hover:shadow-premium hover:border-premium-200 transition-all duration-300"
              >
                <div className="flex flex-1 justify-center items-center px-4 py-3 rounded-xl">
                  <div className="text-3xl pr-3 text-premium-500 group-hover:scale-110 transition-transform duration-300">
                    {e.icon}
                  </div>

                  <p className="text-lg font-semibold text-gray-800 group-hover:text-premium-600 transition-colors duration-300">{e.name}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

function ExploreProducts() {
  /**
   * @type {[Array<Item>, (e:Array<Item>)=>void]}
   */
  const navigate = useNavigate();
  const {
    data: products,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['explore'],
    queryFn: () => getFourItems()
  });

  if (isLoading || isError) {
    return <></>;
  }

  return (
    <section>
      <div className="flex gap-6 flex-col w-full md:flex-row justify-center my-16 px-8">
        <div className="w-full md:w-2/5">
          <motion.div
            transition={{ duration: 1 }}
            initial={{ y: 100 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            className="relative object-cover text-center h-[100%] rounded-3xl overflow-hidden shadow-premium group"
          >
            <img className="object-cover object-center h-full w-full transition-transform duration-700 group-hover:scale-110" src={exploreImage} alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <p className="text-white font-medium tracking-widest text-lg md:text-xl mb-2">EXPLORE OUR</p>
              <p className="text-white font-extrabold text-6xl md:text-7xl bg-gradient-to-r from-premium-400 to-white bg-clip-text text-transparent">Products</p>
            </div>
          </motion.div>
        </div>
        <div className="w-full md:w-1/2">
          <motion.div
            transition={{ duration: 0.5 }}
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-full"
          >
            {products.map((e, i) => {
              return (
                <div key={i} className="flex flex-col items-center justify-center h-full">
                  <div className="group w-full relative h-full bg-white rounded-2xl shadow-lg hover:shadow-premium transition-all duration-300 overflow-hidden border border-gray-100">
                    <img
                      key={e.images[0]}
                      className="h-full w-full object-contain object-center p-8 group-hover:scale-110 transition-transform duration-500"
                      src={e.images[0]}
                      alt=""
                    />
                    <div className="bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 flex transition-all duration-300 justify-center items-center absolute inset-0 rounded-2xl">
                      <button
                        onClick={() => navigate(`/item/${e._id}`)}
                        className="bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-white px-8 py-4 rounded-xl font-semibold shadow-premium hover:scale-105 transition-all duration-300"
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                  <div className="flex-1"></div>
                  <h1 className="text-lg font-semibold text-gray-900 mt-4">{e.name}</h1>
                  <h2 className="font-bold text-xl text-premium-600">₦ {e.price}</h2>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Home;
