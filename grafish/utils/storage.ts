import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ClassSchedule, AppSettings, ScheduleData } from '../types/schedule';

const STORAGE_KEYS = {
  USER: 'rooster_user',
  CLASSES: 'rooster_classes',
  SETTINGS: 'rooster_settings',
};

export const storageUtils = {
  // User operations
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Classes operations
  async saveClasses(classes: ClassSchedule[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    } catch (error) {
      console.error('Error saving classes:', error);
    }
  },

  async getClasses(): Promise<ClassSchedule[]> {
    try {
      const classesData = await AsyncStorage.getItem(STORAGE_KEYS.CLASSES);
      return classesData ? JSON.parse(classesData) : [];
    } catch (error) {
      console.error('Error getting classes:', error);
      return [];
    }
  },

  async addClass(classData: ClassSchedule): Promise<void> {
    try {
      const existingClasses = await this.getClasses();
      const updatedClasses = [...existingClasses, classData];
      await this.saveClasses(updatedClasses);
    } catch (error) {
      console.error('Error adding class:', error);
    }
  },

  async updateClass(updatedClass: ClassSchedule): Promise<void> {
    try {
      const existingClasses = await this.getClasses();
      const updatedClasses = existingClasses.map(cls => 
        cls.id === updatedClass.id ? updatedClass : cls
      );
      await this.saveClasses(updatedClasses);
    } catch (error) {
      console.error('Error updating class:', error);
    }
  },

  async deleteClass(classId: string): Promise<void> {
    try {
      const existingClasses = await this.getClasses();
      const updatedClasses = existingClasses.filter(cls => cls.id !== classId);
      await this.saveClasses(updatedClasses);
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  },

  // Settings operations
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settingsData ? JSON.parse(settingsData) : { theme: 'light' };
    } catch (error) {
      console.error('Error getting settings:', error);
      return { theme: 'light' };
    }
  },

  // Export/Import operations
  async exportData(): Promise<ScheduleData> {
    try {
      const [user, classes, settings] = await Promise.all([
        this.getUser(),
        this.getClasses(),
        this.getSettings(),
      ]);
      return { user, classes, settings };
    } catch (error) {
      console.error('Error exporting data:', error);
      return { user: null, classes: [], settings: { theme: 'light' } };
    }
  },

  async importData(data: ScheduleData): Promise<void> {
    try {
      await Promise.all([
        data.user ? this.saveUser(data.user) : Promise.resolve(),
        this.saveClasses(data.classes),
        this.saveSettings(data.settings),
      ]);
    } catch (error) {
      console.error('Error importing data:', error);
    }
  },

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.CLASSES,
        STORAGE_KEYS.SETTINGS,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
}; 