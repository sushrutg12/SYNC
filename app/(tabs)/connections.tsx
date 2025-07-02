import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Platform,
  Dimensions
} from 'react-native';
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
import InsyncSection from '@/components/InsyncSection';

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
  const lastScrollY = useSharedValue(0);
  const isScrollingUp = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      isScrollingUp.value = currentScrollY < lastScrollY.value;
      lastScrollY.value = currentScrollY;
      scrollY.value = currentScrollY;
    },
  });

  // Animated style for the sticky INSYNC section
  const stickyHeaderStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, isScrollingUp.value ? 0 : -200],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
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
      {/* Sticky INSYNC Header Component */}
      <Animated.View style={[styles.stickyHeader, stickyHeaderStyle]}>
        <InsyncSection standouts={standouts} />
      </Animated.View>

      {/* Scrollable Conversations */}
      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.conversationsContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Spacer to account for sticky header */}
        <View style={styles.headerSpacer} />
        
        {conversations.map((conversation, index) => (
          <ConversationItem 
            key={conversation.id} 
            conversation={conversation} 
            index={index}
          />
        ))}
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
  
  // Sticky Header Styles
  stickyHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    zIndex: 1000,
  },

  // Scroll Container Styles
  scrollContainer: {
    flex: 1,
  },
  headerSpacer: {
    height: 200, // Height to account for sticky header
  },
  conversationsContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  conversationItem: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 20,
    marginBottom: 12,
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