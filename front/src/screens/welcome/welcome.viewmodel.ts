import { useEffect, useState } from 'react';
import { ST } from '@shared/types';
import { validate } from '@shared/types/shared.validation';
import log from '@utils/app.logger';
import { userAccess } from '@access/user.access';
import { useAuth } from '@providers/auth.provider';
import { RootNavigation } from '@screens/navigation';
import { localStorage, LocalKey } from '@access/local.access';
import { tokenAccess } from '@access/token.access';

interface IWelcomeViewModelProps {
  navigation: RootNavigation;
}

export const WelcomeViewModel = ({ navigation }: IWelcomeViewModelProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [apiError, setApiError] = useState('');
  const auth = useAuth();

  useEffect(() => {
    _userActiveCheck();
  }, []);

  const login = async () => {
    try {
      const { result, model } = validate(ST.LoginSchema).on({ email, password });

      if (!result.success) {
        setEmailError(model.email);
        setPasswordError(model.password);
        return;
      }

      setEmailError('');
      setPasswordError('');
      setApiError('');
      setLoading(true);

      const { error, data } = await userAccess.login({ email, password });

      if (error) {
        setApiError(error);
      }

      if (!error) {
        auth.login();
        await localStorage.set(LocalKey.JWT, data.accessToken);
        navigation.navigate('App');
      }

      setLoading(false);
    } catch (error) {
      log.error('useWelcomeViewModel', error);
    }
    setLoading(false);
  };

  const _userActiveCheck = async () => {
    try {
      setLoading(true);
      const jwt = await localStorage.get(LocalKey.JWT);
      const { data } = await tokenAccess.active(jwt);
      if (data.active) {
        auth.login();
        navigation.navigate('App');
      }
    } catch (error) {
      log.error('Fetch error:', error);
    }
    setLoading(false);
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    login,
    loading,
    emailError,
    passwordError,
    apiError,
  };
};
