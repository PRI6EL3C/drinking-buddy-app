import { useState, useEffect } from 'react';
import { Bell, BellOff, Smartphone, Monitor } from 'lucide-react';
import { 
  requestNotificationPermission, 
  initializeNotifications,
  sendNotification 
} from '../supabase/notificationService';

const NotificationSettings = ({ userId }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const hasPermission = Notification.permission === 'granted';
    setPermissionGranted(hasPermission);
    
    if (hasPermission) {
      setNotificationsEnabled(true);
    }
  };

  const toggleNotifications = async () => {
    setLoading(true);
    
    if (!notificationsEnabled) {
      // Enable notifications
      const result = await initializeNotifications(userId);
      
      if (result.success) {
        setNotificationsEnabled(true);
        setPermissionGranted(true);
        
        // Send test notification
        await sendNotification(
          userId,
          '🔔 Известията са активирани!',
          'Ще получаваш известия за нови matches и потребители.',
          { type: 'test' }
        );
      } else {
        alert('Грешка при активиране на известия: ' + result.error);
      }
    } else {
      // Disable notifications - we can't programmatically disable, but we can show message
      alert('За да изключиш известията, отиди в настройките на браузъра си.');
    }
    
    setLoading(false);
  };

  const sendTestNotification = async () => {
    if (notificationsEnabled && permissionGranted) {
      await sendNotification(
        userId,
        '🎉 Тестово известие!',
        'Това е тестово известие от DrinkBuddy!',
        { type: 'test' }
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell size={20} />
          Известия
        </h3>
        <button
          onClick={toggleNotifications}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notificationsEnabled ? 'bg-green-500' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          {notificationsEnabled ? (
            <BellOff size={16} className="text-green-500" />
          ) : (
            <Bell size={16} className="text-gray-400" />
          )}
          <span className={notificationsEnabled ? 'text-green-600' : 'text-gray-600'}>
            {notificationsEnabled 
              ? 'Известията са активирани' 
              : 'Известията са изключени'
            }
          </span>
        </div>

        {notificationsEnabled && (
          <button
            onClick={sendTestNotification}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Изпрати тестово известие
          </button>
        )}

        {!permissionGranted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Важно:</strong> За да получаваш известия, трябва да разрешиш в браузъра си.
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <Smartphone size={12} />
            <span>Работи на телефон и компютър</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor size={12} />
            <span>Известия за matches и нови потребители</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
