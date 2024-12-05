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
          headerTintColor: '#f2f3f5',
          headerBackTitle: 'Back',
          headerRight: () => (
            <Ionicons
              name='notifications-outline'
              size={24}
              color={'#f2f3f5'}
            />
          ),
          headerStyle: {
            backgroundColor: '#101010',
          },
        }}
      />
    </Stack>
  )
}

export default Layout
