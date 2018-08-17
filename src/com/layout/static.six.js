import six from '../../templates/module/module.static.six.html';
import service from "../services/service.js";

// 社区动态模板
import noticeInfo from '../../templates/template/notice.temp.html';

export class staticSix {
  init() {
    let template = Handlebars.compile(six);
    // toto
    let code = lscache.get("config").config.newCommunity; 
    
    service.requestCommNotice(code, data => {
      /** 图片 */
      Handlebars.registerHelper("isPic", function (v1, options) {
        if (v1 != null) {
          this.coverUuid = constants.SERVER_FILE_URL + this.coverUuid
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      /** 是否为空 */
      Handlebars.registerHelper("if_list", function (v1, options) {
        if (v1 == null || v1.length == 0) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });

      let html = template(data.data);
      $(".page-6").empty().append(html);

      Scrollbar.use(OverscrollPlugin);
      const scrollbar = Scrollbar.init(document.querySelector(
        '.six-content'), {
        plugins: {
          overscroll: {
            effect: 'glow'
          },
        }
      });
      scrollbar.track.xAxis.hide();

      // 初始化工作动态弹出框
      $('.info-modal').modal({
        ready: function (modal, trigger) {
          $('.modal-overlay').css({
            display: 'block'
          });
        }
      });

      $('.six-item').on('click', event => {
        $('#info-modal').modal('open');
        $('.modal-overlay').css({
          display: 'none'
        });
        window.isHideTooltip = "hideTip"; // 关闭高亮提示
        $("#real-time-video1").css("display", "none");
        $("#real-time-video2").css("display", "none");
        $("#real-time-video3").css("display", "none");
        service.requestInfoContent(event.currentTarget.dataset.pkid,
          data => {
            let template = Handlebars.compile(noticeInfo);
            let html = template(data.data);
            $('.info-modal').empty().append(html);
            $('.notice-info-content').empty().append(data.data.content);


            $(".modal-overlay").on("click",evnet=>{
              $("#real-time-video1").css("display", "block");
              $("#real-time-video2").css("display", "block");
              $("#real-time-video3").css("display", "block");
              window.isHideTooltip = "showTip"; // 打开高亮提示
            });

            Scrollbar.use(OverscrollPlugin);
            const scrollbar = Scrollbar.init(document.querySelector(
              '.notice-info-content'), {
              plugins: {
                overscroll: {
                  effect: 'glow'
                },
              }
            });
            scrollbar.track.xAxis.hide();

          })
      });

      // 打开更多新闻
      $('.community-more').on("click", event => {
        window.open("src/static/newWindow/newCommunity.html?code=" + lscache.get("config").config.newCommunity);
      })
    })
  };
}
