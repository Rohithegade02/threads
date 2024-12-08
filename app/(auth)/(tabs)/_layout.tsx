import React from 'react'
import { router, Tabs, usePathname } from 'expo-router'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
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
    backgroundColor: '#1e1e1e',
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
        tabBarActiveTintColor: '#fff',
        tabBarInactiveBackgroundColor: '#101010',
        tabBarActiveBackgroundColor: '#101010',
        headerStyle: {
          backgroundColor: '#101010',
        },
        headerTintColor: '#101010',

        tabBarStyle: pathname.includes('feed/profile/')
          ? { display: 'none', backgroundColor: '#101010' }
          : {
              backgroundColor: '#101010',
              borderTopWidth: 0,
            },
      }}
    >
      <Tabs.Screen
        name='feed'
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color = '#535353', size, focused }) => (
            <MaterialIcons
              name={focused ? 'home-filled' : 'home-filled'}
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
          headerTintColor: '#f2f2f2',
          headerTitleStyle: {
            color: '#f2f2f2',
            // fontSize:24
          },
          tabBarIcon: ({ color = '#535353', size, focused }) => (
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
          tabBarIcon: ({ color = '#545454', size, focused }) => (
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
          title: 'Activity',
          headerTintColor: '#f2f2f2',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            color: '#f2f2f2',
            fontSize: 24,
          },
          tabBarIcon: ({ color = '#535353', size, focused }) => (
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
          tabBarIcon: ({ color = '#535353', size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={28}
            />
          ),
          headerRight: () => {
            return (
              <TouchableOpacity onPress={() => signOut()}>
                <Ionicons name='log-out' size={24} color={''} />
              </TouchableOpacity>
            )
          },
        }}
      />
    </Tabs>
  )
}

export default Layout
