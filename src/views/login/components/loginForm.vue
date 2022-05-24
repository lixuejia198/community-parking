<template>
  <div class="login-form">
    <!--  登录表单 -->
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
      <!--  登录按钮  -->
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          class="login-form-button"
          block
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { checkUsername, checkPassword } from "@/utils/validator";
import { loginByUsernameAndPassword } from "@/api/user";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";

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
    // 获取路由对象
    const router = useRouter();
    const route = useRoute();
    // 提交表单且数据验证成功后的回调函数
    const onFinish = (values) => {
      // console.log("Success:", values);
      const { username, password } = values;
      // 用户登录
      loginByUsernameAndPassword({ username, password })
        .then((data) => {
          console.log(data, "data");
          // 如果返回的状态码为200
          if (data.status === 200) {
            // 把token存入localStorage中
            window.localStorage.setItem("community-parking", data.token);
            // 跳转到重定向页面或者首页
            router.push(route.query.redirect || "/");
            // 提示登录成功信息
            message.success(data.msg);
          }
          // 如果状态码为0
          if (data.status === 0) {
            // 提示错误信息
            message.error(data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      formState,
      onFinish,
      rules,
    };
  },
});
</script>

<style scoped lang="less">
.login-form {
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
