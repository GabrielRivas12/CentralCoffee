import { Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';



export const IniciarLogin = async (auth, email, password) => {
  if (!email || !password) {
    Alert.alert('Campos incompletos', 'Por favor ingresa tu correo y contraseña');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Aquí podrías navegar o esperar a que onAuthStateChanged se dispare
  } catch (error) {
    Alert.alert('Error', 'Correo o contraseña incorrectos');
  }
};