import React, { useState } from 'react';
import { FileText, Send } from 'lucide-react';
import Timer from './Timer';

export default function WrittenQuestion({ question, onComplete }) {
    const [response, setResponse] = useState('');
    const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length;

    const handleSubmit = () => {
        onComplete({
            type: 'written',
            text: response,
            wordCount: wordCount
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <FileText className="w-3 h-3" />
                        Written Response
                    </span>
                    <Timer duration={question.maxTime} onTimeUp={handleSubmit} isActive={true} warningThreshold={60} />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">{question.text}</h2>
                <p className="text-sm text-slate-500">
                    Please write your response below. Aim for clear, concise, and well-structured paragraphs.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your answer here..."
                    className="flex-1 w-full p-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none font-sans text-slate-700 leading-relaxed"
                    spellCheck="false"
                />

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="text-sm font-medium text-slate-500">
                        Word Count: <span className="text-slate-900">{wordCount}</span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={wordCount === 0}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all ${wordCount > 0
                                ? 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md'
                                : 'bg-slate-300 cursor-not-allowed'
                            }`}
                    >
                        Submit Response
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
