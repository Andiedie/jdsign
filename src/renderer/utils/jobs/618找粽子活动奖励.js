import ax from '@/utils/ax.js';
import _ from 'lodash';

export default async () => {
  const jobName = '618找粽子活动奖励';
  const logs = [];
  let total = 0;
  do {
    let { data: signData } = await ax.post('https://api.m.jd.com/client.action', 'body=%7B%22shshshfp%22%3A%22-1%22%2C%22referUrl%22%3A%22-1%22%2C%22linkUrl%22%3A%22https%3A%2F%2Fshop.m.jd.com%2F%3FshopId%3D74733%22%2C%22shshshfpa%22%3A%22-1%22%2C%22shshshfpb%22%3A%221be19bd238cf94fb5bb770b456b68932fe4343b04d1061b995b10e52c5%22%2C%22userAgent%22%3A%22-1%22%2C%22rnVersion%22%3A%224.2%22%2C%22shareMark%22%3A%22%22%2C%22eid%22%3A%22eidA38EC0143MTY6RkI6NTM6MTM6Mjg6Nw%3D%3DKMwmrBFTJSjP0XKZlBuIZGMLhiLqoh%2FGw%2FKVZb7uJOh6rbdKKtcz1V8wU6QF6HlWO1szLqeY07hr1rUL%22%2C%22jda%22%3A%22-1%22%2C%22fp%22%3A%22-1%22%7D&', {
      params: {
        functionId: 'findBean',
        appid: 'ld'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const successful = signData.data.msgCode === '0';
    if (!successful) break;
    const { data: checkData } = await ax.get('https://api.m.jd.com/client.action', {
      params: {
        functionId: 'queryBeanIndex',
        appid: 'ld'
      }
    });
    const jdawards = _.takeWhile(checkData.data.findDump.awardPage.zddAwards, { awardName: '京豆' });
    if (jdawards.length) {
      logs.push(`[${jobName}] 获得${jdawards[0].cnt}京豆`);
      total += jdawards[0].cnt;
    }
  } while (true);
  return {
    jd: total,
    logs
  };
};
