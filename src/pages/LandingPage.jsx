import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { PROGRAMS } from '../utils/questions';
import { ArrowRight, Clock, Video, FileText } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const { dispatch } = useAssessment();

    const handleSelectProgram = (program) => {
        dispatch({ type: 'SELECT_PROGRAM', payload: program });
        navigate('/instructions');
    };

    return (
        <div className="py-8 sm:py-12">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    University Admissions Simulator
                </h1>
                <p className="text-lg text-slate-600">
                    Practice for real video interviews and written assessments used by top Canadian universities.
                    Select a program below to begin your simulation.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {PROGRAMS.map((program) => (
                    <div
                        key={program.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                        onClick={() => handleSelectProgram(program)}
                    >
                        <div className={`h-2 ${program.color}`} />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {program.name}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500">{program.university}</p>
                                </div>
                            </div>

                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                {program.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Video className="w-4 h-4" />
                                    <span>Video Questions</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FileText className="w-4 h-4" />
                                    <span>Written Response</span>
                                </div>
                            </div>

                            <button
                                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium rounded-lg border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                            >
                                Start Practice
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
