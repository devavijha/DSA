// ./components/CodeVisualizer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Import all necessary icons
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Gemini API Setup ---
// Using optional chaining to prevent errors if import.meta is undefined
const geminiApiKey = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_GEMINI_API_KEY : undefined;
const GEMINI_API_ENDPOINT = geminiApiKey ? 
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}` : 
  '';

if (!geminiApiKey) {
  console.warn("Gemini API key (VITE_GEMINI_API_KEY) not found. Code suggestion functionality will be disabled.");
}
// --- End Gemini API Setup ---

export interface VisualizerProps {
  initialCode?: string;
  initialAlgorithm?: string;
  initialData?: number[];
}

// Simple Bar component for visualization
const Bar = ({ height, maxValue, isComparing, isSwapping }: { height: number; maxValue: number; isComparing?: boolean; isSwapping?: boolean }) => {
  const percentageHeight = maxValue > 0 ? (height / maxValue) * 100 : 0;
  let bgColor = 'bg-accent-blue'; // Default color
  if (isSwapping) {
    bgColor = 'bg-red-500'; // Color for swapping elements
  } else if (isComparing) {
    bgColor = 'bg-yellow-500'; // Color for comparing elements
  }

  return (
    <div
      className={`${bgColor} rounded-t-sm transition-all duration-200 ease-in-out mx-px flex-grow`}
      style={{ height: `${percentageHeight}%`, minHeight: '1px' }}
      title={String(height)}
    />
  );
};

// Define a type for a visualization step
interface VisualizationStep {
    arrayState: number[];
    comparingIndices?: number[];
    swappedIndices?: number[];
}

// --- Bubble Sort Step-by-Step Implementation ---
const bubbleSortStepByStep = (inputData: number[]): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const arr = [...inputData];
    const n = arr.length;
    steps.push({ arrayState: [...arr] });
    if (n <= 1) return steps;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({ arrayState: [...arr], comparingIndices: [j, j + 1] });
            if (arr[j] > arr[j + 1]) {
                steps.push({ arrayState: [...arr], comparingIndices: [j, j+1], swappedIndices: [j, j + 1] });
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                steps.push({ arrayState: [...arr] });
            }
        }
        if (!swapped) break;
    }
    steps.push({ arrayState: [...arr] });
    return steps;
};
// --- End Bubble Sort ---

const CodeVisualizer = ({
  initialCode = '// Paste or type your code here\nfunction bubbleSort(arr) {\n  let n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        // Swap elements\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}',
  initialAlgorithm = 'sorting',
  initialData = [5, 3, 8, 1, 9, 4, 7, 2, 6]
}: VisualizerProps) => {
  // Restore state for code, suggestions, and delay
  const [code, setCode] = useState(initialCode);
  const [algorithm, setAlgorithm] = useState(initialAlgorithm);
  const [data, setData] = useState<number[]>(initialData);
  const [visualizationState, setVisualizationState] = useState<VisualizationStep>({ arrayState: initialData });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<VisualizationStep[]>([{ arrayState: initialData }]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [delay, setDelay] = useState<number>(300); // Restore state for delay
  const [suggestions, setSuggestions] = useState<string>("");
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [suggestionError, setSuggestionError] = useState<string>("");

  // --- Function to fetch suggestions (MOVED INSIDE COMPONENT) ---
  const fetchSuggestions = async () => {
    if (!geminiApiKey) {
        setSuggestionError("Gemini API key not configured. Cannot fetch suggestions.");
        return;
    }
    if (!code.trim()) {
        setSuggestionError("No code to analyze.");
        return;
    }

    setIsSuggesting(true);
    setSuggestions("");
    setSuggestionError("");

    const prompt = `Analyze the following JavaScript code block and provide suggestions for improvement, optimization, potential bugs, or best practices. Format your response using Markdown:\n\n\`\`\`javascript\n${code}\n\`\`\``;

    const requestBody = {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      // generationConfig: { temperature: 0.5 } // Optional
    };

    try {
      const response = await fetch(GEMINI_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        const errorMessage = errorData?.error?.message || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const responseBlockedReason = data?.candidates?.[0]?.finishReason === 'SAFETY' ? data?.promptFeedback?.blockReason : null;
      if (responseBlockedReason) {
        throw new Error(`Response blocked due to safety settings: ${responseBlockedReason}`);
      }
      const suggestionText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (suggestionText) {
        setSuggestions(suggestionText);
      } else {
        console.error("Gemini Response Empty:", data);
        throw new Error("Received an empty response from the AI.");
      }
    } catch (error: any) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestionError(`Failed to get suggestions: ${error.message}`);
    } finally {
      setIsSuggesting(false);
    }
  };
  // --- End fetch suggestions function ---

  // Generate steps effect
  useEffect(() => {
    let generatedSteps: VisualizationStep[] = [{ arrayState: [...data] }];
    if (algorithm === 'sorting' && data.length > 0) {
        generatedSteps = bubbleSortStepByStep(data);
    }
    setSteps(generatedSteps);
    setCurrentStep(0);
    setVisualizationState(generatedSteps[0] || { arrayState: [] });
    setIsPlaying(false);
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
  }, [data, code, algorithm]); // Keep 'code' dependency if suggestions depend on it

  // Update visualization state effect
  useEffect(() => {
    if (steps[currentStep]) {
      setVisualizationState(steps[currentStep]);
    }
  }, [currentStep, steps]);

  // Play/Pause interval effect
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prevStep => {
          const nextStep = prevStep + 1;
          if (nextStep >= steps.length) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prevStep;
          }
          return nextStep;
        });
      }, delay);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, steps.length, delay]);

  // Data change handler
  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDataString = event.target.value;
    try {
      const parsedData = newDataString.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      setData(parsedData);
    } catch (error) {
      console.error("Invalid data format:", error);
    }
  };

  // Handle code change
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  // --- Control Handlers ---
  const handlePlayPause = () => {
      if (currentStep >= steps.length - 1 && !isPlaying) {
          setCurrentStep(0);
      }
      setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (!isPlaying && currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    }
  };

  const handleStepBackward = () => {
    if (!isPlaying && currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleReset = () => {
      const firstStep = steps[0] || { arrayState: initialData };
      setVisualizationState(firstStep);
      setCurrentStep(0);
      setIsPlaying(false);
      if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
      }
  }
  // --- End Control Handlers ---

  const currentArray = visualizationState.arrayState || [];
  const maxValue = Math.max(...currentArray, 1);

  return (
    <div className="p-6 bg-card rounded-lg border border-border shadow-md flex flex-col h-[85vh] max-h-[900px]">
      <h1 className="text-2xl font-bold mb-6 text-center">Code & Data Visualizer</h1>

      <div className="flex flex-grow gap-6 overflow-hidden">

        {/* Left Panel: Code & Config */}
        <div className="w-1/2 flex flex-col gap-4 pr-3 overflow-y-auto custom-scrollbar">
          {/* Code Display/Input Area */}
          <div>
            <div className="flex justify-between items-center mb-2">
                 <h2 className="text-lg font-semibold">Code</h2>
                 <button
                    onClick={fetchSuggestions}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-accent-blue hover:bg-accent-blue/90 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSuggesting || !geminiApiKey}
                    title={!geminiApiKey ? "Gemini API Key not configured" : "Get Code Suggestions"}
                 >
                    <Lightbulb size={16} />
                    {isSuggesting ? "Getting..." : "Suggestions"}
                 </button>
            </div>
            <div className="border border-border rounded-md overflow-hidden mb-4">
              {/* Using syntax highlighter in read-only mode */}
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{ margin: 0, minHeight: '150px', maxHeight: '35vh', overflowY: 'auto' }}
                wrapLines={true}
                showLineNumbers={true}
              >
                {code}
              </SyntaxHighlighter>
            </div>
             {/* Suggestion Display Area */}
             {(suggestions || suggestionError || isSuggesting) && (
                <div className="mt-4 p-3 border border-border rounded-md bg-background max-h-[25vh] overflow-y-auto custom-scrollbar">
                    <h3 className="text-md font-semibold mb-2 text-accent-purple">Code Suggestions</h3>
                    {isSuggesting && <p className="text-muted-foreground">Loading suggestions...</p>}
                    {suggestionError && <p className="text-red-500 text-sm">{suggestionError}</p>}
                    {suggestions && !isSuggesting && (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                      <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                      >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                                    ) : (
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    )
                                  }
                            }}
                            className="prose prose-sm dark:prose-invert max-w-none"
                        >
                            {suggestions}
                        </ReactMarkdown>
                    )}
                </div>
             )}
          </div>

          {/* Algorithm selection */}
          <div>
            <label htmlFor="algorithm-select" className="block text-lg font-semibold mb-2">Algorithm Type</label>
            <select
              id="algorithm-select"
              className="w-full p-2 bg-pink-700 border border-border rounded-md focus:ring-1 focus:ring-accent-blue focus:outline-none text-foreground"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="sorting">Sorting</option>
              <option value="searching">Searching</option>
              <option value="graph">Graph Traversal</option>
              <option value="tree">Tree Operations</option>
            </select>
          </div>

           {/* Data Input */}
           <div>
             <label htmlFor="data-input" className="block text-lg font-semibold mb-2">Input Data (comma-separated numbers)</label>
             <input
               id="data-input"
               type="text"
               className="w-full p-2 bg-pink-700 border border-border rounded-md focus:ring-1 focus:ring-accent-blue focus:outline-none text-foreground"
               value={data.join(', ')}
               onChange={handleDataChange}
               placeholder="e.g., 5, 3, 8, 1, 9"
             />
           </div>

           {/* Speed Control */}
           <div>
             <label htmlFor="speed-slider" className="block text-lg font-semibold mb-2">Animation Speed (ms)</label>
             <input
               id="speed-slider"
               type="range"
               min="50"
               max="1000"
               step="50"
               value={delay}
               onChange={(e) => setDelay(Number(e.target.value))}
               className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent-blue"
             />
             <div className="text-center text-sm text-muted-foreground mt-1">{delay}ms</div>
           </div>
        </div>

        {/* Right Panel: Visualization & Controls */}
        <div className="w-1/2 flex flex-col border-l border-border pl-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Visualization</h2>
          {/* Visualization Area */}
          <div className="flex-grow p-4 bg-background border border-border rounded-md flex items-end justify-center min-h-[300px]">
            {algorithm === 'sorting' && currentArray.length > 0 ? (
              <div className="flex items-end w-full h-full gap-px">
                {currentArray.map((value, index) => {
                  const isComparing = visualizationState.comparingIndices?.includes(index);
                  const isSwapping = visualizationState.swappedIndices?.includes(index);
                  return (
                    <Bar
                      key={`${index}-${value}-${currentStep}`}
                      height={value}
                      maxValue={maxValue}
                      isComparing={isComparing}
                      isSwapping={isSwapping}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground self-center">
                {algorithm === 'sorting' && data.length === 0 ? 'Enter numeric data to visualize sorting.' :
                 algorithm ? `Select 'Sorting' and provide numeric data for bar visualization.` : 'Select an algorithm type and provide data.'}
              </p>
            )}
          </div>

           {/* Controls */}
           <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-border">
             <button onClick={handleStepBackward} title="Step Backward" className="p-2 rounded-md hover:bg-muted disabled:opacity-50" disabled={currentStep === 0 || isPlaying}>
               <SkipBack size={20} />
             </button>
             <button onClick={handlePlayPause} title={isPlaying ? "Pause" : "Play"} className="p-2 rounded-md hover:bg-muted" disabled={steps.length <= 1}>
               {isPlaying ? <Pause size={24} /> : <Play size={24} />}
             </button>
             <button onClick={handleStepForward} title="Step Forward" className="p-2 rounded-md hover:bg-muted disabled:opacity-50" disabled={currentStep >= steps.length - 1 || isPlaying}>
               <SkipForward size={20} />
             </button>
              <button onClick={handleReset} title="Reset" className="p-2 rounded-md hover:bg-muted ml-4">
               <RotateCcw size={20} />
             </button>
           </div>
           {/* Display current step */}
           <div className="text-center text-sm text-muted-foreground mt-2">
             Step: {currentStep + 1} / {steps.length}
           </div>
        </div>

      </div>
    </div>
  );
};

export default CodeVisualizer;