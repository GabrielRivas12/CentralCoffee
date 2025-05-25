import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Boton from '../../Components/Boton'

export default function DetallesOferta({navigation}){
    return (
       <View style={styles.container}>

            <Text> esta es la info del mapa </Text>

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
  });