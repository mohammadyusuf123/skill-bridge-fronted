import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value?: number;
  subtitle: string;
  Icon?: LucideIcon;
  TrendIcon?: LucideIcon;
  progressMultiplier?: number;

  // 🎨 Customizable Colors
  overlayGradient?: string;       // background overlay
  iconGradient?: string;          // icon background
  trendIconColor?: string;        // trend icon color
  progressGradient?: string;      // progress bar gradient
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value = 0 ,
  subtitle,
  Icon,
  TrendIcon,
  progressMultiplier = 10,

  overlayGradient = "from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10",
  iconGradient = "from-blue-500 to-indigo-600",
  trendIconColor = "text-blue-500",
  progressGradient = "from-blue-500 to-indigo-600",
}) => {
  const progressWidth = Math.min(value * progressMultiplier, 100);

  return (
    <div className="group animate-fade-in animate-delay-300 animate-ease-in animate-duration-1000 animate-fill-mode-forwards animate-fill-mode-both md:h-[140px] relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
      
      {/* Overlay Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${overlayGradient}`}
      />

      <div className="relative p-3">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
          
          {/* Icon */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${iconGradient} shadow-lg`}
            >
              {Icon && <Icon className="h-6 w-6 text-white" />}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
              {value}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              {subtitle}
            </p>
          </div>

          {/* Trend Icon */}
          {TrendIcon && (
            <TrendIcon className={`h-5 w-5 opacity-50 ${trendIconColor}`} />
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${progressGradient} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
