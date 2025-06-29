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
import GradientView from './GradientView';

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
      borderRadius: 20,
      marginBottom: 12,
      shadowColor: colors.shadowStrong,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      overflow: 'hidden',
    },
    colorBar: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 6,
      backgroundColor: classData.color,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },
    content: {
      padding: 20,
      paddingLeft: 32,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    subject: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
      marginRight: 12,
      letterSpacing: -0.3,
    },
    time: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '600',
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      overflow: 'hidden',
    },
    details: {
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    detailLabel: {
      fontSize: 15,
      color: colors.textSecondary,
      width: 70,
      fontWeight: '500',
    },
    detailValue: {
      fontSize: 15,
      color: colors.text,
      flex: 1,
      fontWeight: '600',
    },
    notes: {
      fontSize: 14,
      color: colors.textTertiary,
      fontStyle: 'italic',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.borderSecondary,
      lineHeight: 18,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 16,
      gap: 8,
    },
    actionButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1.5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    editButton: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '15',
    },
    deleteButton: {
      borderColor: colors.error,
      backgroundColor: colors.error + '15',
    },
    actionButtonText: {
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: -0.2,
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
      <View style={styles.colorBar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subject} numberOfLines={2}>
            {classData.subject}
          </Text>
          <View style={styles.time}>
            <Text style={[styles.time, { color: colors.textSecondary }]}>
              {formatTime(classData.startTime)} - {formatTime(classData.endTime)}
            </Text>
          </View>
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
    </View>
  );
} 