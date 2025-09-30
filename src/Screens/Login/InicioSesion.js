import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Modal, TextInput } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, appFirebase } from '../../Services/Firebase'; // importa auth y appFirebase
import { SafeAreaView } from 'react-native-safe-area-context';

import { IniciarLogin } from '../../Containers/IniciarSesion';
import { enviarRecuperacion, IniciarTemporizador } from '../../Containers/RecuperarCuenta';
import { usarTema } from '../../Containers/TemaApp';
import Imagen from '../../Components/Imagen';


import {
  getFirestore,
  doc,
  getDoc
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {

  const { modoOscuro } = usarTema();

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
        });
    }
  }, [response]);

  return (
    <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
      <StatusBar backgroundColor='#F1A89B' barStyle='light-content' />
      <SafeAreaView style={{ backgroundColor: '#F1A89B', flex: 1, alignItems: 'center' }}>
        <View style={styles.containerBanner}>
          <View style={styles.bannerContent}>
            <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo.png')}
               style={styles.bannerLogo}
            />
            </View>
            <Text style={styles.bannerTexto}>Donde el café une historias</Text>
          </View>
        </View>

      </SafeAreaView>
      <View style={styles.containerCuerpo}>

        <Text style={[styles.Titulo, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>Login</Text>

        <TouchableOpacity style={styles.button} disabled={!request}
          onPress={() => promptAsync()}>
          <Image
            source={require('../../../assets/Google_Icon.png')}
            style={styles.logo}
          />
          <Text style={styles.text}>Sign in with Google</Text>
          <Text style={styles.text}></Text>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: '#ccc', width: 140, marginVertical: 32, alignSelf: 'flex-start', marginLeft: 25, }} />
        <Text
          style={[
            styles.label,
            modoOscuro ? styles.labelOscuro : styles.labelClaro,
            { position: 'absolute', marginVertical: 145, marginLeft: 10 }
          ]}
        >
          O
        </Text>

        <View style={{ height: 1, backgroundColor: '#ccc', width: 140, marginVertical: 173, alignSelf: 'flex-end', position: 'absolute', marginRight: 20, }} />

        <View style={styles.containerInput}>
          <InputText
            NombreLabel='Correo'
            Valor={Correo}
            onchangetext={setCorreo}
            placeholder='Ingrese el correo' />

          <InputText
            NombreLabel='Contraseña'
            Valor={Contraseña}
            onchangetext={setContraseña}
            placeholder='Ingrese su contraseña'
            esPassword={true} />

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.label}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.vboton}>
            <Boton
              nombreB='Iniciar'
              onPress={() => IniciarLogin(auth, Correo, Contraseña)} />
          </View>

          <Boton
            nombreB='Registrarse'
            onPress={() => navigation.navigate('Registro')} />

        </View>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setModalVisible(false)}>

        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
            <Text style={[styles.modalTitle, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>Recuperar contraseña</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa tu correo"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correoReset}
              onChangeText={setCorreoReset}
              placeholderTextColor="#666"
            />
            <Boton
              nombreB={bloquearBoton ? `Espera ${tiempoRestante}s` : 'Enviar correo'}
              onPress={() =>
                enviarRecuperacion(auth, correoReset, () => {
                  setBloquearBoton(true);
                  IniciarTemporizador(setTiempoRestante, setBloquearBoton);
                  setModalVisible(false);
                  setCorreoReset('');
                })
              }
              ancho='270'
              deshabilitado={bloquearBoton} />

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
    backgroundColor: '#F1A89B',
    justifyContent: 'center',
    alignItems: 'center'


  },
  containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
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
  labelClaro: {
    color: '#000',
  },
  labelOscuro: {
    color: '#eee',
  },
  vboton: {
    marginBottom: 5
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
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
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '50%',
  },

  bannerTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },

  logoContainer: {
    width: 200,
    height: 200,
    overflow: 'hidden',
    marginLeft: 150
  },

  logoImagen: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },

 bannerLogo: {
  width: 200,
  height: 200,
}



});