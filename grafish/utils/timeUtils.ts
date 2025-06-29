export const timeUtils = {
  // Convert time string (HH:MM) to minutes since midnight
  timeToMinutes: (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  },

  // Convert minutes since midnight to time string (HH:MM)
  minutesToTime: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  },

  // Check if two time ranges overlap
  timeRangesOverlap: (
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean => {
    const start1Min = timeUtils.timeToMinutes(start1);
    const end1Min = timeUtils.timeToMinutes(end1);
    const start2Min = timeUtils.timeToMinutes(start2);
    const end2Min = timeUtils.timeToMinutes(end2);

    return start1Min < end2Min && start2Min < end1Min;
  },

  // Format time for display (e.g., "09:00" -> "9:00 AM")
  formatTimeForDisplay: (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  },

  // Get duration between two times in minutes
  getDuration: (startTime: string, endTime: string): number => {
    const startMin = timeUtils.timeToMinutes(startTime);
    const endMin = timeUtils.timeToMinutes(endTime);
    return endMin - startMin;
  },

  // Format duration for display
  formatDuration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  },

  // Get current day of week (monday, tuesday, etc.)
  getCurrentDayOfWeek: (): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
  },

  // Check if a time is in the past today
  isTimeInPast: (time: string): boolean => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return time < currentTime;
  },
}; 