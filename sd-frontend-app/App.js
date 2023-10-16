import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler'
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from './src/core/theme';
import { isTokenExpired } from './src/utils/isAuth';

import { StartScreen, LoginScreen, RegisterScreen, HelpPage, Home } from './src/screens';
import BottomTabs from './src/components/BottomTabs';

const Stack = createStackNavigator();

if (__DEV__) {
  const ignoreWarns = ["VirtualizedLists should never be nested inside plain ScrollViews"];

  const errorWarn = global.console.error;
  global.console.error = (...arg) => {
    for (const error of ignoreWarns) {
      if (arg[0].startsWith(error)) {
        return;
      }
    }
    errorWarn(...arg);
  };
}

export default function App() {

  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    async function checkTokenExpiration() {
      try {
        const expired = await isTokenExpired();
        setTokenExpired(expired);
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    }

    checkTokenExpiration();
  }, []);

  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={tokenExpired ? 'StartScreen' : 'BottomTabs'}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="BottomTabs" component={BottomTabs} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="HelpPage" component={HelpPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
