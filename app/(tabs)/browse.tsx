import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { Settings, X, Star, MapPin, Briefcase, Award, ExternalLink, Code, Palette, TrendingUp, Users, Calendar, Target, Zap, ChevronLeft, ChevronRight, Download } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface ProjectImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

interface TalentProfile {
  id: string;
  name: string;
  role: string;
  education: string;
  avatar: string;
  compatibilityScore: number;
  bio: string;
  skills: string[];
  tools: string[];
  projects: ProjectImage[];
  profileType: 'creative' | 'engineer' | 'product';
}

const talentProfiles: TalentProfile[] = [
  {
    id: '1',
    name: 'Jessica Chen',
    role: 'Senior Product Designer',
    education: 'Stanford University',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    compatibilityScore: 8.7,
    bio: 'Passionate about creating intuitive user experiences that solve real problems. I specialize in design systems and have led product design at three successful startups.',
    skills: ['UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
    tools: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Framer'],
    profileType: 'creative',
    projects: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Banking App Redesign',
        description: 'Complete redesign of mobile banking experience for 2M+ users'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Design System',
        description: 'Comprehensive design system used by 50+ engineers'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Healthcare Platform',
        description: 'UX research and design for Series A healthcare startup'
      }
    ]
  },
  {
    id: '2',
    name: 'Alexander Rodriguez',
    role: 'Full-Stack Engineer',
    education: 'UC Berkeley',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    compatibilityScore: 9.2,
    bio: 'Full-stack engineer with a passion for building scalable systems that can handle millions of users. I love working with startups to turn ambitious ideas into reality.',
    skills: ['React', 'Node.js', 'Python', 'System Architecture'],
    tools: ['AWS', 'Docker', 'PostgreSQL', 'TypeScript'],
    profileType: 'engineer',
    projects: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Real-time Platform',
        description: 'Built collaboration platform handling 1M+ concurrent users'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Microservices Architecture',
        description: 'Architected infrastructure for fintech startup (Series B)'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'ML Recommendation Engine',
        description: 'Created ML-powered system increasing engagement by 35%'
      }
    ]
  },
  {
    id: '3',
    name: 'Priya Sharma',
    role: 'VP of Product',
    education: 'MIT Sloan',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    compatibilityScore: 8.9,
    bio: 'Growth marketing expert who loves turning data into actionable insights that drive exponential growth. I specialize in building growth engines from scratch.',
    skills: ['Product Strategy', 'Growth Marketing', 'Analytics', 'A/B Testing'],
    tools: ['Mixpanel', 'Amplitude', 'Figma', 'SQL'],
    profileType: 'product',
    projects: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Growth Strategy',
        description: 'Grew user base from 10K to 1M in 18 months'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Viral Referral Program',
        description: 'Launched program resulting in 40% organic growth'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
        title: 'Conversion Optimization',
        description: 'Increased conversion rates by 150% through systematic testing'
      }
    ]
  },
];

