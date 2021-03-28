import Vue from 'vue'
// 导入弹框组件
import { Button,Message,Form , FormItem,Input,Container,Header,Aside,Main,Menu,Submenu,MenuItemGroup,MenuItem
    ,Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,
    Dialog ,MessageBox,Tag,Tree,Select,Option,Cascader,Alert,Tabs, TabPane,Steps,Step
    ,CheckboxGroup,Checkbox,Upload} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)

// 全局挂载 $message自定义
Vue.prototype.$message = Message
// 挂在$confirm
Vue.prototype.$confirm = MessageBox.confirm