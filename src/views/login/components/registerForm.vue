<template>
  <div class="register-form">
    <!-- 注册表单 -->
    <a-form
      :model="formState"
      :rules="rules"
      name="normal_login"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <!--  用户名  -->
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formState.username">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>
      <!--   密码   -->
      <a-form-item label="密码" name="password" :labelCol="{ offset: 1 }">
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <!--  注册按钮  -->
      <a-form-item>
        <a-button type="primary" html-type="submit" block> 注册 </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { reactive } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { checkPassword, checkUsername } from "@/utils/validator";
export default {
  name: "registerForm",
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    // 定义表单字段 并双向绑定
    const formState = reactive({
      username: "",
      password: "",
      identity: "",
    });
    // 定义验证规则
    const rules = {
      // 用户名
      username: [
        {
          validator: checkUsername,
          trigger: "change",
        },
      ],
      // 密码
      password: [
        {
          validator: checkPassword,
          trigger: "change",
        },
      ],
    };
    // // 计算注册按钮的禁用状态
    // const disabled = computed(() => {
    //   return !(formState.username && formState.password && formState.identity);
    // });
    // 提交表单且数据验证成功后的回调函数
    const onFinish = (values) => {
      console.log("Success:", values);
    };
    // 提交表单且数据验证失败后的回调函数
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    return {
      formState,
      onFinish,
      onFinishFailed,
      rules,
    };
  },
};
</script>

<style scoped lang="less">
.register-form {
  width: 100%;
  border-radius: 10px;
  padding-top: 30px;
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
