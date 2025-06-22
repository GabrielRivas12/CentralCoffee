import { StyleSheet, Text, View } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../Services/BasedeDatos/Firebase';

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {

  const [Correo, setCorreo] = useState('');
  const [Contraseña, setContraseña] = useState('');

   const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '169700359408-pqtf47hussegff4dtbsf0kc61bh2lqj1.apps.googleusercontent.com',
    androidClientId: '169700359408-rk56fjne3kae2d8ji84pfuim66c837fv.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          navigation.navigate('DrawerNavigate');
        })
        .catch((error) => {
          console.error('Error al autenticar con Firebase:', error);
        });
    }
  }, [response]);



  return (
    <View style={styles.container}>

      <View style={styles.containerBanner}>

      </View>

      <View style={styles.containerCuerpo}>
        <Text style={styles.Titulo}>Login</Text>
        <Boton
          ColorBoton="#F8DBD7"
          nombreB='Google'
          ColorTexto='black'
          ancho={200}
          iconName=""
          iconColor="black"
          borderColor="#F8DBD7"
          iconSize={24}
          onPress={() => promptAsync().catch((error) => console.error('Error al iniciar sesión con Google:', error))} // << AQUI

        />

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
    alignItems: 'center'
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
  }

});