import sharp from 'sharp';
import { Client as MinioClient } from 'minio';

const minioClient = new MinioClient({
  endPoint: 'minio.mausvil.dev',
  port: 443,
  useSSL: true,
  accessKey: process.env.MINIO_ACCES_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const fileService = {
  compressImage: async (buffer: Buffer, { format = 'webp', sizes, quality = 80, rotate = 0, flop = false }: { format?: 'webp' | 'jpeg' | 'png', sizes: number[], quality?: number, rotate?: number, flop?: boolean }) => {
    const compressedImages = await Promise.all(
      sizes.map(async (size) => {
        return sharp(buffer)
          .resize(size)
          [format]({ quality: quality || 80 })
          .rotate(rotate)
          .flop(flop)
          .toBuffer();
      })
    );
    return compressedImages;
  },

  resizeImage: async (buffer: Buffer, width: number, height: number) => {
    const resizedImage = await sharp(buffer)
      .resize(width, height)
      .toBuffer();
    return resizedImage;
  },

  convertImage: async (buffer: Buffer, format: 'webp' | 'jpeg' | 'png' = 'webp', quality: number = 80) => {
    const convertedImage = await sharp(buffer)
      [format]({ quality: quality || 80 })
      .toBuffer();
    return convertedImage;
  },

  uploadImage: async (bucket: string, path: string, buffer: Buffer) => {
    await minioClient.putObject(bucket, path, buffer);
    const fileUrl = `https://minio.mausvil.dev/${bucket}/${path}`;
    return fileUrl;
  }
}