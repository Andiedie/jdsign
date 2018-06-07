import ax from '@/utils/ax.js';
import _ from 'lodash';

export default async () => {
  const jobName = '领京东红包';
  console.log(jobName);
  const logs = [];
  const payload = 'reqData={"actCode":"79DE8B780DEB9ABACA42FA5011BF82731EAAEA097C14E5DA1FB9AB82C1EA9A7037C18F386CCC529E61F297B845EB50EF"}&source=app';

  const { data: checkData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/getFirstWebStatus', payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const pullable = checkData.resultData.code === '0_can_openRed';
  const pickable = !(_.get(checkData, 'resultData.data.isRecieved', 0));
  if (!pullable && !pickable) {
    logs.push(`[${jobName}] 已经领取，跳过任务`);
    return {logs};
  }

  let rewordCode;
  if (pullable) {
    const { data: pullData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/singleRewardPullNewLottery', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    rewordCode = pullData.resultData.data.rewardCode;
  } else {
    rewordCode = checkData.resultData.data.rewardCode;
  }

  const { data: pickData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/userPickUpReward', `reqData={"actCode":"79DE8B780DEB9ABACA42FA5011BF82731EAAEA097C14E5DA1FB9AB82C1EA9A7037C18F386CCC529E61F297B845EB50EF","rewardCode":"${rewordCode}"}&source=app`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  if (pickData.resultData.data.isRecieved !== 1) {
    logs.push(`[${jobName}] 未知错误`);
    return {logs};
  }
  const award = pickData.resultData.data.rewardAmount * 0.01;
  logs.push(`[${jobName}] 获得${award}现金`);
  return {
    cash: award,
    logs
  };
};
