import { create } from 'zustand'

interface FollowStore {
  followStatus: boolean
  setFollowStatus: (status: boolean) => void
}

const useFollowStore = create<FollowStore>(set => ({
  followStatus: false,
  setFollowStatus: status => set({ followStatus: status }),
}))

export default useFollowStore
