// BestSeller.jsx
import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0, scale: 0.98 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", damping: 16, stiffness: 120 } },
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const BestSeller = () => {
  const { products = [] } = useContext(ShopContext);

  const bestSeller = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    return [...products]
      .filter((p) => p.bestseller)
      .filter((p) => {
        // ensure product has valid createdAt and at least some stock (optional)
        const okDate = p.createdAt && !isNaN(new Date(p.createdAt));
        const hasStock =
          (typeof p.stock === "number" && p.stock > 0) ||
          (Array.isArray(p.variants) && p.variants.some((v) => typeof v.stock === "number" ? v.stock > 0 : (v?.stock > 0)));
        return okDate && hasStock;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4); // keep up to 4 latest bestsellers
  }, [products]);

  if (!products) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <motion.div variants={fadeInUp} className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-2 rounded-full mb-4">
          <span className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mr-2 animate-pulse"></span>
          <span className="text-sm font-medium text-amber-700">Customer Favorites</span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-amber-900 mb-4">
          Our <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">Bestsellers 🎀</span>
        </h2>

        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
          Discover our most loved pieces — updated automatically.
        </p>
      </motion.div>

      {bestSeller.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-600">No bestsellers yet — check back soon.</p>
          <Link to="/collection">
            <button className="mt-4 px-5 py-2 rounded-full bg-amber-600 text-white">View All</button>
          </Link>
        </div>
      ) : (
        <motion.div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" variants={containerVariants}>
          {bestSeller.map((item, idx) => (
            <motion.div key={item._id || idx} variants={itemVariants} whileHover={{ y: -6 }}>
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
                stock={(item.variants?.some((v) => v.stock > 0) || item.stock > 0) ? 1 : 0}
                badgeType="trend"
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Optional CTA */}
      {bestSeller.length > 0 && (
        <motion.div variants={fadeInUp} className="text-center mt-8">
          <Link to="/collection?filter=bestseller">
            <button className="px-6 py-2 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition-colors">
              View All Bestsellers
            </button>
          </Link>
        </motion.div>
      )}
    </motion.section>
  );
};

export default BestSeller;
