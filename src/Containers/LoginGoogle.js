import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from './../Services/Firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

GoogleSignin.configure({
  webClientId: "958973898936-2g5hhp09005j6q4d5pae890pv8of8lin.apps.googleusercontent.com",
  offlineAccess: false,
}); 

export const loginWithGoogle = async (setUser, setLoading) => {
  try {
    setLoading?.(true);

    // Asegurarnos de que Play Services están disponibles
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Limpiamos sesión previa
    await GoogleSignin.signOut();

    // Iniciamos sesión con Google
    const userInfo = await GoogleSignin.signIn();

    // Obtenemos tokens
    const { idToken } = await GoogleSignin.getTokens();
    if (!idToken) throw new Error('No se recibió idToken de Google');

    // Creamos credencial de Firebase
    const googleCredential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, googleCredential);
    const user = userCredential.user;

    const db = getFirestore();
    const userDocRef = doc(db, 'usuarios', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Usuario ya registrado  devolvemos los datos existentes
      const userData = { uid: user.uid, ...userDoc.data() };
      setUser?.(userData);
      return userData;
    } else {
      // Usuario nuevo  devolvemos info básica de Google
      const fotoPerfil = user.photoURL || userInfo.user?.photo || null;

      const newUserData = {
        uid: user.uid,
        nombre: user.displayName || '',
        correo: user.email,
        fotoPerfil,
      };

      return newUserData;
    }

  } catch (error) {
    console.log('Error en login Google:', error);
    Alert.alert('Error', error.message || 'Error al iniciar sesión con Google');
    setUser?.(null);
    return null;
  } finally {
    setLoading?.(false);
  }
};