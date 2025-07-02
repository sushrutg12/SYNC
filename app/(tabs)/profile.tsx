import React, { useEffect, useState } from 'react';
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
import { 
  Settings, 
  Building2, 
  Eye, 
  Search, 
  Gift, 
  Users, 
  ChevronRight,
  X,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  Award
} from 'lucide-react-native';

interface ProfileSection {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  completed: boolean;
}

const profileSections: ProfileSection[] = [
  {
    id: 'company',
    title: 'Company Profile',
    subtitle: 'Edit your startup details',
    icon: <Building2 size={24} color="#F4E0CC" strokeWidth={2} />,
    completed: true,
  },
  {
    id: 'funding',
    title: 'Funding Stage',
    subtitle: 'Update your company\'s funding info',
    icon: <Eye size={24} color="#F4E0CC" strokeWidth={2} />,
    completed: true,
  },
  {
    id: 'roles',
    title: 'Roles Needed',
    subtitle: 'What talent are you looking for?',
    icon: <Search size={24} color="#F4E0CC" strokeWidth={2} />,
    completed: false,
  },
  {
    id: 'offer',
    title: 'Offer Details',
    subtitle: 'Equity, compensation, and benefits',
    icon: <Gift size={24} color="#F4E0CC" strokeWidth={2} />,
    completed: false,
  },
  {
    id: 'vision',
    title: 'Why Join Us',
    subtitle: 'Share your company vision',
    icon: <Users size={24} color="#F4E0CC" strokeWidth={2} />,
    completed: true,
  },
];

