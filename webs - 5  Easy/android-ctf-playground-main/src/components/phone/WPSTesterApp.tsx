import { useState } from "react";
import { ChevronLeft, Lock, Unlock } from "lucide-react";
import { DeviceState } from "../PhoneSimulator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface WPSTesterAppProps {
  goHome: () => void;
  deviceState: DeviceState;
  updateState: (updates: Partial<DeviceState>) => void;
}

const networks = [
  { ssid: "Cafe_Free_WiFi", difficulty: "easy" },
  { ssid: "Office_Guest", difficulty: "medium" },
  { ssid: "SURAJ_HOME", difficulty: "hard" },
  { ssid: "ISP-TP-LINK", difficulty: "medium" },
];

const WPSTesterApp = ({ goHome, deviceState, updateState }: WPSTesterAppProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [puzzleActive, setPuzzleActive] = useState(false);
  const [answers, setAnswers] = useState(["", "", "", ""]);

  const puzzleQuestions = [
    { q: "Device manufacturer hint: 5 letters", a: "suraj" },
    { q: "Network security type (check Settings Wi-Fi):", a: "WPA2" },
    { q: "Common router default user:", a: "admin" },
    { q: "Device Android version: X.X format", a: "5.1" },
  ];

  const handleStartPuzzle = (ssid: string) => {
    setSelectedNetwork(ssid);
    if (ssid === "SURAJ_HOME") {
      setPuzzleActive(true);
      setAnswers(["", "", "", ""]);
    } else {
      toast.info("This network doesn't require WPS testing in this simulation");
    }
  };

  const handleSubmitPuzzle = () => {
    console.log("Submitted answers:", answers);
    console.log("Expected answers:", puzzleQuestions.map(q => q.a));
    
    const results = puzzleQuestions.map((q, i) => {
      const userAnswer = answers[i].toLowerCase().trim();
      const correctAnswer = q.a.toLowerCase();
      const isCorrect = userAnswer === correctAnswer;
      console.log(`Question ${i + 1}: "${userAnswer}" === "${correctAnswer}" ? ${isCorrect}`);
      return isCorrect;
    });
    
    const allCorrect = results.every(r => r);

    if (allCorrect) {
      updateState({
        wifiConnected: true,
        connectedNetwork: "SURAJ_HOME",
        puzzleSolved: true,
        inventory: [...deviceState.inventory, "WPS_TOKEN"],
      });
      toast.success("Puzzle solved! Temporary connection granted (simulated)");
      setPuzzleActive(false);
    } else {
      toast.error("Incorrect answers. Try again!");
    }
  };

  if (puzzleActive && selectedNetwork) {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center gap-2 border-b bg-purple-600 p-4 text-white">
          <button onClick={() => setPuzzleActive(false)}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-lg font-medium">Pin Puzzle - {selectedNetwork}</h1>
        </div>

        <div className="flex-1 space-y-4 p-4">
          <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
            <p className="text-sm text-purple-800">
              <strong>Challenge:</strong> Answer all questions correctly to establish a simulated connection.
            </p>
          </div>

          <div className="space-y-4">
            {puzzleQuestions.map((question, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">{question.q}</label>
                <Input
                  value={answers[index]}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[index] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  placeholder="Your answer"
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSubmitPuzzle} className="w-full">
            Submit Answers
          </Button>

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-800">
              💡 <strong>Hints:</strong> Check the Files app, About phone info, and network details in Settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b bg-purple-600 p-4 text-white">
        <button onClick={goHome}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-lg font-medium">WPS-TESTER (simulated)</h1>
      </div>

      <div className="flex-1 space-y-4 p-4">
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-sm text-blue-800">
            This app contains puzzle-based challenges to simulate WPS testing. No real exploitation occurs.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase text-muted-foreground">Networks</h3>
          {networks.map((network) => (
            <div
              key={network.ssid}
              className="flex items-center justify-between rounded-lg border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                {deviceState.connectedNetwork === network.ssid ? (
                  <Unlock className="h-5 w-5 text-green-600" />
                ) : (
                  <Lock className="h-5 w-5 text-slate-400" />
                )}
                <div>
                  <p className="font-medium text-sm">{network.ssid}</p>
                  <p className="text-xs text-muted-foreground capitalize">{network.difficulty} difficulty</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleStartPuzzle(network.ssid)}
                disabled={deviceState.connectedNetwork === network.ssid}
              >
                {deviceState.connectedNetwork === network.ssid ? "Connected" : "Test"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WPSTesterApp;
