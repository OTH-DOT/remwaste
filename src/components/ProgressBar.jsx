import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Trash2, Truck, Shield, Calendar, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import SkipSelection from './SkipList';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const ProgressBar = ({ currentStep = 1, onStepClick }) => {
  const steps = [
    { id: 1, label: 'Postcode', icon: MapPin, color: 'bg-green-500' },       
    { id: 2, label: 'Waste Type', icon: Trash2, color: 'bg-lime-500' },      
    { id: 3, label: 'Select Skip', icon: Truck, color: 'bg-blue-500' },
    { id: 4, label: 'Permit Check', icon: Shield, color: 'bg-yellow-500' },  
    { id: 5, label: 'Choose Date', icon: Calendar, color: 'bg-cyan-500' },   
    { id: 6, label: 'Payment', icon: CreditCard, color: 'bg-indigo-500' },  
  ];

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { isDark } = useTheme();

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const handleStepClick = (stepId) => {
    // Only allow clicking on previous steps
    if (stepId < currentStep && onStepClick) {
      onStepClick(stepId);
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', checkScrollButtons);
      return () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.removeEventListener('scroll', checkScrollButtons);
        }
      };
    }
  }, []);

  return (
    <div className={`w-full px-8 py-8 ${isDark ? 'bg-gray-950' : 'bg-gray-100 border-b border-gray-200'}`}>
      <div className="max-w-6xl mx-auto relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 xl:hidden ${
            isDark 
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600' 
              : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-md'
          } ${
            canScrollLeft 
              ? 'opacity-100 pointer-events-auto shadow-lg' 
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft size={20} className={isDark ? 'text-white' : 'text-gray-600'} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 xl:hidden ${
            isDark 
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600' 
              : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-md'
          } ${
            canScrollRight 
              ? 'opacity-100 pointer-events-auto shadow-lg' 
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight size={20} className={isDark ? 'text-white' : 'text-gray-600'} />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide xl:overflow-visible"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex items-center xl:justify-center justify-between h-[80px] min-w-max lg:min-w-0 px-2 lg:px-0">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              const isClickable = status === 'completed';
              const isUpcoming = status === 'upcoming';
              
              return (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={`flex items-center space-x-3 ${
                      isClickable 
                        ? 'cursor-pointer hover:opacity-80' 
                        : isUpcoming 
                        ? 'cursor-not-allowed' 
                        : 'cursor-default'
                    }`}
                    onClick={() => handleStepClick(step.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 ${
                        status === 'completed'
                          ? `${step.color} text-white`
                          : status === 'current'
                          ? `${step.color} text-white ring-4 ring-indigo-500 ring-opacity-30`
                          : isDark 
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span
                      className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                        status === 'completed'
                          ? isDark ? 'text-white' : 'text-gray-900'
                          : status === 'current'
                          ? 'text-indigo-500'
                          : isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-6">
                      <div
                        className={`h-0.5 transition-colors duration-300 ${
                          step.id < currentStep
                            ? 'bg-indigo-500'
                            : isDark ? 'bg-gray-700' : 'bg-gray-300'
                        }`}
                        style={{ minWidth: '60px' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(3);
  const { isDark } = useTheme();

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const handleContinue = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const contentClasses = `min-h-full p-8 flex flex-col items-center justify-center ${
      isDark ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'
    }`;

    const buttonClasses = {
      primary: `px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors`,
      secondary: `px-4 py-2 rounded-lg transition-colors ${
        isDark 
          ? 'bg-gray-800 text-white hover:bg-gray-700' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`
    };

    switch(currentStep) {
      case 1:
        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-semibold mb-4">Enter Postcode</h2>
            <div className="max-w-6xl mx-auto mt-8 flex justify-center space-x-4">
              <button
                onClick={() => handleContinue()}
                className={buttonClasses.primary}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-semibold mb-4">Select Waste Type</h2>
            <div className="max-w-6xl mx-auto mt-8 flex justify-center space-x-4">
              <button
                onClick={() => handleBack()}
                className={buttonClasses.secondary}
              >
                Back
              </button>
              <button
                onClick={() => handleContinue()}
                className={buttonClasses.primary}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 3:
        return <SkipSelection onBack={handleBack} onContinue={handleContinue} />;
      case 4:
        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-semibold mb-4">Permit Check</h2>
            <div className="max-w-6xl mx-auto mt-8 flex justify-center space-x-4">
              <button
                onClick={() => handleBack()}
                className={buttonClasses.secondary}
              >
                Back
              </button>
              <button
                onClick={() => handleContinue()}
                className={buttonClasses.primary}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-semibold mb-4">Choose Date</h2>
            <div className="max-w-6xl mx-auto mt-8 flex justify-center space-x-4">
              <button
                onClick={() => handleBack()}
                className={buttonClasses.secondary}
              >
                Back
              </button>
              <button
                onClick={() => handleContinue()}
                className={buttonClasses.primary}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-semibold mb-4">Payment</h2>
            <div className="max-w-6xl mx-auto mt-8 flex justify-center space-x-4">
              <button
                onClick={() => handleBack()}
                className={buttonClasses.secondary}
              >
                Back
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen relative ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
      <div className='flex items-center justify-end p-4'>
        <ThemeToggle />
      </div>
      <ProgressBar 
        currentStep={currentStep} 
        onStepClick={handleStepClick}
      />
      {renderStepContent()}
    </div>
  );
};

export default Demo;