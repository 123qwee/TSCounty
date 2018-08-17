// 导入模版
import tmp from '../../templates/header.html';
// 社区介绍模板
import communityInfo from '../../templates/template/community.temp.html';

import service from "../services/service.js";

export class topLayout {
  init() {

    let template = Handlebars.compile(tmp);
    $("#site-layout-example-top").append(template);

    window.isHideTooltip = "showTip"; // 高亮提示

    // 系统左上角时间--时分秒

    let newDate = new Date();
    $(".head-time .time-head").text(newDate.getMonth() + 1 + "月" + newDate.getDate() + "日");

    if (window.newTime) {
      _.map(newTimeIntervalArr, item => {
        window.clearInterval(item);
      })
    } else {
      window.newTimeIntervalArr = [];
      window.newTime = false;
    }
    newTimeIntervalArr.push(setInterval(function () {
      newTime = true;
      $(".head-time .time-bottom").text(moment().format('HH:mm:ss'));
    }, 1000));

    /** 绑定头部按钮事件 */
    this.bindTopButClick();

    $(".two-title").text(lscache.get("userName").communtiyName);

    // 初始化社区介绍弹出框
    $('.statis-modal').modal();

    $(document).ready(function () {
      $('.carousel').carousel();
    });
  };

  bindTopButClick() {
    /** 按钮样式 */
    $('.top-button').on({
      mouseover: event => {
        event.currentTarget.children[0].src =
          './src/static/images/header/top_button_select.png';
        event.currentTarget.children[1].style.color = '#00F0FF';
      },
      mouseout: event => {
        event.currentTarget.children[1].style.color = '#fff';
        if (event.currentTarget.className.indexOf('btn-select') < 0) {
          event.currentTarget.children[0].src =
            './src/static/images/header/top_button_default.png';
        }
      },
      click: evevt => {
        $('.top-button').each((index, item) => {
          item.className = item.className.replace("btn-select", "");
          item.children[0].src =
            './src/static/images/header/top_button_default.png';
          event.currentTarget.children[1].style.color = '#fff';
        });
        evevt.currentTarget.className += ' btn-select';
        event.currentTarget.children[0].src =
          './src/static/images/header/top_button_select.png';
        event.currentTarget.children[1].style.color = '#00F0FF';

      }
    });

    /** 按钮一事件 社区介绍 */
    $('.top-button-1').on("click", event => {
      $('#statis-modal').modal('open');
      $('.modal-overlay').css({
        display: 'none'
      });
      window.isHideTooltip = "hideTip"; // 关闭高亮提示
      $("#real-time-video1").css("display", "none");
      $("#real-time-video2").css("display", "none");
      $("#real-time-video3").css("display", "none");
      service.requestInfo(lscache.get('userName').communtiyCode,
        data => {
          if (data.code == 200) {
            let imgList = [];
            if (data.data.imgList) {
              _.map(data.data.imgList.split(","), (item, index) => {
                imgList.push({ img: constants.SERVER_FILE_URL + item, id: "#" + index + "!" });
              })
            };
            var TempData = {
              imgList: imgList,
              content1: data.data.content1,
              content2: data.data.content2,
              content3: data.data.content3,
            };

            let template = Handlebars.compile(communityInfo);
            let html = template(TempData);
            $('.statis-modal').empty().append(html);
            // 轮播
            $('.carousel').carousel();

            Scrollbar.use(OverscrollPlugin);
            const scrollbar = Scrollbar.init(document.querySelector(
              '.comm-info-content'), {
                plugins: {
                  overscroll: {
                    effect: 'glow'
                  },
                }
              });
            scrollbar.track.xAxis.hide();
            $('.dialog-close').on("click", event => {
              $("#real-time-video1").css("display", "block");
              $("#real-time-video2").css("display", "block");
              $("#real-time-video3").css("display", "block");
              window.isHideTooltip = "showTip"; // 打开高亮提示
              $('#statis-modal').modal('close');
            });
            $(".comm-info").css("left", "calc( 50% - " + (($(
              ".comm-info-content").width() + 20) / 2) + "px)");
          }
        });
    })



    var config = lscache.get("config").linkAddress;
    /** 按钮一事件 视频监控 */
    $('.top-button-2').on("click", event => {
      service.getToken(data => {
        window.open(
          config.btn2 + data.data
        );
      });
    });
    /** 按钮一事件 治安巡逻 */
    $('.top-button-3').on("click", event => {
      service.getToken(data => {
        window.open(
          config.btn3 + data.data
        );
      });
    });
    /** 按钮一事件 一键报警 */
    $('.top-button-4').on("click", event => {
      service.getToken(data => {
        window.open(
          config.btn4 + data.data
        );
      });
    });
    /** 按钮一事件 一键求助 */
    $('.top-button-5').on("click", event => {
      var hash = hex_md5("123456");
      var time = new Date();
      var Month = (time.getMonth() + 1) < 10 ? ("0" + (time.getMonth() +
        1)) :
        (
          time.getMonth() +
          1);
      var Day = time.getDate() < 10 ? ("0" + time.getDate()) : time.getDate();
      var Hours = time.getHours() < 10 ? ("0" + time.getHours()) : time.getHours();
      hash = hex_md5(hash + Month + Day + Hours);
      window.open(
        config.btn5 + hash
      );
    });
    /** 按钮一事件 人脸识别 */
    $('.top-button-8').on("click", event => {
      service.getToken(data => {
        window.open(
          config.btn6 + data.data
        );
      });
    });

    /** 注销 */
    $('.logout-img').on("click", event => {
      let dialog = jDialog.confirm('确定要注销系统，返回重新登录吗？', {
        handler: function (button, dialog) {
          dialog.close();
          service.requestLogout(data => {
            lscache.flush();
            window.location.href = '/login.html';
          });
        }
      }, {
          handler: function (button, dialog) {
            dialog.close();
          }
        }, {
          title: '注销账号',
        });
    })
  }
}
