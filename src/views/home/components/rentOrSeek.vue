<template>
  <div class="rentOrSeek-list">
    <div class="rentOrSeek-list-title">
      <h3>{{ title.titleContent }}</h3>
      <span @click="hhh">{{ title.titleButton }}</span>
    </div>
    <div class="rentOrSeek-list-content">
      <slot name="item" />
    </div>
    <slot name="pagination" />
  </div>
  <a-modal
    v-model:visible="visible"
    title="温馨提示"
    cancelText="取消"
    okText="确定"
    @ok="handleOk"
  >
    <div
      v-for="catpor in catportList"
      :key="catpor.id"
      class="modal-com-item"
      :class="{
        active: selectCarport.id === catpor.id,
      }"
      @click="selectCarportList(catpor)"
    >
      <p>ID:{{ catpor.id }}</p>
      <p>车位编码：{{ catpor.pname }}</p>
      <p>所在花园：{{ catpor.comname }}</p>
      <p>地址：{{ catpor.place }}</p>
    </div>
  </a-modal>
</template>

<script>
import { ref } from "vue";
import { getCarport } from "@/api";

export default {
  name: "rentOrSeek",
  props: {
    title: {
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

    const { catportList, getData } = useCarport();
    const hhh = () => {
      console.log("hhh");
      showModel();
      getData(1);
    };

    // 选中的车位
    const selectCarport = ref({});

    // 选中车位
    const selectCarportList = (carport) => {
      selectCarport.value =
        selectCarport.value.id === carport.id ? {} : carport;
    };

    return {
      hhh,
      visible,
      showModel,
      handleOk,
      catportList,
      selectCarport,
      selectCarportList,
    };
  },
};

// 获取车位数据
const useCarport = () => {
  const catportList = ref([]);

  const getData = (uid) => {
    // 用户登录
    getCarport({ uid })
      .then((data) => {
        console.log(data, "data");
        // 如果返回的状态码为200
        if (data.status === 200) {
          catportList.value = data.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return {
    catportList,
    getData,
  };
};
</script>

<style scoped lang="less">
.rentOrSeek-list {
  padding: 15px 0;
  height: 100%;
  .rentOrSeek-list-title {
    display: flex;
    justify-content: space-between;
    padding: 0 10px 10px;
    height: 50px;
    border-bottom: 1px solid #ccc;
    h3 {
      line-height: 38px;
    }
    span {
      color: #d46b08;
      background: #fff7e6;
      border: 1px solid #ffd591;
      width: 74px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
  }
  .rentOrSeek-list-content {
    padding: 10px;
    // background-color: #edf2f7;
    height: calc(100% - 130px);
    // 超出范围垂直显示滚动条(auto是溢出才显示滚动条)
    overflow-y: auto;
  }
}

.modal-com-item {
  border-bottom: 2px solid #dfdfdf;
  box-shadow: 0 6.1px 2px rgba(0, 0, 0, 0.025),
    0 10.6px 6.7px rgba(0, 0, 0, 0.036), 0 25px 30px rgba(0, 0, 0, 0.06);
  width: 100%;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 10px;

  &:hover {
    background-color: #fff7e6;
    border: 1px solid #ffd591;
    color: #000;
  }
}

.active {
  background-color: #d46b08;
  border: 1px solid #ffd591;
  color: #fff;
}
</style>
