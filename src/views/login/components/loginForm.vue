<template>
  <div class="login-form">
    <!--  登录表单 -->
    <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <!--  用户名  -->
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>
      <!--   密码   -->
      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <!--   登录按钮  -->
        <a-button
          :disabled="disabled"
          type="primary"
          html-type="submit"
          class="login-form-button"
        >
          Log in
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "loginForm",
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    // 定义表单字段 并双向绑定
    const formState = reactive({
      username: "",
      password: "",
    });
    // 提交表单且数据验证成功后的回调函数
    const onFinish = (values) => {
      console.log("Success:", values);
    };
    // 提交表单且数据验证失败后的回调函数
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    // 计算登录按钮的禁用状态
    const disabled = computed(() => {
      return !(formState.username && formState.password);
    });
    return {
      formState,
      onFinish,
      onFinishFailed,
      disabled,
    };
  },
});
</script>

<style scoped lang="less">
.login-form {
  width: 100%;
  //height: 240px;
  border-radius: 10px;
  padding-top: 15px;
  box-sizing: border-box;
}
#components-form-demo-normal-login {
  .login-form {
    max-width: 300px;
  }
  .login-form-forgot {
    margin-bottom: 24px;
  }
  .login-form-button {
    width: 100%;
  }
}
</style>
