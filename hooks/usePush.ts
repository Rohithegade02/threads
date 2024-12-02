import { useState, useEffect, useRef } from 'react'
import { Text, View, Button, Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { useUserProfile } from './useUserProfile'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'expo-router'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export const usePush = () => {
  const { userProfile } = useUserProfile()
  const updateUserProfile = useMutation(api.users.updateUser)
  const router = useRouter()
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()
  useEffect(() => {
    if (!Device.isDevice) return
    registerForPushNotificationsAsync()
      .then(token => {
        if (token && userProfile?._id) {
          updateUserProfile({ _id: userProfile?._id, pushToken: token })
        }
      })
      .catch(error => {
        console.error(error)
      })
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notifications => {
        console.log('notification received', notifications)
        // router.push(`/feed/${notifications.request.content.data.threadId}`)
      })
    notificationListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        const threadId = response.request.content.data.threadId
        router.push(`/feed/${threadId}`)
      })
  }, [userProfile?._id])
  async function sendPushNotification(expoPushToken: string) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
  }

  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage)
    throw new Error(errorMessage)
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError(
          'Permission not granted to get push token for push notification!',
        )
        return
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId
      if (!projectId) {
        handleRegistrationError('Project ID not found')
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data
        console.log(pushTokenString)
        return pushTokenString
      } catch (e: unknown) {
        handleRegistrationError(`${e}`)
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications')
    }
  }
}
