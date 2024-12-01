import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import Thread from '@/components/Thread'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const thread = useQuery(api.messages.getThreadById, {
    messageId: id as Id<'messages'>,
  })
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
      </ScrollView>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
})
