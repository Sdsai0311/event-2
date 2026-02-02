import React from 'react';
import { Card } from '../components/ui/Card';
import { GoogleConnect } from '../components/google/GoogleConnect';
import { Shield, Globe, Bell, Mail } from 'lucide-react';

export const EventSettings: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Event Settings</h2>
                <p className="text-gray-500">Manage your event preferences and integrations.</p>
            </div>

            <Card className="divide-y divide-gray-100">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Google Integrations</h3>
                                <p className="text-xs text-gray-500">Sync with Google Calendar and G-Suite ecosystem.</p>
                            </div>
                        </div>
                        <GoogleConnect />
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Email Notifications</h3>
                                <p className="text-xs text-gray-500">Get updates about guest registrations and task deadlines.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Push Notifications</h3>
                                <p className="text-xs text-gray-500">Receive real-time alerts on your browser.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Privacy & Permissions</h3>
                            <p className="text-xs text-gray-500">Control who can view and edit this event.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="text-xs font-bold text-gray-700">Public Access</p>
                            <p className="text-[10px] text-gray-500">Anyone with the link can view</p>
                        </div>
                        <div className="p-3 border rounded-lg border-indigo-200 bg-indigo-50">
                            <p className="text-xs font-bold text-indigo-700">Restricted Access</p>
                            <p className="text-[10px] text-indigo-500">Only team members can view</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
