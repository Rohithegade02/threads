import { formatDistanceToNow } from 'date-fns'

export function formatTime(creationTime: string | number | Date) {
  return formatDistanceToNow(new Date(creationTime), { addSuffix: true })
}

//https://threads-d66e5.firebaseapp.com/__/auth/handler
