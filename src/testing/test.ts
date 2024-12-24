import { readFileSync } from 'fs';
import { fileService } from '../services/file.service';

const init = async () => {
  const file = await readFileSync('src/testing/burger.jpg');
  const sizes = [200, 400, 800];
  const extension = 'webp';
  const compressedFiles = await fileService.compressImage(file, extension, sizes);

  compressedFiles.forEach(async (compessedFile, idx) => {
    await fileService.uploadImage('businesses', `12345/image-${sizes[idx]}.${extension}`, compessedFile);
  })
};

init();