import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';



export default function ComboBox(props) {
  return (
    <View style={styles.container}>
      
        <Text style={styles.label}>{props.NombrePicker}</Text>
        <View style={styles.picker}>
       <Picker
            style={styles.picker}
            selectedValue={props.value}
            onValueChange={props.onValuechange}
          >
             {props.items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}


          </Picker>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 5
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
    fontSize: 16,
    fontWeight: 'bold'
   }
});