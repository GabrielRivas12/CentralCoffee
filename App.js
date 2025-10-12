import { StyleSheet, View, ActivityIndicator, Linking } from 'react-native';
import Navegacion from './Navegacion';
import { enableScreens } from 'react-native-screens';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/Services/Firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProveedorTema } from './src/Containers/TemaApp';
import NavTema from './src/Containers/NavTema';

enableScreens();

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [initialUrl, setInitialUrl] = useState(null);

  // Manejar Deep Links
  useEffect(() => {
    const handleDeepLink = (url) => {
      if (url && url.startsWith('centralcoffee://')) {
        console.log('Deep Link recibido en App:', url);
        setInitialUrl(url);
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  return (
    <ProveedorTema> 
      <NavTema />
      <SafeAreaProvider>
        {checkingAuth ? (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#ED6D4A" />
          </View>
        ) : (
          <Navegacion 
            user={user} 
            initialUrl={initialUrl}
          />
        )}
      </SafeAreaProvider>
    </ProveedorTema>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});