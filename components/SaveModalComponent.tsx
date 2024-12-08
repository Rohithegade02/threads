import { Doc } from '@/convex/_generated/dataModel'
import React, { memo, useRef } from 'react'
import {
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import { MaterialIcons } from '@expo/vector-icons'
import * as MediaLibrary from 'expo-media-library'

type SaveModalProps = {
  visible: boolean
  onClose: () => void
  threadData: Doc<'messages'> & {
    creator: Doc<'users'>
  }
}

const { height } = Dimensions.get('window')

const SaveModal: React.FC<SaveModalProps> = ({
  visible,
  onClose,
  threadData,
}) => {
  const translateY = useRef(new Animated.Value(height)).current

  const openModal = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }
  console.log(threadData)
  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose())
  }

  if (visible) openModal()

  const downloadImage = async () => {
    if (!threadData.mediaFiles || threadData.mediaFiles.length === 0) {
      console.warn('No media files to download.')
      return
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'We need access to your media library to save files.',
        )
        return
      }

      for (const file of threadData.mediaFiles) {
        const fileName = file.split('/').pop() || 'file'
        const fileExtension = fileName.includes('.') ? '' : '.jpg'
        const fileUri = `${FileSystem.documentDirectory}${fileName}${fileExtension}`
        const { uri } = await FileSystem.downloadAsync(file, fileUri)
        const asset = await MediaLibrary.createAssetAsync(uri)
        await MediaLibrary.createAlbumAsync('threadAppFiles', asset, false)
        Alert.alert(`File saved to gallery: ${asset.uri}`)
        onClose()
      }
    } catch (error) {
      console.error('Error saving file to gallery:', error)
    }
  }

  return (
    <Modal
      transparent
      onDismiss={closeModal}
      visible={visible}
      animationType='fade'
    >
      <TouchableOpacity style={styles.overlay} onPress={closeModal} />
      <Animated.View
        style={[styles.modalContent, { transform: [{ translateY }] }]}
      >
        <View style={styles.profileHeader}>
          <Text style={styles.saveText}>Save</Text>
          <TouchableOpacity onPress={downloadImage}>
            <MaterialIcons name='bookmark-outline' size={24} color='#cacaca' />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  )
}

export default memo(SaveModal)

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
    backgroundColor: '#262626',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
    backgroundColor: '#2F2F2F',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 16,
    color: '#dadada',
    fontWeight: '600',
  },
})
