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
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Standout {
  id: string;
  name: string;
  avatar: string;
  isNew: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: boolean;
  isStandout: boolean;
}

const standouts: Standout[] = [
  {
    id: '1',
    name: 'Jessica',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: true,
  },
  {
    id: '2',
    name: 'Alex',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: false,
  },
  {
    id: '3',
    name: 'Priya',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: true,
  },
  {
    id: '4',
    name: 'Marcus',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: false,
  },
];

const conversations: Conversation[] = [
  {
    id: '1',
    name: 'Jessica Chen',
    lastMessage: 'Thanks for connecting! Would love to discuss the design system project we talked about.',
    time: '2m',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    unread: true,
    isStandout: true,
  },
  {
    id: '2',
    name: 'Alexander Rodriguez',
    lastMessage: 'The React architecture looks solid. Let\'s schedule a call to discuss implementation.',
    time: '1h',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    unread: true,
    isStandout: true,
  },
  {
    id: '3',
    name: 'Priya Sharma',
    lastMessage: 'Great meeting you at the conference! Here\'s my portfolio link as promised.',
    time: '3h',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    unread: false,
    isStandout: true,
  },
  {
    id: '4',
    name: 'Marcus Johnson',
    lastMessage: 'The startup idea has real potential. Let\'s explore potential partnerships.',
    time: '1d',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    unread: false,
    isStandout: false,
  },
  {
    id: '5',
    name: 'Sarah Kim',
    lastMessage: 'Thanks for the introduction to the team at Google. Really appreciate it!',
    time: '2d',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    unread: false,
    isStandout: false,
  },
];

