import React, { useEffect } from 'react';
// import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './App/Router/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StatusBar } from 'react-native';
import { Colors } from './App/Theme/Colors';
import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './App/Redux/Reducers/index.js';
// import { loadFavorites } from './App/Redux/Reducers/Favorites.js';

const store = configureStore({
  reducer: rootReducer,
});

const App = () => {
  // useEffect(() => {
  //   SplashScreen.hide();
  //   store.dispatch(loadFavorites());
  // }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
          <AppNavigator />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
