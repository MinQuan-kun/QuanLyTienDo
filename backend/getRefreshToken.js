const { google } = require('googleapis');
const http = require('http');
const url = require('url');
require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("LỖI: Vui lòng thêm GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET vào file .env trước!");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES,
});

console.log('====================================================');
console.log('🔗 HÃY CLICK VÀO LINK SAU BẰNG TRÌNH DUYỆT ĐỂ CẤP QUYỀN:');
console.log(authUrl);
console.log('====================================================\n');

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.indexOf('/oauth2callback') > -1) {
      const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
      const code = qs.get('code');

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Hoàn tất! Bạn có thể tắt tab này và quay lại kiểm tra Terminal ở VS Code.</h1>');

      const { tokens } = await oauth2Client.getToken(code);
      console.log('\n✅ CẤP QUYỀN THÀNH CÔNG! Hãy dán dòng dưới đây vào file .env:\n');
      console.log(`GOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"\n`);

      process.exit(0);
    }
  } catch (e) {
    console.error('Lỗi khi lấy token:', e.message);
    res.end('Lỗi');
    process.exit(1);
  }
});

server.listen(3000, () => {
  console.log('⏳ Đang chờ bạn đăng nhập và cấp quyền...');
});
