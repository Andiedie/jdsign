import ax from '@/utils/ax.js';
import _ from 'lodash';

export default async () => {
  const jobName = '二手频道签到领京豆得京豆';
  const logs = [];
  const { data: signData } = await ax.post('https://api.m.jd.com/client.action', 'body=%7B%22geo%22%3A%7B%22lat%22%3A%2223.058278%22%2C%22lng%22%3A%22113.390629%22%7D%2C%22params%22%3A%22%7B%5C%22signId%5C%22%3A%5C%2210002096%5C%22%2C%5C%22ruleSrv%5C%22%3A%5C%2200124860_5976986_t1%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%7D%22%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidA38EC0143MTY6RkI6NTM6MTM6Mjg6Nw%3D%3DKMwmrBFTJSjP0XKZlBuIZGMLhiLqoh%2FGw%2FKVZb7uJOh6rbdKKtcz1V8wU6QF6HlWO1szLqeY07hr1rUL%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22shshshfpb%22%3A%221be19bd238cf94fb5bb770b456b68932fe4343b04d1061b995b10e52c5%22%7D%7D&', {
    params: {
      functionId: 'userSign',
      clientVersion: '7.0.4',
      client: 'android',
      uuid: '863654022301055-d07ab50ffca6',
      st: '1528133522360',
      sign: '50d5cf0e99fe2d7fe7e1bb039ac08ace',
      sv: '110'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  });
  if (signData.signText === '已签到') {
    logs.push(`[${jobName}] 已经签到，跳过任务`);
    return {logs};
  }
  if (signData.signText !== '签到成功') {
    logs.push(`[${jobName}] 未知错误：${signData.signText}`);
    return {logs};
  }
  const award = parseInt(_.takeWhile(signData.awardList, {type: 2})[0].text);
  logs.push(`[${jobName}] 获得${award}京豆`);
  return {
    jd: award,
    logs
  };
};
