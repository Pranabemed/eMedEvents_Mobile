import RNFS from 'react-native-fs';

export const MAX_UPLOAD_FILE_SIZE_BYTES = 2 * 1024 * 1024;
export const FILE_SIZE_ERROR = 'Please use normal files under 2 MB, since larger files are rejected by the application itself.';

export const getUploadFileSize = async file => {
    const pickerSize = Number(file?.size || 0);
    if (pickerSize > 0) return pickerSize;

    const fileUri = file?.uri || file?.path;
    if (!fileUri) return 0;

    try {
        const filePath = String(fileUri).replace(/^file:\/\//, '');
        const stat = await RNFS.stat(filePath);
        return Number(stat?.size || 0);
    } catch (error) {
        console.log('Unable to read selected file size:', error);
        return 0;
    }
};

export const isUploadFileSizeValid = async (file, maxBytes = MAX_UPLOAD_FILE_SIZE_BYTES) => {
    const fileSize = await getUploadFileSize(file);
    return fileSize > 0 && fileSize <= maxBytes;
};
