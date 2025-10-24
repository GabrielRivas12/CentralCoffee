import { collection, getDocs, query, where } from 'firebase/firestore';

export const obtenerLugares = async (auth, db, setLugares) => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const lugaresRef = collection(db, 'lugares');
    const q = query(lugaresRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // Indica que no hay lugares
    }

    const lugaresObtenidos = querySnapshot.docs.map(doc => ({
      label: `${doc.data().nombre} (${doc.data().horario})`,
      value: doc.id
    }));

    setLugares(lugaresObtenidos);
    return lugaresObtenidos; // Retorna los lugares encontrados
    
  } catch (error) {
    console.error('Error obteniendo lugares:', error);
    return null;
  }
};