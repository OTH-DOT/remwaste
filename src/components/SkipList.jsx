import React, { useEffect, useState } from 'react';
import { getSkips } from '../api';
import SkipCard from './SkipCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Calendar, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${
      isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <motion.div
        className="text-indigo-500 mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Truck size={40} />
      </motion.div>
      <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        Loading skip options...
      </p>
    </div>
  );
};

// Confirmation Panel Component
const ConfirmationPanel = ({onBack, onContinue, selectedSkip }) => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto"
    >
      <div className={`backdrop-blur-xl border rounded-xl p-4 lg:p-6 shadow-2xl ${
        isDark 
          ? 'bg-gray-900/95 border-indigo-500/50' 
          : 'bg-white/95 border-indigo-200 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <CheckCircle size={24} className="text-emerald-400 flex-shrink-0" />
          <div className="flex-1 text-center lg:text-left">
            <h3 className={`text-lg font-semibold mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Selected: {selectedSkip.size} Yard Skip
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              £{Math.round(selectedSkip.price_before_vat + (selectedSkip.price_before_vat * selectedSkip.vat / 100))} for {selectedSkip.hire_period_days} days
            </p>
          </div>
          <div className='flex max-lg:w-full gap-4 justify-center items-center'>        
            <motion.button
              onClick={() => onBack && onBack()}
              className={`flex-1 px-6 py-3 rounded-lg justify-center font-semibold flex items-center gap-2 transition-colors duration-300 w-full lg:w-auto ${
                isDark 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
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
        
        <div className={`border-t mt-6 pt-4 ${
          isDark ? 'border-gray-700/50' : 'border-gray-200'
        }`}>
          <p className={`text-xs text-center leading-relaxed ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Imagery and information shown throughout this website may not reflect the exact shape or size specification. Colours may vary. Options and/or accessories may be featured at additional cost.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const SkipSelection = ({onContinue, onBack}) => {
  const [skips, setSkips] = useState([]);
  const [selectedSkip, setSelectedSkip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

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
    <div className={`min-h-screen p-4 lg:pb-[140px] max-lg:pb-[260px] lg:p-4 ${
      isDark ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Choose Your Skip Size
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
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