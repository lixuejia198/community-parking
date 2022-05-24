<template>
  <div class="my">
    <!--   用户车位信息  -->
    <div class="my-left-carport">
      <a-radio-group
        v-model:value="carportValue"
        button-style="solid"
        size="large"
        class="my-left-carport-radio"
      >
        <a-radio-button value="carport" @click="carportValue = 'carport'">
          我的车位
        </a-radio-button>
        <a-radio-button value="history" @click="getCarportLogByUid">
          历史记录
        </a-radio-button>
      </a-radio-group>
      <div class="my-left-carport-content" v-show="carportValue === 'carport'">
        <div
          class="my-left-carport-item"
          v-for="carport in carportList"
          :key="carport.id"
        >
          <h3 class="carport-number">
            车位编号：<span>{{ carport.pname }}</span>
          </h3>
          <div class="carport-info">
            <span>当前状态：{{ carport.state === 0 ? "空闲" : "使用中" }}</span>
            <span>所在小区：{{ carport.comname }}</span>
          </div>
          <div class="carport-place">
            <span>
              位置：{{ carport.province }}{{ carport.city }}{{ carport.area }}
              <span class="definite">{{ carport.place }}</span>
            </span>
          </div>
        </div>
        <div class="my-left-carport-add" @click="changeCarportForm">
          <span class="horizontal"></span>
          <span class="vertical"></span>
        </div>
      </div>
      <div class="my-left-carport-history" v-show="carportValue === 'history'">
        <div class="my-left-carport-history-content">
          <rent-item
            v-for="carportLog in carportLogData"
            :key="carportLog.id"
            :rent="carportLog"
          />
        </div>
      </div>
    </div>
    <!--  用户车位车辆添加表单  -->
    <div class="my-center-operation">
      <!--      <a-empty-->
      <!--        description="可以点击加号添加车位或车辆哦"-->
      <!--        v-show="!isShowCarportForm && !isShowCarForm"-->
      <!--      />-->
      <div class="empty" v-show="!isShowCarportForm && !isShowCarForm">
        <img src="/images/box.png" alt="" />
        <p>可以点击“ + ”添加车位或车辆哦</p>
      </div>
      <!--  用户添加车位表单  -->
      <a-form
        name="carport-form"
        :model="carportFormState"
        v-show="isShowCarportForm"
      >
        <a-form-item label="省市区" name="proCityArea">
          <!--  级联选择框  -->
          <a-cascader
            v-model:value="carportFormState.proCityArea"
            :options="options"
            placeholder="请选择"
            @change="onProCityAreaChange"
            :style="{ marginLeft: '8px', width: '60%' }"
          />
        </a-form-item>
        <a-form-item label="小区" name="community">
          <a-tag
            v-for="item in selectCommunity"
            :key="item.id"
            :style="{ fontSize: '14px', padding: '5px', cursor: 'pointer' }"
            :color="
              carportFormState.community === item.id ? '#d46b08' : 'orange'
            "
            @click="onCommunityTagChange(item.id)"
          >
            {{ item.comname }}
          </a-tag>
        </a-form-item>
        <a-form-item label="车位编号" name="carportId">
          <a-list
            item-layout="horizontal"
            :data-source="allCarportList"
            class="carport-form-list"
          >
            <template #renderItem="{ item }">
              <a-badge-ribbon
                :text="
                  item.uid !== userInfo.id && item.uid !== null
                    ? '已占用'
                    : '已拥有'
                "
                :color="
                  item.uid !== userInfo.id && item.uid !== null
                    ? 'orange'
                    : '#87d068'
                "
                :style="{
                  opacity:
                    carportList.findIndex(
                      (carport) => carport.id === item.id
                    ) !== -1 || item.uid !== null
                      ? 1
                      : 0,
                }"
              >
                <a-popconfirm
                  title="你确定要添加该车位吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  placement="bottomRight"
                  @confirm="carportBindUser"
                  @cancel="onCancelSelectedCarport"
                >
                  <a-list-item
                    class="carport-form-list-item"
                    @click="onCarportSelected(item.id)"
                    :class="{
                      active: carportFormState.carportId === item.id,
                      disabled:
                        carportList.findIndex(
                          (carport) => carport.id === item.id
                        ) !== -1 ||
                        (item.uid !== null && item.uid !== userInfo.id),
                    }"
                  >
                    <a-list-item-meta>
                      <template #description>
                        地址：<span>{{ item.place }}</span>
                        当前状态：
                        <span>
                          {{ item.state === 0 ? "空闲" : "使用中" }}
                        </span>
                      </template>
                      <template #title>
                        <span>{{ item.pname }}</span>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </a-popconfirm>
              </a-badge-ribbon>
            </template>
          </a-list>
        </a-form-item>
      </a-form>
      <!--  用户添加车辆表单  -->
      <a-form
        name="car-form"
        :rules="carFormRules"
        :model="carFormState"
        v-show="isShowCarForm"
        @finish="carFormFinish"
      >
        <a-form-item label="车牌号" name="cname">
          <a-input v-model:value="carFormState.cname" />
        </a-form-item>
        <a-form-item label="车颜色" name="color">
          <!--          <a-input v-model:value="carFormState.color" />-->
          <div class="car-form-color">
            <span v-for="c in carColorList" :key="c.id">
              <i
                :style="{ backgroundColor: c.color }"
                :class="{ active: c.color === currentCarColor }"
                @click="carColorSelected(c.color)"
              ></i>
            </span>
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 4 }">
          <a-button type="primary" html-type="submit">添加车辆</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!--  用户车辆信息  -->
    <div class="my-right-car">
      <a-radio-group
        v-model:value="carValue"
        button-style="solid"
        size="large"
        class="my-right-car-radio"
      >
        <a-radio-button value="car" @click="carValue = 'car'">
          我的车辆
        </a-radio-button>
        <a-radio-button value="history" @click="getCarLogByUid">
          历史记录
        </a-radio-button>
      </a-radio-group>
      <div class="my-right-car-content" v-show="carValue === 'car'">
        <div class="my-right-car-item" v-for="car in carList" :key="car.id">
          <h3 class="car-number">
            车牌号：<span>{{ car.cname }}</span>
          </h3>
          <div class="car-info">
            <span>
              当前状态：{{ car.pid === null ? "没有车位" : "有车位" }}
            </span>
            <span v-if="car.pname !== null">所在车位编号：{{ car.pname }}</span>
          </div>
        </div>
        <div class="my-right-car-add" @click="changeCarForm">
          <span class="horizontal"></span>
          <span class="vertical"></span>
        </div>
      </div>
      <div class="my-right-car-history" v-show="carValue === 'history'">
        <div class="my-right-car-history-content">
          <seek-item
            v-for="carLog in carLogData"
            :key="carLog.id"
            :seek="carLog"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCarportList } from "@/hooks/useCarportList";
