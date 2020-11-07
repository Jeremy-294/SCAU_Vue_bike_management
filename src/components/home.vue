<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
               <img src="../assets/logo-n.png" alt="">
            </div>
            <!-- <span>校园电单车管理后台</span> -->
            <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 宽度根据是否折叠侧边栏来动态绑定-->
          <el-aside :width="isCOllapse ?'64px':'200px'">
              <div class="toggle-button" @click="toggleCollapse">|||</div>
              <!-- 侧边栏菜单区域 -->
            <el-menu
            :default-active = "activePath"
            router
            :collapse="isCOllapse"
            :collapse-transition="false"
            unique-opened
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menulist" :key='item.id'>
            <!-- 一级菜单的模板 -->
              <template slot="title">
                  <!-- 根据id动态渲染图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key='subItem.id'
                @click="saveNavState('/' + subItem.path)">
                <template slot="title" >
                    <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subItem.authName}}</span>
                </template>
                </el-menu-item>
            </el-submenu>
            </el-menu>
          </el-aside>
          <!-- 右侧内容主体 -->
          <el-main>
              <!-- 路由占位符 -->
              <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
</template>

<script>
export default {
    data() {
        return{
            // 左侧菜单数据
            menulist :[],
            iconsObj: {
                '125':'iconfont icon-users',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            // 是否折叠菜单栏
            isCOllapse:false,
            // 被激活的链接地址
            activePath:''
        }
    },
    created() {
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout() {
            // 清空sessionStorage
            window.sessionStorage.clear();
            // 跳转到login页面
            this.$router.push("/login");
            this.$message({
                dangerouslyUseHTMLString: true,
                message:'<strong>已成功退出登录</strong>',
                center: true
            });
        },
        // 获取所有的菜单
        async getMenuList() {
            const {data:res} = await this.$http.get('menus')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data    
            console.log(res)
        },
        // 点击按钮切换菜单的折叠与展开
        toggleCollapse(){
            this.isCOllapse =! this.isCOllapse
        },
        // 保存链接的激活状态
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
};
</script>

<style lang="less" scoped>
.home-container{
    width: 100%;
    height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0%;
    align-items: center;
    color: #fff;
    font-size: 20px;
}
.el-header img{
    width: 250px;
    height: 100px;
}
.el-header span{
    position: absolute;
    margin-left: 230px;
}
.el-aside{
    background-color: #333744;
}
.el-aside .el-menu {
        border-right: none;
    }
.el-main{
    background-color: #eaedf1;
}
.iconfont{
    margin-right: 10px;
}
.toggle-button{
    background-color: #4a5064;
    text-align: center;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: 5px;
    cursor: pointer;
}
</style>