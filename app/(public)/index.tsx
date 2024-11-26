import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import React from 'react'
import { useOAuth } from '@clerk/clerk-expo'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

const IndexPage = () => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' })
  const { startOAuthFlow: startGoogleForm } = useOAuth({
    strategy: 'oauth_google',
  })
  const data = useQuery(api.users.getAllUsers)
  console.log(data)
  const handleFacebookLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow()
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      }
    } catch (err) {
      console.error(err)
    }
  }
  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleForm()
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      }
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/login.png')}
        style={styles.login}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>How would you like to use threads?</Text>
        <View style={styles.loginContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleFacebookLogin}
          >
            <View style={styles.loginButtonContent}>
              <Image
                source={require('@/assets/images/instagram_icon.webp')}
                style={styles.loginButtonIcon}
              />
              <Text style={styles.loginButtonText}>
                Continue with Instagram
              </Text>
              <Ionicons
                name='chevron-forward'
                size={24}
                color={Colors.border}
              />
            </View>
            <Text style={styles.loginButtonSubtitle}>
              Log in or create a Threads profile with your Instagram account
              with a profile,you can post,interact and get personalised
              recommendations.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleGoogleLogin}
          >
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Continue with Google</Text>
              <Ionicons
                name='chevron-forward'
                size={24}
                color={Colors.border}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton}>
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Use without a profile </Text>
              <Ionicons
                name='chevron-forward'
                size={24}
                color={Colors.border}
              />
            </View>
            <Text style={styles.loginButtonSubtitle}>
              You can browse Threads without a profile,but wont be able to
              post,interact or get personalised recommedtaions.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  login: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  title: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 17,
  },
  loginContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    // textAlign:'center',
    alignItems: 'center',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loginButtonIcon: {
    width: 44,
    height: 44,
  },
  loginButtonText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    flex: 1,
  },
  loginButtonSubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: Colors.border,
  },
})
export default IndexPage
