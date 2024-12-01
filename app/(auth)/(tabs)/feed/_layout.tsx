import React from 'react'
import { Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='profile/[id]' options={{ headerShown: false }} />
      <Stack.Screen
        name='[id]'
        options={{
          title: 'Thread',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTintColor: '#000',
          headerBackTitle: 'Back',
          headerRight: () => (
            <Ionicons name='notifications-outline' size={24} color={'black'} />
          ),
        }}
      />
    </Stack>
  )
}

export default Layout
