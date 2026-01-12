import { TrendingUp, Users, Target, Calendar } from 'lucide-react';

interface DataStats {
  totalRaces: number;
  totalHorses: number;
  predictionAccuracy: {
    rank1HitRate: number;
    rank1_3HitRate: number;
  };
}

interface StatisticsCardsProps {
  stats: DataStats;
}

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  const cards = [
    {
      icon: Calendar,
      label: '総レース数',
      value: stats.totalRaces,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      label: '総頭数',
      value: stats.totalHorses,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Target,
      label: '予測1位的中率',
      value: `${(stats.predictionAccuracy.rank1HitRate * 100).toFixed(1)}%`,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: TrendingUp,
      label: '1-3位的中率',
      value: `${(stats.predictionAccuracy.rank1_3HitRate * 100).toFixed(1)}%`,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-full -mr-16 -mt-16`} />
            <div className="relative p-6">
              <div className={`inline-flex p-3 rounded-lg ${card.bgColor} mb-4`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <div className="text-sm text-gray-600 mb-1">{card.label}</div>
              <div className={`text-3xl font-bold ${card.textColor}`}>{card.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
