<template>
  <a-modal
    :visible="visible"
    title="请选择你所需要车位的车"
    cancelText="取消"
    okText="确定"
    @ok="handleOkSeek"
    @cancel="handleCancel"
  >
    <div
      v-for="car in userCarList"
      :key="car.id"
      class="modal-com-item"
      :class="{ active: selectCar.id === car.id }"
      @mouseenter="(e) => e.target.classList.add('hover')"
      @mouseleave="(e) => e.target.classList.remove('hover')"
      @click="selectUserCarList(car)"
    >
      <p>ID：{{ car.id }}</p>
      <p>车牌号：{{ car.cname }}</p>
      <div class="modal-com-name">
        {{ car.cname }}
      </div>
    </div>
    <div class="modal-com-form">
      <a-range-picker
        dropdownClassName="hied-ant-picker-time-panel-cell-disabled"
        v-show="selectCar.id"
        :placeholder="['开始时间', '结束时间']"
        :showTime="{
          defaultValue: [
            dayjs(dayjs().startOf('day'), 'mm:ss'),
            dayjs(dayjs().endOf('day'), 'mm:ss'),
          ],
        }"
        :disabledDate="seekDisableDate"
        :disabledTime="seekDisabledRangeTime"
        showToday
        @ok="onRangeOk"
      />
    </div>
  </a-modal>
</template>

<script>
import { ref } from "vue";
import dayjs from "dayjs";
import { useSeekCarport } from "@/hooks/useSeekCarport";
import { computeDisabledTime } from "@/utils/computeDisabledTime";
import { seekCarportApi } from "@/api/car";

export default {
  name: "seekModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    toggleVisible: {
      type: Function,
      default: () => {},
    },
    userCarList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    // 寻找车位时间
    const seekTime = ref({ startTime: "", endTime: "" });
    // 最大可选结束时间
    let maxSelectEndDate = null;
    // 寻找车位禁用日期
    const seekDisableDate = (current) => {
      return (
        current &&
        (current < dayjs().startOf("day") ||
          (maxSelectEndDate && current > dayjs(maxSelectEndDate).add(1, "day")))
      );
    };
    // 查询车辆被使用共享车位的时间
    const { seekCarportList, getData: getSeekCarportList } = useSeekCarport();
    // 当前选择的开始时间
    let currentStartDate = dayjs();
    // 寻找车辆禁用时间
    const seekDisabledRangeTime = (current, type) => {
      const { startDate, maxEndDate, disabled } = computeDisabledTime(
        seekCarportList.value,
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
    // 寻找车位日期选择确定回调
    const onRangeOk = (value) => {
      seekTime.value.startTime = value[0]?.format("YYYY-MM-DD HH:mm:ss");
      seekTime.value.endTime = value[1]?.format("YYYY-MM-DD HH:mm:ss");
    };
    // 点击寻找车位共享弹框的确定按钮的回调事件
    const handleOkSeek = () => {
      // 查询车位已被共享时间
      seekCarportApi({
        starttime: seekTime.value.startTime,
        endtime: seekTime.value.endTime,
        cid: selectCar.value.id,
      }).then((result) => {
        console.log(result);
        if (result.status === 200) {
          // 清空选中的时间
          seekTime.value.startTime = "";
          seekTime.value.endTime = "";
          // 关闭弹框
          props.toggleVisible(false);
        }
      });
    };
    // 关闭弹框
    const handleCancel = () => {
      // 清空选中的时间
      seekTime.value.startTime = "";
      seekTime.value.endTime = "";
      // 关闭弹框
      props.toggleVisible(false);
    };
    // 选中的车位
    const selectCar = ref({});
    // 选中车位
    const selectUserCarList = (car) => {
      // 如果当前选中的车位和上次选中的车位一样
      if (car.id === selectCar.value.id) {
        // 就取消选中
        selectCar.value = {};
      } else {
        // 清空选中的时间
        seekTime.value.startTime = "";
        seekTime.value.endTime = "";
        // 如果当前车位未被选中则选中
        selectCar.value = car;
        // 获取车位被共享的时间
        getSeekCarportList({ cid: car.id });
      }
    };

    return {
      dayjs,
      seekTime,
      seekDisableDate,
      seekDisabledRangeTime,
      onRangeOk,
      handleOkSeek,
      handleCancel,
      selectCar,
      selectUserCarList,
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
