import React, { Component, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfertasCard from '../../Containers/OfertasCard';
import { useFocusEffect } from '@react-navigation/native';
import appFirebase from '../../Services/BasedeDatos/Firebase';
import Ionicons from '@expo/vector-icons/Ionicons';

import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';


import { supabase } from '../../Services/BasedeDatos/SupaBase';
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
  const qrRef = useRef();
  const [qrData, setQrData] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  // ✅ Incluye todos los campos que necesitas codificar
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

  setQrData({
    oferta,
    nombreQR,
    json: JSON.stringify(fullQRData), // ✅ Aquí va toda la info codificada en el QR
  });
};


  useEffect(() => {
    const capturarYSubir = async () => {
      if (!qrData || !qrRef.current) return;

      try {
        const uri = await captureRef(qrRef, {
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
          .upload(qrData.nombreQR, bytes, {
            contentType: 'image/png',
            upsert: false,
          });

        if (uploadError) {
          console.log('Error subiendo imagen:', uploadError);
          return;
        }

        const { data: urlData } = supabase.storage.from('qr').getPublicUrl(qrData.nombreQR);
        setQrImageUrl(urlData.publicUrl); // ✅ Guarda la URL para mostrar el QR
        setModalVisible(true); // ✅ Mostrar el modal
      } catch (err) {
        console.log('Error al capturar y subir QR:', err);
      } finally {
        setQrData(null); // Limpiar para evitar recapturas
      }
    };

    capturarYSubir();
  }, [qrData]);



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
{qrData && (
  <View
    ref={qrRef}
    collapsable={false}
    style={{ position: 'absolute', top: -9999, left: -9999 }} // Oculto fuera de pantalla
  >
    <QRCode
      value={qrData.json}
      size={200}
    />
  </View>
)}
          <Modal
  visible={modalVisible}
  transparent={true}
  animationType="slide"
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
      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={styles.modalButton}
      >
        <Text style={styles.modalButtonText}>Cerrar</Text>
      </TouchableOpacity>
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