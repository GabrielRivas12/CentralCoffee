import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Alert, Modal, TextInput } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, appFirebase } from '../../Services/BasedeDatos/Firebase'; // importa auth y appFirebase
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getFirestore,
  doc,
  getDoc
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {

  const [Correo, setCorreo] = useState('');
  const [Contraseña, setContraseña] = useState('');

  const [bloquearBoton, setBloquearBoton] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [correoReset, setCorreoReset] = useState('');



  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '958973898936-1qq10di6u0uf71ju0acsraeli5rmhdhk.apps.googleusercontent.com',       // solo este es necesario
    androidClientId: '373897650374-3jtsm00ovu83o7l25gkjl2q5hpkpfek2.apps.googleusercontent.com'
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      const { idToken, accessToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      signInWithCredential(auth, credential)
        .then(() => navigation.navigate('DrawerNavigate'))
        .catch(err => {
          console.error('Firebase signIn error:', err);
          // Aquí puedes mostrar un alert o mensaje de error al usuario
        });
    }
  }, [response]);


const handleLogin = async () => {
    if (!Correo || !Contraseña) {
      Alert.alert('Campos incompletos', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, Correo, Contraseña);
      // Espera que onAuthStateChanged cambie el estado
    } catch (error) {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
    }
  };


 


  const enviarRecuperacion = async () => {
    if (!correoReset) {
      Alert.alert('Error', 'Por favor ingresa tu correo.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, correoReset);
      Alert.alert('Revisa tu correo', 'Te enviamos un enlace para restablecer tu contraseña.');

      // Solo si el envío fue exitoso, bloquea y cuenta
      setBloquearBoton(true);
      iniciarTemporizador();

      // Puedes cerrar el modal y limpiar el correo si quieres
      setModalVisible(false);
      setCorreoReset('');

    } catch (error) {
      console.error('Error enviando recuperación:', error);
      Alert.alert('Error', 'No se pudo enviar el correo. Verifica que esté registrado.');
    }
  };


  const iniciarTemporizador = () => {
    setTiempoRestante(15);
    const interval = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setBloquearBoton(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };



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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.label}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.vboton}>
            <Boton
              nombreB='Iniciar'
              onPress={handleLogin}
            />

          </View>
          <Boton
            nombreB='Registrarse'
            onPress={() => navigation.navigate('Registro')}
          />
        </View>

      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Recuperar contraseña</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa tu correo"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correoReset}
              onChangeText={setCorreoReset}
            />
            <Boton
              nombreB={bloquearBoton ? `Espera ${tiempoRestante}s` : 'Enviar correo'}
              onPress={enviarRecuperacion}
              ancho='270'
              deshabilitado={bloquearBoton}
            />

            <Boton nombreB='Cancelar' onPress={() => setModalVisible(false)} backgroundColor="#ccc" ancho='270' />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },


});