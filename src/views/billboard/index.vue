<template>
  <div
    id="bulletin-borad"
    class="app-container"
  >
    <!-- 搜尋條件區域 -->
    <div class="filter-container">
      <!-- 代理 -->
      <el-select
        v-if="listQuery.messageType !== 'system'"
        v-model="listQuery.agent"
        v-permission="['5478c9d5-1078-4607-9624-4a6dbcae92e7']"
        :placeholder="$t('table.agentList')"
        style="width: 120px"
        class="filter-item"
      >
        <el-option
          v-for="item in agentList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <!-- 公告種類 -->
      <el-select
        v-model="listQuery.messageType"
        :placeholder="$t('table.messageType')"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option
          v-for="item in messageType"
          :key="item"
          :label="$t(`table.${item}`)"
          :value="item"
        />
      </el-select>

      <!-- 搜索 -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <!-- 添加跑馬燈 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button>
      <!-- 刷新 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-refresh-right"
        @click="handleRefresh"
      >
        {{ $t("table.refresh") }}
      </el-button>
    </div>

    <!-- 跑馬燈表單區域 -->
    <el-table
      :data="billboardList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- 跑馬燈編號 -->
      <el-table-column
        :label="$t('table.billboardID')"
        prop="id"
        align="center"
        width="280"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <!-- 跑馬燈種類 -->
      <el-table-column
        :label="$t('table.messageType')"
        width="120px"
        align="center"
      >
        <template slot-scope="{row}">
          <span class="link-type">{{ row.title }}</span>
          <el-tag>{{ row.messageType }}</el-tag>
        </template>
      </el-table-column>

      <!-- 跑馬燈訊息 -->
      <el-table-column
        :label="$t('table.message')"
        min-width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <span v-html="scope.row.message" />
        </template>
      </el-table-column>

      <!-- 跑馬燈撥放時間 -->
      <el-table-column
        :label="$t('table.activationTime')"
        min-width="200px"
        max-width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <span>開始撥放時間: </span>
          <span>{{ scope.row.startTime || "none" }}</span>
          <br>
          <span>結束播放時間: </span>
          <span>{{ scope.row.dueTime || "none" }}</span>
        </template>
      </el-table-column>

      <!-- 跑馬燈狀態 -->
      <el-table-column
        :label="$t('table.status')"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="{row}">
          <!-- 編輯跑馬燈 -->
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(row)"
          >
            {{ $t("table.edit") }}
          </el-button>
          <!-- 刪除跑馬燈 -->
          <el-button
            v-if="row.status !== 'deleted'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row.ID, 'deleted')"
          >
            {{ $t("table.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 頁面控制 -->
    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> -->

    <!-- 添加公告 dialog -->
    <el-dialog
      :title="formTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="billboardForm"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <!-- 代理 -->
        <el-form-item
          v-show="
            dialogStatus === 'create' && billboardForm.messageType !== 'system'
          "
          v-permission="['5478c9d5-1078-4607-9624-4a6dbcae92e7']"
          :label="$t('table.agent')"
          prop="agentID"
        >
          <el-select
            v-model="billboardForm.agentID"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in agentList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!-- 跑馬燈種類 -->
        <el-form-item
          v-if="dialogStatus === 'create'"
          :label="$t('table.messageType')"
          prop="messageType"
        >
          <el-select
            ref="listQuery.messageType"
            v-model="billboardForm.messageType"
            class="filter-item"
            :placeholder="$t('table.messageType')"
            prop="messageType"
          >
            <el-option
              v-for="item in messageType"
              :key="item"
              :label="$t(`table.${item}`)"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!-- 跑馬燈開始時間 -->
        <el-form-item
          :label="$t('datePicker.startDate')"
          prop="timestamp"
        >
          <el-date-picker
            v-model="billboardForm.activationTime.startTime"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <!-- 跑馬燈結束時間 -->
        <el-form-item
          :label="$t('datePicker.dueDate')"
          prop="timestamp"
        >
          <el-date-picker
            v-model="billboardForm.activationTime.dueTime"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <!-- 跑馬燈訊息 -->
        <el-form-item
          :label="$t('table.message')"
          prop="message"
        >
          <div style="max-width: 300px;">
            <!-- TODO: 使用原生tinymce -->
            <tinymce
              v-model="billboardForm.message"
              :height="200"
              :width="400"
              :toolbar="['forecolor bold']"
              :menubar="[]"
            />
          </div>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <!-- 取消按鈕 -->
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <!-- 確定按鈕 -->
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  addBillboard,
  removeBillboard,
  queryBillboard,
  editBillboard
} from '@/api/billboard'
import { getAgentList } from '@/api/admin'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep, pickBy, identity } from 'lodash'
import {
  getArticles,
  getPageviews,
  createArticle,
  updateArticle,
  getArticle,
  defaultArticleData
} from '@/api/articles'
import { IArticleData, IBillboardInfo } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import Tinymce from '@/components/Tinymce/index.vue'
import { regexpToFunction } from 'path-to-regexp'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'ComplexTable',
  components: {
    Pagination,
    DateRangePicker,
    Tinymce
  }
})
export default class extends Vue {
  private listQuery = {
    page: 1,
    limit: 20,
    importance: undefined,
    title: undefined,
    type: undefined,
    sort: '+id',
    filter: {
      startDate: undefined,
      dueDate: undefined
    },
    agent: UserModule.name === 'super' ? 'mabu777' : UserModule.name,
    messageType: ''
  };
  private defaultBillboardForm: {
    ID: string;
    agentID: string;
    messageType: string;
    activationTime: { startTime: any; dueTime: any };
    message: string;
  } = {
    ID: '',
    agentID: '' || this.listQuery.agent,
    messageType: '',
    activationTime: {
      startTime: null,
      dueTime: null
    },
    message: ''
  };
  private billboardForm = this.defaultBillboardForm;
  private messageType = ['operation', 'agent'];
  private queryBillboardCondition = {
    agentID: '',
    messageType: '',
    status: ''
  };
  private agentList: Array<string> = [];
  private dialogFormVisible = false;
  private dialogStatus = '';
  private textMap = {
    update: 'Edit',
    create: 'Create'
  };

