import ImageKit, { toFile } from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export const uploadFile = async ({ buffer, fileName }) => {
  const response = await client.files.upload({
    file: await toFile(buffer),
    fileName: fileName,
    folder: "E-COMM",
  });

  return response;
};

// delete single file imageKit
export const deleteFile = async (fileId) => {
  if (!fileId) {
    return;
  }

  return await client.files.delete(fileId);
};

// Bulk delete multiple files from ImageKit
export const deleteFiles = async (fileIds) => {
  if (!fileIds || fileIds.length === 0) return;
  return await client.files.bulk.delete({ fileIds });
};
