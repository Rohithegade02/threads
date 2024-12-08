import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { Doc } from '@/convex/_generated/dataModel'
import { Image } from 'react-native'
import { Link, RelativePathString } from 'expo-router'

const ProfileSearchResult = ({ user }: { user: Doc<'users'> }) => {
  return (
    <View style={styles.container}>
      <Link href={`/search/profile/${user._id}` as RelativePathString} asChild>
        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={{ uri: user.imageUrl }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>
              {user.first_name} {user.last_name}
            </Text>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.followersCount}>
              {user.followersCount} followers
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  )
}

export default memo(ProfileSearchResult)

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d8d8d8',
  },
  username: {
    fontSize: 14,
    color: 'gray',
  },
  followersCount: {
    fontSize: 14,
    color: '#d8d8d8',
  },
  followButton: {
    padding: 6,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 10,
  },
  followButtonText: {
    color: '#E7E8EA',
    fontWeight: 'bold',
  },
  buttonContainer: { flexDirection: 'row', flex: 1, gap: 10 },
})
