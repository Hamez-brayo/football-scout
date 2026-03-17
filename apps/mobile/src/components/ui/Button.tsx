import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const COLORS = {
  primary: '#1e40af',
  primaryPressed: '#1d4ed8',
  secondary: '#64748b',
  secondaryPressed: '#475569',
  outline: 'transparent',
  outlinePressed: 'rgba(30, 64, 175, 0.08)',
  ghost: 'transparent',
  ghostPressed: 'rgba(0, 0, 0, 0.05)',
  white: '#ffffff',
};

const containerStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  outline: { backgroundColor: COLORS.outline, borderWidth: 1.5, borderColor: COLORS.primary },
  ghost: { backgroundColor: COLORS.ghost },
};

const pressedStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: COLORS.primaryPressed },
  secondary: { backgroundColor: COLORS.secondaryPressed },
  outline: { backgroundColor: COLORS.outlinePressed },
  ghost: { backgroundColor: COLORS.ghostPressed },
};

const textVariantStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: COLORS.white },
  secondary: { color: COLORS.white },
  outline: { color: COLORS.primary },
  ghost: { color: COLORS.primary },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.base,
        containerStyles[variant],
        pressed && pressedStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            textVariantStyles[variant],
            isDisabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});
