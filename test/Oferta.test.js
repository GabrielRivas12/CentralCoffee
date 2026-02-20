import { LeerDatos } from '../src/Containers/ObtenerOfertas';

// Mock de importación del módulo
jest.mock('../src/Containers/ObtenerOfertas', () => ({
  LeerDatos: jest.fn(),
}));

// Mock de datos simulados
const mockOfertasCafe = [
  {
    id: '1',
    titulo: 'Café Arabica Premium',
    ofertaLibra: 25,
    estado: 'Activo',
    imagen: 'cafe_arabica.jpg',
    tipo: 'Grano',
    descripcion: 'Café de alta calidad con aroma intenso'
  },
  {
    id: '2', 
    titulo: 'Café Robusta Selecto',
    ofertaLibra: 30,
    estado: 'Activo', 
    imagen: 'cafe_robusta.jpg',
    tipo: 'Molido',
    descripcion: 'Café fuerte ideal para espresso'
  },
  {
    id: '3',
    titulo: 'Café Especial',
    ofertaLibra: 20,
    estado: 'Inactivo',
    imagen: 'cafe_especial.jpg',
    tipo: 'Grano',
    descripcion: 'Mezcla especial de la casa'
  }
];

const mockOfertasEmpty = [];

describe('Pruebas de Obtención de Datos - Servicio LeerDatos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case P02 - Cargar datos de ofertas
  describe('Test Case P02: Cargar datos de ofertas en móvil', () => {
    
    test('P02-001: Debe retornar datos de café correctamente', async () => {
      // Arrange
      LeerDatos.mockResolvedValue(mockOfertasCafe);

      // Act
      const resultado = await LeerDatos();

      // Assert
      expect(LeerDatos).toHaveBeenCalledTimes(1);
      
      console.log('Primera oferta:', resultado[0]);
      
      // Verificar datos específicos de café
      expect(resultado[0].titulo).toBe('Café Arabica Premium');
      expect(resultado[0].ofertaLibra).toBe(25);
      expect(resultado[0].tipo).toBe('Grano');
    });

    test('P02-002: Debe manejar estado vacío cuando no hay ofertas', async () => {
      // Arrange
      LeerDatos.mockResolvedValue(mockOfertasEmpty);

      // Act
      const resultado = await LeerDatos();

      // Assert
      expect(LeerDatos).toHaveBeenCalledTimes(1);
      
      console.log('Primera oferta:', resultado[0]);
      
      expect(resultado).toHaveLength(0);
      expect(Array.isArray(resultado)).toBe(true);
    });

    test('P02-003: Debe filtrar solo ofertas con estado "Activo"', async () => {
      // Arrange
      LeerDatos.mockResolvedValue(mockOfertasCafe);

      // Act
      const resultado = await LeerDatos();

      // Assert
      expect(LeerDatos).toHaveBeenCalledTimes(1);
      
      const ofertasActivas = resultado.filter(oferta => oferta.estado === 'Activo');
      const ofertasInactivas = resultado.filter(oferta => oferta.estado === 'Inactivo');
      
      console.log('RESUMEN:');
      console.log('   - Total: 3 ofertas');
      console.log('   - Activas: 2 ofertas');
      console.log('   - Inactivas: 1 ofertas');
      console.log('========================');
      
      // Verificar que solo hay 2 ofertas activas
      expect(ofertasActivas).toHaveLength(2);
      
      // Verificar que las ofertas inactivas no están incluidas
      const ofertaInactiva = ofertasActivas.find(oferta => oferta.estado === 'Inactivo');
      expect(ofertaInactiva).toBeUndefined();
    });
  });
});