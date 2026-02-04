import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MessageSquare, BarChart3, Star, AlertCircle, Quote, TrendingUp, Users, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import type { AppEvent } from '../types/event';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useEventStore } from '../store/eventStore';

export const EventFeedback: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { updateEvent } = useEventStore();
    const [isConnecting, setIsConnecting] = useState(false);

    const scores = {
        organization: 4.8,
        content: 4.6,
        venue: 4.5,
        hospitality: 4.9
    };

    const handleConnect = async () => {
        setIsConnecting(true);
        // Simulate API call to connect Google Form
        setTimeout(() => {
            updateEvent(event.id, { feedbackUrl: 'https://docs.google.com/forms/sample' });
            setIsConnecting(false);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Post-Event <span className="text-indigo-600">Evaluation</span></h2>
                    <p className="text-slate-500 font-medium mt-1">Analyze performance and gather insights from participants.</p>
                </div>
                {event.feedbackUrl ? (
                    <Button variant="outline" className="shadow-sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live Google Form
                    </Button>
                ) : (
                    <Button onClick={handleConnect} isLoading={isConnecting} className="premium-gradient shadow-lg">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Connect Google Forms
                    </Button>
                )}
            </div>

            {/* Overall Rating Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-8 bg-slate-900 text-white border-0 shadow-2xl md:col-span-1 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Overall Score</p>
                    <div className="flex items-center mb-2">
                        <h3 className="text-6xl font-black mr-2">4.7</h3>
                    </div>
                    <div className="flex space-x-1 mb-4">
                        {[1, 2, 3, 4].map(i => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
                        <Star size={16} className="fill-amber-400/30 text-amber-400/30" />
                    </div>
                    <p className="text-xs font-medium text-slate-400">Based on 124 responses</p>
                </Card>

                <Card className="p-8 md:col-span-3">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Performance breakdown</h4>
                    <div className="space-y-6">
                        {Object.entries(scores).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="capitalize text-slate-700">{key}</span>
                                    <span className="text-indigo-600">{value}/5.0</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                    <div className="premium-gradient h-full rounded-full" style={{ width: `${(value / 5) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Key Insights */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-3 text-indigo-600" />
                        Key Analysis
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="p-6 border-emerald-100 bg-emerald-50/20">
                            <h4 className="flex items-center text-emerald-700 text-sm font-black uppercase tracking-widest mb-4">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Strengths
                            </h4>
                            <ul className="space-y-3">
                                <li className="text-xs font-bold text-slate-600 flex items-start">
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-500 shrink-0 mt-0.5" />
                                    Smooth check-in process via QR codes
                                </li>
                                <li className="text-xs font-bold text-slate-600 flex items-start">
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-500 shrink-0 mt-0.5" />
                                    Quality of guest speakers (95% positive)
                                </li>
                            </ul>
                        </Card>
                        <Card className="p-6 border-rose-100 bg-rose-50/20">
                            <h4 className="flex items-center text-rose-700 text-sm font-black uppercase tracking-widest mb-4">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Improvements
                            </h4>
                            <ul className="space-y-3">
                                <li className="text-xs font-bold text-slate-600 flex items-start">
                                    <AlertCircle className="h-3.5 w-3.5 mr-2 text-rose-500 shrink-0 mt-0.5" />
                                    Catering service line for lunch was slow
                                </li>
                                <li className="text-xs font-bold text-slate-600 flex items-start">
                                    <AlertCircle className="h-3.5 w-3.5 mr-2 text-rose-500 shrink-0 mt-0.5" />
                                    Air conditioning in Hall A was intermittent
                                </li>
                            </ul>
                        </Card>
                    </div>

                    <Card className="p-8 relative overflow-hidden">
                        <div className="absolute top-6 right-6 text-indigo-50">
                            <Quote size={80} />
                        </div>
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Featured Feedback</h4>
                        <p className="text-xl font-serif italic text-slate-700 leading-relaxed relative z-10">
                            "The technical depth of the symposium was outstanding. Best event I've attended this year! The QR check-in made the morning rush much more manageable."
                        </p>
                        <div className="mt-8 flex items-center">
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                                SJ
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-black text-slate-900">Sarah Jenkins</p>
                                <p className="text-xs font-medium text-slate-400 font-mono">3rd Year, CSE</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Response Distribution */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center">
                        <Users className="h-5 w-5 mr-3 text-indigo-600" />
                        Response Distribution
                    </h3>
                    <Card className="p-8">
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm font-black text-slate-900">Student Participation</p>
                                    <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded">82% of registered</span>
                                </div>
                                <div className="flex h-12 bg-slate-50 rounded-2xl overflow-hidden p-1.5 ring-1 ring-slate-100">
                                    <div className="bg-emerald-500 rounded-xl w-[70%] mr-1 shadow-inner flex items-center justify-center">
                                        <span className="text-[10px] font-black text-white">Attended (184)</span>
                                    </div>
                                    <div className="bg-slate-200 rounded-xl w-[30%] flex items-center justify-center">
                                        <span className="text-[10px] font-black text-slate-400">Absent (41)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-4">
                                <div className="text-center font-bold">
                                    <p className="text-2xl text-slate-900">124</p>
                                    <p className="text-[10px] text-slate-400 uppercase mt-1">Feedback Given</p>
                                </div>
                                <div className="text-center font-bold border-x border-slate-100">
                                    <p className="text-2xl text-slate-900">15</p>
                                    <p className="text-[10px] text-slate-400 uppercase mt-1">Suggestions</p>
                                </div>
                                <div className="text-center font-bold">
                                    <p className="text-2xl text-slate-900">42</p>
                                    <p className="text-[10px] text-slate-400 uppercase mt-1">Volunteers Evaluated</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <Button className="w-full bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 font-bold transition-all shadow-none">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Generate Final Performance Report (PDF)
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-50 border-none">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Live Insights</h4>
                        <div className="space-y-4">
                            {[
                                "85% of participants would recommend this to a friend.",
                                "Morning sessions had 40% higher engagement than afternoon.",
                                "Most discussed topic: Artificial Intelligence & Ethics."
                            ].map((text, idx) => (
                                <div key={idx} className="flex items-center space-x-3 text-xs font-bold text-slate-600">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
                                    <p>{text}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
