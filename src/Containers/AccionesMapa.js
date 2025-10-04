// mapUtils.js
import { Alert } from 'react-native';

export const zoomIn = (region, setRegion) => {
  setRegion({
    ...region,
    latitudeDelta: region.latitudeDelta / 2,
    longitudeDelta: region.longitudeDelta / 2,
  });
};

export const zoomOut = (region, setRegion) => {
  setRegion({
    ...region,
    latitudeDelta: region.latitudeDelta * 2,
    longitudeDelta: region.longitudeDelta * 2,
  });
};

export const handleMapPress = (event, navigation, user) => {
  const { coordinate } = event.nativeEvent;

  if (user?.rol !== 'Comerciante') {
    // Si no es comerciante, no hace nada o muestra alerta
    Alert.alert('Acceso denegado', 'Solo los comerciantes pueden agregar marcadores.');
    return;
  }

  // Solo los comerciantes pueden registrar lugares
  Alert.alert(
    'Agregar lugar',
    '¿Deseas registrar un nuevo lugar aquí?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sí',
        onPress: () => {
          navigation.navigate('Crear Marcador', { coordinate });
        },
      },
    ],
    { cancelable: true }
  );
};


export const handleMarkerPress = (marker, setSelectedMarker) => {
  setSelectedMarker(marker);
};
