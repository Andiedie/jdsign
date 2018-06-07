import ax from '@/utils/ax.js';
import jsonp from 'parse-jsonp';

export default async () => {
  const jobName = '2018翻牌签到';
  console.log(jobName);
  const logs = [];
  const sid = ax.getCookie().sid;
  let { data: checkData } = await ax.get('https://gpm.jd.com/signin/home', {
    params: {
      sid,
      uaType: '2',
      callback: 'hook'
    }
  });
  checkData = jsonp('hook', checkData)[0];
  if (checkData.data.result !== 0) {
    logs.push(`[${jobName}] SID过期`);
    return {logs};
  }
  const signable = checkData.data.today === 0;
  if (!signable) {
    logs.push(`[${jobName}] 已经翻牌，跳过任务`);
    return {logs};
  }
  let { data: signData } = await ax.get('https://gpm.jd.com/signin/choice', {
    params: {
      sid,
      position: '1',
      uaType: '2',
      callback: 'hook'
    }
  });
  signData = jsonp('hook', signData)[0];
  if (signData.data.result !== 0) {
    logs.push(`[${jobName}] 未知错误`);
    return {logs};
  }
  const award = signData.data.neworder[0];
  logs.push(`[${jobName}] 获得${award}钢镚`);
  return {
    coin: award,
    logs
  };
};
