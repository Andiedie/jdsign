import ax from '@/utils/ax.js';
import _ from 'lodash';
import parseJsonp from 'parse-jsonp';

export default async () => {
  const jobName = '用户福利（每日签到）领取';
  console.log(jobName);
  const logs = [];
  let day = new Date().getDay();
  day = day === 0 ? 7 : day;
  let { data: checkSignData } = await ax.get('https://s.m.jd.com/activemcenter/muserwelfare/query', {
    params: {
      g_ty: 'ls'
    }
  });
  checkSignData = parseJsonp('Query', checkSignData);
  const hasSigned = _.takeWhile(checkSignData.sign, { num: day, level: day }).length === 1;
  const activityName = checkSignData[0].active;
  if (hasSigned) {
    logs.push(`[${jobName}] 已经签到，跳过任务`);
    return {logs};
  }
  let { data: signData } = await ax.get('https://s.m.jd.com/activemcenter/muserwelfare/sign', {
    params: {
      num: day,
      active: activityName,
      level: day,
      g_ty: 'ls'
    },
    headers: {
      Referer: 'https://wqs.jd.com/promote/201712/mwelfare/m.html'
    }
  });
  signData = parseJsonp('Sign', signData);
  if (signData.ret === 15) {
    logs.push(`[${jobName}] 抢光了，稍后再试吧`);
    return {logs};
  }
  if (signData.ret === 11) {
    logs.push(`[${jobName}] 已经领取，跳过任务`);
    return {logs};
  }
  if (signData.ret !== 0) {
    logs.push(`[${jobName}] 未知错误`);
    return {logs};
  }
  const award = 1;
  logs.push(`[${jobName}] 获得${award}京豆`);
  return {
    jd: award,
    logs
  };
};
