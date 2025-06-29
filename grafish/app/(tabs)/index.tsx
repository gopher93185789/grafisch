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
  Dimensions,
} from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../constants/ThemeColors';
import { DAYS_OF_WEEK, ClassSchedule } from '../../types/schedule';
import ClassCard from '../../components/ClassCard';
import ClassForm from '../../components/ClassForm';
import GradientView from '../../components/GradientView';

const { width } = Dimensions.get('window');

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
    setTimeout(() => setRefreshing(false), 1000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: colors.surface,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: colors.shadowStrong,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    userInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    userText: {
      fontSize: 18,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    themeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    themeButtonText: {
      fontSize: 20,
    },
    searchContainer: {
      marginBottom: 20,
    },
    searchInput: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.borderSecondary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    dayTabs: {
      flexDirection: 'row',
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    dayTab: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 8,
      alignItems: 'center',
      borderRadius: 16,
      marginHorizontal: 2,
    },
    dayTabActive: {
      backgroundColor: colors.primary + '15',
    },
    dayTabInactive: {
      backgroundColor: 'transparent',
    },
    dayTabText: {
      fontSize: 15,
      fontWeight: '600',
      letterSpacing: -0.2,
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
    emptyStateIcon: {
      fontSize: 64,
      marginBottom: 20,
      opacity: 0.5,
    },
    emptyStateText: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
      fontWeight: '600',
    },
    emptyStateSubtext: {
      fontSize: 16,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 22,
    },
    addButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadowStrong,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 12,
    },
    addButtonText: {
      color: colors.textInverse,
      fontSize: 28,
      fontWeight: 'bold',
    },
    classCount: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 20,
      fontWeight: '600',
    },
    classCountNumber: {
      color: colors.primary,
      fontWeight: '700',
    },
  });

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📚</Text>
          <Text style={styles.emptyStateText}>Please complete the setup to continue</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientView
        colors={colors.surfaceGradient}
        style={styles.header}
        borderRadius={24}
      >
        <View style={styles.userInfo}>
          <Text style={styles.userText}>
            Welcome back, {user.name} 👋
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
            placeholderTextColor={colors.textTertiary}
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
      </GradientView>

      <View style={styles.content}>
        <Text style={styles.classCount}>
          <Text style={styles.classCountNumber}>{filteredClasses.length}</Text> class{filteredClasses.length !== 1 ? 'es' : ''} on{' '}
          {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
        </Text>

        {filteredClasses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>
              {searchQuery.trim() ? '🔍' : '📅'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery.trim()
                ? 'No classes found'
                : `No classes scheduled for ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}`}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery.trim()
                ? 'Try adjusting your search terms'
                : 'Tap the + button to add your first class'}
            </Text>
            {!searchQuery.trim() && (
              <GradientView
                colors={colors.primaryGradient}
                style={styles.addButton}
                borderRadius={30}
              >
                <TouchableOpacity onPress={handleAddClass}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </GradientView>
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
        <GradientView
          colors={colors.primaryGradient}
          style={styles.addButton}
          borderRadius={30}
        >
          <TouchableOpacity onPress={handleAddClass}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </GradientView>
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
