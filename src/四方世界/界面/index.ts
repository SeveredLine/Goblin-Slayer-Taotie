import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
// 忽略路径检查
// eslint-disable-next-line import-x/no-unresolved
import './index.scss';

const $ = (window as any).$ || (window.parent as any).$;

$(() => {
  console.log('[DND UI] 正在接管界面渲染并搬运样式...');
  
  const parentDoc = window.parent.document;
  const currentDoc = document; // 当前 Iframe 的 document

  // ==========================================
  // 1. 创建或获取挂载根节点，强制设定行内样式确保最顶层
  // ==========================================
  let $container = $(parentDoc.getElementById('dnd-crpg-root'));
  if ($container.length === 0) {
    $container = $('<div id="dnd-crpg-root"></div>').appendTo(parentDoc.body);
  } else {
    $container.empty();
  }

  // 赋予容器霸道的行内样式，无视一切原生 UI 的层级
  $container.attr('style', `
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100vw; 
    height: 100vh; 
    z-index: 2147483647; 
    pointer-events: auto;
    background-color: transparent;
  `);


  // ==========================================
  // 2. 搬运样式 (Teleport Styles)
  // 将 iframe 内部 Webpack 打包的 tailwind 样式克隆到主界面
  // ==========================================
  const injectedStyles: HTMLStyleElement[] = [];
  
  // 查找当前 iframe head 中的所有 style 标签
  const styles = currentDoc.head.querySelectorAll('style');
  styles.forEach((styleEl) => {
    // 复制该标签
    const clone = parentDoc.createElement('style');
    clone.innerHTML = styleEl.innerHTML;
    // 打个标记，方便卸载时清理
    clone.setAttribute('data-dnd-ui', 'true');
    parentDoc.head.appendChild(clone);
    injectedStyles.push(clone);
  });


  // ==========================================
  // 3. 初始化 Vue 实例
  // ==========================================
  const app = createApp(App);
  app.use(createPinia());
  app.mount($container[0]);


  // ==========================================
  // 4. 清理工作
  // ==========================================
  $(window).on('pagehide', () => {
    app.unmount();
    $container.remove();
    // 移除注入到主界面的样式
    injectedStyles.forEach(s => s.remove());
  });
});