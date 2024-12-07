import { StyleSheet, View } from 'react-native'
import React from 'react'
import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useQuery } from 'convex/react'
import { useLocalSearchParams } from 'expo-router'
import Thread from '@/components/Thread'
import { ActivityIndicator } from 'react-native'
import ThreadComposer from '../create'

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const thread = useQuery(api.messages.getThreadById, {
    messageId: id as Id<'messages'>,
  })
  const { userProfile } = useUserProfile()
  return (
    <View style={{ flex: 1 }}>
      {thread ? (
        <Thread
          threadData={thread as Doc<'messages'> & { creator: Doc<'users'> }}
        />
      ) : (
        <ActivityIndicator />
      )}
      <ThreadComposer isReply threadId={id as Id<'messages'>} />
    </View>
  )
}

export default Page

const styles = StyleSheet.create({})
