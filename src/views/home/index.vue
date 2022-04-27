<template>
  <div class="home">
    <div class="container">
      <!--  用户登录信息  -->
      <TopNav />
      <!--  轮播图和小区列表  -->
      <div class="home-banner">
        <!--  轮播图区域  -->
        <Carousel :carousels="banners" :autoPlay="true" />
        <!--  小区列表展示  -->
        <div class="home-community">
          <!--  级联选择框  -->
          <a-cascader
            v-model:value="value"
            :options="options"
            placeholder="请选择"
            @change="onChange"
            :style="{ marginLeft: '8px', width: '60%' }"
          />
          <!--  表格 -->
          <a-table
            :columns="communityListColumns"
            :data-source="
              communityListData.filter(
                (item) => !currentAreaId || item.area_id === currentAreaId
              )
            "
            :pagination="false"
            bordered
            :style="{ marginTop: '15px', padding: '5px' }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operation'">
                <span
                  class="operation-button"
                  @click="goToCommunity(record.id)"
                >
                  点击进入
                </span>
              </template>
            </template>
          </a-table>
        </div>
      </div>
      <!--  出租车位和寻找车位列表展示(具体功能在小区模块实现)  -->
      <div class="home-show">
        <!--  出租车位列表展示  -->
        <div class="home-show-rent">
          <rent-or-seek
            :title="{
              titleContent: '正在出租车位',
            }"
          >
            <template v-slot:item>
              <rent-item v-for="rent in rentList" :key="rent.id" :rent="rent" />
            </template>
          </rent-or-seek>
        </div>
        <!--  寻找车位列表展示  -->
        <div class="home-show-seek">
          <rent-or-seek
            :title="{
              titleContent: '正在寻找车位',
            }"
          >
            <template v-slot:item>
              <seek-item v-for="seek in seekList" :key="seek.id" :seek="seek">
              </seek-item>
            </template>
          </rent-or-seek>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav";
import Carousel from "@/components/Carousel";
import RentOrSeek from "@/views/community/components/rentOrSeek";
import RentItem from "@/views/community/components/rentItem";
import { useRentList } from "@/hooks/useRentList";
import { useSeekList } from "@/hooks/useSeekList";
import SeekItem from "@/views/community/components/seekItem";
import { computed, ref } from "vue";
import { getCommunityList } from "@/api";
import { useRouter } from "vue-router";

export default {
  components: { SeekItem, RentItem, RentOrSeek, Carousel, TopNav },
  setup() {
    // 获取路由对象
    const router = useRouter();
    // 轮播图数据
    const banners = [
      { id: 1, imgUrl: "/images/carousel_01.webp" },
      { id: 2, imgUrl: "/images/carousel_02.webp" },
      { id: 3, imgUrl: "/images/carousel_03.webp" },
    ];
    // 获取出租车位列表数据
    const { rentList } = useRentList({ pageSize: 20 });
    // 获取寻找车位列表数据
    const { seekList } = useSeekList({ pageSize: 20 });
    // 级联选择框数据(所有小区数据)
    const options = ref([
      {
        value: "",
        label: "全部",
        children: [
          {
            value: "",
            label: "全部",
            children: [
              {
                value: "",
                label: "全部",
                list: [],
              },
            ],
          },
        ],
      },
    ]);
    // 级联选择框数据的id
    const value = ref([]);
    // 获取所有小区列表数据
    getCommunityList({}).then((data) => {
      console.log(data, "data");
      // 存储所有小区数据
      options.value = [
        {
          value: "",
          label: "全部",
          children: [
            {
              value: "",
              label: "全部",
              children: [
                {
                  value: "",
                  label: "全部",
                  list: [],
                },
              ],
            },
          ],
        },
        ...data.data,
      ];
    });
    // 当前区id
    let currentAreaId = ref(null);
    // 所有小区列表表格体数据
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
    // 所有小区列表表格头数据
    const communityListColumns = [
      { title: "小区", dataIndex: "comname", width: "25%" },
      { title: "地址", dataIndex: "place" },
      { title: "操作", key: "operation", width: "25%" },
    ];
    // 当级联选择框选择完成后的回调
    const onChange = (value) => {
      // 存储当前区id
      currentAreaId.value = value[value.length - 1];
    };
    // 跳转到对用的小区页面
    const goToCommunity = (id) => {
      router.push(`/community?comid=${id}`);
    };

    return {
      banners,
      rentList,
      seekList,
      options,
      communityListData,
      currentAreaId,
      value,
      communityListColumns,
      onChange,
      goToCommunity,
    };
  },
};
</script>
<style scoped lang="less">
.home {
  height: 100%;
  .container {
    width: 1280px;
    height: 100%;
    margin: 0 auto;
    .home-banner {
      display: flex;
      width: 100%;
      height: 500px;
      margin-bottom: 15px;
      .home-community {
        width: 40%;
        height: 100%;
        .operation-button {
          display: inline-block;
          padding: 6px;
          color: #d46b08;
          background: #fff7e6;
          border: 1px solid #ffd591;
          border-radius: 15px;
          cursor: pointer;
        }
      }
    }
    .home-show {
      display: flex;
      justify-content: space-between;
      height: 800px;
      padding: 0 6px;
      .home-show-rent,
      .home-show-seek {
        width: 48%;
        border: 1px solid #dfdfdf;
        border-radius: 20px;
        background-color: #fff7e6;
        :deep(.rentOrSeek-list-content) {
          height: calc(100% - 60px);
        }
        :deep(.rentOrSeek-list-content-col3) {
          flex: 0 0 7.5%;
        }
      }
    }
  }
}
</style>
