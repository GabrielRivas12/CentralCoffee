import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Boton from '../../Components/Boton'

export default function PerfilUsuario({ navigation }) {
  return (
    <View style={styles.container}>

      <Text> este es el perfil de PerfilUsuario </Text>
      <Boton
        nombreB='boton'
        onPress={() => navigation.navigate('Editar Informacion')}
        backgroundColor='#fff'
      />

      <Boton
        nombreB='boton'
        onPress={() => navigation.navigate('Mi Perfil')}
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