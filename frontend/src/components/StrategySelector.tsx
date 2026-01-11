import { Target, TrendingDown, Medal, Trophy, Zap, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

type Strategy = 'WIN' | 'PLACE' | 'BRACKET' | 'WIDE' | 'EXACTA' | 'TRIO';

interface StrategySelectorProps {
  selectedStrategy: Strategy;
  onSelectStrategy: (strategy: Strategy) => void;
}

export default function StrategySelector({ selectedStrategy, onSelectStrategy }: StrategySelectorProps) {
  const strategies = [
    {
      id: 'WIN' as Strategy,
      name: '単勝',
      nameEn: 'WIN',
      description: '1着のみ的中',
      icon: Trophy,
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      iconBgSelected: 'bg-white/20',
      iconBgUnselected: 'bg-blue-50',
      iconColorUnselected: 'text-blue-600',
    },
    {
      id: 'PLACE' as Strategy,
      name: '複勝',
      nameEn: 'PLACE',
      description: '1-3着で的中',
      icon: Medal,
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      gradient: 'from-green-500 to-green-600',
      iconBgSelected: 'bg-white/20',
      iconBgUnselected: 'bg-green-50',
      iconColorUnselected: 'text-green-600',
    },
    {
      id: 'BRACKET' as Strategy,
      name: '馬連',
      nameEn: 'UMAREN',
      description: '予測1-2位が1-2着',
      icon: Target,
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600',
      iconBgSelected: 'bg-white/20',
      iconBgUnselected: 'bg-purple-50',
      iconColorUnselected: 'text-purple-600',
    },
    {
      id: 'WIDE' as Strategy,
      name: 'ワイド',
      nameEn: 'WIDE',
      description: '予測1-2位が1-3着',
      icon: TrendingDown,
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      gradient: 'from-yellow-500 to-yellow-600',
      iconBgSelected: 'bg-white/20',
      iconBgUnselected: 'bg-yellow-50',
      iconColorUnselected: 'text-yellow-600',
    },
    {
      id: 'EXACTA' as Strategy,
      name: '馬単',
      nameEn: 'UMATAN',
      description: '予測1位→2位が1着→2着',
      icon: Zap,
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      gradient: 'from-orange-500 to-orange-600',
      iconBgSelected: 'bg-white/20',
      iconBgUnselected: 'bg-orange-50',
      iconColorUnselected: 'text-orange-600',
    },
    {
      id: 'TRIO' as Strategy,
      name: '3連複',
      nameEn: 'TRIO',
      description: '予測1-3位が1-3着',
      icon: Sparkles,
      borderColor: 'border-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      gradient: 'from-pink-500 to-pink-600',
      iconBgSelected: 'bg-white/20',
      iconBgUnselected: 'bg-pink-50',
      iconColorUnselected: 'text-pink-600',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Target className="w-5 h-5" />
        戦略を選択
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {strategies.map((strategy) => {
          const Icon = strategy.icon;
          const isSelected = selectedStrategy === strategy.id;
          
          return (
            <button
              key={strategy.id}
              onClick={() => onSelectStrategy(strategy.id)}
              className={cn(
                "relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300",
                "border-2 hover:scale-105 hover:shadow-lg",
                isSelected
                  ? `${strategy.borderColor} bg-gradient-to-br ${strategy.gradient} text-white shadow-lg scale-105`
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              {/* 背景装飾 */}
              <div className={cn(
                "absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-20",
                isSelected ? "bg-white" : `bg-gradient-to-br ${strategy.gradient}`
              )} />
              
              <div className="relative flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 p-2 rounded-lg",
                  isSelected ? strategy.iconBgSelected : strategy.iconBgUnselected
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isSelected ? "text-white" : strategy.iconColorUnselected
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base mb-0.5">
                    {strategy.name}
                    <span className={cn(
                      "ml-2 text-xs font-normal",
                      isSelected ? "text-white/80" : "text-gray-500"
                    )}>
                      ({strategy.nameEn})
                    </span>
                  </div>
                  <div className={cn(
                    "text-xs",
                    isSelected ? "text-white/90" : "text-gray-600"
                  )}>
                    {strategy.description}
                  </div>
                </div>
              </div>
              
              {/* 選択インジケーター */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
