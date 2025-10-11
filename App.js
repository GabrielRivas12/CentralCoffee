import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Linking } from 'react-native';
import Navegacion from './Navegacion';
import { enableScreens } from 'react-native-screens';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/Services/Firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProveedorTema } from './src/Containers/TemaApp';
import NavTema from './src/Containers/NavTema';
import { decode as atob } from 'base-64';

enableScreens();

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [initialUrl, setInitialUrl] = useState(null);

  // Manejar Deep Links
  useEffect(() => {
    const handleDeepLink = (url) => {
      if (url && url.startsWith('centralcoffee://')) {
        console.log('Deep Link recibido:', url);
        setInitialUrl(url);
        
        // También puedes procesarlo inmediatamente si necesitas
        processDeepLink(url);
      }
    };

    // Escuchar deep links cuando la app está en primer plano
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Manejar deep links cuando la app está en segundo plano o cerrada
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Función para procesar el deep link
  const processDeepLink = (url) => {
    try {
      // Ejemplo: centralcoffee://oferta/123?data=abc123
      const route = url.replace('centralcoffee://', '');
      const path = route.split('?')[0]; // "oferta/123"
      const queryParams = route.split('?')[1]; // "data=abc123"
      
      const pathParts = path.split('/');
      const screen = pathParts[0]; // "oferta"
      const offerId = pathParts[1]; // "123"
      
      if (screen === 'oferta') {
        // Extraer datos del parámetro data
        const params = new URLSearchParams(queryParams);
        const data = params.get('data');
        
        if (data) {
          // Decodificar los datos
          const jsonString = decodeURIComponent(atob(data));
          const ofertaData = JSON.parse(jsonString);
          
          console.log('Datos de la oferta recibidos:', ofertaData);
          
          // Aquí puedes guardar los datos en un contexto o estado global
          // para que Navegacion pueda acceder a ellos
          // Por ejemplo, usando AsyncStorage o un contexto
          saveOfertaData(ofertaData);
        }
      }
    } catch (error) {
      console.log('Error procesando deep link:', error);
    }
  };

  // Función para guardar los datos de la oferta (puedes usar AsyncStorage o un contexto)
  const saveOfertaData = async (ofertaData) => {
    try {
      // Opción 1: Usar AsyncStorage (necesitas importarlo)
      // await AsyncStorage.setItem('qrOfertaData', JSON.stringify(ofertaData));
      
      // Opción 2: Usar un estado global o contexto
      // Por ahora solo logueamos los datos
      console.log('Oferta guardada para navegación:', ofertaData);
    } catch (error) {
      console.log('Error guardando datos de oferta:', error);
    }
  };

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
            initialUrl={initialUrl} // Pasamos el deep link a Navegacion
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