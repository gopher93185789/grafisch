import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClassSchedule } from '../types/schedule';
import { storageUtils } from '../utils/storage';

interface ScheduleContextType {
  classes: ClassSchedule[];
  addClass: (classData: Omit<ClassSchedule, 'id'>) => Promise<void>;
  updateClass: (classData: ClassSchedule) => Promise<void>;
  deleteClass: (classId: string) => Promise<void>;
  getClassesByDay: (day: string) => ClassSchedule[];
  isLoading: boolean;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

interface ScheduleProviderProps {
  children: React.ReactNode;
}

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children }) => {
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const savedClasses = await storageUtils.getClasses();
      setClasses(savedClasses);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addClass = async (classData: Omit<ClassSchedule, 'id'>) => {
    try {
      const newClass: ClassSchedule = {
        ...classData,
        id: Date.now().toString(),
      };
      await storageUtils.addClass(newClass);
      setClasses(prev => [...prev, newClass]);
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const updateClass = async (classData: ClassSchedule) => {
    try {
      await storageUtils.updateClass(classData);
      setClasses(prev => prev.map(cls => 
        cls.id === classData.id ? classData : cls
      ));
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const deleteClass = async (classId: string) => {
    try {
      await storageUtils.deleteClass(classId);
      setClasses(prev => prev.filter(cls => cls.id !== classId));
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const getClassesByDay = (day: string): ClassSchedule[] => {
    return classes.filter(cls => cls.day === day);
  };

  const value: ScheduleContextType = {
    classes,
    addClass,
    updateClass,
    deleteClass,
    getClassesByDay,
    isLoading,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}; 