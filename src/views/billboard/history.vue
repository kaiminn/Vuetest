<template>
  <div class="app-container">
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
          :label="item === 'global' ? $t('table.global') : item"
          :value="item"
        />
      </el-select>
      <!-- 搜尋時間 -->
      <date-range-picker
        class="filter-item"
        :start-date.sync="listQuery.searchTime.startTime"
        :due-date.sync="listQuery.searchTime.dueTime"
      />

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
      :data="records"
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

      <!-- 跑馬燈撥放開始時間 -->
      <el-table-column
        :label="$t('table.startTime')"
        min-width="200px"
        max-width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.startTime | parseTime("{y}/{m}/{d} {h}:{m}:{s}")
          }}</span>
        </template>
      </el-table-column>

      <!-- 跑馬燈撥放結束時間 -->
      <el-table-column
        :label="$t('table.dueTime')"
        min-width="200px"
        max-width="250px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>
            {{ row.dueTime | parseTime("{y}/{m}/{d} {h}:{m}:{s}") }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 頁面控制 -->
    <pagination
      v-show="listQuery.total > 0"
      :total="listQuery.total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { queryBillboardRecord } from '@/api/billboard'
import { getAgentList } from '@/api/admin'
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep, pickBy, identity } from 'lodash'
import { IBillboardInfo, IHistoryBillboardInfo } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { regexpToFunction } from 'path-to-regexp'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'ComplexTable',
  components: {
    Pagination,
    DateRangePicker
  }
})
export default class extends Vue {
  private agentList: Array<string> = [];
  private records: Array<IHistoryBillboardInfo> = [];
  private listQuery = {
    page: 1,
    limit: 20,
    total: 0,
    importance: undefined,
    title: undefined,
    type: undefined,
    sort: '+id',
    searchTime: {
      startTime: undefined,
      dueTime: undefined
    },
    agent: UserModule.name === 'super' ? 'mabu777' : UserModule.name,
    messageType: ''
  };
  // // 查詢跑馬燈歷史公告紀錄條件
  // private queryBillboardRecordCondition = {
  //   agentID: '',

  // };

  async created() {
    this.getList()
    await this.getAgentList()
  }

  // 取得跑馬燈紀錄的清單
  private async getList() {
    const { data, count } = await queryBillboardRecord({
      agentID: this.listQuery.agent,
      searchTime: this.listQuery.searchTime,
      limit: this.listQuery.limit,
      page: this.listQuery.page
    })
    const compilationData: Array<IHistoryBillboardInfo> = data.map(record => {
      if (record.message) {
        record.message = this.compilationCocosRichTextToHTML(record.message)
      }
      return record
    })
    this.records = compilationData
    this.listQuery.total = count
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
    if (UserModule.name === 'super') {
      this.agentList.push('global')
    }
  }

  // 重整功能
  private handleRefresh() {
    this.getList()
    this.$notify({
      title: '成功',
      message: '更新跑馬燈歷史紀錄列表成功',
      type: 'success',
      duration: 2000
    })
  }

  // 搜尋公告功能
  private handleFilter() {
    this.getList()
    this.$notify({
      title: '成功',
      message: '搜尋跑馬燈歷史紀錄列表成功',
      type: 'success',
      duration: 2000
    })
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
    return replaceRichText
  }
}
</script>

<style scope></style>
