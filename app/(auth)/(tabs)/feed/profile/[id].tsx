import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import Profile from '@/components/Profile'
import { Id } from '@/convex/_generated/dataModel'

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <Profile userId={id as Id<'users'>} showBackButton />
}
Page.options = {
  tabBarStyle: { display: 'none' },
}
export default Page
