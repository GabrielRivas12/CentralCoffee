import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../Services/BasedeDatos/Firebase';

import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../Services/BasedeDatos/SupaBase';

import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer';

import OfertaFormulario from '../../Containers/OfertaFormulario';






import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc, addDoc
} from 'firebase/firestore';
import ComboboxPickerDate from '../../Components/PickerDate';



export default function CrearOferta({ navigation }) {

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
    setShow(Platform.OS === 'android'); // corregí Platform.android a Platform.OS y que oculte bien
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
      const fileExt = uri.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('file')
        .upload(fileName, decode(base64), {
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

    const urlImagen = await subirImagenASupabase(imagen);
    if (!urlImagen) {
      Alert.alert("Error", "No se pudo subir la imagen.");
      return;
    }

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
      Nimagen: urlImagen
    };

    await addDoc(collection(db, 'oferta'), nuevaOferta);
    Alert.alert('Éxito', 'Oferta guardada correctamente', [{ text: 'Aceptar', onPress: () => navigation.goBack() }]);
  };


  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#fff', flex: 1, width: 390 }}>

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
    backgroundColor: 'white',
  },
  containerImagen: {
    width: 350,
    height: 150,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999'

  },
  formContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  scrol: {
  },
  containerbb: {
  }


});