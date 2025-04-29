"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Code, Brain, Zap, ChevronRight, Sparkles, Send, User } from "lucide-react"; // Added User icon
import ReactMarkdown from 'react-markdown'; // Import from 'react-markdown'
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Note: To fix the TypeScript error "Could not find a declaration file for module 'react-syntax-highlighter'", run:
// npm install --save-dev @types/react-syntax-highlighter
// or add a declaration file (e.g., `declarations.d.ts`) with:
// declare module 'react-syntax-highlighter';
// declare module 'react-syntax-highlighter/dist/esm/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a style


// --- Gemini API Setup ---
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

if (!geminiApiKey) {
  console.warn("Gemini API key (VITE_GEMINI_API_KEY) not found. AI Agent chat functionality will be disabled.");
}
// --- End Gemini API Setup ---


interface Agent {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  capabilities: string[];
  examples: string[];
  // System prompts are handled differently in Gemini API calls (within the 'contents')
  // We can keep this for context but won't pass it directly as a 'system' role message like OpenAI
  systemPrompt?: string;
}

interface ChatMessage {
  // Gemini uses 'user' and 'model' roles
  role: 'user' | 'model' | 'system'; // Keep 'system' internally for initial prompt if needed
  content: string;
}

// Helper to convert internal messages to Gemini format
const convertMessagesToGeminiFormat = (messages: ChatMessage[]) => {
  return messages
    // Filter out internal 'system' messages if they exist, handle them separately if needed
    .filter(msg => msg.role === 'user' || msg.role === 'model')
    .map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
};


