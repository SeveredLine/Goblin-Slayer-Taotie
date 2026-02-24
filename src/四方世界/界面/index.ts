import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

import './index.css';

const $ = (window as any).$ || (window.parent as any).$;

$(() => {
  console.log('[DND UI] 四方世界 CRPG 客户端启动...');
  const parentDoc = window.parent.document;
  const injectedNodes: HTMLElement[] = [];

  const ROOT_ID = 'dnd-crpg-root';
  let $container = $(parentDoc.getElementById(ROOT_ID));

  if ($container.length === 0) {
    $container = $(`<div id="${ROOT_ID}"></div>`).appendTo(parentDoc.body);
  } else {
    console.log('[DND UI] 检测到残留挂载点，正在重置...');
    $container.empty();
  }

  $container.attr(
    'style',
    `
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100vw; 
    height: 100vh; 
    z-index: 2147483647; 
    pointer-events: auto; 
    background-color: transparent;
    font-family: 'Noto Serif SC', serif;
  `,
  );

  // 这里会将刚刚 import './index.css' 编译出的包含 tailwind 样式的 <style> 拷贝到主界面！
  document.head.querySelectorAll('style').forEach(styleEl => {
    const clone = parentDoc.createElement('style');
    clone.innerHTML = styleEl.innerHTML;
    clone.setAttribute('data-dnd-style', 'true');
    parentDoc.head.appendChild(clone);
    injectedNodes.push(clone);
  });

  const app = createApp(App);
  app.use(createPinia());

  app.config.errorHandler = (err, _instance, info) => {
    console.error('[DND UI Error]', err, info);
    if (window.toastr) window.toastr.error(`客户端错误: ${err}`);
  };

  app.mount($container[0]);

  const cleanup = () => {
    console.log('[DND UI] 正在卸载...');
    app.unmount();
    $container.remove();
    injectedNodes.forEach(node => {
      if (node.tagName === 'STYLE' && node.getAttribute('data-dnd-style')) {
        node.remove();
      }
    });
  };

  parentDoc.addEventListener('dnd-crpg-close', cleanup);
  $(window).on('pagehide', cleanup);
});
