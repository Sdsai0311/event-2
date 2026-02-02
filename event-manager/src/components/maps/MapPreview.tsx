import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface MapPreviewProps {
    lat: number;
    lng: number;
    zoom?: number;
    title?: string;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const MapPreview: React.FC<MapPreviewProps> = ({ lat, lng, zoom = 15, title }) => {
    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center p-6">
                    <p className="text-gray-500 font-medium">Google Maps API Key Missing</p>
                    <p className="text-xs text-gray-400 mt-1">Please add VITE_GOOGLE_MAPS_API_KEY to your .env file to enable live maps.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-64 rounded-xl overflow-hidden shadow-inner border border-gray-200">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <Map
                    defaultCenter={{ lat, lng }}
                    defaultZoom={zoom}
                    gestureHandling={'greedy'}
                    disableDefaultUI={false}
                >
                    <Marker position={{ lat, lng }} title={title} />
                </Map>
            </APIProvider>
        </div>
    );
};
