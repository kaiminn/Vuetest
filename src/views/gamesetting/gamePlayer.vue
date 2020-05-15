
<template>
  <div
    class="tableForm"
  >
    <h3>在線會員清單</h3>
    <el-table
      :data="allPlayerData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="time"
        label="更新日期"
      />
      <el-table-column
        prop="Agent"
        label="代理商"
      />
      <el-table-column
        prop="player"
        label="遊戲中人數"
      />
    </el-table>
    <br><br><br>
    <h3>目前遊戲內玩家狀況</h3>
    <!-- 第2張表單 -->
    <el-table
      :data="gamePlayerData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="gameID"
        label="GameID"
      />
      <el-table-column
        prop="gameName"
        label="Game Name"
      />
      <el-table-column
        prop="player"
        label="遊戲中人數"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { forceBingo, getConfigSetting, getConfigItem, setConfigSetting } from '@/api/slotgameServer'
import { gameList, getGamePlayer } from '@/api/gameManagerServer'
import { Notification } from 'element-ui'
import { formatJson } from '@/utils'
import * as _ from 'lodash'

@Component({
  name: 'GameRestrictionsSetting',
  components: {}
})
export default class extends Vue {
  private listLoading = true;
  private downloadLoading = false;
  private checkAll = false;
  private dialogVisible = false;
  private updateTime: any;
  private allPlayerData: object[] = []

  private gamePlayerData: object[] = [];

  async created() {
    await this.updatePlayerInfo()
    this.timer()
  }

  async updatePlayerInfo() {
    let today = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    const { data } = await getGamePlayer()
    const { gameName, gamePlayer } = data
    const player: any = []
    let gameInfoData: any = this.gamePlayerData
    gameInfoData = []
    let total = 0
    _.map(gamePlayer, function(value, index) {
      player[index] = 0
      _.map(value, function(valuedata, _index) {
        player[index] += Number(valuedata)
        total += Number(valuedata)
      })
    })
    let checkNumber = 0
    for (const game in gameName) {
      const gameInfo = JSON.parse(gameName[game])
      const gameData = {
        gameID: gameInfo.gameID,
        gameName: this.$t(`gameName.${gameInfo.gameName}`).toString() !== `gameName.${gameInfo.gameName}` ? this.$t(`gameName.${gameInfo.gameName}`).toString() : gameInfo.gameName,
        player: player[checkNumber]
      }
      gameInfoData.push(gameData)
      checkNumber += 1
    }
    gameInfoData = _.sortBy(gameInfoData, [function(o) { return o.gameID }])
    this.allPlayerData = []
    this.allPlayerData.push({
      time: today,
      Agent: '',
      player: total
    })
    this.gamePlayerData = gameInfoData
  }
  async timer() {
    this.updateTime = setInterval(async() => {
      await this.updatePlayerInfo()
    }, 5000)
  }

  destroyed() {
    clearInterval(this.updateTime)
  }
}
</script>
<style lang="scss">
.tableForm{
  margin: 20px
}
</style>
