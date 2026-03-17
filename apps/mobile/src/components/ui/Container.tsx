import React from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  type ViewStyle, 
  type ScrollViewProps
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
  children: React.ReactNode;
  /** Use SafeAreaView padding (default: true) */
  safe?: boolean;
  /** Center content vertically (default: false) */
  centered?: boolean;
  /** Wrap in KeyboardAvoidingView (default: false) */
  keyboardAware?: boolean;
  /** Make content scrollable (default: false) */
  scrollable?: boolean;
  style?: ViewStyle;
  scrollViewProps?: ScrollViewProps;
}

/**
 * Screen-level wrapper providing consistent padding, safe area insets,
 * and robust keyboard + scrolling behaviors for complex forms.
 */
export function Container({
  children,
  safe = true,
  centered = false,
  keyboardAware = false,
  scrollable = false,
  style,
  scrollViewProps
}: ContainerProps) {
  const SafeAreaWrapper = safe ? SafeAreaView : View;
  
  // Conditionally wrap content in ScrollView
  const Content = scrollable ? (
    <ScrollView 
      contentContainerStyle={[styles.scrollGrow, centered && styles.centered]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flexGrow, centered && styles.centered]}>
      {children}
    </View>
  );

  // If KeyboardAware is needed, wrap the entire safe area boundary
  if (keyboardAware) {
    return (
      <SafeAreaWrapper style={[styles.container, style]}>
        <KeyboardAvoidingView
          style={styles.flexGrow}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {Content}
        </KeyboardAvoidingView>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={[styles.container, style]}>
      {Content}
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flexGrow: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollGrow: {
    flexGrow: 1,
    paddingHorizontal: 24,
    // Provide bottom padding so keyboard doesn't squish bottom inputs
    paddingBottom: 40,
  },
  centered: {
    justifyContent: 'center',
  },
});
