import {
  Client,
  GatewayIntentBits,
  Channel,
  TextChannel,
} from 'discord.js';

interface DiscordServiceType {
  client: Client | null;
  channels: Map<string, TextChannel>;
  init: (token: string) => Promise<void>;
  addChannel: (name: string, channelId: string) => void;
  sendMessage: (channelName: string, message: string) => Promise<void>;
  getChannel: (channelName: string) => TextChannel | undefined;
  isTextChannel: (channel: Channel) => channel is TextChannel; // Agregado aquí
}

export const discordService: DiscordServiceType = {
  client: null,
  channels: new Map(),

  async init(token: string): Promise<void> {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    try {
      await this.client.login(token);
      console.log('Discord bot conectado');

      // Manejo de mensajes
      this.client.on('messageCreate', (message) => {
        if (message.author.bot) return; // Ignorar mensajes de otros bots
        console.log(`[${message.channel?.id}] ${message.author.tag}: ${message.content}`);
      });
    } catch (error) {
      console.error('Error conectando a Discord:', error);
      throw error;
    }
  },

  addChannel(name: string, channelId: string): void {
    if (!this.client) throw new Error('El cliente de Discord no está inicializado.');

    const channel = this.client.channels.cache.get(channelId);
    if (!channel) throw new Error(`El canal con ID ${channelId} no existe o no está accesible.`);

    if (this.isTextChannel(channel)) {
      this.channels.set(name, channel);
      console.log(`Canal ${name} conectado: ${channel.name}`);
    } else {
      throw new Error(`El canal con ID ${channelId} no es un canal de texto.`);
    }
  },

  async sendMessage(channelName: string, message: string): Promise<void> {
    const channel = this.channels.get(channelName);
    if (!channel) throw new Error(`El canal ${channelName} no está registrado.`);
    await channel.send(message);
  },

  getChannel(channelName: string): TextChannel | undefined {
    return this.channels.get(channelName);
  },

  isTextChannel(channel: Channel): channel is TextChannel {
    return channel instanceof TextChannel;
  },
};
