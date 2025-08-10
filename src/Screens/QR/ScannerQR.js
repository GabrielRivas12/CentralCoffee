import React from 'react';
import { View, StyleSheet } from 'react-native';
import Camera from 'expo-camera';

export default function ScannerQR() {
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
});
