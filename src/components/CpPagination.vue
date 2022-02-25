<template>
  <div class="xtx-pagination">
    <!-- 如果当前页大于1 表示有上一页 渲染上一页数据 -->
    <a
      href="javascript:"
      v-if="currentPage > 1"
      @click="currentPage = currentPage - 1"
    >
      <LeftOutlined />
    </a>
    <!-- 如果显示着的开始页码大于1 表示前面还有页码 渲染... -->
    <span v-if="pageInfo.start > 1">...</span>
    <a
      href="javascript:"
      v-for="item in pageInfo.pageButtons"
      :key="item"
      @click="currentPage = item"
      :class="{ active: item === currentPage }"
    >
      {{ item }}
    </a>
    <!-- 如果显示着的结束页码小于总页数 表示后面还有页码 渲染... -->
    <span v-if="pageInfo.end < pageInfo.totalPage">...</span>
    <!-- 如果当前页小于总页数 表示还有下一页 渲染下一页按钮 -->
    <a
      href="javascript:"
      v-if="currentPage < pageInfo.totalPage"
      @click="currentPage = currentPage + 1"
    >
      <RightOutlined />
    </a>
  </div>
</template>

<script>
import { computed } from "vue";
import { useVModel } from "@vueuse/core";
import { RightOutlined, LeftOutlined } from "@ant-design/icons-vue";
export default {
  name: "CpPagination",
  components: { RightOutlined, LeftOutlined },
  props: {
    // 当前页
    page: {
      type: Number,
      default: 1,
    },
    // 总数据条数
    counts: {
      type: Number,
      default: 0,
    },
    // 每页显示数据条数
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  setup(props, { emit }) {
    // 当前页
    const currentPage = useVModel(props, "page", emit);
    // 总数据条数
    const totalCount = computed(() => props.counts);
    // 每页显示数据条数
    const pageSize = computed(() => props.pageSize);
    // 页面中显示的页码个数
    // 当数据比较多时 会有很多页数据 不能一次性将所有页码展示出来 用户体验不好
    // 当数据比较少时 如果页码数量小于页面中规定的要显示的页码数量 此时有多少页码就显示多少页码
    const pageButtonNumber = 5;
    // 根据页码个数计算偏移量
    const pageOffset = Math.floor(pageButtonNumber / 2);
    // 当前页发生变化时重新计算页码(用户点击更新页码时)
    // 总数据条数发生变化时重新计算总页数(筛选条件发生变化时)
    // 所以页码的计算及范围限制需要通过计算属性返回
    const pageInfo = computed(() => {
      // 计算在页面中显示着的开始页码和结束页码 根据他们遍历生成页码 并将页码存储在数组中进行返回
      // start: 当前页码-偏移量
      let start = currentPage.value - pageOffset;
      // 显示着的结束页码不能使用当前页码+偏移量 比如: 当前页: 5, 页面显示页码个数: 6, 偏移量: 3 => [2, 3, 4, 5, 6, 7, 8], 结果就是页码范围溢出
      let end = start + pageButtonNumber - 1;
      // 计算总页数
      let totalPage = Math.ceil(totalCount.value / pageSize.value);
      // 显示着的开始页码限制
      if (start < 1) {
        // 如果开始显示着的页码小于1 让它等于1
        start = 1;
        // 重新计算显示着的结束页码 计算完成之后要判断它是否大于了总页数
        // 如果重新计算的显示着的结束页码大于了总页数 让它等于总页数
        // 如果重新计算的显示着的结束页码没有大于总页数 就让它等于重新计算的显示着的结束页码
        let tmp = start + pageButtonNumber - 1;
        end = tmp > totalPage ? totalPage : tmp;
      }
      // 显示着的结束页码限制
      if (end > totalPage) {
        end = totalPage;
        let tmp = end - pageButtonNumber + 1;
        start = tmp < 1 ? 1 : tmp;
      }
      // 用于存储页码值
      let pageButtons = [];
      // 遍历生成页码值
      for (let i = start; i <= end; i++) {
        // 存储页码值
        pageButtons.push(i);
      }
      // 返回分页相关信息
      return { pageButtons, start, end, totalPage };
    });
    return { pageInfo, currentPage };
  },
};
</script>

<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
    color: #d46b08;
    &:hover {
      border-color: #ff7300;
    }
    &.active {
      background: #ff7300;
      color: #fff;
      border-color: #ffd591;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
