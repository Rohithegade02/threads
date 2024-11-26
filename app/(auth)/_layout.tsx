import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: true }} />
    </Stack>
  )
}

export default Layout
