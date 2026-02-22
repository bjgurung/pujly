import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    await updateUser({ name, email, phone, bio });
    Alert.alert('Success', 'Profile updated successfully');
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <Avatar uri={user?.avatar} name={user?.name} size={80} />
      </View>
      <Input label="Full Name" value={name} onChangeText={setName} />
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Bio" value={bio} onChangeText={setBio} multiline />
      <Button title="Save Changes" onPress={handleSave} size="large" style={styles.saveBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  saveBtn: { marginTop: 8 },
});
