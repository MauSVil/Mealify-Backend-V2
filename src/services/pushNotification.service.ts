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

    console.log({ messages });

    const chunks = expo.chunkPushNotifications(messages);

    console.log({ chunks });

    for (const chunk of chunks) {
      try {
        console.log('Sending chunk');
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error(error);
      }
    }
  },
}