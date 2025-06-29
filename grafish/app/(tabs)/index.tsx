import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../constants/ThemeColors';
import { DAYS_OF_WEEK, ClassSchedule } from '../../types/schedule';
import ClassCard from '../../components/ClassCard';
import ClassForm from '../../components/ClassForm';

export default function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSchedule | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useUser();
  const { classes, addClass, updateClass, deleteClass, getClassesByDay, isLoading } = useSchedule();
  const { isDark, toggleTheme } = useTheme();

  const colors = isDark ? darkTheme : lightTheme;

  const filteredClasses = useMemo(() => {
    let filtered = getClassesByDay(selectedDay);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        cls =>
          cls.subject.toLowerCase().includes(query) ||
          cls.teacher.toLowerCase().includes(query) ||
          cls.student.toLowerCase().includes(query) ||
          (cls.room && cls.room.toLowerCase().includes(query))
      );
    }
    
    return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [classes, selectedDay, searchQuery]);

  const handleAddClass = () => {
    setEditingClass(undefined);
    setShowForm(true);
  };

  const handleEditClass = (classData: ClassSchedule) => {
    setEditingClass(classData);
    setShowForm(true);
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await deleteClass(classId);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete class');
    }
  };

  const handleSubmitClass = async (classData: Omit<ClassSchedule, 'id'>) => {
    try {
      if (editingClass) {
        await updateClass({ ...classData, id: editingClass.id });
      } else {
        await addClass(classData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save class');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // The schedule context will automatically reload data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 10,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    userInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    userText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    themeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
    },
    themeButtonText: {
      color: colors.primary,
      fontSize: 16,
    },
    searchContainer: {
      marginBottom: 16,
    },
    searchInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dayTabs: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    dayTab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      alignItems: 'center',
      borderBottomWidth: 2,
    },
    dayTabActive: {
      borderBottomColor: colors.primary,
    },
    dayTabInactive: {
      borderBottomColor: colors.border,
    },
    dayTabText: {
      fontSize: 14,
      fontWeight: '600',
    },
    dayTabTextActive: {
      color: colors.primary,
    },
    dayTabTextInactive: {
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyStateText: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    addButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
    },
    classCount: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
  });

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Please complete the setup to continue
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userText}>
            Welcome, {user.name} ({user.role})
          </Text>
          <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
            <Text style={styles.themeButtonText}>
              {isDark ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search classes..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.dayTabs}>
          {DAYS_OF_WEEK.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayTab,
                selectedDay === day ? styles.dayTabActive : styles.dayTabInactive,
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text
                style={[
                  styles.dayTabText,
                  selectedDay === day
                    ? styles.dayTabTextActive
                    : styles.dayTabTextInactive,
                ]}
              >
                {day.charAt(0).toUpperCase() + day.slice(1, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.classCount}>
          {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''} on{' '}
          {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
        </Text>

        {filteredClasses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery.trim()
                ? 'No classes found matching your search'
                : `No classes scheduled for ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}`}
            </Text>
            {!searchQuery.trim() && (
              <TouchableOpacity style={styles.addButton} onPress={handleAddClass}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredClasses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ClassCard
                classData={item}
                onEdit={handleEditClass}
                onDelete={handleDeleteClass}
                userRole={user.role}
              />
            )}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        )}
      </View>

      {filteredClasses.length > 0 && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddClass}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}

      <ClassForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitClass}
        initialData={editingClass}
        userRole={user.role}
        userName={user.name}
      />
    </View>
  );
}
