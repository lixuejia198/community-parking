<template>
  <div class="login-info">
    <div class="login-info-left" @click="geToHome">
      <img src="/images/garage.png" alt="点击可跳转到首页" />
      <span>首页</span>
    </div>
    <ul class="login-info-right">
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
</template>

<script>
import { ref } from "vue";
import { getUserInfo } from "@/utils/getUserInfo";
import { useRouter } from "vue-router";
import { UserOutlined } from "@ant-design/icons-vue";

export default {
  name: "TopNav",
  components: { UserOutlined },
  setup() {
    const userInfo = ref(getUserInfo());
    const router = useRouter();
    // 退出登录
    const loginOut = () => {
      window.localStorage.removeItem("community-parking");
      router.push("/login");
    };
    // 跳转到首页
    const geToHome = () => {
      router.push("/");
    };

    return {
      userInfo,
      loginOut,
      geToHome,
    };
  },
};
</script>

<style lang="less" scoped>
.login-info {
  height: 55px;
  border-bottom: 1px solid #dfdfdf;
  display: flex;
  justify-content: space-between;
  .login-info-left {
    padding-left: 20px;
    cursor: pointer;
    img {
      width: 55px;
    }
    span {
      font-size: 16px;
      line-height: 55px;
      padding-left: 5px;
    }
  }
  .login-info-right {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
    li {
      padding: 0 20px 0 6px;
      border-left: 2px solid #ff7300;
      font-size: 16px;
    }
  }
}
</style>
