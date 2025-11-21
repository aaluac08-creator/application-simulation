import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">
                            Admissions<span className="text-blue-600">Sim</span>
                        </span>
                    </Link>
                    <div className="text-sm font-medium text-slate-500 hidden sm:block">
                        Canadian University Assessment Simulator
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col">
                    {children}
                </div>
            </main>

            <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} By Alua. Built for educational practice only.</p>
                </div>
            </footer>
        </div>
    );
}
