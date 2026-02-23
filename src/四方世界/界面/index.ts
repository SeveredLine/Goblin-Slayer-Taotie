import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './global.css';

// 等待 Mvu 初始化
await waitGlobalInitialized('Mvu');

// 等待本楼层变量加载完成
await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));

// 将本 iframe 重定位到外部的 body 下，方便 fixed 定位不被裁切
// 这是必须的，因为如果组件在 iframe 里，虽然有 global.css 但 fixed 只能相对于 iframe 内部
// 但 wait，如果我们要覆盖在原酒馆右侧 35%，那最好的方式是将整个 vue app 挂载到主窗口的 body
// 或者是用一个 fixed 在右边的 div。
// 因为是 "前端界面" 脚本，通常是 `iframe`。为了能够修改 100vh 和 35% fixed，iframe 必须穿透，或者利用 `teleport` 或自己创建 div?
// 实际上，为了能脱离 iframe 的局限，我们在 index.ts 里：
const targetContainerId = 'dnd-interface-overlay';
let container = window.parent.document.getElementById(targetContainerId);

if (!container) {
    container = window.parent.document.createElement('div');
    container.id = targetContainerId;
    window.parent.document.body.appendChild(container);
} else {
    // 清空旧内容，实现热更替
    container.innerHTML = '';
}

// 需要在挂载到 parent 时，处理样式隔离的问题。
// 因为 Vue 在 iframe 里，挂载在 outside 会导致 scoped style 找不到？
// Vue 3 可以 mount 到任何 DOM 元素上。
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount(container);
