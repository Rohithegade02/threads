import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { memo, useState } from 'react'
import { Image } from 'react-native'
import { Doc } from '@/convex/_generated/dataModel'

interface UnfollowModalProps {
  visible: boolean
  onRequestClose: (visible: boolean) => void
  profile: Doc<'users'>
  handleUnfollow: () => void
}

const UnfollowModal = ({
  visible,
  onRequestClose,
  profile,
  handleUnfollow,
}: UnfollowModalProps) => {
  const [isPressed, setIsPressed] = useState<boolean>(false) // Track if button is pressed

  // Handle press in and press out for button color change
  const handlePressIn = () => {
    setIsPressed(true)
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }
  const handleUnfollowWrap = () => {
    handleUnfollow()
    onRequestClose(false)
  }
  return (
    <Modal
      visible={visible}
      onRequestClose={() => onRequestClose(false)}
      transparent={true} // Ensure the modal background is transparent and doesn't cover the screen
      animationType='fade'
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image
            source={{ uri: profile?.imageUrl }}
            style={styles.profileImage}
          />

          <Text style={styles.modalTitle}>
            Unfollow{' '}
            <Text style={{ color: '#868686' }}>{profile?.username} ?</Text>
          </Text>
          <View style={{ width: '100%' }}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.unfollowButton, isPressed && styles.pressedButton]}
              onPress={handleUnfollowWrap}
            >
              <Text style={styles.unfollowButtonText}>Unfollow</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => onRequestClose(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default memo(UnfollowModal)

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background dim effect
  },
  modalView: {
    width: 300,
    backgroundColor: '#262626',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 16,
  },
  modalTitle: {
    color: '#484848',
    fontSize: 14,
  },
  modalDescription: {
    color: '#d1d1d1',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  unfollowButton: {
    width: '100%',
    borderRadius: 8,
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#4d4d4d',
    alignItems: 'center',
  },
  unfollowButtonText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  cancelButton: {
    width: '100%',
    borderRadius: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#4d4d4d',
    alignItems: 'center',
    padding: 10,
  },
  cancelButtonText: {
    color: '#f2f3f5',
    fontWeight: 'bold',
  },
  pressedButton: {
    backgroundColor: '#363636',
  },
})
