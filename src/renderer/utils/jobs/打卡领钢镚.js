import ax from '@/utils/ax.js';
import _ from 'lodash';

export default async () => {
  const jobName = '打卡领钢镚';
  const logs = [];
  let { data: checkSignData } = await ax.post('https://ms.jr.jd.com/gw/generic/base/h5/m/baseGetMessByGroupTypeEncryptNew', 'reqData={"clientType":"outH5","userType":1176,"groupType":166}&source=jrm', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const hasSigned = _.values(_.pickBy(checkSignData.resultData, value => !isNaN(value.signInStatus)))[0].signInStatus === 1;
  if (hasSigned) {
    logs.push(`[${jobName}] 已经打卡，跳过任务`);
    return {logs};
  }
  let { data: signData } = await ax.post('https://ms.jr.jd.com/gw/generic/base/h5/m/baseSignInEncryptNew');
  const award = Number(signData.resultData.thisTime) / 100;
  logs.push(`[${jobName}] 获得${award}钢镚`);
  return {
    coin: award,
    logs
  };
};
