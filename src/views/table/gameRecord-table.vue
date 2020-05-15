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
      />
      <el-input
        v-model="listQuery.gameID"
        placeholder="gameID"
        style="width: 200px"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.seatID"
        placeholder="SeatID"
        style="width: 200px"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.roundCount"
        placeholder="roundCount"
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
      />

      <!-- gameType -->
      <el-select
        v-model="listQuery.gameType"
        placeholder="gameType"
        class="filter-item"
      >
        <el-option
          v-for="item in gameTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <!-- winType -->
      <el-select
        v-model="listQuery.winType"
        placeholder="gameType"
        class="filter-item"
      >
        <el-option
          v-for="item in winTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

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
    {{ listQuery.gameType }}
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
        label="Play Date Time"
        class-name="status-col"
        width="auto"
      >
        <template slot-scope="scope">
          {{ dateFromat(scope.row.playDateTime) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label='MemberID' width='180px' align='center'>
        <template slot-scope='{row}'>
          <span>{{ row.memberID }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="GameID"
        width="100%"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.gameID }}
        </template>
      </el-table-column>
      <el-table-column
        label="SeatID"
        width="100%"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.seatID }}
        </template>
      </el-table-column>
      <el-table-column
        label="Round Count"
        width="auto"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.roundCount }}
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
        label="Total Win"
        class-name="status-col"
        width="auto"
      >
        <template slot-scope="scope">
          <span
            v-if="parseInt(scope.row.totalWin) > 0"
            style="color:#FF4949"
          >{{ scope.row.totalWin }}</span>
          <span
            v-else
          >{{ scope.row.totalWin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Win Lost"
        align="center"
        width="auto"
      >
        <template slot-scope="scope">
          <span
            v-if="parseInt(scope.row.winLost) > 0"
            style="color:#FF4949"
          >{{ scope.row.winLost }}</span>
          <span
            v-else
            style="color:#3AB982"
          >{{ scope.row.winLost }}</span>
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
import {
  getGameRecord
} from '@/api/gameRecordServer'
import { IArticleData } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import { isOsportPlatform, isMabuPlatform } from '@/utils/platform'

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
  name: 'GameRecordTable',
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
  private list: IArticleData[] = []
  private total = 0
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    agentID: '',
    memberID: '',
    date: [],
    seatID: undefined,
    roundCount: undefined,
    gameID: undefined,
    sort: '+id',
    gameType: undefined,
    winType: undefined
  }
  private calendarTypeOptions = calendarTypeOptions
  private agentIDs : Array<{ value: string; label: string }> = [];

  private gameTypeList = isMabuPlatform() ? [
    {
      label: 'All',
      value: undefined
    }, {
      label: 'SlotGame',
      value: 'SlotGame'
    }
  ] : [
    {
      label: 'All',
      value: undefined
    },
    {
      label: 'Live',
      value: 'Live'
    }
  ]

  private winTypeList = isMabuPlatform() ? [{
    label: 'NormalGame',
    value: 'NormalGame'
  },
  {
    label: 'DoubleGame',
    value: 'DoubleGame'
  },
  {
    label: 'FreeGame',
    value: 'FreeGame'
  },
  {
    label: 'BonusGame1',
    value: 'BonusGame1'
  },
  {
    label: 'BonusGame2',
    value: 'BonusGame2'
  },
  {
    label: 'JackpotGame',
    value: 'JackpotGame'
  },
  {
    label: 'All',
    value: undefined
  }
  ] : [{
    label: 'Gift',
    value: 'Gift'
  }, {
    label: 'All',
    value: undefined
  }
  ]

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
      const { data } = await getGameRecord(query)
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
