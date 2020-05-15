<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-if="isSuperRoles"
        v-model="listQuery.agentID"
        placeholder="AgentID"
        class="filter-item"
        @change="getGiftList"
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
      />
      <el-input
        v-model="listQuery.gameID"
        placeholder="StreamerID"
        style="width: 200px"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.giftID"
        clearable
        placeholder="GiftName"
        style="width: 200px"
        class="filter-item"
      >
        <el-option
          v-for="item in giftList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-input
        v-model="listQuery.giftCount"
        placeholder="GiftCount"
        style="width: 200px"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.date"
        class="timeText"
        type="daterange"
        range-separator="～"
        start-placeholder="START TIME"
        end-placeholder="END TIME"
        :default-time="['00:00:00', '23:59:59']"
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
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Gift Name"
        width="150"
        align="center"
        prop="giftID"
        :formatter="formatGiftIdToName"
      />
      <el-table-column
        label="Count"
        width="150"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.giftCount }}
        </template>
      </el-table-column>
      <el-table-column
        label="Member ID"
        width="auto"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.memberID }}
        </template>
      </el-table-column>
      <el-table-column
        label="Streamer ID"
        width="auto"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.gameID }}
        </template>
      </el-table-column>
      <el-table-column
        label="Total Bet"
        align="center"
        width="auto"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.totalBet }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Win Type"
        align="center"
        width="auto"
      >
        <template slot-scope="scope">
          <el-tag
            :type="tagType(scope.row.winType, scope.row.debug)"
          >
            {{ scope.row.winType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Play Date Time"
        class-name="status-col"
        width="auto"
      >
        <template slot-scope="scope">
          {{ dateFromat(scope.row.playDateTime) }}
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
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Form, Notification } from 'element-ui'
import { cloneDeep } from 'lodash'
import { getAgentList } from '@/api/admin'
import { getGiftRecord, getGiftItemList } from '@/api/giftItem'
import { IGiftRecord, IGiftItem } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import { UserModule } from '@/store/modules/user'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : 'China', US : 'USA' }
const calendarTypeKeyValue = calendarTypeOptions.reduce(
  (acc: { [key: string]: string }, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  },
  {}
) as { [key: string]: string }

@Component({
  name: 'GiftRecordTable',
  components: {
    Pagination
  },
  filters: {
    typeFilter: (type: string) => {
      return calendarTypeKeyValue[type]
    }
  }
})
export default class extends Vue {
  [x: string]: any
  private tableKey = 0
  private list: IGiftRecord[] = []
  private giftList: IGiftItem[] = []
  private isSuperRoles: boolean = false

  private total = 0
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    agentID: '',
    memberID: undefined,
    date: [],
    giftID: '',
    giftCount: '',
    gameID: undefined,
    sort: '+id'
  }
  private calendarTypeOptions = calendarTypeOptions
  private agentIDs : Array<{ value: string; label: string }> = [];

  created() {
    this.getAgentList()
    // 判斷是否super帳號
    this.isSuperRoles = UserModule.roles.includes('5478c9d5-1078-4607-9624-4a6dbcae92e7')
    if (!this.isSuperRoles) {
      this.listQuery.agentID = UserModule.name
      this.getGiftList()
    }
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

  // 取得禮物列表
  private async getGiftList() {
    this.giftList = []
    // 第一格空
    if (this.listQuery.agentID) {
      const { data } = await getGiftItemList({
        page: 1,
        limit: 20,
        agentId: this.listQuery.agentID
      })
      // 開始塞項目到 giftList
      data.giftItems.forEach((element: IGiftItem) => {
        this.giftList.push(element)
      })
    }
  }

  // GiftId 轉 GiftName 用來做顯示
  private formatGiftIdToName(row:any, column:any, cellValue:any) {
    let gift = this.giftList.find((item : IGiftItem) => {
      return item.id.toString() === cellValue
    })

    if (gift) {
      return gift.name
    }

    return 'not find type'
  }

  private async getList() {
    this.listLoading = true
    let query :any = {}
    let agent = ''
    Object.assign(query, this.listQuery)

    query.memberID = (this.listQuery.memberID ? `${this.listQuery.memberID}@${this.listQuery.agentID}` : this.listQuery.memberID)
    query.gameID = (this.listQuery.gameID ? `${this.listQuery.gameID}@${this.listQuery.agentID}` : this.listQuery.gameID)

    console.log('query= ', query)

    try {
      const { data } = await getGiftRecord(query)
      this.list = data.items
      this.total = data.total

      for (let i = 0; i < this.list.length; i++) {
        let gameInfoObject = JSON.parse(this.list[i].gameInfo)
        this.list[i] = Object.assign(this.list[i], gameInfoObject)
      }

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
    console.log('handleFilter agentID: ', this.listQuery.agentID)
    if (this.listQuery.agentID === '') {
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
  private resetTempArticleData() {
  }
  private sortByID(order: string) {
    if (order === 'ascending') {
      this.listQuery.sort = '+id'
    } else {
      this.listQuery.sort = '-id'
    }
    this.handleFilter()
  }
  private dateFromat(time: any) {
    var date = new Date(time)
    return date.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
  }
  private tagType(winType: any, debug: any) {
    const tag = 'success'
    if (debug === true) {
      return 'danger'
    }
    switch (winType) {
      case 'NormalGame':
        return 'success'

      case 'FreeGame':
        return 'warning'
    }
  }
}
</script>
