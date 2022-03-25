export function getUserInfo() {
  // 获取localStorage中的token
  const token = localStorage.getItem("community-parking");
  // 如果有token 就解构token中的用户信息(用户id和用户名)
  if (token) {
    const userInfo = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf-8")
    ).data;
    // 返回用户信息(用户id和用户名)
    return userInfo;
  }
  return {};
}
