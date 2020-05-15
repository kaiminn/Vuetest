
<template>
  <div
    class="tableForm"
  >
    <h3>JP設定</h3>
    <el-table
      v-loading="listLoading"
      :data="globalRestrictions"
      style="width: 100%"
      width="auto"
    >
      <el-table-column
        fixed
        prop="JP"
        label="JP"
        width="auto"
      />
      <el-table-column
        prop="miniBet"
        label="miniBet"
        width="auto"
      />
      <el-table-column
        prop="jpBase"
        label="jpBase"
        width="auto"
      />
      <el-table-column
        prop="jpMin"
        label="jpMin"
        width="auto"
      />
      <el-table-column
        prop="jpMax"
        label="jpMax"
        width="auto"
      />
      <el-table-column
        prop="jpContribRatio"
        label="jpContribRatio"
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
    <!-- 彈跳視窗 -->
    <el-dialog
      :title="dialogRestrictions.JP"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :modal="true"
      :close-on-click-modal="false"
    >
      <el-form :model="form">
        <!-- miniBet option -->
        <el-form-item
          label="miniBet"
          :label-width="form.formLabelWidth"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="miniBetMessage"
            placement="top"
          >
            <el-input
              v-model="dialogRestrictions.miniBet"
              type="number"
              :max="miniBetList[1]"
              :min="miniBetList[0]"
              placeholder="请输入内容"
              @input="checkMinBet"
            />
          </el-tooltip>
        </el-form-item>
        <!-- miniBet option -->

        <!-- jpBase option -->

        <el-form-item
          label="jpBase"
          :label-width="form.formLabelWidth"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="jpBaseMessage"
            placement="top"
          >
            <el-input
              v-model="dialogRestrictions.jpBase"
              type="number"
              :max="jpBaseList[1]"
              :min="jpBaseList[0]"
              placeholder="请输入内容"
              @input="checkjpBase"
            />
          </el-tooltip>
        </el-form-item>
        <!-- jpBase option -->

        <!-- jpMin option -->
        <el-form-item
          label="jpMin"
          :label-width="form.formLabelWidth"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="jpMinMessage"
            placement="top"
          >
            <el-input
              v-model="dialogRestrictions.jpMin"
              type="number"
              :max="jpMinList[1]"
              :min="jpMinList[0]"
              placeholder="请输入内容"
              @input="checkjpMin"
            />
          </el-tooltip>
        </el-form-item>
        <!-- jpMin option -->

        <!-- jpMax option -->
        <el-form-item
          label="jpMax"
          :label-width="form.formLabelWidth"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="jpMaxMessage"
            placement="top"
          >
            <el-input
              v-model="dialogRestrictions.jpMax"
              type="number"
              :max="jpMaxList[1]"
              :min="jpMaxList[0]"
              placeholder="请输入内容"
              @input="checkjpMax"
            />
          </el-tooltip>
        </el-form-item>
        <!-- jpMax option -->

        <!-- jpContribRatio option -->
        <el-form-item
          label="jpContribRatio"
          :label-width="form.formLabelWidth"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="jpContribRatioMessage"
            placement="top"
          >
            <el-input
              v-model="dialogRestrictions.jpContribRatio"
              type="string"
              step="0.0001"
              :max="jpContribRatioList[1]"
              :min="jpContribRatioList[0]"
              placeholder="请输入内容"
              @input="checkjpContribRatio"
            />
          </el-tooltip>
        </el-form-item>
        <!-- jpContribRatio option -->
      </el-form>
      <!-- 按鈕群 -->
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
      <!-- 按鈕群 -->
    </el-dialog>
    <!-- 彈跳視窗 -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getConfigItemAction, getConfigSettingAction, setConfigItemAction } from '@/api/JPServer'
import { gameList } from '@/api/gameManagerServer'
import { Notification } from 'element-ui'
import { formatJson } from '@/utils'
import * as _ from 'lodash'

