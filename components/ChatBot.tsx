import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { AnalysisResult, ChatMessage } from '../types';
import { createChatSession } from '../services/geminiService';
import { Chat } from "@google/genai";

interface Props {
  data: AnalysisResult;
}

export const ChatBot: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I\'ve analyzed the customer reviews. Ask me anything about the data!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session when component mounts or data changes
    chatSessionRef.current = createChatSession(data);
    // Reset messages on new data
    setMessages([
        { role: 'model', text: 'Hi! I\'ve analyzed the customer reviews. Ask me anything about the data!' }
    ]);
  }, [data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatSessionRef.current) return;

    const userText = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userText });
      const responseText = result.text || "I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all duration-300 z-50 ${
            isOpen ? 'bg-red-500 rotate-90' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageCircle className="text-white w-6 h-6" />}
      </button>

      {/* Chat Interface */}
      <div className={`fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 transition-all duration-300 transform origin-bottom-right z-50 overflow-hidden flex flex-col ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'
      }`} style={{ height: '500px' }}>
        
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
                <Bot className="text-white w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-white">Sentiment Assistant</h3>
                <p className="text-indigo-200 text-xs">Powered by Gemini 3 Pro</p>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}>
                    {msg.text}
                </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
                 <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-xs text-slate-500">Thinking...</span>
                 </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 placeholder-slate-400"
                    placeholder="Ask about the trends..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </>
  );
};