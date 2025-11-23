import React, { useState } from 'react';
import { analyzeReviews } from './services/geminiService';
import { AnalysisResult } from './types';
import { SentimentChart } from './components/SentimentChart';
import { WordCloud } from './components/WordCloud';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { ChatBot } from './components/ChatBot';
import { LayoutDashboard, Sparkles, FileText, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const SAMPLE_DATA = `
2023-10-01: "The new interface is sleek, but the login is buggy."
2023-10-02: "Customer service was extremely helpful today. Thanks Sarah!"
2023-10-05: "I hate the billing update. It's so confusing to find my invoices now."
2023-10-08: "Amazing performance on the mobile app compared to the last version."
2023-10-12: "Why is the load time so slow? I'm waiting 10 seconds for the dashboard."
2023-10-15: "Love the dark mode feature! Best update yet."
2023-10-20: "Support didn't reply for 3 days. Very frustrating."
2023-10-25: "The analytics feature is exactly what we needed for our Q4 planning."
2023-10-28: "Too expensive for the value provided. Thinking of switching."
2023-10-30: "Great job team, the app feels much more stable."
`;

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeReviews(inputText);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze reviews. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sentiment 360</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
             <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 2.5 Thinking
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Input Section */}
        <div className={`transition-all duration-500 ease-in-out ${analysis ? 'mb-8' : 'min-h-[70vh] flex flex-col justify-center'}`}>
            
            {!analysis && (
                <div className="text-center mb-10 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Turn Feedback into Strategy</h2>
                    <p className="text-lg text-slate-600">
                        Paste your raw customer reviews below. Our AI will analyze sentiment trends, extract key themes, and provide actionable executive summaries instantly.
                    </p>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <FileText className="w-4 h-4" />
                        Raw Reviews
                    </div>
                    {!analysis && (
                        <button 
                            onClick={() => setInputText(SAMPLE_DATA)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                            Load Sample Data
                        </button>
                    )}
                </div>
                <div className="p-2">
                    <textarea
                        className="w-full h-48 p-4 text-slate-700 placeholder-slate-400 focus:outline-none resize-y font-mono text-sm"
                        placeholder="Paste your batch of reviews here (e.g. from CSV, emails, or chat logs)..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !inputText.trim()}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                Generate Report
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}
        </div>

        {/* Dashboard Results */}
        {analysis && (
            <div className="animate-fade-in space-y-6">
                {/* Executive Summary Row */}
                <ExecutiveSummary 
                    overview={analysis.summary.overview}
                    actions={analysis.summary.actionableAreas}
                />

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SentimentChart data={analysis.timeline} />
                    <WordCloud data={analysis.wordCloud} />
                </div>
            </div>
        )}

        {/* Chatbot Overlay */}
        {analysis && <ChatBot data={analysis} />}

      </main>
    </div>
  );
};

export default App;