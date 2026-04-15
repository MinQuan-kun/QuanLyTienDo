require('dotenv').config();
const { uploadFileToDrive } = require('./middleware/driveService');

(async () => {
  try {
    const buffer = Buffer.from('Hello world!', 'utf8');
    const result = await uploadFileToDrive(buffer, 'test2.txt', 'text/plain');
    console.log('Upload OK!', result);
  } catch (err) {
    console.error('Upload Error:', err);
  }
})();