@Component({
  name: 'JPSetting',
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
    JP: string,
    miniBet: any,
    jpBase: any,
    jpMin: any,
    jpMax: any,
    jpContribRatio: any
  }[] = []
  private go = []
  private dialogRestrictions: {
    JP: string;
    miniBet: any;
    jpBase: any;
    jpMin: any;
    jpMax: any;
    jpContribRatio: any;
  } = {
    JP: '',
    miniBet: '',
    jpBase: 0,
    jpMin: 0,
    jpMax: 0,
    jpContribRatio: 0

  }

  private miniBetList:any = [0, 0];
  private miniBetMessage: string ='';

  private jpBaseList:any = [0, 0];
  private jpBaseMessage: string ='';

  private jpMinList:any = [0, 0];
  private jpMinMessage: string ='';

  private jpMaxList:any = [0, 0];
  private jpMaxMessage: string ='';

  private jpContribRatioList:any = [0, 0];
  private jpContribRatioMessage: string ='';

  async created() {
    this.listLoading = false
    await this.settingGameConfig()
  }

  private async settingGameConfig() {
    const { data } = await getConfigItemAction({
      userID: '9999',
      item: ['JP']
    })
    const jp = []
    for (const value of data) {
      jp.push({
        JP: value.name,
        miniBet: value.miniBet || '-',
        jpBase: value.jpBase || '-',
        jpMin: value.jpMin || '-',
        jpMax: value.jpMax || '-',
        jpContribRatio: value.jpContribRatio || '-'
      })
    }
    this.globalRestrictions = jp
  }

  // 開啟dialog
  private async calldialog(index: any) {
    this.dialogRestrictions = await _.cloneDeep(this.globalRestrictions[index])
    const { data } = await getConfigSettingAction({
      userID: '9999',
      items: [this.dialogRestrictions.JP]
    })
    this.dialogVisible = true

    this.miniBetList = data[0].miniBet
    this.jpBaseList = data[0].jpBase
    this.jpMinList = data[0].jpMin
    this.jpMaxList = data[0].jpMax
    this.jpContribRatioList = data[0].jpContribRatio

    this.miniBetMessage = `最大值:  ${this.miniBetList[1]},  最小值:  ${this.miniBetList[0]}`
    this.jpBaseMessage = `最大值:  ${this.jpBaseList[1]},  最小值:  ${this.jpBaseList[0]}`
    this.jpMinMessage = `最大值:  ${this.jpMinList[1]},  最小值:  ${this.jpMinList[0]}`
    this.jpMaxMessage = `最大值:  ${this.jpMaxList[1]},  最小值:  ${this.jpMaxList[0]}`
    this.jpContribRatioMessage = `最大值:  ${this.jpContribRatioList[1]},  最小值:  ${this.jpContribRatioList[0]}`
  }

  // 右上關閉
  private handleClose() {
    this.dialogVisible = false
  }

  // 發API
  private async updateGameConfig() {
    const changeData: object[] = []

    const updateDate = [{
      miniBet: this.dialogRestrictions.miniBet,
      jpBase: this.dialogRestrictions.jpBase,
      jpMin: this.dialogRestrictions.jpMin,
      jpMax: this.dialogRestrictions.jpMax,
      jpContribRatio: this.dialogRestrictions.jpContribRatio
    }]
    const { data } = await setConfigItemAction({ userID: '9999', items: [this.dialogRestrictions.JP], data: updateDate })
    const { message } = data
    if (message === 'success') {
      await Notification.success({ title: 'JP 設定', message: '設定成功', type: 'success' })
    } else {
      await Notification.error({ title: 'JP 設定', message: message, type: 'error' })
    }
    await this.settingGameConfig()
    this.dialogVisible = false
  }

  // 判斷 miniBet 最大最小
  private checkMinBet() {
    if (this.dialogRestrictions.miniBet > this.miniBetList[1]) {
      this.dialogRestrictions.miniBet = this.miniBetList[1]
    }
    if (this.dialogRestrictions.miniBet < this.miniBetList[0]) {
      this.dialogRestrictions.miniBet = this.miniBetList[0]
    }
  }

  // 判斷 jpBase 最大最小
  private checkjpBase() {
    if (this.dialogRestrictions.jpBase > this.jpBaseList[1]) {
      this.dialogRestrictions.jpBase = this.jpBaseList[1]
    }
    if (this.dialogRestrictions.jpBase < this.jpBaseList[0]) {
      this.dialogRestrictions.jpBase = this.jpBaseList[0]
    }
  }

  // 判斷 jpMin 最大最小
  private checkjpMin() {
    if (this.dialogRestrictions.jpMin > this.jpMinList[1]) {
      this.dialogRestrictions.jpMin = this.jpMinList[1]
    }
    if (this.dialogRestrictions.jpMin < this.jpMinList[0]) {
      this.dialogRestrictions.jpMin = this.jpMinList[0]
    }
  }

  // 判斷 jpMax 最大最小
  private checkjpMax() {
    if (this.dialogRestrictions.jpMax > this.jpMaxList[1]) {
      this.dialogRestrictions.jpMax = this.jpMaxList[1]
    }
    if (this.dialogRestrictions.jpMax < this.jpMaxList[0]) {
      this.dialogRestrictions.jpMax = this.jpMaxList[0]
    }
  }

  // 判斷 jpContribRatio 最大最小
  private checkjpContribRatio() {
    const check = this.dialogRestrictions.jpContribRatio
    if (Math.floor(check * 10000) / 10000 !== 0) {
      this.dialogRestrictions.jpContribRatio = Math.floor(this.dialogRestrictions.jpContribRatio * 10000) / 10000
    }
    if (this.dialogRestrictions.jpContribRatio > this.jpContribRatioList[1]) {
      this.dialogRestrictions.jpContribRatio = this.jpContribRatioList[1]
    }
    if (this.dialogRestrictions.jpContribRatio < this.jpContribRatioList[0]) {
      this.dialogRestrictions.jpContribRatio = this.jpContribRatioList[0]
    }
  }
}
</script>
<style lang="scss">
.tableForm{
  margin: 20px
}
</style>
