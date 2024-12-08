import React, { memo } from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { gifData } from '@/constants/gif'

interface GifComponentProps {
  onSelectGif: (gifUrl: string) => void
}

const GifComponent: React.FC<GifComponentProps> = ({ onSelectGif }) => {
  const renderGifRow = () => {
    return gifData.map((gif, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onSelectGif(gif.url)} // Call onSelectGif when a GIF is clicked
        >
          <View style={styles.gifContainer}>
            <Image source={{ uri: gif.url }} style={styles.gif} />
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

export default memo(GifComponent)
