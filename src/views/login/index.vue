<template>
  <div class="login">
    <div class="container">
      <h3 class="login-title">
        社区闲置车位共享系统{{ isLoginForm ? "登录" : "注册" }}
      </h3>
      <!-- 登录组件  -->
      <login-form v-if="isLoginForm" />
      <!-- 注册组件  -->
      <register-form v-if="!isLoginForm" />
      <a href="javascript:" v-if="isLoginForm" @click="isLoginForm = false">
        没有账号？立即注册
      </a>
      <a href="javascript:" v-if="!isLoginForm" @click="isLoginForm = true">
        已注册 去登录
      </a>
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
    return {
      isLoginForm,
    };
  },
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("../../assets/background.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
}

.login .container {
  width: 400px;
  height: 350px;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ff840091;
  padding: 35px 45px 45px;
  border-radius: 5px;
  border: 1px dashed white;
}

.login-title {
  padding: 0;
  margin: 0 0 10px 0;
  font-weight: 500;
  color: white;
}
</style>
