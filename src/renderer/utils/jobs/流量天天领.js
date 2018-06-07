import ax from '@/utils/ax.js';
import _ from 'lodash';

export default async () => {
  const jobName = '流量天天领';
  console.log(jobName);
  const logs = [];
  const payload = 'reqData={"actCode":"CEF19FA9384EBB22757E0053F59B97EB61E3203C9DD7CECADA5792AF43221CB8C1FC507276E3D1DE2F5021087735F8A0"}&source=app';

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

  const { data: pickData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/pickUpDataFlowReward', `reqData={"actCode":"CEF19FA9384EBB22757E0053F59B97EB61E3203C9DD7CECADA5792AF43221CB8C1FC507276E3D1DE2F5021087735F8A0","rewardCode":"${rewordCode}"}&source=app`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  if (pickData.resultData.data.isRecieved !== 1) {
    logs.push(`[${jobName}] 未知错误`);
    return {logs};
  }
  const award = pickData.resultData.data.rewardAmount;
  logs.push(`[${jobName}] 获得${award}M流量`);
  return {
    flow: award,
    logs
  };
};
