<template>
  <div class="community">
    <!--  用户登录信息  -->
    <TopNav />
    <!--  小区模块内容  -->
    <div class="community-content">
      <!-- 基于three.js的停车车位模型 -->
      <div class="three-canvas community-left" ref="threeRef"></div>
      <!-- 出租车位 -->
      <div class="community-center">
        <rent-or-seek :title="rentTitle">
          <template v-slot:button>
            <span class="rentlist-title-button" @click="rentCarport">
              {{ rentTitle.titleButton }}
            </span>
          </template>
          <template v-slot:item>
            <rent-item v-for="rent in rentList" :key="rent.id" :rent="rent">
              <template v-slot:itemButton>
                <span class="rentlist-item-button">我想使用</span>
              </template>
            </rent-item>
          </template>
          <template v-slot:pagination>
            <CpPagination
              :pageSize="rentParams.pageSize"
              v-model:page="rentParams.page"
              :counts="rentListCount"
            />
          </template>
        </rent-or-seek>
      </div>
      <!-- 寻找车位 -->
      <div class="community-right">
        <rent-or-seek :title="seekTitle">
          <template v-slot:button>
            <span class="seeklist-title-button" @click="seekCarport">
              {{ seekTitle.titleButton }}
            </span>
          </template>
          <template v-slot:item>
            <seek-item v-for="seek in seekList" :key="seek.id" :seek="seek">
              <template v-slot:itemButton>
                <span class="seeklist-item-button">我要共享</span>
              </template>
            </seek-item>
          </template>
          <template v-slot:pagination>
            <CpPagination
              :pageSize="seekParams.pageSize"
              v-model:page="seekParams.page"
              :counts="seekListCount"
            />
          </template>
        </rent-or-seek>
      </div>
    </div>
  </div>
  <!-- 出租车位弹框 -->
  <a-modal
    v-model:visible="rentVisible"
    title="请选择你要共享的车位"
    cancelText="取消"
    okText="确定"
    @ok="handleOkRent"
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
      <div class="model-com-name">
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
  <!-- 寻找车位弹框 -->
  <a-modal
    v-model:visible="seekVisible"
    title="请选择你所需要车位的车"
    cancelText="取消"
    okText="确定"
    @ok="handleOkSeek"
  >
    <div
      v-for="carInfo in userCarList"
      :key="carInfo.id"
      class="modal-com-item"
      :class="{
        active: selectCarInfo.id === carInfo.id && carInfo.pid === null,
        disabled: carInfo.pid !== null,
      }"
      @mouseenter="(e) => e.target.classList.add('hover')"
      @mouseleave="(e) => e.target.classList.remove('hover')"
      @click="selectUserCarList(carInfo)"
    >
      <p>ID：{{ carInfo.id }}</p>
      <p>车牌号：{{ carInfo.cname }}</p>
      <div class="model-com-name">
        {{ carInfo.cname }}
      </div>
    </div>
  </a-modal>
</template>

<script>
import RentOrSeek from "@/views/community/components/rentOrSeek";
import { onMounted, ref } from "vue";
import RentItem from "@/views/community/components/rentItem";
import SeekItem from "@/views/community/components/seekItem";
import CpPagination from "@/components/CpPagination";
import { rentCarportApi } from "@/api/carport";
import { message } from "ant-design-vue";
import { getUserInfo } from "@/utils/getUserInfo";
import { useTEngine } from "@/hooks/useTEngine";
import { useCarModel } from "@/hooks/useCar";
import { Color } from "three";
import { useCarportModel } from "@/hooks/useCarport";
import { useRentList } from "@/hooks/useRentList";
import { useSeekList } from "@/hooks/useSeekList";
import TopNav from "@/components/TopNav";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import { useRentCarport } from "@/hooks/useRentCarport";
import { useCarList } from "@/hooks/useCarList";
import { useCarportList } from "@/hooks/useCarportList";
import { computeDisabledTime } from "@/utils/computeDisabledTime";

