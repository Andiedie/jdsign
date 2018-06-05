import ax from '@/utils/ax.js';
import _ from 'lodash';

export default async () => {
  const jobName = '无线端签到领京豆';
  const logs = [];
  const { data: checkSignData } = await ax.get('https://api.m.jd.com/client.action', {
    params: {
      functionId: 'queryBeanIndex',
      appid: 'ld'
    }
  });
  const hasSigned = checkSignData.data.status === '2';
  if (hasSigned) {
    logs.push(`[${jobName}] 已经签到，跳过任务`);
  }
  const { data: signData } = await ax.get('https://api.m.jd.com/client.action', {
    params: {
      functionId: 'signBeanStart',
      appid: 'ld'
    }
  });
  const signAward = Number(signData.data.signShowBean.signAward);
  const existAward = Number(_.get(signData, 'data.signShowBean.signTopReward.existAward', 0));
  if (!hasSigned) {
    logs.push(`[${jobName}] 签到获得${signAward}京豆`);
    if (existAward) {
      logs.push(`[${jobName}] 连续签到，额外获得${existAward}京豆`);
      logs.push(`[${jobName}] 连续签到，无法翻牌`);
      return {
        jd: signAward + existAward,
        logs
      };
    }
  }

  const hasPickCard = signData.data.signShowBean.complated === 1;
  if (existAward) {
    logs.push(`[${jobName}] 连续签到，无法翻牌`);
    return {logs};
  }
  if (hasPickCard) {
    logs.push(`[${jobName}] 已经翻牌，跳过任务`);
    return {logs};
  }
  const randomPick = _.random(1, signData.data.signShowBean.awardList.length);
  const { data: pickData } = await ax.get('https://api.m.jd.com/client.action', {
    params: {
      functionId: 'getCardResult',
      appid: 'ld',
      body: `{"index": ${randomPick}}`
    }
  });
  const cardAward = Number(pickData.data.signAward) - signAward;
  logs.push(`[${jobName}] 翻牌获得${cardAward}京豆`);
  return {
    jd: signAward + existAward + cardAward,
    logs
  };
};
