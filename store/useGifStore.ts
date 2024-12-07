import { create } from 'zustand'

type GifStore = {
  selectedGif: string | null
  setSelectedGif: (gifUrl: string) => void
  clearSelectedGif: () => void
}

export const useGifStore = create<GifStore>(set => ({
  selectedGif: null,
  setSelectedGif: gifUrl => set({ selectedGif: gifUrl }),
  clearSelectedGif: () => set({ selectedGif: null }),
}))
