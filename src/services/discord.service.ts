import {
  Client,
  GatewayIntentBits,
  Channel,
  TextChannel,
} from 'discord.js';

interface DiscordServiceType {
  client: Client;
  channels: Map<string, TextChannel>;
  init: (token: string) => Promise<void>;
  addChannel: (name: string, channelId: string) => Promise<void>;
  sendMessage: (channelName: string, message: string) => Promise<void>;
  getChannel: (channelName: string) => TextChannel | undefined;
  isTextChannel: (channel: Channel) => channel is TextChannel;
}

class DiscordService implements DiscordServiceType {
  public client: Client;
  public channels: Map<string, TextChannel>;

  private static instance: DiscordService;

  private constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.channels = new Map();
  }

  public static getInstance(): DiscordService {
    if (!DiscordService.instance) {
      DiscordService.instance = new DiscordService();
    }
    return DiscordService.instance;
  }

  public async init(token: string): Promise<void> {
    if (this.client.isReady()) {
      console.log('Discord bot ya está conectado.');
      return;
    }
  
    try {
      await this.client.login(token);
  
      await new Promise<void>((resolve, reject) => {
        this.client.once('ready', () => {
          console.log('Discord bot está listo.');
          resolve();
        });
  
        setTimeout(() => reject(new Error('Discord bot no pudo conectarse a tiempo.')), 15000);
      });
    } catch (error) {
      console.error('Error conectando a Discord:', error);
      throw error;
    }
  }

  public async addChannel(name: string, channelId: string): Promise<void> {
    if (!this.client.isReady()) {
      throw new Error('El cliente de Discord no está listo.');
    }

    const channel = await this.client.channels.fetch(channelId);
    if (!channel) {
      throw new Error(`El canal con ID ${channelId} no existe o no está accesible.`);
    }

    if (this.isTextChannel(channel)) {
      this.channels.set(name, channel);
      console.log(`Canal ${name} conectado: ${channel.name}`);
    } else {
      throw new Error(`El canal con ID ${channelId} no es un canal de texto.`);
    }
  }

  public async sendMessage(channelName: string, message: string): Promise<void> {
    const channel = this.channels.get(channelName);
    if (!channel) {
      throw new Error(`El canal ${channelName} no está registrado.`);
    }
    await channel.send(message);
  }

  public getChannel(channelName: string): TextChannel | undefined {
    return this.channels.get(channelName);
  }

  public isTextChannel(channel: Channel): channel is TextChannel {
    return channel instanceof TextChannel;
  }
}

export const discordService = DiscordService.getInstance();
