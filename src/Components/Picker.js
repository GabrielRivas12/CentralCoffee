import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { usarTema } from '../Containers/TemaApp';

export default function ComboBox({ NombrePicker, value, onValuechange, items }) {
  const { modoOscuro } = usarTema();
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    Animated.timing(animation, {
      toValue: open ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setOpen(!open);
  };

  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, items.length * 45], // altura animada según número de ítems
  });

  const handleSelect = (item) => {
    onValuechange(item.value);
    toggleDropdown();
  };

  const selectedLabel = items.find(i => i.value === value)?.label || 'Seleccionar...';

  return (
    <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
      <Text style={[styles.label, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>
        {NombrePicker}
      </Text>

      <Pressable
        onPress={toggleDropdown}
        style={[
          styles.pickerContainer,
          modoOscuro ? styles.pickerContainerOscuro : styles.pickerContainerClaro,
        ]}
      >
        <Text style={{ color: modoOscuro ? '#fff' : '#000', fontSize: 16 }}>
          {selectedLabel}
        </Text>
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        >
          <Feather name="chevron-down" size={20} color={modoOscuro ? '#fff' : '#000'} />
        </Animated.View>
      </Pressable>

      <Animated.View
        style={[
          styles.dropdownContainer,
          {
            height: containerHeight,
            opacity: animation,
          },
          modoOscuro ? styles.dropdownOscuro : styles.dropdownClaro,
        ]}
      >
        {items.map((item, index) => (
          <Pressable
            key={item.value}
            onPress={() => handleSelect(item)}
            style={[
              styles.option,
              index !== items.length - 1 && styles.optionBorder, // Borde solo entre items
            ]}
          >
            <Text style={{ 
              color: modoOscuro ? '#fff' : '#000',
              fontWeight: value === item.value ? 'bold' : 'normal'
            }}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: '2.5%',
    marginBottom: 5,
  },
  labelClaro: { color: '#000' },
  labelOscuro: { color: '#fff' },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    width: 350,
    height: 52,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContainerClaro: {
    backgroundColor: '#fff',
    borderColor: '#999',
  },
  pickerContainerOscuro: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  dropdownContainer: {
  overflow: 'hidden',
  width: 344,
  alignSelf: 'center',
  borderTopLeftRadius: 0,     // Esquina superior izquierda sin redondear
  borderTopRightRadius: 0,    // Esquina superior derecha sin redondear
  borderBottomLeftRadius: 5,  // Esquina inferior izquierda redondeada
  borderBottomRightRadius: 5, // Esquina inferior derecha redondeada
},
dropdownClaro: {
  backgroundColor: '#EBEBEB',
  borderColor: '#ccc',
  borderWidth: 1,
},
dropdownOscuro: {
  backgroundColor: '#222',
  borderColor: '#444',
  borderWidth: 1,
},
  option: {
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4dcdcff',
  },
});