import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const faqs = [
  { q: 'How do I book a pandit?', a: 'Browse services or pandits, select one, and click "Book Now". Fill in the details and confirm your booking.' },
  { q: 'Can I cancel a booking?', a: 'Yes, you can cancel a pending or confirmed booking from the Bookings tab. Cancellation policy applies.' },
  { q: 'How does payment work?', a: 'We support UPI, credit/debit cards, and cash on delivery. Payment is securely processed.' },
  { q: 'What if I\'m not satisfied?', a: 'Contact us within 24 hours of the service. We offer refunds based on our satisfaction policy.' },
  { q: 'How do I become a pandit on the platform?', a: 'Register as a Pandit, complete the onboarding process, and submit your documents for verification.' },
];

export default function HelpSupportScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Need Help?</Text>
        <Text style={styles.contactSubtitle}>Reach out to us through any channel</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactCard}>
            <Phone size={22} color={colors.primary} />
            <Text style={styles.contactLabel}>Call Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactCard}>
            <Mail size={22} color={colors.secondary} />
            <Text style={styles.contactLabel}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactCard}>
            <MessageCircle size={22} color={colors.info} />
            <Text style={styles.contactLabel}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
            activeOpacity={0.7}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              {expandedIndex === index ? (
                <ChevronUp size={20} color={colors.textMuted} />
              ) : (
                <ChevronDown size={20} color={colors.textMuted} />
              )}
            </View>
            {expandedIndex === index && <Text style={styles.faqAnswer}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16 },
  contactSection: { backgroundColor: colors.white, borderRadius: 16, padding: 20 },
  contactTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  contactSubtitle: { fontSize: 14, color: colors.textLight, marginTop: 4, marginBottom: 16 },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactCard: { flex: 1, alignItems: 'center', backgroundColor: colors.backgroundLight, borderRadius: 12, padding: 16, gap: 8 },
  contactLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
  faqSection: { backgroundColor: colors.white, borderRadius: 16, padding: 20 },
  faqTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 14 },
  faqItem: { borderBottomWidth: 0.5, borderBottomColor: colors.border, paddingVertical: 14 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1, marginRight: 8 },
  faqAnswer: { fontSize: 14, color: colors.textLight, lineHeight: 22, marginTop: 10 },
});
