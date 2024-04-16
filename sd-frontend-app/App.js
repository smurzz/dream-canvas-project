import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler'
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from './src/core/theme';
import { isTokenExpired } from './src/utils/isAuth';
import { Start, Login, Register, Help, Generate } from './src/screens';
import HomeBottomTabs from './src/components/HomeBottomTabs';

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
          initialRouteName={tokenExpired ? 'Start' : 'DreamCanvas'}
          screenOptions={{
          }}
        >
          <Stack.Screen name="Start" options={{headerShown: false}} component={Start} />
          <Stack.Screen name="Login" options={{headerShown: false}} component={Login} />
          <Stack.Screen name="Register" options={{headerShown: false}} component={Register} />
          <Stack.Screen name="DreamCanvas" component={HomeBottomTabs} />
          <Stack.Screen name="Generate" component={Generate} />
          <Stack.Screen name="Help" component={Help} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
