import { View, Text, StyleSheet, ScrollView, Alert, Platform, StatusBar } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../Services/BasedeDatos/Firebase';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';

import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../Services/BasedeDatos/SupaBase';
import * as FileSystem from 'expo-file-system'
import OfertaFormulario from '../../Containers/OfertaFormulario';
import { decode as atob } from 'base-64';

const auth = getAuth(appFirebase);
import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc, addDoc
} from 'firebase/firestore';
import ComboboxPickerDate from '../../Components/PickerDate';



export default function CrearOferta({ navigation }) {

  const route = useRoute();
  const ofertaEditar = route.params?.oferta || null;

  const db = getFirestore(appFirebase);

  const [imagen, SetImagen] = useState('');
  const [Titulo, setTitulo] = useState('');
  const [TipoCafe, setTipoCafe] = useState('');
  const [Variedad, setVariedad] = useState('');
  const [EstadoGrano, setEstadoGrano] = useState('');
  const [Clima, setClima] = useState('');
  const [Altura, setAltura] = useState('');
  const [ProcesoCorte, setProcesoCorte] = useState('');
  const [FechaCosecha, setFechaCosecha] = useState('');
  const [CantidadProduccion, setCantidadProduccion] = useState('');
  const [OfertaLibra, setOfertaLibra] = useState('');
  const [Estado, setEstado] = useState('Activo');

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [text, setText] = useState('Ingrese la fecha');

  const verMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'android');
    setShow(false);
    setDate(currentDate);

    let temDate = new Date(currentDate);
    let fDate = temDate.getDate() + '/' + (temDate.getMonth() + 1) + '/' + temDate.getFullYear();
    setText(fDate)
    setFechaCosecha(fDate)
  }

  const handlePickImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      SetImagen(result.assets[0].uri);
    }
  };

  const subirImagenASupabase = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });

      // Convertir base64 string → Uint8Array (binario)
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const fileExt = uri.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('file')
        .upload(fileName, bytes, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) {
        console.log('Error subiendo imagen:', error);
        return null;
      }

      const { data: urlData } = supabase.storage.from('file').getPublicUrl(fileName);
      return urlData?.publicUrl || null;

    } catch (e) {
      console.log('Error en subirImagenASupabase:', e);
      return null;
    }
  };

  const guardar = async () => {
    if (!Titulo || !TipoCafe || !Variedad || !EstadoGrano || !Clima || !Altura || !ProcesoCorte || !FechaCosecha || !CantidadProduccion || !OfertaLibra || !imagen.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    let urlImagen = imagen;
    if (!imagen.startsWith('http')) {
      const subida = await subirImagenASupabase(imagen);
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

  useEffect(() => {
    if (ofertaEditar) {
      setTitulo(ofertaEditar.Ntitulo || '');
      setTipoCafe(ofertaEditar.NtipoCafe || '');
      setVariedad(ofertaEditar.Nvariedad || '');
      setEstadoGrano(ofertaEditar.NestadoGrano || '');
      setClima(ofertaEditar.Nclima || '');
      setAltura(ofertaEditar.Naltura || '');
      setProcesoCorte(ofertaEditar.NprocesoCorte || '');
      setFechaCosecha(ofertaEditar.NfechaCosecha || '');
      setText(ofertaEditar.NfechaCosecha || 'Ingrese la fecha');
      setCantidadProduccion(ofertaEditar.NcantidadProduccion || '');
      setOfertaLibra(ofertaEditar.NofertaLibra || '');
      SetImagen(ofertaEditar.Nimagen || '');
    }
  }, []);


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
      <SafeAreaView edges={['bottom, top']} style={{ flex: 1 }}>
        <OfertaFormulario
          imagen={imagen}
          onPickImage={handlePickImagen}
          Titulo={Titulo} setTitulo={setTitulo}
          TipoCafe={TipoCafe} setTipoCafe={setTipoCafe}
          Variedad={Variedad} setVariedad={setVariedad}
          EstadoGrano={EstadoGrano} setEstadoGrano={setEstadoGrano}
          Clima={Clima} setClima={setClima}
          Altura={Altura} setAltura={setAltura}
          ProcesoCorte={ProcesoCorte} setProcesoCorte={setProcesoCorte}
          FechaCosecha={FechaCosecha} setFechaCosecha={setFechaCosecha}
          CantidadProduccion={CantidadProduccion} setCantidadProduccion={setCantidadProduccion}
          OfertaLibra={OfertaLibra} setOfertaLibra={setOfertaLibra}
          onSubmit={guardar}
          date={date}
          show={show}
          mode={mode}
          text={text}
          verMode={verMode}
          onChange={onChange}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});