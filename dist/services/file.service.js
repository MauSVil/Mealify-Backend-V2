"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileService = void 0;
const sharp_1 = __importDefault(require("sharp"));
const minio_1 = require("minio");
const minioClient = new minio_1.Client({
    endPoint: 'minio.mausvil.dev',
    port: 443,
    useSSL: true,
    accessKey: process.env.MINIO_ACCES_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});
exports.fileService = {
    compressImage: (buffer_1, ...args_1) => __awaiter(void 0, [buffer_1, ...args_1], void 0, function* (buffer, format = 'webp', sizes, quality = 80) {
        const compressedImages = yield Promise.all(sizes.map((size) => __awaiter(void 0, void 0, void 0, function* () {
            return (0, sharp_1.default)(buffer)
                .resize(size)[format]({ quality: quality || 80 })
                .toBuffer();
        })));
        return compressedImages;
    }),
    resizeImage: (buffer, width, height) => __awaiter(void 0, void 0, void 0, function* () {
        const resizedImage = yield (0, sharp_1.default)(buffer)
            .resize(width, height)
            .toBuffer();
        return resizedImage;
    }),
    convertImage: (buffer_1, ...args_1) => __awaiter(void 0, [buffer_1, ...args_1], void 0, function* (buffer, format = 'webp', quality = 80) {
        const convertedImage = yield (0, sharp_1.default)(buffer)[format]({ quality: quality || 80 })
            .toBuffer();
        return convertedImage;
    }),
    uploadImage: (bucket, path, buffer) => __awaiter(void 0, void 0, void 0, function* () {
        yield minioClient.putObject(bucket, path, buffer);
        const fileUrl = `https://minio.mausvil.dev/${bucket}/${path}`;
        return fileUrl;
    })
};
