import 'react-native-gesture-handler';
import 'react-native-reanimated';

import React from 'react';
import AppNavigator from './App/Router/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './App/Redux/Reducers/index.js';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from './App/Theme/Colors';

const store = configureStore({
  reducer: rootReducer,
});

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
