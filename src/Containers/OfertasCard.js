import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Boton from '../Components/Boton'

export default function OfertasCard({ navigation , titulo,precio}) {
  return (
    <View style={styles.container}>


      <View style={styles.containerLista}>

        <View style={styles.containerListaImagen}>


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
            onPress={() => navigation.navigate('Informacion')}
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
    marginTop: 20,

  },
  containerListaB: {
    marginLeft: 250,
    marginTop: 180,
    position: 'absolute'
  },
  containerListaImagen: {
    width: 330,
    height: 140,
    backgroundColor: 'black',
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
  width: '90%', // o 330 si querés fijo
  alignItems: 'flex-start',
  marginTop: 5
},
precio:{
  fontSize: 12
},
precioContainer: {
   alignItems: 'flex-start',
   width: '90%', // o 330 si querés fijo
   marginTop: 10

}

});