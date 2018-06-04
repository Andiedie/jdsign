import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '签到领钢镚';
  const logs = [];
  const payload = encodeURI('reqData={"channelSource":"JRAPP"}');
  const { data: checkSignData } = await ax.post('https://ms.jr.jd.com/newjrmactivity/base/sign1111/init.action');
  const hasSigned = checkSignData.isSignInJr;
  if (hasSigned) {
    logs.push(`${new Date()} [${jobName}] 已经签到，跳过任务`);
    return {logs};
  }
  const { data: signData } = await ax.post('https://ms.jr.jd.com/gw/generic/hy/h5/m/signIn', payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const award = Number(signData.resultData.resBusiData.thisAmount) / 100;
  logs.push(`${new Date()} [${jobName}] 获得${award}钢镚`);
  return {
    coin: award,
    logs
  };
};
