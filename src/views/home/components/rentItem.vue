<template>
  <div class="rentOrSeek-list-content-item">
    <div class="rentOrSeek-list-content-number">
      <h3>{{ rent.name }}</h3>
      <span @click="showModel">{{ listButton }}</span>
    </div>
    <a-row class="rentOrSeek-list-content-state">
      <a-col :span="3"><span>状态</span></a-col>
      <a-col :span="21">
        <p>{{ rent.state === 0 ? "空闲" : "使用中" }}</p>
      </a-col>
    </a-row>
    <a-row class="rentOrSeek-list-content-time">
      <a-col :span="3"><span>时间</span></a-col>
      <a-col :span="21">
        <p>
          可使用时间为{{ new Date(rent.starttime).toLocaleString() }}-
          {{ new Date(rent.endtime).toLocaleString() }}
        </p>
      </a-col>
    </a-row>
    <a-row class="rentOrSeek-list-content-place">
      <a-col :span="3"><span>位置</span></a-col>
      <a-col :span="21">
        <p>{{ rent.comname }}({{ rent.place }})</p>
      </a-col>
    </a-row>
  </div>
  <a-modal
    v-model:visible="visible"
    title="温馨提示"
    cancelText="取消"
    okText="确定"
    @ok="handleOk"
  >
    <p>您确定要使用这个车位吗？</p>
  </a-modal>
</template>

<script>
import { ref } from "vue";

export default {
  name: "rentItem",
  props: {
    listButton: {
      type: String,
    },
    rent: {
      type: Object,
    },
  },
  setup() {
    // 控制弹框的显示与隐藏
    const visible = ref(false);
    // 显示弹框
    const showModel = () => {
      visible.value = true;
    };
    // 点击弹框的确定按钮的回调事件
    const handleOk = (e) => {
      console.log(e);
    };

    return {
      visible,
      showModel,
      handleOk,
    };
  },
};
</script>

<style scoped lang="less">
.rentOrSeek-list-content-item {
  border-bottom: 1px solid #dfdfdf;
  padding-top: 10px;
  box-shadow: 0 6.1px 2px rgba(0, 0, 0, 0.025),
    0 10.6px 6.7px rgba(0, 0, 0, 0.036), 0 25px 30px rgba(0, 0, 0, 0.06);
  border-radius: 15px;
  margin-bottom: 10px;
  background-color: white;
  .rentOrSeek-list-content-number {
    display: flex;
    justify-content: space-between;
    height: 40px;
    padding: 0 10px;
    margin-bottom: 10px;
    h3 {
      font-weight: bold;
      font-size: 18px;
      line-height: 40px;
    }
    span {
      font-size: 14px;
      padding: 8px;
      background-color: rgba(255, 115, 0, 1);
      color: white;
      cursor: pointer;
    }
  }
  .rentOrSeek-list-content-state,
  .rentOrSeek-list-content-time,
  .rentOrSeek-list-content-place {
    margin-bottom: 10px;
    padding-left: 8px;
    span {
      background-color: rgb(255, 85, 0);
      color: white;
      padding: 1px;
      display: inline-block;
    }
    p {
      padding: 2px 0;
      margin: 0;
    }
  }
  .rentOrSeek-list-content-time {
    span {
      background-color: rgb(45, 183, 245);
    }
  }
  .rentOrSeek-list-content-place {
    span {
      background-color: rgb(135, 208, 104);
    }
  }
}
</style>
