import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { Stack } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import ProfileSearchResult from '@/components/ProfileSearchResult'
import { Colors } from '@/constants/Colors'

const Search = () => {
  const [search, setSearch] = useState('')
  const userList = useQuery(api.users.searchUsers, { search })
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Search',
          headerTitleStyle: {
            color: '#f2f2f2',
          },

          headerStyle: {
            backgroundColor: '#101010',
          },

          headerTitle: props => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: 'bold', color: '#f2f2f2' }}
              >
                {props.children}
              </Text>
            </View>
          ),
          headerSearchBarOptions: {
            placeholder: 'Search',
            onChangeText: event => setSearch(event.nativeEvent.text),
            textColor: '#fff',
            autoFocus: true,
            tintColor: '#fff',
            headerIconColor: '#fff',
            hintTextColor: '#fff',
            hideWhenScrolling: true,
            shouldShowHintSearchIcon: true,
            // onCancelButtonPress:()=>{}
          },
        }}
      />
      <FlashList
        data={userList}
        contentInsetAdjustmentBehavior='automatic'
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        renderItem={({ item }) => <ProfileSearchResult user={item} />}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No Users Found</Text>
        )}
      />
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101011',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 500,
    color: '#cecfd1',
  },
})
