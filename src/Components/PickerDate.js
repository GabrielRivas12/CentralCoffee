import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ComboboxPickerDate(props) {



  return (
    <View style={styles.container}>
      <SafeAreaView edges={['left']} style={{ backgroundColor: '#fff', }}>
        <View style={styles.containerdate}>
          <Text style={styles.label}>Fecha de cosecha </Text>
          <TouchableOpacity style={styles.date} onPress={() => props.verMode('date')}>
            <Text style={styles.textodate}>{props.text}</Text>

          </TouchableOpacity>
        </View>

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
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#999',
    width: 350,
    borderColor: '#999',
    height: 52,
  },
  label: {
    marginLeft: 5,
    alignContent: 'left',
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    width: 170,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 10,
  },
  textodate: {
    top: 15,
    left: 5,
    color: '#999'
  },
  containerdate: {
  }
});