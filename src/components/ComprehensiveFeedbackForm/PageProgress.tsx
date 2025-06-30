
import React from 'react';

interface PageProgressProps {
  currentPage: 1 | 2 | 3;
}

const PageProgress: React.FC<PageProgressProps> = ({ currentPage }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 1 ? 'bg-tour-primary text-white' : 'bg-gray-200'}`}>1</div>
        <div className={`w-16 h-1 ${currentPage > 1 ? 'bg-tour-primary' : 'bg-gray-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 2 ? 'bg-tour-primary text-white' : 'bg-gray-200'}`}>2</div>
        <div className={`w-16 h-1 ${currentPage > 2 ? 'bg-tour-primary' : 'bg-gray-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 3 ? 'bg-tour-primary text-white' : 'bg-gray-200'}`}>3</div>
      </div>
    </div>
  );
};

export default PageProgress;
