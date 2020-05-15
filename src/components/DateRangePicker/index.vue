<template>
  <div>
    <el-date-picker
      v-model="syncStartDate"
      type="date"
      :placeholder="$t('datePicker.startDate')"
      :picker-options="pickerOptionsStart"
    />
    <el-date-picker
      v-model="syncDueDate"
      type="date"
      class="datePicker"
      :placeholder="$t('datePicker.dueDate')"
      :picker-options="pickerOptionsDue"
    />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  PropSync,
  Model,
  Watch,
  Emit
} from 'vue-property-decorator'

@Component({
  name: 'DateRangePicker'
})
export default class extends Vue {
  @PropSync('startDate', { type: Date, default: () => undefined }) private syncStartDate!: Date;
  @PropSync('dueDate', { type: Date, default: () => undefined })
  syncDueDate!: Date;

  private pickerOptionsStart = {
    disabledDate: (time: Date) => {
      if (this.syncStartDate !== undefined) {
        // @ts-ignore
        return time.getTime() > Date.now() || time.getTime() > this.dueDate
      } else {
        return time.getTime() > Date.now()
      }
    }
  };
  private pickerOptionsDue = {
    disabledDate: (time: Date) => {
      // @ts-ignore
      return time.getTime() < this.startDate || time.getTime() > Date.now()
    }
  };

  @Emit()
  private checkboxChanged(value: boolean) {
    return value
  }
}
</script>

<style scoped>
.datePicker {
  margin-left: 10px;
}
</style>
