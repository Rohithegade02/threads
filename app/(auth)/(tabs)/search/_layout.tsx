import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})
