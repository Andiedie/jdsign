import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '天天抽大奖';
  const logs = [];
  const payload = 'reqData={"actCode":"D936B07274651F5C4EA67D9A61142F731E1F3505ADCDB6ED2177DDA10B44426155E0086F2112F4093DD18A508C0C452C"}&source=app';

  const { data: checkData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/userRewarListAndLeftTimes', payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const times = checkData.resultData.leftTimes;
  if (times === 0) {
    logs.push(`[${jobName}] 机会用尽，跳过任务`);
    return {logs};
  }
  let total = 0;
  for (let i = 0; i < times; i++) {
    const { data: pickData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/recieveRewad', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (pickData.resultData.data.rewardType === 2) {
      total += 0.01;
    }
    logs.push(`[${jobName}] 获得${pickData.resultData.data.rewardName}`);
  }
  return {
    cash: total,
    logs
  };
};
