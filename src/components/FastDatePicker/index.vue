<template>
  <!-- 快速搜尋 -->
  <div class="group-item">
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
  </div>
  <!-- 快速搜尋 end-->
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator'
import { ErrorLogModule } from '@/store/modules/error-log'
import '@/styles/gameMonitiring.scss'
@Component({
  name: 'FastDatePicker'
})
export default class extends Vue {
  @PropSync('startDate', { type: Date, default: () => new Date() }) private syncStartDate!: Date;
  @PropSync('endDate', { type: Date, default: () => new Date() }) private syncEndDate!: Date;
  created() {
    this.today()
  }
  private yesterday() {
    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    let today = new Date()
    today.setHours(0, 0, 0, 0)
    today.setTime(today.getTime() - 1)
    this.syncStartDate = yesterday
    this.syncEndDate = today
    this.$emit('changed', [yesterday, today])
    // this.playerSearch.date = [yesterday, today]
  }

  private today() {
    let nextday = new Date()
    nextday.setDate(nextday.getDate() + 1)
    nextday.setHours(0, 0, 0, 0)
    nextday.setTime(nextday.getTime() - 1)
    let today = new Date()
    today.setHours(0, 0, 0, 0)
    today.setTime(today.getTime())

    this.$emit('changed', [today, nextday])
  }

  private thisWeek() {
    let curr = new Date()
    let first = curr.getDate() - curr.getDay() + 1
    let last = first + 6
    let firstDat = new Date(curr.setDate(first))
    firstDat.setHours(0, 0, 0, 0)
    let lastday = new Date(curr.setDate(last))
    lastday.setHours(23, 59, 59, 0)
    this.$emit('changed', [firstDat, lastday])
    // this.playerSearch.date = [firstDat, lastday]
  }

  private lastWeek() {
    let curr = new Date()
    let first = curr.getDate() - curr.getDay()
    let last = first - 6
    let firstDat = new Date(curr.setDate(first))
    firstDat.setHours(23, 59, 59, 0)
    let lastday = new Date(curr.setDate(last))
    lastday.setHours(0, 0, 0, 0)
    this.$emit('changed', [lastday, firstDat])
    // this.playerSearch.date = [lastday, firstDat]
  }

  private thisMonth() {
    var date = new Date()
    var y = date.getFullYear()
    var m = date.getMonth()
    var firstDay = new Date(y, m, 1)
    var lastDay = new Date(y, m + 1, 0)
    lastDay.setHours(23, 59, 59, 0)
    this.$emit('changed', [firstDay, lastDay])
    // this.playerSearch.date = [firstDay, lastDay]
  }

  private lastMonth() {
    var date = new Date()
    let prevStartDate = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    let preEndDate = new Date(date.getFullYear(), date.getMonth() - 1 + 1, 0)
    preEndDate.setHours(23, 59, 59, 0)
    this.$emit('changed', [prevStartDate, preEndDate])
    // this.playerSearch.date = [prevStartDate, preEndDate]
  }
}
</script>
