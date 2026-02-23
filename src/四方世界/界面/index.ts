import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
// eslint-disable-next-line import-x/no-unresolved
import './index.scss';

const $ = (window as any).$ || (window.parent as any).$;

$(() => {
  console.log('[DND UI] 正在接管界面渲染...');
  const parentDoc = window.parent.document;

  let $container = $(parentDoc.getElementById('dnd-crpg-root'));
  if ($container.length === 0) {
    $container = $('<div id="dnd-crpg-root"></div>').appendTo(parentDoc.body);
  } else {
    $container.empty();
  }

  const app = createApp(App);
  app.use(createPinia());
  app.mount($container[0]);

  $(window).on('pagehide', () => {
    app.unmount();
    $container.remove();
  });
});