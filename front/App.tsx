import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';
import { RootNavigation, linking } from '@screens/navigation';

import { HomeScreen } from '@screens/home/home.screen';
import { WelcomeScreen } from '@screens/welcome/welcome.screen';
import { ThemeProvider } from '@providers/theme.provider';
import { appConfig } from '@utils/app.config';

import { useWindowSize } from './src/utils/window-size';
import { AuthProvider, useAuth } from '@providers/auth.provider';
import log from '@utils/app.logger';

function DetailsScreen({ navigation }: { navigation: RootNavigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to home screen"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

function TabOneScreen({ navigation }: { navigation: RootNavigation }) {
  const { isActive } = useAuth();
  if (!isActive) navigation.navigate('Welcome');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tab One Screen</Text>
      <Button
        title="Go to home screen"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

function TabTwoScreen({ navigation }: { navigation: RootNavigation }) {
  const { isActive } = useAuth();
  if (!isActive) navigation.navigate('Welcome');
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tab Two Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainApp() {
  const showTabs = useWindowSize().isDeskTop ? 'none' : undefined;
  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: { display: showTabs } }}>
      <Tab.Screen name="TabOne" component={TabOneScreen} />
      <Tab.Screen name="TabTwo" component={TabTwoScreen} />
    </Tab.Navigator>
  );
}

function EntryPoint() {
  log.info('appConfig', appConfig);
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen
              options={{ headerShown: false }}
              name="App"
              initialParams={{ screen: 'tabone' }}
              component={MainApp}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default EntryPoint;
