import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  const container = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      } 
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      } 
    },
  };

  const statItem = {
    hidden: { scale: 0.8, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      } 
    },
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8  relative overflow-hidden ">
      {/* Decorative background elements */}
      <div className="absolute -top-20 -right-20 w-80 h-80   rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-r rounded-full blur-3xl opacity-40"></div>
      
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={container}
          className="rounded-3xl bg-[#fffdf5] backdrop-blur-sm shadow-xl p-8 md:p-12 text-center relative border border-white/20 overflow-hidden"
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03] -z-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTkiIGZpbGwtb3BhY2l0eT0iMC4yIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
          </div>

          {/* Logo on top */}
          <motion.div 
            variants={item} 
            className="mb-8 flex justify-center relative"
          >
            <div className="relative">
              <img
                src="./image/logo1.png"
                alt="Pleasant Pearl Logo"
                className="h-24 md:h-28 w-auto object-contain filter drop-shadow-md"
              />
              <motion.div 
                className="absolute -inset-4 bg-gradient-to-r from-amber-400/30 to-amber-400/20 rounded-full blur-md -z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>

          {/* Subheading */}
          <motion.div variants={item} className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-amber-300 to-orange-700 px-4 py-2 rounded-full border border-pink-100 shadow-sm inline-flex items-center">
              <span className="w-2 h-2 bg-gray-200 rounded-full mr-2 animate-pulse"></span>
              Our Story
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={item}
            className="text-3xl md:text-4xl font-serif font-light text-amber-900 mb-6"
          >
            Crafting <span className="text-amber-900 bg-clip-text">Elegance</span>, Since 2023
          </motion.h2>

          {/* Short description */}
          <motion.p
            variants={item}
            className="text-gray-700 max-w-2xl mx-auto mb-8 text-lg leading-relaxed font-light"
          >
            At <span className="font-medium text-amber-700">Pleasant Pearl</span>, 
            we blend traditional craftsmanship with modern design to create exquisite jewelry 
            that tells your unique story — timeless, elegant, and meticulously crafted with passion.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <Link to={"/collection"}>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(236, 72, 153, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-700 to-orange-700 text-white rounded-full font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 shadow-lg flex items-center gap-2"
              >
                Explore Collection
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </Link>
            <Link to={"/contact"}>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.95)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 border border-gray-200 text-gray-700 rounded-full font-medium hover:border-pink-200 hover:bg-pink-50 transition-all duration-300 shadow-sm flex items-center gap-2"
              >
                Contact Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats divider */}
          <motion.div 
            variants={item}
            className="relative mb-8"
          >
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">Craftsmanship</span>
            </div>
          </motion.div>

          {/* Mini Stats */}
          <motion.div
            variants={container}
            className="grid grid-cols-3 gap-6 md:gap-8 mt-2"
          >
            <motion.div variants={statItem} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-600 font-medium">Handcrafted</div>
            </motion.div>
            <motion.div variants={statItem} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-600 font-medium">Happy Clients</div>
            </motion.div>
            <motion.div variants={statItem} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Ethical</div>
              <div className="text-sm text-gray-600 font-medium">Sourcing</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;