// 获取车辆数据
import { ref } from "vue";
import { getCar } from "@/api/car";

export function useCarList() {
  // 车信息列表
  const carList = ref([]);
  // 根据用户id 获取车信息
  const getData = async ({ uid, comid }) => {
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
    carList.value = [];
    return [];
  };

  return {
    carList,
    getData,
  };
}
