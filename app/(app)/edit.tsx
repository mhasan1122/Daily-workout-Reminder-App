import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Task, TaskCategory, useTasks } from '../contexts/TaskContext';
import { scheduleTaskReminder } from '../utils/notificationService';

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, deleteTask } = useTasks();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [isCompleted, setIsCompleted] = useState(false);
  
  // For date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // For validation
  const [titleError, setTitleError] = useState('');

  // Load task data
  useEffect(() => {
    if (id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(new Date(task.dueDate));
        setCategory(task.category);
        setIsCompleted(task.isCompleted);
      } else {
        // Task not found, go back
        Alert.alert('Error', 'Task not found');
        router.back();
      }
    }
  }, [id, tasks]);

  const categories: { value: TaskCategory; label: string; icon: string }[] = [
    { value: 'work', label: 'Work', icon: 'briefcase' },
    { value: 'personal', label: 'Personal', icon: 'person' },
    { value: 'shopping', label: 'Shopping', icon: 'cart' },
    { value: 'health', label: 'Health', icon: 'fitness' },
    { value: 'other', label: 'Other', icon: 'list' },
  ];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      const newDate = new Date(dueDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDueDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    
    if (selectedTime) {
      const newDate = new Date(dueDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDueDate(newDate);
    }
  };

  const validate = () => {
    if (!title.trim()) {
      setTitleError('Task title is required');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleSave = async () => {
    if (!validate() || !id) return;
    
    try {
      // Create the updated task
      const updatedTask: Task = {
        id,
        title,
        description,
        dueDate,
        category,
        isCompleted,
      };
      
      // Update task in context
      await updateTask(updatedTask);
      
      // Update notification for the task
      scheduleTaskReminder(updatedTask);
      
      // Navigate back to home
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
      console.error(error);
    }
  };

  const handleDelete = () => {
    if (!id) return;

    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteTask(id);
            router.back();
          }
        }
      ]
    );
  };

  const toggleCompletion = () => {
    setIsCompleted(!isCompleted);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold">Task Status</Text>
          <TouchableOpacity
            onPress={toggleCompletion}
            className={`px-3 py-1 rounded-full flex-row items-center ${
              isCompleted ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <Ionicons 
              name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'} 
              size={18} 
              color={isCompleted ? '#10b981' : '#6b7280'} 
              style={{ marginRight: 4 }}
            />
            <Text className={isCompleted ? 'text-green-700' : 'text-gray-700'}>
              {isCompleted ? 'Completed' : 'Not Completed'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-sm mb-1">Title *</Text>
          <TextInput
            className={`bg-white border ${titleError ? 'border-red-300' : 'border-gray-300'} rounded-md px-4 py-3`}
            placeholder="Task title"
            value={title}
            onChangeText={setTitle}
          />
          {titleError ? <Text className="text-red-500 text-xs mt-1">{titleError}</Text> : null}
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-sm mb-1">Description</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-md px-4 py-3"
            placeholder="Task description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-sm mb-1">Date & Time</Text>
          
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-1 bg-white border border-gray-300 rounded-md px-4 py-3 flex-row items-center mr-2"
            >
              <Ionicons name="calendar" size={18} color="#4b5563" style={{ marginRight: 8 }} />
              <Text>{formatDate(dueDate)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="flex-1 bg-white border border-gray-300 rounded-md px-4 py-3 flex-row items-center"
            >
              <Ionicons name="time" size={18} color="#4b5563" style={{ marginRight: 8 }} />
              <Text>{formatTime(dueDate)}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={dueDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-sm mb-3">Category</Text>
          <View className="flex-row flex-wrap">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setCategory(cat.value)}
                className={`flex-row items-center mr-3 mb-2 px-3 py-2 rounded-full ${
                  category === cat.value ? 'bg-amber-100 border border-amber-500' : 'bg-gray-100 border border-gray-300'
                }`}
              >
                <Ionicons 
                  name={cat.icon as any} 
                  size={16} 
                  color={category === cat.value ? '#d97706' : '#4b5563'} 
                  style={{ marginRight: 4 }} 
                />
                <Text
                  className={`text-sm ${
                    category === cat.value ? 'text-amber-800 font-medium' : 'text-gray-600'
                  }`}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-amber-500 rounded-md py-3 mb-3"
        >
          <Text className="text-white font-semibold text-center">Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="bg-red-500 rounded-md py-3"
        >
          <Text className="text-white font-semibold text-center">Delete Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 