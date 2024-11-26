import tokenCache from '@/utils/cache'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import {
  ConvexProvider,
  ConvexProviderWithAuth,
  ConvexReactClient,
} from 'convex/react'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})
//env data
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}
SplashScreen.preventAutoHideAsync()
const InitialLayout = () => {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  })
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  return <Slot />
}
export default function RootLayoutNav() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithAuth useAuth={useAuth} client={convex}>
          <InitialLayout />
        </ConvexProviderWithAuth>
      </ClerkLoaded>
    </ClerkProvider>
  )
}
