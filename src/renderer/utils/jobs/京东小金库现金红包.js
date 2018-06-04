import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '京东小金库现金红包';
  const logs = [];
  let { data: signData } = await ax.post('https://wyyl.jd.com/xjk/receiveReward');
  const hasSigned = signData.message === '今天你已领取过了!';
  if (hasSigned) {
    logs.push(`${new Date()} [${jobName}] 已经领取，跳过任务`);
    return {logs};
  }
  const award = Number(signData.message);
  logs.push(`${new Date()} [${jobName}] 获得${award}现金`);
  return {
    cash: award,
    logs
  };
};
