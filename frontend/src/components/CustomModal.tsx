import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native';
import { Brand } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose, children }) => {
  const { theme, isDarkMode } = useTheme();
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <View style={[styles.handle, { backgroundColor: theme.border }]} />
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)', // Darker Slate overlay
    justifyContent: 'flex-end', // Slide from bottom feel
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: Brand.slate200,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 24,
    minHeight: SCREEN_HEIGHT * 0.4,
    maxHeight: SCREEN_HEIGHT * 0.9,
    ...Platform.select({
      web: {
        marginBottom: 20,
        borderRadius: 32,
        width: '90%',
      }
    })
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: Brand.slate300,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  }
});
