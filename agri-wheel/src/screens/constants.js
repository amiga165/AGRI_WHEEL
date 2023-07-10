import { Dimensions, Platform } from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

export const CONTENT_SPACING = 15;




// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 20;

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select({
    android: Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
    ios: Dimensions.get('window').height,
})