import { useTheme } from '@providers/theme.provider';
import { IThemeColors } from '@theme/Colors';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';

type LoadingSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ILoadingIndicatorProps {
  size?: LoadingSizes;
  fullscreen?: boolean;
  text?: string;
}

export const AppLoadingIndicator = ({
  size,
  fullscreen,
  text,
}: ILoadingIndicatorProps) => {
  const { color } = useTheme();
  const styles = createStyles(color);

  const getSize = (size: LoadingSizes): number => {
    switch (size) {
      case 'xs':
        return 30;
      case 'sm':
        return 40;
      case 'md':
        return 50;
      case 'lg':
        return 60;
      case 'xl':
        return 70;
      default:
        return 40;
    }
  };

  if (fullscreen) {
    return (
      <View style={[styles.container]}>
        <View style={[styles.smContainer]}>
          <ActivityIndicator size={getSize(size ?? 'md')} color="grey" />
          <Text style={[styles.text]}>{text}</Text>
        </View>
      </View>
    );
  }
  return <ActivityIndicator size={getSize(size ?? 'md')} color="grey" />;
};

const createStyles = (color: IThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: color.backdrop,
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    text: {
      marginTop: 10,
      color: color.text,
      fontSize: 16,
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
