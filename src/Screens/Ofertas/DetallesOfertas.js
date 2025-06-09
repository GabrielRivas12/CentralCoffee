import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Boton from '../../Components/Boton'

export default function DetallesOferta({navigation}){
    return (
       <View style={styles.container}>

           

       <View style={styles.containerListaImagen}>
      
      
              </View>
 <Text> Titulo </Text>

            <View style={styles.containerInformacion}> 
              


              <Text style={styles.TextoInfo}> Caracteristicas </Text>
              <Text style={styles.TextoInfo}> Tipo de café: </Text>
              <Text style={styles.TextoInfo}> Variedad: </Text>
              <Text style={styles.TextoInfo}> Estado del grano: </Text>
              <Text style={styles.TextoInfo}> Clima: </Text>
              <Text style={styles.TextoInfo}> Altura: </Text>
              <Text style={styles.TextoInfo}> Proceso de corte: </Text>
              <Text style={styles.TextoInfo}> Fecha de cosecha: </Text>
              <Text style={styles.TextoInfo}> Cantidad de produccion: </Text>
              <Text style={styles.TextoInfo}> Oferta por libra: </Text>
            </View>

       </View>
        
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    containerInformacion:{
      backgroundColor: '#EBEBEB',
      width: 373,
      height: 300,
      borderRadius: 10,
      marginLeft: 10

    },
    TextoInfo:{
      marginTop: 10,
      fontSize: 13,
      fontWeight: 'bold',
      marginLeft:  10
    },
      containerListaImagen: {
    width: 370,
    height: 140,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10
      }
  });