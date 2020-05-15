
<template>
  <div class="tableForm">
    <h3>全域限制</h3>
    <el-table
      :data="globalRestrictions"
      style="width: 100%"
      width="auto"
    >
      <el-table-column
        fixed
        prop="gameID"
        label="遊戲 ID"
        width="auto"
      />
      <el-table-column
        prop="gameName"
        label="遊戲名稱"
        width="auto"
      />
      <el-table-column
        prop="RTP"
        label="RTP"
        width="auto"
      />
      <el-table-column
        prop="ngMaxWinPoints"
        label="NG 最大贏分"
        width="auto"
      />
      <el-table-column
        prop="FGMaxRounds"
        label="FG 最大局數"
        width="auto"
      />
      <el-table-column
        prop="FGMaxWinPoints"
        label="FG 最大贏分"
        width="auto"
      />
    </el-table>
    <br><br><br><br><br>
    <h3>代理限制</h3>
    <el-table
      :data="go"
      style="width: 100%"
      width="auto"
    >
      <el-table-column
        fixed
        prop="gameID"
        label="遊戲 ID"
        width="auto"
      />
      <el-table-column
        prop="gameName"
        label="遊戲名稱"
        width="auto"
      />
      <el-table-column
        prop="RTP"
        label="RTP"
        width="auto"
      />
      <el-table-column
        prop="ngMaxWinPoints"
        label="NG 最大贏分"
        width="auto"
      />
      <el-table-column
        prop="FGMaxRounds"
        label="FG 最大局數"
        width="auto"
      />
      <el-table-column
        prop="FGMaxWinPoints"
        label="FG 最大贏分"
        width="auto"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { forceBingo, getConfigSetting } from '@/api/slotgameServer'
import { gameList } from '@/api/gameManagerServer'

import { formatJson } from '@/utils'
import * as _ from 'lodash'

@Component({
  name: 'GameRestrictions',
  components: {}
})
export default class extends Vue {
  private isIndeterminate = false
  private listLoading = false;
  private downloadLoading = false;
  private checkAll = false

private go =[];
  private globalRestrictions: {
    gameID: string,
    gameName: string,
    RTP: number,
    ngMaxWinPoints: number,
    FGMaxRounds: number,
    FGMaxWinPoints: number,
    url: string
  }[]= []
  async created() {
    let game: any = []
    const { data } = await gameList({})
    for (const value in data) {
      const { gameID, gameAPI, gameName, baseURL } = data[value]
      game.push({
        gameID,
        gameName: this.$t(`gameName.${gameName}`).toString() !== `gameName.${gameName}` ? this.$t(`gameName.${gameName}`).toString() : gameName,
        RTP: '-',
        ngMaxWinPoints: '-',
        FGMaxRounds: '-',
        FGMaxWinPoints: '-',
        baseURL,
        gameAPI
      })
      this.settingGameConfig(gameAPI, baseURL)
    }

    this.globalRestrictions = game
  }

  private async settingGameConfig(url: string, baseURL: string) {
    const { data } = await getConfigSetting(url, baseURL)
    const { gameID, items } = data
    for (const value of this.globalRestrictions) {
      if (value.gameID === gameID) {
        value.RTP = items[0]
        value.ngMaxWinPoints = items[1]
        value.FGMaxRounds = items[2]
        value.FGMaxWinPoints = items[3]
      }
    }
  }
}
</script>
<style lang="scss">
.tableForm{
  margin: 20px
}
</style>
