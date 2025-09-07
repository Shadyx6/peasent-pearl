import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring", 
      damping: 15, 
      stiffness: 100, 
      duration: 0.7 
    }
  }
};

const fadeInUp = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ease: [0.16, 1, 0.3, 1], duration: 0.8 }
  }
};

const shimmerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const shimmerItemVariant = {
  hidden: { opacity: 0.5, x: -30 },
  visible: {
    opacity: 0.8,
    x: "100%",
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatDelay: 0.5,
      ease: "easeInOut"
    }
  }
};

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const bestProduct = products.filter((item) => item.bestseller);
      setBestSeller(bestProduct.slice(0, 5));
      setIsLoading(false);
    }
  }, [products]);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 overflow-hidden relative">
            <motion.div
              variants={shimmerVariant}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              style={{ width: "50%" }}
            >
              <motion.div 
                variants={shimmerItemVariant}
                className="h-full w-full bg-white/30"
              />
            </motion.div>
          </div>
          <div className="h-5 w-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto overflow-hidden relative">
            <motion.div
              variants={shimmerVariant}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              style={{ width: "50%" }}
            >
              <motion.div 
                variants={shimmerItemVariant}
                className="h-full w-full bg-white/30"
              />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative rounded-t-2xl">
                <motion.div
                  variants={shimmerVariant}
                  initial="hidden"
                  animate="visible"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ width: "50%" }}
                >
                  <motion.div 
                    variants={shimmerItemVariant}
                    className="h-full w-full bg-white/30"
                  />
                </motion.div>
              </div>
              <div className="p-5">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-3 overflow-hidden relative">
                  <motion.div
                    variants={shimmerVariant}
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    style={{ width: "50%" }}
                  >
                    <motion.div 
                      variants={shimmerItemVariant}
                      className="h-full w-full bg-white/30"
                    />
                  </motion.div>
                </div>
                <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden relative">
                  <motion.div
                    variants={shimmerVariant}
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    style={{ width: "50%" }}
                  >
                    <motion.div 
                      variants={shimmerItemVariant}
                      className="h-full w-full bg-white/30"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (bestSeller.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">No bestsellers yet</h3>
          <p className="text-gray-600 mb-6">Check back soon for our trending collection</p>
          <Link to="/collection">
            <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full hover:shadow-lg transition-all">
              Explore Collection
            </button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="text-center mb-14">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-2 rounded-full mb-4">
          <span className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-2 animate-pulse"></span>
          <span className="text-sm font-medium text-amber-700">Customer Favorites</span>
        </div>
        
         <h2 className="text-3xl md:text-3xl lg:text-4xl font-serif font-light text-amber-900 mb-4">
          Our <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">Bestseller 🎀</span>
        </h2>
        
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover our most loved pieces — the ones our customers can't stop raving about
        </p>
      </motion.div>

      {/* Products Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {bestSeller.map((item, index) => (
          <motion.div 
            key={item._id} 
            variants={itemVariants}
            custom={index}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <ProductItem
              id={item._id}
              image={
                item.variants?.[0]?.images?.[0] ||
                (Array.isArray(item.image) ? item.image[0] : item.image) ||
                "/fallback.jpg"
              }
              name={item.name}
              price={item.price}
              finalPrice={item.finalPrice}
              stock={
                item.variants?.some((v) => v.stock > 0) ? 1 : item.stock || 0
              }
              badgeType="trend"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      {bestSeller.length > 0 && (
        <motion.div 
          variants={fadeInUp} 
          className="text-center mt-16"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link to="/collection">
            <motion.button 
              whileHover={{ // i just want kno  kut nad want to use the thing that
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(245, 158, 11, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-amber-700 to-orange-700 text-white rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10">Shop All Bestsellers</span>
              <span className="absolute inset-0 bg-gradient-to-r from-amber-700 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
          </Link>
        </motion.div>
      )}
    </motion.section>
  );
};

export default BestSeller;