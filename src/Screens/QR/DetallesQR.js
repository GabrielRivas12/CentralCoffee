// screens/DetalleOfertaQRScreen.js
import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

const DetalleOfertaQRScreen = ({ route }) => {
    const { oferta, fromQR } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}>{oferta.titulo}</Text>

            {oferta.imagen && (
                <Image
                    source={{ uri: oferta.imagen }}
                    style={styles.imagen}
                    resizeMode="cover"
                />
            )}

            <View style={styles.detalles}>
                <Text style={styles.label}>Tipo de Café: <Text style={styles.value}>{oferta.tipoCafe}</Text></Text>
                <Text style={styles.label}>Variedad: <Text style={styles.value}>{oferta.variedad}</Text></Text>
                <Text style={styles.label}>Estado del Grano: <Text style={styles.value}>{oferta.estadoGrano}</Text></Text>
                <Text style={styles.label}>Clima: <Text style={styles.value}>{oferta.clima}</Text></Text>
                <Text style={styles.label}>Altura: <Text style={styles.value}>{oferta.altura} msnm</Text></Text>
                <Text style={styles.label}>Proceso de Corte: <Text style={styles.value}>{oferta.procesoCorte}</Text></Text>
                <Text style={styles.label}>Fecha de Cosecha: <Text style={styles.value}>{oferta.fechaCosecha}</Text></Text>
                <Text style={styles.label}>Cantidad de Producción: <Text style={styles.value}>{oferta.cantidadProduccion} libras</Text></Text>
                <Text style={styles.label}>Precio por Libra: <Text style={styles.value}>${oferta.ofertaLibra}</Text></Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    imagen: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
    detalles: { gap: 8 },
    label: { fontSize: 16, fontWeight: '600' },
    value: { fontWeight: 'normal' }
});

export default DetalleOfertaQRScreen;