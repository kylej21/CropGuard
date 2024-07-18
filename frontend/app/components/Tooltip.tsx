import React, { ReactNode } from 'react';

interface TooltipProps {
  message: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ message, children }) => {
  return (
    <div className="group relative flex items-center">
      {children}
      <span className="w-60 border-2 text-black border-black absolute left-full bottom-10 transform translate-y-1/2 scale-0 transition-all origin-top-left rounded bg-green-500 p-2 text-xs whitespace-no-wrap group-hover:scale-100">
        {message}
        </span>
    </div>
  );
};

export default Tooltip;
