<template>
  <div class="contentBox">
    <div v-if="isList">
      <div class="searchForm">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="发布时间">
            <el-date-picker v-model="formInline.startTime" type="date" placeholder="开始时间" value-format="YYYY-MM-DD"
              format="YYYY-MM-DD" clearable @change="handleQuery" :disabled-date="disabledDateFirst" />-
            <el-date-picker v-model="formInline.endTime" type="date" placeholder="结束时间" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" :disabled-date="disabledDate" @change="handleQuery" clearable />
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.keyword" class="w-50 m-2" placeholder="请输入关键词">
              <template #prefix>
                <el-icon class="el-input__icon">
                  <search />
                </el-icon>

              </template>
              <template #append>
                <el-button type="primary" class="colorBlue" :icon="Search" @click="handleQuery"></el-button>
              </template>

            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetQuery">重置</el-button>

          </el-form-item>
        </el-form>
      </div>
      <div style="text-align:right;margin-bottom:10px">
        <el-button type="primary" @click="delData">删除</el-button>
      </div>
      <el-table ref="multipleTableRef" :data="tableData" v-loading="tableLoad"
        style="width: 100%;height:calc(100vh - 180px)" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" align="center" width="80" :index="indexMethod" />
        <el-table-column align="center" label="文章标题">
          <template #default="scope">
            <div style="text-align:left;cursor: pointer;" :class="{ selectColor: scope.row.id == currentData?.id }"
              @click="changePage(scope.row)">
              <div class="ellipsisText" :title="scope.row.title">{{ scope.row.title }}</div>
              <div class="ellipsisText" :title="scope.row.titleCn">{{ scope.row.titleCn }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" property="name" label="原文/本地 链接">
          <template #default="scope">
            <div style="text-align:left" class="ellipsisText" :title="scope.row.url">
              {{ scope.row.url }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="信息来源">
          <template #default="scope">
            <div class="ellipsisText" :title="scope.row.site">{{ scope.row.site }}</div>
            <div class="ellipsisText" :title="scope.row.source">{{ scope.row.source }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" property="date" label="发布时间" width="120" />
      </el-table>
      <div style="margin-top: 20px;" class="paginCon">
        <el-pagination v-model:current-page="formInline.pageNumber" background :page-size="formInline.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleQuery"
          @current-change="handleQuery" />
      </div>
    </div>
    <div v-else>
      <div style="display: flex;">
        <div style="flex: 1;margin-right: 10px;">
          <p style="text-align: center;">原文</p>
          <div class="translateBox" v-html="currentData?.content">
          </div>
        </div>
        <div style="flex: 1;">
          <p style="text-align: center;">中文译文</p>
          <div class="translateBox" style="background-color: rgb(249,251,255);" v-html="currentData?.contentCn">
          </div>
        </div>
      </div>
      <div style="width: 100%;height: 60px;text-align: center;margin-top: 10px;">
        <el-button type="primary" size="large" @click="() => { isList = true }" style="">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, } from "vue";
import { ElTable, ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { deleteList, getList, article } from "@/apis/index";

const formInline = reactive({
  keyword: null,
  startTime: null,
  endTime: null,
  pageSize: 20,
  pageNumber: 1
});
const disabledDateFirst = (time: Date) => {
  if (formInline.endTime == null) {
    return false
  } else {
    let endTime = formInline.endTime as string
    return time.getTime() > new Date(endTime).getTime()
  }
}
const disabledDate = (time: Date) => {
  if (formInline.startTime == null) {
    return false
  } else {
    let startTime = formInline.startTime as string
    return time.getTime() < (new Date(startTime).getTime() - (24 * 3600 * 1000))
  }
}
let isList = ref<boolean>(true);
let total = ref<number>();
// let tableData = ref<User[]>();
let tableData = ref<User[]>([])
let tableLoad = ref<boolean>(false);
const handleQuery = () => {
  tableLoad.value = true
  let obj = { ...formInline }
  getList(obj).then((res: any) => {
    if (res.code == 200) {
      tableData.value = res.data.data
      total.value = res.data.total
      tableLoad.value = false
    }
  });
};
const resetQuery = () => {
  formInline.keyword = null;
  formInline.startTime = null;
  formInline.endTime = null;
  handleQuery()
};

interface User {
  id: string | number,
  [key: string]: any,
  content: string,
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
let currentData = ref<User>()
onMounted(() => {
  handleQuery()
})
const changePage = (val: User) => {

  article(val.id).then((res) => {
    if (res.data.content) {
      res.data.content = res.data.content.replace(/\n{2,}/g, '\n')
    }
    currentData.value = res.data;
    isList.value = false;
  }
  )

}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
const delData = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error('请选择需要删除的数据！')
    return
  }
  let ids = multipleSelection.value.map((e) => e.id).join(',')
  deleteList(ids).then((res: any) => {
    if (res.code == 200) {
      ElMessage.success(`${res.msg}`)
      handleQuery()
    }
  })
};
const indexMethod = (index: number) => {
  return index + 1;
};

</script>
<style scoped>
.contentBox {
  padding: 10px;
}

.translateBox {
  padding: 10px;
  border: 1px solid #ddd;
  height: calc(100vh - 180px);
  border-radius: 8px;
  overflow: auto;
  white-space: pre-line;
}

.searchForm {
  margin: 10px;
  padding-left: 20px;
  box-sizing: border-box;
}

.searchForm .el-form-item {
  margin-bottom: 0px;
}

.colorBlue {
  background-color: #409eff !important;
  color: #fff !important;
}

.ellipsisText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.paginCon {
  margin-top: 20px;
}

.selectColor {
  color: blueviolet;
}

.paginCon .el-pagination {
  justify-content: end;
}
</style>
