import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  badge?: string;
  hover?: boolean;
}

export function Card({ children, className = '', title, icon, badge, hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-200 
        ${hover ? 'hover:shadow-lg hover:scale-[1.01] transition-all duration-300' : ''}
        ${className}
      `}
    >
      {(title || icon || badge) && (
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && <div className="text-2xl">{icon}</div>}
              {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
            </div>
            {badge && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                {badge}
              </span>
            )}
          </div>
        </div>
      )}
      <div className={title || icon || badge ? 'p-6' : 'p-6'}>
        {children}
      </div>
    </div>
  );
}

// 軽量版（パディングなし）
export function CardSimple({ children, className = '', hover = false }: Pick<CardProps, 'children' | 'className' | 'hover'>) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-200
        ${hover ? 'hover:shadow-lg hover:scale-[1.01] transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
