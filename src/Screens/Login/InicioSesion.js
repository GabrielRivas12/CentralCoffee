import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import auth from '../../Services/BasedeDatos/Firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();
const redirectUri = "https://auth.expo.io/@gabrielr12/centralcoffee";

export default function Login({ navigation }) {

  const [Correo, setCorreo] = useState('');
  const [Contraseña, setContraseña] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '373897650374-v6bbka0uhdodss1itvm3re6bj2hs1lmt.apps.googleusercontent.com',
    androidClientId: '373897650374-3jtsm00ovu83o7l25gkjl2q5hpkpfek2.apps.googleusercontent.com',
    webClientId: '958973898936-1qq10di6u0uf71ju0acsraeli5rmhdhk.apps.googleusercontent.com',
    redirectUri,
    useProxy: true,
  });

  useEffect(() => {
    console.log(AuthSession.makeRedirectUri({ useProxy: true }));

    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(userCredential => {
          console.log('Autenticado con:', userCredential.user.email);
          navigation.navigate('DrawerNavigate');
        })
        .catch(err => {
          console.error('Error en Firexbase:', err);
        });
    }
  }, [response]);


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
      <SafeAreaView style={{ backgroundColor: '#ED6D4A', flex: 1, alignItems: 'center' }}>

        <View style={styles.containerBanner}>

        </View>
      </SafeAreaView>


      
      <View style={styles.containerCuerpo}>
        <Text style={styles.Titulo}>Login</Text>

        <TouchableOpacity style={styles.button} disabled={!request}
          onPress={() => promptAsync()}>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png?20230822192911',
            }}
            style={styles.logo}
          />
          <Text style={styles.text}>Sign in with Google</Text>
          <Text style={styles.text}></Text>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: '#ccc', width: 140, marginVertical: 30, alignSelf: 'flex-start', marginLeft: 25, }} />
        <Text style={{ position: 'absolute', marginVertical: 164 }}> O </Text>
        <View style={{ height: 1, backgroundColor: '#ccc', width: 140, marginVertical: 174, alignSelf: 'flex-end', position: 'absolute', marginRight: 20, }} />


        <View style={styles.containerInput}>
          <InputText
            NombreLabel='Correo'
            Valor={Correo}
            onchangetext={setCorreo}
            placeholder='Ingrese el correo'
          />
          <InputText
            NombreLabel='Contraseña'
            Valor={Contraseña}
            onchangetext={setContraseña}
            placeholder='Ingrese su contraseña'
          />
          <Text style={styles.label}>¿Olvidaste tu contraseña?</Text>

          <View style={styles.vboton}>
            <Boton
              nombreB='Iniciar'
              onPress={() => navigation.navigate('DrawerNavigate')}
            />
          </View>
          <Boton
            nombreB='Registrarse'
            onPress={() => navigation.navigate('Registro')}
          />


        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBanner: {
    flex: 1,
    backgroundColor: '#ED6D4A',
    justifyContent: 'center',
    alignItems: 'center'


  },
  containerCuerpo: {
    flex: 2.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  Titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingLeft: 230,
    paddingTop: 10,
    paddingBottom: 40
  },
  label: {
    color: '#ED6D4A',
    marginLeft: 180,
    paddingBottom: 20,
    paddingTop: 20
  },
  vboton: {
    marginBottom: 5
  },
  logo: {
    width: 20,
    height: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: 200,
    height: 50,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.39,
    shadowRadius: 5.30,
    elevation: 5,
  },

});