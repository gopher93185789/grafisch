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
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useUser } from '../../contexts/UserContext';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../constants/ThemeColors';
import { storageUtils } from '../../utils/storage';

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
        // For web, create a download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rooster-schedule.json';
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // For mobile, save to file and share
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
              // For now, we'll show a placeholder since file picking requires additional setup
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
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    cardSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    buttonDisabled: {
      backgroundColor: colors.disabled,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.text,
    },
    dangerButton: {
      backgroundColor: colors.error,
    },
    dangerButtonText: {
      color: '#FFFFFF',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    infoValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    themeText: {
      fontSize: 16,
      color: colors.text,
    },
    themeIcon: {
      fontSize: 20,
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
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Classes:</Text>
              <Text style={styles.infoValue}>{classes.length}</Text>
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
              Save your schedule data as a JSON file
            </Text>
            <TouchableOpacity
              style={[styles.button, isExporting && styles.buttonDisabled]}
              onPress={handleExport}
              disabled={isExporting}
            >
              <Text style={styles.buttonText}>
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Text>
            </TouchableOpacity>
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
              Share your schedule with others
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
              Permanently delete all schedule data and reset the app
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
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
