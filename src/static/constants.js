// IP地址
const HOST = 'http://61.178.131.29';
// 后台服务端口
const SERVER_PORT = "8026";

// 默认服务地址前缀
const DEFAULT_URL = HOST + ":" + SERVER_PORT;


window.constants = {
  HOST: HOST,
  // 协同处置系统后台地址
  SERVER_URL: DEFAULT_URL,
  // 获取文件接口
  SERVER_FILE_URL: DEFAULT_URL + "/fastdfs/file/file/",
  grid_info: [{
    info: "王家磨社区第一网格",
  },
  {
    info: "王家磨社区第二网格描述",
  },
  {
    info: "王家磨社区第三网格描述",
  },
  {
    info: "王家磨社区第四网格描述",
  }
  ],
}
