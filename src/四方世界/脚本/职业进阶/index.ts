import _ from 'lodash';

const { eventOn, getVariables, setVariable, triggerSlash, toastr } = (window as any).ST_API || {};
const $ = (window as any).$;

const CTX = { type: 'message', message_id: 'latest' } as const;

const getCharacterJobs = (vars: any) => _.get(vars, 'stat_data.主角.职业', _.get(vars, '主角.职业', {}));
const getCharacterSkills = (vars: any) => _.get(vars, 'stat_data.主角.技能列表', _.get(vars, '主角.技能列表', {}));

const formatJobInfo = (jobs: any) => {
  return Object.entries(jobs).map(([jobName, jobData]: [string, any]) => {
    if (typeof jobData === 'object' && jobData !== null) {
      return `${jobName}: 等级${jobData.当前等级 || 1} (经验: ${jobData.当前经验 || 0}/${jobData.升级所需 || 1000})`;
    }
    return `${jobName}: ${jobData}`;
  }).join('\n');
};

const formatSkillInfo = (skills: any) => {
  return Object.entries(skills).map(([skillName, skillData]: [string, any]) => {
    if (typeof skillData === 'object' && skillData !== null) {
      return `${skillName}: ${skillData.level || '初级'} (熟练度: ${skillData.熟练度 || 0}%, 效率: ${skillData.efficiency || 1})`;
    }
    return `${skillName}: ${skillData}`;
  }).join('\n');
};

const performAdvancement = async (fromJob: string, toJob: string, previousJobLevel: number, jobs: any, skills: any) => {
  try {
    const updatedJobs = { ...jobs };
    delete updatedJobs[fromJob];

    updatedJobs[toJob] = {
      当前等级: 1,
      最大等级: 10,
      当前经验: 0,
      升级所需: 1000,
      advancement_from: fromJob,
      advancement_level: previousJobLevel,
    };

    (window as any).setVariable('stat_data.主角.职业', updatedJobs, CTX);
    (window as any).setVariable('stat_data.主角.技能列表', skills, CTX);

    const jobInfo = formatJobInfo(updatedJobs);
    const skillInfo = formatSkillInfo(skills);

    const advancementMessage = `角色职业进阶：从 ${fromJob}(等级${previousJobLevel}) 进阶为 ${toJob}\n\n前置职业等级：${previousJobLevel}\n\n当前所有职业状态：\n${jobInfo}\n\n当前所有技能状态：\n${skillInfo}\n\n进阶强度判断依据：前置职业等级${previousJobLevel}，请根据此信息以及当前职业和技能状态决定新职业的具体强度和特性。`;

    await (window as any).triggerSlash(`/sys ${advancementMessage}`);
    (window as any).toastr.success(`成功进阶为 ${toJob}！`);
    return true;
  } catch (error: any) {
    console.error('[职业进阶] 执行失败', error);
    (window as any).toastr.error('职业进阶失败：' + error.message);
    return false;
  }
};

$(() => {
  (window as any).eventOn('slashCommand', async (data: any) => {
    if (data.command === '职业进阶') {
      try {
        const [fromJob, toJob] = data.args.split(':');
        if (!fromJob || !toJob) {
          (window as any).toastr.error('职业进阶参数错误');
          return;
        }
        const vars = (window as any).getVariables(CTX);
        const jobs = getCharacterJobs(vars);
        const skills = getCharacterSkills(vars);
        const previousLevel = jobs[fromJob]?.当前等级 || 1;

        await performAdvancement(fromJob, toJob, previousLevel, jobs, skills);
      } catch (err) {
        console.error('[职业进阶] 执行失败', err);
        (window as any).toastr.error('职业进阶失败，请查看控制台');
      }
    }
  });
});

export { };

