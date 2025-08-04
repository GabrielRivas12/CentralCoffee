import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfertasCard from '../../Components/OfertasCard';
import { useFocusEffect } from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';

import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { decode as atob } from 'base-64';
import * as MediaLibrary from 'expo-media-library';

import { supabase } from '../../Services/SupaBase';
import appFirebase from '../../Services/Firebase';
import { getAuth } from 'firebase/auth';
const auth = getAuth(appFirebase);
import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc, where
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function QRLista({ navigation }) {

  const [Ofertass, setOfertass] = useState([]);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrRender, setQrRender] = useState(null);


  useFocusEffect(
    React.useCallback(() => {
      LeerDatos();
    }, [])
  );


  const LeerDatos = async () => {
    const user = auth.currentUser;
    if (!user) {
      setOfertass([]);
      return;
    }

    const q = query(
      collection(db, "oferta"),
      where("userId", "==", user.uid) // 🔍 Solo las ofertas del usuario actual
    );

    const querySnapshot = await getDocs(q);
    const d = [];
    querySnapshot.forEach((doc) => {
      const datosBD = doc.data();
      d.push({ id: doc.id, ...datosBD });
    });
    setOfertass(d);
  };

  // Verificar si ya existe en Supabase
  const generarYSubirQR = async (oferta) => {
    const nombreQR = `${oferta.id}.png`;

    // Verificar si ya existe el QR en Supabase
    const { data: existingFile } = await supabase
      .storage
      .from('qr')
      .list('', { search: nombreQR });

    if (existingFile?.length > 0) {
      const { data: urlData } = supabase.storage.from('qr').getPublicUrl(nombreQR);
      setQrImageUrl(urlData.publicUrl);
      setModalVisible(true);
      return;
    }

    // --- Crear QR invisible en un contenedor temporal ---
    const fullQRData = {
      id: oferta.id,
      titulo: oferta.Ntitulo,
      tipoCafe: oferta.NtipoCafe,
      variedad: oferta.Nvariedad,
      estadoGrano: oferta.NestadoGrano,
      clima: oferta.Nclima,
      altura: oferta.Naltura,
      procesoCorte: oferta.NprocesoCorte,
      fechaCosecha: oferta.NfechaCosecha,
      cantidadProduccion: oferta.NcantidadProduccion,
      ofertaLibra: oferta.NofertaLibra,
      imagen: oferta.Nimagen,
    };

    const qrJson = JSON.stringify(fullQRData);
    const tempRef = React.createRef();

    // Crear una promesa para esperar la renderización
    const onRendered = async () => {
      try {
        const uri = await captureRef(tempRef.current, {
          format: 'png',
          quality: 1,
        });
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const { error: uploadError } = await supabase.storage
          .from('qr')
          .upload(nombreQR, bytes, {
            contentType: 'image/png',
            upsert: false,
          });

        if (uploadError) {
          console.log('Error subiendo imagen:', uploadError);
          return;
        }

        const { data: urlData } = supabase.storage.from('qr').getPublicUrl(nombreQR);
        setQrImageUrl(urlData.publicUrl);
        setModalVisible(true);
        setQrRender(null); // Limpia el render temporal una vez hecho

      } catch (err) {
        console.log('Error al capturar y subir QR:', err);
      }
    };


    // Render temporalmente fuera del árbol principal
    const TempQRRenderer = () => {
      useEffect(() => {
        onRendered(); // Ejecuta captura y subida una vez montado
      }, []);

      return (
        <View ref={tempRef} collapsable={false} style={{ position: 'absolute', top: -1000, left: -1000 }}>
          <QRCode value={qrJson} size={200} />
        </View>
      );
    };

    // Forzar renderizado temporal del QR dentro del componente principal
    setQrRender(<TempQRRenderer />);
  };

  // Función para descargar la imagen y guardarla en la galería del dispositivo
  const descargarImagen = async () => {
    if (!qrImageUrl) return;

    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Se necesita permiso para guardar imágenes en el dispositivo');
        return;
      }

      // Descargar archivo a cache local
      const fileUri = FileSystem.cacheDirectory + 'qr_code.png';
      const downloadResult = await FileSystem.downloadAsync(qrImageUrl, fileUri);

      // Guardar en galería
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('QR Codes', asset, false);

      alert('Imagen descargada y guardada en galería');
    } catch (error) {
      console.log('Error descargando imagen:', error);
      alert('Error descargando la imagen');
    }
  };

  return (
    <View style={styles.container}>
      <Text> Lista de QR </Text>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, alignItems: 'center' }}>

        <Text style={styles.Titulo}> Mis ofertas </Text>

        <ScrollView style={styles.containerCard} showsVerticalScrollIndicator={false} >
          {Ofertass.map((item, index) => (
            <View key={index} >
              <OfertasCard
                ImagenOferta={item.Nimagen}
                oferta={item}
                titulo={item.Ntitulo}
                precio={`Precio: C$${item.NofertaLibra} por libra`}
                navigation={navigation}
              />
              <TouchableOpacity
                onPress={() => generarYSubirQR(item)}
                style={styles.botonCrearQR}>
                <Ionicons name="qr-code-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))}

        </ScrollView>
        {qrRender}

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Código QR generado</Text>
              {qrImageUrl && (
                <Image
                  source={{ uri: qrImageUrl }}
                  style={{ width: 200, height: 200 }}
                  resizeMode="contain"
                />
              )}
               <View style={{ flexDirection: 'row', marginTop: 15 }}>
            <TouchableOpacity
              onPress={descargarImagen}
              style={[styles.modalButton, { marginRight: 10, backgroundColor: '#28a745' }]}
            >
              <Text style={styles.modalButtonText}>Descargar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCrearQR: {
    position: 'absolute',
    top: 205,
    right: 110
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});