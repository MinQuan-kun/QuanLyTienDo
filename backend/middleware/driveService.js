const { google } = require('googleapis');
const path = require('path');
const stream = require('stream');

const getAuthClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
    throw new Error('Chưa cấu hình API Key Google OAuth2 trong file .env');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
};

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

const getOrCreateFolder = async (drive, folderName, parentId) => {
  const q = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`;
  const res = await drive.files.list({ q, fields: 'files(id, name)' });
  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id;
  }
  const created = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  });
  return created.data.id;
};

/**
 * @param {Buffer} fileBuffer - nội dung file
 * @param {string} originalName - tên file gốc
 * @param {string} mimeType - MIME type
 * @returns {Promise<{fileId: string, fileName: string, webContentLink: string}>}
 */
const uploadFileToDrive = async (fileBuffer, originalName, mimeType, year = null, type = null) => {
  const auth = getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  let parentFolderId = FOLDER_ID;
  if (year && type) {
    const yearFolderId = await getOrCreateFolder(drive, String(year), FOLDER_ID);
    parentFolderId = await getOrCreateFolder(drive, type, yearFolderId);
  }

  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileBuffer);

  const response = await drive.files.create({
    requestBody: {
      name: originalName,
      parents: [parentFolderId],
    },
    media: {
      mimeType,
      body: bufferStream,
    },
    supportsAllDrives: true,
    fields: 'id, name, webContentLink, webViewLink',
  });

  const fileId = response.data.id;

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return {
    fileId,
    fileName: response.data.name,
    webContentLink: `https://drive.google.com/uc?export=download&id=${fileId}`,
    webViewLink: response.data.webViewLink,
  };
};

/**
 * Lấy file stream từ Drive để proxy download
 */
const getFileStream = async (fileId) => {
  const auth = getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  // Lấy metadata trước
  const meta = await drive.files.get({
    fileId,
    fields: 'name, mimeType, size',
  });

  // Lấy stream file
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  return {
    stream: response.data,
    name: meta.data.name,
    mimeType: meta.data.mimeType,
    size: meta.data.size,
  };
};

/**
 * Xóa file trên Drive
 */
const deleteFileFromDrive = async (fileId) => {
  try {
    const auth = getAuthClient();
    const drive = google.drive({ version: 'v3', auth });
    await drive.files.delete({ fileId });
  } catch (err) {
    console.warn('Không thể xóa file Drive:', err.message);
  }
};

module.exports = { uploadFileToDrive, getFileStream, deleteFileFromDrive };
