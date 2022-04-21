import { ref, watch } from "vue";
import { getRentlist } from "@/api";
// 获取出租车位列表数据
export function useRentList() {
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
