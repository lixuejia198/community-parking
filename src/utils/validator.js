// 验证用户名
export let checkUsername = async (_rule, value) => {
  // console.log(_rule, value);
  // 如果用户没有输入用户名 给出提示让用户输入自己的用户名
  if (!value) {
    return Promise.reject("请输入您的用户名！");
  }
  // 定义用户名正则 只含有汉字、数字、字母、下划线，下划线位置不限
  let reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,20}$/;
  if (!reg.test(value)) {
    return Promise.reject("用户名长度在4到20之间");
  }
};
// 验证密码
export let checkPassword = async (_rules, value) => {
  // 如果用户没有输入密码 给出提示让用户输入自己的密码
  if (!value) {
    return Promise.reject("请输入您的密码！");
  }
  // 定义密码正则 只能输入6-11个字母、数字、下划线
  let reg = /^(\w){6,11}$/;
  if (!reg.test(value)) {
    return Promise.reject("密码长度在6到11之间");
  }
};
// 验证车牌号
export let checkCarName = async (_rules, value) => {
  let result = false;
  // 如果用户没有输入车牌号 给出提示让用户输入自己的车牌号
  if (!value) {
    return Promise.reject("请输入您的车牌号！");
  }
  // 判断用户输入的车牌号格式是否正确
  if (value.length === 7) {
    let express =
      /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    result = express.test(value);
  }
  return result ? true : Promise.reject("车牌号格式不正确！！！");
};
