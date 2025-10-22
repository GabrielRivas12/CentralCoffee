import React, { useState, useEffect, useRef } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { decodificarDatosQR, validarDatosOferta } from './../../Containers/GenerarSubirQR'

export default function ScaneerOferta({ navigation }) {   
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const cameraRef = useRef(null);
  
  const { width, height } = Dimensions.get('window');
  const cameraSize = Math.min(width, height) * 0.8;

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // Manejar el ciclo de vida de la cámara
  useFocusEffect(
    React.useCallback(() => {
      // Cuando la pantalla gana foco, activar la cámara
      setIsCameraActive(true);
      setScanned(false);
      setLoading(false);

      return () => {
        // Cuando la pantalla pierde foco, desactivar la cámara
        setIsCameraActive(false);
      };
    }, [])
  );

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || loading) return;
    
    setScanned(true);
    setLoading(true);
    
    try {
      const decodedData = decodificarDatosQR(data);
      
      if (decodedData && validarDatosOferta(decodedData)) {
        console.log('Datos decodificados del QR:', decodedData);
        
        setScanned(false);
        setLoading(false);
        
        navigation.navigate('Informacion', { 
          oferta: decodedData,
          fromQR: true 
        });
        
      } else {
        Alert.alert(
          'QR Inválido',
          'El código QR no contiene datos válidos de oferta',
          [{ text: 'OK' }]
        );
        setScanned(false);
        setLoading(false);
      }
    } catch (error) {
      console.log('Error procesando QR:', error);
      Alert.alert(
        'Error',
        'No se pudo leer el código QR',
        [{ text: 'OK' }]
      );
      setScanned(false);
      setLoading(false);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setLoading(false);
    // Forzar reinicio de la cámara
    if (cameraRef.current) {
      setIsCameraActive(false);
      setTimeout(() => setIsCameraActive(true), 100);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escanear Código QR de Oferta</Text>
      
      <View style={styles.cameraContainer}>
        {isCameraActive ? (
          <CameraView
            ref={cameraRef}
            style={[styles.camera, { width: cameraSize, height: cameraSize }]}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.cameraFrame}>
                <View style={styles.frame} />
                
                {loading && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#ED6D4A" />
                    <Text style={styles.loadingText}>Procesando QR...</Text>
                  </View>
                )}
              </View>
            </View>
          </CameraView>
        ) : (
          <View style={[styles.camera, { width: cameraSize, height: cameraSize, backgroundColor: '#000' }]}>
            <Text style={styles.cameraOffText}>Cámara reiniciando...</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Text style={styles.instructions}>
          Enfoca el código QR de una oferta para escanear
        </Text>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  cameraContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  camera: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFrame: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: '#ED6D4A',
    borderRadius: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: '90%',
    height: '90%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  cameraOffText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: '50%',
  },
  controls: {
    alignItems: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#ED6D4A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});