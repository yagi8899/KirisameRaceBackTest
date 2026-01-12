import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  className?: string;
}

export function Accordion({ 
  title, 
  icon, 
  children, 
  defaultOpen = false, 
  badge,
  className = '' 
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-xl">{icon}</div>}
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {badge && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className="text-gray-500">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100 animate-slideDown">
          {children}
        </div>
      )}
    </div>
  );
}

// アニメーション用CSS（App.cssに追加必要）
// @keyframes slideDown {
//   from {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// .animate-slideDown {
//   animation: slideDown 0.3s ease-out;
// }
