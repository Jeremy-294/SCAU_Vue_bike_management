<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>单车管理</el-breadcrumb-item>
            <el-breadcrumb-item>单车分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" 
                    @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

        <!-- 表格 -->
        <tree-table :data="catelist" :columns="columns"
        :selection-type="false" :expand-type="false" show-index
        index-text="#" border :show-row-hover="false"
        class="treeTable">
        <!-- 是否新国标 -->
            <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" 
                v-if="scope.row.cat_deleted === false" 
                style="color: lightgreen;"></i>
                <i class="el-icon-error" v-else
                style="color: lightgreen;"></i>
            </template>
        <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                <el-tag type="success" size="mini" 
                v-else-if="scope.row.cat_level===1">二级</el-tag>
                <el-tag type="warning"  size="mini"
                v-else>三级</el-tag>
            </template>
        <!-- 操作 -->
            <template slot="opt" slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" 
                @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                <el-button type="danger"  size="mini" 
                icon="el-icon-delete" 
                @click="removeCateById(scope.row.cat_id)">删除</el-button>
            </template>
        </tree-table>

        <!-- 分页区域 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
        @close="addCateDialogClosed"
        title="添加品牌与分类"
        :visible.sync="addCateDialogVisible"
        width="50%">
        <!-- 添加分类的表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" 
        ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                <!-- option 用来指定数据源 -->
                <!-- props用来指定配置对象 -->
                <el-cascader
                expand-trigger="hover"
                v-model="selectKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChanged"
                
                clearable></el-cascader>
            </el-form-item>
        </el-form>
        <!-- 表单按钮区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改分类的对话框 -->
        <el-dialog
        title="修改品牌与分类"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="editForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCateInfo">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default{
    data() {
        return {
            // 查询条件
            querInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 商品分类的数据列表 
            catelist:[],
            // 总数据条数
            total:0,
            // 为table指定列的定义
            columns:[{
                label:'品牌与分类',
                prop:'cat_name'
            },{
                label:'是否新国标',
                // 表示将但前列定义为模板列 
                type:'template',
                // 表示当前这一列使用的模板名称
                template:'isok'
            },
            {
                label:'排序',
                // 表示将但前列定义为模板列 
                type:'template',
                // 表示当前这一列使用的模板名称
                template:'order'
            },
            {
                label:'操作',
                // 表示将但前列定义为模板列 
                type:'template',
                // 表示当前这一列使用的模板名称
                template:'opt'
            }
        ],
        // 控制添加分类 对话框的显示与隐藏
        addCateDialogVisible:false,
        // 添加分类的表单数据对象 用来放表单数据的
        addCateForm:{
            // 将要添加的分类的名称
            cat_name:'',
            // 父级分类的id
            cat_pid: 0,
            // 分类等级默认为1级分类
            cat_level: 0
        },
        // 添加分类的校验规则对象
        addCateFormRules:{
            cat_name:[
                { required:true,message:'请输入品牌与分类的名称',trigger:'blur' }
            ]
        },
        // 父级分类的列表数组
        parentCateList:[],
        // 指定级联选择器的配置对象
        cascaderProps:{
            value:'cat_id',
            label:'cat_name',
            children:'children',
            checkStrictly: true
        },
        // 选中的父级分类的id数组
        selectKeys:[],
        // 修改分类的对话框的显示与隐藏
        editDialogVisible:false,
        // 查询到的修改分类信息对象的信息
        editForm:{},
        // 修改分类表单的验证规则对象 验证规则都是数组
        editFormRules:{
                cat_name:[
                    {required:true,message:'请输入品牌与分类名称',trigger:'blur'}
                ]
            },
            
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取商品分类数据
        async getCateList(){
          const {data:res} = await this.$http.get('categories',{params:this.querInfo})
          if(res.meta.status!==200){
              return this.$message.error('获取单车分类失败')
          }
        //   console.log(res.data)
        // 把数据列表赋值给catelist
          this.catelist=res.data.result
        //   为总数据条数赋值
          this.total=res.data.total
        },
        // 监听页大小改变的函数
        handleSizeChange(newSize){
            this.querInfo.pagesize=newSize
            this.getCateList()
        },
        // 监听页码改变的函数
        handleCurrentChange(newPage){
            this.querInfo.pagenum=newPage
            this.getCateList()
        },
        // 控制 添加分类对话框 的显示与隐藏
        showAddCateDialog(){
            // 先获取父级分类的数据列表 在展示对话框
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据列表
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:
            { type: 2 } })

            if(res.meta.status!==200){
                return this.$message.error('获取父级分类数据失败')
            }
            // console.log(res.data)
            this.parentCateList = res.data
        },
        // 选择项发生变化出发这个函数
        parentCateChanged(){
            console.log(this.selectKeys)
            // 如果 selectKeys数组中的length大于0，证明选中了父级分类
            // 反之 就说明没有选中任何父级分类
            // 父级分类的id
            if(this.selectKeys.length > 0){
               this.addCateForm.cat_pid = this.selectKeys[
                   this.selectKeys.length -1
                ]
               // 为当前分类的等级赋值
               this.addCateForm.cat_level = this.selectKeys.length
               return
            }else{
                this.addCateForm.cat_pid = 0
               // 为当前分类的等级赋值
               this.addCateForm.cat_level = 0
            }   
        },
        // 点击按钮 添加新的份类
        addCate(){
            this.$refs.addCateFormRef.validate(async valid =>{
                if(!valid) return
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                
                if(res.meta.status!==201){
                    return this.$message.error('添加分类失败')
                }

                this.$message.success('添加分类成功')
                this.getCateList()
                this.addCateDialogVisible=false
            })
        },
        // 监听对话框的关闭事件 重置表单数据
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            // 关闭对话框  重新清空级联选择器
            this.selectKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        // 展示编辑分类的对话框
        async showEditDialog(id){
            console.log(id)
            const {data:res} = await this.$http.get('categories/'+id)
            if(res.meta.status!==200) return this.$message.error('查询品牌与分类信息失败！')
            this.editForm=res.data
            this.editDialogVisible = true
        },
        editCateInfo(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} =await this.$http.put('categories/'+this.editForm.cat_id,
                {
                    cat_name:this.editForm.cat_name
                })
                if(res.meta.status!==200){
                    return this.$message.error('更新品牌与分类名称失败')
                }else{
                    // 关闭对话框
                    this.editDialogVisible=false
                    // 刷新数据列表
                    this.getCateList()
                    // 提示修改成功
                    this.$message.success('更新品牌与分类名称成功')
                }
            })
        },
        async removeCateById(id){
            //弹框提示是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该品牌与分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err => err) //取消时返回err  
                // 如果用户确认删除 则返回值为字符串 comfirm
                // 如果用户取消删除 则返回值为字符串 cancel
                // console.log(confirmResult)
                if(confirmResult!=='confirm'){
                    return this.$message.info('取消删除')
                }
                 // 删除需访问API接口 请求方式为delete
                 const {data:res} = await this.$http.delete('categories/' + id)
                 if(res.meta.status!==200){
                    return this.$message.error('删除品牌与分类失败！')
                }
                else{
                    this.$message.success('删除品牌与分类成功！')
                    this.getCateList()
                }五羊梦幻电动车
        }


    }
}
</script>

<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>