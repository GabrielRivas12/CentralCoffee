import { BuscarOferta } from '../src/Containers/BuscadorOferta';

// Mock de todas las dependencias nativas PRIMERO
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  getFirestore: jest.fn(() => ({})),
  query: jest.fn(),
  where: jest.fn()
}));

// Mock de Firebase app
jest.mock('../src/Services/Firebase', () => ({
  __esModule: true,
  default: {}
}));

// Mock de datos de ofertas - SOLO ACTIVAS para el mock de Firebase
const mockOfertasActivas = [
  {
    titulo: 'Café Arabica Premium',
    ofertaLibra: 25,
    estado: 'Activo',
    imagen: 'https://ejemplo.com/arabica.jpg',
    tipo: 'Grano',
    descripcion: 'Café de alta calidad con aroma intenso'
  },
  {
    titulo: 'Café Robusta Selecto',
    ofertaLibra: 30,
    estado: 'Activo', 
    imagen: 'https://ejemplo.com/robusta.jpg',
    tipo: 'Molido',
    descripcion: 'Café fuerte ideal para espresso'
  },
  {
    titulo: 'Café Especial de Matagalpa',
    ofertaLibra: 35,
    estado: 'Activo',
    imagen: 'https://ejemplo.com/matagalpa.jpg',
    tipo: 'Grano',
    descripcion: 'Café especial de la región de Matagalpa'
  }
];

