export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [initialUrl, setInitialUrl] = useState(null);

  // Manejar Deep Links
  useEffect(() => {
    const handleDeepLink = (url) => {
      if (url && url.startsWith('centralcoffee://')) {
        console.log('Deep Link recibido en App:', url);
        setInitialUrl(url);
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  return (
    <ProveedorTema> 
      <NavTema />
      <SafeAreaProvider>
        {checkingAuth ? (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#ED6D4A" />
          </View>
        ) : (
          <Navegacion 
            user={user} 
            initialUrl={initialUrl}
          />
        )}
      </SafeAreaProvider>
    </ProveedorTema>
  );
}