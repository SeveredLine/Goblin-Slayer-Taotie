import _ from 'lodash';

const { eventOn, getButtonEvent, getVariables, setVariable, triggerSlash, toastr } = (window as any).ST_API || {};
const $ = (window as any).$;

const BTN_NAME = '技能学习';
const CTX = { type: 'message', message_id: 'latest' } as const;

const getSkillPoints = (vars: any) => {
  const v = _.get(vars, 'stat_data.主角.技能点', _.get(vars, '主角.技能点', 0));
  return Number(v) || 0;
};

const getPointsPath = (vars: any) => {
  if (_.has(vars, 'stat_data.主角.技能点')) return 'stat_data.主角.技能点';
  if (_.has(vars, '主角.技能点')) return '主角.技能点';
  return 'stat_data.主角.技能点';
};

$(() => {
  (async () => {
    try {
      await (window as any).triggerSlash(`/buttons ${BTN_NAME}`);
    } catch (err) {
      console.error('[技能学习] 显示按钮失败', err);
    }
  })();

  (window as any).eventOn((window as any).getButtonEvent(BTN_NAME), async () => {
    try {
      const vars = (window as any).getVariables(CTX);
      const points = getSkillPoints(vars);
      const pointsPath = getPointsPath(vars);
      if (points <= 0) {
        (window as any).toastr.warning('技能点不足，无法学习新技能');
        return;
      }

      const skillName = window.prompt('输入要学习的技能名（键名）：', '');
      if (!skillName) return;

      const skillPath = `stat_data.主角.技能列表.${skillName}`;
      const existed = _.get(vars, skillPath);
      if (existed) {
        (window as any).toastr.info(`技能「${skillName}」已存在，未消耗技能点`);
        return;
      }

      const desc = window.prompt('输入技能描述（可留空）：', '') || '';
      const cost = window.prompt('输入技能消耗（可留空）：', '无') || '无';

      const newSkill = {
        type: '主动',
        level: '初级',
        熟练度: 0,
        efficiency: 1,
        description: desc,
        cost,
      };

      (window as any).setVariable(pointsPath, Math.max(0, points - 1), CTX);
      (window as any).setVariable(skillPath, newSkill, CTX);

      (window as any).toastr.success(`已学习技能「${skillName}」，消耗 1 技能点`);
    } catch (err) {
      console.error('[技能学习] 学习失败', err);
      (window as any).toastr.error('学习技能失败，请查看控制台');
    }
  });
});

export { };

