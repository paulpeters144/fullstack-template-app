import { LinkingOptions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootNavigation = NativeStackNavigationProp<{
  Home: undefined;
  Details: undefined;
  App: {
    screen: string;
  };
  Welcome: undefined;
}>;

export const config = {
  screens: {
    Home: 'home',
    Details: 'details',
    Welcome: 'welcome',
    App: {
      initialRouteName: 'app/tabone',
      screens: {
        TabOne: 'app/tabone',
        TabTwo: 'app/tabtwo',
      },
    },
  },
};

export const linking: LinkingOptions<{
  Home: undefined;
  Details: undefined;
  Welcome: undefined;
  MainApp: {
    screen: {
      TabOne: undefined;
      TabTwo: undefined;
    };
  };
}> = {
  prefixes: ['http://localhost:8081'],
  config,
};
