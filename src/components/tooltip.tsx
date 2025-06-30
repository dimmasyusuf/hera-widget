// Tooltip.tsx
import React from "react";

type TooltipProps = {
  label: string | number;
  children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ label, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max p-2 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </div>
    </div>
  );
};

export default Tooltip;
