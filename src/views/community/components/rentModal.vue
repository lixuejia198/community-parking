<template>
  <a-modal
    :visible="visible"
    title="请选择你要共享的车位"
    cancelText="取消"
    okText="确定"
    @ok="handleOkRent"
    @cancel="handleCancel"
  >
    <div
      v-for="carport in userCarportList"
      :key="carport.id"
      class="modal-com-item"
      :class="{
        active: selectCarport.id === carport.id && carport.state === 0,
        disabled: carport.state === 1,
      }"
      @mouseenter="(e) => e.target.classList.add('hover')"
      @mouseleave="(e) => e.target.classList.remove('hover')"
      @click="selectCarportList(carport)"
    >
      <p>ID：{{ carport.id }}</p>
      <p>小区：{{ carport.comname }}</p>
      <p>地址：{{ carport.place }}</p>
      <div class="modal-com-name">
        {{ carport.pname }}
      </div>
    </div>
    <div class="modal-com-form">
      <a-range-picker
        dropdownClassName="hied-ant-picker-time-panel-cell-disabled"
        v-show="selectCarport.id"
        :placeholder="['开始时间', '结束时间']"
        :showTime="{
          defaultValue: [
            dayjs(dayjs().startOf('day'), 'mm:ss'),
            dayjs(dayjs().endOf('day'), 'mm:ss'),
          ],
        }"
        :disabledDate="rentDisableDate"
        :disabledTime="rentDisabledRangeTime"
        showToday
        @ok="onRangeOk"
      />
    </div>
  </a-modal>
</template>

<script>
import { ref } from "vue";
import dayjs from "dayjs";
import { useRentCarport } from "@/hooks/useRentCarport";
import { computeDisabledTime } from "@/utils/computeDisabledTime";
import { rentCarportApi } from "@/api/carport";

export default {
  name: "rentModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    toggleVisible: {
      type: Function,
      default: () => {},
    },
    userCarportList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    // 共享车位时间
    const rentTime = ref({ startTime: "", endTime: "" });
    // 最大可选结束时间
    let maxSelectEndDate = null;
    // 共享车位禁用日期
    const rentDisableDate = (current) => {
      return (
        current &&
        (current < dayjs().startOf("day") ||
          (maxSelectEndDate && current > dayjs(maxSelectEndDate).add(1, "day")))
      );
    };
    // 查询车位被被共享的时间
    const { rentCarportList, getData: getRentCarportList } = useRentCarport();
    // 当前选择的开始时间
    let currentStartDate = dayjs();
    // 共享车位禁用时间
    const rentDisabledRangeTime = (current, type) => {
      const { startDate, maxEndDate, disabled } = computeDisabledTime(
        rentCarportList.value,
        current,
        type,
        currentStartDate
      );
      if (startDate && type === "start") {
        currentStartDate = startDate;
      }
      maxSelectEndDate = maxEndDate;
      return current && disabled;
    };
    // 共享车位日期选择确定回调
    const onRangeOk = (value) => {
      rentTime.value.startTime = value[0]?.format("YYYY-MM-DD HH:mm:ss");
      rentTime.value.endTime = value[1]?.format("YYYY-MM-DD HH:mm:ss");
    };
    // 点击出租车位共享弹框的确定按钮的回调事件
    const handleOkRent = () => {
      // 查询车位已被共享时间
      rentCarportApi({
        starttime: rentTime.value.startTime,
        endtime: rentTime.value.endTime,
        comid: selectCarport.value.comid,
        pid: selectCarport.value.id,
      }).then((result) => {
        console.log(result);
        if (result.status === 200) {
          // 清空选中的时间
          rentTime.value.startTime = "";
          rentTime.value.endTime = "";
          // 关闭弹框
          props.toggleVisible(false);
        }
      });
    };
    // 关闭弹框
    const handleCancel = () => {
      // 清空选中的时间
      rentTime.value.startTime = "";
      rentTime.value.endTime = "";
      // 关闭弹框
      props.toggleVisible(false);
    };
    // 选中的车位
    const selectCarport = ref({});
    // 选中车位
    const selectCarportList = (carport) => {
      // 如果当前选中的车位和上次选中的车位一样
      if (carport.id === selectCarport.value.id) {
        // 就取消选中
        selectCarport.value = {};
      } else if (carport.id !== selectCarport.value.id && carport.state === 0) {
        // 清空选中的时间
        rentTime.value.startTime = "";
        rentTime.value.endTime = "";
        // 如果当前车位未被选中并且车位不处于禁用状态则选中
        selectCarport.value = carport;
        // 获取车位被共享的时间
        getRentCarportList({ pid: carport.id });
      }
    };

    return {
      dayjs,
      rentTime,
      rentDisableDate,
      rentDisabledRangeTime,
      onRangeOk,
      handleOkRent,
      handleCancel,
      selectCarport,
      selectCarportList,
    };
  },
};
</script>

<style scoped lang="less">
.modal-com-item {
  border-bottom: 2px solid #dfdfdf;
  box-shadow: 0 6.1px 2px rgba(0, 0, 0, 0.025),
    0 10.6px 6.7px rgba(0, 0, 0, 0.036), 0 25px 30px rgba(0, 0, 0, 0.06);
  width: 100%;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 10px;
  position: relative;
  .modal-com-name {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 60px;
    color: #ff7300;
    opacity: 0.4;
    // 设置文字无法选中
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
.hover {
  background-color: #fff7e6;
  border: 1px solid #ffd591;
  color: #000;
}
.active {
  background-color: #ff7300;
  border: 1px solid #ffd591;
  color: #fff;
  .modal-com-name {
    color: #fff;
  }
}
.disabled {
  background-color: #eee;
  border: 1px solid #999;
  color: #000;
  cursor: not-allowed;
}
</style>