describe('Pruebas de Caja Blanca - Función de Búsqueda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Case P08: Validar función de búsqueda de ofertas', () => {
    
    describe('P08-001: Probar búsqueda con texto vacío', () => {
      
      test('Debe retornar undefined cuando el texto de búsqueda está vacío', async () => {
        // Arrange
        const textoBusqueda = '';

        // Act
        const resultado = await BuscarOferta(textoBusqueda);

        // Assert
        expect(resultado).toBeUndefined();
        
        console.log('Búsqueda con texto vacío retorna undefined correctamente');
      });

      test('Debe retornar undefined cuando el texto de búsqueda es solo espacios', async () => {
        // Arrange
        const textoBusqueda = '   ';

        // Act
        const resultado = await BuscarOferta(textoBusqueda);

        // Assert
        expect(resultado).toBeUndefined();
        
        console.log('Búsqueda con solo espacios retorna undefined correctamente');
      });
    });

    describe('P08-002: Probar búsqueda exitosa', () => {
      
      test('Debe encontrar ofertas que coincidan con el texto buscado', async () => {
        // Arrange
        const textoBusqueda = 'arabica';
        const { getDocs, where } = require('firebase/firestore');
        
        // Mock de la respuesta de Firebase
        getDocs.mockResolvedValue({
          forEach: (callback) => {
            mockOfertasActivas.forEach(oferta => {
              callback({
                data: () => oferta
              });
            });
          }
        });

        // Act
        const resultado = await BuscarOferta(textoBusqueda);

        // Assert
        expect(where).toHaveBeenCalledWith("estado", "==", "Activo");
        expect(resultado).toHaveLength(1);
        expect(resultado[0].titulo).toBe('Café Arabica Premium');
        expect(resultado[0].estado).toBe('Activo');
        
        console.log('✅ Búsqueda exitosa - Resultados encontrados:');
        console.log(resultado);
      });

      test('Debe retornar array vacío cuando no hay coincidencias', async () => {
        // Arrange
        const textoBusqueda = 'xyz123nonexistent';
        const { getDocs } = require('firebase/firestore');
        
        // Mock de la respuesta de Firebase
        getDocs.mockResolvedValue({
          forEach: (callback) => {
            mockOfertasActivas.forEach(oferta => {
              callback({
                data: () => oferta
              });
            });
          }
        });

        // Act
        const resultado = await BuscarOferta(textoBusqueda);

        // Assert
        expect(resultado).toHaveLength(0);
        expect(Array.isArray(resultado)).toBe(true);
        
        console.log('✅ Búsqueda sin resultados retorna array vacío correctamente');
      });
    });

    describe('P08-003: Probar filtrado por estado "Activo"', () => {
      
      test('Debe usar filtro WHERE para estado "Activo"', async () => {
        // Arrange
        const textoBusqueda = 'café';
        const { getDocs, where } = require('firebase/firestore');
        
        // Mock de la respuesta de Firebase - SOLO ofertas activas
        getDocs.mockResolvedValue({
          forEach: (callback) => {
            mockOfertasActivas.forEach(oferta => {
              callback({
                data: () => oferta
              });
            });
          }
        });

        // Act
        const resultado = await BuscarOferta(textoBusqueda);

        // Assert
        // Verificar que se usa el filtro WHERE en el servidor
        expect(where).toHaveBeenCalledWith("estado", "==", "Activo");
        
        // Verificar que TODAS las ofertas retornadas son activas
        const todasActivas = resultado.every(oferta => oferta.estado === 'Activo');
        expect(todasActivas).toBe(true);
        
        console.log('✅ Filtrado por estado "Activo" funciona correctamente');
        console.log(`Total ofertas encontradas: ${resultado.length}`);
        console.log(`Todas son activas: ${todasActivas}`);
      });
    });

    describe('P08-004: Probar estructura de datos retornada', () => {
      
      test('Debe retornar datos con estructura compatible con OfertasCard', async () => {
        // Arrange
        const textoBusqueda = 'premium';
        const { getDocs } = require('firebase/firestore');
        
        // Mock de la respuesta de Firebase
        getDocs.mockResolvedValue({
          forEach: (callback) => {
            mockOfertasActivas.forEach(oferta => {
              callback({
                data: () => oferta
              });
            });
          }
        });

        // Act
        const resultado = await BuscarOferta(textoBusqueda);

        // Assert - Verificar estructura compatible con OfertasCard
        resultado.forEach(oferta => {
          // Propiedades requeridas por OfertasCard
          expect(oferta).toHaveProperty('titulo');
          expect(oferta).toHaveProperty('imagen');
          expect(oferta).toHaveProperty('ofertaLibra');
          
          // Propiedades adicionales que pueden usarse
          expect(oferta).toHaveProperty('estado');
          expect(typeof oferta.titulo).toBe('string');
          expect(typeof oferta.imagen).toBe('string');
          expect(typeof oferta.ofertaLibra).toBe('number');
        });
        
        console.log('✅ Estructura de datos compatible con OfertasCard:');
        console.log('Propiedades requeridas: titulo, imagen, ofertaLibra');
        console.log('Ejemplo de oferta:', resultado[0]);
      });

      test('Debe manejar búsqueda case insensitive', async () => {
        // Arrange
        const textoBusquedaMayusculas = 'ARABICA';
        const textoBusquedaMinusculas = 'arabica';
        const { getDocs } = require('firebase/firestore');
        
        // Mock de la respuesta de Firebase
        getDocs.mockResolvedValue({
          forEach: (callback) => {
            mockOfertasActivas.forEach(oferta => {
              callback({
                data: () => oferta
              });
            });
          }
        });

        // Act
        const resultadoMayusculas = await BuscarOferta(textoBusquedaMayusculas);
        const resultadoMinusculas = await BuscarOferta(textoBusquedaMinusculas);

        // Assert - Ambos deberían encontrar los mismos resultados
        expect(resultadoMayusculas.length).toBe(resultadoMinusculas.length);
        expect(resultadoMayusculas[0].titulo).toBe(resultadoMinusculas[0].titulo);
        
        console.log('✅ Búsqueda case insensitive funciona correctamente');
        console.log(`Búsqueda "ARABICA": ${resultadoMayusculas.length} resultados`);
        console.log(`Búsqueda "arabica": ${resultadoMinusculas.length} resultados`);
      });
    });

    describe('P08-005: Probar diferentes casos de búsqueda', () => {
      
      test('Debe encontrar ofertas por palabra parcial', async () => {
        // Arrange
        const textoBusquedaParcial = 'arab';
        const { getDocs } = require('firebase/firestore');
        
        // Mock de la respuesta de Firebase
        getDocs.mockResolvedValue({
          forEach: (callback) => {
            mockOfertasActivas.forEach(oferta => {
              callback({
                data: () => oferta
              });
            });
          }
        });

        // Act
        const resultado = await BuscarOferta(textoBusquedaParcial);

        // Assert
        expect(resultado.length).toBeGreaterThan(0);
        resultado.forEach(oferta => {
          expect(oferta.titulo.toLowerCase()).toContain('arab');
        });
        
        console.log('✅ Búsqueda por palabra parcial funciona correctamente');
        console.log(`Búsqueda "arab" encontró: ${resultado.length} resultados`);
      });

      test('Debe encontrar ofertas por región', async () => {
        // Arrange
        const textoBusquedaRegion = 'matagalpa';
        const { getDocs } = require('firebase/firestore');
        
        // Mock de la respuesta de Firebase
        getDocs.mockResolvedValue({
          forEach: (callback) => {
            mockOfertasActivas.forEach(oferta => {
              callback({
                data: () => oferta
              });
            });
          }
        });

        // Act
        const resultado = await BuscarOferta(textoBusquedaRegion);

        // Assert
        expect(resultado.length).toBe(1);
        expect(resultado[0].titulo).toBe('Café Especial de Matagalpa');
        
        console.log('✅ Búsqueda por región funciona correctamente');
        console.log('Resultado:', resultado[0].titulo);
      });
    });
  });
});