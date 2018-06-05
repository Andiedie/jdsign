import ax from '@/utils/ax.js';
import _ from 'lodash';

export default async () => {
  const jobName = '双签礼包';
  const logs = [];
  const { data: checkSignData } = await ax.post('https://ms.jr.jd.com/newjrmactivity/base/sign1111/init.action');
  const hasSigned = checkSignData.isGet;
  if (hasSigned) {
    logs.push(`[${jobName}] 已经领取，跳过任务`);
    return {logs};
  }
  if (!checkSignData.isSignInJr || !checkSignData.isSignInJd) {
    logs.push(`[${jobName}] 请先完成京东APP和京东金融签到`);
    return {logs};
  }
  const { data: signData } = await ax.get('https://ms.jr.jd.com/newjrmactivity/base/sign1111/getSignAward.action');
  const award = _.takeWhile(signData.awardList, { name: '京豆' })[0].count;
  logs.push(`[${jobName}] 获得${award}京豆`);
  return {
    jd: award,
    logs
  };
};
