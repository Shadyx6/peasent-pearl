// src/components/ProductItem.jsx
import React, { useContext, useRef, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
       <defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
         <stop offset='0%' stop-color='#f3f4f6'/>
         <stop offset='100%' stop-color='#e5e7eb'/>
       </linearGradient></defs>
       <rect width='100%' height='100%' fill='url(#g)'/>
       <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle'
         fill='#9ca3af' font-family='Arial' font-size='22'>Preview</text>
     </svg>`
  );

const resolveUrl = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    for (const it of val) {
      const u = resolveUrl(it);
      if (u) return u;
    }
    return null;
  }
  if (typeof val === "object") {
    return (
      resolveUrl(val.secure_url) ||
      resolveUrl(val.url) ||
      resolveUrl(val.src) ||
      resolveUrl(val.path) ||
      resolveUrl(val.image) ||
      null
    );
  }
  return null;
};

const ProductItem = ({
  id,
  image,
  video,
  name,
  price,
  finalPrice,
  // NEW:
  isBestseller = false,
  badgeType, // e.g. "bestseller" | "new" | "trend"
}) => {
  const { currency } = useContext(ShopContext);
  const videoRef = useRef(null);
  const BASE = import.meta.env.VITE_BACKEND_URL

  const videoUrl = video 
  ? `${BASE}/api/video/${video}`
  : null;;
  const imageUrl = resolveUrl(image);

  const hasVideo = !!videoUrl;
  const hasImage = !!imageUrl;

  useEffect(() => {
    if (videoRef.current && hasVideo && !hasImage) {
      const play = videoRef.current.play();
      if (play?.catch) play.catch(() => {});
    }
  }, [hasVideo, hasImage]);

  const hasDiscount = Number(finalPrice) < Number(price);
  const discount = hasDiscount
    ? Math.round(((Number(price) - Number(finalPrice)) / Number(price)) * 100)
    : 0;

  // ------- Badge logic -------
  const isBest = isBestseller || badgeType === "bestseller";
  const badgeLabel = isBest
    ? "Bestseller"
    : badgeType === "new"
    ? "New"
    : badgeType === "trend"
    ? "Trending"
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100"
    >
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-pink-50/50 to-rose-50/50 relative rounded-t-2xl">
          {/* BADGE (top-left) */}
          {badgeLabel && (
            <span
              className={`absolute top-3 left-3 z-20 px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm
                ${isBest ? "bg-amber-600 text-white" : "bg-rose-100 text-rose-700"}`}
            >
              {badgeLabel}
            </span>
          )}

          {hasImage ? (
            <img
              src={imageUrl}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          ) : hasVideo ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-cover z-10"
              muted
              playsInline
              autoPlay
              loop
              preload="auto"
              poster={PLACEHOLDER}
            />
          ) : (
            <img
              src={PLACEHOLDER}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}
        </div>

        {/* Card content */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <p className="text-md font-medium text-amber-700">
                {Number(finalPrice).toLocaleString()} {currency}
              </p>
              {hasDiscount && (
                <span className="text-sm font-semibold text-green-600">
                  {discount}% OFF
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">
                {currency}
                {Number(price).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;
