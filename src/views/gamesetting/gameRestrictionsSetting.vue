
<template>
  <div
    class="tableForm"
  >
    <h3>全域限制</h3>
    <el-table
      v-loading="listLoading"
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
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"

            @click.native.prevent="calldialog(scope.$index)"
          >
            [設定]
          </el-button>
        </template>
      </el-table-column>
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

    <el-dialog
      :title="dialogRestrictions.gameName"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :modal="true"
      :close-on-click-modal="false"
    >
      <el-form :model="form">
        <!-- rtp option -->
        <el-form-item
          label="RTP"
          :label-width="form.formLabelWidth"
        >
          <el-select
            v-model="dialogRestrictions.RTP"
            placeholder="rtp"
          >
            <el-option
              v-for="item in rtpList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!-- rtp option -->

        <!-- ngMaxWinPoints option -->

        <el-form-item
          label="NG 最大贏分"
          :label-width="form.formLabelWidth"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="ngMaxWinPoints"
            placement="top"
          >
            <el-input
              v-model="dialogRestrictions.ngMaxWinPoints"
              type="number"
              max="50000000"
              min="0"
              placeholder="请输入内容"
              @input="checkngMaxWinPoints"
            />
          </el-tooltip>
        </el-form-item>
        <!-- ngMaxWinPoints option -->

        <!-- FGMaxRounds option -->
        <el-form-item
          label="FG 最大局數"
          :label-width="form.formLabelWidth"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="FGMaxRounds"
            placement="top"
          >
            <el-input
              v-model="dialogRestrictions.FGMaxRounds"
              type="number"
              max="100"
              min="0"
              placeholder="请输入内容"
              @input="checkFGMaxRounds"
            />
          </el-tooltip>
        </el-form-item>
        <!-- FGMaxRounds option -->

        <!-- FGMaxWinPoints option -->
        <el-form-item
          label="FG 最大贏分"
          :label-width="form.formLabelWidth"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="FGMaxWinPoints"
            placement="top"
          >
            <el-input
              v-model="dialogRestrictions.FGMaxWinPoints"
              type="number"
              max="50000000"
              min="0"
              placeholder="请输入内容"
              @input="checkFGMaxWinPoints"
            />
          </el-tooltip>
        </el-form-item>
        <!-- FGMaxWinPoints option -->
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="updateGameConfig"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { forceBingo, getConfigSetting, getConfigItem, setConfigSetting } from '@/api/slotgameServer'
import { gameList } from '@/api/gameManagerServer'
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
  private form = {
    name: '',
    formLabelWidth: '120px'
  }
  private globalRestrictions: {
    gameID: string,
    gameName: string,
    RTP: number,
    ngMaxWinPoints: number,
    FGMaxRounds: number,
    FGMaxWinPoints: number,
    baseURL: string,
    url: string
  }[] = []
  private go = []
  private dialogRestrictions: {
    gameID: string;
    gameName: string;
    RTP: any;
    ngMaxWinPoints: any;
    FGMaxRounds: any;
    FGMaxWinPoints: any;
    baseURL: string;
    url: string;
  } = {
    gameID: '',
    gameName: '',
    RTP: 0,
    ngMaxWinPoints: 0,
    FGMaxRounds: 0,
    FGMaxWinPoints: 0,
    url: '',
    baseURL: ''
  }

  private rtpList: any = [];

  private ngLimitedWinList:any = [0, 0];
  private ngMaxWinPoints: string ='';

  private maxFGRoundsList:any = [0, 0];
  private FGMaxRounds: string ='';

  private fgLimitedTotalWinList:any = [0, 0];
  private FGMaxWinPoints: string ='';

  private item = ['rtp', 'ngLimitedWin', 'maxFGRounds', 'fgLimitedTotalWin'];

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
        gameAPI,
        baseURL
      })
      this.settingGameConfig(gameAPI, baseURL)
    }

    this.globalRestrictions = game
    this.listLoading = false
  }
  // 設定 每一個的 可調值
  private async settingGameConfig(url: string, baseURL: string) {
    const { data } = await getConfigSetting(url, baseURL)
    if (data) {
      const { gameID, items } = data
      for (const value of this.globalRestrictions) {
        if (value.gameID === gameID) {
          value.RTP = items[0]
          value.ngMaxWinPoints = items[1]
          value.FGMaxRounds = items[2]
          value.FGMaxWinPoints = items[3]
          break
        }
      }
    }
  }

  // 開啟dialog
  private async calldialog(index: any) {
    this.dialogRestrictions = await _.cloneDeep(this.globalRestrictions[index])
    if (this.dialogRestrictions.RTP === '-' && this.dialogRestrictions.ngMaxWinPoints === '-') {
      await Notification.error({ title: '伺服器錯誤', message: '無法連線伺服器', type: 'warning' })
      return
    }
    this.dialogVisible = true
    const rtp = await getConfigItem(this.dialogRestrictions.url, 'rtp', this.dialogRestrictions.baseURL)
    this.rtpList = JSON.parse(rtp.data)

    const ngLimitedWin = await getConfigItem(this.dialogRestrictions.url, 'ngLimitedWin', this.dialogRestrictions.baseURL)
    this.ngLimitedWinList = JSON.parse(ngLimitedWin.data)
    this.ngMaxWinPoints = `最大: ${this.ngLimitedWinList[1]} 最小: ${this.ngLimitedWinList[0]}`

    const maxFGRounds = await getConfigItem(this.dialogRestrictions.url, 'maxFGRounds', this.dialogRestrictions.baseURL)
    this.maxFGRoundsList = JSON.parse(maxFGRounds.data)
    this.FGMaxRounds = `最大: ${this.maxFGRoundsList[1]} 最小: ${this.maxFGRoundsList[0]}`

    const fgLimitedTotalWinList = await getConfigItem(this.dialogRestrictions.url, 'fgLimitedTotalWin', this.dialogRestrictions.baseURL)
    this.fgLimitedTotalWinList = JSON.parse(fgLimitedTotalWinList.data)
    this.FGMaxWinPoints = `最大: ${this.fgLimitedTotalWinList[1]} 最小: ${this.fgLimitedTotalWinList[0]}`
  }
  // 右上關閉
  private handleClose() {
    this.dialogVisible = false
  }

  // 發API
  private async updateGameConfig() {
    const changeData: string[] = []
    if (this.dialogRestrictions.FGMaxRounds < 10) {
      await Notification.error({ title: 'FG 最大局數', message: '必須大於10', type: 'error' })
      return
    }
    changeData.push(this.dialogRestrictions.RTP)
    changeData.push(this.dialogRestrictions.ngMaxWinPoints)
    changeData.push(this.dialogRestrictions.FGMaxRounds)
    changeData.push(this.dialogRestrictions.FGMaxWinPoints)
    const { data } = await setConfigSetting(this.dialogRestrictions.url, changeData, this.dialogRestrictions.baseURL)
    for (const index in this.item) {
      if (data[index] === true) {
        await Notification.success({ title: this.item[index], message: '設定成功', type: 'success' })
      } else {
        await Notification.error({ title: this.item[index], message: '設定失敗', type: 'error' })
      }
    }
    await this.settingGameConfig(this.dialogRestrictions.url, this.dialogRestrictions.baseURL)

    this.dialogVisible = false
  }

  // 判斷 checkFGMaxRounds 最大最小
  private checkFGMaxRounds() {
    if (this.dialogRestrictions.FGMaxRounds > this.maxFGRoundsList[1]) {
      this.dialogRestrictions.FGMaxRounds = this.maxFGRoundsList[1]
    }
    if (this.dialogRestrictions.FGMaxRounds < 0) {
      this.dialogRestrictions.FGMaxRounds = 0
    }
  }

  // 判斷 checkFGMaxWinPoints 最大最小
  private checkFGMaxWinPoints() {
    if (this.dialogRestrictions.FGMaxWinPoints > this.fgLimitedTotalWinList[1]) {
      this.dialogRestrictions.FGMaxWinPoints = this.fgLimitedTotalWinList[1]
    }
    if (this.dialogRestrictions.FGMaxWinPoints < this.fgLimitedTotalWinList[0]) {
      this.dialogRestrictions.FGMaxWinPoints = this.fgLimitedTotalWinList[0]
    }
  }

  // 判斷 ngMaxWinPoints 最大最小
  private checkngMaxWinPoints() {
    if (this.dialogRestrictions.ngMaxWinPoints > this.ngLimitedWinList[1]) {
      this.dialogRestrictions.ngMaxWinPoints = this.ngLimitedWinList[1]
    }
    if (this.dialogRestrictions.ngMaxWinPoints < this.ngLimitedWinList[0]) {
      this.dialogRestrictions.ngMaxWinPoints = this.ngLimitedWinList[0]
    }
  }
}
</script>
<style lang="scss">
.tableForm{
  margin: 20px
}
</style>
