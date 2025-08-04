import appFirebase from "../Services/Firebase";
import { Alert } from 'react-native';
import {
    collection,
    getFirestore,
    query, doc,
    setDoc, getDocs, getDoc,
    deleteDoc, addDoc
} from 'firebase/firestore';

export const Guardar = async ({
  Titulo, TipoCafe, Variedad, EstadoGrano, Clima, Altura,
  ProcesoCorte, FechaCosecha, CantidadProduccion, OfertaLibra, imagen,
  ofertaEditar, auth, db, navigation, SubirImagenASupabase, Estado, setEstado

}) => {

    if (!Titulo || !TipoCafe || !Variedad || !EstadoGrano || !Clima || !Altura || !ProcesoCorte || !FechaCosecha || !CantidadProduccion || !OfertaLibra || !imagen.trim()) {
        Alert.alert("Error", "Todos los campos son obligatorios.");
        return;
    }

  let urlImagen = imagen;
  if (!imagen.startsWith('http')) {
    const subida = await SubirImagenASupabase(imagen);
    if (!subida) {
      Alert.alert("Error", "No se pudo subir la imagen.");
      return;
    }
    urlImagen = subida;
  }

    const user = auth.currentUser;  // Obtiene el usuario actual
    const userId = user ? user.uid : null; // Extrae el uid o null si no hay usuario

    const nuevaOferta = {
        Ntitulo: Titulo,
        NtipoCafe: TipoCafe,
        Nvariedad: Variedad,
        NestadoGrano: EstadoGrano,
        Nclima: Clima,
        Naltura: Altura,
        NprocesoCorte: ProcesoCorte,
        NfechaCosecha: FechaCosecha,
        NcantidadProduccion: CantidadProduccion,
        NofertaLibra: OfertaLibra,
        Nimagen: urlImagen,
        estado: Estado,
        userId: userId,
    };

    if (ofertaEditar?.id) {
        // Actualizar
        await setDoc(doc(db, 'oferta', ofertaEditar.id), nuevaOferta);
        Alert.alert('Actualizado', 'La oferta fue actualizada correctamente', [{ text: 'Aceptar', onPress: () => navigation.goBack() }]);
    } else {
        // Crear
        await addDoc(collection(db, 'oferta'), nuevaOferta);
        Alert.alert('Éxito', 'Oferta guardada correctamente', [{ text: 'Aceptar', onPress: () => navigation.goBack() }]);
    }
};