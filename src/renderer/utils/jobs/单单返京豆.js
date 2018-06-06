import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '单单返京豆';
  const logs = [];
  const { data: checkData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/accessJingdouInfo');
  const availableCount = checkData.resultData.ableDrawjingdou;
  if (availableCount === 0) {
    logs.push(`[${jobName}] 没有可以领取的京豆`);
    return {logs};
  }
  const tradeNo = checkData.resultData.billList.map(v => v.tradeNo);
  const payload = 'reqData=' + encodeURIComponent(JSON.stringify({
    clientType: 'android',
    list: tradeNo
  }));
  const { data: signData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/acquireJingdou', payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  });
  if (signData.resultData.code !== 1) {
    logs.push(`[${jobName}] 未知错误"${signData.resultData.message}"`);
    return {logs};
  }
  const award = Number(signData.resultData.currentjingdoucount);
  logs.push(`[${jobName}] 获得${award}京豆`);
  return {
    jd: award,
    logs
  };
};
