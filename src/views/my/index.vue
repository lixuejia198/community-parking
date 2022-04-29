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
        <a-radio-button value="history" @click="carportValue = 'history'">
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
        <div class="my-left-carport-add" @click="isShowCarportForm = true">
          <span class="horizontal"></span>
          <span class="vertical"></span>
        </div>
      </div>
      <div class="my-left-carport-history" v-show="carportValue === 'history'">
        历史记录
      </div>
    </div>
    <!--  用户车位车辆添加表单  -->
    <div class="my-center-operation">
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
      <a-empty
        description="可以点击加号添加车位或车辆哦"
        v-show="!isShowCarportForm"
      />
      <!--  用户添加车辆表单  -->
      <a-form></a-form>
    </div>
    <!--  用户车辆信息   -->
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
        <a-radio-button value="history" @click="carValue = 'history'">
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
              当前状态：{{ car.state === null ? "没有车位" : "有车位" }}
            </span>
            <span v-if="car.pname !== null">所在车位编号：{{ car.pname }}</span>
          </div>
          <!--          <div class="carport-place">-->
          <!--            <span>-->
          <!--              位置：{{ carport.province }}{{ carport.city }}{{ carport.area }}-->
          <!--              <span class="definite">{{ carport.place }}</span>-->
          <!--            </span>-->
          <!--          </div>-->
        </div>
        <div class="my-right-car-add">
          <span class="horizontal"></span>
          <span class="vertical"></span>
        </div>
      </div>
      <div class="my-right-car-history" v-show="carValue === 'history'">
        历史记录
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
import { userBindCarportApi } from "@/api/carport";
import { message } from "ant-design-vue";

export default {
  name: "My",
  setup() {
    const userInfo = ref(getUserInfo());
    const carportValue = ref("carport");
    // 关于用户车位信息列表(用户车位)
    const { carportList, getData: getCarportData } = useCarportList();
    getCarportData({ uid: userInfo.value.id });
    const carValue = ref("car");
    // 关于用户车辆信息列表
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
    };
  },
};
</script>

<style scoped lang="less">
.my {
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
      padding-top: 10%;
    }
  }
  .my-center-operation {
    width: 40%;
    //background-color: #adff2f59;
    padding: 30px 30px 0;
    .carport-form-list {
      .carport-form-list-item {
        cursor: pointer;
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
        height: 780px;
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
