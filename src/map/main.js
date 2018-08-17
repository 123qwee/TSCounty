/**
 * 地图接口封装
 * @description
 */
// 引入地图配置
import mapConfig from './config/index.js';
// 引入地图操作
import mapOper from './opers/mapOper.js';
// 引入元素操作
import markerOper from './opers/markerOper.js';
// 引入地图量算操作
import measureOper from './opers/measureOper.js';

import interactionOper from './opers/interactionOper.js';

import featureOper from './opers/featureOper.js';

import service from "../com/services/service.js";

export class mapApi {

  constructor() { }
  // 地图初始化
  init() {
    window.isMapDrawing = false;
    let rotateNum = 0;
    let that = this;
    let keyClickId = null,
      keyMoveId = null;

    // 网格地图配置
    let config = lscache.get("config").config;

    mapConfig.initLayers[4].name = config.mapName;
    mapConfig.initLayers[4].layers = config.layers;
    mapConfig.initLayers[4].url = config.mapUrl;
    // 初始化地图操作
    this.mapOper = new mapOper(mapConfig);
    // 初始化地图
    this.mapOper.initMap();

    this.map = this.mapOper.map;

    // 初始化元素操作
    this.markerApi = new markerOper(this.mapOper.map);
    // 初始化地图量算操作
    this.measureApi = new measureOper(this.mapOper.map);
    // 初始化地图交互操作
    this.interactionOper = new interactionOper(this.mapOper.map);
    // 初始化地图要素操作
    this.featureApi = new featureOper(this.mapOper.map);
    /******************************************************************************************** */
    var content = document.getElementById('popup-content');

    this.mapOper.addMapEvent("click", event => {
      // 地图处于绘图状态下，禁止查询网格信息
      if (isMapDrawing) {
        return;
      };

      // 获取网格信息图层
      const Layer = that.mapOper.layerApi.getLayerByName("tianshui");

      const resolution = that.mapOper.mapView.getResolution();
      const projection = that.mapOper.mapView.getProjection();

      // 获取要素查询地址
      const urlUnit = that.featureApi.queryWmsFeatureInfoUrl(
        Layer.getSource(),
        event.coordinate,
        resolution,
        projection
      );

      var lonlat = event.coordinate;
      $.ajax({
        type: "get",
        url: urlUnit,
        success: data => {
          if (data.features.length > 0) {
            const layer = that.mapOper.layerApi.getLayerByName(
              "默认矢量图层");
            layer.getSource().clear();

            let props = data.features[0].properties;

            let ColorID = props.COLORID - 1;
            content.innerHTML = `<span>` + constants.grid_info[ColorID]
              .info +
              `</sapn>`;

            overlay.setPosition(lonlat);
            that.map.addOverlay(overlay);

            // 添加选中面的高亮要素到矢量图层
            that.featureApi.addPolygon(
              props,
              layer,
              data.features[0].geometry.coordinates
            );
          }
        }
      });
    });

    /************************************************************************************************************** */

    service.getCommunityList(lscache.get("userName").communtiyCode, data => {
      if (data.code == 200) {
        let opt = "<option value='0'>--请选择--</option>";
        if (lscache.get("config").config.communityUrl) {
          let communityList = lscache.get("config").config.communityUrl.split(",")
        }

        _.map(communityList, (value, key) => {
          opt += "<option value='http://61.178.131.29:8024/index.html'>" + value + "</option>";
        });
        $("#MapVideo").html(opt);
        // 打开更多视频
        $('#controls .more').on("click", event => {
          window.open("src/static/videoList/videolist.html");
        });
        $("#MapVideo").on("change", function (params) {
          // 获取选中值
          window.open($(this).val());
          // 恢复默认值
          $(this).val(0);
        });
      }
    });

    let videoList = lscache.get("config").config.countyVideoDef.split(",");
    document.getElementById("real-time-video1").src = "./src/static/video/video.html?" + videoList[0];
    document.getElementById("real-time-video2").src = "./src/static/video/video.html?" + videoList[1];
    document.getElementById("real-time-video3").src = "./src/static/video/video.html?" + videoList[2];


    /******************************************************************************************************* */
    /** 地图缩小一级 */
    $('.controls-rotate-reduce').on('click', function () {
      that.mapOper.zoomOut();
    })

    /** 地图放大一级 */
    $('.controls-rotate-add').on('click', function () {
      that.mapOper.zoomIn();
    })

    /** 地图向右旋转 */
    $('.controls-rotate-right').on('click', function () {
      rotateNum -= 30;
      that.mapOper.rotateTo("right");
      $(".controls-compass-arrow").css("transform", 'rotate(' + -
        rotateNum + 'deg)');
    })

    /** 地图向左旋转 */
    $('.controls-rotate-left').on('click', function () {
      rotateNum += 30;
      that.mapOper.rotateTo("left");
      $(".controls-compass-arrow").css("transform", 'rotate(' + -
        rotateNum + 'deg)');
    })

    /** 地图指向正北 */
    $('.controls-compass').on('click', function () {
      rotateNum = 0;
      that.mapOper.rotateTo("reset");
      $(".controls-compass-arrow").css("transform", 'rotate(0deg)');
    })

    /** 测距 */
    $(".tool-btn").on('click', event => {
      isMapDrawing = true;
      let layer = this.mapOper.layerApi.getLayerByName('默认矢量图层');

      this.measureApi.activeMeasureLength(layer.getSource());
    });

    $(".tool-reset").on("click", () => {
      isMapDrawing = false;
      this.measureApi.deactiveMeasure();
      // 清空矢量图层
      let layer = this.mapOper.layerApi.getLayerByName('默认矢量图层');
      layer.getSource().clear(true);
    });

  };
}
