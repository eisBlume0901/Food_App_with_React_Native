import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '../constants/colors';

const SafeScreen = ( {children} ) => {

  const insets = useSafeAreaInsets();

  return (

    // Insets - ensure that content is not blocked or obscured by
    // system UI elements like notches, status bars, navigation bars, or a home indicator
    <View style={{
        paddingTop: insets.top, 
        flex: 1,
        backgroundColor: COLORS.background,
    }}>
      {children}
    </View>
  )
}

export default SafeScreen