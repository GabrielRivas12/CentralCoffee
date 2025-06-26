import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import Boton from '../Components/Boton'
import InputText from '../Components/TextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import ComboboxPickerDate from '../Components/PickerDate';

export default function OfertaFormulario({
  imagen,
  onPickImage,
  Titulo, setTitulo,
  TipoCafe, setTipoCafe,
  Variedad, setVariedad,
  EstadoGrano, setEstadoGrano,
  Clima, setClima,
  Altura, setAltura,
  ProcesoCorte, setProcesoCorte,
  FechaCosecha, setFechaCosecha,
  CantidadProduccion, setCantidadProduccion,
  OfertaLibra, setOfertaLibra,
  onSubmit, date, show, mode, text, onChange, verMode

}) {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff', flex: 1, width: 390 }}>
        <ScrollView style={styles.scrol}>

          <View style={styles.containerImagen}>
            <TouchableOpacity onPress={onPickImage} style={{ width: '100%', height: '100%' }}>
              {imagen ? (
                <Image source={{ uri: imagen }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
              ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Text style={{ color: '#fff' }}>Seleccionar imagen</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.encabezado}>
            <InputText

              NombreLabel='Titulo'
              Valor={Titulo}
              onchangetext={setTitulo}
              placeholder='Ingrese el título de la oferta'
              maxCaracteres={50}
            />
            <Text>Características</Text>

          </View>

          <View style={styles.formContainer}>



            <View style={styles.formContainerInputTipo}>


              <InputText
                ancho='170'
                margenRight='10'
                NombreLabel='Tipo de café'
                Valor={TipoCafe}
                onchangetext={setTipoCafe}
                placeholder='Ingrese el tipo de café'

              />

              <InputText
                ancho='170'
                NombreLabel='Variedad'
                Valor={Variedad}
                onchangetext={setVariedad}
                placeholder='Ingrese la variedad'
              />

            </View>


            <View style={styles.formContainerInputTipo}>
              <InputText
                ancho='170'
                margenRight='10'
                NombreLabel='Estado del grano'
                Valor={EstadoGrano}
                onchangetext={setEstadoGrano}
                placeholder='Ingrese el estado'
              />

              <InputText
                ancho='170'
                NombreLabel='Clima'
                Valor={Clima}
                onchangetext={setClima}
                placeholder='Ingrese el clima'
              />

            </View>

            <View style={styles.formContainerInputTipo}>
              <InputText
                ancho='170'
                margenRight='10'
                NombreLabel='Altura'
                Valor={Altura}
                onchangetext={setAltura}
                placeholder='Ingrese la altura'
              />

              <InputText
                ancho='170'
                NombreLabel='Proceso de corte'
                Valor={ProcesoCorte}
                onchangetext={setProcesoCorte}
                placeholder='Ingrese el proceso'
              />
            </View>
            <View style={styles.formContainerInputTipo}>

              <ComboboxPickerDate
                date={date}
                show={show}
                mode={mode}
                text={text}
                verMode={verMode}
                onChange={onChange}

              />
              <InputText
                ancho='170'
                NombreLabel='Cantidad de p'
                Valor={CantidadProduccion}
                onchangetext={setCantidadProduccion}
                placeholder='Ingrese la cantidad'
              />
            </View>
            <InputText
              ancho='170'
              NombreLabel='Oferta por libra'
              Valor={OfertaLibra}
              onchangetext={setOfertaLibra}
              placeholder='Ingrese la oferta por libra'
            />

          </View>




          <Boton
            nombreB='Publicar'
            onPress={onSubmit}
          />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerImagen: {
    width: 350,
    height: 150,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999'

  },
  formContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  scrol: {
  },
  containerbb: {
  },
  formContainerInputTipo: {
    flexDirection: 'row',

  },
  encabezado: {
    left: 20,
    top: 8
  }


});