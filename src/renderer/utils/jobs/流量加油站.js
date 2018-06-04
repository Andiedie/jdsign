import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '流量加油站';
  const logs = [];
  const { data: checkData } = await ax.get('https://api.m.jd.com/client.action', {
    params: {
      functionId: 'getFbankIndex',
      appid: 'ld'
    }
  });
  const signable = checkData.signInfo.signCode === '0';
  if (!signable) {
    logs.push(`${new Date()} [${jobName}] 已经签到，跳过任务`);
    return {logs};
  }
  const { data: signData } = await ax.get('https://api.m.jd.com/client.action', {
    params: {
      functionId: 'fBankSign',
      appid: 'ld'
    }
  });
  if (!signData.signData) {
    logs.push(`${new Date()} [${jobName}] ${signData.errorMessage}`);
    return {logs};
  }
  const award = Number(signData.signData.signFlowData) / 100;
  logs.push(`${new Date()} [${jobName}] 获得${award}M流量`);
  return {
    flow: award,
    logs
  };
};
