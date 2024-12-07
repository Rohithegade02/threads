import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { useLocalSearchParams } from 'expo-router'
import React, { useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native'

type DropDownProfileProps = {
  visible: boolean
  onClose: () => void
  userId?: Id<'users'>
}

const { height } = Dimensions.get('window')

const DropDownProfile: React.FC<DropDownProfileProps> = ({
  userId,
  visible,
  onClose,
}) => {
  const translateY = useRef(new Animated.Value(height)).current
  const profile = useQuery(api.users.getUserById, {
    userId: userId as Id<'users'>,
  }) // Slide-up animation for modal
  const openModal = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }
  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose())
  }

  if (visible) openModal()

  return (
    <Modal transparent visible={visible} animationType='fade'>
      <TouchableOpacity style={styles.overlay} onPress={closeModal} />
      <Animated.View
        style={[styles.modalContent, { transform: [{ translateY }] }]}
      >
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: profile?.imageUrl, // Replace with user's avatar URL
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>
              {profile?.first_name} {profile?.last_name}
            </Text>
            <Text style={styles.userHandle}>{profile?.username}</Text>
            <Text style={styles.followers}>
              {profile?.followersCount} followers
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  )
}

export default DropDownProfile

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#101010',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userHandle: {
    fontSize: 14,
    color: '#a3a3a3',
  },
  followers: {
    fontSize: 12,
    color: '#a3a3a3',
  },
  followButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
  },
  followText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 14,
  },
})
