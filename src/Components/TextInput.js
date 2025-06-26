import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InputText(props) {



  return (
    <View style={styles.container}>
      <SafeAreaView edges={['left']} style={{}}>
        <Text style={styles.label}>{props.NombreLabel}</Text>
        <TextInput
          style={[styles.input, { width: props.ancho || 350 },
          { height: props.alto || 50 }, { marginRight: props.margenRight || 0 }
          ]}
          value={props.Valor}
          onChangeText={props.onchangetext}
          placeholder={props.placeholder || 'Texto'}
          maxLength={props.maxCaracteres || 100}
        ></TextInput>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  label: {
    marginLeft: 5,
    alignContent: 'left',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: 350,
    height: 50,
    borderColor: '#999',
    paddingLeft: 5
  },
});
