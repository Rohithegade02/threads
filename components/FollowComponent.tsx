import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Doc } from '@/convex/_generated/dataModel'
import { Image } from 'react-native'

const FollowComponent = ({
  data,
  followUserMutation,
  userProfile,
}: {
  data: Doc<'users'>
  followUserMutation: any
  userProfile: any
}) => {
  const [pressIn, setPressIn] = useState(false)
  const handleFollow = async () => {
    try {
      if (userProfile?._id && data?._id) {
        await followUserMutation({
          followerId: userProfile._id,
          followingId: data._id,
        })
      }
    } catch (error) {
      console.error('Error following user:', error)
    }
  }
  return (
    <View style={styles.container}>
      <Image source={{ uri: data.imageUrl }} style={styles.image} />
      <View style={styles.subContainer}>
        <View>
          <Text style={styles.username}>{data.username}</Text>
          <Text style={{ fontSize: 14, color: '#474747' }}>Follow request</Text>
        </View>
        <Pressable
          onPressIn={() => setPressIn(true)}
          onPressOut={() => setPressIn(false)}
          style={[
            styles.confirmButtonContainer,
            pressIn && { backgroundColor: '#1e1e1e' },
          ]}
          onPress={handleFollow}
        >
          <Text style={{ fontWeight: 600, fontSize: 14, color: '#C6C8C9' }}>
            Confirm
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default FollowComponent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    fontSize: 16,
    fontWeight: 600,
    color: '#d1d1d1',
  },
  subContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmButtonContainer: {
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#222222',
  },
})

// {
//     "_creationTime":1727246494387.1406,
//     "_id":"jd787ftwaybwffnpfbjkns5yzn71ehag",
//     "bio":"Neuroscientist & Professor at Stanford School of Medicine. Host of Huberman Lab Podcast.",
//     "clerkId":"user_huberman123",
//     "email":"andrew@hubermanlab.com",
//     "first_name":"Andrew",
//     "followersCount":1200000,
//     "imageUrl":"https://pbs.twimg.com/profile_images/1339713932085346306/jDTi4HKH_400x400.jpg",
//     "last_name":"Huberman",
//     "location":"Stanford, CA",
//     "username":"hubermanlab",
//     "websiteUrl":"https://hubermanlab.com"
//  },
