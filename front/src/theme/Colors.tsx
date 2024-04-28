const tintColorLight = '#2f95dc';
// const tintColorDark = '#fff';

export interface IThemeColors {
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;
  background: string;
  surface: string;
  error: string;
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
  onError: string;
  text: string;
  disabled: string;
  placeholder: string;
  backdrop: string;
  tabIconDefault: string;
  tabIconSelected: string;
  tint: string;
}

export const lightColors: IThemeColors = {
  primary: '#6200EE',
  primaryVariant: '#3700B3',
  secondary: '#03DAC6',
  secondaryVariant: '#018786',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  onError: '#FFFFFF',
  text: '#000000',
  disabled: '#9E9E9E',
  placeholder: '#757575',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  tabIconDefault: '#ccc',
  tabIconSelected: '#6200EE',
  tint: tintColorLight,
};

export const darkColors: IThemeColors = {
  ...lightColors,
  primary: '#6200EE',
  tabIconSelected: '#6200EE',
  background: '#121212',
  surface: '#121212',
  onPrimary: '#FFFFFF',
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  text: '#FFFFFF',
  disabled: '#9E9E9E',
  placeholder: '#757575',
};