import { computed, ref } from "vue";
import { getUserInfo } from "@/utils/getUserInfo";
import { useCarList } from "@/hooks/useCarList";
import { getCommunityList } from "@/api";
import { userBindCarportApi, getCarportLogApi } from "@/api/carport";
import { message } from "ant-design-vue";
import { checkCarName } from "@/utils/validator";
import { addCarByUserIDApi, getCarLogApi } from "@/api/car";
import SeekItem from "@/views/community/components/seekItem";
import RentItem from "@/views/community/components/rentItem";

export default {
  name: "My",
  components: { RentItem, SeekItem },
  setup() {
    const userInfo = ref(getUserInfo());
    // 控制车位列表与车位日志切换
    const carportValue = ref("carport");
    // 关于用户车位信息列表(用户车位)
    const { carportList, getData: getCarportData } = useCarportList();
    getCarportData({ uid: userInfo.value.id });
    // 控制车辆列表与车辆日志切换
    const carValue = ref("car");
    // 关于用户车辆信息列表(用户车辆)
    const { carList, getData: getCarData } = useCarList();
    getCarData({ uid: userInfo.value.id });
    // 关于用户车位表单数据
    const carportFormState = ref({
      //  省市区id
      proCityArea: [],
      //  小区id
      community: "",
      //  车位id
      carportId: "",
    });
    // 级联选择框数据(所有小区数据)
    const options = ref([]);
    // 获取所有小区列表数据
    getCommunityList({}).then((data) => {
      // console.log(data, "data");
      // 存储所有小区数据
      options.value = data.data;
    });
    // 当前区id
    let currentAreaId = ref(null);
    // 省市区对应的小区
    const selectCommunity = ref([]);
    // 小区列表数据
    const communityListData = computed(() => {
      const result = [];
      options.value.forEach((province) => {
        province?.children?.forEach((city) => {
          city?.children?.forEach((area) => {
            result.push(...area.list);
          });
        });
      });
      return result;
    });
    // 当级联选择框选择完成后的回调
    const onProCityAreaChange = (value) => {
      // 存储当前区id
      currentAreaId.value = value[value.length - 1];
      // 根据当前区id筛选出对应的小区数据
      selectCommunity.value = communityListData.value.filter(
        (item) => item.area_id === currentAreaId.value
      );
      // console.log(selectCommunity.value);
    };
    // 关于用户车位信息(所有车位)
    const { carportList: allCarportList, getData: getAllCarport } =
      useCarportList();
    // 点击tag标签时的回调
    const onCommunityTagChange = (id) => {
      carportFormState.value.community = id;
      getAllCarport({ comid: id });
      // console.log(allCarportList, "allCarportList");
    };
    // 点击车位列表项时的回调
    const onCarportSelected = (id) => {
      carportFormState.value.carportId = id;
      // console.log(carportFormState.value, "carportFormState");
    };
    // 点击气泡确认框取消按钮的回调
    const onCancelSelectedCarport = () => {
      carportFormState.value.carportId = "";
    };
    // 点击气泡确认框确定按钮的回调
    const carportBindUser = () => {
      // console.log(carportFormState.value, "carportFormState");
      console.log(userInfo.value.id);
      userBindCarportApi({
        pid: carportFormState.value.carportId,
        uid: userInfo.value.id,
      }).then((data) => {
        console.log(data, "data");
        if (data.status === 200) {
          getCarportData({ uid: userInfo.value.id });
          message.success("添加车位成功");
        }
      });
    };
    // 控制用户添加车位表单的显示与隐藏
    const isShowCarportForm = ref(false);
    const changeCarportForm = () => {
      isShowCarportForm.value = true;
      isShowCarForm.value = false;
    };
    // 给定车的颜色
    const carColorList = ref([
      { id: 1, color: "#b7ef72" },
      { id: 2, color: "#ae7ab3" },
      { id: 3, color: "#825fe5" },
      { id: 4, color: "#e2b991" },
      { id: 5, color: "#5ec5e2" },
      { id: 6, color: "#a28082" },
      { id: 7, color: "#5cbca9" },
      { id: 8, color: "#1b76fa" },
      { id: 9, color: "#eda530" },
      { id: 10, color: "#fa904d" },
      { id: 11, color: "#f50" },
      { id: 12, color: "#fff" },
    ]);
    // 关于用户车辆表单数据
    const carFormState = ref({
      // 车牌号
      cname: "",
      // 车颜色
      color: "",
    });
    // 关于用户车辆表单校验规则
    const carFormRules = {
      cname: [{ required: true, validator: checkCarName, trigger: "change" }],
      color: [{ required: true, message: "请选择您的车颜色！" }],
    };
    // 用于存储当前用户车辆颜色
    const currentCarColor = ref("");
    // 点击用户车辆颜色项的回调
    const carColorSelected = (color) => {
      carFormState.value.color = color;
      currentCarColor.value = color;
      // console.log(currentCarColor.value);
      // console.log(carFormState.value, "carFormState");
    };
    // 控制用户添加车辆表单的显示与隐藏
    const isShowCarForm = ref(false);
    const changeCarForm = () => {
      isShowCarForm.value = true;
      isShowCarportForm.value = false;
    };
    // 提交用户添加车辆表单且数据验证成功后回调事件
    const carFormFinish = (values) => {
      // console.log(values);
      addCarByUserIDApi({
        uid: userInfo.value.id,
        cname: values.cname,
        color: values.color,
      }).then((data) => {
        if (data.status === 200) {
          // 提示信息
          message.success(data.msg);
          // 清空表单内容
          carFormState.value = { cname: "", color: "" };
          // 取消当前车颜色项的选中
          currentCarColor.value = "";
          // 刷新用户车辆列表
          getCarData({ uid: userInfo.value.id });
        }
        if (data.status === 0) {
          message.success(data.msg);
        }
      });
    };
    // 用于存储车辆日志数据
    const carLogData = ref([]);
    // 点击车辆历史记录 查询车辆日志
    const getCarLogByUid = () => {
      carValue.value = "history";
      getCarLogApi({ uid: userInfo.value.id }).then((data) => {
        console.log(data);
        if (data.status === 200) {
          carLogData.value = data.data;
        }
      });
    };
    // 用于存储车位日志数据
    const carportLogData = ref([]);
    // 点击车位历史记录 查询车位日志
    const getCarportLogByUid = () => {
      carportValue.value = "history";
      getCarportLogApi({ uid: userInfo.value.id }).then((data) => {
        console.log(data);
        if (data.status === 200) {
          carportLogData.value = data.data;
        }
      });
    };

    return {
      userInfo,
      carportValue,
      carportList,
      carValue,
      carList,
      carportFormState,
      options,
      onProCityAreaChange,
      selectCommunity,
      onCommunityTagChange,
      allCarportList,
      onCarportSelected,
      onCancelSelectedCarport,
      carportBindUser,
      isShowCarportForm,
      changeCarportForm,
      carFormState,
      carFormRules,
      carColorList,
      changeCarForm,
      isShowCarForm,
      carColorSelected,
      currentCarColor,
      carFormFinish,
      getCarLogByUid,
      carLogData,
      getCarportLogByUid,
      carportLogData,
      carportListHeight: computed(() => window.innerHeight - 250),
    };
  },
};
</script>

