import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Colors } from '@/constants/Colors'
import { Link } from 'expo-router'

type UserProfileProps = {
  userId?: string
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const profile = useQuery(api.users.getUserById, {
    userId: userId as Id<'users'>,
  })
  const { userProfile } = useUserProfile()
  const isSelf = userId === userProfile?._id
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileTextContainer}>
          <Text style={styles.name}>{profile?.first_name}</Text>
          <Text style={styles.username}>@{profile?.username}</Text>
        </View>
        <Image source={{ uri: profile?.imageUrl }} style={styles.image} />
      </View>
      <Text style={styles.bio}>{profile?.bio ?? 'No bio'}</Text>
      <Text>{profile?.websiteUrl ?? 'No Website'}</Text>
      <View style={styles.buttonRow}>
        {isSelf && (
          <>
            <Link
              href={{
                pathname: `/(auth)/(modal)/edit-profile`,
                params: {
                  userId: profile?._id,
                  imageUrl: profile?.imageUrl,
                  bioString: profile?.bio,
                  linkstring: profile?.websiteUrl,
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Share Profile</Text>
            </TouchableOpacity>
          </>
        )}
        {!isSelf && (
          <>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Mention</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

export default UserProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileTextContainer: {
    gap: 6,
  },
  username: {
    fontSize: 14,
    color: 'gray',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bio: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-evenly',
    marginTop: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  fullButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  fullButtonText: {
    fontWeight: 'medium',
    color: '#fff',
  },
})
