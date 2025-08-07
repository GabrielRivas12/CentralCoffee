import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import Boton from '../Components/Boton'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OfertasCard({ navigation, titulo, precio, oferta, ImagenOferta }) {
  return (
    <View style={styles.container}>
      <View style={styles.containerLista}>
        <View style={styles.containerListaImagen}>
          <Image
            source={{ uri: ImagenOferta }}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            resizeMode="cover"
          />
        </View>

        <View style={styles.tituloContainer}>
          <Text style={styles.Titulo}>{titulo}</Text>
        </View>

        <View style={styles.precioContainer}>
          <Text style={styles.precio}>{precio}</Text>
        </View>

        <View style={styles.containerListaB}>
          <Boton
            nombreB='Ver Info'
            ancho={80}
            alto={30}
            onPress={() => navigation.navigate('Informacion', { oferta })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  containerLista: {
    width: 370,
    height: 230,
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
    containerListaB: {
      marginLeft: 275,
      marginTop: 180,
      position: 'absolute',
    },
    containerListaImagen: {
      width: 355,
      height: 140,
      backgroundColor: '#999',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#999',
      bottom: 10
    },
    Titulo: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    tituloContainer: {
      width: '90%',
      bottom: 5,
      right: 8
    },
    precio: {
      fontSize: 12
    },
    precioContainer: {
      width: '50%',
      marginTop: 10,
      right: 80
    }
  });