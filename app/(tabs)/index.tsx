import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Heart, X, MapPin, Briefcase, Award, Star } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Profile {
  id: string;
  name: string;
  title: string;
  company: string;
  match: string;
  image: string;
  age?: number;
  location?: string;
  experience: string;
  skills: string[];
  achievements: number;
  rating: number;
}

const profiles: Profile[] = [
  {
    id: '1',
    name: 'Jessica Chen',
    title: 'Senior Product Designer',
    company: 'Meta',
    match: '94',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    age: 28,
    location: 'San Francisco, CA',
    experience: '6+ years',
    skills: ['UI/UX', 'Figma', 'Design Systems'],
    achievements: 12,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Alexander Rodriguez',
    title: 'Engineering Manager',
    company: 'Stripe',
    match: '89',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    age: 31,
    location: 'New York, NY',
    experience: '8+ years',
    skills: ['Leadership', 'React', 'Node.js'],
    achievements: 18,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Priya Sharma',
    title: 'VP of Product',
    company: 'Airbnb',
    match: '91',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    age: 29,
    location: 'Seattle, WA',
    experience: '7+ years',
    skills: ['Strategy', 'Analytics', 'Growth'],
    achievements: 15,
    rating: 4.7,
  },
];

function ProfileCard({ profile, index }: { profile: Profile; index: number }) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    translateY.value = withDelay(
      index * 150,
      withSpring(0, {
        damping: 18,
        stiffness: 120,
      })
    );
    opacity.value = withDelay(index * 150, withTiming(1, { duration: 800 }));
    scale.value = withDelay(
      index * 150,
      withSpring(1, {
        damping: 15,
        stiffness: 140,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const handleMessage = () => {
    console.log(`Message ${profile.name}`);
  };

  const handleLike = () => {
    console.log(`Connect with ${profile.name}`);
  };

  const handlePass = () => {
    console.log(`Pass ${profile.name}`);
  };

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <View style={styles.card}>
        <LinearGradient
          colors={['#F4E0CC', '#ffffff', '#F4E0CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}>
          
          {/* Header Section */}
          <View style={styles.cardHeader}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: profile.image }} style={styles.profileImage} />
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{profile.match}%</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Star size={12} color="#000000" fill="#000000" />
                <Text style={styles.ratingText}>{profile.rating}</Text>
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileTitle}>{profile.title}</Text>
              <View style={styles.companyContainer}>
                <Briefcase size={16} color="#FF595A" strokeWidth={2.5} />
                <Text style={styles.companyText}>{profile.company}</Text>
              </View>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <MapPin size={18} color="#666666" strokeWidth={2} />
              <Text style={styles.detailText}>{profile.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Award size={18} color="#666666" strokeWidth={2} />
              <Text style={styles.detailText}>{profile.experience} • {profile.achievements} achievements</Text>
            </View>
          </View>

          {/* Skills Section */}
          <View style={styles.skillsSection}>
            <Text style={styles.skillsTitle}>Core Expertise</Text>
            <View style={styles.skillsContainer}>
              {profile.skills.map((skill, skillIndex) => (
                <View key={skillIndex} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.passButton]} 
              onPress={handlePass}
              activeOpacity={0.8}>
              <X size={24} color="#FF595A" strokeWidth={3} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.messageButton]} 
              onPress={handleMessage}
              activeOpacity={0.8}>
              <MessageCircle size={24} color="#F4E0CC" strokeWidth={3} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.likeButton]} 
              onPress={handleLike}
              activeOpacity={0.8}>
              <Heart size={24} color="#FF595A" fill="#FF595A" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

export default function InSyncScreen() {
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-40);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 1200 });
    headerTranslateY.value = withSpring(0, {
      damping: 20,
      stiffness: 120,
    });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.background}
      />
      
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.logo}>INSYNC</Text>
        <Text style={styles.subtitle}>Professional networking reimagined</Text>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {profiles.map((profile, index) => (
          <ProfileCard key={profile.id} profile={profile} index={index} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingHorizontal: 28,
    paddingBottom: 32,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FF595A',
    letterSpacing: 4,
    marginBottom: 12,
    textShadowColor: 'rgba(255, 89, 90, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    letterSpacing: 1,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  cardContainer: {
    marginBottom: 28,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FF595A',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 15,
  },
  cardGradient: {
    padding: 28,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 20,
  },
  profileImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: '#FF595A',
  },
  matchBadge: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#FF595A',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  matchText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#F4E0CC',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  profileTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    lineHeight: 24,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  companyText: {
    fontSize: 16,
    color: '#FF595A',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.5,
  },
  detailsSection: {
    marginBottom: 24,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  skillsSection: {
    marginBottom: 32,
  },
  skillsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillTag: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF595A',
  },
  skillText: {
    fontSize: 14,
    color: '#F4E0CC',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  passButton: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#FF595A',
  },
  messageButton: {
    backgroundColor: '#000000',
    borderWidth: 3,
    borderColor: '#F4E0CC',
  },
  likeButton: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#FF595A',
  },
});