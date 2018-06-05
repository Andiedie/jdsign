import electron from 'electron';
import url from 'url';
const { BrowserWindow } = electron.remote;

let loginWin;
let isDone = false;
function createLoginWindow (cookieNeeded, cb) {
  loginWin = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    resizable: false,
    parent: electron.remote.getCurrentWindow(),
    modal: true
  });
  loginWin.loadURL('https://plogin.m.jd.com/user/login.action?appid=100');
  // loginWin.setMenu(null);
  loginWin.on('closed', () => {
    if (!isDone) cb(new Error('Not login'));
    loginWin = null;
  });
  loginWin.once('ready-to-show', () => {
    if (loginWin) loginWin.show();
  });
  loginWin.webContents.on('will-navigate', event => event.preventDefault());
  loginWin.webContents.on('new-window', event => event.preventDefault());
  loginWin.webContents.on('did-get-redirect-request', async (event, oldUrl, newUrl) => {
    const parsed = url.parse(newUrl);
    if (parsed.hostname === 'm.jd.com') {
      loginWin.webContents.session.cookies.get({
        domain: '.jd.com'
      }, (error, cookies) => {
        isDone = true;
        loginWin.close();
        if (error) return cb(error);
        const result = {};
        for (const cookie of cookies) {
          if (cookieNeeded.includes(cookie.name)) {
            result[cookie.name] = cookie.value;
          }
        }
        if (Object.keys(result).length !== cookieNeeded.length) {
          return cb(new Error('无法获取部分Cookie'));
        }
        cb(null, result);
      });
    }
  });
  return loginWin;
}

export default createLoginWindow;
