import axios from 'axios';
// import fs from 'fs';;
import qs from 'querystring';
import parseJsonp from 'parse-jsonp';
import nodeHttpAdapter from 'axios/lib/adapters/http';
const ax = axios.create();
ax.defaults.adapter = nodeHttpAdapter;

ax.interceptors.response.use(response => {
  // fs.appendFileSync('response.txt', `${JSON.stringify(response.data)}\n\n\n\n`);
  console.log('response', response.data);
  return response;
});

ax.getCookie = () => {
  ax.defaults.headers['Cookie'] = localStorage.getItem('cookie');
  const rawCookie = localStorage.getItem('cookie');
  return qs.parse(rawCookie, ';', '=', {decodeURIComponent: v => v});
};

ax.setCookie = (cookie) => {
  const rawCookie = qs.stringify(cookie, ';', '=', {encodeURIComponent: v => v});
  ax.defaults.headers['Cookie'] = rawCookie;
  localStorage.setItem('cookie', rawCookie);
};

ax.parseJsonp = parseJsonp;

ax.getCookie();

export default ax;
