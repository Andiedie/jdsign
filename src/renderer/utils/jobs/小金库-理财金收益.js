import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '小金库-理财金收益';
  console.log(jobName);
  const logs = [];
  let { data: checkSignData } = await ax.get('https://ms.jr.jd.com/gw/generic/jrm/h5/m/enveloProgress');
  const hasSigned = checkSignData.resultData.code === '00';
  if (hasSigned) {
    logs.push(`[${jobName}] 已经拆开，跳过任务`);
    return {logs};
  }
  let { data: signData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/takeEnvelop');
  const award = Number(signData.resultData.data.openAmount);
  logs.push(`[${jobName}] 获得${award}现金`);
  return {
    cash: award,
    logs
  };
};
