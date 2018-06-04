import ax from '@/utils/ax.js';
import _ from 'lodash';

export default async () => {
  const jobName = '签到（京东会员）';
  const logs = [];
  const { data: checkSignData } = await ax.post('https://vip.m.jd.com/score/home.html');
  const hasSigned = _.takeWhile(checkSignData.result.floorInfoList, { code: 'M_USER_INFO' })[0].dataDetail.signType.code === 101;
  if (hasSigned) {
    logs.push(`${new Date()} [${jobName}] 已经签到，跳过任务`);
    return {logs};
  }
  const { data: signData } = await ax.get('https://vip.m.jd.com/scoreSign/getPage.html');
  const award = Number(_.takeWhile(signData.result.floorInfoList, { code: 'M_SIGN_INFO' })[0].dataDetail.jdnum);
  logs.push(`${new Date()} [${jobName}] 获得${award}京豆`);
  return {
    jd: award,
    logs
  };
};
