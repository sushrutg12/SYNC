import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

interface Standout {
  id: string;
  name: string;
  avatar: string;
  isNew: boolean;
}

interface InsyncSectionProps {
  standouts: Standout[];
}

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

export default function InsyncSection({ standouts }: InsyncSectionProps) {
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, headerAnimatedStyle]}>
      <LinearGradient
        colors={['rgba(30, 30, 30, 0.98)', 'rgba(18, 18, 18, 0.95)']}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <Text style={styles.title}>INSYNC</Text>
          <View style={styles.accent} />
        </View>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  gradientBackground: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 224, 204, 0.1)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#F4E0CC',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 8,
  },
  accent: {
    width: 60,
    height: 4,
    backgroundColor: '#FF595A',
    borderRadius: 2,
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
});