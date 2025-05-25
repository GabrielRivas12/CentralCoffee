import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Boton from '../../Components/Boton'

export default function Mapa({navigation}) {
  return (
    <View style={styles.container}>

      <Text> este es el mapa </Text>
      <Boton
        nombreB='boton'
        onPress={() => navigation.navigate('Informacion')}
        backgroundColor='#fff'
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