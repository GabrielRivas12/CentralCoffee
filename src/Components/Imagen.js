import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Imagen(props) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#fff', }}>
        <Image
          source={props.imagen}
          style={styles.imagen}
        />
      </SafeAreaView>
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
