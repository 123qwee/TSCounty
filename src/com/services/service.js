import ajaxOper from "../common/ajaxOper.js";

export default {
  /**
   * 注销账号
   * 
   * @param {any} successFunc 回调函数
   */
  requestLogout(successFunc) {
    ajaxOper.ajaxHttp({
      type: 'post',
      url: "/communtiy/basic/logout",
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },

  /**
   * 社区基本情况
   * @param {any} CommunityId 社区ID
   * @param {any} successFunc 回调函数
   */
  requestCommunityInfo(code, successFunc) {
    ajaxOper.ajaxHttp({
      type: 'get',
      url: "/community/basic/county/info/findByCode?code=" +
        code,
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },
  /**
 * 社区基本弹框
 * @param {any} CommunityId 社区ID
 * @param {any} successFunc 回调函数
 */
  requestInfo(code, successFunc) {
    ajaxOper.ajaxHttp({
      type: 'get',
      url: "/community/basic/introduce/findByCode?code=" +
        code,
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },

  /**
   * 社区居民年龄结构
   * @param {any} communityId 社区ID
   * @param {any} successFunc 回调函数
   */
  requestAge(communityId, successFunc) {
    ajaxOper.ajaxHttp({
      type: 'get',
      url: "/communtiy/basic/data/age/findByCode?communityCode=" +
        communityId,
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },

  /**
   * 获取重点人群
   * @param {any} communityId 社区ID
   * @param {any} successFunc 回调函数
   */
  requestKeyPeople(communityId, successFunc) {
    ajaxOper.ajaxHttp({
      type: 'get',
      url: "/communtiy/basic/data/keycrowd/findByCode?communityCode=" +
        communityId,
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },

  /**
   * 社区新闻动态
   * @param {any} catalogId 新闻目录ID
   * @param {any} successFunc 回调函数
   */
  requestCommNotice(catalogId, successFunc) {
    ajaxOper.ajaxHttp({
      type: 'get',
      url: "/communtiy/buss/notice/findByCatalogIds?page=1&pageSize=10&catalogIds=" +
        catalogId,
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },

  /**
   * 微信实时上报记录
   * @param {any} cloudSign 查询参数
   * @param {any} successFunc 回调函数
   */
  requestMatterRecord(cloudSign, successFunc) {
    ajaxOper.ajaxHttp({
      type: 'get',
      url: "/communtiy/buss/matter/publics/front/search/findAllNoDealFront?cloudSign=" +
        cloudSign + "&page=1&pageSize=10&orderBy=addTime&order=desc",
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },

  /**
   * 获取公告信息
   * @param {any} noticeId 公告ID
   * @param {any} successFunc 回调函数
   */
  requestInfoContent(noticeId, successFunc) {
    ajaxOper.ajaxHttp({
      type: 'get',
      url: "/communtiy/buss/notice/findById?noticeId=" + noticeId,
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },

  // 获取鉴权 token
  getToken(successFunc) {
    ajaxOper.ajaxHttp({
      data: {
        url: "http://60.165.152.5:93/home/ssoTokenKey.action",
      },
      url: 'http://61.178.131.29:8024/communtiy/buss/cache/findCache/token/0',
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },

  // 社区列表
  getCommunityList(code, successFunc) {
    ajaxOper.ajaxHttp({
      type: 'get',
      url: "/community/basic/county/video/findCommunityByCode?code=" + code,
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },
  /**
  * 人脸识别
  * @param {any} communityId 社区ID
  * @param {any} successFunc 回调函数
  */
  faceRecognition(code, successFunc) {
    ajaxOper.ajaxHttp({
      type: 'get',
      url: "/communtiy/basic/data/party/findByCode?communityCode=" +
        code,
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },
  // 视频列表
  getVideoList(code, successFunc) {
    ajaxOper.ajaxHttp({
      type: 'get',
      url: "/community/basic/county/video/findByCode",
      data: {
        page: 1,
        pageSize: 3,
        code: code
      },
      successFunc: (data) => {
        successFunc && successFunc(data);
      }
    })
  },
}
