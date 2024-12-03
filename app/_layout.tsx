import tokenCache from '@/utils/cache'
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from '@clerk/clerk-expo'
import {
  Slot,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from 'expo-router'
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import * as Sentry from '@sentry/react-native'
import { StatusBar } from 'expo-status-bar'

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
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation()

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  attachScreenshot: true,
  debug: false,
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      enableNativeFramesTracking: true,
    }),
    Sentry.mobileReplayIntegration({
      maskAllText: true,
      maskAllImages: true,
      maskAllVectors: true,
    }),
  ],
})
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
  const user = useUser()

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
  useEffect(() => {
    if (user && user.user) {
      Sentry.setUser({
        email: user.user.emailAddresses[0].emailAddress,
        id: user.user.id,
      })
    } else {
      Sentry.setUser(null)
    }
  }, [user])
  return <Slot />
}
const RootLayoutNav = () => {
  const ref = useNavigationContainerRef()

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref)
    }
  }, [ref])

  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <StatusBar style='light' />

          <InitialLayout />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  )
}
export default Sentry.wrap(RootLayoutNav)
