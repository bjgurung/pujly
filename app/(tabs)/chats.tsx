import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquare } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Avatar from '@/components/Avatar';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Pandit Ramesh Sharma',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
    lastMessage: 'The ceremony will begin at 10 AM sharp.',
    time: '2m ago',
    unread: 2,
  },
  {
    id: '2',
    name: 'Pandit Suresh Joshi',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop',
    lastMessage: 'Please arrange the following items...',
    time: '1h ago',
    unread: 0,
  },
  {
    id: '3',
    name: 'Pandit Vijay Mishra',
    avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=1964&auto=format&fit=crop',
    lastMessage: 'Thank you for choosing our services.',
    time: 'Yesterday',
    unread: 0,
  },
];

export default function ChatsScreen() {
  const router = useRouter();

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chat/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <Avatar uri={item.avatar} name={item.name} size={52} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={[styles.chatMessage, item.unread > 0 && styles.chatMessageUnread]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
      </SafeAreaView>

      {mockChats.length > 0 ? (
        <FlatList
          data={mockChats}
          keyExtractor={(item) => item.id}
          renderItem={renderChat}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.empty}>
          <MessageSquare size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptyText}>Start a conversation with a pandit</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeTop: {
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  listContent: {
    paddingTop: 4,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    gap: 14,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
    marginRight: 8,
  },
  chatMessageUnread: {
    fontWeight: '600',
    color: colors.text,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
