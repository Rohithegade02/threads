import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShadowVisible: true,
          headerBackTitleStyle: {
            fontSize: 30,
          },
        }}
      />
      <Stack.Screen
        name='profile/[id]'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})
