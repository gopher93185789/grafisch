import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../constants/ThemeColors';
import { ClassSchedule, DAYS_OF_WEEK, TIME_SLOTS, SUBJECT_COLORS } from '../types/schedule';
import GradientView from './GradientView';

const { height } = Dimensions.get('window');

interface ClassFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (classData: Omit<ClassSchedule, 'id'>) => void;
  initialData?: ClassSchedule;
  userRole: 'student' | 'teacher';
  userName: string;
}

export default function ClassForm({
  visible,
  onClose,
  onSubmit,
  initialData,
  userRole,
  userName,
}: ClassFormProps) {
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [student, setStudent] = useState('');
  const [day, setDay] = useState<ClassSchedule['day']>('monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState(SUBJECT_COLORS[0]);

  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject);
      setTeacher(initialData.teacher);
      setStudent(initialData.student);
      setDay(initialData.day);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setRoom(initialData.room || '');
      setNotes(initialData.notes || '');
      setColor(initialData.color);
    } else {
      if (userRole === 'teacher') {
        setTeacher(userName);
      } else {
        setStudent(userName);
      }
    }
  }, [initialData, userRole, userName]);

  const handleSubmit = () => {
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject name');
      return;
    }

    if (!teacher.trim()) {
      Alert.alert('Error', 'Please enter a teacher name');
      return;
    }

    if (!student.trim()) {
      Alert.alert('Error', 'Please enter a student name');
      return;
    }

    if (startTime >= endTime) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    onSubmit({
      subject: subject.trim(),
      teacher: teacher.trim(),
      student: student.trim(),
      day,
      startTime,
      endTime,
      room: room.trim() || undefined,
      notes: notes.trim() || undefined,
      color,
    });

    handleClose();
  };

  const handleClose = () => {
    setSubject('');
    setTeacher('');
    setStudent('');
    setDay('monday');
    setStartTime('09:00');
    setEndTime('10:00');
    setRoom('');
    setNotes('');
    setColor(SUBJECT_COLORS[0]);
    onClose();
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: height * 0.9,
      shadowColor: colors.shadowStrong,
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 24,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSecondary,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    closeButtonText: {
      fontSize: 20,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    form: {
      padding: 24,
      gap: 20,
    },
    inputGroup: {
      gap: 8,
    },
    label: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.3,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1.5,
      borderColor: colors.borderSecondary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    pickerContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.borderSecondary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      overflow: 'hidden',
    },
    picker: {
      color: colors.text,
      backgroundColor: 'transparent',
    },
    timeContainer: {
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
    },
    timeLabel: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    colorContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 8,
    },
    colorButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 3,
      borderColor: colors.borderSecondary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    colorButtonSelected: {
      borderColor: colors.text,
      shadowColor: colors.text,
      shadowOpacity: 0.3,
    },
    textArea: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1.5,
      borderColor: colors.borderSecondary,
      height: 100,
      textAlignVertical: 'top',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 16,
      padding: 24,
      paddingTop: 20,
    },
    button: {
      flex: 1,
      padding: 18,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: colors.shadowStrong,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    cancelButton: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    submitButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: -0.3,
    },
    cancelButtonText: {
      color: colors.text,
    },
    submitButtonText: {
      color: colors.textInverse,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.modal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Edit Class' : 'Add New Class'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Mathematics, Physics"
                placeholderTextColor={colors.textTertiary}
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teacher *</Text>
              <TextInput
                style={styles.input}
                placeholder="Teacher's name"
                placeholderTextColor={colors.textTertiary}
                value={teacher}
                onChangeText={setTeacher}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Student *</Text>
              <TextInput
                style={styles.input}
                placeholder="Student's name"
                placeholderTextColor={colors.textTertiary}
                value={student}
                onChangeText={setStudent}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Day</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={day}
                  onValueChange={(value) => setDay(value)}
                  style={styles.picker}
                >
                  {DAYS_OF_WEEK.map((dayOption) => (
                    <Picker.Item
                      key={dayOption}
                      label={dayOption.charAt(0).toUpperCase() + dayOption.slice(1)}
                      value={dayOption}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time</Text>
              <View style={styles.timeContainer}>
                <View style={[styles.pickerContainer, { flex: 1 }]}>
                  <Picker
                    selectedValue={startTime}
                    onValueChange={setStartTime}
                    style={styles.picker}
                  >
                    {TIME_SLOTS.map((time) => (
                      <Picker.Item key={time} label={time} value={time} />
                    ))}
                  </Picker>
                </View>
                <Text style={styles.timeLabel}>to</Text>
                <View style={[styles.pickerContainer, { flex: 1 }]}>
                  <Picker
                    selectedValue={endTime}
                    onValueChange={setEndTime}
                    style={styles.picker}
                  >
                    {TIME_SLOTS.map((time) => (
                      <Picker.Item key={time} label={time} value={time} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Room (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Room 101, Lab A"
                placeholderTextColor={colors.textTertiary}
                value={room}
                onChangeText={setRoom}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Color</Text>
              <View style={styles.colorContainer}>
                {SUBJECT_COLORS.map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption}
                    style={[
                      styles.colorButton,
                      { backgroundColor: colorOption },
                      color === colorOption && styles.colorButtonSelected,
                    ]}
                    onPress={() => setColor(colorOption)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Additional notes..."
                placeholderTextColor={colors.textTertiary}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <GradientView
              colors={colors.primaryGradient}
              style={[styles.button, styles.submitButton]}
              borderRadius={16}
            >
              <TouchableOpacity onPress={handleSubmit} style={{ width: '100%', alignItems: 'center' }}>
                <Text style={[styles.buttonText, styles.submitButtonText]}>
                  {isEditing ? 'Update' : 'Add Class'}
                </Text>
              </TouchableOpacity>
            </GradientView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
} 