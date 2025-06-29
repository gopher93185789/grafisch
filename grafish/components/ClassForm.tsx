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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../constants/ThemeColors';
import { ClassSchedule, DAYS_OF_WEEK, TIME_SLOTS, SUBJECT_COLORS } from '../types/schedule';

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
      // Set default values based on user role
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
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '90%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      fontSize: 18,
      color: colors.primary,
      fontWeight: '600',
    },
    form: {
      gap: 16,
    },
    inputGroup: {
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.surface,
    },
    picker: {
      color: colors.text,
    },
    timeContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    timeInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    colorContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    colorButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: colors.border,
    },
    colorButtonSelected: {
      borderColor: colors.text,
    },
    textArea: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
      height: 80,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    button: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    submitButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: colors.text,
    },
    submitButtonText: {
      color: '#FFFFFF',
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
                placeholderTextColor={colors.textSecondary}
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teacher *</Text>
              <TextInput
                style={styles.input}
                placeholder="Teacher's name"
                placeholderTextColor={colors.textSecondary}
                value={teacher}
                onChangeText={setTeacher}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Student *</Text>
              <TextInput
                style={styles.input}
                placeholder="Student's name"
                placeholderTextColor={colors.textSecondary}
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
                <View style={styles.pickerContainer}>
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
                <Text style={[styles.label, { alignSelf: 'center' }]}>to</Text>
                <View style={styles.pickerContainer}>
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
                placeholderTextColor={colors.textSecondary}
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
                placeholderTextColor={colors.textSecondary}
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
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {isEditing ? 'Update' : 'Add Class'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
} 