import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { Settings, CreditCard as Edit3, Award, Users, MessageSquare, Star, MapPin, Briefcase, Calendar } from 'lucide-react-native';

export default function ProfileScreen() {
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-40);
  const profileOpacity = useSharedValue(0);
  const profileScale = useSharedValue(0.9);
  const statsOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    headerTranslateY.value = withSpring(0, {
      damping: 20,
      stiffness: 120,
    });
    profileOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    profileScale.value = withDelay(200, withSpring(1, {
      damping: 15,
      stiffness: 140,
    }));
    statsOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const profileAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: profileOpacity.value,
      transform: [{ scale: profileScale.value }],
    };
  });

  const statsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: statsOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.background}
      />
      
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#F4E0CC" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit3 size={24} color="#FF595A" strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        <Animated.View style={[styles.profileSection, profileAnimatedStyle]}>
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['#F4E0CC', '#ffffff']}
              style={styles.profileGradient}>
              
              <View style={styles.profileImageContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
                  style={styles.profileImage} 
                />
                <View style={styles.verifiedBadge}>
                  <Star size={16} color="#000000" fill="#000000" />
                </View>
              </View>
              
              <Text style={styles.profileName}>Marcus Johnson</Text>
              <Text style={styles.profileTitle}>Senior Product Manager</Text>
              
              <View style={styles.profileDetails}>
                <View style={styles.detailRow}>
                  <Briefcase size={16} color="#FF595A" strokeWidth={2.5} />
                  <Text style={styles.detailText}>TechFlow Inc.</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#FF595A" strokeWidth={2.5} />
                  <Text style={styles.detailText}>San Francisco, CA</Text>
                </View>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#FF595A" strokeWidth={2.5} />
                  <Text style={styles.detailText}>5+ years experience</Text>
                </View>
              </View>
              
              <Text style={styles.profileBio}>
                Passionate about building products that make a difference. 
                Leading cross-functional teams to deliver innovative solutions 
                in the fintech space.
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

        <Animated.View style={[styles.statsSection, statsAnimatedStyle]}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(255, 89, 90, 0.1)', 'rgba(244, 224, 204, 0.1)']}
                style={styles.statGradient}>
                <Users size={24} color="#FF595A" strokeWidth={2.5} />
                <Text style={styles.statNumber}>247</Text>
                <Text style={styles.statLabel}>Connections</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(255, 89, 90, 0.1)', 'rgba(244, 224, 204, 0.1)']}
                style={styles.statGradient}>
                <MessageSquare size={24} color="#FF595A" strokeWidth={2.5} />
                <Text style={styles.statNumber}>89</Text>
                <Text style={styles.statLabel}>Messages</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(255, 89, 90, 0.1)', 'rgba(244, 224, 204, 0.1)']}
                style={styles.statGradient}>
                <Award size={24} color="#FF595A" strokeWidth={2.5} />
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Achievements</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(255, 89, 90, 0.1)', 'rgba(244, 224, 204, 0.1)']}
                style={styles.statGradient}>
                <Star size={24} color="#FF595A" fill="#FF595A" strokeWidth={2.5} />
                <Text style={styles.statNumber}>4.9</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF595A', '#FF595A']}
              style={styles.actionGradient}>
              <Text style={styles.actionText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <View style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Share Profile</Text>
            </View>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  settingsButton: {
    padding: 8,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FF595A',
    letterSpacing: 2,
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  profileSection: {
    marginBottom: 32,
  },
  profileCard: {
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
  profileGradient: {
    padding: 32,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FF595A',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#F4E0CC',
    borderRadius: 16,
    padding: 8,
    borderWidth: 3,
    borderColor: '#000000',
  },
  profileName: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  profileTitle: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'Inter-Medium',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileDetails: {
    gap: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  profileBio: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 89, 90, 0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FF595A',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  actionsSection: {
    gap: 16,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
    letterSpacing: 1,
  },
  secondaryAction: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF595A',
    backgroundColor: 'transparent',
  },
  secondaryActionText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF595A',
    letterSpacing: 1,
  },
});