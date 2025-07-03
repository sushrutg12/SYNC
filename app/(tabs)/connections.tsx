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
  TextInput,
  KeyboardAvoidingView,
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
import { MessageCircle, Send, ArrowLeft, Phone, Video, MoveVertical as MoreVertical, Smile } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getFontStyle } from '@/utils/fonts';

const { width } = Dimensions.get('window');

interface Standout {
  id: string;
  name: string;
  avatar: string;
  isNew: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: boolean;
  isStandout: boolean;
  messages: Message[];
  isOnline?: boolean;
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
    isOnline: true,
    messages: [
      {
        id: '1',
        text: 'Hey! Thanks for connecting. I saw your work on the design system and I\'m really impressed.',
        timestamp: '10:30 AM',
        isOwn: false,
      },
      {
        id: '2',
        text: 'Thank you! I\'d love to learn more about your startup and see how we might collaborate.',
        timestamp: '10:32 AM',
        isOwn: true,
        status: 'read',
      },
      {
        id: '3',
        text: 'Absolutely! We\'re building a platform that connects entrepreneurs with the right talent. Your design expertise would be invaluable.',
        timestamp: '10:35 AM',
        isOwn: false,
      },
      {
        id: '4',
        text: 'That sounds fascinating! I\'d love to hear more about your vision and discuss potential collaboration opportunities.',
        timestamp: '10:38 AM',
        isOwn: true,
        status: 'read',
      },
      {
        id: '5',
        text: 'Thanks for connecting! Would love to discuss the design system project we talked about.',
        timestamp: '10:40 AM',
        isOwn: false,
      },
    ],
  },
  {
    id: '2',
    name: 'Alexander Rodriguez',
    lastMessage: 'The React architecture looks solid. Let\'s schedule a call to discuss implementation.',
    time: '1h',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    unread: true,
    isStandout: true,
    isOnline: false,
    messages: [
      {
        id: '1',
        text: 'Hi! I reviewed your technical proposal and I\'m impressed with the architecture.',
        timestamp: '9:15 AM',
        isOwn: false,
      },
      {
        id: '2',
        text: 'Thanks! I put a lot of thought into making it scalable and maintainable.',
        timestamp: '9:18 AM',
        isOwn: true,
        status: 'read',
      },
      {
        id: '3',
        text: 'The React architecture looks solid. Let\'s schedule a call to discuss implementation.',
        timestamp: '9:20 AM',
        isOwn: false,
      },
    ],
  },
  {
    id: '3',
    name: 'Priya Sharma',
    lastMessage: 'Great meeting you at the conference! Here\'s my portfolio link as promised.',
    time: '3h',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    unread: false,
    isStandout: true,
    isOnline: true,
    messages: [
      {
        id: '1',
        text: 'Great meeting you at the TechCrunch conference yesterday!',
        timestamp: 'Yesterday 4:30 PM',
        isOwn: false,
      },
      {
        id: '2',
        text: 'Likewise! Your presentation on growth marketing was incredible.',
        timestamp: 'Yesterday 4:32 PM',
        isOwn: true,
        status: 'read',
      },
      {
        id: '3',
        text: 'Great meeting you at the conference! Here\'s my portfolio link as promised.',
        timestamp: 'Yesterday 4:35 PM',
        isOwn: false,
      },
    ],
  },
  {
    id: '4',
    name: 'Marcus Johnson',
    lastMessage: 'The startup idea has real potential. Let\'s explore potential partnerships.',
    time: '1d',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    unread: false,
    isStandout: false,
    isOnline: false,
    messages: [
      {
        id: '1',
        text: 'I\'ve been thinking about our conversation regarding the fintech space.',
        timestamp: 'Yesterday 2:00 PM',
        isOwn: false,
      },
      {
        id: '2',
        text: 'Yes! I think there\'s a real opportunity to disrupt traditional banking.',
        timestamp: 'Yesterday 2:05 PM',
        isOwn: true,
        status: 'delivered',
      },
      {
        id: '3',
        text: 'The startup idea has real potential. Let\'s explore potential partnerships.',
        timestamp: 'Yesterday 2:10 PM',
        isOwn: false,
      },
    ],
  },
  {
    id: '5',
    name: 'Sarah Kim',
    lastMessage: 'Thanks for the introduction to the team at Google. Really appreciate it!',
    time: '2d',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    unread: false,
    isStandout: false,
    isOnline: true,
    messages: [
      {
        id: '1',
        text: 'Hey! Hope you\'re doing well.',
        timestamp: '2 days ago',
        isOwn: false,
      },
      {
        id: '2',
        text: 'Hi Sarah! All good here, how about you?',
        timestamp: '2 days ago',
        isOwn: true,
        status: 'read',
      },
      {
        id: '3',
        text: 'Thanks for the introduction to the team at Google. Really appreciate it!',
        timestamp: '2 days ago',
        isOwn: false,
      },
    ],
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

function ConversationItem({ conversation, index, onPress }: { 
  conversation: Conversation; 
  index: number; 
  onPress: () => void;
}) {
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
      <TouchableOpacity style={styles.conversationItem} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.conversationContent}>
          <View style={styles.avatarContainer}>
            <View style={[
              styles.conversationAvatarRing,
              (conversation.unread || conversation.isStandout) &&
                conversation.name !== 'Priya Sharma' && conversation.name !== 'Alexander Rodriguez' &&
                styles.conversationAvatarRingActive
            ]}>
              <Image source={{ uri: conversation.avatar }} style={styles.conversationAvatar} />
              {conversation.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            {conversation.unread && <View style={styles.unreadDot} />}
          </View>
          
          <View style={styles.messageContent}>
            <View style={styles.messageHeader}>
              <Text style={[
                styles.senderName,
                conversation.unread && styles.senderNameUnread,
                (conversation.name === 'Alexander Rodriguez' || conversation.name === 'Priya Sharma') && { color: '#F5F5F5', ...getFontStyle('subtitle') }
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

function MessageBubble({ message, isLast }: { message: Message; isLast: boolean }) {
  return (
    <View style={[
      styles.messageContainer,
      message.isOwn ? styles.ownMessageContainer : styles.otherMessageContainer,
      isLast && styles.lastMessage
    ]}>
      <View style={[
        styles.messageBubble,
        message.isOwn ? styles.ownMessage : styles.receivedMessage
      ]}>
        <Text style={[
          styles.messageText,
          message.isOwn ? styles.ownMessageText : styles.receivedMessageText
        ]}>
          {message.text}
        </Text>
      </View>
      <View style={[
        styles.messageInfo,
        message.isOwn ? styles.ownMessageInfo : styles.otherMessageInfo
      ]}>
        <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
        {message.isOwn && message.status && (
          <Text style={[
            styles.messageStatus,
            message.status === 'read' && styles.messageStatusRead
          ]}>
            {message.status}
          </Text>
        )}
      </View>
    </View>
  );
}

function ChatScreen({ conversation, onBack }: { 
  conversation: Conversation; 
  onBack: () => void; 
}) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(conversation.messages);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        status: 'sent',
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate message status updates
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'read' } : msg
        ));
      }, 3000);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.chatContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#F5F5F5" strokeWidth={2.5} />
        </TouchableOpacity>
        
        <View style={styles.chatHeaderInfo}>
          <View style={styles.chatAvatarContainer}>
            <Image source={{ uri: conversation.avatar }} style={styles.chatAvatar} />
            {conversation.isOnline && <View style={styles.chatOnlineIndicator} />}
          </View>
          <View style={styles.chatHeaderText}>
            <Text style={styles.chatHeaderName}>{conversation.name}</Text>
            <Text style={styles.chatHeaderStatus}>
              {conversation.isOnline ? 'Online' : 'Last seen recently'}
            </Text>
          </View>
        </View>

        <View style={styles.chatHeaderActions}>
          <TouchableOpacity style={styles.chatActionButton} activeOpacity={0.8}>
            <Phone size={20} color="#F5F5F5" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatActionButton} activeOpacity={0.8}>
            <Video size={20} color="#F5F5F5" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatActionButton} activeOpacity={0.8}>
            <MoreVertical size={20} color="#F5F5F5" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        style={styles.messagesScrollView}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chatIntroContainer}>
          <Text style={styles.chatIntro}>Your conversation with {conversation.name.split(' ')[0]} started here</Text>
        </View>
        
        {messages.map((message, index) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            isLast={index === messages.length - 1}
          />
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.emojiButton} activeOpacity={0.8}>
            <Smile size={20} color="#F4E0CC" strokeWidth={2} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#F4E0CC"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              newMessage.trim() && styles.sendButtonActive
            ]} 
            onPress={sendMessage}
            activeOpacity={0.8}
            disabled={!newMessage.trim()}
          >
            <Send size={18} color={newMessage.trim() ? "#F5F5F5" : "#666666"} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function ConnectionsScreen() {
  const { openChat } = useLocalSearchParams<{ openChat?: string }>();
  const [selectedChat, setSelectedChat] = useState<string | null>(openChat || null);
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  // Handle opening chat from URL parameter
  useEffect(() => {
    if (openChat) {
      setSelectedChat(openChat);
    }
  }, [openChat]);

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

  // Sticky header animation - only appears when scrolled past standouts
  const stickyHeaderAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [200, 250], // Start appearing after scrolling past standouts and INSYNC title
      [0, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  const handleBackToList = () => {
    setSelectedChat(null);
    // Clear the URL parameter by navigating to the connections tab without parameters
    router.replace('/connections');
  };

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  if (selectedConversation) {
    return (
      <ChatScreen 
        conversation={selectedConversation} 
        onBack={handleBackToList} 
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Sticky INSYNC Title - Only appears when scrolled */}
      <Animated.View style={[styles.stickyTitle, stickyHeaderAnimatedStyle]}>
        <LinearGradient
          colors={['rgba(30, 30, 30, 0.98)', 'rgba(18, 18, 18, 0.95)']}
          style={styles.titleGradientBackground}
        >
          <Text style={styles.stickyTitleText}>INSYNC</Text>
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
        {/* Top padding for status bar */}
        <View style={styles.topSpacer} />
        
        {/* Standout Profiles Section with INSYNC Title */}
        <View style={styles.standoutsSection}>
          <LinearGradient
            colors={['#D4B896', '#C9A876']} // Beautiful sandy gradient
            style={styles.standoutsGradientBackground}
          >
            <Text style={styles.standoutsTitle}>INSYNC</Text>
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
              onPress={() => setSelectedChat(conversation.id)}
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
  },
  
  // Sticky Title Styles (appears when scrolled)
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
  stickyTitleText: {
    fontSize: 20,
    ...getFontStyle('logo'),
    color: '#FF595A',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 8,
  },

  // Scroll Container Styles
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  topSpacer: {
    height: Platform.OS === 'ios' ? 50 : 30, // Status bar spacing
  },

  // Standouts Section with INSYNC title
  standoutsSection: {
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
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  standoutsTitle: {
    fontSize: 24,
    ...getFontStyle('logo'),
    color: '#2C1810', // Dark brown text on sandy background
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 24,
    textShadowColor: 'rgba(44, 24, 16, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    ...getFontStyle('regular'),
    color: '#2C1810', // Dark brown text on sandy background
    textAlign: 'center',
    letterSpacing: 0.5,
    fontWeight: '600',
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

  titleGradientBackground: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 224, 204, 0.1)',
  },
  accent: {
    width: 60,
    height: 4,
    backgroundColor: '#F4E0CC',
    borderRadius: 2,
  },

  // Conversations Styles
  conversationsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 20,
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
    position: 'relative',
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
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#121212',
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
    ...getFontStyle('subtitle'),
    color: '#F5F5F5',
  },
  senderNameUnread: {
    color: '#FF595A',
    ...getFontStyle('subtitle'),
  },
  messageTime: {
    fontSize: 12,
    color: '#F4E0CC',
    ...getFontStyle('regular'),
    opacity: 0.7,
  },
  lastMessage: {
    fontSize: 14,
    color: '#F4E0CC',
    ...getFontStyle('regular'),
    lineHeight: 20,
    opacity: 0.8,
  },
  lastMessageUnread: {
    color: '#F4E0CC',
    ...getFontStyle('regular'),
    opacity: 1,
  },

  // Chat Screen Styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 224, 204, 0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#1E1E1E',
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 16,
    ...getFontStyle('subtitle'),
    color: '#F5F5F5',
    marginBottom: 2,
  },
  chatHeaderStatus: {
    fontSize: 12,
    ...getFontStyle('regular'),
    color: '#F4E0CC',
    opacity: 0.7,
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(244, 224, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Messages Styles
  messagesScrollView: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  chatIntroContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chatIntro: {
    fontSize: 12,
    color: '#F4E0CC',
    ...getFontStyle('regular'),
    opacity: 0.6,
  },
  messageContainer: {
    marginBottom: 12,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  ownMessage: {
    backgroundColor: '#FF595A',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#F4E0CC',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    ...getFontStyle('regular'),
    lineHeight: 22,
  },
  ownMessageText: {
    color: '#F5F5F5',
  },
  receivedMessageText: {
    color: '#121212',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  ownMessageInfo: {
    justifyContent: 'flex-end',
  },
  otherMessageInfo: {
    justifyContent: 'flex-start',
  },
  messageTimestamp: {
    fontSize: 11,
    color: '#F4E0CC',
    ...getFontStyle('regular'),
    opacity: 0.6,
  },
  messageStatus: {
    fontSize: 11,
    color: '#F4E0CC',
    ...getFontStyle('regular'),
    opacity: 0.6,
  },
  messageStatusRead: {
    color: '#4CAF50',
  },

  // Input Styles
  inputContainer: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(244, 224, 204, 0.1)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#121212',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 224, 204, 0.2)',
    minHeight: 44,
  },
  emojiButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#F5F5F5',
    ...getFontStyle('regular'),
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(244, 224, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#FF595A',
  },
});