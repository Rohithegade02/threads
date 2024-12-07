import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useAuth } from '@clerk/clerk-expo'
import { Link, router } from 'expo-router'
import UserProfile from './UserProfile'
import Tabs from './Tabs'
import { FlashList } from '@shopify/flash-list'
import { api } from '@/convex/_generated/api'
import { usePaginatedQuery } from 'convex/react'
import Thread from './Thread'

type ProfileProps = {
  userId?: Id<'users'>
  showBackButton?: boolean
}

const Profile = ({ userId, showBackButton }: ProfileProps) => {
  const { userProfile } = useUserProfile()
  const { top } = useSafeAreaInsets()
  const { signOut } = useAuth()

  const { results, loadMore, status } = usePaginatedQuery(
    api.messages.getThreads,
    { userId: userId || userProfile?._id },
    {
      initialNumItems: 5,
    },
  )
  return (
    <View style={[{ paddingTop: top }, styles.container]}>
      <FlashList
        data={results}
        estimatedItemSize={122}
        renderItem={({ item }) => (
          <Link href={`/(auth)/(tabs)/feed/${item._id}`} asChild>
            <TouchableOpacity>
              <Thread
                threadData={
                  item as Doc<'messages'> & {
                    creator: Doc<'users'>
                  }
                }
              />
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.tabContentText}>
            You haven&apos;t posted anything yet
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: '#4d4d4d',
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
                  <Ionicons name='chevron-back' size={24} color={'#E2E2E2'} />
                  <Text style={{ color: '#E2E2E2' }}>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons
                  name='web'
                  size={24}
                  color={'#E2E2E2'}
                />
              )}
              <View style={styles.headerIcons}>
                <Ionicons name='logo-instagram' size={24} color={'#E2E2E2'} />
                <TouchableOpacity onPress={() => signOut()}>
                  <Ionicons
                    name='log-out-outline'
                    size={24}
                    color={'#E2E2E2'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {userId && <UserProfile userId={userId} />}
            {!userId && userProfile && (
              <UserProfile userId={userProfile?._id} />
            )}
            <Tabs
              onTabChange={() => {}}
              tabs={['Threads', 'Replies', 'Reposts']}
            />
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
    backgroundColor: '#101010',
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
