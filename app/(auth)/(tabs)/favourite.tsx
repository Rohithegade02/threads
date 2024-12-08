import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FlashList } from '@shopify/flash-list'
import FollowComponent from '@/components/FollowComponent'
import Loader from '@/components/Loader'

const Favorite = () => {
  const { userProfile } = useUserProfile()
  const unfollowedUsers = useQuery(api.users.getAllUnfollowedUser, {
    userId: userProfile?._id!,
  })

  const followUserMutation = useMutation(api.users.followUser)

  return (
    <View style={styles.container}>
      <FlashList
        data={unfollowedUsers}
        renderItem={({ item }) => (
          <FollowComponent
            data={item}
            followUserMutation={followUserMutation}
            userProfile={userProfile}
          />
        )}
        estimatedItemSize={72}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        ListEmptyComponent={({ item }) => (
          <View key={item} style={{ marginHorizontal: 10 }}>
            {[...Array(10)].map((_, index) => (
              <Loader
                key={index}
                heightStyle={80}
                widthStyle={true}
                activityPage={true}
              />
            ))}
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  itemSeparator: {
    height: 1,
    width: '82.5%',
    position: 'absolute',
    right: 10,
    bottom: 0,
    backgroundColor: '#1f1f1f',
  },
})
export default Favorite
