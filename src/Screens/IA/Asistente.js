import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Boton from '../../Components/Boton'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Asistente({ navigation }) {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff', flex: 1, width: 390 }}>

        <Text> estas es la IA </Text>

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
});