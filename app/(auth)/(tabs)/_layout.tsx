import React from 'react'
import { router, Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useAuth } from '@clerk/clerk-expo'
import * as Haptics from 'expo-haptics'

const CreateTabIcon = ({
  color,
  size,
  focused,
}: {
  color: string
  size: number
  focused: string
}) => {
  return (
    <View style={styles.createTabIconContainer}>
      <Ionicons name='add' color={color} size={size} focused={focused} />
    </View>
  )
}

const styles = StyleSheet.create({
  createTabIconContainer: {
    backgroundColor: Colors.itemBackground,
    padding: 2,
    borderRadius: 8,
  },
})

const Layout = () => {
  const { signOut } = useAuth()
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000',
      }}
    >
      <Tabs.Screen
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={size}
            />
          ),
        }}
        name='feed'
      />
      <Tabs.Screen
        name='search'
        options={{
          headerShown: false,
          title: 'Search',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='create'
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size, focused }) => (
            <CreateTabIcon color={color} size={size} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault()
            Haptics.selectionAsync()
            router.push('/(auth)/(modal)/create')
          },
        }}
      />
      <Tabs.Screen
        name='favourite'
        options={{
          title: 'Search',

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={size}
            />
          ),
          headerRight: () => {
            return (
              <TouchableOpacity onPress={() => signOut()}>
                <Ionicons name='log-out' size={24} />
              </TouchableOpacity>
            )
          },
        }}
      />
    </Tabs>
  )
}

export default Layout
