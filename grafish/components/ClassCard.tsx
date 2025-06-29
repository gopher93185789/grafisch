import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../constants/ThemeColors';
import { ClassSchedule } from '../types/schedule';

interface ClassCardProps {
  classData: ClassSchedule;
  onEdit: (classData: ClassSchedule) => void;
  onDelete: (classId: string) => void;
  userRole: 'student' | 'teacher';
}

export default function ClassCard({ classData, onEdit, onDelete, userRole }: ClassCardProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const handleDelete = () => {
    Alert.alert(
      'Delete Class',
      'Are you sure you want to delete this class?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(classData.id) },
      ]
    );
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: classData.color,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    subject: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    time: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    details: {
      marginBottom: 8,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      width: 60,
    },
    detailValue: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    notes: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
      gap: 8,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 1,
    },
    editButton: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '20',
    },
    deleteButton: {
      borderColor: colors.error,
      backgroundColor: colors.error + '20',
    },
    actionButtonText: {
      fontSize: 12,
      fontWeight: '600',
    },
    editButtonText: {
      color: colors.primary,
    },
    deleteButtonText: {
      color: colors.error,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subject} numberOfLines={2}>
          {classData.subject}
        </Text>
        <Text style={styles.time}>
          {formatTime(classData.startTime)} - {formatTime(classData.endTime)}
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Teacher:</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {classData.teacher}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Student:</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {classData.student}
          </Text>
        </View>
        {classData.room && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Room:</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {classData.room}
            </Text>
          </View>
        )}
      </View>

      {classData.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {classData.notes}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(classData)}
        >
          <Text style={[styles.actionButtonText, styles.editButtonText]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 