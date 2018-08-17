/**
 * Map对象相关操作
 */
import {
  layerOper
} from './layerOper.js';

// import olProj from 'ol/proj';
// import olProj from '../../static/ol/proj.js';

// import { BaiduMap } from './baidu.js';

class mapOper {

  /**
   * 构造函数
   * @param {*} mapConfig 地图初始配置
   */
  constructor(mapConfig) {
    this.map = null;
    this.mapConfig = mapConfig;
    this.defaultCenter = null;

    this.layerApi = null;

    // 地图单击事件集合
    this.mapClickEvents = [];

    this.postComposeEvents = [];
  }

  /**
   * 初始化地图容器
   */
  initMap() {
    // 获取地图容器Div的id
    const domId = this.mapConfig.domId;
    // 获取地图预设中心点
    let mapCenter = [this.mapConfig.centerX, this.mapConfig.centerY];
    // 获取地图预设缩放级别
    const zoomLevel = this.mapConfig.zoomLevel;

    if (this.mapConfig.projection != "EPSG:4326") {
      mapCenter = ol.proj.transform(mapCenter, "EPSG:4326", this.mapConfig.projection);
      // mapCenter = ol.proj.transform(mapCenter, this.mapConfig.projection, "EPSG:4326");
      console.log(mapCenter);
    }

    // 创建地图默认视图范围
    const mapView = new ol.View({
      projection: new ol.proj.get(this.mapConfig.projection),
      center: mapCenter,
      zoom: zoomLevel,
      minZoom: this.mapConfig.minZoom,
      maxZoom: this.mapConfig.maxZoom
    })
    // 初始化地图
    this.map = new ol.Map({
      view: mapView,
      controls: new ol.control.defaults({
        attribution: false,
        zoom: false,
        rotate: false
      }),
      target: 'map'
    });

    // 初始化地图视图
    this.mapView = this.map.getView();
    // 初始化默认中心点
    this.defaultCenter = this.mapView.getCenter();

    // 初始化图层操作
    this.layerApi = new layerOper(this.map);

    // 初始化图层
    this.initLayers();
    // 初始化地图事件
    this.initEvents();
  }

  /**
   * 初始化地图图层
   */
  initLayers() {
    let layers = [];

    for (let i = 0; i < this.mapConfig.initLayers.length; i++) {
      // 判断图层是否加载
      if (this.mapConfig.initLayers[i].isLoad) {
        let layer = null;
        if (this.mapConfig.initLayers[i].type == "WMTS") {
          layer = this.layerApi.createWmtsLayer(this.mapConfig.initLayers[i]);
        } else if (this.mapConfig.initLayers[i].type == "Vector") {
          layer = this.layerApi.createVectorLayer(this.mapConfig.initLayers[i]);
        } else if (this.mapConfig.initLayers[i].type == "WMS") {
          layer = this.layerApi.createWmsLayer(this.mapConfig.initLayers[i]);
        } else if (this.mapConfig.initLayers[i].type == "WFS") {
          layer = this.layerApi.createVectorLayerByWFS(this.mapConfig.initLayers[
            i]);
        } else if (this.mapConfig.initLayers[i].type == "Baidu") {
          layer = this.layerApi.createBaiduLayer(this.mapConfig.initLayers[i]);
        } else if (this.mapConfig.initLayers[i].type == "Baidu1") {
          layer = this.layerApi.createBaiduLayer(this.mapConfig.initLayers[i]);
        }
        this.map.addLayer(layer);
        layers.push(layer);
      }
    }
    return layers;
  }

  /** START 地图事件操作 */
  initEvents() {
    let that = this;

    // 地图单击事件
    this.map.on('singleclick', function (...params) {
      if (that.mapClickEvents.length > 0) {
        for (let i = 0; i < that.mapClickEvents.length; i++) {
          that.mapClickEvents[i].value(...params, that.mapClickEvents[i].key)
        }
      }
    })

    this.map.on('pointermove', function (e) {
      let pixel = that.map.getEventPixel(e.originalEvent);
      let hit = that.map.hasFeatureAtPixel(pixel);
      if (hit) {
        that.map.getTargetElement().style.cursor = 'pointer';
      } else {
        that.map.getTargetElement().style.cursor = '';
      }
    });
  }

