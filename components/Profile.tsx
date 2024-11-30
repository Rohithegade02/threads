import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React from 'react'
import { Id } from '@/convex/_generated/dataModel'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useAuth } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import UserProfile from './UserProfile'
import Tabs from './Tabs'

type ProfileProps = {
  userId?: Id<'users'>
  showBackButton?: boolean
}

const Profile = ({ userId, showBackButton }: ProfileProps) => {
  const { userProfile } = useUserProfile()
  const { top } = useSafeAreaInsets()
  const { signOut } = useAuth()
  return (
    <View style={[{ paddingTop: top }, styles.container]}>
      <FlatList
        data={[]}
        renderItem={({ item }) => <Text>Test</Text>}
        ListEmptyComponent={
          <Text style={styles.tabContentText}>
            You haven&apos;t posted anything yet
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name='chevron-back' size={24} color={'#000'} />
                  <Text>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name='web' size={24} />
              )}
              <View style={styles.headerIcons}>
                <Ionicons name='logo-instagram' size={24} color={'#000'} />
                <TouchableOpacity onPress={() => signOut()}>
                  <Ionicons name='log-out-outline' size={24} color={'#000'} />
                </TouchableOpacity>
              </View>
            </View>
            {userId && <UserProfile userId={userId} />}
            {!userId && userProfile && (
              <UserProfile userId={userProfile?._id} />
            )}
            <Tabs onTabChange={() => {}} />
          </>
        }
      />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabContentText: {
    fontSize: 17,
    color: Colors.border,
    textAlign: 'center',
    marginVertical: 16,
  },
})
