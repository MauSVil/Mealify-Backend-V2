import { Expo } from 'expo-server-sdk';

const expo = new Expo({
  useFcmV1: true,
});

export const pushNotificationService = {
  send: async (tokens: string[], title: string, body: string) => {
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
    }));

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error(error);
      }
    }
  },
}