import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

const sections = [
  { title: 'Acceptance of Terms', body: 'By accessing and using PujariSewa, you agree to be bound by these Terms of Service. If you disagree with any part, you should not use the service.' },
  { title: 'User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information when creating an account.' },
  { title: 'Booking Services', body: 'When you book a service through PujariSewa, you agree to the terms of that booking, including the price, time, and cancellation policy.' },
  { title: 'Payments', body: 'All payments are processed securely through our payment partners. Prices are displayed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.' },
  { title: 'Cancellation & Refunds', body: 'Cancellations made 24 hours before the scheduled service are eligible for a full refund. Late cancellations may be subject to a cancellation fee.' },
  { title: 'Limitation of Liability', body: 'PujariSewa serves as a platform connecting users with pandits. We are not liable for the quality of services provided by individual pandits.' },
  { title: 'Contact', body: 'For questions about these Terms, contact us at support@pujarisewa.com.' },
];

export default function TermsOfServiceScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.lastUpdated}>Last updated: February 2026</Text>
      <Text style={styles.intro}>
        Please read these Terms of Service carefully before using PujariSewa.
      </Text>
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionBody}>{section.body}</Text>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  lastUpdated: { fontSize: 13, color: colors.textMuted, marginBottom: 16 },
  intro: { fontSize: 15, color: colors.textLight, lineHeight: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 16, marginBottom: 8 },
  sectionBody: { fontSize: 15, color: colors.textLight, lineHeight: 24 },
});
