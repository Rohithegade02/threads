import { RefreshControl, StyleSheet, View } from 'react-native'
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
import { useNavigation } from 'expo-router'
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useIsFocused } from '@react-navigation/native'

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

const Feed = () => {
  const { results, loadMore, status } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    {
      initialNumItems: 1,
    },
  )
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const { top } = useSafeAreaInsets()

  //Animation
  const navigation = useNavigation()
  const scrollOffset = useSharedValue(0)
  const tabBarHeight = useBottomTabBarHeight()
  const isFocused = useIsFocused()

  const updateTabBar = () => {
    let newMarginBottom = 0
    if (scrollOffset.value >= 0 && scrollOffset.value <= tabBarHeight) {
      newMarginBottom = -scrollOffset.value
    } else if (scrollOffset.value > tabBarHeight) {
      newMarginBottom = -tabBarHeight
    }
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        marginBottom: newMarginBottom,
      },
    })
  }
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      if (isFocused) {
        scrollOffset.value = event.contentOffset.y
        runOnJS(updateTabBar)()
      }
    },
  })

  const onLoadMore = () => {
    loadMore(1)
  }

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }
  return (
    <AnimatedFlashList
      data={results}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
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
      estimatedItemSize={167}
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
