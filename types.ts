export interface SentimentPoint {
  date: string;
  sentiment: number; // -1 to 1
  volume: number;
}

export interface WordCloudItem {
  text: string;
  value: number; // Frequency/Importance
  type: 'complaint' | 'praise' | 'neutral';
}

export interface ActionableArea {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResult {
  timeline: SentimentPoint[];
  wordCloud: WordCloudItem[];
  summary: {
    overview: string;
    actionableAreas: ActionableArea[];
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}