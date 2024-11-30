import React from 'react'
import { router, Stack } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'

const Layout = () => {
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
          headerRight: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            )
          },
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
    </Stack>
  )
}

export default Layout
