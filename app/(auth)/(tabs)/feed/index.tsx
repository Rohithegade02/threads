import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaginatedQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ThreadComposer from '@/components/ThreadComposer'
import { Image } from 'react-native'
import Thread from '@/components/Thread'
import { Doc } from '@/convex/_generated/dataModel'
import {
  Link,
  RelativePathString,
  useNavigation,
  usePathname,
} from 'expo-router'
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useIsFocused } from '@react-navigation/native'

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

const Feed = () => {
  const { results, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    {
      initialNumItems: 5,
    },
  )
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const { top } = useSafeAreaInsets()
  const pathname = usePathname()
  //Animation
  const navigation = useNavigation()
  const scrollOffset = useSharedValue(0)
  const tabBarHeight = useBottomTabBarHeight()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (pathname !== '/feed') {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          marginBottom: 0,
        },
      })
    }
  }, [pathname, navigation])

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
    loadMore(5)
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
        <Link
          href={`/(auth)/(tabs)/feed/${item._id}` as RelativePathString}
          asChild
        >
          <TouchableOpacity>
            <Thread
              threadData={
                item as Doc<'messages'> & {
                  creator: Doc<'users'>
                }
              }
            />
          </TouchableOpacity>
        </Link>
      )}
      estimatedItemSize={167}
      keyExtractor={(item: any) => item._id}
      onEndReachedThreshold={0.5}
      onEndReached={onLoadMore}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{
        paddingVertical: top,
        backgroundColor: '#101010',
      }}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: '#4d4d4d',
          }}
        />
      )}
      ListHeaderComponent={
        <View style={{ paddingBottom: 32 }}>
          <Image
            source={require('@/assets/images/threads-logo-black.png')}
            style={{ width: 40, height: 40, alignSelf: 'center' }}
            tintColor={'#fff'}
          />
          <ThreadComposer isPreview />
        </View>
      }
    />
  )
}

export default Feed

const styles = StyleSheet.create({})
