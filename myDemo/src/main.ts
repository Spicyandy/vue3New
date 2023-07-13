import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// Element Plus
import 'element-plus/theme-chalk/index.css'  // 引入 ElementPlus 组件样式
// 图标和组件需要分开引入
import ElementPlus from 'element-plus';   // 引入 ElementPlus 组件
import { Edit, Search } from '@element-plus/icons-vue'  // 按需引入 Icon 图标 
// 引入组件要使用的语言（示例是中文）
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
// 全局注册 Icon 图标
const app = createApp(App)
app.component('Edit', Edit)
app.component('Search', Search)
Search

app.use(ElementPlus, { locale: zhCn })  // 全局挂载 ElementPlus     
app.mount('#app')
