import tokenCache from '@/utils/cache'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { Slot, useRouter, useSegments } from 'expo-router'
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
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const segment = useSegments()
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  useEffect(() => {
    if (!isLoaded) return
    const isAuthGroup = segment[0] === '(auth)'
    if (isSignedIn && !isAuthGroup) {
      router.replace('/(auth)/(tabs)/feed')
    } else if (!isSignedIn && !isAuthGroup) {
      router.replace('/(public)')
    }
  }, [isSignedIn])
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
