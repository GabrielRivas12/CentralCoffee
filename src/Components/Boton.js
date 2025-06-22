import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function Boton(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={props.onPress}
        style={[styles.boton,
        { backgroundColor: props.ColorBoton || '#ED6D4A' },
        { width: props.ancho || 350 },
        { height: props.alto || 50 },
        { borderColor: props.borderColor || '#ED6D4A' },
        {  borderRadius: props.borderRadius || 5}

        ]}>
        {props.iconName && (
          <AntDesign
            name={props.iconName}
            size={props.iconSize || 24}
            color={props.iconColor || 'white'}
            style={{ marginRight: props.marginRight ?? 90, position: 'absolute', }}
          />
        )}

        <Text style={[
          styles.nombreb,
          { color: props.ColorTexto || 'white' } 
        ]}>

          {props.nombreB}

        </Text>
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3

  },
  boton: {
    width: 350,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',

  },
  nombreb: {
    alignContent: 'center',
    fontWeight: 'bold'
  }
});
