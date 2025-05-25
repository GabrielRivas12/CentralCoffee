import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Boton from '../../Components/Boton'

export default function Ofertas({navigation}){
    return (
       <View style={styles.container}>

            <Text> estas son las ofertas </Text>
            <Boton
              nombreB='boton'
             onPress={() => navigation.navigate('Informacion')}
              backgroundColor = '#fff'
            />
            <Boton
              nombreB='boton'
              onPress={() => navigation.navigate('Crear')}
              backgroundColor = '#fff'
            />

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