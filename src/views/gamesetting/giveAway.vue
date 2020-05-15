<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="AgentID">
            <el-select
              v-model="form.agentID"
              placeholder="请选择"
            >
              <el-option
                v-for="item in agentIDs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="遊戲ID"
          >
            <el-select
              v-model="form.gameID"
              placeholder="请选择"
              @change="handleSelectGame"
            >
              <el-option
                v-for="item in optionsGame"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="玩家ID">
        <el-input
          v-model="form.memberID"
          clearable
        />
      </el-form-item>

      <el-form-item label="送獎類型">
        <el-select
          v-model="form.selectData"
          placeholder
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- <div
        v-if="form.selectData === 3"
        class="show"
      >
        <el-form-item
          label="押分"
          class="a"
        >
          <el-input
            v-model="form.bet"
            type="number"
          />
        </el-form-item>
        <el-form-item
          label="押輪"
          class="a"
        >
          <el-input
            v-model="form.reelBet"
            type="number"
          />
        </el-form-item>
      </div>-->

      <div
        v-if="form.selectData === 5"
        class="show"
      >
        <el-form-item
          label="轉輪帶1"
          class="a"
        >
          <el-input
            v-model="form.debugStrip[0]"
            type="number"
          />
        </el-form-item>

        <el-form-item
          label="轉輪帶2"
          class="a"
        >
          <el-input
            v-model="form.debugStrip[1]"
            type="number"
          />
        </el-form-item>

        <el-form-item
          label="轉輪帶3"
          class="a"
        >
          <el-input
            v-model="form.debugStrip[2]"
            type="number"
          />
        </el-form-item>

        <el-form-item
          label="轉輪帶4"
          class="a"
        >
          <el-input
            v-model="form.debugStrip[3]"
            type="number"
          />
        </el-form-item>

        <el-form-item
          label="轉輪帶5"
          class="a"
        >
          <el-input
            v-model="form.debugStrip[4]"
            type="number"
          />
        </el-form-item>
      </div>

      <div
        v-if="form.selectData === 6"
        class="showJP"
      >
        <div style="margin: 15px 0;" />
        <el-checkbox-group
          v-model="checkedJP"
          :min="0"
          :max="1"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="JackPot in JP"
            :key="JackPot"
            :label="JackPot"
          >
            {{ JackPot }}
          </el-checkbox>
        </el-checkbox-group>
        <br>
        <br>
        <font color="red">
          目前除了JP1 之外都沒有作用
        </font>
      </div>

      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          確認送獎
        </el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { getAgentList } from '@/api/admin'
import { Component, Vue } from 'vue-property-decorator'
import { forceBingo } from '@/api/slotgameServer'
import { IArticleData } from '@/api/types'
import { formatJson } from '@/utils'

@Component({
  name: 'GiveAway',
  components: {}
})
export default class extends Vue {
  private list: IArticleData[] = [];
  private isIndeterminate = false;
  private listLoading = false;
  private downloadLoading = false;
  private checkAll = false;
  private form = {
    agentID: '',
    memberID: '',
    gameID: '',
    reelBet: '',
    bet: '',
    debugStrip: [-1, -1, -1, -1, -1, -1, -1],
    selectData: -1
  };
  private JP: Array<string> = ['JP1', 'JP2', 'JP3', 'JP4'];
  private checkedJP: Array<string> = [];
  // 送獎選單
  private options:{ value: number; label: string }[] = [];
  // 各遊戲的送獎選單
  private GameOptions:{ [key: string]: { value: number; label: string }[]} = {
    '0001':
    [{
      value: -1,
      label: '無'
    },
    {
      value: 0,
      label: 'TotalBet 30倍以上'
    },
    {
      value: 1,
      label: 'TotalBet 25倍以上'
    },
    {
      value: 2,
      label: 'TotalBet 10倍以上'
    },
    {
      value: 3,
      label: 'FG'
    },
    {
      value: 4,
      label: 'CardFG'
    },
    {
      value: 5,
      label: '指定轉輪帶位置'
    }
    ],
    '0002': [
      {
        value: -1,
        label: '無'
      },
      {
        value: 0,
        label: 'TotalBet 30倍以上'
      },
      {
        value: 1,
        label: 'TotalBet 25倍以上'
      },
      {
        value: 2,
        label: 'TotalBet 10倍以上'
      },
      {
        value: 3,
        label: 'FG'
      },
      {
        value: 4,
        label: 'CardFG'
      },
      {
        value: 5,
        label: '指定轉輪帶位置'
      },
      {
        value: 6,
        label: 'forceJP'
      }
    ],
    '0003': [
      {
        value: -1,
        label: '無'
      },
      {
        value: 30,
        label: '單 3 右'
      },
      {
        value: 31,
        label: '雙 3 左'
      },
      {
        value: 32,
        label: '單 4 左'
      },
      {
        value: 33,
        label: '雙 4 右'
      }
    ],
    '0004': [
      {
        value: -1,
        label: '無'
      },
      {
        value: 30,
        label: '單 3 右'
      },
      {
        value: 31,
        label: '雙 3 左'
      },
      {
        value: 32,
        label: '單 4 左'
      },
      {
        value: 33,
        label: '雙 4 右'
      },
      {
        value: 40,
        label: 'Hit 寶箱'
      }
    ] };

