import { ref } from "vue";
import { getCarportSeekTime } from "@/api/car";

export function useSeekCarport() {
  // 车辆列表
  const seekCarportList = ref([]);
  // 根据 车辆id 获取车位信息
  const getData = async ({ cid }) => {
    const data = await getCarportSeekTime({ cid }).catch((error) => {
      console.log(error);
    });
    console.log(data, "data");
    // 如果返回的状态码为200(不过得先判断data是否为undefined)
    if (data?.status === 200) {
      // 存储用户车辆信息
      seekCarportList.value = data.data;
      return data.data;
    }
    return [];
  };

  return {
    seekCarportList,
    getData,
  };
}
