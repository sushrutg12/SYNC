import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Heart, X, MapPin, Briefcase, Award, Star } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const SWIPE_THRESHOLD = width * 0.3;

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
  {
    id: '4',
    name: 'David Kim',
    title: 'Senior Software Engineer',
    company: 'Google',
    match: '87',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    age: 26,
    location: 'Mountain View, CA',
    experience: '4+ years',
    skills: ['Python', 'Machine Learning', 'Cloud'],
    achievements: 9,
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Sarah Wilson',
    title: 'Marketing Director',
    company: 'Netflix',
    match: '92',
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    age: 30,
    location: 'Los Angeles, CA',
    experience: '7+ years',
    skills: ['Brand Strategy', 'Digital Marketing', 'Analytics'],
    achievements: 14,
    rating: 4.8,
  },
];

interface SwipeableCardProps {
  profile: Profile;
  index: number;
  totalCards: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
}

function SwipeableCard({ profile, index, totalCards, onSwipeLeft, onSwipeRight, isTop }: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Stagger the cards with slight offset and scale
    const delay = index * 50;
    const initialScale = 1 - (index * 0.05);
    const initialY = index * 8;
    
    scale.value = withDelay(delay, withSpring(initialScale, {
      damping: 15,
      stiffness: 140,
    }));
    
    translateY.value = withDelay(delay, withSpring(initialY, {
      damping: 18,
      stiffness: 120,
    }));
  }, [index]);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      if (!isTop) return;
    },
    onActive: (event) => {
      if (!isTop) return;
      
      translateX.value = event.translationX;
      rotate.value = interpolate(
        event.translationX,
        [-width, width],
        [-30, 30],
        Extrapolate.CLAMP
      );
    },
    onEnd: (event) => {
      if (!isTop) return;
      
      const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD;
      const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD;
      
      if (shouldSwipeLeft) {
        translateX.value = withTiming(-width * 1.5, { duration: 300 });
        rotate.value = withTiming(-45, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(onSwipeLeft)();
      } else if (shouldSwipeRight) {
        translateX.value = withTiming(width * 1.5, { duration: 300 });
        rotate.value = withTiming(45, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(onSwipeRight)();
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
      zIndex: totalCards - index,
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const leftOpacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );
    
    const rightOpacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity: isTop ? Math.max(leftOpacity, rightOpacity) : 0,
    };
  });

  const leftOverlayStyle = useAnimatedStyle(() => {
    const leftOpacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity: isTop ? leftOpacity : 0,
    };
  });

  const rightOverlayStyle = useAnimatedStyle(() => {
    const rightOpacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity: isTop ? rightOpacity : 0,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} enabled={isTop}>
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <View style={styles.card}>
          <LinearGradient
            colors={['#F4E0CC', '#ffffff', '#F4E0CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}>
            
            {/* Swipe Overlays */}
            <Animated.View style={[styles.swipeOverlay, styles.leftOverlay, leftOverlayStyle]}>
              <View style={styles.overlayContent}>
                <X size={60} color="#FF595A" strokeWidth={4} />
                <Text style={styles.overlayText}>PASS</Text>
              </View>
            </Animated.View>
            
            <Animated.View style={[styles.swipeOverlay, styles.rightOverlay, rightOverlayStyle]}>
              <View style={styles.overlayContent}>
                <Heart size={60} color="#FF595A" fill="#FF595A" strokeWidth={4} />
                <Text style={styles.overlayText}>LIKE</Text>
              </View>
            </Animated.View>
            
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
          </LinearGradient>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

export default function InSyncScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProfiles, setVisibleProfiles] = useState(profiles.slice(0, 3));
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

  const handleSwipeLeft = () => {
    console.log(`Passed on ${visibleProfiles[0].name}`);
    nextCard();
  };

  const handleSwipeRight = () => {
    console.log(`Liked ${visibleProfiles[0].name}`);
    nextCard();
  };

  const nextCard = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < profiles.length) {
      setCurrentIndex(nextIndex);
      // Update visible profiles to show next 3
      const newVisibleProfiles = profiles.slice(nextIndex, nextIndex + 3);
      setVisibleProfiles(newVisibleProfiles);
    } else {
      // Reset to beginning or show "no more profiles" state
      setCurrentIndex(0);
      setVisibleProfiles(profiles.slice(0, 3));
    }
  };

  const handleButtonPress = (action: 'pass' | 'like') => {
    if (action === 'pass') {
      handleSwipeLeft();
    } else {
      handleSwipeRight();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.background}
      />
      
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.logo}>INSYNC</Text>
        <Text style={styles.subtitle}>AI Driven Matches</Text>
      </Animated.View>

      {/* Card Stack Container */}
      <View style={styles.cardStackContainer}>
        {visibleProfiles.length > 0 ? (
          visibleProfiles.map((profile, index) => (
            <SwipeableCard
              key={`${profile.id}-${currentIndex + index}`}
              profile={profile}
              index={index}
              totalCards={visibleProfiles.length}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              isTop={index === 0}
            />
          ))
        ) : (
          <View style={styles.noMoreCards}>
            <Text style={styles.noMoreCardsText}>No more profiles</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setCurrentIndex(0);
                setVisibleProfiles(profiles.slice(0, 3));
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {visibleProfiles.length > 0 && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.passButton} 
            onPress={() => handleButtonPress('pass')}
            activeOpacity={0.8}
          >
            <X size={28} color="#FF595A" strokeWidth={3} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.messageButton} 
            activeOpacity={0.8}
          >
            <MessageCircle size={28} color="#F4E0CC" strokeWidth={3} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.likeButton} 
            onPress={() => handleButtonPress('like')}
            activeOpacity={0.8}
          >
            <Heart size={28} color="#FF595A" fill="#FF595A" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      )}
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
  cardStackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: height * 0.6, // Slightly reduced height to accommodate top padding
  },
  card: {
    flex: 1,
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
    flex: 1,
    padding: 28,
    position: 'relative',
  },
  swipeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    zIndex: 10,
  },
  leftOverlay: {
    backgroundColor: 'rgba(255, 89, 90, 0.1)',
  },
  rightOverlay: {
    backgroundColor: 'rgba(255, 89, 90, 0.1)',
  },
  overlayContent: {
    alignItems: 'center',
    gap: 16,
  },
  overlayText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FF595A',
    letterSpacing: 2,
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
    flex: 1,
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
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 40,
    zIndex: 100,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
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
    borderWidth: 3,
    borderColor: '#FF595A',
  },
  messageButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000000',
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
    borderWidth: 3,
    borderColor: '#F4E0CC',
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
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
    borderWidth: 3,
    borderColor: '#FF595A',
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noMoreCardsText: {
    fontSize: 24,
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