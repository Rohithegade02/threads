import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { gifData } from '@/constants/gif'
import { useRouter } from 'expo-router'
import { useGifStore } from '@/store/useGifStore'
import { Image } from 'expo-image'

const GifComponent: React.FC = () => {
  const router = useRouter()
  const setSelectedGif = useGifStore(state => state.setSelectedGif)

  const handleSelectGif = (gifUrl: string) => {
    setSelectedGif(gifUrl)
    router.back()
  }
  const renderGifRow = () => {
    return gifData.map((gif, index) => {
      return (
        <TouchableOpacity key={index} onPress={() => handleSelectGif(gif.url)}>
          <View style={styles.gifContainer}>
            <Image
              autoplay={true}
              source={{ uri: gif.url }}
              style={styles.gif}
            />
          </View>
        </TouchableOpacity>
      )
    })
  }

  return <View style={styles.container}>{renderGifRow()}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#101010',
  },
  gifContainer: {
    margin: 8,
  },
  gif: {
    width: 110,
    height: 100,
    borderRadius: 10,
  },
})

export default GifComponent
