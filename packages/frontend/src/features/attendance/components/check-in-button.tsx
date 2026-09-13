import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAttendance } from '../hooks/use-attendance';

interface CheckInButtonProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const { checkIn, isCheckingIn, useToday } = useAttendance();
  const { data: todayAttendance, refetch } = useToday();
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [notes, setNotes] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    if (todayAttendance?.checkIn) {
      setIsCheckedIn(true);
    }
  }, [todayAttendance]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          setLocation({
            latitude,
            longitude,
            address: data.display_name || 'Unknown location',
          });
        } catch (error) {
          setLocation({
            latitude,
            longitude,
            address: 'Location detected',
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGettingLocation(false);
        alert('Failed to get location. Please enable location services.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleCheckIn = async () => {
    try {
      await checkIn({
        location: location || undefined,
        notes: notes || undefined,
        deviceInfo: navigator.userAgent,
      });
      setIsCheckedIn(true);
      await refetch();
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    }
  };

  if (isCheckedIn) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-medium text-green-700 dark:text-green-400">Checked In</p>
            <p className="text-sm text-green-600 dark:text-green-300">
              Time: {todayAttendance?.checkIn?.time ? new Date(todayAttendance.checkIn.time).toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Check In
      </h3>

      <div className="space-y-4">
        {/* Location */}
        <div>
          <button
            onClick={getLocation}
            disabled={isGettingLocation}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
          >
            {isGettingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            {location ? 'Update Location' : 'Get Location'}
          </button>
          {location && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              📍 {location.address}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about your check-in..."
            rows={2}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Check In Button */}
        <button
          onClick={handleCheckIn}
          disabled={isCheckingIn}
          className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isCheckingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
          {isCheckingIn ? 'Checking In...' : 'Check In'}
        </button>

        {!location && (
          <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="w-4 h-4" />
            <span>Location is required for check-in</span>
          </div>
        )}
      </div>
    </div>
  );
};
