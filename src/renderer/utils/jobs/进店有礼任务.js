import ax from '@/utils/ax.js';

export default async () => {
  const jobName = '进店有礼任务';
  console.log(jobName);
  const logs = [];
  const { data: taskListData } = await ax.post('https://api.m.jd.com/client.action?functionId=queryTaskIndex&appid=ld');
  if (!taskListData.data.taskList) {
    logs.push(`[${jobName}] ${taskListData.data.taskErrorTips}`);
    return {logs};
  }
  const taskList = taskListData.data.taskList.filter(value => value.taskStatus === 1);
  const award = taskList.reduce((pre, cur) => pre + Number(cur.awardCount), 0);
  const taskIds = taskList.map(value => value.taskId);
  if (taskIds.length === 0) {
    logs.push(`[${jobName}] 全部任务已经完成`);
    return {logs};
  }
  for (const id of taskIds) {
    await ax.post('https://api.m.jd.com/client.action?functionId=takeTask&appid=ld', `body={"taskId":"${id}"}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  logs.push(`[${jobName}] 完成${taskIds.length}个任务，获得${award}京豆`);
  return {
    jd: award,
    logs
  };
};
