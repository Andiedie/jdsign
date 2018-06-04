import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '全局分享拉新活动';
  const logs = [];
  let { data: signData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/giftGB');
  const hasSigned = signData.resultData.msg === '今日已领取过钢镚';
  if (hasSigned) {
    logs.push(`${new Date()} [${jobName}] 已经分享，跳过任务`);
    return {logs};
  }
  const award = Number(signData.resultData.data.amount);
  logs.push(`${new Date()} [${jobName}] 获得${award}钢镚`);
  return {
    coin: award,
    logs
  };
};
