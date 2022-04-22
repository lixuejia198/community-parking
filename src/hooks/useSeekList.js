import { ref, watch } from "vue";
import { getSeeklist } from "@/api";
// 获取寻找车位列表数据
export function useSeekList({ page = 1, pageSize }) {
  // 寻找车位列表
  const seekList = ref(null);
  // 寻找车位列表总数量
  const seekListCount = ref(0);
  // 寻找车位列表分页参数
  const seekParams = ref({
    // 当前页
    page: page,
    // 每页显示多少条数据
    pageSize: pageSize,
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
