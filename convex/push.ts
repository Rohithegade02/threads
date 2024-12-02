import { v } from 'convex/values'
import { internalAction } from './_generated/server'

const EXPO_ACCESS_TOKEN = process.env.EXPO_ACCESS_TOKEN

export const sendPushNotifications = internalAction({
  args: {
    pushToken: v.string(),
    messageTitle: v.string(),
    messageBody: v.string(),
    threadId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    console.log('Sending', args)
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${EXPO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: args.pushToken,
        sound: 'default',
        title: args.messageTitle,
        body: args.messageBody,
        data: {
          threadId: args.threadId,
        },
      }),
    }).then(res => res.json())
    console.log('Push Notification res', res)
    return res
  },
})