  private rules = {
    messageType: [
      { required: true, message: 'messageType is required', trigger: 'blur' }
    ],
    agentID: [
      { required: true, message: 'agentID is required', trigger: 'blur' }
    ],
    message: [
      { required: true, message: 'message is required', trigger: 'blur' }
    ]
  };
  private billboardList: Array<IBillboardInfo> = [];
  private formTitle = '';

  created() {
    this.getList(this.listQuery.agent)
    this.getAgentList()
    if (UserModule.name === 'super') {
      this.messageType.push('system')
    }
  }

  // 取得跑馬燈的清單
  private async getList(agentID: string, messageType?: string) {
    if (messageType === 'system') agentID = 'global'
    let billboards = await queryBillboard({ agentID, messageType })
    this.billboardList = billboards.map(billboard => {
      if (billboard.startTime) {
        billboard.startTime = new Date(billboard.startTime)
      }
      if (billboard.dueTime) billboard.dueTime = new Date(billboard.dueTime)
      billboard.message = this.compilationCocosRichTextToHTML(
        billboard.message
      )
      return billboard
    })
  }

  // 取得代理清單 super應該要得到全部不管有沒有關閉的代理清單
  // TODO: data loading
  private async getAgentList() {
    const { data } = await getAgentList()
    let agentList = data.map(
      (agent: { account: string; isEnabled: boolean; prefix: string }) => {
        return agent.account
      }
    )
    this.agentList = agentList
  }

  // 重整功能
  private handleRefresh() {
    // this.listQuery.messageType = ''
    this.getList(this.listQuery.agent, this.listQuery.messageType)
    this.$notify({
      title: '成功',
      message: '更新跑馬燈列表成功',
      type: 'success',
      duration: 2000
    })
  }

  // 添加功能
  private handleCreate() {
    this.dialogStatus = 'create'
    this.formTitle = '添加跑馬燈'
    this.dialogFormVisible = true
    this.billboardForm = this.defaultBillboardForm
  }

