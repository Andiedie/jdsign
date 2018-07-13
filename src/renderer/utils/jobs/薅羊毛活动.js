import ax from '@/utils/ax.js';
// 活动结束
export default async () => {
  const jobName = '薅羊毛活动';
  console.log(jobName);
  const logs = [];
  let { data: checkSignData } = await ax.get('https://home.jdpay.com/my/querySignHistory');
  const hasSigned = checkSignData.data.resBusiData.isFlag;
  if (hasSigned) {
    logs.push(`[${jobName}] 已经领取，跳过任务`);
    return {logs};
  }
  let { data: signData } = await ax.get('https://home.jdpay.com/my/signIn');
  const continuity = parseInt(signData.data.signContinuity);
  const award = continuity >= 7 && continuity % 7 === 0 ? 0.05 : 0.01;
  logs.push(`[${jobName}] 获得${award}钢镚`);
  return {
    coin: award,
    logs
  };
};
