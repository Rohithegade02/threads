import React, { memo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

type TabsProps = {
  onTabChange: (tab: string) => void
  tabs: string[]
}

const Tabs = ({ onTabChange, tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0])

  const handleTabPress = (tab: string) => {
    setActiveTab(tab)
    onTabChange(tab)
  }

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => handleTabPress(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#4e4e4e',
    paddingVertical: 12,
  },
  tabText: {
    color: '#4e4e4e',
  },
  activeTabText: {
    color: '#cecece',
    fontWeight: 'bold',
  },
  activeTab: {
    borderBottomColor: '#cecece',
  },
})

export default memo(Tabs)
