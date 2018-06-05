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
  const { data: signData } = await ax.post('https://ms.jr.jd.com/gw/generic/jrm/h5/m/acquireJingdou');
  if (signData.resultData.code === -100) {
    logs.push(`[${jobName}] 没有可以领取的京豆`);
    return {logs};
  }
  if (signData.resultData.code !== 1) {
    logs.push(`[${jobName}] 未知错误"${signData.resultData.message}"`);
    return {logs};
  }
  const award = Number(signData.resultData.orderSucessCount);
  logs.push(`[${jobName}] 获得${award}京豆`);
  return {
    jd: award,
    logs
  };
};
