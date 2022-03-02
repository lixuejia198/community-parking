<template>
  <div class="register-form">
    <!-- 注册表单 -->
    <a-form
      :model="formState"
      :rules="rules"
      name="normal_login"
      @finish="onFinish"
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
import { registerByUsernameAndPassword } from "@/api/user";
import { message } from "ant-design-vue";
export default {
  name: "registerForm",
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup(props, { emit }) {
    console.log(props, emit);
    // 定义表单字段 并双向绑定
    const formState = reactive({
      username: "",
      password: "",
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
    // 提交表单且数据验证成功后的回调函数
    const onFinish = (values) => {
      console.log("Success:", values);
      const { username, password } = values;
      // 用户注册
      registerByUsernameAndPassword({ username, password })
        .then((data) => {
          console.log(data, "data");
          // 如果返回的状态码为200
          if (data.status === 200) {
            // 切换到登录组件
            emit("changeComponent", true);
            // 提示注册成功信息
            message.success(data.msg);
          }
          // 如果返回的状态码为0
          if (data.status === 0) {
            // 提示错误信息
            message.error(data.msg);
          }
        })
        .catch();
    };

    return {
      formState,
      onFinish,
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
