import React from 'react';
import { Text, StyleSheet, type TextProps, type TextStyle } from 'react-native';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
}

export function Typography({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}: TypographyProps) {
  return (
    <Text
      style={[
        styles[variant],
        color ? ({ color } as TextStyle) : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94a3b8',
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 20,
  },
});
