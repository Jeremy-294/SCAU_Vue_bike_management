<template>
    <div>
        <el-button type="info" @click="logout">退出登录</el-button>
    </div>
</template>

<script>
export default {
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
        }
    }
};
</script>

<style lang="less" scoped>
</style>