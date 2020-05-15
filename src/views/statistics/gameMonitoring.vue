<template>
  <div class="app-container">
    <!-- search -->
    <div id="search">
      <div class="group-search">
        <span>{{ $t('table.search') }}</span>
      </div>
      <!-- 搜尋end -->
      <!-- 快速搜尋 -->
      <FastDatePicker
        @changed="onDateChanged"
      />
      <!-- <div class="group-item">
        <label class="set-text">{{ $t('gameMonitoring.fastSearch') }}</label>
        <div class="fastSearch">
          <el-row
            :gutter="10"
          >
            <el-col
              :xs="12"
              :sm="4"
            >
              <el-button
                type="success"
                class="btn"
                @click="yesterday"
              >
                {{ $t('gameMonitoring.yesterday') }}
              </el-button>
            </el-col>
            <el-col
              :xs="12"
              :sm="4"
            >
              <el-button
                type="success"
                class="btn"
                @click="today"
              >
                {{ $t('gameMonitoring.today') }}
              </el-button>
            </el-col>
            <el-col
              :xs="12"
              :sm="4"
            >
              <el-button
                type="success"
                class="btn"
                @click="thisWeek"
              >
                {{ $t('gameMonitoring.thisWeek') }}
              </el-button>
            </el-col>
            <el-col
              :xs="12"
              :sm="4"
            >
              <el-button
                type="success"
                class="btn"
                @click="lastWeek"
              >
                {{ $t('gameMonitoring.lastWeek') }}
              </el-button>
            </el-col>
            <el-col
              :xs="12"
              :sm="4"
            >
              <el-button
                type="success"
                class="btn"
                @click="thisMonth"
              >
                {{ $t('gameMonitoring.thisMonth') }}
              </el-button>
            </el-col>
            <el-col
              :xs="12"
              :sm="4"
            >
              <el-button
                type="success"
                class="btn"
                @click="lastMonth"
              >
                {{ $t('gameMonitoring.lastMonth') }}
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div> -->
      <!-- 快速搜尋 end-->
      <!-- 表單玩家查詢可輸入部分 -->
      <div class="group-item">
        <el-row
          :gutter="10"
        >
          <!-- 固定一定會出現的可選項目 -->
          <el-col
            :xs="24"
            :sm="24"
          >
            <el-row
              :gutter="10"
            >
              <el-col
                :xs="24"
                :sm="12"
              >
                <label class="set-text">{{ $t('gameMonitoring.chooseTime') }}</label>
                <el-date-picker
                  v-model="playerSearch.date"
                  class="pickDate"
                  type="datetimerange"
                  align="right"
                  unlink-panels
                  range-separator="～"
                  start-placeholder="START TIME"
                  end-placeholder="END TIME"
                />
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
              >
                <label class="set-text">{{ $t('gameMonitoring.selectType') }}</label>
                <el-select
                  v-model="playerSearch.optionValue"
                  :placeholder="$t('gameMonitoring.choose')"
                  class="selectC"
                  @change="sendData"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-row>
          </el-col>
          <!-- 固定一定會出現的可選項目 -->
          <el-col
            :xs="24"
            :sm="24"
          >
            <!-- player -->
            <div v-if="playerSearch.optionValue === 'memberID'">
              <el-row
                :gutter="10"
              >
                <el-col
                  :xs="24"
                  :sm="8"
                >
                  <!--代理商  -->
                  <div class="group-item">
                    <label class="set-text">{{ $t('gameMonitoring.agentSelect') }}</label>
                    <el-select
                      v-model="playerSearch.agent"
                      :placeholder="$t('gameMonitoring.choose')"
                      class="selectC"
                      @change="sendData"
                    >
                      <el-option
                        v-for="item in agent"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <!-- 代理商end -->
                </el-col>
                <el-col
                  :xs="24"
                  :sm="8"
                >
                  <!-- 遊戲類型 -->
                  <div class="group-item">
                    <label class="set-text">{{ $t('gameMonitoring.gameType') }}</label>
                    <el-select
                      v-model="playerSearch.gameType"
                      :placeholder="$t('gameMonitoring.choose')"
                      class="selectC"
                      @change="sendData"
                    >
                      <el-option
                        v-for="item in gameType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <!-- 遊戲類型end -->
                </el-col>
                <el-col
                  :xs="24"
                  :sm="8"
                >
                  <!-- 選擇遊戲 -->
                  <div class="group-item">
                    <label class="set-text">{{ $t('gameMonitoring.chooseGame') }}</label>
                    <el-select
                      v-model="playerSearch.game"
                      :placeholder="$t('gameMonitoring.choose')"
                      class="selectC"
                      @change="sendData"
                    >
                      <el-option
                        v-for="item in game"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <!-- 選擇遊戲end -->
                </el-col>
                <el-col
                  :xs="24"
                  :sm="8"
                >
                  <!--計算類型  -->
                  <div class="group-item">
                    <label class="set-text">{{ $t('gameMonitoring.countType') }}</label>
                    <el-select
                      v-model="playerSearch.countType"
                      :placeholder="$t('gameMonitoring.choose')"
                      class="selectC"
                      @change="sendData"
                    >
                      <el-option
                        v-for="item in countType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <!--計算類型  -->
                </el-col>
                <el-col
                  :xs="24"
                  :sm="8"
                >
                  <!-- 玩家 -->
                  <div class="group-item">
                    <label class="set-text inputX">{{ $t('gameMonitoring.player') }}</label>
                    <el-input
                      v-model="playerSearch.memberID"
                      :placeholder="$t('gameMonitoring.entermemberID')"
                      class="input selectC"
                      clearable
                    />
                  </div>
                  <!-- 玩家 -->
                </el-col>
              </el-row>
            </div>
            <!-- player end -->
            <!-- day -->
            <div v-if="playerSearch.optionValue === 'dayTime'">
              <el-row
                :gutter="10"
              >
                <el-col
                  :xs="24"
                  :sm="8"
                >
                  <!--計算類型  -->
                  <div class="group-item">
                    <label class="set-text">{{ $t('gameMonitoring.currency') }}</label>
                    <el-select
                      v-model="playerSearch.currencyType"
                      :placeholder="$t('gameMonitoring.choose')"
                      class="selectC"
                    >
                      <el-option
                        v-for="item in currencyType"
                        :key="item.value"
                        class="filter-item"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <!--計算類型  -->
                </el-col>
                <el-col
                  :xs="24"
                  :sm="8"
                >
                  <!--計算類型  -->
                  <div class="group-item">
                    <label class="set-text">{{ $t('gameMonitoring.agentStatus') }}</label>
                    <el-select
                      v-model="playerSearch.openClose"
                      :placeholder="$t('gameMonitoring.choose')"
                      class="selectC"
                    >
                      <el-option
                        v-for="item in openClose"
                        :key="item.value"
                        class="filter-item"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <!--計算類型  -->
                </el-col>
                <el-col
                  :xs="24"
                  :sm="8"
                >
                  <!--代理商  -->
                  <div class="group-item">
                    <label class="set-text">{{ $t('gameMonitoring.agentSelect') }}</label>
                    <el-select
                      v-model="playerSearch.agent"
                      :placeholder="$t('gameMonitoring.choose')"
                      class="selectC"
                      @change="sendData"
                    >
                      <el-option
                        v-for="item in agent"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <!-- 代理商end -->
                </el-col>
                <el-col
                  :xs="24"
                  :sm="8"
                >
                  <!-- 玩家 -->
                  <div class="group-item">
                    <label class="set-text inputX">{{ $t('gameMonitoring.player') }}</label>

                    <el-input
                      v-model="playerSearch.memberID"
                      :placeholder="$t('gameMonitoring.entermemberID')"
                      class="input selectC"
                    />
                  </div>
                  <!-- 玩家 -->
                </el-col>
              </el-row>
            </div>
            <!-- day end -->
          </el-col>
        </el-row>
      </div>
      <!-- 表單玩家查詢可輸入部分 -->
      <!-- 送出 -->
      <div class="sendBtn">
        <el-row>
          <el-button
            type="primary"
            round
            @click="sendData"
          >
            {{ $t('table.search') }}
          </el-button>
        </el-row>
      </div>
      <!-- 送出 -->
    </div>
    <!-- search -->
    <!-- lable -->
    <div>
      <el-row
        :gutter="10"
      >
        <el-col
          v-show="playerSearch.optionValue !== 'memberID'"
          :xs="24"
          :sm="8"
        >
          <div class="peopleCount countLable">
            <h1>{{ statisticsAll.playerCount }}</h1>
            {{ $t('gameMonitoring.peopleCountCount') }}
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
        >
          <div class="totalBet countLable">
            <h1>{{ financial(statisticsAll.totalBet) }}</h1>
            {{ $t('gameMonitoring.totalBetCount') }}
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
        >
          <div class=" totalWinlose countLable">
            <h1>{{ financial(statisticsAll.totalWinlose) }}</h1>
            {{ $t('gameMonitoring.totalWinloseCount') }}
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
        >
          <div class=" FreeGame countLable">
            <h1>{{ financial(statisticsAll.FreeGame) }}</h1>
            {{ $t('gameMonitoring.FreeGameCount') }}
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
        >
          <div class="JPWIN countLable">
            <h1>{{ financial(statisticsAll.JPWIN) }}</h1>
            {{ $t('gameMonitoring.JPWINCount') }}
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
        >
          <div class="Round countLable">
            <h1>{{ statisticsAll.Round }}</h1>
            {{ $t('gameMonitoring.RoundCount') }}
          </div>
        </el-col>

        <el-col
          :xs="24"
          :sm="8"
        >
          <div class="totalWinloseNoJP countLable">
            <h1>{{ financial(statisticsAll.totalWinloseNoJP) }}</h1>
            {{ $t('gameMonitoring.totalWinloseNoJPCount') }}
          </div>
        </el-col>

        <el-col
          :xs="24"
          :sm="8"
        >
          <div class="DoubleGame countLable">
            <h1>{{ financial(statisticsAll.DoubleGame) }}</h1>
            {{ $t('gameMonitoring.DoubleGameCount') }}
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
        >
          <div class="BonusGame1 countLable">
            <h1>{{ financial(statisticsAll.BonusGame1) }}</h1>
            {{ $t('gameMonitoring.BonusGame1Count') }}
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
        >
          <div class="BonusGame2 countLable">
            <h1>{{ financial(statisticsAll.BonusGame2) }}</h1>
            {{ $t('gameMonitoring.BonusGame2Count') }}
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- lable -->
    <!-- table -->
    <div id="search">
      <el-table
        :data="tableData.slice((playerSearch.page-1)*playerSearch.limit,playerSearch.page*playerSearch.limit)"
        stripe
        style="width: 100%"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          v-if="playerSearch.optionValue ==='dayTime' "
          :key="1"
          prop="dayTime"
          :label="$t('gameMonitoring.dayTime')"
        >
          <template slot-scope="scope">
            {{ scope.row.dayTime }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="playerSearch.optionValue ==='memberID' "
          :key="2"
          prop="memberID"
          :label="$t('gameMonitoring.memberID')"
        >
          <template slot-scope="scope">
            {{ getAccount(scope.row.memberID) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="playerSearch.optionValue ==='memberID' "
          :key="3"
          prop="memberID"
          :label="$t('gameMonitoring.agent')"
        >
          <template slot-scope="scope">
            {{ getAgent(scope.row.memberID) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="playerSearch.optionValue ==='gameID' || playerSearch.countType ==='one' "
          :key="2"
          prop="gameID"
          :label="$t('gameMonitoring.gameName')"
        >
          <template slot-scope="scope">
            {{ gameName[scope.row.gameID] }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="playerSearch.optionValue ==='gameID' "
          :key="3"
          prop="gameID"
          :label="$t('gameMonitoring.gameNo')"
        >
          <template slot-scope="scope">
            {{ scope.row.gameID }}
          </template>
        </el-table-column>
        <el-table-column
          :key="13"
          prop="totalBet"
          :label="$t('gameMonitoring.totalBet')"
          sortable
        >
          <template slot-scope="scope">
            {{ financial(scope.row.totalBet) }}
          </template>
        </el-table-column>
        <el-table-column
          :key="4"
          prop="totalWinlose"
          :label="$t('gameMonitoring.totalWinlose')"
          sortable
        >
          <template slot-scope="scope">
            {{ financial( scope.row.totalWinlose) }}
          </template>
        </el-table-column>
        <el-table-column
          :key="5"
          prop="totalWinloseNoJP"
          :label=" $t('gameMonitoring.totalWinloseNoJP')"
          sortable
        >
          <template slot-scope="scope">
            {{ financial(scope.row.totalWinloseNoJP) }}
          </template>
        </el-table-column>
        <el-table-column
          :key="6"
          prop="JPWIN"
          :label="$t('gameMonitoring.JPWIN')"
          sortable
        >
          <template slot-scope="scope">
            {{ financial(scope.row.JPWIN) }}
          </template>
        </el-table-column>
        <el-table-column
          :key="7"
          prop="Round"
          :label="$t('gameMonitoring.Round')"
          sortable
        />
        <el-table-column
          :key="8"
          prop="DoubleGame"
          :label="$t('gameMonitoring.DoubleGame')"
          sortable
        >
          <template slot-scope="scope">
            {{ financial(scope.row.DoubleGame) }}
          </template>
        </el-table-column>
        <el-table-column
          :key="9"
          prop="FreeGame"
          :label="$t('gameMonitoring.FreeGame')"
          sortable
        >
          <template slot-scope="scope">
            {{ financial(scope.row.FreeGame) }}
          </template>
        </el-table-column>
        <el-table-column
          :key="10"
          prop="BonusGame1"
          :label="$t('gameMonitoring.BonusGame1')"
          sortable
        >
          <template slot-scope="scope">
            {{ financial(scope.row.BonusGame1) }}
          </template>
        </el-table-column>
        <el-table-column
          :key="11"
          prop="BonusGame2"
          :label="$t('gameMonitoring.BonusGame2')"
          sortable
        >
          <template slot-scope="scope">
            {{ financial(scope.row.BonusGame2) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="playerSearch.optionValue ==='gameID' "
          :key="12"
          prop="playerCount"
          :label="$t('gameMonitoring.playerCount')"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.playerCount }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="playerSearch.page"
        :limit.sync="playerSearch.limit"
        @pagination="currentChange"
      />
    </div>
    <!-- table -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import '@/styles/gameMonitiring.scss'
import { Form, Notification } from 'element-ui'
import { getAgentList } from '@/api/admin'
import { getStatistics, searchStatisticsDistinctPeople } from '@/api/gameStatistics'
import { gameList } from '@/api/gameManagerServer'
import * as _ from 'lodash'
import Pagination from '@/components/Pagination/index.vue'
import FastDatePicker from '@/components/FastDatePicker/index.vue'
@Component({
  name: 'GameMonitoring',
  components: {
    FastDatePicker,
    Pagination
  }
})
export default class extends Vue {
  private total = 2
  private playerSearch = {
    optionValue: 'gameID',
    memberID: '',
    agent: 'mabu777',
    gameType: 'all',
    game: 'all',
    countType: 'all',
    currencyType: 'all',
    openClose: 'all',
    date: [new Date(), new Date()],
    page: 1,
    limit: 20
  };
  private options= [{
    value: 'gameID',
    label: '遊戲'
  }, {
    value: 'memberID',
    label: '玩家'
  }, {
    value: 'dayTime',
    label: '每日'
  }]

  private agent= [{
    value: 'mabu777',
    label: 'mabu777'
  }]
  private agentID = []

  private gameType= [{
    value: 'all',
    label: '--全選--'
  }, {
    value: 'Slotgame',
    label: '老虎機'
  }]

  private game =[]

  private countType =[{
    value: 'one',
    label: '個別'
  }, {
    value: 'all',
    label: '合計'
  }]

  private openClose = [{
    value: 'all',
    label: '--全選--'
  }, {
    value: 'open',
    label: '啟用(已營運)'
  }, {
    value: 'close',
    label: '啟用(未營運)'
  }]

  private currencyType = [{
    value: 'all',
    label: '--全選--'
  }, {
    value: 'TWD',
    label: '台幣'
  }]
  private gameName = {};
  private tableData =[];
  private statisticsAll= {
    totalBet: 0,
    totalWinlose: 0,
    totalWinloseNoJP: 0,
    JPWIN: 0,
    Round: 0,
    DoubleGame: 0,
    FreeGame: 0,
    BonusGame1: 0,
    BonusGame2: 0,
    playerCount: 0
  };
  async created() {
    const { data } = await getAgentList()
    const gameListData: any = await gameList({})
    let agent: any = [{
      value: 'all',
      label: '--全選--'
    }]
    let agentID:any = []
    _.map(data, function(value, index) {
      agent.push({
        value: value.account,
        label: value.account
      })
      agentID.push(value.account)
    })
    this.agentID = agentID
    let game: any = [{
      value: 'all',
      label: '--全選--'
    }]
    let gameName: any = {}
    _.map(gameListData.data, function(value, index) {
      game.push({
        value: value.gameID,
        label: value.content
      })
      gameName[value.gameID] = value.content
    })
    this.gameName = gameName
    this.game = game
    this.agent = agent
    // this.today()
  }

  private async sendData() {
    let data: any = {}

    if (this.playerSearch.optionValue === 'gameID') {
      data = {
        startSearchTime: this.playerSearch.date[0],
        endtSearchTime: this.playerSearch.date[1],
        optionValue: this.playerSearch.optionValue
      }
    }

    if (this.playerSearch.optionValue === 'memberID') {
      data = {
        startSearchTime: this.playerSearch.date[0],
        endtSearchTime: this.playerSearch.date[1],
        optionValue: this.playerSearch.optionValue,
        agent: [this.playerSearch.agent],
        gameType: this.playerSearch.gameType,
        game: this.playerSearch.game,
        countType: this.playerSearch.countType
      }
      if (this.playerSearch.memberID !== '') {
        if (this.playerSearch.agent === 'all') {
          await Notification.error({ title: '資料錯誤', message: '代理商 請選擇', type: 'error' })
          return
        }
        data.memberID = `${this.playerSearch.memberID}@${this.playerSearch.agent}`
      }
      if (this.playerSearch.agent === 'all') {
        data.agent = this.agentID
      }
    }

    if (this.playerSearch.optionValue === 'dayTime') {
      data = {
        startSearchTime: this.playerSearch.date[0],
        endtSearchTime: this.playerSearch.date[1],
        optionValue: this.playerSearch.optionValue,
        openClose: this.playerSearch.openClose,
        agent: [this.playerSearch.agent],
        currencyType: this.playerSearch.currencyType
      }
      if (this.playerSearch.memberID !== '') {
        if (this.playerSearch.agent === 'all') {
          await Notification.error({ title: '資料錯誤', message: '代理商 請選擇', type: 'error' })
          return
        }
        data.memberID = `${this.playerSearch.memberID}@${this.playerSearch.agent}`
      }
      if (this.playerSearch.agent === 'all') {
        data.agent = this.agentID
      }
    }
    const statisticsAll = {
      totalWinlose: 0,
      totalWinloseNoJP: 0,
      JPWIN: 0,
      Round: 0,
      DoubleGame: 0,
      FreeGame: 0,
      BonusGame1: 0,
      BonusGame2: 0,
      playerCount: 0,
      totalBet: 0
    }
    const searchStatisticsDistinct = await searchStatisticsDistinctPeople(data)
    const [{ distinctPeople }] = searchStatisticsDistinct.data

    const getStatisticsReturn = await getStatistics(data)
    const getStatisticsData = getStatisticsReturn.data.items
    _.map(getStatisticsData, function(value, index) {
      statisticsAll.totalWinlose += Number(Number(value.totalWinlose).toFixed(2))
      statisticsAll.totalWinloseNoJP += Number(Number(value.totalWinloseNoJP).toFixed(2))
      statisticsAll.JPWIN += Number(Number(value.JPWIN).toFixed(2))
      statisticsAll.Round += Number(Number(value.Round).toFixed(2))
      statisticsAll.DoubleGame += Number(Number(value.DoubleGame).toFixed(2))
      statisticsAll.FreeGame += Number(Number(value.FreeGame).toFixed(2))
      statisticsAll.BonusGame1 += Number(Number(value.BonusGame1).toFixed(2))
      statisticsAll.BonusGame2 += Number(Number(value.BonusGame2).toFixed(2))
      statisticsAll.playerCount += Number(Number(value.playerCount).toFixed(2))
      statisticsAll.totalBet += Number(Number(value.totalBet).toFixed(2))
    })
    this.statisticsAll = statisticsAll
    statisticsAll.playerCount = distinctPeople
    this.total = getStatisticsReturn.data.total.length
    this.tableData = getStatisticsData
  }

  private getSummaries(param: any) {
    const columns: any = param.columns
    const data: any = param.data
    const sums: any = []
    _.map(columns, function(value, index) {
      if (Number(index) === 0) {
        sums[index] = '总价'
        return
      }
      sums[index] = 0
      if (value.property !== 'gameID' && value.property !== 'memberID') {
        _.map(data, function(dataValue, dataIndex) {
          sums[index] += Number(Number(dataValue[value.property]).toFixed(2))
        })
        sums[index] = Number(Number(sums[index]).toFixed(2))
      } else {
        sums[index] = '-'
      }
    })
    return sums
  }
  private onDateChanged(data: any) {
    this.playerSearch.date = [data[0], data[1]]
  }

  private dateFromat(time: any) {
    var date = new Date(time)
    return date.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
  }

  private financial(x: any) {
    return Number(Number(x).toFixed(2))
  }

  private getAccount(x: string) {
    let account

    if (x) {
      account = x.split('@')[0]
    }

    return account
  }
  private getAgent(x: string) {
    let agent
    if (x) {
      agent = x.split('@')[1]
    }

    return agent
  }
}

</script>
