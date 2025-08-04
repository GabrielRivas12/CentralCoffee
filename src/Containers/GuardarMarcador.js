// Containers/LugarUtils.js
import { Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);

export const GuardarMarcador = async (coord, nombre, descripcion, horario, navigation) => {
  try {
    if (!coord) {
      Alert.alert('Error', 'No se recibió la ubicación.');
      return;
    }

    await addDoc(collection(db, 'lugares'), {
      nombre,
      descripcion,
      horario,
      latitud: coord.latitude,
      longitud: coord.longitude,
      creadoEn: new Date(),
    });

    Alert.alert('Éxito', 'Lugar creado correctamente.');
    navigation.goBack();

  } catch (error) {
    console.error('Error al crear documento: ', error);
    Alert.alert('Error', 'No se pudo crear el lugar.');
  }
};
