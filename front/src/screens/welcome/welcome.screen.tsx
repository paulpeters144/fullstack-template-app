import { View, Button, Text, TextInput, StyleSheet } from 'react-native';
import { WelcomeViewModel } from '@screens/welcome/welcome.viewmodel';
import { AppLoadingIndicator } from '@components/LoadingIndicator';
import { useTheme } from '@providers/theme.provider';
import { IThemeColors } from '@theme/Colors';
import { RootNavigation } from '@screens/navigation';

export function WelcomeScreen({ navigation }: { navigation: RootNavigation }) {
  const viewmodel = WelcomeViewModel({ navigation });
  const { color } = useTheme();
  const styles = createStyles(color);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {viewmodel.loading && (
        <AppLoadingIndicator fullscreen={true} text="Logging in" />
      )}
      <Text>Log in</Text>
      <View style={styles.container}>
        <TextInput
          style={{
            height: 40,
            width: '100%',
            borderColor: 'gray',
            borderWidth: 1,
            marginTop: 10,
          }}
          onChangeText={(text) => viewmodel.setEmail(text)}
          value={viewmodel.email}
          placeholder="Email"
        />
        {!!viewmodel.emailError && (
          <Text style={styles.errorText}>{viewmodel.emailError}</Text>
        )}
        <TextInput
          style={{
            height: 40,
            width: '100%',
            borderColor: 'gray',
            borderWidth: 1,
            marginTop: 10,
          }}
          onChangeText={(text) => viewmodel.setPassword(text)}
          value={viewmodel.password}
          placeholder="Password"
          secureTextEntry
        />
        {!!viewmodel.passwordError && (
          <Text style={styles.errorText}>{viewmodel.passwordError}</Text>
        )}
        <View style={{ marginTop: 15 }}>
          <Button title="Login" onPress={viewmodel.login} />
        </View>
        <Text
          style={[styles.errorText, { marginTop: 10, marginHorizontal: 'auto' }]}
        >
          {viewmodel.apiError}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (color: IThemeColors) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 225,
    },
    errorText: {
      marginRight: 'auto',
      color: color.error,
      fontSize: 14,
    },
    smContainer: {
      padding: 20,
      minWidth: 100,
      minHeight: 100,
      borderRadius: 23,
      backgroundColor: color.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
