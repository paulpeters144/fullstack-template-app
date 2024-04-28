import { View, Button, Text } from 'react-native';

import { RootNavigation } from '../navigation';

export function HomeScreen({ navigation }: { navigation: RootNavigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Go to TabTwo"
          onPress={() => {
            navigation.navigate('App', { screen: 'TabTwo' });
          }}
        />
      </View>
    </View>
  );
}
