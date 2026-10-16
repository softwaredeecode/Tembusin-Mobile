import Toast from 'react-native-toast-message';

export const showComingSoonToast = () => {
  Toast.show({
    type: 'info',
    text1: 'Coming Soon',
    text2: 'Fitur ini sedang kami siapkan 🚀',
    position: 'bottom',
    visibilityTime: 2000,
  });
};