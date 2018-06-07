import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '趣花钱抽奖';
  console.log(jobName);
  const logs = [];
  let total = 0;
  // share
  await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/addShareTimes');
  const getTimes = async () => {
    const { data: checkData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/initByLogin');
    return checkData.resultData.data.times;
  };
  let times = await getTimes();
  if (times === 0) {
    logs.push(`[${jobName}] 机会用尽，跳过任务`);
    return { logs };
  }
  while (times > 0) {
    const { data: pickData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/takeFun');
    const regResult = /^([\d.]+)元小金库红包$/.exec(pickData.resultData.data.rewardName);
    if (regResult) {
      const reward = Number(regResult[1]);
      total += reward;
    }
    logs.push(`[${jobName}] 获得${pickData.resultData.data.rewardName}`);
    // check
    times = await getTimes();
  }
  return {
    cash: total,
    logs
  };
};
