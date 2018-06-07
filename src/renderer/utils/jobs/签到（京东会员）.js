import ax from '@/utils/ax.js';
import _ from 'lodash';

export default async () => {
  const jobName = '签到（京东会员）';
  console.log(jobName);
  const logs = [];
  const { data: checkSignData } = await ax.post('https://vip.m.jd.com/score/home.html');
  let hasSigned = true;
  for (const floor of checkSignData.result.floorInfoList) {
    if (floor.code === 'M_USER_INFO') {
      hasSigned = floor.dataDetail.signType.code === 101;
      break;
    }
  }
  if (hasSigned) {
    logs.push(`[${jobName}] 已经签到，跳过任务`);
    return {logs};
  }
  const { data: signData } = await ax.get('https://vip.m.jd.com/scoreSign/getPage.html');
  const award = Number(_.takeWhile(signData.result.floorInfoList, { code: 'M_SIGN_INFO' })[0].dataDetail.jdnum);
  logs.push(`[${jobName}] 获得${award}京豆`);
  return {
    jd: award,
    logs
  };
};
