<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <!-- 添加角色按钮区域 -->
                <el-col>
                    <el-button type="primary" @click="addRolesVisible = true">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="roleslist" border stripe>
                <!-- 展开列 -->
                <el-table-column type=expand>
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1===0 ? 'bdtop':'','vcenter']" 
                        v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row,item1.id)" 
                                closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                               <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" 
                               v-for="(item2,i2) in item1.children" :key="item2.id">
                                   <el-col :span="6">
                                       <el-tag type="success" 
                                       @close="removeRightById(scope.row,item2.id)" 
                                       closable>{{item2.authName}} </el-tag>
                                       <i class="el-icon-caret-right"></i>
                                   </el-col>
                                   <el-col :span="18">
                                       <el-tag @close="removeRightById(scope.row,item3.id)" 
                                       closable type="warning" 
                                       v-for="(item3,i3) in item2.children" 
                                       :key="item3.id">{{item3.authName}}</el-tag>
                                   </el-col>
                               </el-row>
                            </el-col>
                        </el-row>
                     <!-- <pre>
                        {{scope.row}}
                     </pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" 
                        @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                        @click="removeRolesById(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" 
                        @click="showSetRightDialog(scope.row)"
                        icon="el-icon-setting" >分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
        </el-card>

        <!-- 添加角色的对话框 -->
        <el-dialog
        @close="addRolesClosed"
        title="添加角色"
        :visible.sync="addRolesVisible"
        width="50%">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" ref="addFormRef"
         label-width="70px" :rules="addFormRules">
                <el-form-item label="名称" prop="roleName" >
                  <el-input v-model="addForm.roleName" ></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc" ></el-input>
                </el-form-item>
        </el-form>

        <!-- 对话框底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addRolesVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoles" >确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改角色的对话框 -->
        <el-dialog
        @close="editDialogClosed"
        title="修改角色信息"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
            <el-form-item label="名称" prop="roleName">
              <el-input v-model="editForm.roleName" ></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="roleDesc">
                <el-input v-model="editForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary"@click="editRolesInfo">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配权限的对话框 -->
        <el-dialog
        @close="setRightDialogClosed"
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%">
        <!-- 树形控件 -->
        <el-tree :data="rightslist" :props="treeProps" 
        show-checkbox ref="treeRef"
        node-key="id" default-expand-all
        :default-checked-keys="defKeys"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
