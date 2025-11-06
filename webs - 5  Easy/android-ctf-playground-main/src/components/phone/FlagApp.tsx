import { ChevronLeft, Trophy, CheckCircle } from "lucide-react";

interface FlagAppProps {
  goHome: () => void;
}

const FlagApp = ({ goHome }: FlagAppProps) => {
  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-green-50 to-teal-50">
      <div className="flex items-center gap-2 border-b bg-green-600 p-4 text-white">
        <button onClick={goHome}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-lg font-medium">🎯 Flag</h1>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <Trophy className="h-20 w-20 text-yellow-500 mb-6" />
        
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Congratulations!
        </h1>

        <div className="mb-6 rounded-xl bg-white border-2 border-green-500 p-6 shadow-lg">
          <p className="text-xs text-muted-foreground mb-2">CTF FLAG:</p>
          <code className="text-xl font-mono font-bold text-green-700">
            ctf7&#123;br4in_d3d_4utH0R&#125;
          </code>
        </div>

        <div className="max-w-md space-y-3 text-sm">
          <p className="text-slate-700">
            You've successfully completed the Android CTF challenge!
          </p>

          <div className="rounded-lg bg-white border p-4 text-left space-y-2">
            <h3 className="font-semibold text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Achievements Unlocked:
            </h3>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>✓ Explored Wi-Fi networks</li>
              <li>✓ Solved WPS puzzle challenge</li>
              <li>✓ Accessed router admin panel</li>
              <li>✓ Found hidden clues in Files app</li>
              <li>✓ Unlocked password with owner tag</li>
              <li>✓ Applied challenge patch</li>
              <li>✓ Captured the flag!</li>
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-xs text-blue-800">
              <strong>Remember:</strong> This was a purely simulated educational environment. 
              All actions were game mechanics with no real exploitation.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">Created by @surajshankhpal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagApp;
