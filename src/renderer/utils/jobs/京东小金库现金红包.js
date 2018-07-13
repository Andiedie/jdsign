import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '京东小金库现金红包';
  console.log(jobName);
  const logs = [];
  let { data: signData } = await ax.post('https://wyyl.jd.com/xjk/receiveReward');
  const award = Number(signData.message);
  if (isNaN(award)) {
    logs.push(`[${jobName}] ${signData.message}`);
    return {logs};
  }
  logs.push(`[${jobName}] 获得${award}现金`);
  return {
    cash: award,
    logs
  };
};
