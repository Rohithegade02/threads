import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
  const [mediaFiles, setMediaFiles] = useState<string[]>([])
  const addThread = useMutation(api.messages.addThreadMessage)

  const handleSubmit = async () => {
    addThread({
      threadId,
      content: threadContent,
    })
    setThreadContent('')
    setMediaFiles([])
    router.dismiss()
  }
  const removeThread = useCallback(() => {
    setThreadContent('')
    setMediaFiles([])
  }, [])
  const selectImage = (type: 'library' | 'camera') => {
    console.log(type)
  }
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
})
