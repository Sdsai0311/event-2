import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Award, Download, Mail, Users, Search, Layout, Printer } from 'lucide-react';
import type { AppEvent, Guest } from '../types/event';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const EventCertificates: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const [searchTerm, setSearchTerm] = useState('');
    const [certType, setCertType] = useState<'participant' | 'volunteer' | 'winner'>('participant');
    const [generating, setGenerating] = useState<string | null>(null);

    const attendedGuests = (event.guests || []).filter(g => g.status === 'attended');
    const filteredGuests = attendedGuests.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.registrationId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generatePDF = async (guest: Guest) => {
        setGenerating(guest.id);
        const element = document.getElementById(`certificate-${guest.id}`);
        if (!element) {
            setGenerating(null);
            return;
        }

        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${guest.name.replace(/\s+/g, '_')}_Certificate.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setGenerating(null);
        }
    };

    return (
        <div className="space-y-8 animate-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Certificate <span className="text-indigo-600">Automation</span></h2>
                    <p className="text-slate-500 font-medium mt-1">Generate and distribute official documents instantly.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button
                        onClick={() => setCertType('participant')}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${certType === 'participant' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Participant
                    </button>
                    <button
                        onClick={() => setCertType('volunteer')}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${certType === 'volunteer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Volunteer
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration & List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h3 className="text-lg font-bold">Eligible Attendees</h3>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {filteredGuests.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-medium">No attended guests found.</p>
                                </div>
                            ) : (
                                filteredGuests.map(guest => (
                                    <div key={guest.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-lg hover:shadow-slate-100 transition-all group">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black">
                                                {guest.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-bold text-slate-900">{guest.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{guest.registrationId} • {guest.department}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-[10px] font-black"
                                                onClick={() => generatePDF(guest)}
                                                isLoading={generating === guest.id}
                                            >
                                                <Download className="h-3.5 w-3.5 mr-1.5" />
                                                Download
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="premium-gradient text-[10px] font-black"
                                            >
                                                <Mail className="h-3.5 w-3.5 mr-1.5" />
                                                Email
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Preview & Global Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 bg-slate-900 text-white border-0 shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 text-white/5 transform -rotate-12">
                            <Award size={200} />
                        </div>
                        <h3 className="text-xl font-black mb-2 flex items-center">
                            <Layout className="h-5 w-5 mr-2" />
                            Certificate Preview
                        </h3>
                        <p className="text-slate-400 text-sm font-medium mb-6">Live view of the template being used for distribution.</p>

                        <div className="bg-white rounded-xl overflow-hidden shadow-2xl mb-6">
                            {/* Hidden actual certificate target for capture */}
                            {filteredGuests.length > 0 && (
                                <div className="absolute opacity-0 pointer-events-none scale-50 origin-top-left" style={{ width: '800px', height: '560px' }}>
                                    {filteredGuests.slice(0, 1).map(guest => (
                                        <div
                                            key={guest.id}
                                            id={`certificate-${guest.id}`}
                                            className="w-[800px] h-[560px] bg-white border-[20px] border-indigo-600 p-20 flex flex-col items-center text-center font-serif"
                                        >
                                            <div className="flex items-center space-x-4 mb-10">
                                                <Award size={60} className="text-indigo-600" />
                                                <div className="text-left font-sans">
                                                    <p className="text-2xl font-black text-slate-900 leading-none">CITY COLLEGE</p>
                                                    <p className="text-xs font-black tracking-[0.3em] text-indigo-600">OF ENGINEERING</p>
                                                </div>
                                            </div>

                                            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">CERTIFICATE</h1>
                                            <p className="text-xl text-slate-500 uppercase tracking-widest mb-10">OF {certType.toUpperCase()}</p>

                                            <p className="text-lg text-slate-400 italic mb-2">This is to certify that</p>
                                            <h2 className="text-4xl font-black text-indigo-600 mb-8 border-b-2 border-indigo-100 pb-2 min-w-[300px] italic">
                                                {guest.name}
                                            </h2>

                                            <p className="text-lg text-slate-500 max-w-lg mb-12 font-sans px-10">
                                                has successfully {certType === 'participant' ? 'participated in' : 'volunteered for'} <span className="font-bold text-slate-900">{event.title}</span>,
                                                conducted by the Department of {event.department} on {new Date(event.date).toLocaleDateString()}.
                                            </p>

                                            <div className="grid grid-cols-2 gap-40 mt-auto w-full px-10">
                                                <div className="text-center pt-4 border-t border-slate-200">
                                                    <p className="text-lg font-bold text-slate-900 font-serif italic">{event.facultyCoordinator}</p>
                                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Faculty Coordinator</p>
                                                </div>
                                                <div className="text-center pt-4 border-t border-slate-200">
                                                    <p className="text-lg font-bold text-slate-900">Dr. Arthur Pendragon</p>
                                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Head of Institution</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Scaled down preview for the UI */}
                            <div className="aspect-[1.414/1] bg-white p-4 flex flex-col items-center text-center transform scale-[1] origin-top">
                                <Award size={20} className="text-indigo-600 mb-2" />
                                <p className="text-[6px] font-black text-slate-900 leading-none">CITY COLLEGE</p>
                                <h4 className="text-[12px] font-black text-slate-900 mt-2 mb-1">CERTIFICATE</h4>
                                <p className="text-[6px] text-slate-500 uppercase tracking-widest">OF {certType.toUpperCase()}</p>
                                <div className="h-px w-20 bg-indigo-100 my-2"></div>
                                <p className="text-[10px] font-bold text-indigo-600">Sample Name</p>
                                <p className="text-[5px] text-slate-400 mt-2">has participated in {event.title}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 shadow-xl">
                                <Printer className="h-4 w-4 mr-2" />
                                Bulk Print (PDF)
                            </Button>
                            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                                <Mail className="h-4 w-4 mr-2" />
                                Email All to Guests
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Automation Log</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                <p className="text-xs font-medium text-slate-600">Template verified with college logo & faculty signature.</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                                <p className="text-xs font-medium text-slate-600">Draft for volunteer certificates ready for review.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
