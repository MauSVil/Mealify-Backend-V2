import { Expo } from 'expo-server-sdk';

const expo = new Expo({
  useFcmV1: true,
});

export const pushNotificationService = {
  send: async (tokens: string[], title: string, body: string, data: Record<string, unknown> = {}) => {
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data,
    }));

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        console.log('Sending chunk');
        const resps = await expo.sendPushNotificationsAsync(chunk);
        console.log(resps);
      } catch (error) {
        console.error(error);
      }
    }
  },
}