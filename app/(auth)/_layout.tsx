import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { usePush } from '@/hooks/usePush'

const Layout = () => {
  const router = useRouter()
  usePush()
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: 'white',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen
        name='(modal)/create'
        options={{
          presentation: 'modal',
          title: 'New Thread',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='(modal)/edit-profile'
        options={{
          presentation: 'modal',
          title: 'Edit Profile',
          headerTitleAlign: 'center',
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.dismiss()}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen
        name='(modal)/image/[url]'
        options={{
          presentation: 'fullScreenModal',
          title: '',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.dismiss()}>
                <Ionicons name='close' size={24} color='white' />
              </TouchableOpacity>
            )
          },
          headerRight: () => {
            return (
              <TouchableOpacity onPress={() => router.dismiss()}>
                <Ionicons
                  name='ellipsis-horizontal-circle'
                  size={24}
                  color='white'
                />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen
        name='(modal)/reply/[id]'
        options={{
          presentation: 'modal',
          title: 'Reply',
          headerTitleAlign: 'center',
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.dismiss()}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            )
          },
        }}
      />
    </Stack>
  )
}

export default Layout
