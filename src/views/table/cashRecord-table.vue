<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.agentID"
        placeholder="AgentID"
        class="filter-item"
      >
        <el-option
          v-for="item in agentIDs"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="listQuery.memberID"
        placeholder="MemberID"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.type"
        placeholder="Type"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.note"
        placeholder="Note"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.date"
        class="timeText"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="～"
        start-placeholder="START TIME"
        end-placeholder="END TIME"
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
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="NO."
        prop="id"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Transaction Time"
        class-name="status-col"
        width="auto"
      >
        <template slot-scope="scope">
          {{ dateFromat(scope.row.transactionTime) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label='MemberID' width='180px' align='center'>
        <template slot-scope='{row}'>
          <span>{{ row.memberID }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="Deposit"
        width="100%"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag>{{ row.deposit }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Withdrawal"
        width="100%"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="danger">
            {{ scope.row.withdrawal }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Type"
        width="auto"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="'系統給點' === scope.row.type"
            type="warning"
          >
            {{ scope.row.type }}
          </el-tag>
          <el-tag
            v-else
            type="success"
          >
            {{ scope.row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Note"
        align="center"
        width="auto"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Before Balance"
        class-name="status-col"
        width="auto"
      >
        <template
          slot-scope="{row}"
          style="color:#ffa500"
        >
          {{ row.beforeBalance }}
        </template>
      </el-table-column>
      <el-table-column
        label="After Balance"
        align="center"
        width="auto"
      >
        <template slot-scope="scope">
          <span style="color:#ffd700">{{ scope.row.afterBalance }}</span>
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
      :visible.sync="dialogPageviewsVisible"
      title="Reading statistics"
    >
      <el-table
        :data="pageviewsData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="Channel"
        />
        <el-table-column
          prop="pageviews"
          label="Pageviews"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogPageviewsVisible = false"
        >{{
          $t('table.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Form, Notification } from 'element-ui'
import { cloneDeep } from 'lodash'
import {
  getCashRecord
} from '@/api/cashRecordServer'
import { getAgentList } from '@/api/admin'
import { IArticleData } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'CashRecordTable',
  components: {
    Pagination
  }
})
export default class extends Vue {
  [x: string]: any
  private tableKey = 0
  private list: IArticleData[] = []
  private total = 0
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    note: '',
    agentID: '',
    memberID: '',
    date: undefined,
    startDateTime: undefined,
    endDateTime: undefined,
    type: undefined,
    sort: '+id'
  }
  private showReviewer = false
  private dialogFormVisible = false
  private dialogStatus = ''
  private dialogPageviewsVisible = false
  private pageviewsData = []
  private agentIDs : Array<{ value: string; label: string }> = [];

  created() {
    this.getAgentList()
    this.listLoading = false
  }

  private async getAgentList():Promise<void> {
    const { data } = await getAgentList()

    // 取出未被禁用的 AgentID
    data.forEach((agent: {account:string;isEnabled:boolean;prefix:string}) => {
      if (agent.isEnabled) {
        this.agentIDs.push({ value: agent.account, label: agent.account })
      }
    })
  }

  private async getList() {
    this.listLoading = true
    let query :any = {}
    let agent = ''
    Object.assign(query, this.listQuery)
    query.memberID = `${this.listQuery.memberID}@${this.listQuery.agentID}`
    if (query.date) {
      const endTime = new Date(query.date[1])
      endTime.setHours(23, 59, 59, 0)
      query.date[1] = endTime
    }
    try {
      const { data } = await getCashRecord(query)
      this.list = data.items
      this.total = data.total
      // Just to simulate the time of the request
    } catch (error) {
      await Notification.error({ title: '伺服器錯誤', message: '連線錯誤', type: 'error' })
    } finally {
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    }
  }

  private async handleFilter() {
    this.listQuery.page = 1
    if (this.listQuery.agentID === '' || this.listQuery.memberID === '') {
      await Notification.error({ title: '輸入錯誤', message: 'agentID 或 memberID 是空的', type: 'error' })
    } else {
      this.getList()
    }
  }

  private sortChange(data: any) {
    const { prop, order } = data
    if (prop === 'id') {
      this.sortByID(order)
    }
  }

  private dateFromat(time: any) {
    var date = new Date(time)
    return date.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
  }

  private sortByID(order: string) {
    if (order === 'ascending') {
      this.listQuery.sort = '+id'
    } else {
      this.listQuery.sort = '-id'
    }
    this.handleFilter()
  }
}
</script>
<style scoped>

</style>
