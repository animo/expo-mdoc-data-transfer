import { StyleSheet, Text, View } from 'react-native'

import * as MdocDataTransfer from '@animo-id/mdoc-data-transfer'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{MdocDataTransfer.hello()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