function ProfileSection({ section, index, onPress }: { 
  section: ProfileSection; 
  index: number; 
  onPress: () => void; 
}) {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      index * 100,
      withSpring(0, {
        damping: 18,
        stiffness: 120,
      })
    );
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 600 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        style={[
          styles.sectionCard,
          section.completed && styles.sectionCardCompleted
        ]} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.sectionIcon}>
          {section.icon}
        </View>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
        </View>
        <ChevronRight size={20} color="#F4E0CC" strokeWidth={2} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function ViewModeProfile() {
  return (
    <View style={styles.viewModeContainer}>
      <View style={styles.profileCard}>
        <LinearGradient
          colors={['#F4E0CC', '#ffffff', '#F4E0CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}>
          
          {/* Header Section */}
          <View style={styles.cardHeader}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
                style={styles.profileImage} 
              />
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>95%</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Star size={12} color="#000000" fill="#000000" />
                <Text style={styles.ratingText}>4.9</Text>
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Marcus Johnson</Text>
              <Text style={styles.profileTitle}>Senior Product Manager</Text>
              <View style={styles.companyContainer}>
                <Briefcase size={16} color="#FF595A" strokeWidth={2.5} />
                <Text style={styles.companyText}>TechFlow Inc.</Text>
              </View>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <MapPin size={18} color="#666666" strokeWidth={2} />
              <Text style={styles.detailText}>San Francisco, CA</Text>
            </View>
            <View style={styles.detailRow}>
              <Award size={18} color="#666666" strokeWidth={2} />
              <Text style={styles.detailText}>5+ years • 12 achievements</Text>
            </View>
          </View>

          {/* Skills Section */}
          <View style={styles.skillsSection}>
            <Text style={styles.skillsTitle}>Core Expertise</Text>
            <View style={styles.skillsContainer}>
              {['Product Strategy', 'Team Leadership', 'Analytics'].map((skill, skillIndex) => (
                <View key={skillIndex} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const [isViewMode, setIsViewMode] = useState(false);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-40);
  const profileOpacity = useSharedValue(0);
  const profileScale = useSharedValue(0.9);

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

  const completedSections = profileSections.filter(section => section.completed).length;
  const completionPercentage = (completedSections / profileSections.length) * 100;

  if (isViewMode) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#000000', '#1a1a1a', '#000000']}
          style={styles.background}
        />
        
        {/* View Mode Header */}
        <View style={styles.viewModeHeader}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setIsViewMode(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.viewModeTitle}>Marcus</Text>
          <TouchableOpacity style={styles.doneButton} activeOpacity={0.8}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => setIsViewMode(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.tabButtonTextInactive}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} activeOpacity={0.8}>
            <Text style={styles.tabButtonTextActive}>View</Text>
            <View style={styles.activeTabIndicator} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ViewModeProfile />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.background}
      />
      
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.8}>
          <Settings size={24} color="#F4E0CC" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Coral</Text>
        <TouchableOpacity style={styles.menuButton} activeOpacity={0.8}>
          <View style={styles.menuDots}>
            <View style={styles.menuDot} />
            <View style={styles.menuDot} />
            <View style={styles.menuDot} />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        <Animated.View style={[styles.profileSection, profileAnimatedStyle]}>
          {/* Profile Avatar and Basic Info */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
                style={styles.avatar} 
              />
              <View style={styles.avatarBorder} />
            </View>
            <Text style={styles.userName}>Javel</Text>
            <View style={styles.userTypeContainer}>
              <Building2 size={16} color="#F4E0CC" strokeWidth={2} />
              <Text style={styles.userType}>Startup</Text>
            </View>
          </View>

          {/* Profile Completion */}
          <View style={styles.completionSection}>
            <Text style={styles.completionTitle}>Profile Completion</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${completionPercentage}%` }
                  ]} 
                />
              </View>
            </View>
            <Text style={styles.completionSubtitle}>
              Complete all sections to improve your matches
            </Text>
          </View>
        </Animated.View>

        {/* Profile Sections */}
        <View style={styles.sectionsContainer}>
          {profileSections.map((section, index) => (
            <ProfileSection
              key={section.id}
              section={section}
              index={index}
              onPress={() => {
                if (section.id === 'company') {
                  // For demo purposes, show view mode when tapping company profile
                  setIsViewMode(true);
                } else {
                  console.log(`Edit ${section.title}`);
                }
              }}
            />
          ))}
        </View>

        {/* View Profile Button */}
        <View style={styles.viewButtonContainer}>
          <TouchableOpacity 
            style={styles.viewProfileButton} 
            onPress={() => setIsViewMode(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.viewProfileButtonText}>View My Profile</Text>
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
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FF7F7F',
    letterSpacing: 1,
  },
  menuButton: {
    padding: 8,
  },
  menuDots: {
    flexDirection: 'row',
    gap: 4,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F4E0CC',
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarBorder: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 64,
    borderWidth: 3,
    borderColor: '#F4E0CC',
  },
  userName: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FF7F7F',
    marginBottom: 8,
    letterSpacing: 1,
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userType: {
    fontSize: 18,
    color: '#F4E0CC',
    fontFamily: 'Inter-Medium',
  },
  completionSection: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(244, 224, 204, 0.2)',
  },
  completionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#F4E0CC',
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F4E0CC',
    borderRadius: 4,
  },
  completionSubtitle: {
    fontSize: 14,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
  sectionsContainer: {
    gap: 16,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(244, 224, 204, 0.3)',
  },
  sectionCardCompleted: {
    borderColor: '#F4E0CC',
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(244, 224, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 224, 204, 0.3)',
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#F4E0CC',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
  viewButtonContainer: {
    marginTop: 32,
  },
  viewProfileButton: {
    backgroundColor: '#FF595A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  viewProfileButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
    letterSpacing: 0.5,
  },
  // View Mode Styles
  viewModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF595A',
  },
  viewModeTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
  },
  doneButton: {
    padding: 8,
  },
  doneText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF595A',
  },
  tabSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 40,
  },
  tabButton: {
    alignItems: 'center',
    position: 'relative',
  },
  tabButtonTextActive: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF595A',
    paddingBottom: 8,
  },
  tabButtonTextInactive: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#F4E0CC',
    opacity: 0.6,
    paddingBottom: 8,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FF595A',
    borderRadius: 2,
  },
  viewModeContainer: {
    flex: 1,
  },
  // Profile Card Styles (for view mode)
  profileCard: {
    marginHorizontal: 20,
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
});