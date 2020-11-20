<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>单车管理</el-breadcrumb-item>
            <el-breadcrumb-item>单车列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加单车</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert
            title="添加商品信息"
            type="info"
            center
            :closable="false"
            show-icon>
            </el-alert>
            <!-- 进度条区域 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="单车参数"></el-step>
                <el-step title="单车属性"></el-step>
                <el-step title="单车车牌"></el-step>
                <el-step title="单车所有者"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- tab栏区域 -->
            <el-form :model="addForm" :rules="addFormRules" 
            ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs :tab-position="'left'" v-model="activeIndex" 
                :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="所有者姓名" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="所在学院" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="所有者学号" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="其他" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="单车类别" prop="goods_cat">
                            <!-- 级联选择器 -->
                            <el-cascader
                            v-model="addForm.goods_cat"
                            :options="catelist"
                            expandTrigger:="hover"
                            :props="cateProps"
                            @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="单车参数" name="1">
                        <!-- 渲染表单的item项  -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" 
                        :key="item.attr_id">
                            <!-- 复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" border
                                v-for="(cb,i) in item.attr_vals"
                                :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="单车属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData"
                        :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="单车车牌" name="3">
                        <!-- action 表示要上传的图片的后台api地址 -->
                        <el-upload
                        :on-success="handleSuccess"
                        :headers="headerObj"
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="特殊/详细描述" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加单车按钮 -->
                        <el-button type="primary" class="btnAdd"
                        @click="add">添加单车</el-button>
                    </el-tab-pane>
              </el-tabs>
            </el-form>
        </el-card>

        <!-- 上传图片预览的对话框 -->
        <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%">
        <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data(){
        return{
            activeIndex:'0',
            // 添加单车的表单数据对象
            addForm:{
                goods_name:'',
                goods_price:'数学与信息学院',
                goods_weight:'',
                goods_number:1,
                // 这是单车所属的分类数组
                goods_cat:[],
                // 上传的图片数组
                pics : [],
                // 商品的详情描述
                goods_introduce:'',
                attrs:[]
            },
            // 添加单车的表单验证规则
            addFormRules:{
                goods_name:[{
                    required:true,message:'请输入单车所有者信息',
                    trigger:'blur'
                }],
                goods_price:[{
                    required:true,message:'请输入所有者所在学院',
                    trigger:'blur'
                }],
                goods_weight:[{
                    required:true,message:'请输入所有者学号信息',
                    trigger:'blur'
                }],
                goods_cat:[{
                    required:true,message:'请选择单车类别',
                    trigger:'blur'
                }],
                goods_number:[{
                    required:true,message:'请选择单车XXX',
                    trigger:'blur'
                }]
            },
            //单车分类列表
            catelist:[],
            cateProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            // 动态参数列表数据
            manyTableData:[],
            // 静态属性列表数据
            onlyTableData:[],
            // 上传图片的后台地址
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            // 图片上传组件的headers请求头对象
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            // 预览图片的真实地址
            previewPath:'',
            // 控制图片预览对话框的显示与隐藏
            previewVisible:false
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取所有单车分类数据
        async getCateList(){
           const {data:res} = await this.$http.get(`categories`)
           if(res.meta.status!==200){
            return this.$message.error('获取单车分类数据失败')
           }
           this.catelist = res.data
           console.log(this.catelist)
        },
        // 级联选择器选中项发生变化处理该函数
        handleChange(){
            console.log(this.addForm.goods_cat)
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat = []
            }
        },
        //完善基本信息才可以切换下一主题函数 
        beforeTabLeave(activeName,oldActiveName){
            // console.log('即将离开的标签页名字是' + oldActiveName)
            // console.log('即将进入的标签页名字是' + activeName)
            // return false
            if(oldActiveName === '0' && 
            this.addForm.goods_cat.length!== 3){
                this.$message.error('请完善基本信息')
                return false
            }
        },
        // 打印选中的面板0 1 2 3 4
        async tabClicked(){
            // console.log(this.activeIndex)
            // 证明访问动态参数面板
            if(this.activeIndex === '1'){
                const {data:res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{ sel: 'many' }
                })
                if(res.meta.status!==200){
                    return this.$message.error('获取动态参数列表失败')
                }
                console.log(res.data)
                // 将返回的每个item标签分割为数组模式 split
                res.data. forEach(item=>{
                    item.attr_vals =
                    item.attr_vals.length === 0 ? []:
                    item.attr_vals.split(' ')
                })
                this.manyTableData = res.data
            }else if(this.activeIndex === '2')
            {
                const {data:res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{ sel: 'only' }
                })
                if(res.meta.status!==200){
                    return this.$message.error('获取静态属性列表失败')
                }
                console.log(res.data)
                this.onlyTableData = res.data
            }
        },
        // 处理图片预览的函数
        handlePreview(file){
           console.log(file) 
           this.previewPath=file.response.data.url
           this.previewVisible = true
        },
        // 处理移除图片的操作
        handleRemove(file){
            console.log(file)
            // 1.获取将要删除的图片的临时路劲
            const filePath = file.response.data.tmp_path
            // 2.从pics数组中，找到这个图片的索引值
            const i = this.addForm.pics.findIndex(x =>{
                x.pic === filePath
            }) 
            // 3.调研数组的splice方法，将图片信息从数组中移除
            this.addForm.pics.splice(i,1)
            console.log(this.addForm)
        },
        // 监听图片上传成功的事件
        handleSuccess(response){
            console.log(response)
            // 1.拼接得到一个图片信息对象
            const picInfo = { pic:response.data.tmp_path}
            // 2.将图片信息对象push到pics
            this.addForm.pics.push(picInfo)
            console.log(this.addForm)
        },
        // 将单车表单的所有数据提交
        add(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid){
                    return this.$message.error('请填写必要的表单项')
                }
                // 执行添加的业务逻辑
                // lodash cloneDeep(obj)深拷贝
                const form = _.cloneDeep(this.addForm)
                form.goods_cat=form.goods_cat.join(',')
                // 处理动态参数
                this.manyTableData.forEach(item=>{
                    const newInfo ={ 
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                }
                    this.addForm.attrs.push(newInfo)
                })
                // 处理静态属性
                this.onlyTableData.forEach(item =>{
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs = this.addForm.attrs
                console.log(form)

                // 发起请求添加单车
                // 单车的名称必须是唯一的
                // 大bug还没有解决
                const { data:res } = await this.$http.post('goods',form)
                console.log(res)
                if(res.meta.status !== 201){
                    this.$message.error('添加单车失败')
                }
                this.$message.success('添加单车成功')
                this.$router.push('/goods')
               
            })
        }

    },
    computed:{
        cateId() {
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>

<style lang="less" scoped>
.el-checkbox{
    margin: 0 10px 0 0 !important;
}
.el-upload__tip{
    margin: 10px 0 10px 5px;
    font-size: 12px;
    color: grey;
}
.previewImg{
    width: 100%;
}
.btnAdd{
    margin-top: 15px;
}
</style>