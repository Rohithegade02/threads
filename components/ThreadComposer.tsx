import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { Id } from '@/convex/_generated/dataModel'
import { Stack, useRouter } from 'expo-router'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Colors } from '@/constants/Colors'
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { generateUploadUrl } from '@/convex/users'

type ThreadComposerProps = {
  isPreview?: boolean
  isReply?: boolean
  threadId?: Id<'messages'>
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
  const [mediaFiles, setMediaFiles] = useState<ImagePicker.ImagePickerAsset[]>(
    [],
  )
  const addThread = useMutation(api.messages.addThreadMessage)
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl)

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const uploadMediaFile = async (image: ImagePicker.ImagePickerAsset) => {
    const postUrl = await generateUploadUrl()
    const response = await fetch(image!.uri)
    const blob = await response.blob()
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': image!.mimeType! },
      body: blob,
    })
    const { storageId } = await result.json()
    return storageId
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <TouchableOpacity onPress={cancelModal}>
                <Text>Cancel</Text>
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
            />
            {mediaFiles.length > 0 && (
              <ScrollView horizontal>
                {mediaFiles.map((file, index) => (
                  <View style={styles.mediaContainer} key={index}>
                    <Image
                      source={{ uri: file.uri }}
                      style={styles.mediaImage}
                    />
                    <TouchableOpacity
                      style={styles.deleteIconContainer}
                      onPress={() => {
                        setMediaFiles(mediaFiles.filter((_, i) => i !== index))
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
                <Ionicons
                  name='images-outline'
                  size={24}
                  color={Colors.border}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => selectImage('camera')}
              >
                <Ionicons
                  name='camera-outline'
                  size={24}
                  color={Colors.border}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name='gif' size={24} color={Colors.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name='mic-outline' size={24} color={Colors.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome6 name='hashtag' size={24} color={Colors.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons
                  name='stats-chart-outline'
                  size={24}
                  color={Colors.border}
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
            <Ionicons name='close' size={24} color={Colors.border} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.keyboardAccessory}>
        <Text style={styles.keyboardAccessorytext}>
          {isReply
            ? 'Everyone can reply and quote'
            : 'Profiles that you follow can reply and quote'}
        </Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    borderBottomColor: Colors.border,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
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
    backgroundColor: '#fff',
  },
  keyboardAccessorytext: {
    flex: 1,
    color: Colors.border,
  },
  keyboardAccessoryButton: {},
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  submitButtonText: {
    fontWeight: 'bold',
    color: '#fff',
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
})