function StandoutAvatar({ standout, index }: { standout: Standout; index: number }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      index * 100,
      withSpring(1, {
        damping: 15,
        stiffness: 140,
      })
    );
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 600 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity style={styles.standoutContainer} activeOpacity={0.8}>
        <LinearGradient
          colors={standout.isNew ? ['#FF595A', '#FF7F7F'] : ['rgba(244, 224, 204, 0.2)', 'rgba(244, 224, 204, 0.1)']}
          style={styles.standoutGradientRing}
        >
          <View style={styles.standoutInnerRing}>
            <Image source={{ uri: standout.avatar }} style={styles.standoutAvatar} />
          </View>
        </LinearGradient>
        {standout.isNew && (
          <View style={styles.newIndicator}>
            <View style={styles.newIndicatorPulse} />
          </View>
        )}
        <Text style={styles.standoutName}>{standout.name}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function ConversationItem({ conversation, index }: { conversation: Conversation; index: number }) {
  const translateX = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      index * 80,
      withSpring(0, {
        damping: 18,
        stiffness: 120,
      })
    );
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 600 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity style={styles.conversationItem} activeOpacity={0.8}>
        <View style={styles.conversationContent}>
          <View style={styles.avatarContainer}>
            <View style={[
              styles.conversationAvatarRing,
              (conversation.unread || conversation.isStandout) &&
                conversation.name !== 'Priya Sharma' && conversation.name !== 'Alexander Rodriguez' &&
                styles.conversationAvatarRingActive
            ]}>
              <Image source={{ uri: conversation.avatar }} style={styles.conversationAvatar} />
            </View>
            {conversation.unread && <View style={styles.unreadDot} />}
          </View>
          
          <View style={styles.messageContent}>
            <View style={styles.messageHeader}>
              <Text style={[
                styles.senderName,
                conversation.unread && styles.senderNameUnread,
                (conversation.name === 'Alexander Rodriguez' || conversation.name === 'Priya Sharma') && { color: '#F5F5F5', fontFamily: 'Inter-Bold' }
              ]}>
                {conversation.name}
              </Text>
              <Text style={styles.messageTime}>{conversation.time}</Text>
            </View>
            <Text 
              style={[
                styles.lastMessage, 
                conversation.unread && styles.lastMessageUnread
              ]} 
              numberOfLines={2}
            >
              {conversation.lastMessage}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ConnectionsScreen() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  if (selectedChat) {
    return (
      <View style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setSelectedChat(null)}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#F5F5F5" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.chatAvatarContainer}>
            <View style={styles.chatAvatarRing}>
              <Image 
                source={{ uri: conversations.find(c => c.id === selectedChat)?.avatar }} 
                style={styles.chatAvatar} 
              />
            </View>
          </View>
        </View>

        <View style={styles.chatContent}>
          <Text style={styles.chatIntro}>Your messages began here</Text>
          
          <View style={styles.messagesContainer}>
            <View style={styles.receivedMessage}>
              <Text style={styles.receivedMessageText}>
                Hey! Thanks for connecting. I'd love to learn more about your startup.
              </Text>
            </View>
            
            <View style={styles.sentMessage}>
              <Text style={styles.sentMessageText}>
                Absolutely! We're building a platform that connects entrepreneurs with the right investors and mentors.
              </Text>
            </View>
            
            <View style={styles.receivedMessage}>
              <Text style={styles.receivedMessageText}>
                That sounds fascinating! I'd love to hear more about your approach and maybe discuss potential collaboration opportunities.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputBar}>
            <Text style={styles.inputPlaceholder}>Type a message...</Text>
            <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
              <Send size={20} color="#F5F5F5" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sticky INSYNC Title Only */}
      <Animated.View style={[styles.stickyTitle, headerAnimatedStyle]}>
        <LinearGradient
          colors={['rgba(30, 30, 30, 0.98)', 'rgba(18, 18, 18, 0.95)']}
          style={styles.titleGradientBackground}
        >
          <Text style={styles.title}>INSYNC</Text>
          <View style={styles.accent} />
        </LinearGradient>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Spacer for sticky title */}
        <View style={styles.titleSpacer} />
        
        {/* Standout Profiles Section - Can scroll away */}
        <View style={styles.standoutsSection}>
          <LinearGradient
            colors={['rgba(30, 30, 30, 0.9)', 'rgba(18, 18, 18, 0.8)']}
            style={styles.standoutsGradientBackground}
          >
            <FlatList
              data={standouts}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.standoutsList}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <StandoutAvatar standout={item} index={index} />
              )}
            />
          </LinearGradient>
        </View>
        
        {/* Conversations */}
        <View style={styles.conversationsContainer}>
          {conversations.map((conversation, index) => (
            <ConversationItem 
              key={conversation.id} 
              conversation={conversation} 
              index={index}
            />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  
  // Sticky Title Styles (INSYNC only)
  stickyTitle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  titleGradientBackground: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 224, 204, 0.1)',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FF595A',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 8,
  },
  accent: {
    width: 60,
    height: 4,
    backgroundColor: '#F4E0CC',
    borderRadius: 2,
  },

  // Scroll Container Styles
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  titleSpacer: {
    height: 80, // Height to account for sticky title
  },

  // Standouts Section (scrollable)
  standoutsSection: {
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  standoutsGradientBackground: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 224, 204, 0.1)',
  },
  standoutsList: {
    paddingHorizontal: 4,
    gap: 24,
  },
  standoutContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  standoutGradientRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    padding: 3,
    marginBottom: 12,
  },
  standoutInnerRing: {
    width: '100%',
    height: '100%',
    borderRadius: 41,
    padding: 2,
    backgroundColor: '#121212',
  },
  standoutAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 39,
  },
  standoutName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F4E0CC',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  newIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF595A',
    borderWidth: 3,
    borderColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newIndicatorPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F4E0CC',
  },

  // Conversations Styles
  conversationsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  conversationItem: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 224, 204, 0.1)',
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  conversationAvatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(245, 245, 245, 0.3)',
    padding: 2,
  },
  conversationAvatarRingActive: {
    borderColor: '#FF595A',
    borderWidth: 3,
  },
  conversationAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF595A',
    borderWidth: 2,
    borderColor: '#121212',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  senderName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F5F5F5',
  },
  senderNameUnread: {
    color: '#FF595A',
    fontFamily: 'Inter-Bold',
  },
  messageTime: {
    fontSize: 12,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
  lastMessage: {
    fontSize: 14,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    opacity: 0.8,
  },
  lastMessageUnread: {
    color: '#F4E0CC',
    fontFamily: 'Inter-Medium',
    opacity: 1,
  },

  // Chat Detail Styles
  chatHeader: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: Platform.OS === 'ios' ? 70 : 50,
    padding: 8,
  },
  chatAvatarContainer: {
    alignItems: 'center',
  },
  chatAvatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FF595A',
    padding: 4,
  },
  chatAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  chatContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  chatIntro: {
    fontSize: 14,
    color: '#F5F5F5',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 24,
  },
  messagesContainer: {
    flex: 1,
    gap: 16,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4E0CC',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  receivedMessageText: {
    fontSize: 16,
    color: '#121212',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  sentMessageText: {
    fontSize: 16,
    color: '#F5F5F5',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  inputContainer: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FF595A',
  },
  inputPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#F4E0CC',
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF595A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});