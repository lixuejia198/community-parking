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
      :class="{
        active: selectCar.id === car.id,
        disabled: car.starttime && car.endtime ? isCarportDisabled(car) : false,
      }"
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
  </a-modal>
</template>

<script>
import { ref } from "vue";
import dayjs from "dayjs";
import { useCarportApi } from "@/api/carport";
import { message } from "ant-design-vue";

export default {
  name: "seekItemModal",
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
    currentCarport: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    // 选中的车辆
    const selectCar = ref({});
    // 选中车位
    const selectUserCarList = (car) => {
      // 如果当前选中的车位和上次选中的车位一样
      if (car.id === selectCar.value.id) {
        // 就取消选中
        selectCar.value = {};
      } else if (!isCarportDisabled(car)) {
        // 如果当前车位未被选中则选中
        selectCar.value = car;
      }
    };
    // 判断车位是否禁用
    const isCarportDisabled = (car) => {
      return (
        (dayjs(car.starttime) >= dayjs(props.currentCarport.starttime) &&
          dayjs(car.starttime) <= dayjs(props.currentCarport.endtime)) ||
        (dayjs(car.endtime) >= dayjs(props.currentCarport.starttime) &&
          dayjs(car.endtime) <= dayjs(props.currentCarport.endtime)) ||
        (dayjs(car.starttime) <= dayjs(props.currentCarport.starttime) &&
          dayjs(car.endtime) >= dayjs(props.currentCarport.endtime))
      );
    };

    // 点击寻找车位共享弹框的确定按钮的回调事件
    const handleOkSeek = () => {
      useCarportApi({
        id: props.currentCarport.id,
        cid: selectCar.value.id,
      }).then((result) => {
        if (result.status === 200) {
          props.toggleVisible(false);
          message.success(result.msg);
        } else {
          message.error(result.msg);
        }
      });
    };
    // 关闭弹框
    const handleCancel = () => {
      // 关闭弹框
      props.toggleVisible(false);
    };

    return {
      dayjs,
      selectCar,
      selectUserCarList,
      handleOkSeek,
      handleCancel,
      isCarportDisabled,
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
