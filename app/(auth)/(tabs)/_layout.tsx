import React from 'react'
import { router, Tabs, usePathname } from 'expo-router'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
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
  focused: boolean
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
    paddingVertical: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    borderRadius: 8,
    height: 40,
    width: 50,
    alignSelf: 'center',
  },
})

const Layout = () => {
  const { signOut } = useAuth()
  const pathname = usePathname()
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000',
        tabBarStyle: pathname.includes('feed/profile/')
          ? { display: 'none' }
          : undefined,
      }}
    >
      <Tabs.Screen
        name='feed'
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'home-filled' : 'home'}
              color={color}
              size={28}
            />
          ),
        }}
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
              size={28}
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
              size={28}
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
              size={28}
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
