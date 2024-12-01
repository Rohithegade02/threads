import { Button, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { usePaginatedQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FlashList } from '@shopify/flash-list'
import { Colors } from '@/constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ThreadComposer from '@/components/ThreadComposer'
import { Image } from 'react-native'
import Thread from '@/components/Thread'
import { Doc } from '@/convex/_generated/dataModel'

const Feed = () => {
  const { results, loadMore, status } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    {
      initialNumItems: 5,
    },
  )
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const { top } = useSafeAreaInsets()

  const onLoadMore = () => {
    loadMore(5)
  }

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }
  return (
    <FlashList
      data={results}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Thread
          threadData={
            item as Doc<'messages'> & {
              creator: Doc<'users'>
            }
          }
        />
      )}
      keyExtractor={item => item._id}
      onEndReachedThreshold={0.5}
      onEndReached={onLoadMore}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingVertical: top }}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: Colors.border,
          }}
        />
      )}
      ListHeaderComponent={
        <View style={{ paddingBottom: 32 }}>
          <Image
            source={require('@/assets/images/threads-logo-black.png')}
            style={{ width: 40, height: 40, alignSelf: 'center' }}
          />
          <ThreadComposer isPreview />
        </View>
      }
    />
  )
}

export default Feed

const styles = StyleSheet.create({})
