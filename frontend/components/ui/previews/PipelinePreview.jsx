/**
 * Pipeline Stage Preview
 * Shows a mini horizontal pipeline with the target stage highlighted
 */

import { cn } from '@/lib/utils';

const DEFAULT_STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed'];

export default function PipelinePreview({ data, targetStage }) {
  if (!data) return null;

  const stages = data.stages || data.pipeline_stages || DEFAULT_STAGES;
  const currentStage = targetStage || data.stage || data.status || stages[0];
  const currentIndex = stages.findIndex(s =>
    s.toLowerCase() === (currentStage || '').toLowerCase()
  );

  return (
    <div className="w-[260px] p-3 space-y-2">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Pipeline Stage
      </div>
      <div className="flex items-center gap-0.5">
        {stages.map((stage, i) => {
          const isActive = i === currentIndex;
          const isPast = i < currentIndex;

          return (
            <div key={stage} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={cn(
                  "h-2 w-full rounded-full transition-colors",
                  isActive && "bg-gradient-to-r from-[#101010] to-[#101010]",
                  isPast && "bg-green-400 dark:bg-green-600",
                  !isActive && !isPast && "bg-gray-200 dark:bg-gray-700"
                )}
              />
              <span className={cn(
                "text-[9px] font-medium truncate max-w-full",
                isActive && "text-[#101010] dark:text-yellow-500 font-bold",
                isPast && "text-green-600 dark:text-green-400",
                !isActive && !isPast && "text-gray-400 dark:text-gray-500"
              )}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
      {data.value && (
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-700/30">
          Value: <span className="font-semibold text-gray-700 dark:text-gray-300">${Number(data.value).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
