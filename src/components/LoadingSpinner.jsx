import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400">Loading details...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center w-full">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
