<template>
  <div
    id="gift-item-table"
    class="app-container"
  >
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
      <el-button
        v-show="isUpdateSort"
        class="filter-item"
        style="margin-right: 10px;"
        type="warning"
        icon="el-icon-check"
        @click="onHandleSaveSort"
      >
        {{ $t('gift.saveOrder') }}
      </el-button>
    </div>
    <el-table
      ref="draggableTable"
      v-loading="listLoading"
      row-key="id"
      :data="giftList"
      :row-style="rowStyle"
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
        :label="$t('gift.giftType')"
        prop="typeId"
        width="auto"
        align="center"
        :formatter="formatTypeIdToName"
      />
      <el-table-column
        :label="$t('gift.giftClassification')"
        width="auto"
        align="center"
      >
        <span>默认分类</span>
      </el-table-column>
      <el-table-column
        :label="$t('gift.giftName')"
        width="auto"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('gift.currency')"
        align="center"
        width="auto"
      >
        <template slot-scope="{row}">
          {{ row.currency }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('gift.giftImage')"
        class-name="status-col"
        width="auto"
      >
        <template slot-scope="{row}">
          <img
            v-if="row.imageUrl"
            :src="assetsDomainName + row.imageUrl"
            width="50"
            height="50"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          />
        </template>
      </el-table-column>
      <el-table-column

        :label="$t('gift.giftAnime')"
        width="auto"
        align="center"
      >
        <template slot-scope="{row}">
          <lottie-animation
            :path="assetsDomainName + row.animeUrl"
            :width="50"
            :height="50"
            :auto-play="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('gift.releaseTtime')"
        align="center"
        width="250"
      >
        <template slot-scope="{row}">
          {{ row.createDatetime | parseTime('{y}/{m}/{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="300"
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
          <el-button
            v-if="row.isEnabled"
            type="danger"
            size="small"
            plain
            @click="onHandleEnable(row)"
          >
            {{ $t('table.disable') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            plain
            @click="onHandleEnable(row)"
          >
            {{ $t('table.enable') }}
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
        :model="tempGiftItemData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          :label="$t('table.type')"
          prop="typeId"
        >
          <el-select
            v-model="tempGiftItemData.typeId"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="type in typeList"
              :key="type.id"
              :label="type.typeName"
              :value="type.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.name')"
          prop="name"
        >
          <el-input v-model="tempGiftItemData.name" />
        </el-form-item>
        <el-form-item
          :label="$t('gift.currency')"
          prop="currency"
        >
          <el-input v-model="tempGiftItemData.currency" />
        </el-form-item>
        <el-form-item
          :label="$t('gift.giftImage')"
          prop="imageUrl"
        >
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="uploadImage"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img
              v-if="tempGiftItemData.imageUrl"
              :src="assetsDomainName + tempGiftItemData.imageUrl"
              width="128"
              height="128"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="background-color: #f5f1f0;"
            />
          </el-upload>
          <p>{{ $t('table.suggest') + ' 70 x 70 icon, 2MB' }}</p>
        </el-form-item>
        <el-form-item
          :label="$t('gift.giftAnime')"
          prop="animeUrl"
        >
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="uploadLottieJson"
            :before-upload="beforeLottieUpload"
            :on-success="handleAvatarSuccess"
          >
            <lottie-animation
              v-if="tempGiftItemData.animeUrl"
              :path="assetsDomainName + tempGiftItemData.animeUrl"
              :width="128"
              :height="128"
              :auto-play="true"
            />
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="background-color: #f5f1f0;"
            />
          </el-upload>
          <p>{{ ' Lottie josn file only' }}</p>
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
import { IGiftItem, IGiftType } from '@/api/types'
import Sortable from 'sortablejs'
import { addImage, addJsonFile } from '@/api/assets'
import {
  getGiftItemList, addGiftItem, updateGiftItem, getGiftTypeList, deleteGiftItem, defaultGiftItemData } from '@/api/giftItem'
import { getAgentList } from '@/api/admin'
import { UserModule } from '@/store/modules/user'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import axios from 'axios'
import LottieAnimation from '@/components/LottieAnimation/index.vue'
import { apiBaseURL } from '@/utils/request'

interface ILottieOptions{
 path : string,
 loop : boolean,
 autoplay : boolean
}

interface IRow{
 row : any,
 rowIndex : number,
}

@Component({
  name: 'GiftItemTable',
  components: {
    Pagination,
    LottieAnimation
  }

})

export default class extends Vue {
  [x: string]: any
  private assetsDomainName = ''
  readonly Status = {
    update: 'Edit',
    create: 'Create'
  }

    readonly IMAGE_FORMAAT = {
      WIDTH: '70',
      HEIGHT: '70'
    }

  private isUpdateSort = false // 判斷排序是否更動 需不需要更新
  private giftList: IGiftItem[] = [] // 禮物列表資料
  private typeList: IGiftType[] = [] // 禮物類型資料
  private oldList: number[] = [] // 舊禮物列表排列 [禮物id]
  private newList: number[] = [] // 新禮物列表排列 [禮物id]
  private agentIDs : Array<string> = []; // 取得的agent id 列表
  private total = 0 // 用來判斷頁面
  private listLoading = true // 是否撥放表格loading動畫
  private listQuery = {
    page: 1,
    limit: 20,
    agentId: '0'
  }

  //= =========dialog use=============
  private dialogStatus = this.Status.create // 表單狀態
  private dialogFormVisible = false // 禮物表單顯示使用

  // 禮物欄位資料驗證
  private rules = {
    typeId: [{ required: true, message: 'type is required', trigger: 'change' }],
    name: [{ required: true, message: 'name is required', trigger: 'blur' }],
    currency: [{ required: true, message: 'currency is required', trigger: 'blur' }],
    imageUrl: [{ required: true, message: 'image Url is required', trigger: 'blur' }]
  }
  private tempGiftItemData = defaultGiftItemData // 新增或更新 禮物時的欄位資料

  //= =========ImageUpload use=======
  private imageUrl = ''

  created() {
    this.listLoading = false
    this.getAgentList().then(() => this.getGiftList()).then(() => this.getGiftTypeList())
    this.assetsDomainName = apiBaseURL + '/AssetsSystem/'
    console.log('========created this.assetsDomainName===============> ', this.assetsDomainName)
  }

  // 頁面關閉前判斷儲存
  beforeRouteLeave(to: any, from: any, next: any): void {
    console.log('this.isUpdateSort: ', this.isUpdateSort)
    if (this.isUpdateSort) {
      const answer = window.confirm('当前页面数据未保存，确定要离开？')
      if (answer) {
        this.isUpdateSort = false
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }

  rowStyle(row : IRow): Object {
    console.log('tableRowClassName = ', row.rowIndex)
    if (!row.row.isEnabled) {
      return { background: '#D0D0D0' }
    } else {
      return {}
    }
  }

  // 上傳圖片
  private async uploadImage(param:any) {
    var fileObj = param.file
    let fd = new FormData()
    fd.append('file', fileObj)
    fd.append('width', this.IMAGE_FORMAAT.WIDTH)
    fd.append('height', this.IMAGE_FORMAAT.HEIGHT)

    const { data } = await addImage(fd)
    this.tempGiftItemData.imageUrl = data
    console.log('data = ' + this.assetsDomainName + this.tempGiftItemData.imageUrl)
  }

  // 用來驗證圖片
  beforeAvatarUpload(file: any) {
    console.log('beforeAvatarUpload: ', file.type)
    const isLt2M = file.size / 1000 / 1000 < 2

    const imageFileFormat = ['image/png', 'image/jpeg', 'image/jpg']
    const isType = imageFileFormat.includes(file.type)

    if (!isType) {
      this.$message.error('上传头像图片只能是 JPG 或 png 格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传头像图片大小不能超过 2MB!')
    }

    return isType && isLt2M
  }

  // 上傳成功處理
  handleAvatarSuccess(res: any, file: any) {
    console.log('handleAvatarSuccess', file)
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

  // 用來驗證lottie格式
  beforeLottieUpload(file: any) {
    console.log('beforeLottieUpload')
    const isType = file.type === ('application/json')

    if (!isType) {
      this.$message.error('上传只能是 json 格式!')
    }

    return isType
  }

  // 上傳lottie json檔
  private async uploadLottieJson(param:any) {
    var fileObj = param.file

    let fd = new FormData()
    fd.append('file', fileObj)
    const { data } = await addJsonFile(fd)
    this.tempGiftItemData.animeUrl = data
  }

  // 取得禮物列表
  private async getGiftList() {
    this.listLoading = true
    this.giftList = []
    if (this.listQuery.agentId !== '0') {
      const { data } = await getGiftItemList(this.listQuery)
      // 開始塞項目到 giftList
      data.giftItems.forEach((element: IGiftItem) => {
        this.giftList.push(element)
      })

      // 排序用
      this.oldList = this.giftList.map((v) => v.id)
      this.newList = this.oldList.slice()

      // 刷新排序
      this.$nextTick(() => {
        this.doGiftSort()
      })
    }

    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 取得禮物型態
  private async getGiftTypeList() {
    this.typeList = []
    const { data } = await getGiftTypeList(this.listQuery)
    // 開始塞項目到 giftList
    data.GiftTypes.forEach((element: IGiftType) => {
      if (element.isEnabled) {
        this.typeList.push(element)
      }
    })
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

  // 設定排序
  private doGiftSort() {
    console.log('doGiftSort: this.isUpdateSort= ' + this.isUpdateSort)
    const el = (this.$refs.draggableTable as Vue).$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0] as HTMLElement
    this.sortable = Sortable.create(el, {
      ghostClass: 'sortable-ghost', // Class name for the drop placeholder
      onEnd: evt => {
        if (typeof (evt.oldIndex) !== 'undefined' && typeof (evt.newIndex) !== 'undefined') {
          const targetRow = this.giftList.splice(evt.oldIndex, 1)[0]
          this.giftList.splice(evt.newIndex, 0, targetRow)
          this.isUpdateSort = true

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      }
    })
  }

  // 加入禮物頁面需做欄位reset
  private resetTempArticleData() {
    this.tempGiftItemData = cloneDeep(defaultGiftItemData)
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
    this.tempGiftItemData = Object.assign({}, row)
    // this.tempGiftItemData.createDatetime = +new Date(this.tempGiftItemData.createDatetime)
    this.dialogStatus = this.Status.update
    console.log('onHandleEdit dialogStatus: ' + this.dialogStatus)
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  // 當儲存排序的按鈕被按下
  private onHandleSaveSort(row: any) {
    const insertData = []
    for (let i = 0; i < this.newList.length; i++) {
      if (this.newList[i] !== this.oldList[i]) {
        let tempGiftItemData = Object.assign({}, this.giftList[i])
        tempGiftItemData.orderId = this.newList.length - i + 1
        insertData.push(tempGiftItemData)
      }
    }

    this.updateSort(this.listQuery.agentId, insertData)
    this.oldList = this.newList.slice()
    this.isUpdateSort = false
  }

  //  刪除
  private async onHandleDelete(row: any) {
    this.tempGiftItemData = Object.assign({}, row)
    this.tempGiftItemData.isEnabled = false
    // 設定一筆資料為disable
    await deleteGiftItem({ id: this.tempGiftItemData.id, agentId: this.tempGiftItemData.agentId })
    this.getGiftList()
  }

  //  Enable
  private async onHandleEnable(row: any) {
    this.tempGiftItemData = Object.assign({}, row)
    this.tempGiftItemData.isEnabled = !this.tempGiftItemData.isEnabled
    // 設定一筆資料為disable
    await updateGiftItem({ giftList: [this.tempGiftItemData], agentId: this.listQuery.agentId })
    this.getGiftList()
  }

  // 創建一筆資料
  private createData() {
    (this.$refs['dataForm'] as Form).validate(async(valid) => {
      if (valid) {
        this.tempGiftItemDataorderId = 0
        this.tempGiftItemData.agentId = this.listQuery.agentId
        this.tempGiftItemData.orderId = this.giftList.length + 1

        console.log('createData my agentId: ' + this.tempGiftItemData.agentId)
        const respne = await addGiftItem(this.tempGiftItemData)
        if (respne.data) {
          this.tempGiftItemData.id = respne.data.id
          this.tempGiftItemData.createDatetime = respne.data.createDatetime
          this.getGiftList()
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

  // 更新排序
  private async updateSort(agentId: string, giftList: IGiftItem[]) {
    await updateGiftItem({ agentId, giftList })
  }

  // 更新一筆資料
  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async(valid) => {
      if (valid) {
        const { data } = await updateGiftItem({ giftList: [this.tempGiftItemData], agentId: this.listQuery.agentId })
        this.getGiftList()
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

<style lang="scss" scoped>
.filter-container {
  display: flex;
  justify-content: space-between
}

 .el-table .warning-row {
    background: oldlace;
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
