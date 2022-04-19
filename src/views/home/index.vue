<template>
  <div class="home">
    <!--  用户登录信息  -->
    <div class="login-info">
      <ul>
        <template v-if="userInfo.id">
          <li>
            <RouterLink to="/my" style="color: #333333">
              <UserOutlined />{{ userInfo.username }}
            </RouterLink>
          </li>
          <li @click="loginOut">退出登录</li>
        </template>
        <template v-else>
          <li>
            <RouterLink style="color: #333333" to="/login">请先登录</RouterLink>
          </li>
        </template>
      </ul>
    </div>
    <!--  首页内容  -->
    <div class="home-content">
      <!-- 基于three.js的停车车位模型 -->
      <div class="three-canvas home-left" ref="threeRef"></div>
      <!-- 出租车位 -->
      <div class="home-center">
        <rent-or-seek :title="rentTitle">
          <template v-slot:button>
            <span class="rentlist-button" @click="rentCarport">
              {{ rentTitle.titleButton }}
            </span>
          </template>
          <template v-slot:item>
            <rent-item
              list-button="我想使用"
              v-for="rent in rentList"
              :key="rent.id"
              :rent="rent"
            />
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
      <div class="home-right">
        <rent-or-seek :title="seekTitle">
          <template v-slot:button>
            <span class="seeklist-button" @click="seekCarport">
              {{ seekTitle.titleButton }}
            </span>
          </template>
          <template v-slot:item>
            <seek-item
              list-button="我要共享"
              v-for="seek in seekList"
              :key="seek.id"
              :seek="seek"
            />
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
      v-for="carport in carportList"
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
      <p>所在花园：{{ carport.comname }}</p>
      <p>地址：{{ carport.place }}</p>
      <div class="model-com-name">
        {{ carport.pname }}
      </div>
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
import RentOrSeek from "@/views/home/components/rentOrSeek";
import { onMounted, ref, watch } from "vue";
import RentItem from "@/views/home/components/rentItem";
import SeekItem from "@/views/home/components/seekItem";
import CpPagination from "@/components/CpPagination";
import { getRentlist, getSeeklist } from "@/api";
import { getCarport } from "@/api/carport";
import { getCar } from "@/api/car";
import { UserOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { getUserInfo } from "@/utils/getUserInfo";
import { useRouter } from "vue-router";
import { useTEngine } from "@/hooks/useTEngine";
import { useCarModel } from "@/hooks/useCar";
import { Color } from "three";
import { useCarportModel } from "@/hooks/useCarport";

export default {
  name: "Home",
  components: { CpPagination, SeekItem, RentItem, RentOrSeek, UserOutlined },
  setup() {
    const userInfo = ref(getUserInfo());
    const router = useRouter();
    // 出租车位列表标题
    const rentTitle = ref({
      titleContent: "正在出租车位",
      titleButton: "我要共享",
    });
    // 寻找车位列表标题
    const seekTitle = ref({
      titleContent: "正在寻找车位",
      titleButton: "我想使用",
    });
    // 关于出租车位列表
    const { rentList, rentListCount, rentParams } = useRentList();
    // 关于寻找车位列表
    const { seekList, seekListCount, seekParams } = useSeekList();
    // 关于车位列表
    const { carportList, getData } = useCarportList();
    // 关于车辆列表
    const { getCarData } = useCarList();
    // 退出登录
    const loginOut = () => {
      window.localStorage.removeItem("community-parking");
      router.push("/login");
    };
    // 控制弹框的显示与隐藏
    const rentVisible = ref(false);
    const seekVisible = ref(false);
    // 关于用户车位信息列表
    const { carportList: userCarportList, getData: getUserData } =
      useCarportList();
    // 点击我要共享按钮 显示车位信息弹框
    const rentCarport = async () => {
      await getUserData({ uid: userInfo.value.id });
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
    // 关于用户车辆列表
    const { carList: userCarList, getCarData: getUserCarData } = useCarList();
    // 点击我要使用按钮 显示车辆弹框
    const seekCarport = async () => {
      await getUserCarData(userInfo.value.id);
      seekVisible.value = true;
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
      }
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
    // 点击出租车位共享弹框的确定按钮的回调事件
    const handleOkRent = (e) => {
      console.log(e);
    };
    // 点击寻找车位共享弹框的确定按钮的回调事件
    const handleOkSeek = (e) => {
      console.log(e);
    };
    // three 绑定的元素
    const threeRef = ref(null);
    // 实例化的 ThreeJS 引擎
    let TE = null;
    // DOM 渲染完成后执行
    onMounted(() => {
      TE = useTEngine(threeRef.value);

      // 自动调整渲染器大小
      window.onresize = () => {
        return (() => {
          // 设置正投影相机大小
          TE.setOrthographicCameraSize(
            document.body.clientWidth,
            document.body.clientHeight
          );
        })();
      };

      // 获取车位数据
      getData({ comid: 1 }).then((result) => {
        result.forEach((item) => {
          // 渲染车位模型
          const carportGroup = useCarportModel();
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
      getCarData({ comid: 1 }).then((result) => {
        result.forEach(async (item) => {
          // 渲染汽车模型
          const carGroup = await useCarModel({
            car: { name: "car-red" },
            groupScale: 80,
            color: new Color(
              `#${((Math.random() * 0x1000000) << 0).toString(16)}00000`.slice(
                0,
                7
              )
            ),
          });
          // 设置车辆位置
          carGroup.position.set(item.x, item.y, item.z);
          if (item.direction) {
            // 设置车辆方向
            carGroup.rotateY(Math.PI / item.direction);
          }
          console.log("carGroup", carGroup);
          // 添加货物到场景中
          TE.addObject(carGroup);
        });
      });
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
      carportList,
      userCarportList,
      selectCarport,
      selectCarportList,
      userInfo,
      loginOut,
      threeRef,
      seekVisible,
      handleOkSeek,
      seekCarport,
      userCarList,
      selectCarInfo,
      selectUserCarList,
    };
  },
};
// 获取出租车位列表数据
function useRentList() {
  // 出租车位列表
  const rentList = ref(null);
  // 出租车位列表总数量
  const rentListCount = ref(0);
  // 出租车位列表分页参数
  const rentParams = ref({
    // 当前页
    page: 1,
    // 每页显示多少条数据
    pageSize: 5,
  });
  // 获取出租车位列表数据
  const getData = () => {
    getRentlist({
      page: rentParams.value.page,
      limit: rentParams.value.pageSize,
    }).then((data) => {
      // console.log(data, "data");
      if (data.status === 200) {
        // 存储出租车位列表数据
        rentList.value = data.data;
        // 存储总数量
        rentListCount.value = data.total;
      }
    });
  };
  // 监听请求参数的变化
  watch(
    rentParams.value,
    () => {
      getData();
    },
    // 初始调用 默认不会初始调用 设为true便会初始调用一次
    {
      immediate: true,
    }
  );
  return {
    rentListCount,
    rentList,
    rentParams,
  };
}
// 获取寻找车位列表数据
function useSeekList() {
  // 寻找车位列表
  const seekList = ref(null);
  // 寻找车位列表总数量
  const seekListCount = ref(0);
  // 寻找车位列表分页参数
  const seekParams = ref({
    // 当前页
    page: 1,
    // 每页显示多少条数据
    pageSize: 5,
  });
  // 获取寻找车位列表数据
  const getData = () => {
    getSeeklist({
      page: seekParams.value.page,
      limit: seekParams.value.pageSize,
    }).then((data) => {
      // console.log(data, "data");
      if (data.status === 200) {
        // 存储寻找车位列表数据
        seekList.value = data.data;
        // 存储总数量
        seekListCount.value = data.total;
      }
    });
  };
  // 监听请求参数的变化
  watch(
    seekParams.value,
    () => {
      getData();
    },
    // 初始调用 默认不会初始调用 设为true便会初始调用一次
    {
      immediate: true,
    }
  );
  return {
    seekList,
    seekListCount,
    seekParams,
  };
}
// 获取车位数据
function useCarportList() {
  // 车位列表
  const carportList = ref([]);
  // 根据用户id 获取车位信息
  const getData = async ({ uid, comid }) => {
    const data = await getCarport({ uid, comid }).catch((error) => {
      console.log(error);
    });
    console.log(data, "data");
    // 如果返回的状态码为200(不过得先判断data是否为undefined)
    if (data?.status === 200) {
      // 存储用户车位信息
      carportList.value = data.data;
      return data.data;
    }
    return [];
  };

  return {
    carportList,
    getData,
  };
}
// 获取车辆数据
function useCarList() {
  // 车信息列表
  const carList = ref([]);
  // 根据用户id 获取车信息
  const getCarData = async ({ uid, comid }) => {
    const data = await getCar({ uid, comid }).catch((error) => {
      console.log(error);
    });
    console.log(data, "data");
    // 如果返回的状态码为200(不过得先判断data是否为undefined)
    if (data?.status === 200) {
      // 存储用户车辆
      carList.value = data.data;
      return data.data;
    }
    return data.data;
  };

  return {
    carList,
    getCarData,
  };
}
</script>

<style scoped lang="less">
.home {
  height: 100%;
  .login-info {
    height: 50px;
    border-bottom: 1px solid #ccc;
    ul {
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0;
      margin: 0;
      li {
        list-style: none;
        padding: 0 20px 0 6px;
        border-left: 2px solid #ff7300;
        font-size: 16px;
      }
    }
  }
  .home-content {
    height: calc(100% - 50px);
    position: relative;
    .home-left {
      position: absolute;
      left: 0;
      width: 60%;
      height: 100%;
      //background-color: aquamarine;
    }
    .home-center {
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
      .rentlist-button {
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
    .home-right {
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
      .seeklist-button {
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
