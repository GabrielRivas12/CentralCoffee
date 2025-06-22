import { StyleSheet, Text,  View } from 'react-native';


export default function Imagen(props) {
  return (
    <View style={styles.container}>
        <Image
        source={props.imagen} 
        style={styles.imagen}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3
  },
});
