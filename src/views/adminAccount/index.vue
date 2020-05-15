<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.filter.account"
        :placeholder="$t('table.account')"
        class="filter-item input"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="listQuery.filter.isEnabled"
        class="filter-item input"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <date-range-picker
        class="filter-item"
        :start-date.sync="listQuery.filter.startDate"
        :due-date.sync="listQuery.filter.dueDate"
        @checkbox-changed="checkboxChanged"
      />

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
      @sort-change="sortChange"
    >
      <!-- <el-table-column
        :label="$t('table.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>-->

      <el-table-column
        :label="$t('table.account')"
        width="120px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.name')"
        width="120px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.prefix')"
        width="60px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.prefix }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="isMabuPlatform()"
        :label="$t('table.isMaintained')"
        width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag
            :type="row.isMaintained? 'danger' : 'success' "
            size="medium"
            class="tag"
          >
            {{ row.isMaintained? $t('table.isMaintaining') : $t('table.running') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.roles')"
        align="center"
        min-width="100px"
        class-name="fixed-width"
      >
        <template slot-scope="{row}">
          <el-tag
            v-for="role in row.roles"
            :key="role.key"
            style="margin:0 5px"
            type="info"
            size="medium"
            class="tag"
          >
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.website')"
        min-width="100px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.website }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.hashKey')"
        width="140px"
        align="center"
      >
        <template
          slot-scope="scope"
        >
          <span v-if="scope.row.hashKey">
            **********
          </span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.APIDomain')"
        width="140px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.APIDomain }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.whiteIPList')"
        width="140px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.whiteIPList }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="isOsportPlatform()"
        :label="$t('table.lastLoginIP')"
        width="140px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginIP }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.createDatetime')"
        width="180px"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.createDatetime | parseTime('{y}/{m}/{d} {h}:{i}:{s}') }}
          <!-- <span>{{ scope.row.createDatetime ? new Date(scope.row.createDatetime).toLocaleString("zh-TW") : '' }}</span> -->
        </template>
      </el-table-column>

      <el-table-column
        v-if="isOsportPlatform()"
        :label="$t('table.lastLoginDatetime')"
        width="165px"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.lastLoginDatetime">{{ scope.row.lastLoginDatetime | parseTime('{y}/{m}/{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.status')"
        width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag
            :type="row.isEnabled? 'success' : 'danger' "
            size="medium"
            class="tag"
          >
            {{ row.isEnabled? $t('table.enable') : $t('table.disable') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="350"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="medium"
            @click="onEditAdminAccount(row)"
          >
            {{ $t('table.edit') }}
          </el-button>

          <el-button
            type="warning"
            size="medium"
            @click="onChangePassword(row)"
          >
            {{ $t('table.changePassword') }}
          </el-button>

          <el-button
            :type="row.isEnabled? 'danger' : 'success' "
            size="medium"
            @click="onSwitchEnableStatus(row)"
          >
            {{ row.isEnabled? $t('table.disableAccount') : $t('table.enableAccount') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempAdminAccountData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          :label="$t('table.account')"
          prop="account"
        >
          <el-input
            v-model="tempAdminAccountData.account"
            :readonly="dialogStatus!==DIALOG_STATUS_CREATE"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus===DIALOG_STATUS_CHANGE_PASSWORD"
          :label="$t('login.password')"
          prop="password"
        >
          <el-input
            v-model="tempAdminAccountData.password"
            type="password"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus!==DIALOG_STATUS_CHANGE_PASSWORD"
          :label="$t('table.name')"
          prop="name"
        >
          <el-input v-model="tempAdminAccountData.name" />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus!==DIALOG_STATUS_CHANGE_PASSWORD"
          :label="$t('table.prefix')"
          prop="prefix"
        >
          <el-input v-model="tempAdminAccountData.prefix" />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus!==DIALOG_STATUS_CHANGE_PASSWORD"
          :label="$t('table.website')"
        >
          <el-input v-model="tempAdminAccountData.website" />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus!==DIALOG_STATUS_CHANGE_PASSWORD"
          :label="$t('table.hashKey')"
        >
          <el-input
            v-model="tempAdminAccountData.hashKey"
            :type="tempAdminAccountPwdType"
          />
          <el-button
            type="primary"
            @click="onPasswordGen()"
          >
            {{ $t('table.generate') }}
          </el-button>
        </el-form-item>

        <el-form-item
          v-if="dialogStatus!==DIALOG_STATUS_CHANGE_PASSWORD"
          :label="$t('table.APIDomain')"
        >
          <el-input v-model="tempAdminAccountData.APIDomain" />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus!==DIALOG_STATUS_CHANGE_PASSWORD"
          :label="$t('table.whiteIPList')"
        >
          <el-input v-model="tempAdminAccountData.whiteIPList" />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus!==DIALOG_STATUS_CHANGE_PASSWORD"
          :label="$t('table.isEnabled')"
        >
          <el-checkbox v-model="tempAdminAccountData.isEnabled" />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus!==DIALOG_STATUS_CHANGE_PASSWORD"
          :label="$t('table.roles')"
          prop="roles"
        >
          <draggable-select
            v-model="selectedRoles"
            style="width:500px;"
            multiple
            placeholder="Please select roles"
            @change="convertSelectedRolesToTempAdminAccountData"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </draggable-select>
        </el-form-item>

        <el-form-item
          v-if="dialogStatus===DIALOG_STATUS_UPDATE"
          :label="$t('table.isMaintained')"
        >
          <el-checkbox v-model="tempAdminAccountData.isMaintained" />
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
import {
  getAdminAccount,
  createAdminAccount,
  updateAdminAccount,
  updateAdminAccountPassword
} from '@/api/admin'
import { getlocalRoles } from '@/api/roles'
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { IAdminAccount, IRoles } from '@/api/types'
import { formatJson } from '@/utils'
import { isValidAccount } from '@/utils/validate'
import Pagination from '@/components/Pagination/index.vue'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import DraggableSelect from '@/components/DraggableSelect/index.vue'
import { isOsportPlatform, isMabuPlatform } from '@/utils/platform'
import { generate } from 'generate-password'

@Component({
  // name: 'ComplexTable',
  components: {
    Pagination,
    DateRangePicker,
    DraggableSelect
  }
})
export default class extends Vue {
  private DIALOG_STATUS_UPDATE = 'UPDATE';
  private DIALOG_STATUS_CREATE = 'CREATE';
  private DIALOG_STATUS_CHANGE_PASSWORD = 'CHANGE_PASSWORD';

  private isOsportPlatform = isOsportPlatform
  private isMabuPlatform = isMabuPlatform
  private tempAdminAccountData: IAdminAccount = this.defaultTempAdminAccountData();
  private tempAdminAccountPwdType = 'password';
  private rolesList: IRoles[] = [];
  private selectedRoles: string[] = [];

  private tableKey = 0;
  private list: IAdminAccount[] = [];
  private total = 0;
  private listLoading = true;
  private listQuery = {
    page: 1,
    limit: 20,
    filter: {
      account: '',
      isEnabled: undefined,
      startDate: undefined,
      dueDate: undefined
    },
    sort: '+id'
  };
  private sortOptions = [
    { label: 'ID Ascending', key: '+id' },
    { label: 'ID Descending', key: '-id' }
  ];
  private statusOptions = [
    { label: '全部', value: undefined },
    { label: '启用', value: true },
    { label: '禁用', value: false }
  ];
  private dialogFormVisible = false;
  private dialogStatus = '';
  private textMap = this.getDialogTextMap();
  private rules = this.getRules();

  private testChecked = true;

  created() {
    this.getList()
    this.getRoles()
  }

  private getRules() {
    return {
      roles: [
        {
          required: true,
          message: this.$t('rules.roles').toString(),
          trigger: 'blur'
        }
      ],
      name: [
        {
          required: true,
          message: this.$t('rules.name').toString(),
          trigger: 'blur'
        }
      ],
      prefix: [
        {
          required: true,
          message: this.$t('rules.prefix').toString(),
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          validator: this.checkPassword,
          message: this.$t('rules.password').toString(),
          trigger: 'blur'
        }
      ],
      account: [
        { required: true, validator: this.validateAccount, trigger: 'blur' }
      ]
    }
  }

  private validateAccount(rule: any, value: string, callback: Function) {
    if (!isValidAccount(value)) {
      callback(new Error(this.$t('rules.account').toString()))
    } else {
      callback()
    }
  }

  private getDialogTextMap() {
    return {
      UPDATE: this.$t('dialog.editAdminAccount').toString(),
      CREATE: this.$t('dialog.createAdminAccount').toString(),
      CHANGE_PASSWORD: this.$t('dialog.changeAdminAccountPassword').toString()
    }
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getAdminAccount({
      page: this.listQuery.page,
      limit: this.listQuery.limit,
      filter: this.listQuery.filter
    })

    this.list = data.rows
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private async getRoles() {
    const { data } = await getlocalRoles({})
    this.rolesList = data.roles
  }

  private handleFilter() {
    this.listQuery.page = 1
    this.getList()
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

  private sortChange(data: any) {
    const { prop, order } = data
    if (prop === 'id') {
      this.sortByID(order)
    }
  }

  private sortByID(order: string) {
    if (order === 'ascending') {
      this.listQuery.sort = '+id'
    } else {
      this.listQuery.sort = '-id'
    }
    this.handleFilter()
  }

  private getSortClass(key: string) {
    const sort = this.listQuery.sort
    return sort === `+${key}`
      ? 'ascending'
      : sort === `-${key}`
        ? 'descending'
        : ''
  }

  private defaultTempAdminAccountData(): IAdminAccount {
    return {
      id: -1,
      account: '',
      name: '',
      prefix: '',
      password: '123456',
      hierarchyLevel: -1,
      parentId: -1,
      isEnabled: true,
      isMaintained: false,
      lastLoginIP: '',
      lastLoginDatetime: new Date(),
      roles: [],
      website: '',
      hashKey: '',
      APIDomain: '',
      whiteIPList: ''
    }
  }

  private onCreate() {
    this.dialogStatus = this.DIALOG_STATUS_CREATE
    this.tempAdminAccountData = this.defaultTempAdminAccountData()
    this.selectedRoles = []
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  private onDialogConfirm(status: string) {
    this.tempAdminAccountPwdType = 'password'
    switch (status) {
      case this.DIALOG_STATUS_CREATE:
        this.createAdminAccount()
        break
      case this.DIALOG_STATUS_UPDATE:
        this.updateAdminAccount()
        break
      case this.DIALOG_STATUS_CHANGE_PASSWORD:
        this.changeAdminAccountPassword()
        break
    }
  }

  private convertSelectedRolesToTempAdminAccountData() {
    this.tempAdminAccountData.roles = []

    // 取得有選的 role 資料
    this.selectedRoles.forEach(id => {
      const roles = this.rolesList.filter(role => {
        return role.id.toString() === id.toString()
      })

      if (roles.length === 1) {
        this.tempAdminAccountData.roles.push(roles[0])
      }
    })
  }

  private createAdminAccount() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const result = await createAdminAccount(this.tempAdminAccountData)

        if (result.code === 20000) {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: this.$t('notify.success').toString(),
            message: this.$t('notify.createAdminAccountSuccess', [
              this.tempAdminAccountData.account
            ]).toString(),
            type: 'success',
            duration: 2000
          })
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

  private onChangePassword(row: IAdminAccount) {
    const rowData: IAdminAccount = Object.assign({}, row)
    const {
      id,
      account,
      parentId,
      hierarchyLevel,
      name,
      prefix,
      isMaintained,
      isEnabled,
      lastLoginIP,
      lastLoginDatetime,
      roles,
      website,
      hashKey,
      APIDomain,
      whiteIPList
    } = rowData

    this.tempAdminAccountData = {
      id,
      account,
      parentId,
      hierarchyLevel,
      name,
      prefix,
      isMaintained,
      password: '',
      isEnabled,
      lastLoginIP,
      lastLoginDatetime,
      roles,
      website,
      hashKey,
      APIDomain,
      whiteIPList
    }

    this.dialogStatus = this.DIALOG_STATUS_CHANGE_PASSWORD
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  private async onSwitchEnableStatus(row: IAdminAccount) {
    const tempData = Object.assign(row)
    tempData.isEnabled = !tempData.isEnabled
    const { code, message } = await updateAdminAccount(tempData)

    if (code === 20000) {
      this.getList()
      const status = tempData.isEnabled
        ? this.$t('table.enable')
        : this.$t('table.disable')
      this.$notify({
        title: this.$t('notify.success').toString(),
        message: this.$t('notify.updateEnabledStatusSuccess', [
          tempData.account,
          status
        ]).toString(),
        type: 'success'
      })
    } else {
      this.$notify({
        title: this.$t('notify.fail').toString(),
        message,
        type: 'error',
        duration: 2000
      })
    }
  }

  private onEditAdminAccount(row: IAdminAccount) {
    const rowData: IAdminAccount = Object.assign({}, row)
    const {
      id,
      account,
      parentId,
      hierarchyLevel,
      name,
      prefix,
      isMaintained,
      isEnabled,
      lastLoginIP,
      lastLoginDatetime,
      roles,
      website,
      hashKey,
      APIDomain,
      whiteIPList
    } = rowData

    this.tempAdminAccountData = {
      id,
      account,
      parentId,
      hierarchyLevel,
      name,
      prefix,
      isMaintained,
      password: '',
      isEnabled,
      lastLoginIP,
      lastLoginDatetime,
      roles,
      website,
      hashKey,
      APIDomain,
      whiteIPList
    }

    this.selectedRoles = this.tempAdminAccountData.roles.map(role => role.name)
    this.dialogStatus = this.DIALOG_STATUS_UPDATE
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  // 產生亂數密碼
  private onPasswordGen() {
    // update tempAdminAccountData.hashKey
    const hasKey = generate({
      length: 15,
      numbers: false,
      symbols: false,
      lowercase: true,
      uppercase: true,
      excludeSimilarCharacters: true
    })
    this.tempAdminAccountData.hashKey = hasKey
    this.tempAdminAccountPwdType = 'text'
  }

  private updateAdminAccount() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign(this.tempAdminAccountData)
        const { code, message } = await updateAdminAccount(tempData)
        this.dialogFormVisible = false

        if (code === 20000) {
          this.getList()
          this.$notify({
            title: this.$t('notify.success').toString(),
            message: this.$t('notify.updateAdminAccountSuccess', [
              tempData.account
            ]).toString(),
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
    })
  }

  private checkboxChanged(value: boolean) {
    this.$notify({
      title: this.$t('notify.success').toString(),
      message: value.toString(),
      type: 'success'
    })
  }

  private changeAdminAccountPassword() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign(this.tempAdminAccountData)
        const { code, message } = await updateAdminAccountPassword(tempData)
        this.dialogFormVisible = false

        if (code === 20000) {
          this.getList()
          this.$notify({
            title: this.$t('notify.success').toString(),
            message: this.$t('notify.updateAdminAccountPasswordSuccess', [
              tempData.account
            ]).toString(),
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
    })
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
