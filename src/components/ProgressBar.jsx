import React, { useState } from 'react';
import { MapPin, Trash2, SkipForward, Shield, Calendar, CreditCard } from 'lucide-react';
import WasteType from './WasteType';
import PermitCheck from './PermitCheck';
import SkipSelection from './SkipList';

const ProgressBar = ({ currentStep = 1, onStepClick }) => {
  const steps = [
    { id: 1, label: 'Postcode', icon: MapPin, color: 'bg-purple-500' },
    { id: 2, label: 'Waste Type', icon: Trash2, color: 'bg-red-500' },
    { id: 3, label: 'Select Skip', icon: SkipForward, color: 'bg-blue-500' },
    { id: 4, label: 'Permit Check', icon: Shield, color: 'bg-gray-500' },
    { id: 5, label: 'Choose Date', icon: Calendar, color: 'bg-green-500' },
    { id: 6, label: 'Payment', icon: CreditCard, color: 'bg-orange-500' },
  ];

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

  return (
    <div className="w-full bg-gray-950 px-8 py-8">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
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
                      ? `${step.color} text-white ring-4 ring-blue-400 ring-opacity-30`
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
                      ? 'text-blue-400'
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
                        ? 'bg-blue-500'
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