import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import { auth, appFirebase } from '../../Services/Firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IniciarLogin } from '../../Containers/IniciarSesion';
import { enviarRecuperacion, IniciarTemporizador } from '../../Containers/RecuperarCuenta';
import { usarTema } from '../../Containers/TemaApp';
import { getFirestore } from 'firebase/firestore';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const db = getFirestore(appFirebase);
WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation, setUser }) {
  const { modoOscuro } = usarTema();

  const [Correo, setCorreo] = useState('');
  const [Contraseña, setContraseña] = useState('');
  const [bloquearBoton, setBloquearBoton] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [correoReset, setCorreoReset] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '958973898936-i5fnl40c1kncf6a78907sr6ravesh82f.apps.googleusercontent.com',
    webClientId: '958973898936-2g5hhp09005j6q4d5pae890pv8of8lin.apps.googleusercontent.com',
  });

  // Manejar respuesta de Google
  useEffect(() => {
    console.log('📌 Google response:', response);
    if (response?.type === 'success') {
      handleGoogleSignIn(response);
    }
  }, [response]);

  const handleGoogleSignIn = async (response) => {
    console.log('🔥 handleGoogleSignIn called', response);
    try {
      setLoading(true);

      if (!response.authentication) {
        console.log('⚠️ No hay authentication en la respuesta');
        return;
      }

      console.log('🎯 idToken:', response.authentication.idToken);
      console.log('🎯 accessToken:', response.authentication.accessToken);

      const credential = GoogleAuthProvider.credential(
        response.authentication.idToken
      );

      const userCredential = await signInWithCredential(auth, credential);
      console.log('✅ userCredential:', userCredential);

      setUser(userCredential.user);
      console.log('✅ Sesión con Google exitosa:', userCredential.user.email);
    } catch (error) {
      console.error('❌ Error en Firebase:', error);
      alert('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    console.log('➡️ Iniciando Google Sign-In');
    try {
      await promptAsync();
    } catch (error) {
      console.log('❌ Error al iniciar Google Sign-In:', error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        modoOscuro ? styles.containerOscuro : styles.containerClaro,
      ]}
    >
      <StatusBar backgroundColor="#F1A89B" barStyle="light-content" />

      {/* BANNER FIJO - Altura fija */}
      <SafeAreaView style={styles.bannerSafeArea}>
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

      {/* CONTENIDO DESPLAZABLE */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.containerCuerpo}>

            <Text
              style={[
                styles.bienvenido,
                modoOscuro ? styles.labelOscuro : styles.labelClaro,
              ]}
            >
              ¡Bienvenido!
            </Text>
            <Text
              style={[
                styles.subtitulo,
                modoOscuro ? styles.labelOscuro : styles.labelClaro,
              ]}
            >
              Inicie sesión en su cuenta para continuar
            </Text>

            <View style={styles.containerInput}>
              <InputText
                NombreLabel="Correo"
                Valor={Correo}
                onchangetext={setCorreo}
                placeholder="Ingrese el correo"
              />

              <InputText
                NombreLabel="Contraseña"
                Valor={Contraseña}
                onchangetext={setContraseña}
                placeholder="Ingrese su contraseña"
                esPassword={true}
              />

              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.label}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <View style={styles.vboton}>
                <Boton
                  nombreB="Iniciar"
                  onPress={() => IniciarLogin(auth, Correo, Contraseña, setUser)}
                />
              </View>

              {/* Separador */}
              <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={[
                  styles.separatorText,
                  modoOscuro ? styles.separatorTextOscuro : styles.separatorTextClaro
                ]}>
                  O
                </Text>
                <View style={styles.separator} />
              </View>

              {/* Botón de Google */}
              <TouchableOpacity
                style={[
                  styles.googleBtn,
                  modoOscuro ? styles.googleBtnOscuro : styles.googleBtnClaro
                ]}
                onPress={signInWithGoogle}
                disabled={!request || loading}
              >
                <Image
                  source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                  style={styles.googleLogo}
                />
                <Text style={[
                  styles.googleText,
                  modoOscuro ? styles.googleTextOscuro : styles.googleTextClaro
                ]}>
                  {loading ? 'Cargando...' : 'Continuar con Google'}
                </Text>
              </TouchableOpacity>

              <Boton
                nombreB="Registrarse"
                onPress={() => navigation.navigate('Registro')}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal recuperar contraseña */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              modoOscuro ? styles.containerOscuro : styles.containerClaro,
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                modoOscuro ? styles.labelOscuro : styles.labelClaro,
              ]}
            >
              Recuperar contraseña
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                modoOscuro ? styles.modalInputOscuro : styles.modalInputClaro
              ]}
              placeholder="Ingresa tu correo"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correoReset}
              onChangeText={setCorreoReset}
              placeholderTextColor="#666"
            />
            <Boton
              nombreB={
                bloquearBoton ? `Espera ${tiempoRestante}s` : 'Enviar correo'
              }
              onPress={() =>
                enviarRecuperacion(auth, correoReset, () => {
                  setBloquearBoton(true);
                  IniciarTemporizador(setTiempoRestante, setBloquearBoton);
                  setModalVisible(false);
                  setCorreoReset('');
                })
              }
              ancho="270"
              deshabilitado={bloquearBoton}
            />

            <Boton
              nombreB="Cancelar"
              onPress={() => setModalVisible(false)}
              backgroundColor="#ccc"
              ancho="270"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  // Banner con altura fija
  bannerSafeArea: {
    backgroundColor: '#F1A89B',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBanner: {
    flex: 1,
    backgroundColor: '#F1A89B',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  containerClaro: { backgroundColor: '#fff' },
  containerOscuro: { backgroundColor: '#000' },
  containerCuerpo: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 500,
  },
  label: {
    color: '#ED6D4A',
    marginLeft: 180,
    paddingBottom: 20,
    paddingTop: 20,
  },
  labelClaro: {
    color: '#000'
  },
  labelOscuro: {
    color: '#eee'
  },
  vboton: { marginBottom: 5 },
  
  // Estilos para el botón de Google
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    borderWidth: 1,
  },
  googleBtnClaro: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  googleBtnOscuro: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  googleTextClaro: {
    color: '#000',
  },
  googleTextOscuro: {
    color: '#fff',
  },
  
  // Separador
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '80%',
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  separatorTextClaro: {
    color: '#666',
  },
  separatorTextOscuro: {
    color: '#999',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    marginBottom: 10
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalInputClaro: {
    borderColor: '#ccc',
    color: '#000',
  },
  modalInputOscuro: {
    borderColor: '#555',
    color: '#fff',
    backgroundColor: '#333',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  bannerTexto: {
    color: 'white',
    fontSize: 23,
    fontWeight: '700',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textShadowRadius: 3,
    letterSpacing: 0.5,
    marginTop: 30,
  },
  logoContainer: {
    width: 200,
    height: 200,
    overflow: 'hidden',
    marginBottom: 20,
  },
  bannerLogo: {
    width: 230,
    height: 230
  },
  bienvenido: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 16,
    color: '#888',
    alignSelf: 'center',
    marginBottom: 20,
  },
  containerInput: {
    width: '100%',
    alignItems: 'center',
  },
});