import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons by category
const categoryIcons = {
  sightseeing: L.divIcon({
    className: 'custom-marker',
    html: '<div style="background-color: #3b82f6; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">👁️</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  food: L.divIcon({
    className: 'custom-marker',
    html: '<div style="background-color: #f97316; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🍽️</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  accommodation: L.divIcon({
    className: 'custom-marker',
    html: '<div style="background-color: #8b5cf6; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🏨</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  transport: L.divIcon({
    className: 'custom-marker',
    html: '<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🚗</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  other: L.divIcon({
    className: 'custom-marker',
    html: '<div style="background-color: #6b7280; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">📍</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
};

const MapView = ({ activities, defaultCenter }) => {
  // Filter activities that have location coordinates
  const activitiesWithLocation = activities.filter(
    (activity) =>
      activity.location?.coordinates?.latitude &&
      activity.location?.coordinates?.longitude
  );

  // Calculate center point if we have activities, otherwise use default
  const getMapCenter = () => {
    if (activitiesWithLocation.length === 0) {
      return defaultCenter || [20.5937, 78.9629]; // India center
    }
    
    if (activitiesWithLocation.length === 1) {
      const activity = activitiesWithLocation[0];
      return [
        activity.location.coordinates.latitude,
        activity.location.coordinates.longitude,
      ];
    }

    // Calculate center of all activities
    const avgLat =
      activitiesWithLocation.reduce(
        (sum, a) => sum + a.location.coordinates.latitude,
        0
      ) / activitiesWithLocation.length;
    const avgLng =
      activitiesWithLocation.reduce(
        (sum, a) => sum + a.location.coordinates.longitude,
        0
      ) / activitiesWithLocation.length;
    
    return [avgLat, avgLng];
  };

  const mapCenter = getMapCenter();

  if (activitiesWithLocation.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium mb-2">No Locations Added Yet</p>
        <p className="text-sm text-gray-500">
          Add activities with location coordinates to see them on the map
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h3 className="text-xl font-bold flex items-center">
          🗺️ Activity Locations
        </h3>
        <p className="text-sm text-indigo-100 mt-1">
          {activitiesWithLocation.length} location{activitiesWithLocation.length > 1 ? 's' : ''} marked
        </p>
      </div>
      
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {activitiesWithLocation.map((activity) => {
          const position = [
            activity.location.coordinates.latitude,
            activity.location.coordinates.longitude,
          ];
          const icon = categoryIcons[activity.category] || categoryIcons.other;

          return (
            <Marker key={activity._id} position={position} icon={icon}>
              <Popup>
                <div className="text-center">
                  <h4 className="font-bold text-gray-800 mb-1">{activity.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">
                    📅 {new Date(activity.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    🕐 {activity.startTime} - {activity.endTime}
                  </p>
                  {activity.location.address && (
                    <p className="text-xs text-gray-500 mt-1">
                      📍 {activity.location.address}
                    </p>
                  )}
                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      activity.category === 'sightseeing'
                        ? 'bg-blue-100 text-blue-800'
                        : activity.category === 'food'
                        ? 'bg-orange-100 text-orange-800'
                        : activity.category === 'accommodation'
                        ? 'bg-purple-100 text-purple-800'
                        : activity.category === 'transport'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {activity.category}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="p-4 bg-gray-50 border-t">
        <p className="text-xs text-gray-600 font-semibold mb-2">Legend:</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span>👁️</span> <span className="text-gray-700">Sightseeing</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🍽️</span> <span className="text-gray-700">Food</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏨</span> <span className="text-gray-700">Accommodation</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🚗</span> <span className="text-gray-700">Transport</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📍</span> <span className="text-gray-700">Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;