  private optionsGame: { value: string; label: string }[] = [
    {
      value: '0001',
      label: '放炮去'
    },
    {
      value: '0002',
      label: '財神來了'
    },
    {
      value: '0003',
      label: '牛逼足球'
    },
    {
      value: '0004',
      label: '鼠來寶'
    }
  ];

  private agentIDs : Array<{ value: string; label: string }> = [];

  private async onSubmit() {
    this.listLoading = true
    let check = true
    let message = ''
    const memberID = `${this.form.memberID}@${this.form.agentID}`
    let data2 = {
      memberID: `${this.form.memberID}@${this.form.agentID}`,
      gameID: this.form.gameID,
      forceBingo: {}
    }
    // if (this.form.selectData === 3) {
    //   data.forceBingo = {
    //     bet: 1,
    //     reelBet: 25,
    //     forceType: this.form.selectData,
    //     debugStrip: this.form.debugStrip
    //   }
    // }

    if (this.form.agentID === '') {
      check = false
      message += '<font color="red">AgentID</font> is null<br> '
    }

    if (this.form.memberID === '') {
      check = false
      message += '<font color="red">MemberID</font> is null<br> '
    }

    if (this.form.gameID === '') {
      check = false
      message += '<font color="red">gameID</font> is null <br>'
    }

    if (this.form.selectData === -1) {
      check = false
      message += `<font color="red">forceType</font> is null<br>
    `
    }

    if (this.form.selectData === 5) {
      data2.forceBingo = {
        forceType: this.form.selectData,
        debugStrip: this.form.debugStrip
      }
    } else if (this.form.selectData === 6) {
      data2.forceBingo = {
        forceType: this.form.selectData,
        forceJP: this.checkedJP[0]
      }
    } else {
      data2.forceBingo = {
        forceType: this.form.selectData
      }
    }
    if (check) {
      const { data } = await forceBingo(data2)
      const { message } = data
      if (message === 'success') {
        this.$notify({
          title: '送獎',
          dangerouslyUseHTMLString: true,
          type: 'success',
          message: '成功'
        })
      } else {
        this.$notify({
          title: '送獎',
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: '失敗'
        })
      }
      this.listLoading = false
    } else {
      this.$notify({
        title: '送獎',
        dangerouslyUseHTMLString: true,
        type: 'error',
        message
      })
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    }
  }

  private handleSelectGame(val:any) {
    this.options = this.GameOptions[val]
    // 預設選項零
    this.form.selectData = this.options[0].value
  }

  private handleCheckAllChange(val: any) {
    this.isIndeterminate = false
    this.checkedJP = val ? this.JP : []
  }

  private handleCheckedCitiesChange(value: any) {
    let checkedCount = value.length
    this.checkAll = checkedCount === this.JP.length
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.JP.length
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

  created() {
    // Get AgentID
    this.getAgentList()
  }
}
</script>
<style lang="scss">
// cover element's css avoid the nested error style
.show {
  padding-top: 2%;
  padding-right: 3%;
  padding-bottom: 0.3%;
  margin-left: 10%;
  margin-bottom: 5%;
  border-style: inset;
  border-radius: 10px;
  border: 5px;
}
.showJP {
  padding-top: 2%;
  padding-right: 3%;
  padding-bottom: 0.3%;
  margin-left: 10%;
  margin-bottom: 5%;
  border-style: inset;
  border-radius: 10px;
  border: 5px;
}
.app-container {
  margin-left: auto;
  margin-right: auto;
}
.el-form-item__label {
  color: #175ba9;
}
.a {
  display: inline-block;
  height: 50px;
}
</style>
