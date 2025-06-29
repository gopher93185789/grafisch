import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../constants/ThemeColors';
import { UserRole } from '../types/schedule';

export default function WelcomeScreen() {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { setUser } = useUser();
  const { isDark } = useTheme();
  const router = useRouter();

  const colors = isDark ? darkTheme : lightTheme;

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role');
      return;
    }

    try {
      await setUser({
        name: name.trim(),
        role: selectedRole,
      });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to save user information');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 40,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
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
    roleContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    roleButton: {
      flex: 1,
      padding: 20,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      backgroundColor: colors.surface,
    },
    roleButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '20',
    },
    roleButtonUnselected: {
      borderColor: colors.border,
    },
    roleText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    roleTextSelected: {
      color: colors.primary,
    },
    continueButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    continueButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
    continueButtonDisabled: {
      backgroundColor: colors.disabled,
    },
  });

  const isFormValid = name.trim() && selectedRole;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Welcome to Rooster</Text>
        <Text style={styles.subtitle}>Your personal class schedule manager</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's your name?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoFocus
            autoCapitalize="words"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I am a...</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'student'
                  ? styles.roleButtonSelected
                  : styles.roleButtonUnselected,
              ]}
              onPress={() => setSelectedRole('student')}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRole === 'student' && styles.roleTextSelected,
                ]}
              >
                👨‍🎓 Student
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'teacher'
                  ? styles.roleButtonSelected
                  : styles.roleButtonUnselected,
              ]}
              onPress={() => setSelectedRole('teacher')}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRole === 'teacher' && styles.roleTextSelected,
                ]}
              >
                👨‍🏫 Teacher
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !isFormValid && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isFormValid}
        >
          <Text style={styles.continueButtonText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 