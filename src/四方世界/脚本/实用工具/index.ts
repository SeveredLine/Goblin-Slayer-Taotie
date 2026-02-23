import _ from 'lodash';

const CTX = { type: 'message', message_id: 'latest' } as const;

const setupDeleteButton = (btnName: string, getItemsFn: (vars: any) => string[], deletePathFn: (item: string, vars: any) => string) => {
  (async () => {
    try {
      await (window as any).triggerSlash(`/buttons ${btnName}`);
    } catch (err) {
      console.error(`[${btnName}] 显示按钮失败`, err);
    }
  })();

  (window as any).eventOn((window as any).getButtonEvent(btnName), () => {
    try {
      const vars = (window as any).getVariables(CTX);
      const items = getItemsFn(vars);
      if (!items.length) {
        (window as any).toastr.info(`暂无内容可删除`);
        return;
      }
      
      const picked = window.prompt(`输入要删除的键名：\n${items.join('，')}`, items[0]);
      if (!picked) return;
      const trimmed = picked.trim();
      
      const ok = window.confirm(`确定删除「${trimmed}」吗？此操作不可撤销。`);
      if (!ok) return;

      const path = deletePathFn(trimmed, vars);
      if (!path) {
        (window as any).toastr.error('无法定位该项目路径');
        return;
      }

      const { delete_occurred } = (window as any).deleteVariable(path, CTX);
      if (delete_occurred) {
        (window as any).toastr.success(`已成功删除「${trimmed}」`);
      } else {
        (window as any).toastr.warning('删除失败，可能该项目已被删除');
      }
    } catch (err) {
      console.error(`[${btnName}] 删除失败`, err);
      (window as any).toastr.error('删除失败，请查看控制台');
    }
  });
};

$(() => {
  // 删除NPC
  setupDeleteButton('删除NPC', vars => {
    const rels = _.get(vars, 'stat_data.关系列表', {});
    return Object.keys(rels).map(k => {
      const r = rels[k];
      const name = r?.姓名 || r?.名称 || '';
      return name ? `${k}（${name}）` : k;
    });
  }, (trimmed) => `stat_data.关系列表.${trimmed.split('（')[0]}`);

  // 删除状态
  setupDeleteButton('删除状态', vars => {
    const statuses = _.get(vars, 'stat_data.主角.当前状态', {});
    return Object.keys(statuses).map(k => {
      const data = statuses[k];
      const level = data?.level || data?.等级 || '?';
      return `${k}（Lv.${level}）`;
    });
  }, (trimmed) => `stat_data.主角.当前状态.${trimmed.split('（')[0]}`);

  // 删除任务
  setupDeleteButton('删除任务', vars => {
    const quests = _.get(vars, 'stat_data.主角.任务日志', {});
    const allTasks = { ...(quests['进行中'] || {}), ...(quests['已完成'] || {}) };
    return Object.keys(allTasks);
  }, (trimmed, vars) => {
    const quests = _.get(vars, 'stat_data.主角.任务日志', {});
    if (quests['进行中'] && quests['进行中'][trimmed]) return `stat_data.主角.任务日志.进行中.${trimmed}`;
    if (quests['已完成'] && quests['已完成'][trimmed]) return `stat_data.主角.任务日志.已完成.${trimmed}`;
    return '';
  });
});

export { };

