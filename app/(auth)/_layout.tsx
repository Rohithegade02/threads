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
          headerTintColor: '#f2f2f2',
          headerStyle: {
            backgroundColor: '#101010',
          },
        }}
      />
      <Stack.Screen
        name='(modal)/edit-profile'
        options={{
          presentation: 'modal',
          title: 'Edit Profile',
          headerTitleStyle: {
            color: '#E3E5E7',
          },
          headerStyle: {
            backgroundColor: '#101010',
          },
          headerTitleAlign: 'center',
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.dismiss()}>
                <Text style={{ color: '#E3E5E7' }}>Cancel</Text>
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
          headerTintColor: '#f2f2f2',
          headerStyle: {
            backgroundColor: '#101010',
          },
        }}
      />
      <Stack.Screen
        name='(modal)/gif'
        options={{
          presentation: 'modal',
          title: 'Gif',
          headerTitleAlign: 'center',
          headerTintColor: '#f2f2f2',
          headerStyle: {
            backgroundColor: '#101010',
          },
        }}
      />
    </Stack>
  )
}

export default Layout
