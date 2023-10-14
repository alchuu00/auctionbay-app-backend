import fs from 'fs';
import Logging from 'src/library/Logging';
import { diskStorage, Options } from 'multer';
import { extname } from 'path';

type validFileExtensionsType = 'png' | 'jpg' | 'jpeg'; // Define a type for valid file extensions
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg'; // Define a type for valid MIME types

const validFileExtensions: validFileExtensionsType[] = ['png', 'jpg', 'jpeg']; // Define an array of valid file extensions
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
]; // Define an array of valid MIME types

export const saveImageToStorage: Options = {
  storage: diskStorage({
    destination: './files', // Define the destination folder for uploaded files
    filename(req, file, callback) {
      // Create unique suffix
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      // Get file extension
      const ext = extname(file.originalname);
      // Write filename
      const filename = `${uniqueSuffix}${ext}`;

      callback(null, filename); // Call the callback function with the filename
    },
  }),
  fileFilter(req, file, callback) {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype as validMimeType)
      ? callback(null, true)
      : callback(null, false);
  },
};

export const isFileExtensionSafe = async (
  fullFilePath: string,
): Promise<boolean> => {
  const { fileTypeFromFile } = await import('file-type'); // Dynamically import the fileTypeFromFile function from the file-type package
  const fileTypeInfo = await fileTypeFromFile(fullFilePath); // Get the file type information for the given file path
  if (!fileTypeInfo) return false; // Return false if the file type information is not available

  const isFileTypeLegit = validFileExtensions.includes(
    fileTypeInfo.ext as validFileExtensionsType,
  ); // Check if the file extension is valid
  const isMimeTypeLegit = validMimeTypes.includes(
    fileTypeInfo.mime as validMimeType,
  ); // Check if the MIME type is valid
  const isFileLegit = isFileTypeLegit && isMimeTypeLegit; // Check if both the file extension and MIME type are valid
  return isFileLegit; // Return whether the file extension and MIME type are valid
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath); // Remove the file from the file system
  } catch (error) {
    Logging.error(error); // Log any errors that occur during file removal
  }
};
