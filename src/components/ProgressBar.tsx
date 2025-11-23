interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = Math.min(100, Math.round(((current + 1) / total) * 100));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-grayText">
        <span className="font-semibold text-darkPurple">Vraag {current + 1} / {total}</span>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-primaryPurple shadow-sm">
          7 minuten totaal
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/60 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primaryPurple to-darkPurple transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
