import seven from '../../templates/module/module.static.seven.html';
import service from "../services/service.js";

export class staticSeven {
  init() {
    let template = Handlebars.compile(seven);
    service.requestMatterRecord(lscache.get('userName').communtiyCode, data => {
      /** 是否为空 */
      Handlebars.registerHelper("if_list", function (v1, options) {
        if (v1 == null || v1.length == 0) {
          return options.fn(this);
        } else {
          _.map(this.list, item => {
            let timeagoInstance = timeago(null, moment().format(
              'YYYY-MM-DD HH:mm:ss')); // 在这里设置相对时间
            item.times = timeagoInstance.format(item.addTime,
              'zh_CN');
            item.lonlat = [item.positionX, item.positionY];
          })
          return options.inverse(this);
        }
      });
      let html = template(data.data);

      $(".page-7").empty().append(html);

      $("div.info-scroll").scrollTop({
        speed: 60
      });

      // 处理案件
      $('.community-event').on("click", event => {
        window.open("src/static/weChat/weChat.html?code=" + lscache.get(
          'userName').communtiyCode);
      });

      /*************************************************************************************** */
      // 地图

      var container = document.getElementById('popup');
      var content = document.getElementById('popup-content');
      var closer = document.getElementById('popup-closer');

      /**
       * Add a click handler to hide the popup.
       * @return {boolean} Don't follow the href.
       */
      closer.onclick = function (evt) {
        overlay.setPosition(undefined);
        closer.blur();
        addMarkerEvent();
        return false;

      };

      /**
       * Create an overlay to anchor the popup to the map.
       */
      window.overlay = new ol.Overlay( /** @type {olx.OverlayOptions} */
        ({
          element: container,
          autoPan: true,
          offset: [1, -13],
          autoPanAnimation: {
            duration: 250 //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度. 单位为毫秒（ms）
          }
        }));


      var markersInfo = [];
      _.map(data.data.list, (item, index) => {
        if (item.positionX) {
          markersInfo.push({
            type: "curMarker",
            lon: item.positionX,
            lat: item.positionY,
            attr: {
              matterDesc: item.matterDesc,
              id: item.id,
              addressDesc: item.addressDesc,
              lonlat: [item.positionX, item.positionY],
            },
          });
        }
      });
      setTimeout(() => {
        mapApi.markerApi.addMarkers(markersInfo);
      }, 300);

      addMarkerEvent();

      function addMarkerEvent() {
        mapApi.interactionOper.addSelectAction({
          layers: mapApi.mapOper.layerApi.getLayerByName("默认标记图层"),
          selectFunc: (evt) => {
            if (evt.selected.length > 0 && !isMapDrawing) {
              console.log("点击marker");
              if (evt.selected[0].get("attr")) {

                var coordinate = evt.mapBrowserEvent.coordinate;
                var attr = evt.selected[0].get("attr");
                content.innerHTML = `<p>事件：` + attr.matterDesc +
                  `</p>` +
                  `<p>地址：` + attr.addressDesc + `</p>`;

                var lonlat = _.cloneDeep(attr.lonlat);
                overlay.setPosition(lonlat);
                mapApi.map.addOverlay(overlay);
              }
            }
          },

        });
      }
      // 点击上报信息，移动地图
      $(".info-item-content").on("click", function (event) {
        var lonlat = $(this).attr("data-lonlat").split(",");
        lonlat = [parseFloat(lonlat[0]), parseFloat(lonlat[1])]
        if (lonlat[0] && lonlat[1]) {
          mapApi.mapOper.setCenterAndZoom(lonlat, 15)
        }
      });
      /*************************************************************************************** */
    })
  };
}
