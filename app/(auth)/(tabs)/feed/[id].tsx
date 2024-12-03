import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React from 'react'
import { Link, RelativePathString, useLocalSearchParams } from 'expo-router'
import Thread from '@/components/Thread'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { Colors } from '@/constants/Colors'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Image } from 'react-native'
import Comments from '@/components/Comments'

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const thread = useQuery(api.messages.getThreadById, {
    messageId: id as Id<'messages'>,
  })
  const { userProfile } = useUserProfile()
  return (
    <View style={styles.container}>
      <ScrollView>
        {thread ? (
          <Thread
            threadData={thread as Doc<'messages'> & { creator: Doc<'users'> }}
          />
        ) : (
          <ActivityIndicator />
        )}
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: '#4d4d4d',
          }}
        />
        <Comments messageId={id as Id<'messages'>} />
      </ScrollView>
      <View style={styles.border} />
      <Link href={`/(auth)/(modal)/reply/${id}` as RelativePathString} asChild>
        <TouchableOpacity style={styles.replyButton}>
          <Image
            source={{ uri: userProfile?.imageUrl as string }}
            style={styles.profileImage}
          />
          <Text style={{ color: '#f2f2f2' }}>
            Reply to {thread?.creator?.first_name} {thread?.creator?.last_name}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  border: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#505050',
    marginVertical: 2,
  },
  replyButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 100,
    margin: 10,
    backgroundColor: '#505050',
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 15,
  },
})
