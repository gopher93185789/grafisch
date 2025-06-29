# 🐓 Rooster - Class Schedule Manager

A beautiful and intuitive class schedule management app built with React Native and Expo. Perfect for students and teachers to organize their weekly schedules.

## ✨ Features

### 🧑‍🏫 User Management
- **Role Selection**: Choose between Student or Teacher role
- **Personalized Experience**: App adapts based on your role
- **Name Storage**: Your name is saved and used throughout the app

### 📅 Weekly Schedule View
- **Monday to Friday**: View your schedule for each day of the week
- **Time Slots**: 08:00–18:00 time range with 30-minute intervals
- **Visual Blocks**: Classes displayed as colorful cards with all details
- **Day Tabs**: Easy navigation between different days

### ➕ Class Management
- **Add Classes**: Create new classes with comprehensive details
- **Edit Classes**: Modify existing class information
- **Delete Classes**: Remove classes with confirmation
- **Rich Details**: Subject, teacher, student, time, room, notes, and color coding

### 🔍 Search & Filter
- **Smart Search**: Search by subject, teacher, student, or room
- **Real-time Filtering**: Results update as you type
- **Day Filtering**: View classes for specific days

### 🌙 Theme Support
- **Light/Dark Mode**: Toggle between themes
- **Persistent Settings**: Your theme preference is saved
- **System Integration**: Respects system theme settings

### 💾 Data Management
- **Local Storage**: All data stored locally using AsyncStorage
- **Export/Import**: Backup and restore your schedule data
- **Data Persistence**: Your schedule survives app restarts

### 📱 Modern UI/UX
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Fluid transitions and interactions
- **Intuitive Navigation**: Easy-to-use tab-based interface
- **Accessibility**: Built with accessibility in mind

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grafish
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## 📱 App Structure

```
grafish/
├── app/                    # Main app screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Schedule screen
│   │   └── explore.tsx    # Settings screen
│   ├── welcome.tsx        # Welcome/onboarding screen
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable components
│   ├── ClassCard.tsx      # Individual class display
│   └── ClassForm.tsx      # Add/edit class form
├── contexts/              # React contexts
│   ├── ThemeContext.tsx   # Theme management
│   ├── UserContext.tsx    # User data management
│   └── ScheduleContext.tsx # Schedule data management
├── types/                 # TypeScript type definitions
│   └── schedule.ts        # Schedule-related types
├── utils/                 # Utility functions
│   ├── storage.ts         # AsyncStorage operations
│   └── timeUtils.ts       # Time calculation helpers
└── constants/             # App constants
    └── ThemeColors.ts     # Theme color definitions
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#007AFF / #0A84FF)
- **Secondary**: Purple (#5856D6 / #5E5CE6)
- **Success**: Green (#34C759 / #30D158)
- **Error**: Red (#FF3B30 / #FF453A)
- **Warning**: Orange (#FF9500 / #FF9F0A)

### Typography
- **Headings**: Bold, large text for titles
- **Body**: Regular text for content
- **Captions**: Smaller text for secondary information

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean input fields with proper validation
- **Navigation**: Tab-based with clear icons

## 🔧 Technical Details

### Tech Stack
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **AsyncStorage**: Local data persistence
- **React Navigation**: Screen navigation
- **Expo Router**: File-based routing

### Key Libraries
- `@react-native-async-storage/async-storage`: Local data storage
- `@react-native-picker/picker`: Form picker components
- `expo-file-system`: File system operations
- `expo-sharing`: Share functionality
- `react-native-reanimated`: Smooth animations

### Data Structure
```typescript
interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  student: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  startTime: string;
  endTime: string;
  room?: string;
  notes?: string;
  color: string;
}
```

## 📋 Usage Guide

### First Time Setup
1. Open the app
2. Enter your name
3. Select your role (Student or Teacher)
4. Tap "Get Started"

### Adding a Class
1. Tap the "+" button on the schedule screen
2. Fill in the class details:
   - Subject name
   - Teacher name
   - Student name
   - Day of the week
   - Start and end times
   - Room (optional)
   - Notes (optional)
   - Color (optional)
3. Tap "Add Class"

### Managing Classes
- **Edit**: Tap the "Edit" button on any class card
- **Delete**: Tap the "Delete" button and confirm
- **Search**: Use the search bar to find specific classes

### Customizing the App
- **Theme**: Toggle between light and dark mode in settings
- **Export**: Save your schedule as a JSON file
- **Import**: Restore schedule data from a backup file

## 🚧 Development

### Project Structure
The app follows a modular architecture with clear separation of concerns:

- **Screens**: Main app views in the `app/` directory
- **Components**: Reusable UI components
- **Contexts**: State management using React Context
- **Utils**: Helper functions and utilities
- **Types**: TypeScript type definitions

### Adding New Features
1. Create new components in `components/`
2. Add new screens in `app/`
3. Update types in `types/schedule.ts`
4. Add utility functions in `utils/`
5. Update the README with new features

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add comments for complex logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [Expo Symbols](https://icons.expo.fyi/)
- Design inspiration from modern mobile apps

---

**Made with ❤️ for students and teachers everywhere**
