import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '../contexts/TaskContext';

// Initialize the notification system
export const initNotifications = async () => {
  try {
    // Configure how notifications are handled when the app is in the foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('task-reminders', {
        name: 'Task Reminders',
        description: 'Reminders for your tasks',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

// Schedule a notification for a task
export const scheduleTaskReminder = async (task: Task) => {
  try {
    const { id, title, dueDate } = task;
    
    // Cancel any existing notification for this task
    await cancelTaskReminder(id);
    
    // Schedule new notification 30 minutes before the task is due
    const reminderTime = new Date(dueDate.getTime());
    reminderTime.setMinutes(reminderTime.getMinutes() - 30);
    
    // Only schedule if reminder time is in the future
    if (reminderTime > new Date()) {
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: {
          title: 'Upcoming Task',
          body: `${title} is due soon`,
          sound: 'default',
        },
        trigger : {
          seconds: Math.max(1, Math.floor((reminderTime.getTime() - Date.now()) / 1000)),
        },
      });
    }
  } catch (error) {
    console.error('Error scheduling task reminder:', error);
    // Don't throw as this might be a limitation of Expo Go
  }
};

// Cancel a scheduled notification
export const cancelTaskReminder = async (taskId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(taskId);
  } catch (error) {
    console.error('Error canceling task reminder:', error);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

export default {
  initNotifications,
  scheduleTaskReminder,
  cancelTaskReminder,
  cancelAllNotifications,
}; 