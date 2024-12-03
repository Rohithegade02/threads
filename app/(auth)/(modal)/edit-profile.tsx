import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Colors } from '@/constants/Colors'
import * as ImagePicker from 'expo-image-picker'

const EditProfile = () => {
  const { bioString, imageUrl, linkstring, userId, name } =
    useLocalSearchParams<{
      bioString: string
      imageUrl: string
      linkstring: string
      userId: string
      name: string
    }>()

  console.log(name)
  const [bio, setBio] = useState(bioString)
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null)
  const [link, setLink] = useState(linkstring)

  const updateUser = useMutation(api.users.updateUser)
  const router = useRouter()

  const onDone = async () => {
    await updateUser({
      _id: userId as Id<'users'>,
      bio,
      websiteUrl: link,
    })
    router.dismiss()
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    })
    if (!result.canceled) setSelectedImage(result.assets[0])
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={onDone}>
              <Text style={{ color: '#E3E5E7' }}>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.editContainer}>
        <View style={styles.nameContainer}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#DEE0E1', fontWeight: 600 }}>Name</Text>
            <TextInput
              value={name}
              style={styles.bioInput}
              placeholder=''
              editable={false}
            />
            <View
              style={{
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: '#303030',
                marginTop: -5,
              }}
            />
          </View>
          {selectedImage ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          ) : (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          )}
        </View>
        <View>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            value={bio}
            numberOfLines={4}
            onChangeText={setBio}
            style={styles.bioInput}
            placeholder=''
            autoFocus={true}
          />
          <View
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: '#303030',
              marginTop: -5,
            }}
          />
        </View>
        <View>
          <Text style={styles.label}>Link</Text>
          <TextInput
            value={link}
            numberOfLines={4}
            onChangeText={setLink}
            // style={styles.bioInput}
            placeholder='+ Add Link'
            placeholderTextColor={'#4b4b4b'}
            autoCapitalize='none'
            autoFocus={true}
          />
          <View
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: '#303030',
              marginTop: -5,
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 16,
    justifyContent: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DEE0E1',
  },
  bioInput: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A6A6A6',
  },
  editContainer: {
    backgroundColor: '#181818',
    minHeight: 300,
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 8,
    padding: 16,
    gap: 20,
  },
  nameContainer: {
    // flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',

    padding: 0,
  },
})
