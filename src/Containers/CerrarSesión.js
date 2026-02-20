import { signOut } from 'firebase/auth';
import { auth } from '../Services/Firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Logout = async () => {
  try {
    await signOut(auth);

    const isSignedIn = await GoogleSignin.isSignedIn();

    if (isSignedIn) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }

  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

export default Logout;
