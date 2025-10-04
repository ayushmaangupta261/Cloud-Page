import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
     
      <motion.div
        className="p-6 sm:p-10 rounded-2xl shadow-xl bg-white w-full max-w-md"
        whileHover={{ rotateY: 10, rotateX: 10, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
       
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-[#367AFF]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to HD
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Your journey starts here{" "}
          <motion.span
            className="inline-block"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            🚀
          </motion.span>
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Link
            to="/authPage"
            className="bg-[#367AFF] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-2xl transition-all text-sm sm:text-base"
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
