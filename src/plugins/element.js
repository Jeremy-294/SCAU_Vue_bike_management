import Vue from 'vue'
// 导入弹框组件
import { Button,Message,Form , FormItem,Input } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 全局挂载 $message自定义
Vue.prototype.$message = Message