export default function AIAgents() {
  const [activeAgentId, setActiveAgentId] = useState<string>("code-assistant");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  const agents: Agent[] = [
     {
      id: "code-assistant",
      name: "Code Assistant",
      icon: <Code className="w-8 h-8 text-accent-blue" />,
      description: "Helps you write, debug, and optimize your code.",
      capabilities: [
        "Generate code snippets based on your requirements",
        "Debug and fix errors in your code",
        "Optimize code for better performance",
        "Explain complex code in simple terms",
      ],
      examples: [
        "Write a function to find the longest substring without repeating characters",
        "Debug this recursive function that's causing a stack overflow",
        "Optimize this sorting algorithm for better time complexity",
      ],
      // Updated System Prompt
      systemPrompt: "You are a specialized AI Code Assistant. Your expertise is strictly limited to programming, code debugging, optimization, and explaining code concepts. Politely decline any requests outside this scope, stating you can only assist with coding-related topics."
    },
    {
      id: "algorithm-coach",
      name: "Algorithm Coach",
      icon: <Brain className="w-8 h-8 text-accent-purple" />,
      description: "Teaches algorithms and data structures.",
       capabilities: [
        "Explain algorithms step-by-step",
        "Visualize data structures and their operations",
        "Provide complexity analysis of algorithms",
        "Suggest optimal algorithms for specific problems",
      ],
      examples: [
        "Explain how the Dijkstra's algorithm works",
        "What's the difference between merge sort and quick sort?",
        "How does a red-black tree maintain balance?",
      ],
       // Updated System Prompt
       systemPrompt: "You are an AI Algorithm Coach. Your sole focus is teaching algorithms and data structures, including their analysis and application. Politely refuse any questions not related to algorithms, data structures, or complexity analysis, explaining your specific focus."
    },
    {
      id: "interview-prep",
      name: "Interview Prep",
      icon: <Zap className="w-8 h-8 text-accent-yellow" />,
      description: "Prepares you for technical interviews.",
      capabilities: [
        "Generate interview-style coding problems",
        "Conduct mock technical interviews",
        "Provide feedback on your solutions",
        "Share interview tips and strategies",
      ],
      examples: [
        "Give me a medium-level graph problem similar to what Google might ask",
        "Review my solution to this dynamic programming problem",
        "What are common mistakes to avoid in a system design interview?",
      ],
      // Updated System Prompt
      systemPrompt: "You are an AI Interview Coach focused on technical software engineering interviews. Provide coding problems, conduct mock interviews, give feedback on solutions, and discuss interview strategies within this domain. Decline requests unrelated to technical interview preparation, stating your specific purpose."
    },
    {
      id: "learning-assistant",
      name: "Learning Assistant",
      icon: <Sparkles className="w-8 h-8 text-accent-green" />,
      description: "Helps you learn new programming concepts.",
       capabilities: [
        "Create personalized learning paths",
        "Explain complex concepts in simple terms",
        "Provide practice exercises and projects",
        "Track your progress and suggest improvements",
      ],
      examples: [
        "Help me understand closures in JavaScript",
        "Create a learning path for mastering React",
        "What project should I build to practice my Python skills?",
      ],
      // Updated System Prompt
      systemPrompt: "You are an AI Learning Assistant for programming and software development concepts. Explain technical topics, create learning plans, and suggest relevant exercises. Politely decline any questions outside the scope of learning software development, explaining your role."
    },
  ];

  const activeAgent = agents.find(agent => agent.id === activeAgentId);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleAgentChange = (id: string) => {
    setActiveAgentId(id);
    setIsChatOpen(false);
    setMessages([]);
  };

  const handleOpenChat = () => {
    // Check if the Gemini API key is available
    if (!geminiApiKey) {
       alert("AI Chat is disabled. Please configure your Gemini API key (VITE_GEMINI_API_KEY).");
       return;
    }
    // Optionally, add the system prompt as the first message or handle it in the API call
    // For simplicity here, we just clear messages. You might want to prepend the system prompt
    // to the 'contents' array in handleSendMessage if needed.
    setMessages([]);
    setIsChatOpen(true);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !geminiApiKey || !activeAgent) return;

    const newUserMessage: ChatMessage = { role: 'user', content: inputMessage };
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    setInputMessage("");
    setIsLoading(true);

    // Prepare messages for Gemini API (user/model turns)
    const geminiMessages = convertMessagesToGeminiFormat(currentMessages);

    // Prepare the request body including system instruction
    const requestBody: {
      contents: {
        role: string;
        parts: { text: string }[];
      }[];
      systemInstruction?: {
        parts: { text: string }[];
      };
    } = {
      contents: geminiMessages,
      // Add generationConfig if needed
      // generationConfig: {
      //   temperature: 0.7,
      //   maxOutputTokens: 1000,
      // }
    };

    // Add system instruction if the agent has one
    if (activeAgent.systemPrompt) {
      requestBody.systemInstruction = {
        parts: [{ text: activeAgent.systemPrompt }]
      };
    }

    try {
      const response = await fetch(GEMINI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the constructed request body
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        // Check for specific Gemini error structures if needed
        const errorMessage = errorData?.error?.message || 'Unknown API error';
        // Check for blocked content due to safety settings
        const blockedReason = errorData?.promptFeedback?.blockReason; // Use errorData here
        if (blockedReason) {
           throw new Error(`Request blocked due to safety settings: ${blockedReason}. Please rephrase your prompt.`);
        } else {
           throw new Error(`API request failed with status ${response.status}: ${errorMessage}`);
        }
      }

      const data = await response.json();

       // Check for blocked content in the response
      const responseBlockedReason = data?.candidates?.[0]?.finishReason === 'SAFETY' ? data?.promptFeedback?.blockReason : null;
       if (responseBlockedReason) {
         console.error("Gemini Response Blocked:", data);
         setMessages(prev => [...prev, { role: 'model', content: `My response was blocked due to safety settings (${responseBlockedReason}). I cannot provide an answer to that.` }]);
         return; // Stop processing if response is blocked
       }


      // Extract the response text
      const assistantResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (assistantResponse) {
        setMessages(prev => [...prev, { role: 'model', content: assistantResponse }]);
      } else {
         // Handle cases where response might be empty or missing parts
         console.error("Could not parse assistant response or response was empty:", data);
         // Check if there was a finish reason other than 'STOP' (like MAX_TOKENS, SAFETY etc.)
         const finishReason = data.candidates?.[0]?.finishReason;
         let errorMsg = "Sorry, I couldn't get a valid response.";
         if (finishReason && finishReason !== 'STOP') {
            errorMsg += ` (Reason: ${finishReason})`;
         }
         setMessages(prev => [...prev, { role: 'model', content: errorMsg }]);
      }

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages(prev => [...prev, { role: 'model', content: `Sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key, network, and prompt.` }]);
    } finally {
      setIsLoading(false);
    }
  };


  // Function to handle clicking on an example prompt
  const handleExampleClick = (example: string) => {
    if (!isChatOpen) {
      handleOpenChat(); // Open chat if closed
    }
    // Need a slight delay to ensure chat is open before setting input
    setTimeout(() => {
        setInputMessage(example);
        // Optional: Focus the input field after setting the message
        // document.getElementById('chat-input')?.focus();
        // Optional: Automatically send the message
        // handleSendMessage(); // Be careful with auto-sending if API calls cost money/quota
    }, 50); // Small delay
  };


  return (
    <section className="py-12 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold flex items-center justify-center gap-4">
            <Bot className="w-12 h-12 text-accent-blue" />
            AI Agents at Your Service
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-4">
            Our specialized AI agents are designed to help you at every step of
            your coding journey, from learning to mastering algorithms.
          </p>
        </div>


        <div className="grid md:grid-cols-4 gap-6">
          {/* Agent selector */}
          <div className="bg-card rounded-lg overflow-hidden border border-border self-start">
            <div className="p-4 bg-card-hover border-b border-border">
              <h3 className="font-semibold">Choose an Agent</h3>
            </div>
            <div className="p-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => handleAgentChange(agent.id)} // Updated handler
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeAgentId === agent.id // Use activeAgentId
                      ? "bg-accent-blue/10 text-accent-blue"
                      : "hover:bg-card-hover text-secondary"
                  }`}
                >
                  {agent.icon}
                  <span>{agent.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Agent details and Chat */}
          <div className="md:col-span-3">
            {activeAgent && (
              <motion.div
                key={activeAgent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-lg border border-border h-[70vh] max-h-[800px] flex flex-col" // Added fixed height
              >
                {/* Agent Info Section (Always Visible) */}
                <div className="p-6 border-b border-border">
                   {/* ... existing agent info display ... */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-card-hover rounded-lg">
                        {activeAgent.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{activeAgent.name}</h3>
                        <p className="text-secondary mt-1">{activeAgent.description}</p>
                      </div>
                    </div>
                </div>

                {/* Capabilities & Examples (Visible when chat is CLOSED) */}
                {!isChatOpen && (
                  <div className="p-6 grid md:grid-cols-2 gap-6 overflow-y-auto"> {/* Added overflow */}
                    {/* Capabilities List */}
                    <div>
                       {/* ... existing capabilities display ... */}
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-accent-blue" />
                        Capabilities
                      </h4>
                      <ul className="space-y-2">
                        {activeAgent.capabilities.map((capability, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-secondary"
                          >
                            <ChevronRight className="w-4 h-4 text-accent-blue mt-1 flex-shrink-0" />
                            <span>{capability}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Example Prompts List (Now Clickable) */}
                    <div>
                       {/* ... existing examples display ... */}
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent-yellow" />
                        Example Prompts
                      </h4>
                      <ul className="space-y-3">
                        {activeAgent.examples.map((example, index) => (
                          <li key={index}>
                            <button
                              onClick={() => handleExampleClick(example)}
                              disabled={!geminiApiKey} // Disable if chat can't be opened
                              className="w-full text-left bg-card-hover p-3 rounded-lg text-sm hover:bg-accent-blue/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              title={!geminiApiKey ? "API Key Missing" : `Use prompt: "${example}"`}
                            >
                              "{example}"
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Chat Interface Section */}
                {isChatOpen ? (
                  <div className="flex flex-col flex-grow p-4 space-y-2 overflow-hidden"> {/* Reduced space-y */}
                    {/* Message list with improved styling */}
                    <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                      {messages.filter(msg => msg.role !== 'system').map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}> {/* Changed to items-start */}
                           {/* Avatar Placeholder - Model */}
                           {msg.role === 'model' && (
                             <div className="w-7 h-7 mt-1 rounded-full bg-card-hover flex items-center justify-center text-accent-blue flex-shrink-0"> {/* Added mt-1 */}
                               <Bot size={16} />
                             </div>
                           )}

                          {/* Message Bubble with Markdown */}
                          <div className={`p-3 rounded-lg max-w-[80%] shadow-sm text-sm ${ // Consistent text size
                            msg.role === 'user'
                              ? 'bg-accent-blue text-white rounded-br-none'
                              : 'bg-card-hover text-foreground rounded-bl-none'
                          }`}>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline && match ? (
                                    <SyntaxHighlighter
                                      style={vscDarkPlus} // Assuming vscDarkPlus is imported, e.g., import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
                                      language={match[1]}
                                      PreTag="div"
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  );
                                }
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>

                           {/* Avatar Placeholder - User */}
                           {msg.role === 'user' && (
                             <div className="w-7 h-7 mt-1 rounded-full bg-card-hover flex items-center justify-center text-secondary flex-shrink-0"> {/* Added mt-1 */}
                               <User size={16} /> {/* Using User icon */}
                             </div>
                           )}
                        </div>
                      ))}
                       {/* Enhanced Typing Indicator */}
                       {isLoading && (
                         <div className="flex items-start gap-3 justify-start"> {/* Changed to items-start */}
                            <div className="w-7 h-7 mt-1 rounded-full bg-card-hover flex items-center justify-center text-accent-blue flex-shrink-0"> {/* Added mt-1 */}
                               <Bot size={16} />
                             </div>
                           <div className="p-3 rounded-lg bg-card-hover text-foreground rounded-bl-none italic flex items-center gap-1 text-sm"> {/* Consistent text size */}
                             <span className="animate-pulse">.</span>
                             <span className="animate-pulse" style={{animationDelay: '0.1s'}}>.</span> {/* Stagger animation */}
                             <span className="animate-pulse" style={{animationDelay: '0.2s'}}>.</span>
                           </div>
                         </div>
                       )}
                      <div ref={chatEndRef} />
                    </div>
                     {/* Input area */}
                    <div className="flex items-center gap-3 border-t border-border pt-4 mt-2">
                      <input
                        id="chat-input" // Added ID for potential focus()
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        placeholder={activeAgent ? `Ask ${activeAgent.name}...` : "Ask something..."} // Dynamic placeholder
                        className="flex-grow bg-card-hover border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-accent-blue text-sm"
                        disabled={isLoading || !geminiApiKey}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim() || !geminiApiKey}
                        className="p-2.5 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* "Chat with Agent" Button */
                  <div className="p-6 mt-auto border-t border-border">
                    <button
                      onClick={handleOpenChat}
                      disabled={!geminiApiKey}
                      className="w-full py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Chat with {activeAgent.name}
                       {!geminiApiKey && " (API Key Missing)"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
