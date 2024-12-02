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
  const { bioString, imageUrl, linkstring, userId } = useLocalSearchParams<{
    bioString: string
    imageUrl: string
    linkstring: string
    userId: string
  }>()
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
    <View>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={onDone}>
              <Text>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TouchableOpacity onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          numberOfLines={4}
          onChangeText={setBio}
          style={styles.bioInput}
          placeholder=''
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={link}
          numberOfLines={4}
          onChangeText={setLink}
          // style={styles.bioInput}
          placeholder='https://www.example.com'
          autoCapitalize='none'
        />
      </View>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  section: {
    margin: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    padding: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 80,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bioInput: {
    fontSize: 14,
    fontWeight: '500',
  },
})
