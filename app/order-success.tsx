import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
            <CircleCheck size={72} color={colors.success} />
          </Animated.View>

          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Order Placed!</Text>
            <Text style={styles.subtitle}>
              Your order has been placed successfully. You will receive a confirmation shortly.
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Button title="View Orders" onPress={() => router.replace('/orders' as any)} size="large" />
          <Button
            title="Continue Shopping"
            onPress={() => router.replace('/(tabs)/store' as any)}
            variant="outline"
            size="large"
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 10,
  },
});
