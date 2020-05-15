<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      label-width="180px"
    >
      <el-form-item label="CDN">
        <el-radio-group
          v-model="form.id"
          @change="onCDNChanged"
        >
          <el-radio
            v-for="cdn in cdnConfigs"
            :key="cdn.id"
            :label="cdn.id"
          >
            {{ cdn.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推流服务器地址">
        <el-input v-model="form.pushUrl" />
      </el-form-item>

      <el-form-item label="播流服务器地址">
        <el-input v-model="form.playUrl" />
      </el-form-item>

      <el-form-item
        v-show="form.cdn === '阿里云'"
        label="阿里云直播鉴权KEY"
      >
        <el-input v-model="form.authKey" />
      </el-form-item>

      <el-form-item
        v-show="form.cdn === '阿里云'"
        label="阿里云播流鉴权有效时长"
      >
        <el-input v-model="form.authTimeout" />
      </el-form-item>

      <el-form-item
        v-show="form.cdn === '网宿'"
        label="网宿AppName"
      >
        <el-input v-model="form.appName" />
      </el-form-item>

      <el-form-item
        v-show="form.cdn === '腾讯云'"
        label="直播appid"
      >
        <el-input v-model="form.appName" />
      </el-form-item>

      <el-form-item
        v-show="form.cdn === '腾讯云'"
        label="直播bizid"
      >
        <el-input v-model="form.appName" />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          儲存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { PrivateConfigModule } from '@/store/modules/liveCDN/privateConfig'
import { LiveCDNModule, CDNConfig } from '@/store/modules/liveCDN/liveCDN'

@Component({
  name: 'private_config'
})
export default class extends Vue {
  private form: {
    id: number;
    cdn: string;
    authKey: string;
    authTimeout: number | null;
    pushUrl: string;
    playUrl: string;
    appName: string;
    appid: string;
    bizid: string;
  } = {
    id: -1,
    cdn: '',
    authKey: '',
    authTimeout: null,
    pushUrl: '',
    playUrl: '',
    appName: '',
    appid: '',
    bizid: ''
  };

  private cdnConfigs: CDNConfig[] = [];

  beforeCreate() {
    PrivateConfigModule.GetPrivateConfig().then(() => {
      this.form.id = PrivateConfigModule.liveCDNId
      this.form.cdn = PrivateConfigModule.name
      this.form.authKey = PrivateConfigModule.authKey
      this.form.authTimeout = PrivateConfigModule.authTimeout
      this.form.pushUrl = PrivateConfigModule.pushUrl
      this.form.playUrl = PrivateConfigModule.playUrl
      this.form.appName = PrivateConfigModule.appName
      this.form.appid = PrivateConfigModule.appid
      this.form.bizid = PrivateConfigModule.bizid
    })

    LiveCDNModule.GetCDNs().then(() => {
      this.cdnConfigs = LiveCDNModule.cdnConfigs
    })
  }

  @Watch('form')
  private onFormDataChanged(value: any) {
    console.log('form data changed!!!')
  }

  private onSubmit() {
    // 一次更新多組設定
    PrivateConfigModule.UpdatePrivateConfig({
      liveCDNId: this.form.id,
      authKey: this.form.authKey,
      authTimeout: (!this.form.authTimeout || Number.isNaN(this.form.authTimeout) || this.form.authTimeout.toString() === '') ? null : this.form.authTimeout,
      pushUrl: this.form.pushUrl,
      playUrl: this.form.playUrl,
      appName: this.form.appName,
      appid: this.form.appid,
      bizid: this.form.bizid
    })

    let selectedCDNIndex = this.cdnConfigs.findIndex(cdn => cdn.id === this.form.id)
    this.$message('更新成功!')
    this.updateFormDataToConfig(selectedCDNIndex)
  }

  private onCDNChanged(key: number) {
    let selectedCDNIndex = this.cdnConfigs.findIndex(cdn => cdn.id === key)
    this.form.cdn = this.cdnConfigs[selectedCDNIndex].name
    this.form.authKey = this.cdnConfigs[selectedCDNIndex].authKey
    this.form.authTimeout = this.cdnConfigs[selectedCDNIndex].authTimeout
    this.form.playUrl = this.cdnConfigs[selectedCDNIndex].playUrl
    this.form.pushUrl = this.cdnConfigs[selectedCDNIndex].pushUrl
    this.form.appName = this.cdnConfigs[selectedCDNIndex].appName
    this.form.bizid = this.cdnConfigs[selectedCDNIndex].bizid
  }

  private updateFormDataToConfig(index: number) {
    this.cdnConfigs[index].authKey = this.form.authKey
    this.cdnConfigs[index].authTimeout = this.form.authTimeout
    this.cdnConfigs[index].pushUrl = this.form.pushUrl
    this.cdnConfigs[index].playUrl = this.form.playUrl
    this.cdnConfigs[index].appName = this.form.appName
    this.cdnConfigs[index].appid = this.form.appid
    this.cdnConfigs[index].bizid = this.form.bizid
  }
}
</script>

<style lang="scss" scoped>
.line {
  text-align: center;
}
</style>
