<template>
  <div class="login">
    <div class="container">
      <h3 class="login-title">
        社区闲置车位共享系统{{ isLoginForm ? "登录" : "注册" }}
      </h3>
      <div class="login-content">
        <!-- 登录组件  -->
        <login-form v-if="isLoginForm" />
        <!-- 注册组件  -->
        <register-form v-if="!isLoginForm" @changeComponent="changeComponent" />
        <a href="javascript:" v-if="isLoginForm" @click="isLoginForm = false">
          没有账号？立即注册
        </a>
        <a href="javascript:" v-if="!isLoginForm" @click="isLoginForm = true">
          已注册 去登录
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from "@/views/login/components/registerForm";
import { ref } from "vue";
import LoginForm from "@/views/login/components/loginForm";
export default {
  name: "Login",
  components: { LoginForm, RegisterForm },
  setup() {
    // 定义一个控制登录组件和注册组件显示的变量
    const isLoginForm = ref(true);
    // 用来切换组件的(登录组件和注册组件之间的切换)
    const changeComponent = (e) => {
      // console.log(e);
      isLoginForm.value = e;
    };
    return {
      isLoginForm,
      changeComponent,
    };
  },
};
</script>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("../../assets/01.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
  .container {
    padding-top: 200px;
    height: 100%;
    .login-title {
      padding: 0;
      margin: 0 0 10px 0;
      font-weight: bold;
      color: #ff7300;
      font-size: 28px;
    }
    .login-content {
      width: 400px;
      height: 350px;
      position: absolute;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ffffffa3;
      padding: 35px 45px 45px;
      border-radius: 15px;
      border: 1px dashed #fa7314;
      a {
        color: #fa7314;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
}
</style>
