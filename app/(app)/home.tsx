import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Task, useTasks } from '../contexts/TaskContext';

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const { logout } = useAuth();

  // Sort tasks by due date (earliest first)
  const sortedTasks = [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const handleCreateTask = () => {
    router.push('/(app)/create');
  };

  const handleEditTask = (task: Task) => {
    router.push({
      pathname: '/(app)/edit',
      params: { id: task.id }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTask(taskId)
        }
      ]
    );
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const getTaskStatusColor = (task: Task) => {
    if (task.isCompleted) return 'bg-green-100 border-green-500';
    
    const now = new Date();
    const taskDate = new Date(task.dueDate);
    
    // If overdue
    if (taskDate < now) return 'bg-red-100 border-red-500';
    
    // If due within 24 hours
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setHours(oneDayFromNow.getHours() + 24);
    
    if (taskDate < oneDayFromNow) return 'bg-amber-100 border-amber-500';
    
    // Default
    return 'bg-blue-50 border-blue-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return 'briefcase';
      case 'personal': return 'person';
      case 'shopping': return 'cart';
      case 'health': return 'fitness';
      default: return 'list';
    }
  };

  // Format date in a readable format
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: Task }) => {
    const statusColor = getTaskStatusColor(item);
    
    return (
      <TouchableOpacity 
        onPress={() => handleEditTask(item)}
        onLongPress={() => handleDeleteTask(item.id)}
        className={`mb-3 p-4 rounded-lg border-l-4 ${statusColor}`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons 
              name={getCategoryIcon(item.category)}
              size={18} 
              color="#4b5563"
              style={{ marginRight: 8 }}
            />
            <Text className={`text-lg font-medium ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {item.title}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => toggleTaskCompletion(item.id)}
            className={`p-2 rounded-full ${item.isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <Ionicons 
              name={item.isCompleted ? 'checkmark' : 'ellipse-outline'} 
              size={16} 
              color={item.isCompleted ? 'white' : '#4b5563'} 
            />
          </TouchableOpacity>
        </View>
        
        <Text className="text-gray-600 mt-1">{item.description}</Text>
        
        <View className="flex-row justify-between items-center mt-3">
          <Text className="text-xs text-gray-500">
            {formatDate(item.dueDate)}
          </Text>
          <Text className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full">
            {item.category}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="flex-row justify-end mb-4">
        <TouchableOpacity 
          onPress={handleLogout}
          className="px-3 py-2 bg-gray-200 rounded-md"
        >
          <Text className="text-gray-700">Logout</Text>
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="list" size={64} color="#d1d5db" />
          <Text className="text-xl text-gray-400 mt-4">No tasks yet</Text>
          <Text className="text-gray-400 mb-4">Tap the + button to create one</Text>
        </View>
      ) : (
        <FlatList
          data={sortedTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        onPress={handleCreateTask}
        className="absolute right-6 bottom-6 w-14 h-14 bg-amber-500 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
} 