import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

const sections = [
  { title: 'Information We Collect', body: 'We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support. This includes your name, email address, phone number, and payment information.' },
  { title: 'How We Use Your Information', body: 'We use the information we collect to provide, maintain, and improve our services, process transactions, communicate with you, and personalize your experience.' },
  { title: 'Information Sharing', body: 'We share your information with pandits you book, payment processors, and service providers who assist us in operating the platform. We do not sell your personal information.' },
  { title: 'Data Security', body: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
  { title: 'Your Rights', body: 'You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time.' },
  { title: 'Contact Us', body: 'If you have any questions about this Privacy Policy, please contact us at privacy@pujarisewa.com.' },
];

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.lastUpdated}>Last updated: February 2026</Text>
      <Text style={styles.intro}>
        PujariSewa is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
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
