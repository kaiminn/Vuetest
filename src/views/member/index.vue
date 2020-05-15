<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.account"
        :placeholder="$t('table.nickName')"
        class="filter-item input"
        @keyup.enter.native="handleFilter"
      />

      <date-range-picker
        class="filter-item"
        :start-date.sync="listQuery.searchTime.startTime"
        :due-date.sync="listQuery.searchTime.dueTime"
      />

      <div
        class="filter-item"
      >
        {{ $t('table.category') }}：
        <el-select
          v-model="filterCategory"
          class="input"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="onCreate"
      >
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        :label="$t('table.account')"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.prefix }}_{{ scope.row.account }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.nickName')"
        width="120px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="isOsportPlatform()"
        :label="$t('table.category')"
        width="80px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ getCategory(scope.row.tags) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.totalConsume')"
        width="100px"
        align="center"
      >
        <template slot-scope="scope">
          NI {{ scope.row.totalConsume }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.authorizationTime')"
        align="center"
        min-width="120px"
        class-name="fixed-width"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.activationDate.startTime && scope.row.activationDate.dueTime">
            {{ scope.row.activationDate.startTime | parseTime('{y}/{m}/{d}') }} </br>
            {{ $t('table.to') }}</br>
            {{ scope.row.activationDate.dueTime | parseTime('{y}/{m}/{d}') }}
          </p>
          <p v-else-if="scope.row.startTime">
            {{ $t('table.from') }}{{ scope.row.activationDate.startTime | parseTime('{y}/{m}/{d}') }}
          </p>
          <p v-else-if="scope.row.dueTime">
            {{ $t('table.to') }} {{ scope.row.activationDate.dueTime | parseTime('{y}/{m}/{d}') }}
          </p>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.registDatetime')"
        width="140px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.registerTime | parseTime('{y}/{m}/{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.lastLoginDatetime')"
        width="175px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginTime ? new Date(scope.row.lastLoginTime).toLocaleString("zh-TW") : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.lastLoginIP')"
        width="140px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginIP }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.status')"
        width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag
            :type="row.accountStatus ===1? 'success' : 'danger' "
            size="medium"
            class="tag"
          >
            {{ row.accountStatus===1? $t('table.enable') : $t('table.disable') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        min-width="320"
        class-name="fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="danger"
            size="medium"
            @click="switchTag(row, TAGS.BLACK_LIST)"
          >
            {{ (row.tags && row.tags.indexOf(TAGS.BLACK_LIST) !== -1)? $t('button.cancelBlackList') : $t('button.blackList') }}
          </el-button>

          <el-button
            v-if="isOsportPlatform()"
            type="success"
            size="medium"
            @click="switchTag(row, TAGS.POPULAR)"
          >
            {{ (row.tags && row.tags.indexOf(TAGS.POPULAR) !== -1)? $t('button.cancelPopular') : $t('button.popular') }}
          </el-button>

          <el-button
            type="primary"
            size="medium"
            @click="onEditAccount(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getAccountList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempDialogData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          prop="account"
          :label="$t('table.account')"
        >
          <el-input
            v-model="tempDialogData.account"
            :readonly="dialogStatus!==DIALOG_STATUS_CREATE"
          />
        </el-form-item>

        <el-form-item
          prop="nickName"
          :label="$t('table.nickName')"
        >
          <el-input v-model="tempDialogData.nickName" />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus===DIALOG_STATUS_CREATE"
          :label="$t('login.password')"
          prop="password"
        >
          <el-input
            v-model="tempDialogData.password"
            type="password"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus===DIALOG_STATUS_CREATE && isOsportPlatform()"
          :label="$t('table.category')"
        >
          <el-select
            v-model="createdMemberCategory"
            class="input"
          >
            <el-option
              v-for="item in createMemberCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="dialogStatus===DIALOG_STATUS_UPDATE || isOsportPlatform()"
          :label="$t('datePicker.startDate')"
        >
          <el-date-picker
            v-model="tempDialogData.activationDate.startTime"
            type="date"
            :placeholder="$t('datePicker.startDate')"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus===DIALOG_STATUS_UPDATE || isOsportPlatform()"
          :label="$t('datePicker.dueDate')"
        >
          <el-date-picker
            v-model="tempDialogData.activationDate.dueTime"
            type="date"
            :placeholder="$t('datePicker.dueDate')"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus===DIALOG_STATUS_UPDATE"
          :label="$t('table.isEnabled')"
        >
          <el-checkbox
            v-model="tempDialogData.accountStatus"
            :true-label="1"
            :false-label="0"
          />
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
          @click="onDialogConfirm(dialogStatus)"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { getMemberAccount, updateMemberAccount, createMemberAccount } from '@/api/member'
import { registLiveMaster } from '@/api/liveGameServer'
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { IAccount, IQueryAccount, IEditAccount, IAccountBase, IRegistLiveMaster, IResponse } from '@/api/types'
import { UserModule } from '@/store/modules/user'
import Pagination from '@/components/Pagination/index.vue'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { isValidAccount } from '@/utils/validate'
import { isOsportPlatform, isMabuPlatform } from '@/utils/platform'

@Component({
  name: 'MemberAccount',
  components: {
    Pagination,
    DateRangePicker
  }
})
export default class extends Vue {
  private TAGS = {
    LIVE_MASTER: 'LiveMaster', // 直播主
    BOT: 'BOT', // BOT則代表此帳號僅可用於啟用Bot功能
    MEMBER: 'Member', // 一般會員帳號
    // ENABLED_BOT: 'EnabledBOT', // 是否啟用 Bot
    // BOT_FOLLOW: 'BotFollow',
    BLACK_LIST: 'BlackList', // 黑名單則代表該帳號無法使用直播功能
    POPULAR: 'Popular' // 熱門
  }
  private DIALOG_STATUS_UPDATE = 'UPDATE'
  private DIALOG_STATUS_CREATE = 'CREATE'
  // private DIALOG_STATUS_CHANGE_PASSWORD = 'CHANGE_PASSWORD'

  private isOsportPlatform = isOsportPlatform
  private tempDialogData: IAccountBase = this.defaultTempDialogData()
  private selectedRoles: string[] = []

  private tableKey = 0
  private list: IAccountBase[] = []
  private total = 0
  private listLoading = true
  private filterCategory: string = 'all'
  private createdMemberCategory: string = this.TAGS.LIVE_MASTER
  private listQuery: IQueryAccount = {
    page: 1,
    limit: 20,
    agentID: '',
    account: '',
    nickName: '',
    tags: '',
    searchTime: {
      startTime: undefined,
      dueTime: undefined
    }
  }
  private categoryOptions = [{}]
  private createMemberCategoryOptions = [{}]
  private dialogFormVisible = false
  private dialogStatus = ''
  private textMap = this.getDialogTextMap()
  private rules = this.getRules();

  created() {
    this.getAccountList()
    this.categoryOptions = this.getCategoryOptions()
    this.createMemberCategoryOptions = this.getCreateMemberCategoryOptions()
  }

  private getCategoryOptions() {
    let result = [
      { label: this.$t('tag.all').toString(), value: 'all' },
      // { label: this.$t('tag.member').toString(), value: this.TAGS.MEMBER },
      { label: this.$t('tag.blackList').toString(), value: this.TAGS.BLACK_LIST }
    ]

    if (this.isOsportPlatform()) {
      result.push(
        { label: this.$t('tag.liveMaster').toString(), value: this.TAGS.LIVE_MASTER },
        { label: this.$t('tag.BOT').toString(), value: this.TAGS.BOT },
        { label: this.$t('tag.popular').toString(), value: this.TAGS.POPULAR })
    }

    return result
  }

  private getCreateMemberCategoryOptions() {
    return [
      { label: this.$t('tag.liveMaster').toString(), value: this.TAGS.LIVE_MASTER },
      { label: this.$t('tag.BOT').toString(), value: this.TAGS.BOT }
    ]
  }

  private getRules() {
    return {
      account: [
        { required: true, message: this.$t('rules.account').toString(), trigger: 'blur' }
      ],
      password: [
        {
          required: true,
          validator: this.checkPassword,
          message: this.$t('rules.password').toString(),
          trigger: 'blur'
        }
      ],
      nickName: [
        { required: true, message: this.$t('rules.nickName').toString(), trigger: 'blur' }
      ]
    }
  }

  private checkPassword(rule: any, value: string, callback: Function) {
    if (this.dialogStatus === this.DIALOG_STATUS_UPDATE) {
      return callback()
    } else {
      if (value.length > 0) {
        callback()
      } else {
        callback(new Error(rule.message))
      }
    }
  }

  private getDialogTextMap() {
    return {
      UPDATE: this.$t('dialog.editMemberAccount').toString(),
      CREATE: this.$t('dialog.createMemberAccount').toString()
      // CHANGE_PASSWORD: this.$t('dialog.changeMemberAccountPassword').toString()
    }
  }

  private async getAccountList() {
    this.listLoading = true
    const { data, count } = await getMemberAccount({
      agentID: UserModule.name,
      page: this.listQuery.page,
      limit: this.listQuery.limit,
      account: this.listQuery.account,
      nickName: this.listQuery.nickName,
      tags: this.filterCategory === 'all' ? '' : this.filterCategory,
      searchTime: {
        startTime: this.listQuery.searchTime.startTime,
        dueTime: this.listQuery.searchTime.dueTime
      } })

    this.list = data
    this.total = count
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private handleFilter() {
    this.listQuery.page = 1
    this.getAccountList()
  }

  private getCategory(tag?: string) {
    if (tag && tag.indexOf(this.TAGS.LIVE_MASTER) !== -1) {
      return this.$t('tag.liveMaster')
    } else if (tag && tag.indexOf(this.TAGS.BOT) !== -1) {
      return this.$t('tag.BOT')
    }

    return this.$t('tag.member')
  }

  private async switchTag(row: IAccountBase, tag: string) {
    // update tags
    this.tempDialogData = Object.assign({}, row)
    this.tempDialogData.tags = row.tags
    if (this.tempDialogData.tags && this.tempDialogData.tags.length > 0) {
      let idx = this.tempDialogData.tags.indexOf(tag)
      if (idx === -1) {
        this.tempDialogData.tags = this.tempDialogData.tags.concat(`${tag};`)
      } else {
        this.tempDialogData.tags = this.tempDialogData.tags.replace(`${tag};`, '')
      }
    } else { this.tempDialogData.tags = `${tag};` }

    this.tempDialogData.agentID = row.agentID
    this.tempDialogData.account = row.account

    await this.updateAccount()
  }

  private defaultTempDialogData(): IAccountBase {
    return {
      account: '',
      agentID: '',
      prefix: '',
      nickName: '',
      password: '',
      activationDate: {
        startTime: undefined,
        dueTime: undefined
      },
      registerTime: undefined,
      lastLoginTime: undefined,
      lastLoginIP: '',
      accountStatus: 0,
      tags: ''
    }
  }

  private onCreate() {
    this.dialogStatus = this.DIALOG_STATUS_CREATE
    this.tempDialogData = this.defaultTempDialogData()
    this.selectedRoles = []
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  private onDialogConfirm(status: string) {
    switch (status) {
      case this.DIALOG_STATUS_CREATE:
        this.createAccount()
        break
      case this.DIALOG_STATUS_UPDATE:
        this.updateAccount()
        break
      // case this.DIALOG_STATUS_CHANGE_PASSWORD:
      //   // this.changeMemberAccountPassword()
      //   break
    }
  }

  private createAccount() {
    (this.$refs['dataForm'] as Form).validate(async(valid) => {
      if (valid) {
        let postData = {
          account: this.tempDialogData.account,
          nickName: this.tempDialogData.nickName,
          password: this.tempDialogData.password,
          agentID: UserModule.name,
          accountActivationDate: {},
          tags: ''
        }

        if (this.isOsportPlatform()) {
          postData.tags = `${this.createdMemberCategory};`
          postData.accountActivationDate = {
            startTime: this.tempDialogData.activationDate.startTime,
            dueTime: this.tempDialogData.activationDate.dueTime
          }
        }

        const result = await createMemberAccount(postData)

        if (result.code === 20000) {
          if (this.isOsportPlatform()) {
            // 直播主帳號需跟 GM 註冊
            if (this.createdMemberCategory.indexOf(this.TAGS.LIVE_MASTER) !== -1) {
              const registData: IRegistLiveMaster = {
                account: postData.account,
                nickName: postData.nickName,
                agentID: UserModule.name,
                isEnabled: true,
                accountActivationDate: postData.accountActivationDate,
                tags: postData.tags
              }
              let registResult: IResponse = await registLiveMaster(registData)

              if (registResult.code === 20000) {
                this.getAccountList()
                this.dialogFormVisible = false
                this.$notify({
                  title: this.$t('notify.success').toString(),
                  message: this.$t('notify.createAdminAccountSuccess', [this.tempDialogData.account]).toString(),
                  type: 'success',
                  duration: 2000
                })
              } else {
                let errorMsg = this.$t('notify.registLiveMasterFailed').toString()
                this.$notify({
                  title: this.$t('notify.fail').toString(),
                  message: errorMsg,
                  type: 'error',
                  duration: 2000
                })
              }
            }
          }
        } else {
          let errorMsg = ''
          if (result.code === 50001) {
            errorMsg = this.$t('notify.accountAlreadyExists').toString()
          } else {
            errorMsg = result.message
          }

          this.$notify({
            title: this.$t('notify.fail').toString(),
            message: errorMsg,
            type: 'error',
            duration: 2000
          })
        }
      }
    })
  }

  private onEditAccount(row: IAccountBase) {
    this.tempDialogData = Object.assign({}, row)

    this.dialogStatus = this.DIALOG_STATUS_UPDATE
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  private async updateAccount() {
    const tempData = Object.assign(this.tempDialogData)
    const { code, message } = await updateMemberAccount({
      memberID: `${tempData.account}@${tempData.agentID}`,
      newPassword: tempData.password || undefined,
      newNickname: tempData.nickName,
      newAccountStatus: tempData.accountStatus,
      newActivationDate: tempData.activationDate,
      newTags: tempData.tags
    })
    this.dialogFormVisible = false

    if (code === 20000) {
      this.getAccountList()
      this.$notify({
        title: this.$t('notify.success').toString(),
        message: this.$t('notify.updateMemberAccountSuccess', [tempData.account]).toString(),
        type: 'success'
      })
    } else {
      this.$notify({
        title: this.$t('notify.fail').toString(),
        message,
        type: 'error'
      })
    }
  }
}
</script>

<style scoped>
.tag {
  font-size: 14px;
}

.input {
  width: 200px;
  margin-right: 10px;
}

.inline {
  display: inline-block;
}
</style>
