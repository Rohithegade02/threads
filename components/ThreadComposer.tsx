import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Id } from '@/convex/_generated/dataModel'
import { Link, Stack, useRouter } from 'expo-router'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { generateUploadUrl } from '@/convex/users' //for edit purpose
import { useGifStore } from '@/store/useGifStore'
import { Image } from 'expo-image'

type ThreadComposerProps = {
  isPreview?: boolean
  isReply?: boolean
  threadId?: Id<'messages'>
}
type MediaFile = {
  uri: string
  mimeType?: string
}
const ThreadComposer = ({
  isPreview,
  isReply,
  threadId,
}: ThreadComposerProps) => {
  const router = useRouter()
  const inputAccessoryViewID = 'uniqueId'
  const [threadContent, setThreadContent] = useState('')
  const { userProfile } = useUserProfile()
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const addThread = useMutation(api.messages.addThreadMessage)
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl)
  //store
  const selectedGif = useGifStore(state => state.selectedGif)
  const clearSelectedGif = useGifStore(state => state.clearSelectedGif)
  const handleSubmit = async () => {
    const mediaIds = await Promise.all(mediaFiles.map(uploadMediaFile))
    addThread({
      threadId,
      content: threadContent,
      mediaFiles: mediaIds,
    })
    setThreadContent('')
    setMediaFiles([])
    router.dismiss()
  }

  const removeThread = useCallback(() => {
    setThreadContent('')
    setMediaFiles([])
  }, [])

  const cancelModal = () => {
    setThreadContent('')
    Alert.alert('Discard thread ?', '', [
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => router.dismiss(),
      },
      {
        text: 'Save draft',
        style: 'cancel',
      },
    ])
  }

  const selectImage = async (source: 'camera' | 'library') => {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    }

    let result

    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync()

      result = await ImagePicker.launchCameraAsync(options)
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options)
    }

    if (!result.canceled) {
      setMediaFiles([result.assets[0], ...mediaFiles])
    }
  }
  const handleGifSelection = (gifUrl: string) => {
    setMediaFiles([
      ...mediaFiles,
      {
        uri: gifUrl,
        mimeType: 'image/gif',
      },
    ])
  }

  useEffect(() => {
    if (selectedGif) {
      setMediaFiles(prev => [
        ...prev,
        { uri: selectedGif, mimeType: 'image/gif' },
      ])
      clearSelectedGif()
    }
  }, [selectedGif, clearSelectedGif])

  const uploadMediaFile = async (file: MediaFile) => {
    const postUrl = await generateUploadUrl()
    const response = await fetch(file.uri)
    const blob = await response.blob()
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.mimeType! },
      body: blob,
    })
    const { storageId } = await result.json()
    return storageId
  }

  return (
    <TouchableOpacity
      style={[
        { flex: 1 },
        isPreview && {
          pointerEvents: 'box-only',
          right: 0,
          top: 0,
          bottom: 0,
          height: 100,
        },
      ]}
      onPress={() => router.push('/(auth)/(modal)/create')}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#101010' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <Stack.Screen
          options={{
            headerRight: () => {
              return (
                <TouchableOpacity onPress={cancelModal}>
                  <Text style={{ color: '#f2f2f2' }}>Cancel</Text>
                </TouchableOpacity>
              )
            },
          }}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.topRow}>
            {userProfile && (
              <Image
                source={{ uri: userProfile?.imageUrl ?? '' }}
                style={styles.avatar}
              />
            )}
            <View style={styles.centerContainer}>
              <Text style={styles.name}>
                {userProfile?.first_name} {userProfile?.last_name}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={isReply ? 'Reply to thread' : `What's new ?`}
                value={threadContent}
                onChangeText={setThreadContent}
                multiline
                autoFocus={!isPreview}
                inputAccessoryViewID={inputAccessoryViewID}
                placeholderTextColor={'#454545'}
              />
              {mediaFiles.length > 0 && (
                <ScrollView horizontal>
                  {mediaFiles.map((file, index) => (
                    <View style={styles.mediaContainer} key={index}>
                      <Image
                        autoplay
                        source={{ uri: file.uri }}
                        style={styles.mediaImage}
                      />
                      <TouchableOpacity
                        style={styles.deleteIconContainer}
                        onPress={() => {
                          setMediaFiles(
                            mediaFiles.filter((_, i) => i !== index),
                          )
                        }}
                      >
                        <Ionicons name='close' size={16} color={'#fff'} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => selectImage('library')}
                >
                  <Ionicons name='images-outline' size={24} color={'#4d4d4d'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => selectImage('camera')}
                >
                  <Ionicons name='camera-outline' size={24} color={'#4d4d4d'} />
                </TouchableOpacity>
                <Link
                  href={{
                    pathname: '/(auth)/(modal)/gif',
                  }}
                  onPress={handleGifSelection}
                  asChild
                >
                  <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name='gif' size={24} color={'#4d4d4d'} />
                  </TouchableOpacity>
                </Link>

                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name='mic-outline' size={24} color={'#4d4d4d'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <FontAwesome6 name='hashtag' size={24} color={'#4d4d4d'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons
                    name='stats-chart-outline'
                    size={24}
                    color={'#4d4d4d'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  opacity: isPreview ? 0 : 1,
                },
              ]}
              onPress={removeThread}
            >
              <Ionicons name='close' size={24} color={'#4d4d4d'} />
            </TouchableOpacity>
          </View>
        </View>
        {!isPreview && (
          <View style={styles.keyboardAccessory}>
            <Text style={styles.keyboardAccessorytext}>
              {isReply
                ? 'Everyone can reply and quote'
                : 'Profiles that you follow can reply and quote'}
            </Text>
            <TouchableOpacity
              onPress={threadContent.length <= 0 ? undefined : handleSubmit}
              style={
                threadContent.length <= 0
                  ? styles.disabledButton
                  : styles.submitButton
              }
            >
              <Text style={styles.submitButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableOpacity>
  )
}

export default ThreadComposer

const styles = StyleSheet.create({
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#4d4d4d',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#cecfd1',
  },
  centerContainer: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
    color: '#505050',
  },
  iconRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  iconButton: {
    marginRight: 16,
  },
  button: {},
  keyboardAccessory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingLeft: 64,
    backgroundColor: '#101010',
  },
  keyboardAccessorytext: {
    flex: 1,
    color: '#505050',
  },
  keyboardAccessoryButton: {},
  submitButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  submitButtonText: {
    fontWeight: 'bold',
    color: '#101010',
  },
  mediaImage: {
    width: 100,
    height: 200,
    borderRadius: 6,
    marginRight: 10,
    marginTop: 10,
  },
  mediaContainer: {
    marginRight: 10,
    marginTop: 10,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#535346',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
})
