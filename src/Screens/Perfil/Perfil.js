import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Boton from '../../Components/Boton'

export default function Perfil({navigation}) {
  return (
    <View style={styles.container}>

      <Text> PerfilBanano </Text>
      
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