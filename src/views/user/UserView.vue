<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">+新增</el-button>
    <el-dialog
      v-model="dialogVisible"
      :title="action === 'add' ? '新增用户' : '编辑用户'"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        :model="formUser"
        ref="userForm"
        label-position="left"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="姓名"
              prop="name"
              :rules="[{ required: true, message: '必填项' }]"
            >
              <el-input v-model="formUser.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="年龄"
              prop="age"
              :rules="[
                { required: true, message: '必填项' },
                { type: 'number', message: '必须是数字' },
              ]"
            >
              <el-input
                v-model.number="formUser.age"
                placeholder="请输入年龄"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="性别"
              prop="sex"
              :rules="[{ required: true, message: '必选项' }]"
            >
              <el-select v-model="formUser.sex" placeholder="请选择">
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="出生日期"
              prop="birth"
              :rules="[{ required: true, message: '必选项' }]"
            >
              <el-date-picker
                v-model="formUser.birth"
                type="date"
                placeholder="请选择"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="地址"
          prop="addr"
          :rules="[{ required: true, message: '必填项' }]"
        >
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancle">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input v-model="formInline.keyword" placeholder="请输入..." />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table :data="tableData" style="width: 100%" height="457">
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 150"
      />
      <el-table-column label="Operations" min-width="160">
        <template #default="scop">
          <el-button size="small" @click="handleEdit(scop.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scop.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      small
      background
      layout="prev, pager, next"
      :total="config.total"
      class="mt-4 pager"
      @current-change="changePage"
    />
  </div>
</template>

<script setup>
import { getUserData, addUser, editUser, deleteUser } from "@/api/api";
import { onMounted, ref, reactive } from "vue";
import { nextTick } from "process";

const tableData = ref([]);
const tableLabel = reactive([
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "sexLabel",
    label: "性别",
  },
  {
    prop: "birth",
    label: "出生日期",
    width: 200,
  },
  {
    prop: "addr",
    label: "地址",
    width: 320,
  },
]);
//分页信息
const config = reactive({
  total: 0,
  page: 1,
  name: "",
});
//搜索信息
const formInline = reactive({
  keyword: "",
});
//表单信息
const formUser = reactive({
  name: "",
  age: "",
  sex: "",
  birth: "",
  addr: "",
});
//控制模态框
const dialogVisible = ref(false);
const userForm = ref();
//区分新增和编辑
const action = ref("add");
//时间格式化
const timeFormat = (a) => {
  let time = new Date(a);
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let date = time.getDate();
  function add(m) {
    return m < 10 ? "0" + m : m;
  }
  return year + "-" + add(month) + "-" + add(date);
};
onMounted(() => {
  getUserInfo(config);
});
//获取user信息
const getUserInfo = async (config) => {
  await getUserData(config).then((res) => {
    config.total = res.data.data.count;
    tableData.value = res.data.data.list.map((item) => {
      item.sexLabel = item.sex === 0 ? "女" : "男";
      return item;
    });
  });
};
//user信息分页
const changePage = (page) => {
  config.page = page;
  getUserInfo(config);
};
//搜索
const handleSearch = () => {
  config.name = formInline.keyword;
  getUserInfo(config);
};
//模态框
const handleClose = (done) => {
  ElMessageBox.confirm("确定关闭吗?")
    .then(() => {
      userForm.value.resetFields();
      done();
    })
    .catch(() => {});
};
//取消
const handleCancle = () => {
  dialogVisible.value = false;
  userForm.value.resetFields();
};
//新增用户
const handleAdd = () => {
  action.value = "add";
  dialogVisible.value = true;
};
const onSubmit = () => {
  //前端校验表单数据,再提交到后端
  userForm.value.validate(async (valid) => {
    if (valid) {
      //判断当前是新增还是编辑,调用不同的接口
      if (action.value === "add") {
        formUser.birth = timeFormat(formUser.birth);
        let res = await addUser(formUser);
        if (res) {
          dialogVisible.value = false;
          //重置模态框
          userForm.value.resetFields();
          await getUserInfo(config);
        }
      } else {
        //编辑,后台的sex是数字,前端的sex是字符,需要变换
        formUser.sex === "男" ? (formUser.sex = 1) : (formUser.sex = 0);
        formUser.birth = timeFormat(formUser.birth);
        let res = await editUser(formUser);
        if (res) {
          dialogVisible.value = false;
          userForm.value.resetFields();
          await getUserInfo(config);
        }
      }
    } else {
      ElMessage({
        message: "请输入正确的内容",
        showClose: true,
        type: "error",
      });
    }
  });
};
//编辑用户数据
const handleEdit = (row) => {
  row.sex = row.sex === 1 ? "男" : "女";
  action.value = "edit";
  dialogVisible.value = true;
  //将编辑的数据传到模态框,需要浅拷贝
  nextTick(() => {
    Object.assign(formUser, row);
  });
};
//删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm("确认删除吗?").then(async () => {
    await deleteUser({
      id: row.id,
    });
    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
    });
    await getUserInfo(config);
  });
};
</script>

<style lang="less" scoped>
.table {
  position: relative;

  .pager {
    position: absolute;
    right: 0;
    bottom: -30px;
  }
}

.user-header {
  display: flex;
  justify-content: space-between;
}
</style>