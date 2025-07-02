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
import { Settings, X, Star, MapPin, Briefcase, Award, ExternalLink, Code, Palette, TrendingUp, Users, Calendar, Target, Zap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface TalentProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  portfolioImage: string;
  compatibilityScore: number;
  location: string;
  experience: string;
  bio: string;
  skills: string[];
  achievements: string[];
  portfolioLinks: { title: string; url: string }[];
  lookingFor: string;
  pastProjects: string[];
  careerGoals: string;
  workStyle: string[];
  availability: string;
  socialLinks: { platform: string; url: string }[];
  testimonials: { name: string; role: string; quote: string }[];
}

const filterCategories = [
  'All Talent',
  'Designers',
  'Engineers',
  'Product',
  'Marketing',
  'Sales',
  'Operations',
];

const talentProfiles: TalentProfile[] = [
  {
    id: '1',
    name: 'Jessica Chen',
    role: 'Senior Product Designer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    portfolioImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    compatibilityScore: 8.7,
    location: 'San Francisco, CA',
    experience: '6+ years',
    bio: 'Passionate about creating intuitive user experiences that solve real problems. I specialize in design systems and have led product design at three successful startups. My approach combines user research, data-driven insights, and creative problem-solving to deliver products that users love.',
    skills: ['UI/UX Design', 'Figma', 'Design Systems', 'User Research', 'Prototyping', 'Sketch', 'Adobe Creative Suite', 'Framer'],
    achievements: [
      'Led design for 3 successful product launches reaching 2M+ users',
      'Increased user engagement by 40% through comprehensive redesign',
      'Built design system used by 50+ engineers across 4 product teams',
      'Won "Best Design" award at TechCrunch Disrupt 2023',
      'Mentored 12 junior designers through design bootcamp program'
    ],
    portfolioLinks: [
      { title: 'Design Portfolio', url: 'jessicachen.design' },
      { title: 'Dribbble', url: 'dribbble.com/jessicachen' },
      { title: 'Behance', url: 'behance.net/jessicachen' }
    ],
    lookingFor: 'Early-stage startups focused on consumer products where I can have significant design impact and help shape the product vision. Particularly interested in fintech, healthtech, or sustainability-focused companies.',
    pastProjects: [
      'Redesigned mobile banking app used by 2M+ customers',
      'Created comprehensive design system for B2B SaaS platform',
      'Led UX research initiative for healthcare startup (Series A)',
      'Designed award-winning e-commerce mobile experience',
      'Built accessibility-first design framework'
    ],
    careerGoals: 'Looking to transition into a Head of Design role at a mission-driven startup where I can build and lead a design team while continuing to be hands-on with product strategy.',
    workStyle: ['Collaborative', 'Data-driven', 'User-centric', 'Iterative', 'Cross-functional'],
    availability: 'Available immediately',
    socialLinks: [
      { platform: 'LinkedIn', url: 'linkedin.com/in/jessicachen' },
      { platform: 'Twitter', url: 'twitter.com/jessicachen' },
      { platform: 'Medium', url: 'medium.com/@jessicachen' }
    ],
    testimonials: [
      {
        name: 'Sarah Kim',
        role: 'VP of Product at TechFlow',
        quote: 'Jessica is one of the most talented designers I\'ve worked with. Her ability to translate complex user needs into elegant solutions is exceptional.'
      },
      {
        name: 'Mike Rodriguez',
        role: 'CEO at StartupX',
        quote: 'Jessica transformed our entire product experience. User satisfaction increased by 60% after her redesign.'
      }
    ]
  },
  {
    id: '2',
    name: 'Alexander Rodriguez',
    role: 'Full-Stack Engineer',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    portfolioImage: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
    compatibilityScore: 9.2,
    location: 'New York, NY',
    experience: '8+ years',
    bio: 'Full-stack engineer with a passion for building scalable systems that can handle millions of users. I love working with startups to turn ambitious ideas into reality. My expertise spans from frontend React applications to backend microservices and cloud infrastructure.',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'TypeScript', 'Docker', 'Kubernetes', 'GraphQL', 'Redis'],
    achievements: [
      'Scaled platform from 100K to 5M+ users with 99.9% uptime',
      'Reduced server costs by 60% through optimization and architecture redesign',
      'Led engineering team of 12 developers across 3 product areas',
      'Open source contributor with 10K+ GitHub stars across projects',
      'Speaker at 5 major tech conferences including React Conf'
    ],
    portfolioLinks: [
      { title: 'GitHub', url: 'github.com/alexrodriguez' },
      { title: 'Personal Site', url: 'alexrodriguez.dev' },
      { title: 'Tech Blog', url: 'blog.alexrodriguez.dev' }
    ],
    lookingFor: 'Technical co-founder opportunities or senior engineering roles at startups building innovative products with strong technical challenges. Particularly interested in AI/ML, fintech, or developer tools.',
    pastProjects: [
      'Built real-time collaboration platform handling 1M+ concurrent users',
      'Architected microservices infrastructure for fintech startup (Series B)',
      'Created ML-powered recommendation engine increasing engagement by 35%',
      'Developed open-source React component library (50K+ downloads)',
      'Built distributed system for processing 10TB+ data daily'
    ],
    careerGoals: 'Seeking CTO role at early-stage startup where I can build the technical foundation and culture while staying hands-on with architecture and mentoring engineers.',
    workStyle: ['Technical leadership', 'Mentoring-focused', 'Architecture-first', 'Performance-oriented', 'Open source advocate'],
    availability: 'Available in 4 weeks',
    socialLinks: [
      { platform: 'LinkedIn', url: 'linkedin.com/in/alexrodriguez' },
      { platform: 'Twitter', url: 'twitter.com/alexdev' },
      { platform: 'Stack Overflow', url: 'stackoverflow.com/users/alexrodriguez' }
    ],
    testimonials: [
      {
        name: 'Jennifer Liu',
        role: 'CTO at ScaleUp Inc',
        quote: 'Alex is a rare combination of technical excellence and leadership skills. He built our entire platform architecture from scratch.'
      },
      {
        name: 'David Park',
        role: 'Engineering Manager at TechCorp',
        quote: 'Working with Alex elevated our entire team\'s technical standards. His mentorship was invaluable.'
      }
    ]
  },
  {
    id: '3',
    name: 'Priya Sharma',
    role: 'Growth Marketing Lead',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    portfolioImage: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
    compatibilityScore: 8.9,
    location: 'Austin, TX',
    experience: '5+ years',
    bio: 'Growth marketing expert who loves turning data into actionable insights that drive exponential growth. I specialize in building growth engines from scratch and have helped multiple startups achieve product-market fit through strategic experimentation and optimization.',
    skills: ['Growth Marketing', 'Analytics', 'A/B Testing', 'SEO', 'Content Strategy', 'Paid Acquisition', 'Email Marketing', 'Conversion Optimization'],
    achievements: [
      'Grew user base from 10K to 1M in 18 months through growth hacking',
      'Achieved 3x ROI on marketing spend across all channels',
      'Built growth team from 1 to 8 people with clear processes',
      'Launched viral referral program resulting in 40% organic growth',
      'Increased conversion rates by 150% through systematic optimization'
    ],
    portfolioLinks: [
      { title: 'Marketing Portfolio', url: 'priyasharma.marketing' },
      { title: 'Growth Case Studies', url: 'growth.priyasharma.com' },
      { title: 'Marketing Blog', url: 'blog.priyasharma.marketing' }
    ],
    lookingFor: 'Head of Growth roles at early-stage B2B or B2C startups where I can build the growth function from the ground up and work directly with founders on growth strategy.',
    pastProjects: [
      'Launched viral referral program generating 40% month-over-month growth',
      'Built content marketing strategy reaching 500K+ monthly views',
      'Optimized conversion funnel resulting in 2x improvement in LTV/CAC',
      'Created influencer marketing program with 5x ROI',
      'Developed growth experimentation framework adopted by 3 startups'
    ],
    careerGoals: 'Aiming to become VP of Growth at a unicorn startup while building my personal brand as a growth marketing thought leader through speaking and writing.',
    workStyle: ['Data-driven', 'Experimental', 'Cross-functional', 'Results-oriented', 'Creative problem-solving'],
    availability: 'Available in 2 weeks',
    socialLinks: [
      { platform: 'LinkedIn', url: 'linkedin.com/in/priyasharma' },
      { platform: 'Twitter', url: 'twitter.com/priyagrowth' },
      { platform: 'Medium', url: 'medium.com/@priyasharma' }
    ],
    testimonials: [
      {
        name: 'Tom Wilson',
        role: 'CEO at GrowthCo',
        quote: 'Priya single-handedly transformed our growth trajectory. Her strategic thinking and execution are world-class.'
      },
      {
        name: 'Lisa Chen',
        role: 'VP Marketing at StartupY',
        quote: 'Priya\'s growth experiments consistently delivered results. She has an incredible intuition for what will work.'
      }
    ]
  },
];

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
    <Animated.View style={[styles.profileCard, animatedStyle]}>
      <View style={styles.cardContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          </View>
          <View style={styles.profileBasicInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileRole}>{profile.role}</Text>
          </View>
        </View>

        {/* Compatibility Score */}
        <View style={styles.compatibilitySection}>
          <Text style={styles.compatibilityLabel}>Compatibility Score</Text>
          <View style={styles.compatibilityBar}>
            <View style={styles.compatibilityBarBackground}>
              <View 
                style={[
                  styles.compatibilityBarFill, 
                  { width: `${compatibilityWidth}%` }
                ]} 
              />
            </View>
            <Text style={styles.compatibilityScore}>{profile.compatibilityScore}/10</Text>
          </View>
        </View>

        {/* Portfolio Image */}
        <View style={styles.portfolioImageContainer}>
          <Image source={{ uri: profile.portfolioImage }} style={styles.portfolioImage} />
        </View>

        {/* Scrollable Content */}
        <View style={styles.profileContent}>
          {/* Basic Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <MapPin size={18} color="#F4E0CC" strokeWidth={2} />
              <Text style={styles.detailText}>{profile.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Briefcase size={18} color="#F4E0CC" strokeWidth={2} />
              <Text style={styles.detailText}>{profile.experience} experience</Text>
            </View>
            <View style={styles.detailRow}>
              <Calendar size={18} color="#F4E0CC" strokeWidth={2} />
              <Text style={styles.detailText}>{profile.availability}</Text>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>

          {/* Core Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Skills</Text>
            <View style={styles.skillsContainer}>
              {profile.skills.map((skill, skillIndex) => (
                <View key={skillIndex} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Key Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Achievements</Text>
            {profile.achievements.map((achievement, achievementIndex) => (
              <View key={achievementIndex} style={styles.achievementItem}>
                <Award size={16} color="#FF595A" strokeWidth={2} />
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>
            ))}
          </View>

          {/* Portfolio Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Portfolio & Work</Text>
            {profile.portfolioLinks.map((link, linkIndex) => (
              <TouchableOpacity key={linkIndex} style={styles.portfolioLink} activeOpacity={0.8}>
                <ExternalLink size={16} color="#FF595A" strokeWidth={2} />
                <Text style={styles.portfolioLinkText}>{link.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* What I'm Looking For */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What I'm Looking For</Text>
            <Text style={styles.lookingForText}>{profile.lookingFor}</Text>
          </View>

          {/* Career Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career Goals</Text>
            <View style={styles.goalContainer}>
              <Target size={18} color="#FF595A" strokeWidth={2} />
              <Text style={styles.goalText}>{profile.careerGoals}</Text>
            </View>
          </View>

          {/* Work Style */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Style</Text>
            <View style={styles.workStyleContainer}>
              {profile.workStyle.map((style, styleIndex) => (
                <View key={styleIndex} style={styles.workStyleTag}>
                  <Users size={14} color="#F4E0CC" strokeWidth={2} />
                  <Text style={styles.workStyleText}>{style}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Projects */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Projects</Text>
            {profile.pastProjects.map((project, projectIndex) => (
              <View key={projectIndex} style={styles.projectItem}>
                <View style={styles.projectBullet} />
                <Text style={styles.projectText}>{project}</Text>
              </View>
            ))}
          </View>

          {/* Social Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connect</Text>
            <View style={styles.socialLinksContainer}>
              {profile.socialLinks.map((social, socialIndex) => (
                <TouchableOpacity key={socialIndex} style={styles.socialLink} activeOpacity={0.8}>
                  <ExternalLink size={16} color="#FF595A" strokeWidth={2} />
                  <Text style={styles.socialLinkText}>{social.platform}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Testimonials */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What Others Say</Text>
            {profile.testimonials.map((testimonial, testimonialIndex) => (
              <View key={testimonialIndex} style={styles.testimonialContainer}>
                <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
                <View style={styles.testimonialAuthor}>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function BrowseScreen() {
  const [activeFilter, setActiveFilter] = useState('All Talent');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const headerOpacity = useSharedValue(0);
  const filtersOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    filtersOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  const filtersAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: filtersOpacity.value,
    };
  });

  const handlePass = () => {
    if (currentProfileIndex < talentProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    }
  };

  const handleLike = () => {
    // Handle like action (e.g., add to favorites, send connection request)
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

      {/* Profile Card */}
      {currentProfile && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
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

      {currentProfile && (
        <View style={styles.actionButtons} pointerEvents="box-none">
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
  filtersSection: {
    paddingBottom: 20,
  },
  filtersList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterChip: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#F4E0CC',
    borderColor: '#F4E0CC',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F4E0CC',
    letterSpacing: 0.5,
  },
  filterChipTextActive: {
    color: '#121212',
    fontFamily: 'Inter-Bold',
  },
  profileCard: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 120,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#F4E0CC',
  },
  profileBasicInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  profileRole: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#F4E0CC',
    opacity: 0.8,
  },
  compatibilitySection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  compatibilityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F4E0CC',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  compatibilityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compatibilityBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  compatibilityBarFill: {
    height: '100%',
    backgroundColor: '#FF595A',
    borderRadius: 4,
  },
  compatibilityScore: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF595A',
    letterSpacing: 0.5,
  },
  portfolioImageContainer: {
    height: 200,
    marginBottom: 20,
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileContent: {
    flex: 1,
  },
  detailsSection: {
    gap: 12,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  bioText: {
    fontSize: 16,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    opacity: 0.9,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillTag: {
    backgroundColor: '#121212',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FF595A',
  },
  skillText: {
    fontSize: 14,
    color: '#F4E0CC',
    fontFamily: 'Inter-Medium',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  achievementText: {
    flex: 1,
    fontSize: 16,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    opacity: 0.9,
  },
  portfolioLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  portfolioLinkText: {
    fontSize: 16,
    color: '#FF595A',
    fontFamily: 'Inter-Medium',
    textDecorationLine: 'underline',
  },
  lookingForText: {
    fontSize: 16,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    opacity: 0.9,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  goalText: {
    flex: 1,
    fontSize: 16,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    opacity: 0.9,
  },
  workStyleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  workStyleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#121212',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F4E0CC',
  },
  workStyleText: {
    fontSize: 14,
    color: '#F4E0CC',
    fontFamily: 'Inter-Medium',
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  projectBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF595A',
    marginTop: 8,
  },
  projectText: {
    flex: 1,
    fontSize: 16,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    opacity: 0.9,
  },
  socialLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  socialLinkText: {
    fontSize: 16,
    color: '#FF595A',
    fontFamily: 'Inter-Medium',
    textDecorationLine: 'underline',
  },
  testimonialContainer: {
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF595A',
  },
  testimonialQuote: {
    fontSize: 16,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  testimonialAuthor: {
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 12,
  },
  testimonialName: {
    fontSize: 14,
    color: '#F4E0CC',
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  testimonialRole: {
    fontSize: 12,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#F4E0CC',
  },
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