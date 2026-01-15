'use client';

interface GameHUDProps {
  fps?: number;
  score?: number;
  isRunning: boolean;
}

export function GameHUD({ fps = 0, score = 0, isRunning }: GameHUDProps) {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
      <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2">
        <div className="text-white/80 text-sm font-mono">
          FPS: {fps}
        </div>
      </div>
      
      <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2">
        <div className="text-white/80 text-sm font-mono">
          Score: {score.toLocaleString()}
        </div>
      </div>
      
      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/60 text-lg font-medium">
            PAUSED
          </div>
        </div>
      )}
    </div>
  );
}
