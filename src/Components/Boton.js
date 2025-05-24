import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Boton(props) {
  return (
    <View style={styles.container}>
        <TouchableOpacity 
        onPress={props.onPress}
        backgroundColor={props.backgroundColor}
        style={[styles.boton, { backgroundColor: props.backgroundColor }]}>
          <Text>{props.nombreB} </Text>
        </TouchableOpacity>
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
  boton: {

  }
});
