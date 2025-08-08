import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ComboboxPickerDate(props) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.label}>Fecha de cosecha </Text>
        <TouchableOpacity style={styles.date}


          onPress={() => props.verMode('date')}>
          <Text
            style={[
              styles.textodate,
              { color: props.text === 'Ingrese la fecha' ? '#666' : '#000' }
            ]}
          >
            {props.text === '' ? 'Seleccione una fecha' : props.text}
          </Text>
        </TouchableOpacity>

        {props.show && (
          <DateTimePicker
            testID='dateTimePicker'
            value={props.date}
            mode={props.mode}
            is24Hour={true}
            display='default'
            onChange={props.onChange}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderRadius: 5,
    width: 350,
    borderColor: '#999',
    height: 52,
  },
  label: {
    marginLeft: 10,
    alignContent: 'left',
    fontWeight: 'bold',
    fontSize: 16,
    bottom: 35
  },
  date: {
    width: 160,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    bottom: 30,
  },
  textodate: {
    top: 15,
    left: 15,
    color: '#999'
  },
});