export default {
  name: "Community",
  components: {
    TopNav,
    CpPagination,
    SeekItem,
    RentItem,
    RentOrSeek,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    // 小区ID
    const comid = route.query.comid;
    // 如果没有小区ID 跳转到首页
    if (!comid) {
      message.error("请选择小区");
      return router.push("/");
    }

    const userInfo = ref(getUserInfo());
    // 关于出租车位列表
    const { rentList, rentListCount, rentParams } = useRentList({
      pageSize: 5,
    });
    // 出租车位列表标题
    const rentTitle = ref({
      titleContent: "正在出租车位",
      titleButton: "我要共享",
    });
    // 关于寻找车位列表
    const { seekList, seekListCount, seekParams } = useSeekList({
      pageSize: 5,
    });
    // 寻找车位列表标题
    const seekTitle = ref({
      titleContent: "正在寻找车位",
      titleButton: "我想使用",
    });
    // 控制弹框的显示与隐藏
    const rentVisible = ref(false);
    const seekVisible = ref(false);
    // 关于用户车位信息列表
    const { carportList: userCarportList, getData: getCarportData } =
      useCarportList();
    // 点击我要共享按钮 显示车位信息弹框
    const rentCarport = async () => {
      await getCarportData({ uid: userInfo.value.id });
      // 如果用户拥有车位
      if (userCarportList.value.length !== 0 && userInfo.value.id) {
        // 显示弹框
        rentVisible.value = true;
      } else if (userCarportList.value.length === 0 && userInfo.value.id) {
        // 如果用户已经登录并且没有车位 提示相关警告信息
        message.warning("您还没有车位！");
      } else {
        // 如果用户没有登录 提示相关警告信息
        message.warning("您还没有登录或者登录失效！");
      }
    };

    // 共享车位时间
    const rentTime = ref({
      startTime: "",
      endTime: "",
    });
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

    const onRangeOk = (value) => {
      console.log("onOk: ", value);
      rentTime.value.startTime = value[0]?.format("YYYY-MM-DD HH:mm:ss");
      rentTime.value.endTime = value[1]?.format("YYYY-MM-DD HH:mm:ss");
    };
    // 点击出租车位共享弹框的确定按钮的回调事件
    const handleOkRent = (e) => {
      console.log("handleOkRent===", e, selectCarport.value, rentTime.value);
      rentCarportApi({
        starttime: rentTime.value.startTime,
        endtime: rentTime.value.endTime,
        comid: selectCarport.value.comid,
        pid: selectCarport.value.id,
      }).then((result) => {
        console.log(result);
      });
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
        // 如果当前车位未被选中并且车位不处于禁用状态则选中
        selectCarport.value = carport;
        // 获取车位被共享的时间
        getRentCarportList({ pid: carport.id });
      }
    };
    // 关于用户车辆列表
    const { carList: userCarList, getData: getCarData } = useCarList();
    // 点击我要使用按钮 显示车辆弹框
    const seekCarport = () => {
      getCarData({ uid: userInfo.value.id });
      seekVisible.value = true;
    };
    // 点击寻找车位共享弹框的确定按钮的回调事件
    const handleOkSeek = (e) => {
      console.log(e);
    };
    // 选中的车
    const selectCarInfo = ref({});
    // 选中需要车位的车
    const selectUserCarList = (carInfo) => {
      // 如果当前选中的车和上次选中的车一样
      if (carInfo.id === selectCarInfo.value.id) {
        // 就取消选中
        selectCarInfo.value = {};
      } else if (
        // 如果当前车未被选中并且不处于禁用状态则选中
        carInfo.id !== selectCarInfo.value.id &&
        carInfo.pid === null
      ) {
        selectCarInfo.value = carInfo;
      }
    };
    // 获取车位数据
    getCarportData({ comid }).then((result) => {
      if (result.length <= 0) {
        message.warning("该小区暂未开放，敬请期待……");
        return router.push("/");
      }

      result.forEach((item) => {
        // 渲染车位模型
        const carportGroup = useCarportModel(item.pname);
        // 设置车位位置
        carportGroup.position.set(item.x, item.y, item.z);
        if (item.direction) {
          // 设置车位方向
          carportGroup.rotateY(Math.PI / item.direction);
          // 设置车位位置
          // carportGroup.position.set(item.x * 500, item.y * 200, item.z * 200);
        } else {
          // 设置车位位置
          // carportGroup.position.set(item.x * 200, item.y * 200, item.z * 500);
        }
        TE.addObject(carportGroup);
      });
    });
    // 获取车辆信息
    getCarData({ comid }).then((result) => {
      result.forEach(async (item) => {
        const color =
          item.color ||
          `#${((Math.random() * 0x1000000) << 0).toString(16)}00000`.slice(
            0,
            7
          );
        console.log(item.id, "color:", color);
        // 渲染汽车模型
        const carGroup = await useCarModel({
          car: { name: "car-red" },
          groupScale: 80,
          color: new Color(color),
        });
        // 设置车辆位置
        carGroup.position.set(item.x, item.y, item.z);
        if (item.direction) {
          // 设置车辆方向
          carGroup.rotateY(Math.PI / item.direction);
        }
        // 添加货物到场景中
        TE.addObject(carGroup);
      });
    });
    // three 绑定的元素
    const threeRef = ref(null);
    // 实例化的 ThreeJS 引擎
    let TE = null;
    // DOM 渲染完成后执行
    onMounted(() => {
      TE = useTEngine(threeRef.value);
      // 自动调整渲染器大小
      window.onresize = () =>
        (() => {
          // 设置正投影相机大小
          TE.setOrthographicCameraSize(
            threeRef.value.clientWidth,
            threeRef.value.clientHeight
          );
        })();
    });

    return {
      rentTitle,
      seekTitle,
      seekParams,
      rentParams,
      rentList,
      rentListCount,
      seekListCount,
      seekList,
      rentCarport,
      rentVisible,
      handleOkRent,
      userCarportList,
      selectCarport,
      selectCarportList,
      threeRef,
      seekVisible,
      handleOkSeek,
      seekCarport,
      userCarList,
      selectCarInfo,
      selectUserCarList,
      onRangeOk,
      rentDisableDate,
      rentDisabledRangeTime,
      dayjs,
    };
  },
};
</script>

