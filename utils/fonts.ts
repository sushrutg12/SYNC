import { Platform } from 'react-native';

// Font utility functions for consistent font usage across the app
export const getFontFamily = (type: 'logo' | 'subtitle' | 'regular') => {
  if (Platform.OS === 'web') {
    switch (type) {
      case 'logo':
        return 'Sztos Variable, sans-serif';
      case 'subtitle':
        return 'Roc Grotesk Variable, sans-serif';
      case 'regular':
        return 'Roc Grotesk Variable, sans-serif';
      default:
        return 'Roc Grotesk Variable, sans-serif';
    }
  } else {
    // Fallback to Inter fonts for native platforms
    switch (type) {
      case 'logo':
        return 'Inter-Bold';
      case 'subtitle':
        return 'Inter-SemiBold';
      case 'regular':
        return 'Inter-Regular';
      default:
        return 'Inter-Regular';
    }
  }
};

export const getFontWeight = (type: 'logo' | 'subtitle' | 'regular') => {
  if (Platform.OS === 'web') {
    switch (type) {
      case 'logo':
        return '503';
      case 'subtitle':
        return '500';
      case 'regular':
        return '300';
      default:
        return '300';
    }
  } else {
    return 'normal';
  }
};

export const getFontVariationSettings = (type: 'logo' | 'subtitle' | 'regular') => {
  if (Platform.OS === 'web') {
    switch (type) {
      case 'logo':
        return "'wght' 503, 'wdth' 200";
      case 'subtitle':
        return "'wdth' 100, 'wght' 500";
      case 'regular':
        return "'wdth' 100, 'wght' 300";
      default:
        return "'wdth' 100, 'wght' 300";
    }
  } else {
    return undefined;
  }
};

// Helper function to get complete font style object
export const getFontStyle = (type: 'logo' | 'subtitle' | 'regular') => {
  const style: any = {
    fontFamily: getFontFamily(type),
  };

  if (Platform.OS === 'web') {
    style.fontWeight = getFontWeight(type);
    style.fontVariationSettings = getFontVariationSettings(type);
  }

  return style;
};