function ProjectCarousel({ projects, profileType }: { projects: ProjectImage[]; profileType: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <View style={styles.projectCarousel}>
      <View style={styles.projectImageContainer}>
        <Image source={{ uri: projects[currentIndex].url }} style={styles.projectImage} />
        
        {/* Navigation Arrows */}
        {projects.length > 1 && (
          <>
            <TouchableOpacity 
              style={[styles.carouselButton, styles.carouselButtonLeft]} 
              onPress={prevProject}
              activeOpacity={0.8}
            >
              <ChevronLeft size={20} color="#F4E0CC" strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.carouselButton, styles.carouselButtonRight]} 
              onPress={nextProject}
              activeOpacity={0.8}
            >
              <ChevronRight size={20} color="#F4E0CC" strokeWidth={2.5} />
            </TouchableOpacity>
          </>
        )}

        {/* Project Info Overlay */}
        <View style={styles.projectOverlay}>
          <Text style={styles.projectTitle}>{projects[currentIndex].title}</Text>
          <Text style={styles.projectDescription}>{projects[currentIndex].description}</Text>
        </View>

        {/* Dots Indicator */}
        {projects.length > 1 && (
          <View style={styles.dotsContainer}>
            {projects.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function ProfileCard({ profile, index, onPass, onLike }: { 
  profile: TalentProfile; 
  index: number; 
  onPass: () => void; 
  onLike: () => void; 
}) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    translateY.value = withDelay(
      index * 200,
      withSpring(0, {
        damping: 20,
        stiffness: 100,
      })
    );
    opacity.value = withDelay(index * 200, withTiming(1, { duration: 800 }));
    scale.value = withDelay(
      index * 200,
      withSpring(1, {
        damping: 15,
        stiffness: 120,
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

  const compatibilityWidth = (profile.compatibilityScore / 10) * 100;

  return (
    <Animated.View style={[styles.profileContainer, animatedStyle]}>
      {/* Header Card - Name, Title, Education */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <View style={styles.titleEducationRow}>
            <View style={styles.titleBubble}>
              <Text style={styles.titleText}>{profile.role}</Text>
            </View>
            <View style={styles.educationBubble}>
              <Text style={styles.educationText}>{profile.education}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bio Card */}
      <View style={styles.bioCard}>
        <Text style={styles.bioText}>{profile.bio}</Text>
      </View>

      {/* Compatibility Card */}
      <View style={styles.compatibilityCard}>
        <View style={styles.compatibilityHeader}>
          <Text style={styles.compatibilityLabel}>Compatibility</Text>
          <Text style={styles.compatibilityScore}>{profile.compatibilityScore}/10</Text>
        </View>
        <View style={styles.compatibilityBarContainer}>
          <View style={styles.compatibilityBarBackground}>
            <View 
              style={[
                styles.compatibilityBarFill, 
                { width: `${compatibilityWidth}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Projects Card */}
      <View style={styles.projectsCard}>
        <Text style={styles.sectionTitle}>Featured Work</Text>
        <ProjectCarousel projects={profile.projects} profileType={profile.profileType} />
      </View>

      {/* Skills & Tools Card */}
      <View style={styles.skillsCard}>
        <Text style={styles.sectionTitle}>Skills & Tools</Text>
        <View style={styles.skillsSection}>
          <Text style={styles.skillsSubtitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {profile.skills.map((skill, skillIndex) => (
              <View key={skillIndex} style={styles.skillBubble}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.skillsSection}>
          <Text style={styles.skillsSubtitle}>Tools</Text>
          <View style={styles.skillsContainer}>
            {profile.tools.map((tool, toolIndex) => (
              <View key={toolIndex} style={styles.skillBubble}>
                <Text style={styles.skillText}>{tool}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Resume Card */}
      <View style={styles.resumeCard}>
        <TouchableOpacity style={styles.resumeButton} activeOpacity={0.8}>
          <Download size={20} color="#F4E0CC" strokeWidth={2} />
          <Text style={styles.resumeText}>View Resume</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function BrowseScreen() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  const handlePass = () => {
    if (currentProfileIndex < talentProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    }
  };

  const handleLike = () => {
    console.log(`Liked ${talentProfiles[currentProfileIndex].name}`);
    if (currentProfileIndex < talentProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    }
  };

  const currentProfile = talentProfiles[currentProfileIndex];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.title}>Browse</Text>
        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.8}>
          <Settings size={24} color="#F4E0CC" strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>

      {/* Profile Cards */}
      {currentProfile && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProfileCard
            profile={currentProfile}
            index={0}
            onPass={handlePass}
            onLike={handleLike}
          />
        </ScrollView>
      )}

      {/* No More Profiles */}
      {currentProfileIndex >= talentProfiles.length && (
        <View style={styles.noMoreProfiles}>
          <Text style={styles.noMoreProfilesText}>No more profiles to show</Text>
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={() => setCurrentProfileIndex(0)}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Buttons */}
      {currentProfile && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.passButton} 
            onPress={handlePass}
            activeOpacity={0.8}
          >
            <X size={28} color="#FF595A" strokeWidth={3} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.likeButton} 
            onPress={handleLike}
            activeOpacity={0.8}
          >
            <Star size={28} color="#F4E0CC" fill="#F4E0CC" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Playfair-Bold',
    color: '#FF595A',
    letterSpacing: 1,
  },
  settingsButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  profileContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  
  // Header Card Styles
  headerCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#F4E0CC',
  },
  headerInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  titleEducationRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  titleBubble: {
    backgroundColor: '#FF595A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  titleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F4E0CC',
  },
  educationBubble: {
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  educationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F4E0CC',
  },

  // Bio Card Styles
  bioCard: {
    backgroundColor: '#F4E0CC',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bioText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#121212',
    lineHeight: 24,
  },

  // Compatibility Card Styles
  compatibilityCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  compatibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  compatibilityLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#F4E0CC',
    letterSpacing: 0.5,
  },
  compatibilityScore: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FF595A',
    letterSpacing: 0.5,
  },
  compatibilityBarContainer: {
    width: '100%',
  },
  compatibilityBarBackground: {
    height: 12,
    backgroundColor: '#333333',
    borderRadius: 6,
    overflow: 'hidden',
  },
  compatibilityBarFill: {
    height: '100%',
    backgroundColor: '#FF595A',
    borderRadius: 6,
  },

  // Projects Card Styles
  projectsCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  projectCarousel: {
    height: 280,
  },
  projectImageContainer: {
    position: 'relative',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  carouselButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  carouselButtonLeft: {
    left: 12,
  },
  carouselButtonRight: {
    right: 12,
  },
  projectOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  projectTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#F4E0CC',
    opacity: 0.9,
    lineHeight: 20,
  },
  dotsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(244, 224, 204, 0.4)',
  },
  activeDot: {
    backgroundColor: '#F4E0CC',
  },

  // Skills Card Styles
  skillsCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  skillsSection: {
    marginBottom: 20,
  },
  skillsSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F4E0CC',
    marginBottom: 12,
    opacity: 0.8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillBubble: {
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF595A',
  },
  skillText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F4E0CC',
  },

  // Resume Card Styles
  resumeCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF595A',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  resumeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
    letterSpacing: 0.5,
  },

  // Action Buttons
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF595A',
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#F4E0CC',
  },

  // No More Profiles
  noMoreProfiles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  noMoreProfilesText: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    color: '#F4E0CC',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  resetButton: {
    backgroundColor: '#FF595A',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
    letterSpacing: 0.5,
  },
});