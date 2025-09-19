// Hero.jsx (full-bleed variant)
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const heroVideo = "./hand.mp4";
  const fallbackImage = "https://res.cloudinary.com/.../udhk0drcndel.jpg";

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden m-0 p-0">
  {/* Background video */}
  <video
    src="./hand.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* overlay */}
  <div className="absolute inset-0 bg-black/30" />

  {/* centered text */}
  <div className="relative z-10 flex items-center justify-center h-full px-4">
    <div className="text-center max-w-4xl">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white mb-8">
        Discover{" "}
        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Elegance
        </span>{" "}
        in Every Detail
      </h1>

      <button
        onClick={() => navigate("/collection")}
        className="px-10 py-3 sm:px-12 sm:py-4 rounded-lg font-medium text-white text-lg bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        Shop Now
      </button>
    </div>
  </div>
</section>


  );
}
