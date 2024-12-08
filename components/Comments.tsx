import { StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Thread from './Thread'

type CommentsProps = {
  messageId: Id<'messages'>
}

const Comments = ({ messageId }: CommentsProps) => {
  const comments = useQuery(api.messages.getThreadComments, {
    messageId: messageId as Id<'messages'>,
  })
  return (
    <View>
      {comments?.map((comment, index) => (
        <React.Fragment key={index}>
          <Thread
            key={comment._id as string}
            threadData={
              comment as Doc<'messages'> & {
                creator: Doc<'users'>
              }
            }
          />
          {comments.length > index + 1 ? (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: '#4d4d4d',
              }}
            />
          ) : null}
        </React.Fragment>
      ))}
    </View>
  )
}

export default memo(Comments)

const styles = StyleSheet.create({})
