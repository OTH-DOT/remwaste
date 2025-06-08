import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Trash2, SkipForward, Shield, Calendar, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import WasteType from './WasteType';
import PermitCheck from './PermitCheck';
import SkipSelection from './SkipList';

const ProgressBar = ({ currentStep = 1, onStepClick }) => {
  const steps = [
    { id: 1, label: 'Postcode', icon: MapPin, color: 'bg-green-500' },       // eco, start
    { id: 2, label: 'Waste Type', icon: Trash2, color: 'bg-lime-500' },      // active, waste
    { id: 3, label: 'Select Skip', icon: SkipForward, color: 'bg-blue-500' },// info, selection
    { id: 4, label: 'Permit Check', icon: Shield, color: 'bg-yellow-500' },  // caution, alert
    { id: 5, label: 'Choose Date', icon: Calendar, color: 'bg-cyan-500' },   // calm, planning
    { id: 6, label: 'Payment', icon: CreditCard, color: 'bg-indigo-500' },   // trust, secure
  ];

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);


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
    <div className="w-full bg-gray-950 px-8 py-8">
      <div className="max-w-6xl mx-auto  relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center transition-all duration-300 hover:bg-gray-700 hover:border-gray-600 lg:hidden ${
            canScrollLeft 
              ? 'opacity-100 pointer-events-auto shadow-lg' 
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft size={20} className="text-white" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center transition-all duration-300 hover:bg-gray-700 hover:border-gray-600 lg:hidden ${
            canScrollRight 
              ? 'opacity-100 pointer-events-auto shadow-lg' 
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight size={20} className="text-white" />
        </button>
        {/* Scrollable Container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide lg:overflow-visible"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
        <div className="flex items-center justify-between h-[80px] min-w-max lg:min-w-0 px-2 lg:px-0">
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
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    status === 'completed'
                      ? 'text-white'
                      : status === 'current'
                      ? 'text-indigo-500'
                      : 'text-gray-500'
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
                        : 'bg-gray-700'
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

        {/* Gradient Overlays for Visual Effect */}
        {/* <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none lg:hidden transition-opacity duration-300 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`} />
        <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none lg:hidden transition-opacity duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`} /> */}
      </div>

    </div>
  );
};

// Demo component to show how to use the ProgressBar
const Demo = () => {
  const [currentStep, setCurrentStep] = useState(3);

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const handleContinue = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
            1
          </div>
        );
      case 2:
        return <WasteType />
      case 3:
        return <SkipSelection onContinue={handleContinue} />;
      case 4:
        return <PermitCheck />
      case 5:
        return (
          <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
            5
          </div>
        );
      case 6:
        return (
          <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
            6
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <ProgressBar 
        currentStep={currentStep} 
        onStepClick={handleStepClick}
      />
      {renderStepContent()}
    </div>
  );
};

export default Demo;