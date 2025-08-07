import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ComboboxPickerDate(props) {
  return (
      <SafeAreaView style={{ backgroundColor: '#fff' }}>
          <Text style={styles.label}>Fecha de cosecha </Text>
          <TouchableOpacity style={[
            styles.date,
             { width: props.ancho || 350 },
             { height: props.alto || 50 },
          
          ]
          }
            
            
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
  );
}

const styles = StyleSheet.create({
  label: {
    marginLeft: 10,
    alignContent: 'left',
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 10,
  },
  textodate: {
    top: 15,
    left: 5,
    marginLeft: 5
  },

});