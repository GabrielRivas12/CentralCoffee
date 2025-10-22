import { Alert } from 'react-native';
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const IniciarLogin = async (auth, email, password, setUser, navigation) => {
  if (!email || !password) {
    Alert.alert('Campos incompletos', 'Por favor ingresa tu correo y contraseña');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;

    // 🔥 VERIFICACIÓN DOBLE - Forzar cierre de sesión inmediato si no está verificado
    if (!user.emailVerified) {
      console.log('Usuario no verificado, forzando cierre de sesión...');
      
      // Cerrar sesión inmediatamente
      await signOut(auth);
      
      // Esperar un momento para asegurar que se cerró la sesión
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar nuevamente el estado de autenticación
      if (auth.currentUser) {
        // Si todavía hay usuario autenticado, forzar otro cierre
        await signOut(auth);
      }

      Alert.alert(
        'Verificación requerida',
        'Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.',
        [
          {
            text: 'Reenviar correo',
            onPress: async () => {
              try {
                // Volver a autenticar temporalmente para reenviar
                const tempCredential = await signInWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(tempCredential.user);
                await signOut(auth);
                
                Alert.alert(
                  'Correo enviado',
                  'Se ha reenviado el correo de verificación. Por favor verifica tu cuenta.'
                );
              } catch (reenvioError) {
                Alert.alert('Error', 'No se pudo reenviar el correo');
              }
            }
          },
          {
            text: 'Entendido',
            style: 'cancel',
            onPress: () => {
              if (setUser) setUser(null);
            }
          }
        ]
      );
      return;
    }

    // ✅ SOLO si pasa la verificación, continuar
    const docRef = doc(getFirestore(), 'usuarios', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = { uid, ...docSnap.data() };
      setUser(userData);
      
      if (navigation) {
        navigation.replace('DrawerPrincipal');
      }
    } else {
      Alert.alert('Error', 'Usuario no encontrado');
      await signOut(auth);
      if (setUser) setUser(null);
    }

  } catch (error) {
    console.log('Error en login:', error.code);
    
    let errorMessage = 'Correo o contraseña incorrectos';
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'El correo electrónico no es válido';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No existe una cuenta con este correo';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      default:
        errorMessage = error.message || 'Error al iniciar sesión';
    }
    
    Alert.alert('Error', errorMessage);
    if (setUser) setUser(null);
  }
};