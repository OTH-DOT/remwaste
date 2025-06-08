import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Calendar, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import '../index.css'

const SkipCard = ({ skip, onSelect, selected }) => {
  const totalPrice = skip.price_before_vat + (skip.price_before_vat * skip.vat / 100);
  
  return (
    <div style={{ perspective: '20px' }}>
    <motion.div
  layout
  initial={{ opacity: 0, y: 20 }}
  animate={{
    opacity: 1,
    y: 0,
    boxShadow: selected
      ? [
          '0 0 10px 4px rgba(99,102,241,0.3)',
          '0 0 25px 12px rgba(99,102,241,0.6)',
          '0 0 10px 4px rgba(99,102,241,0.3)'
        ]
      : ''
  }}
  whileHover={{ y: -50, rotateX: 0.5 }}
  transition={{
    type: 'spring',
    stiffness: 100,
    boxShadow: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }}
  className={`relative box flex flex-col justify-between h-full flex-1 hover:z-50 overflow-hidden backdrop-blur-sm border-2 rounded-2xl p-6 pb-12 cursor-pointer transition-all duration-300 group ${
    selected 
      ? 'border-indigo-500 bg-indigo-500/10'
      : 'border-gray-700/50 bg-gray-900/40 hover:border-indigo-400/50 hover:bg-gray-800/60'
  }`}
  onClick={() => onSelect(skip)}
>

  {/* Header with size badge and warning */}
  <div className="flex justify-between items-center mb-6">
    <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
      {skip.size} Yards
    </div>
    {!skip.allowed_on_road && (
      <div className="text-amber-400 bg-amber-400/20 p-2 rounded-lg">
        <AlertTriangle size={16} />
      </div>
    )}
  </div>
  
  {/* Skip image */}
  <div className="text-center mb-6">
    <div className="relative w-full mx-auto rounded-xl overflow-hidden group-hover:overflow-visible shadow-lg bg-gray-700/50">
      {/* Original image - hidden on hover */}
      {skip.image ? (
        <img 
          src={skip.image} 
          alt={`${skip.size} Yard Skip`}
          className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
          loading="lazy"
        />
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-400 group-hover:opacity-0 transition-opacity duration-300">
          <Truck size={32} />
        </div>
      )}
      
      {/* Hover image - shown only on hover */}
      <motion.img 
        src="/skip.png" 
        alt="Skip Hover Image"
        className="absolute inset-0 w-full h-full object-cover scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        loading="lazy"
        animate={{
          y: [0, -10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
    </div>
  </div>
      
      {/* Skip details */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">{skip.size} Yard Skip</h3>
        
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Calendar size={16} />
          <span>{skip.hire_period_days} day hire period</span>
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {skip.allows_heavy_waste && (
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-medium">
              Heavy Waste ✓
            </span>
          )}
          {skip.allowed_on_road && (
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-medium">
              Road Placement ✓
            </span>
          )}
        </div>
        
        {/* Price */}
        <div className="pt-2">
          <div className="text-2xl font-bold text-white">£{Math.round(totalPrice)}</div>
          <div className="text-sm text-gray-400">Inc. VAT</div>
        </div>
      </div>
      
      {/* Select button */}
      <motion.button
        className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
          selected
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {selected ? (
          <>
            <CheckCircle size={18} />
            Selected
          </>
        ) : (
          <>
            Select This Skip
            <ArrowRight size={18} />
          </>
        )}
      </motion.button>
      
      {/* Road restriction notice */}
      {!skip.allowed_on_road && (
        <div className="absolute bottom-0 left-0 right-0 bg-amber-500/20 text-amber-300 px-3 py-2 text-center text-xs font-medium rounded-b-2xl">
          ⚠️ Not Allowed On The Road
        </div>
      )}
    </motion.div>
    </div>
  );
};

export default SkipCard;