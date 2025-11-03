import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = currentStep > totalSteps ? 100 : (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
      <p className="text-xs text-center text-slate-600 mt-1">
        Step {Math.min(currentStep + 1, totalSteps + 1)} of {totalSteps + 1}
      </p>
    </div>
  );
};

export default ProgressBar;
