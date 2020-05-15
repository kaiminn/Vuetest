<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="onHandleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      row-key="id"
      :data="typeList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        :label="$t('gift.giftId')"
        prop="id"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('gift.giftName')"
        width="auto"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.typeName }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('gift.releaseTtime')"
        align="center"
        width="400"
      >
        <template slot-scope="{row}">
          {{ row.createDatetime | parseTime('{y}/{m}/{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="auto"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            @click="onHandleEdit(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="onHandleDelete(row)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="Status[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempGiftTypeData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          :label="$t('table.name')"
          prop="typeName"
        >
          <el-input v-model="tempGiftTypeData.typeName" />
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus===Status.create?createData():updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getGiftList"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { IGiftType } from '@/api/types'
import Sortable from 'sortablejs'
import { getGiftTypeList, updateGiftType, defaultGiftTypeData, addGiftType } from '@/api/giftItem'
import { getAgentList } from '@/api/admin'
import { UserModule } from '@/store/modules/user'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'GiftTypeTable',
  components: {
    Pagination
  }

})

export default class extends Vue {
  [x: string]: any

    readonly Status = {
      update: 'Edit',
      create: 'Create'
    }

  private typeList: IGiftType[] = [] // 禮物類型資料
  private agentIDs : Array<string> = []; // 取得的agent id 列表
  private total = 0 // 用來判斷頁面
  private listLoading = true // 是否撥放表格loading動畫
  private listQuery = {
    page: 1,
    limit: 20,
    agentId: '1'
  }

  //= =========dialog use=============

  private dialogStatus = this.Status.create // 表單狀態
  private dialogFormVisible = false // 禮物表單顯示使用

  // 禮物欄位資料驗證
  private rules = {
    typeName: [{ required: true, message: 'name is required', trigger: 'blur' }]
  }
  private tempGiftTypeData = defaultGiftTypeData // 新增或更新 禮物時的欄位資料

  created() {
    this.listLoading = false
    this.getAgentList().then(() => this.getGiftTypeList())
    console.log('=======================')
  }

  // 取得Agent ID 列表
  private async getAgentList() {
    const { data } = await getAgentList()

    // 取出未被禁用的 AgentID
    data.forEach((agent: {account:string;isEnabled:boolean;prefix:string}) => {
      if (agent.isEnabled) {
        this.agentIDs.push(agent.account)
      }
    })

    this.listQuery.agentId = UserModule.name
  }

  // 取得禮物型態
  private async getGiftTypeList() {
    this.listLoading = true
    this.typeList = []
    const { data } = await getGiftTypeList(this.listQuery)
    // 開始塞項目到 giftList
    data.GiftTypes.forEach((element: IGiftType) => {
      if (element.isEnabled) {
        this.typeList.push(element)
      }
    })

    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // typeId 轉 typeName 用來做顯示
  private formatTypeIdToName(row:any, column:any, cellValue:any) {
    let type = this.typeList.find((item : IGiftType) => {
      return item.id === cellValue
    })

    if (type) {
      return type.typeName
    }

    return 'not find type'
  }

  // 加入禮物頁面需做欄位reset
  private resetTempArticleData() {
    this.tempGiftTypeData = cloneDeep(defaultGiftTypeData)
  }

  // 當創建按鈕被按下
  private onHandleCreate(scope: any) {
    this.resetTempArticleData()
    this.dialogStatus = this.Status.create
    console.log('onHandleCreate dialogStatus: ' + this.dialogStatus)
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  // 當編輯按鈕被按下
  private onHandleEdit(row: any) {
    this.tempGiftTypeData = Object.assign({}, row)
    this.tempGiftTypeData.createDatetime = +new Date(this.tempGiftTypeData.createDatetime)
    this.dialogStatus = this.Status.update
    console.log('onHandleEdit dialogStatus: ' + this.dialogStatus)
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  // 當刪除項目
  private async onHandleDelete(row: any) {
    this.tempGiftTypeData = Object.assign({}, row)
    this.tempGiftTypeData.isEnabled = false
    // 設定一筆資料為disable
    await updateGiftType(this.tempGiftTypeData)
    let index = 0
    this.typeList.forEach((gift) => {
      if (gift.id === this.tempGiftTypeData.id) {
        index = this.typeList.indexOf(gift)
      }
    })

    this.typeList.splice(index, 1)
  }

  // 創建一筆資料
  private createData() {
    (this.$refs['dataForm'] as Form).validate(async(valid) => {
      if (valid) {
        this.tempGiftTypeDataorderId = 0
        this.tempGiftTypeData.agentId = this.listQuery.agentId

        const respne = await addGiftType(this.tempGiftTypeData)
        if (respne.data) {
          this.tempGiftTypeData.id = respne.data.id
          this.tempGiftTypeData.createDatetime = respne.data.createDatetime
          this.typeList.unshift(this.tempGiftTypeData)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      }
    })
  }

  // 更新一筆資料
  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async(valid) => {
      if (valid) {
        const { data } = await updateGiftType(this.tempGiftTypeData)

        for (const v of this.typeList) {
          if (v.id === this.tempGiftTypeData.id) {
            const index = this.typeList.indexOf(v)
            this.typeList.splice(index, 1, this.tempGiftTypeData)
            break
          }
        }

        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }
}
</script>
<style scoped>
.filter-container {
  display: flex;
  justify-content: space-between
}

 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color:#409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
</style>
