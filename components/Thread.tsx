import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React from 'react'
import { Doc } from '@/convex/_generated/dataModel'
import { formatTime } from '@/utils/dateTime'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Link, RelativePathString } from 'expo-router'

type ThreadProps = {
  threadData: Doc<'messages'> & {
    creator: Doc<'users'>
  }
}
const Thread = ({ threadData }: ThreadProps) => {
  const {
    mediaFiles,
    likeCount,
    commentCount,
    retweetCount,
    creator,
    content,
  } = threadData

  const likeThread = useMutation(api.messages.likeThread)
  return (
    <View style={styles.container}>
      <Image source={{ uri: creator.imageUrl }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 6 }}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Link
              href={
                `/feed/profile/${encodeURIComponent(creator._id)}` as RelativePathString
              }
              asChild
            >
              <Text style={styles.headerTextName}>
                {creator.first_name} {creator.last_name}
              </Text>
            </Link>
            <Text style={styles.timestamp}>
              {formatTime(threadData._creationTime)}
            </Text>
          </View>
          <Ionicons name='ellipsis-horizontal' size={24} color={'#616161'} />
        </View>
        <Text style={styles.contentText}>{content}</Text>
        {mediaFiles && mediaFiles.length > 0 && (
          <ScrollView
            contentContainerStyle={styles.mediaContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {mediaFiles.map((imageUrl, index) => (
              <Link
                asChild
                href={
                  `(modal)/image/${encodeURIComponent(imageUrl)}` as RelativePathString
                }
                key={index}
              >
                <TouchableOpacity>
                  <Image source={{ uri: imageUrl }} style={styles.mediaImage} />
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => likeThread({ threadId: threadData._id })}
          >
            <Ionicons name='heart-outline' size={24} color='#616161' />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name='chatbubble-outline' size={24} color='#616161' />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name='repeat-outline' size={24} color='#616161' />
            <Text style={styles.actionText}>{retweetCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name='send' size={22} color='#616161' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Thread

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextName: {
    fontWeight: 'bold',
    marginRight: 5,
    gap: 4,
    alignItems: 'center',
    color: '#D3D4D6',
  },
  timestamp: {
    color: '#4a4a4a',
    fontSize: 12,
  },
  contentText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#D3D4D6',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#949494',
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  mediaContainer: {
    gap: 12,
  },
})
