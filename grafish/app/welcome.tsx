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
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../constants/ThemeColors';
import { UserRole } from '../types/schedule';
import GradientView from '../components/GradientView';

const { width, height } = Dimensions.get('window');

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
    },
    gradientBackground: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingTop: height * 0.1,
      paddingBottom: height * 0.05,
    },
    header: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 20,
      marginBottom: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.textInverse,
    },
    title: {
      fontSize: 36,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 24,
    },
    description: {
      fontSize: 16,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 22,
    },
    formContainer: {
      marginBottom: 40,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      letterSpacing: -0.3,
    },
    inputContainer: {
      position: 'relative',
      marginBottom: 24,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      fontSize: 18,
      color: colors.text,
      borderWidth: 2,
      borderColor: colors.borderSecondary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    inputFocused: {
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOpacity: 0.2,
    },
    roleContainer: {
      flexDirection: 'row',
      gap: 16,
    },
    roleCard: {
      flex: 1,
      borderRadius: 20,
      padding: 24,
      borderWidth: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    roleCardSelected: {
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOpacity: 0.2,
    },
    roleCardUnselected: {
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    roleIcon: {
      fontSize: 32,
      textAlign: 'center',
      marginBottom: 12,
    },
    roleTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    roleDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
    continueButton: {
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      marginTop: 20,
      shadowColor: colors.shadowStrong,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    continueButtonText: {
      color: colors.textInverse,
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: -0.3,
    },
    continueButtonDisabled: {
      opacity: 0.6,
    },
    footer: {
      alignItems: 'center',
      marginTop: 32,
    },
    footerText: {
      fontSize: 14,
      color: colors.textTertiary,
      textAlign: 'center',
    },
  });

  const isFormValid = name.trim() && selectedRole;

  return (
    <View style={styles.container}>
      <GradientView
        colors={colors.backgroundGradient}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <GradientView
                colors={colors.primaryGradient}
                style={styles.logo}
                borderRadius={20}
              >
                <Text style={styles.logoText}>🐓</Text>
              </GradientView>
              <Text style={styles.title}>Welcome to Rooster</Text>
              <Text style={styles.subtitle}>Your personal class schedule manager</Text>
              <Text style={styles.description}>
                Organize your classes with ease and never miss a lesson again
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What's your name?</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textTertiary}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>I am a...</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.roleCard,
                      selectedRole === 'student'
                        ? styles.roleCardSelected
                        : styles.roleCardUnselected,
                    ]}
                    onPress={() => setSelectedRole('student')}
                  >
                    <Text style={styles.roleIcon}>👨‍🎓</Text>
                    <Text style={styles.roleTitle}>Student</Text>
                    <Text style={styles.roleDescription}>
                      Track your classes and assignments
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleCard,
                      selectedRole === 'teacher'
                        ? styles.roleCardSelected
                        : styles.roleCardUnselected,
                    ]}
                    onPress={() => setSelectedRole('teacher')}
                  >
                    <Text style={styles.roleIcon}>👨‍🏫</Text>
                    <Text style={styles.roleTitle}>Teacher</Text>
                    <Text style={styles.roleDescription}>
                      Manage your teaching schedule
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <GradientView
              colors={isFormValid ? colors.primaryGradient : [colors.disabled, colors.disabled]}
              style={[
                styles.continueButton,
                !isFormValid && styles.continueButtonDisabled,
              ] as any}
              borderRadius={16}
            >
              <TouchableOpacity
                onPress={handleContinue}
                disabled={!isFormValid}
                style={{ width: '100%' }}
              >
                <Text style={styles.continueButtonText}>
                  {isFormValid ? 'Get Started' : 'Complete Setup'}
                </Text>
              </TouchableOpacity>
            </GradientView>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Your data is stored locally on your device
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientView>
    </View>
  );
} 