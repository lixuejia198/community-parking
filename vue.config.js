module.exports = {
  chainWebpack: (config) => {
    // 配置网页标题
    config.plugin("html").tap((args) => {
      args[0].title = "社区闲置车位共享系统";
      return args;
    });
  },
};
