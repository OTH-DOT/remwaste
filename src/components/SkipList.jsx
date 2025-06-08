import React, { useEffect, useState } from 'react';
import { getSkips } from '../api';
import SkipCard from './SkipCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Calendar, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
    <motion.div
      className="text-indigo-500 mb-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Truck size={40} />
    </motion.div>
    <p className="text-lg text-gray-300">Loading skip options...</p>
  </div>
);

// Confirmation Panel Component
const ConfirmationPanel = ({onBack, onContinue, selectedSkip }) => (
  <motion.div
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 100 }}
    className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto"
  >
    <div className="bg-gray-900/95 backdrop-blur-xl border border-indigo-500/50 rounded-xl p-4 lg:p-6 shadow-2xl">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <CheckCircle size={24} className="text-emerald-400 flex-shrink-0" />
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-lg font-semibold text-white mb-1">
            Selected: {selectedSkip.size} Yard Skip
          </h3>
          <p className="text-gray-300 text-sm">
            £{Math.round(selectedSkip.price_before_vat + (selectedSkip.price_before_vat * selectedSkip.vat / 100))} for {selectedSkip.hire_period_days} days
          </p>
        </div>
        <div className='flex max-lg:w-full gap-4 justify-center items-center'>        
        <motion.button
          onClick={() => onBack && onBack()}
          className="bg-gray-600 hover:bg-gray-700 flex-1 text-white px-6 py-3 rounded-lg justify-center font-semibold flex items-center gap-2 transition-colors duration-300 w-full lg:w-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>
        <motion.button
          onClick={() => onContinue && onContinue()}
          className="bg-indigo-600 hover:bg-indigo-700 flex-1 text-white px-6 py-3 rounded-lg justify-center font-semibold flex items-center gap-2 transition-colors duration-300 w-full lg:w-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue
          <ArrowRight size={18} />
        </motion.button>
        </div>
      </div>
      
      <div className="border-t border-gray-700/50 mt-6 pt-4">
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Imagery and information shown throughout this website may not reflect the exact shape or size specification. Colours may vary. Options and/or accessories may be featured at additional cost.
        </p>
      </div>
    </div>
  </motion.div>
);

// Main Component
const SkipSelection = ({onContinue, onBack}) => {
  const [skips, setSkips] = useState([]);
  const [selectedSkip, setSelectedSkip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkips = async () => {
      const data = await getSkips();
      setSkips(data);
      setSelectedSkip(data[1] || null)
      console.log(data)
      setLoading(false);
    };
    fetchSkips();
  }, []);

  const handleSkipSelect = (skip) => {
    setSelectedSkip(selectedSkip?.id === skip.id ? null : skip);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 lg:pb-[140px] max-lg:pb-[260px] lg:p-4">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
          Choose Your Skip Size
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Select the skip size that best suits your needs
        </p>
      </motion.header>

      {/* Skip Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row flex-wrap gap-6 max-w-7xl mx-auto mb-20"      
      >
        {skips.map((skip, index) => (
          <motion.div
            key={skip.id}
            className="w-full md:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)] flex"            
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SkipCard
              skip={skip}
              onSelect={handleSkipSelect}
              selected={selectedSkip?.id === skip.id}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Confirmation Panel */}
      <AnimatePresence>
        {selectedSkip && <ConfirmationPanel onBack={onBack} onContinue={onContinue} selectedSkip={selectedSkip} />}
      </AnimatePresence>
    </div>
  );
};

export default SkipSelection;


