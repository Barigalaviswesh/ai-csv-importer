'use client';

export default function ProgressBar({ current, total, message }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {message && (
        <p className="text-sm text-muted-foreground mb-2">{message}</p>
      )}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {current} of {total} ({percentage}%)
      </p>
    </div>
  );
}
