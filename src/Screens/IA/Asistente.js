import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usarTema } from '../../Containers/TemaApp';

export default function Asistente({ navigation }) {
  const { modoOscuro } = usarTema();
  return (
    <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>

        <Text style={[
          styles.label, modoOscuro ? styles.labelOscuro : styles.labelClaro
        ]}> estas es la IA </Text>

      </SafeAreaView>
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
  containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
  },
    labelClaro: {
    color: '#000',
  },
  labelOscuro: {
    color: '#eee',
  },

});