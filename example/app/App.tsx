import { hello } from '@animo-id/mdoc-data-transfer'
import { Text, View } from 'react-native'

export const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{hello()}</Text>
    </View>
  )
}
