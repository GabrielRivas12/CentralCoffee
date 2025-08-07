// Containers/LugarUtils.js
import { Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';
import { getAuth } from 'firebase/auth';


const db = getFirestore(appFirebase);

export const GuardarMarcador = async (coord, nombre, descripcion, horario, navigation) => {
  try {
    if (!coord) {
      Alert.alert('Error', 'No se recibió la ubicación.');
      return;
    }

     const auth = getAuth();      // Obtienes el auth
    const user = auth.currentUser;  // Obtienes el usuario

    await addDoc(collection(db, 'lugares'), {
      nombre,
      descripcion,
      horario,
      latitud: coord.latitude,
      longitud: coord.longitude,
      userId: user.uid,
    });

    Alert.alert('Éxito', 'Lugar creado correctamente.');
    navigation.goBack();

  } catch (error) {
    console.error('Error al crear documento: ', error);
    Alert.alert('Error', 'No se pudo crear el lugar.');
  }
};
