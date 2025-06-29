import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Share,
  Platform,
  Dimensions,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useUser } from '../../contexts/UserContext';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../constants/ThemeColors';
import { storageUtils } from '../../utils/storage';
import GradientView from '../../components/GradientView';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const { user, clearUser } = useUser();
  const { classes } = useSchedule();
  const { isDark, toggleTheme } = useTheme();

  const colors = isDark ? darkTheme : lightTheme;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await storageUtils.exportData();
      const jsonString = JSON.stringify(data, null, 2);
      
      if (Platform.OS === 'web') {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rooster-schedule.json';
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const fileName = `rooster-schedule-${new Date().toISOString().split('T')[0]}.json`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        
        await FileSystem.writeAsStringAsync(fileUri, jsonString);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'Export Schedule Data',
          });
        }
      }
      
      Alert.alert('Success', 'Schedule data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export schedule data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    Alert.alert(
      'Import Schedule',
      'This will replace all existing data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          style: 'destructive',
          onPress: async () => {
            setIsImporting(true);
            try {
              Alert.alert(
                'Import Feature',
                'File import requires additional setup. For now, you can manually copy the JSON data and paste it in the app settings.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('Import error:', error);
              Alert.alert('Error', 'Failed to import schedule data');
            } finally {
              setIsImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your schedule data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearUser();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      const message = `Check out my class schedule! I have ${classes.length} classes scheduled.`;
      await Share.share({
        message,
        title: 'My Class Schedule',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingTop: 60,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    headerIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 16,
      letterSpacing: -0.3,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 12,
      shadowColor: colors.shadowStrong,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: colors.borderSecondary,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
      letterSpacing: -0.3,
    },
    cardSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    button: {
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      marginTop: 8,
      shadowColor: colors.shadowStrong,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: -0.3,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.text,
    },
    dangerButton: {
      backgroundColor: colors.error,
    },
    dangerButtonText: {
      color: colors.textInverse,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoLabel: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    infoValue: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '700',
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    themeText: {
      fontSize: 18,
      color: colors.text,
      fontWeight: '600',
    },
    themeIcon: {
      fontSize: 24,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: -0.5,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
      fontWeight: '500',
    },
  });

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Please complete setup first</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>⚙️</Text>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Manage your app preferences and data
          </Text>
        </View>

        {/* User Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role:</Text>
              <Text style={styles.infoValue}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{classes.length}</Text>
                <Text style={styles.statLabel}>Classes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {new Set(classes.map(c => c.day)).size}
                </Text>
                <Text style={styles.statLabel}>Days</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {new Set(classes.map(c => c.subject)).size}
                </Text>
                <Text style={styles.statLabel}>Subjects</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <View style={styles.themeToggle}>
              <Text style={styles.themeText}>Dark Mode</Text>
              <TouchableOpacity onPress={toggleTheme}>
                <Text style={styles.themeIcon}>
                  {isDark ? '☀️' : '🌙'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Export Schedule</Text>
            <Text style={styles.cardSubtitle}>
              Save your schedule data as a JSON file for backup
            </Text>
            <GradientView
              colors={isExporting ? [colors.disabled, colors.disabled] : colors.primaryGradient}
              style={[styles.button, isExporting && styles.buttonDisabled] as any}
              borderRadius={16}
            >
              <TouchableOpacity
                onPress={handleExport}
                disabled={isExporting}
                style={{ width: '100%', alignItems: 'center' }}
              >
                <Text style={[styles.buttonText, { color: colors.textInverse }]}>
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </Text>
              </TouchableOpacity>
            </GradientView>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Import Schedule</Text>
            <Text style={styles.cardSubtitle}>
              Import schedule data from a JSON file
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, isImporting && styles.buttonDisabled]}
              onPress={handleImport}
              disabled={isImporting}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                {isImporting ? 'Importing...' : 'Import Data'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Share Schedule</Text>
            <Text style={styles.cardSubtitle}>
              Share your schedule with others via message or social media
            </Text>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleShare}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Clear All Data</Text>
            <Text style={styles.cardSubtitle}>
              Permanently delete all schedule data and reset the app. This action cannot be undone.
            </Text>
            <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleClearData}>
              <Text style={[styles.buttonText, styles.dangerButtonText]}>Clear All Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform:</Text>
              <Text style={styles.infoValue}>{Platform.OS}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Theme:</Text>
              <Text style={styles.infoValue}>
                {isDark ? 'Dark' : 'Light'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
