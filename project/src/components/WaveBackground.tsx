import React from 'react';
import { motion } from 'framer-motion';

const WaveBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <motion.svg
        className="absolute bottom-0 w-full h-64"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        animate={{
          transform: ['translateX(0px)', 'translateX(-100px)', 'translateX(0px)']
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut"
        }}
      >
        <path
          d="M0,60 C300,120 500,0 700,60 C900,120 1100,0 1200,60 L1200,120 L0,120 Z"
          fill="url(#gradient)"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </motion.svg>
      
      <motion.svg
        className="absolute bottom-0 w-full h-48"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        animate={{
          transform: ['translateX(-50px)', 'translateX(50px)', 'translateX(-50px)']
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut"
        }}
      >
        <path
          d="M0,40 C200,80 400,20 600,40 C800,60 1000,20 1200,40 L1200,120 L0,120 Z"
          fill="url(#gradient2)"
          opacity="0.2"
        />
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
};

export default WaveBackground;