<style scoped lang="less">
.community {
  height: 100%;
  .community-content {
    height: calc(100% - 50px);
    position: relative;
    .community-left {
      position: absolute;
      left: 0;
      width: 60%;
      height: 100%;
      //background-color: aquamarine;
    }
    .community-center {
      position: absolute;
      left: 60%;
      right: 20%;
      width: 20%;
      height: 100%;
      a {
        display: inline-block;
        color: #d46b08;
        width: 100%;
        height: 100%;
      }
      .rentlist-title-button {
        color: #d46b08;
        background: #fff7e6;
        border: 1px solid #ffd591;
        width: 74px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
      .rentlist-item-button {
        font-size: 14px;
        padding: 8px;
        background-color: rgba(255, 115, 0, 1);
        color: white;
        cursor: pointer;
      }
    }
    .community-right {
      position: absolute;
      right: 0;
      width: 20%;
      height: 100%;
      border-left: 1px solid #ccc;
      box-sizing: border-box;
      a {
        display: inline-block;
        color: #d46b08;
        width: 100%;
        height: 100%;
      }
      .seeklist-title-button {
        color: #d46b08;
        background: #fff7e6;
        border: 1px solid #ffd591;
        width: 74px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
      .seeklist-item-button {
        font-size: 14px;
        padding: 8px;
        background-color: rgba(255, 115, 0, 1);
        color: white;
        cursor: pointer;
      }
    }
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
  position: relative;
  .model-com-name {
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
  .model-com-name {
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