export default{
    data() {
        return{
            // 所有角色列表数据
            roleslist:[],
            // 控制添加角色 对话框的隐藏与显示
            addRolesVisible:false,
            // 添加角色数据的表单
            addForm:{
                roleName:'',
                roleDesc:'',
            },
            addFormRules:{
                roleName:[
                    {required:true,message:'请输入角色名称',trigger:'blur'}
                ],
                roleDesc:[
                    {required:true,message:'请输入角色描述',trigger:'blur'}
                ]
            },
            // 查询到的角色信息 对象
            editForm:{},
            // 控制修改角色 对话框的隐藏与显示
            editDialogVisible:false,
            // 修改角色表单的验证规则对象 验证规则都是数组
            editFormRules:{
                roleName:[
                    {required:true,message:'请输入角色名称',trigger:'blur'}
                ],
                roleDesc:[
                    {required:true,message:'请输入角色描述',trigger:'blur'}
                ]
            },
            // 根据id删除对应的权限
            async removeRightById(role,rightId){
                // 弹框提示用户是否删除
                const comfirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err => err)

                if(comfirmResult !== 'confirm'){
                    return this.$message.info('取消删除')
                }
                const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                
                if(res.meta.status !==200){
                    return this.$message.error('删除权限失败')
                }

                // this.getRolesList()
                role.children = res.data
            },
            // 控制 分配权限对话框 的显示与隐藏
            setRightDialogVisible:false,
            // 权限的所有数据
            rightslist:[],
            // 属性控件的属性绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            },
            // 默认选中的节点id值数组
            defKeys:[],
            // 当前即将分配权限的角色id
            roleId:''

            
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        // 获取噢有角色的列表
        async getRolesList(){
         const {data:res} = await this.$http.get('roles')
         if(res.meta.status!==200){
             return this.$message.error('获取角色列表失败！')
         }
        //  获取没有失败直接赋值
         this.roleslist=res.data
         console.log(this.roleslist)
        },
        // 监听添加角色对话框的关闭事件
        addRolesClosed(){
            this.$refs.addFormRef.resetFields()
        },
        //点击确定按钮 新增角色
        addRoles(){
            // 预校验
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return
                // 可以发起添加角色的网络请求
                const {data:res} = await this.$http.post('roles',this.addForm)
                if(res.meta.status!==201){
                    this.$message.error('添加角色失败')
                }
                this.$message.success('添加角色成功')
                // 成功添加 隐藏添加角色的对话框
                this.addRolesVisible = false
                // 重新刷新角色列表
                this.getRolesList()
            })
        },
        // 展示编辑 角色 的对话框
        async showEditDialog(id){
            // console.log(id)
            const {data:res} = await this.$http.get('roles/'+id)
            // console.log(res)
            if(res.meta.status!==200) return this.$message.error('查询角色信息失败！')
            this.editForm=res.data
            this.editDialogVisible = true
        },
        // resetFileds 重置函数
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        // 点击确定按钮  修改数据并提交
        editRolesInfo(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid) return
                const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,
                {
                    roleName:this.editForm.roleName,
                    roleDesc:this.editForm.roleDesc
                }) 
                if(res.meta.status!==200){
                    return this.$message.error('更新角色信息失败')
                }else{
                    // 关闭对话框
                    this.editDialogVisible=false
                    // 刷新数据列表
                    this.getRolesList()
                    // 提示修改成功
                    this.$message.success('更新角色数据成功')
                }
            })
        },
        // 根据页面传递的id值移除数据
        async removeRolesById(id){
            // console.log(id)
            //弹框提示是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err => err) //取消时返回err  
                // 如果用户确认删除 则返回值为字符串 comfirm
                // 如果用户取消删除 则返回值为字符串 cancel
                if(confirmResult!=='confirm'){
                    return this.$message.info('取消删除')
                }
                // console.log(confirmResult) //打印返回值
                // 删除需访问API接口 请求方式为delete
                const {data:res} = await this.$http.delete('roles/' + id)
                if(res.meta.status!==200){
                    return this.$message.error('删除角色失败！')
                }
                else{
                    this.$message.success('删除角色成功！')
                    this.getRolesList()
                }
        },
        // 展示分配权限的对话框
        async showSetRightDialog(role){
            this.roleId = role.id
            // 获取所有权限的数据
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status!==200){
                return this.$message.error('获取权限数据失败')
            }
            // 把获取到的权限数据保存到 rightslist
            this.rightslist=res.data
            console.log(this.rightslist)

            // 递归获取三级节点的id
            this.getLeafKeys(role,this.defKeys)

            this.setRightDialogVisible=true
        },
        // 通过递归的形式，获取角色下的所有三级权限id
        // 并保存到数组中
        getLeafKeys(node,arr){
            // 如果node不包含children属性,表示是三级节点
            if(!node.children){
                return arr.push(node.id)
            }

            // 递归寻找三级节点
            node.children.forEach(item =>
            this.getLeafKeys(item,arr))
        },
        // 监听分配权限对话框的关闭时间
        setRightDialogClosed(){
            this.defKeys=[]
        },
        // 点击为角色分配权限
        async allotRights(){
            const keys=[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys)
            // 将数组拼接成字符串 以 , 进行拼接
            const idStr = keys.join(',')

            // 发送post请求 链接数据库
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            
            if(res.meta.status!==200){
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.setRightDialogVisible=false
        }
        

    }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top:1px solid #eee;
}
.bdbottom{
    border-bottom:1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>