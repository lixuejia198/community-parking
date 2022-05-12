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
        active: selectCarport.id === carport.id,
        disabled:
          carport.starttime && carport.endtime ? isCarDisabled(carport) : false,
      }"
      @mouseenter="(e) => e.target.classList.add('hover')"
      @mouseleave="(e) => e.target.classList.remove('hover')"
      @click="selectUserCarport(carport)"
    >
      <p>ID：{{ carport.id }}</p>
      <p>小区：{{ carport.comname }}</p>
      <p>地址：{{ carport.place }}</p>
      <div class="modal-com-name">
        {{ carport.pname }}
      </div>
    </div>
  </a-modal>
</template>

<script>
import dayjs from "dayjs";
import { ref } from "vue";
import { shareCarportApi } from "@/api/carport";
import { message } from "ant-design-vue";

export default {
  name: "rentItemModal",
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
    currentCar: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    // 选中的车位
    const selectCarport = ref({});
    // 选中车辆
    const selectUserCarport = (carport) => {
      // 判断当前选中的车位是否与上次选中的相同
      if (selectCarport.value.id === carport.id) {
        selectCarport.value = {};
      } else if (!isCarDisabled(carport)) {
        selectCarport.value = carport;
      }
    };
    // 判断车辆是否禁用
    const isCarDisabled = (carport) => {
      return (
        (dayjs(carport.starttime) >= dayjs(props.currentCar.starttime) &&
          dayjs(carport.starttime) <= dayjs(props.currentCar.endtime)) ||
        (dayjs(carport.endtime) >= dayjs(props.currentCar.starttime) &&
          dayjs(carport.endtime) <= dayjs(props.currentCar.endtime)) ||
        (dayjs(carport.starttime) <= dayjs(props.currentCar.starttime) &&
          dayjs(carport.endtime) >= dayjs(props.currentCar.endtime))
      );
    };

    // 点击弹框的确定按钮的回调事件
    const handleOkRent = () => {
      shareCarportApi({
        id: props.currentCar.id,
        comid: selectCarport.value.comid,
        pid: selectCarport.value.id,
      }).then((result) => {
        if (result.status === 200) {
          props.toggleVisible(false);
          message.success(result.msg);
        } else {
          message.error(result.msg);
        }
      });
    };
    // 点击弹框取消按钮或关闭弹框的回调时间
    const handleCancel = () => {
      // 关闭弹框
      props.toggleVisible(false);
    };

    return {
      selectCarport,
      selectUserCarport,
      isCarDisabled,
      handleOkRent,
      handleCancel,
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