<style scoped lang="less">
.my {
  overflow: hidden;
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    /*高宽分别对应横竖滚动条的尺寸*/
    width: 0;
    /* height: 4px; */
  }
  //::-webkit-scrollbar-thumb {
  //  /*滚动条里面小方块*/
  //  border-radius: 5px;
  //  -webkit-box-shadow: inset 0 0 5px rgba(212, 107, 8, 0.7);
  //  background: rgba(212, 107, 8, 0.2);
  //}
  height: 100%;
  display: flex;
  .my-left-carport,
  .my-right-car {
    position: relative;
    width: 30%;
    padding: 0.5% 2%;
    .my-left-carport-radio,
    .my-right-car-radio {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .my-left-carport-content,
    .my-right-car-content {
      margin-top: 50px;
      height: calc(100% - 50px);
      overflow-y: auto;
      .my-left-carport-item,
      .my-right-car-item {
        border: 2px solid #dfdfdf;
        border-radius: 15px;
        padding: 4%;
        background-color: #ffd591;
        margin-bottom: 10px;
        .carport-number,
        .car-number {
          span {
            font-weight: bold;
            font-size: 18px;
          }
        }
        .carport-info,
        .car-info {
          display: flex;
          font-size: 15px;
          span {
            width: 45%;
          }
        }
        .carport-place {
          font-size: 15px;
          margin-top: 10px;
          .definite {
            color: orangered;
            font-weight: bold;
          }
        }
      }
      .my-right-car-item {
        background-color: #a4daf5;
      }
      .my-left-carport-add,
      .my-right-car-add {
        position: relative;
        height: 138px;
        background-color: #ffd59161;
        border: 2px dashed #dfdfdf;
        border-radius: 15px;
        cursor: pointer;
        .horizontal,
        .vertical {
          position: absolute;
          display: inline-block;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          border-radius: 30px;
        }
        .horizontal {
          width: 100px;
          height: 5px;
        }
        .vertical {
          width: 5px;
          height: 100px;
        }
      }
      .my-right-car-add {
        background-color: #a4daf573;
        height: 96px;
        .horizontal {
          width: 65px;
          height: 5px;
        }
        .vertical {
          width: 5px;
          height: 65px;
        }
      }
    }
    .my-left-carport-history,
    .my-right-car-history {
      margin-top: 50px;
      height: 100%;
      .my-right-car-history-content,
      .my-left-carport-history-content {
        padding: 10px;
        // background-color: #edf2f7;
        height: calc(100% - 50px);
        // 超出范围垂直显示滚动条(auto是溢出才显示滚动条)
        overflow-y: auto;
      }
    }
  }
  .my-center-operation {
    width: 40%;
    margin: 30px 0;
    border-radius: 30px;
    border: 3px solid #ffd591;
    padding: 30px 30px 0;
    :deep(.ant-empty) {
      margin: 122px 8px 0;
    }
    .empty {
      text-align: center;
      padding-top: inherit;
      img {
        width: 256px;
      }
      p {
        margin-top: 10px;
        font-size: 16px;
      }
    }
    .car-form-color {
      display: flex;
      flex-wrap: wrap;
      span {
        width: 25%;
        height: 70px;
        display: flex;
        justify-content: space-around;
        i {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #ccc;
          &.active {
            box-shadow: 0 0 10px #40a9ff;
          }
        }
      }
    }
    .carport-form-list {
      height: 100%;
      .carport-form-list-item {
        cursor: pointer;
        background-color: #fff;
        &:hover {
          border-color: #d46b08;
        }
        &.active {
          background-color: blanchedalmond;
          border-color: #d46b08;
        }
        &.disabled {
          background-color: #eee;
          border: 1px solid #999;
          color: #000;
          pointer-events: none;
        }
      }
      :deep(.ant-list-items) {
        overflow-y: auto;
        height: calc(v-bind(carportListHeight) * 1px);
        width: 90%;
      }
      :deep(.ant-ribbon-wrapper) {
        width: calc(100% - 8px);
      }
      :deep(.ant-list-item) {
        border: 1px solid #ffd591;
        border-radius: 15px;
        margin-bottom: 5px;
        padding: 16px;
      }
    }
  }
}
</style>
