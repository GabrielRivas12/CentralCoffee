// src/Screens/EditarInformacion.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

import * as FileSystem from 'expo-file-system';
import { decode as atob } from 'base-64';
import { supabase } from '../../Services/SupaBase'; // Asegúrate que esté bien el path

import appFirebase from '../../Services/Firebase';
import Boton from '../../Components/Boton';
import InputText from '../../Components/TextInput';
import { SeleccionarImagen } from '../../Containers/SeleccionarImagen';

export default function EditarInformacion({ navigation }) {
  const auth = getAuth(appFirebase);
  const db = getFirestore(appFirebase);
  const user = auth.currentUser;

  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [fotoPortada, setFotoPortada] = useState('');

  // 🔁 Cargar datos existentes del usuario
  const cargarDatos = async () => {
    try {
      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setNombre(data.nombre || '');
        setRol(data.rol || '');
        setDescripcion(data.descripcion || '');
        setUbicacion(data.ubicacion || '');
        setFotoPerfil(data.fotoPerfil || '');
        setFotoPortada(data.fotoPortada || '');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  useEffect(() => {
    if (user) cargarDatos();
  }, [user]);

  // 📤 Método local para subir imagen a Supabase
  const subirImagenASupabase = async (uri, bucketPath) => {
    try {
      if (!uri) return null;

      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      if (!base64) return null;

      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const fileExt = (uri.split('.').pop() || 'png').toLowerCase();
      const validExtensions = ['png', 'jpg', 'jpeg', 'webp'];
      const ext = validExtensions.includes(fileExt) ? fileExt : 'png';

      const fileName = `${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from(bucketPath)
        .upload(fileName, bytes, {
          contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          upsert: false,
        });

      if (error) {
        console.error('Error al subir imagen:', error);
        return null;
      }

      const { data } = supabase.storage.from(bucketPath).getPublicUrl(fileName);
      return data?.publicUrl || null;
    } catch (e) {
      console.error('Error en subirImagenASupabase:', e);
      return null;
    }
  };

  // 📸 Seleccionar y subir imagen de perfil
  const seleccionarImagenPerfil = async () => {
    const uri = await SeleccionarImagen();
    if (uri) {
      const url = await subirImagenASupabase(uri, 'fotosperfil');
      if (url) setFotoPerfil(url);
    }
  };

  // 🖼️ Seleccionar y subir imagen de portada
  const seleccionarImagenPortada = async () => {
    const uri = await SeleccionarImagen();
    if (uri) {
      const url = await subirImagenASupabase(uri, 'fotoportada');
      if (url) setFotoPortada(url);
    }
  };

  // 💾 Guardar los cambios en Firestore
  const guardarCambios = async () => {
    try {
      await updateDoc(doc(db, 'usuarios', user.uid), {
        nombre,
        rol,
        descripcion,
        ubicacion,
        fotoPerfil,
        fotoPortada
      });
      Alert.alert('Éxito', 'Datos actualizados correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Imagen de portada */}
        <TouchableOpacity onPress={seleccionarImagenPortada} style={styles.imagenPortada}>
          {fotoPortada ? (
            <>
              <Image source={{ uri: fotoPortada }} style={styles.imagenPortada} />
              <Text style={styles.textoEncima}>Seleccionar portada</Text>
            </>
          ) : (
            <Text style={styles.textoImagen}>Seleccionar portada</Text>
          )}
        </TouchableOpacity>


        {/* Imagen de perfil */}
        <TouchableOpacity onPress={seleccionarImagenPerfil} style={styles.contenedorImagenPerfil}>
          {fotoPerfil ? (
            <>
              <Image source={{ uri: fotoPerfil }} style={styles.imagenPerfil} />
              <Text style={styles.textoEncimaPerfil}>Perfil</Text>
            </>
          ) : (
            <Text style={styles.textoImagen}>Perfil</Text>
          )}
        </TouchableOpacity>


        {/* Inputs */}
        <View style={{ marginTop: 60 }}>
          <InputText
            NombreLabel="Nombre"
            Valor={nombre}
            onchangetext={setNombre}
            placeholder="Ingresa tu nombre"
            ancho='100%'
          />

          <InputText
            NombreLabel="Descripción"
            Valor={descripcion}
            onchangetext={setDescripcion}
            placeholder="Cuéntanos sobre ti"
            maxCaracteres={300}
             ancho='100%'
          />

          <InputText
            NombreLabel="Ubicación"
            Valor={ubicacion}
            onchangetext={setUbicacion}
            placeholder="Ciudad o municipio"
             ancho='100%'
          />
        </View>

        <Boton nombreB="Guardar Cambios"  onPress={guardarCambios} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  imagenPortada: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenedorImagenPerfil: {
    position: 'absolute',
    top: 90,
    left: 18,
    zIndex: 10,
  },
  imagenPerfil: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 3,
    backgroundColor: '#999',
  },
  textoImagen: {
    color: '#444',
    fontSize: 14,
  },
  textoEncima: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center', // para android centrar verticalmente
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.4)', // opcional, para darle sombra oscura al texto y mejorar visibilidad
    zIndex: 10,
    borderRadius: 10,
  },
  textoEncimaPerfil: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 40, // para que coincida con borde redondeado de la imagen perfil
    zIndex: 10,
  },


});
