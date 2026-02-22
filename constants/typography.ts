import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});
