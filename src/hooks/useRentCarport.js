import { ref } from "vue";
import { getCarportRentTime } from "@/api/carport";

export function useRentCarport() {
  // 车位列表
  const rentCarportList = ref([]);
  // 根据 车位id 获取车位信息
  const getData = async ({ pid }) => {
    const data = await getCarportRentTime({ pid }).catch((error) => {
      console.log(error);
    });
    console.log(data, "data");
    // 如果返回的状态码为200(不过得先判断data是否为undefined)
    if (data?.status === 200) {
      // 存储用户车位信息
      rentCarportList.value = data.data;
      return data.data;
    }
    return [];
  };

  return {
    rentCarportList,
    getData,
  };
}
