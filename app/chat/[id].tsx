import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Send } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'pandit';
  timestamp: string;
}

const initialMessages: Message[] = [
  { id: '1', text: 'Namaste! How can I help you?', sender: 'pandit', timestamp: '10:00 AM' },
  { id: '2', text: 'I would like to book a puja service.', sender: 'user', timestamp: '10:02 AM' },
  { id: '3', text: 'Sure! What type of puja are you looking for?', sender: 'pandit', timestamp: '10:03 AM' },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.sender === 'user' && styles.messageRowUser]}>
      <View style={[styles.bubble, item.sender === 'user' ? styles.bubbleUser : styles.bubblePandit]}>
        <Text style={[styles.messageText, item.sender === 'user' && styles.messageTextUser]}>{item.text}</Text>
        <Text style={[styles.timestamp, item.sender === 'user' && styles.timestampUser]}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen options={{ title: 'Chat' }} />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Send size={20} color={inputText.trim() ? colors.white : colors.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  messagesList: {
    padding: 16,
    gap: 8,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: 18,
  },
  bubblePandit: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  messageTextUser: {
    color: colors.white,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampUser: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.backgroundLight,
  },
});
