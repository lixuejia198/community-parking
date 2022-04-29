// 获取车位数据
import { ref } from "vue";
import { getCarport } from "@/api/carport";

export function useCarportList() {
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
    carportList.value = [];
    return [];
  };

  return {
    carportList,
    getData,
  };
}
