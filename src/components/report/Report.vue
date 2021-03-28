<template>
    <div>
         <!-- 面包屑导航区域 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据分析</el-breadcrumb-item>
            <el-breadcrumb-item>事故数据</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 1000px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
// 1.导入echarts
import echarts from 'echarts'
import _ from 'lodash'

export default{
    data(){
        return{
        // 需要进行合并的数据
        options: {
          title: {
            text: '上牌分析'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }


        }
    },
    created(){

    },
    // 此时，页面上的dom元素以及渲染完毕
    async mounted(){
        // 3.基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 发起请求获取网络数据
        const { data: res } = await this.$http.get(`reports/type/1`)
        if(res.meta.status!==200){
            return this.$message.error('获取图形数据失败')
        }


        // 4.准备数据和配置项
        // 用lodash的merge函数合并服务器返回的数据 和已有的options对象
        // 形成新的对象
        const result = _.merge(res.data,this.options)

        // 5.展示数据
        myChart.setOption(result);
    },
    methods:{

    }

}
</script>

<style lang="less" scoped></style>