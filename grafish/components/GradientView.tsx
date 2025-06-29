import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientViewProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children?: React.ReactNode;
  borderRadius?: number;
}

export default function GradientView({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
  borderRadius = 0,
}: GradientViewProps) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[
        {
          borderRadius,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
} 