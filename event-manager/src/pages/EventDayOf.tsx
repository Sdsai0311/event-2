import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle2, Circle, Clock, Trash2, Zap, QrCode, Users, Search, UserCheck } from 'lucide-react';
import type { AppEvent, ChecklistItem, Guest } from '../types/event';
import { useEventStore } from '../store/eventStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Html5QrcodeScanner } from 'html5-qrcode';

export const EventDayOf: React.FC = () => {
    const { event } = useOutletContext<{ event: AppEvent }>();
    const { addChecklistItem, updateChecklistItem, deleteChecklistItem, updateGuest } = useEventStore();
    const [newTask, setNewTask] = useState('');
    const [activeTab, setActiveTab] = useState<'checklist' | 'attendance'>('checklist');
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (activeTab === 'attendance') {
            const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
            scanner.render((decodedText) => {
                handleCheckIn(decodedText);
                setScanResult(decodedText);
                // scanner.clear(); // Optional: stop scanning after success
            }, () => {
                // Ignore errors during scanning
            });

            return () => {
                scanner.clear().catch(err => console.error("Failed to clear scanner", err));
            };
        }
    }, [activeTab]);

    const handleCheckIn = (regId: string) => {
        const guest = event.guests?.find(g => g.registrationId === regId);
        if (guest && guest.status !== 'attended') {
            updateGuest(event.id, guest.id, { status: 'attended' });
            alert(`Checked in: ${guest.name}`);
        }
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        addChecklistItem(event.id, {
            id: uuidv4(),
            task: newTask.trim(),
            isCompleted: false,
        });
        setNewTask('');
    };

    const toggleTask = (item: ChecklistItem) => {
        updateChecklistItem(event.id, item.id, { isCompleted: !item.isCompleted });
    };

    const completedCount = (event.dayOfChecklist || []).filter(i => i.isCompleted).length;
    const totalCount = (event.dayOfChecklist || []).length;
    const checklistProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const attendedCount = (event.guests || []).filter(g => g.status === 'attended').length;
    const registeredCount = (event.guests || []).length;
    const attendanceProgress = registeredCount > 0 ? (attendedCount / registeredCount) * 100 : 0;

    const filteredGuests = (event.guests || []).filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Zap className="h-6 w-6 mr-2 text-yellow-500 fill-yellow-500" />
                        Live Operations
                    </h2>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('checklist')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'checklist' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Checklist
                        </button>
                        <button
                            onClick={() => setActiveTab('attendance')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'attendance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Attendance
                        </button>
                    </div>
                </div>
                <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                    {new Date().toLocaleDateString() === new Date(event.date).toLocaleDateString()
                        ? '🚀 EVENT IS LIVE'
                        : `T-minus ${Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                    }
                </div>
            </div>

            {activeTab === 'checklist' ? (
                <div className="space-y-6 animate-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-lg font-bold">Preparation Progress</h3>
                                <span className="text-2xl font-black text-indigo-600">{Math.round(checklistProgress)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                                <div
                                    className="premium-gradient h-full transition-all duration-1000 ease-out"
                                    style={{ width: `${checklistProgress}%` }}
                                />
                            </div>
                            <p className="text-sm text-slate-500 mt-2 font-medium">{completedCount} of {totalCount} tasks completed</p>
                        </Card>

                        <Card className="p-6 flex flex-col justify-center">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Next Milestone</h3>
                            {(event.timelineItems || []).length > 0 ? (
                                <div>
                                    <p className="text-xl font-bold text-slate-900">
                                        {event.timelineItems.find(t => t.time > new Date().toLocaleTimeString([], { hour12: false }))?.title || 'No more scheduled activities'}
                                    </p>
                                    <div className="flex items-center text-indigo-600 mt-1 font-bold">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {event.timelineItems.find(t => t.time > new Date().toLocaleTimeString([], { hour12: false }))?.time || '-'}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400 font-medium italic">Timeline not configured</p>
                            )}
                        </Card>
                    </div>

                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-4">Real-Time Checklist</h3>
                            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="Add a quick task..."
                                    className="flex-1 rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-50 px-4"
                                />
                                <Button type="submit" className="premium-gradient">Add Task</Button>
                            </form>

                            <div className="space-y-3">
                                {(event.dayOfChecklist || []).length === 0 ? (
                                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                        <CheckCircle2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium">Add tasks to track your live event progress.</p>
                                    </div>
                                ) : (
                                    (event.dayOfChecklist || []).map((item) => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${item.isCompleted ? 'bg-slate-50 border-transparent' : 'bg-white border-slate-100 shadow-sm hover:border-indigo-200'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => toggleTask(item)}
                                                    className={`transition-all transform active:scale-90 ${item.isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}
                                                >
                                                    {item.isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                                                </button>
                                                <span className={`text-sm font-bold ${item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                    {item.task}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => deleteChecklistItem(event.id, item.id)}
                                                className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="space-y-6 animate-in">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1 p-6 flex flex-col items-center">
                            <h3 className="text-lg font-bold mb-4 flex items-center w-full">
                                <QrCode className="h-5 w-5 mr-2 text-indigo-600" />
                                QR Entry Scanner
                            </h3>
                            <div id="reader" className="w-full bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-2xl min-h-[300px]"></div>
                            {scanResult && (
                                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-bold w-full text-center">
                                    Last Check-in: {scanResult}
                                </div>
                            )}
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-4">
                                Camera access required for QR scanning
                            </p>
                        </Card>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Card className="p-6 bg-slate-900 text-white border-0 shadow-2xl">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Attendance</p>
                                            <h3 className="text-4xl font-black">{attendedCount} <span className="text-xl text-slate-500">/ {registeredCount}</span></h3>
                                        </div>
                                        <div className="bg-white/10 p-3 rounded-2xl">
                                            <Users size={24} />
                                        </div>
                                    </div>
                                    <div className="mt-6 w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full" style={{ width: `${attendanceProgress}%` }}></div>
                                    </div>
                                    <p className="mt-3 text-xs font-bold text-slate-400">{Math.round(attendanceProgress)}% participation rate</p>
                                </Card>

                                <Card className="p-6 border-0 shadow-lg bg-indigo-600 text-white">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-1">Status</p>
                                            <h3 className="text-2xl font-black">Scanning Active</h3>
                                            <p className="text-sm font-medium text-indigo-100 mt-1">Personnel at Gate A</p>
                                        </div>
                                        <div className="bg-white/20 p-3 rounded-2xl animate-pulse">
                                            <Zap size={24} />
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <Card className="flex-1">
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <h3 className="text-lg font-bold">Attendee List</h3>
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search guest..."
                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-hidden rounded-2xl border border-slate-100">
                                        <table className="min-w-full divide-y divide-slate-100">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest</th>
                                                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                                                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                    <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-50">
                                                {filteredGuests.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">No results found</td>
                                                    </tr>
                                                ) : (
                                                    filteredGuests.map((guest: Guest) => (
                                                        <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                                                                        {guest.name.charAt(0)}
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <div className="text-sm font-bold text-slate-900">{guest.name}</div>
                                                                        <div className="text-[10px] text-slate-400 font-medium">{guest.email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                                    {guest.registrationId}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${guest.status === 'attended' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                                                                    }`}>
                                                                    {guest.status === 'attended' ? 'Present' : 'Registered'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                {guest.status !== 'attended' ? (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-[10px] font-black border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100"
                                                                        onClick={() => updateGuest(event.id, guest.id, { status: 'attended' })}
                                                                    >
                                                                        <UserCheck size={12} className="mr-1" />
                                                                        Check-in
                                                                    </Button>
                                                                ) : (
                                                                    <span className="text-emerald-500 font-black text-[10px] uppercase">Verified</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