  private handleEdit(row: any) {
    this.billboardForm = {
      ID: row.ID,
      agentID: '',
      messageType: '',
      message: row.message,
      activationTime: {
        startTime: row.startTime,
        dueTime: row.dueTime
      }
    }
    this.dialogStatus = 'edit'
    this.formTitle = '修改跑馬燈'
    this.dialogFormVisible = true
  }

  // 搜尋公告功能
  private handleFilter() {
    this.getList(this.listQuery.agent, this.listQuery.messageType)
    this.$notify({
      title: '成功',
      message: '搜索跑馬燈列表成功',
      type: 'success',
      duration: 2000
    })
  }

  private async handleModifyStatus(row: any, status: string) {
    switch (status) {
      case 'deleted':
        await removeBillboard({ ID: row })
        await this.getList(this.listQuery.agent, this.listQuery.messageType)
        this.$notify({
          title: '成功',
          message: '刪除成功',
          type: 'success',
          duration: 2000
        })
        break
    }
  }

  // 創建跑馬燈資料至伺服器端
  private createData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const billboard = this.billboardForm
        billboard.message = this.compilationHTMLToCocosRichText(
          billboard.message
        )
        if (billboard.messageType === 'system') delete billboard.agentID
        await addBillboard(billboard)
        this.dialogFormVisible = false
        await this.getList(this.listQuery.agent, this.listQuery.messageType)
        this.$notify({
          title: '成功',
          message: '創建成功',
          type: 'success',
          duration: 2000
        })
        this.billboardForm = this.defaultBillboardForm
      }
    })
  }

  // 編輯跑馬燈資訊
  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      const newActivationTime: any = pickBy(
        {
          startTime: this.billboardForm.activationTime.startTime,
          dueTime: this.billboardForm.activationTime.dueTime
        },
        identity
      )
      let editedData: any = {
        ID: this.billboardForm.ID,
        newMessage: this.compilationHTMLToCocosRichText(
          this.billboardForm.message
        ),
        newActivationTime: newActivationTime
      }

      editedData = pickBy(editedData, identity)

      await editBillboard(editedData)
      this.dialogFormVisible = false
      await this.getList(this.listQuery.agent, this.listQuery.messageType)

      this.billboardForm = this.defaultBillboardForm

      this.$notify({
        title: '成功',
        message: '更新成功',
        type: 'success',
        duration: 2000
      })
    })
  }

  // TODO: 找時間重構
  // HTML to cocos richText 編譯
  private compilationHTMLToCocosRichText(message: string): string {
    let replaceHTML = message.replace(/<\/?p>/g, '')
    replaceHTML = replaceHTML.replace(/<strong>/g, '<b>')
    replaceHTML = replaceHTML.replace(/<\/strong>/g, '</b>')
    replaceHTML = replaceHTML.replace(/span style="/g, '')
    replaceHTML = replaceHTML.replace(/;"/g, '')
    replaceHTML = replaceHTML.replace(/<color:/g, '<color=')
    replaceHTML = replaceHTML.replace(/<\/span>/g, '</color>')
    console.log('HTML to cocos rich text =======>', replaceHTML)
    return replaceHTML
  }

  // TODO: 找時間重構
  // cocos richText to HTML 編譯
  private compilationCocosRichTextToHTML(message: string): string {
    let replaceRichText = message.replace(/<b>/g, '<strong>')
    replaceRichText = replaceRichText.replace(/<\/b>/g, '</strong>')
    replaceRichText = replaceRichText.replace(
      /<color=/g,
      '<span style=" color:'
    )
    replaceRichText = replaceRichText.replace(/<\/color>/g, '</span>')
    replaceRichText = replaceRichText.replace(
      /<span style=" color: #[A-Za-z0-9]*/g,
      '$&;"'
    )
    replaceRichText = `<p>${replaceRichText}</p>`
    console.log('cocos rich text to HTML =======>', replaceRichText)
    return replaceRichText
  }
}
</script>

<style lang="scss">
#bulletin-borad {
  .el-dialog__wrapper {
    .el-dialog {
      min-width: 600px;
    }
  }
}
</style>

<style lang="scss" scope>
.editor-custom-btn-container {
  display: none;
}
.tox {
  z-index: 3000 !important;
}
</style>
