import { Text, View, StyleSheet } from 'react-native'
export default function MachineView() {
    return (
        <View style={styles.container}>
            <Text>MachineView</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})