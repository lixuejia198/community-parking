import { requestWithoutToken } from "@/utils/request";
/***
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @returns {Promise}
 */
export function loginByUsernameAndPassword({ username, password }) {
  return requestWithoutToken("/users/login", "post", { username, password });
}

/***
 * 用户注册
 * @param username 用户名
 * @param password 密码
 * @returns {Promise}
 */
export function registerByUsernameAndPassword({ username, password }) {
  return requestWithoutToken("/users/register", "post", { username, password });
}
