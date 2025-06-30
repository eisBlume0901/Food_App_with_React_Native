import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../constants/colors'
import SafeScreen from '../components/SafeScreen' // Use if you do not want home indicators to be seen
// import VerifyEmail from './(auth)/verify-email'


export default function RootLayout() 
{
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* Good hack for looking at a particular route for UI design */}
        {/* <VerifyEmail />*/}
        <Slot />
      </SafeAreaView>
    </ClerkProvider>
  )
}
