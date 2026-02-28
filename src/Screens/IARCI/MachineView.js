import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'

export default function MachineView() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://centralcoffee.onrender.com/rci' }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    marginTop: -70,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})