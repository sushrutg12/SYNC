import { Tabs } from 'expo-router';
import { Users, Search, Link, User } from 'lucide-react-native';
import { getFontStyle } from '@/utils/fonts';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 16,
          height: 92,
          shadowColor: '#FF595A',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 20,
        },
        tabBarActiveTintColor: '#FF595A',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontSize: 12,
          ...getFontStyle('subtitle'),
          marginTop: 6,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'InSync',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="connections"
        options={{
          title: 'Connects',
          tabBarIcon: ({ size, color }) => (
            <Link size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hub',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}