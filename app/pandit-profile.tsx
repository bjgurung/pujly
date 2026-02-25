import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function PanditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || 'Experienced pandit specializing in Vedic rituals and ceremonies.');
  const [location, setLocation] = useState(user?.location || 'United States');
  const [experience, setExperience] = useState('15');
  const [languages, setLanguages] = useState(user?.languages?.join(', ') || 'Hindi, Sanskrit, English');
  const [expertise, setExpertise] = useState(user?.expertise?.join(', ') || 'Wedding Ceremonies, Griha Pravesh, Satyanarayan Puja');

  const handleSave = async () => {
    await updateUser({
      name,
      bio,
      location,
      languages: languages.split(',').map(l => l.trim()),
      expertise: expertise.split(',').map(e => e.trim()),
    });
    Alert.alert('Success', 'Profile updated successfully');
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <Avatar uri={user?.avatar} name={user?.name} size={90} />
        <Text style={styles.editPhotoText}>Change Photo</Text>
      </View>

      <Input label="Full Name" value={name} onChangeText={setName} />
      <Input label="Location" value={location} onChangeText={setLocation} />
      <Input label="Years of Experience" value={experience} onChangeText={setExperience} keyboardType="number-pad" />
      <Input label="Languages (comma separated)" value={languages} onChangeText={setLanguages} />
      <Input label="Expertise (comma separated)" value={expertise} onChangeText={setExpertise} />

      <View style={styles.bioContainer}>
        <Text style={styles.label}>About Me</Text>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <Button title="Save Profile" onPress={handleSave} size="large" style={styles.saveBtn} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  editPhotoText: { fontSize: 14, color: colors.primary, fontWeight: '600', marginTop: 8 },
  bioContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 8 },
  bioInput: { backgroundColor: colors.backgroundLight, borderRadius: 12, padding: 14, fontSize: 16, color: colors.text, minHeight: 120 },
  saveBtn: { marginTop: 8 },
});
