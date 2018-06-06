import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '天天抽大奖';
  const logs = [];
  const payload =
    'reqData={"actCode":"D936B07274651F5C4EA67D9A61142F731E1F3505ADCDB6ED2177DDA10B44426155E0086F2112F4093DD18A508C0C452C"}&source=app';
  let total = 0;
  const getCheckData = async () => {
    const { data: checkData } = await ax.post(
      'https://ms.jr.jd.com/gw/generic/jrm/h5/m/userRewarListAndLeftTimes',
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return checkData;
  };
  let checkData = await getCheckData();
  if (checkData.resultData.data.leftTimes === 0) {
    logs.push(`[${jobName}] 机会用尽，跳过任务`);
    return {logs};
  }
  while (checkData.resultData.data.leftTimes > 0) {
    // share
    if (checkData.resultData.data.curTimesType === 1) {
      const { data: shareData } = await ax.post(
        'https://ms.jr.jd.com/gw/generic/jrm/h5/m/saveActShareRecord',
        payload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      if (!shareData.resultData.success) {
        logs.push(`[${jobName}] 分享时发生错误`);
        return {
          cash: total,
          logs
        };
      }
    }
    // sign
    const { data: pickData } = await ax.post(
      'https://ms.jr.jd.com/gw/generic/jrm/h5/m/recieveRewad',
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    if (pickData.resultData.data.rewardType === 2) {
      const reward = parseFloat(pickData.resultData.data.rewardName.substr(3));
      total += reward;
    }
    logs.push(`[${jobName}] 获得${pickData.resultData.data.rewardName}`);
    // check
    checkData = await getCheckData();
  }
  return {
    cash: total,
    logs
  };
};
