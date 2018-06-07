import ax from '@/utils/ax.js';
import _ from 'lodash';
// body
export default async () => {
  const jobName = '618拍拍二手销售得京豆';
  console.log(jobName);
  const logs = [];
  let { data: signData } = await ax.get('https://api.m.jd.com/client.action?body=%7B%22params%22%3A%22%7B%5C%22signId%5C%22%3A%5C%2210001640%5C%22%2C%5C%22ruleSrv%5C%22%3A%5C%2200174599_6331077_t1%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%7D%22%2C%22riskParam%22%3A%7B%22platform%22%3A%223%22%2C%22orgType%22%3A%222%22%2C%22openId%22%3A%22-1%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22eid%22%3A%22L2KOKUEOXFMIM4CBNFQSW6LQIRY3SV7ZO6G6SXMKR5XB5TSWMSMSKGIZYPFNIF74HBQA3G2OH2XHONG5FEBDRYASDI%22%2C%22fp%22%3A%227aff3c31614fa8d87738066bed5f0e45%22%2C%22shshshfp%22%3A%2291b6286c048fa1b56b247c48ca695944%22%2C%22shshshfpa%22%3A%228bfcd270-212d-14f4-6385-1e8bf51ed970-1527904079%22%2C%22shshshfpb%22%3A%2218d08bc1278cc488598a1f2847965f5c76353580227337a565b1097dea%22%2C%22childActivityUrl%22%3A%22https%253A%252F%252Fpro.m.jd.com%252Fmall%252Factive%252F3QEnEBRvcA1aarPEbaB8HdCbPH2u%252Findex.html%253Fshowhead%253Dno%2526cu%253Dtrue%2526utm_source%253Dhome.jdpay.com%2526utm_medium%253Dtuiguang%2526utm_campaign%253Dt_1000550368_%2526utm_term%253Da99738a1bea44302b806557e67d28457%2526abt%253D3%22%7D%2C%22mitemAddrId%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%22%22%2C%22lat%22%3A%22%22%7D%2C%22addressId%22%3A%22%22%2C%22posLng%22%3A%22%22%2C%22posLat%22%3A%22%22%2C%22focus%22%3A%22%22%2C%22innerAnchor%22%3A%22%22%7D', {
    params: {
      functionId: 'userSign',
      client: 'wh5'
    }
  });
  const hasSigned = signData.signText === '已签到';
  if (hasSigned) {
    logs.push(`[${jobName}] 已经领取，跳过任务`);
    return {logs};
  }
  if (signData.noAwardTxt) {
    logs.push(`[${jobName}] 签到成功，但没有奖励`);
    return { logs };
  }
  const award = parseInt(_.takeWhile(signData.awardList, { type: 2 })[0].text);
  logs.push(`[${jobName}] 获得${award}京豆`);
  return {
    jd: award,
    logs
  };
};
