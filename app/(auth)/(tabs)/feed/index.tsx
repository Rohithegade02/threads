import {
  Dimensions,
  RefreshControl,
  StyleSheet,
  Text,
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
import Tabs from '@/components/Tabs'
import Loader from '@/components/Loader'

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

const Feed = () => {
  // Queries for threads
  const {
    results: forYouResults,
    loadMore: loadMoreForYou,
    isLoading,
  } = usePaginatedQuery(api.messages.getThreads, {}, { initialNumItems: 5 })
  const { results: followingResults, loadMore: loadMoreFollowing } =
    usePaginatedQuery(api.users.getFollowingThreads, {}, { initialNumItems: 5 })

  const tab = ['For you', 'Following']
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [tabChange, setTabChange] = useState(tab[0])
  const { top } = useSafeAreaInsets()
  const pathname = usePathname()
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
    if (tabChange === tab[0]) {
      loadMoreForYou(5)
    } else {
      loadMoreFollowing(5)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const handleTabChange = (e: string) => {
    setTabChange(e)
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#101010' }}>
      <AnimatedFlashList
        data={tabChange === tab[0] ? forYouResults : followingResults}
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
          isLoading ? (
            <View
              style={{
                paddingBottom: tabChange === tab[0] ? 10 : 0,
                marginTop: tabChange === tab[0] ? 60 : 0,
                marginHorizontal: tabChange === tab[0] ? 16 : 0,
              }}
            >
              <Loader heightStyle={180} />
            </View>
          ) : (
            <View style={{ paddingBottom: tabChange === tab[0] ? 32 : 0 }}>
              <Image
                source={require('@/assets/images/threads-logo-black.png')}
                style={{ width: 40, height: 40, alignSelf: 'center' }}
                tintColor={'#fff'}
              />
              <Tabs onTabChange={handleTabChange} tabs={tab} />
              {tabChange === tab[0] && <ThreadComposer isPreview />}
            </View>
          )
        }
        ListEmptyComponent={({ item = 5 }) => (
          <View key={item} style={{ gap: 10, flex: 1, marginHorizontal: 12 }}>
            <Loader heightStyle={220} widthStyle={true} />
            <Loader heightStyle={220} widthStyle={true} />
            <Loader heightStyle={220} widthStyle={true} />
            <Loader heightStyle={220} widthStyle={true} />
          </View>
        )}
      />
    </View>
  )
}

export default Feed

// const styles = StyleSheet.create({
//   followingHeader: {
//     fontSize: 16,
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   listEmpty: {
//     flex: 1,
//     height: 630,
//     backgroundColor: '#101010',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listEmptyText: {
//     color: '#4d4d4d',
//     fontSize: 16,
//     textAlign: 'center',
//     width: '70%',
//   },
// })