  /**
   * 添加地图事件
   * @param {*} type 事件类型
   * @param {*} eventFunc 事件回调函数
   */
  addMapEvent(type, eventFunc) {
    const key = this.generateUUID();
    const event = {
      key,
      value: eventFunc
    };

    switch (type) {
      case 'click':
        this.mapClickEvents.push(event);
        break
      case 'postcompose':
        this.postComposeEvents.push(event);
        break;
      default:
        break;
    }

    return key;
  }

  /**
   * 移除地图事件
   * @param {*} type 事件类型
   * @param {*} key 事件函数唯一标识码
   */
  removeMapEvent(type, key) {
    switch (type) {
      case 'click':
        _.remove(this.mapClickEvents, {
          key,
        });
        break
      case 'postcompose':
        _.remove(this.postComposeEvents, {
          key,
        });
        break;
      default:
        break;
    }

  }

  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    return uuid;
  };

  /** END 地图事件操作 */

  /**
   * 根据百度地图接口获取位置信息
   */
  getAddressByLonLat(lon, lat, successFunc) {
    $.ajax({
      url: "http://api.map.baidu.com/geocoder/v2/",
      async: false,
      data: {
        ak: "rOvp5tcWndbjcsODojjMxNZ3",
        output: "json",
        coordtype: "wgs84ll",
        location: lat + "," + lon
      },
      dataType: "jsonp",
      success: function (data) {
        let address = "";
        if (data.status == 0) {
          address = data.result.formatted_address + data.result.sematic_description;
          successFunc(address);
        }
      }
    })
  }

  getAddressByLonLatFromGDMap(lon, lat, successFunc) {
    $.ajax({
      url: "http://restapi.amap.com/v3/geocode/regeo",
      async: false,
      data: {
        key: "3eefb2c640b8e950a66eda67b6a51dbe",
        output: "JSON",
        location: lat + "," + lon
      },
      dataType: "jsonp",
      success: function (data) {
        let address = "";
        if (data.status == 0) {
          address = data.result.formatted_address + data.result.sematic_description;
          successFunc(address);
        }
      }
    })

  }

  /** START 地图缩放定位旋转操作 */

  // 获取当前地图缩放级别
  getZoom() {
    return this.mapView.getZoom();
  }

  // 获取当前地图最小缩放级别
  getMinZoom() {
    return this.mapView.getMinZoom();
  }

  // 获取当前地图最大缩放级别
  getMaxZoom() {
    return this.mapView.getMaxZoom();
  }

  // 地图放大一级
  zoomIn() {
    const zoom = this.getZoom();

    if (zoom != this.getMaxZoom()) {
      this.mapView.animate({
        zoom: zoom + 1,
        duration: 1000
      })
    }
  }

  // 地图缩小一级
  zoomOut() {
    if (this.getZoom() != this.getMinZoom()) {
      // this.map.setZoom(this.getZoom() - 1);
      this.mapView.animate({
        zoom: this.getZoom() - 1,
        duration: 1000
      })
    }
  }
  /** 地图旋转 */
  rotateTo(type) {
    switch (type) {
      case 'left':
        this.mapView.animate({
          rotation: this.mapView.getRotation() - Math.PI / 6
        });
        break;
      case 'right':
        this.mapView.animate({
          rotation: this.mapView.getRotation() + Math.PI / 6
        });
        break;
      case 'reset':
        this.mapView.animate({
          rotation: 0
        });
        this.setFullExtent();
        break;
      default:
        break;
    }
  }

  // 设置全图
  setFullExtent() {
    this.setCenterAndZoom(this.defaultCenter, this.mapConfig.zoomLevel)
  }

  // 设置地图中心点及缩放级别
  setCenterAndZoom(center, zoom) {
    this.mapView.animate({
      center,
      zoom,
      duration: 1000
    });
    this.map.render()
  }

  /** END 地图缩放操作 */

  /** START 地图图层操作  */
  setLayerVisibility(name, isVisible) {
    this.layerApi.setLayerVisibility(name, isVisible);
  }
  /** END 地图图层操作 */

}

export default mapOper;
