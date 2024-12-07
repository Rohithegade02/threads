import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Colors } from '@/constants/Colors'
import { Link } from 'expo-router'
import UnfollowModal from './UnfollowModal'
import useFollowStore from '@/store/useFollowStore'

type UserProfileProps = {
  userId?: string
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const profile = useQuery(api.users.getUserById, {
    userId: userId as Id<'users'>,
  })
  const { userProfile } = useUserProfile()
  const isSelf = userId === userProfile?._id
  const followUserMutation = useMutation(api.users.followUser)
  const unfollowUserMutation = useMutation(api.users.unfollowUser)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const followStatus = useQuery(api.users.getFollowStatus, {
    followerId: userProfile?._id as Id<'users'>,
    followingId: profile?._id as Id<'users'>,
  })
  const { followStatus: isFollowing, setFollowStatus } = useFollowStore()

  useEffect(() => {
    if (followStatus) {
      setFollowStatus(followStatus.isFollowing)
    }
  }, [followStatus])

  const handleFollow = async () => {
    try {
      if (userProfile?._id && profile?._id) {
        await followUserMutation({
          followerId: userProfile._id,
          followingId: profile._id,
        })
        setFollowStatus(true)
      }
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  const handleUnfollow = async () => {
    try {
      if (userProfile?._id && profile?._id) {
        await unfollowUserMutation({
          followerId: userProfile._id,
          followingId: profile._id,
        })
        setFollowStatus(false)
      }
    } catch (error) {
      console.error('Error unfollowing user:', error)
    }
  }

  const handleModal = useCallback(() => {
    setModalOpen(!modalOpen)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileTextContainer}>
          <Text style={styles.name}>{profile?.first_name}</Text>
          <Text style={styles.username}>@{profile?.username}</Text>
        </View>
        <Image
          source={{ uri: profile?.imageUrl as string }}
          style={styles.image}
        />
      </View>
      <Text style={styles.bio}>{profile?.bio ?? 'No bio'}</Text>
      <Text style={{ color: '#f2f3f5' }}>
        {`${profile?.followersCount} Followers`}
        {'  '}•{'  '}
        {profile?.websiteUrl ?? 'No Website'}
      </Text>
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
                  name: `${profile?.first_name + profile?.last_name!}`,
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
            {isFollowing ? (
              <TouchableOpacity style={styles.fullButton} onPress={handleModal}>
                <Text style={styles.followingText}>Following</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.followButton}
                onPress={handleFollow}
              >
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Mention</Text>
            </TouchableOpacity>
          </>
        )}
        {modalOpen && (
          <UnfollowModal
            profile={profile}
            visible={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            handleUnfollow={handleUnfollow}
          />
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
    color: '#f2f3f5',
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
    color: '#f2f3f5',
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
    padding: 6,
    borderWidth: 1,
    borderColor: '#4d4d4d',
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#d1d1d1',
  },
  fullButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    backgroundColor: '#101010',
    borderRadius: 8,
  },
  fullButtonText: {
    fontWeight: 'medium',
    color: '#e0e2e2',
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F4F5F7',
    borderRadius: 8,
  },
  followText: {
    color: '#616364',
    fontWeight: '500',
  },
  followingText: {
    color: '#2C2C2C',
    fontWeight: '500',
  },
})
