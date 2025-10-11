// qrService.js
import React, { useEffect } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { decode as atob, encode as btoa } from 'base-64';
import { supabase } from '../Services/SupaBase';

// Define las URLs
const WEB_APP_BASE_URL = 'https://tudominio.com/oferta';
const APP_SCHEME = 'centralcoffee';

export const generarYSubirQR = async (oferta, setQrRender, setQrImageUrl, setModalVisible) => {
  const nombreQR = `${oferta.id}.png`;

  // Verifica si ya existe
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

  // Preparar datos para el deep link
  const ofertaData = {
    id: oferta.id,
    titulo: oferta.titulo || '',
    tipoCafe: oferta.tipoCafe || '',
    variedad: oferta.variedad || '',
    estadoGrano: oferta.estadoGrano || '',
    clima: oferta.clima || '',
    altura: oferta.altura || '',
    procesoCorte: oferta.procesoCorte || '',
    fechaCosecha: oferta.fechaCosecha || '',
    cantidadProduccion: oferta.cantidadProduccion || '',
    ofertaLibra: oferta.ofertaLibra || '',
    imagen: oferta.imagen || '',
    lugarSeleccionado: oferta.lugarSeleccionado || '',
    userId: oferta.userId || ''
  };

  // SOLUCIÓN: Solo usar Base64, sin encodeURIComponent
  const jsonString = JSON.stringify(ofertaData);
  const compressedData = btoa(jsonString); // <- Quita encodeURIComponent

  // Crear deep link para la app
  const deepLink = `${APP_SCHEME}://oferta/${oferta.id}?data=${compressedData}`;

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
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
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
      setQrRender(null);
    } catch (err) {
      console.log('Error al capturar y subir QR:', err);
    }
  };

  const TempQRRenderer = () => {
    useEffect(() => {
      onRendered();
    }, []);

    return (
      <View ref={tempRef} collapsable={false} style={{ position: 'absolute', top: -1000, left: -1000 }}>
        <QRCode value={deepLink} size={200} />
      </View>
    );
  };

  setQrRender(<TempQRRenderer />);
};