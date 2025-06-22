import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import Boton from '../Components/Boton'


export default function OfertasCard({ navigation , titulo,precio, oferta, ImagenOferta}) {
  return (
    <View style={styles.container}>


      <View style={styles.containerLista}>

        <View style={styles.containerListaImagen}>
          <Image
          
            source={{uri: ImagenOferta}}
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
    width: 350,
    height: 230,
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginTop: 10,

  },
  containerListaB: {
    marginLeft: 250,
    marginTop: 180,
    position: 'absolute'
  },
  containerListaImagen: {
    width: 330,
    height: 140,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 1
  },
  Titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tituloContainer: {
  width: '90%',
  alignItems: 'flex-start',
  marginTop: 5
},
precio:{
  fontSize: 12
},
precioContainer: {
   alignItems: 'flex-start',
   width: '90%',
   marginTop: 10

}

});