import {
  layerOper
} from './layerOper.js';

import olFeature from '../../static/ol/Feature.js';
import olPoint from '../../static/ol/geom/Point.js';


class markerOper {
  constructor(map) {
    this.map = map;

    // 初始化图层操作
    this.layerApi = new layerOper(this.map);
    // 默认图层名称
    this.defaultLayerName = "默认标记图层";

    this.defaultLayer = this.layerApi.getLayerByName(this.defaultLayerName);

    this.defaultSource = this.defaultLayer.getSource();

    // 设置案卷样式
    this.mStyles = {
      'redHot': new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          snapToPixel: false,
          fill: new ol.style.Fill({
            color: 'red'
          }),
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 2
          })
        })
      }),
      'curMarker': new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: '../../../src/map/images/map_marker.png',
        })
      })
    };
  }

  /**
   * 初始化图层样式
   */
  initLyStyle() {
    let that = this;

    this.defaultLayer.setStyle((feature) => {
      return that.mStyles[feature.get('type')];
    });

  }

  addMarker(params) {
    const marker = new olFeature({
      type: params.type,
      geometry: new olPoint([params.lon, params.lat])
    });

    marker.setStyle([this.mStyles[marker.get('type')]]);

    this.defaultSource.addFeature(marker);

    return marker;
  }

  addMarkers(markers) {
    let that = this;

    const features = _.map(markers, (item) => {
      return new olFeature({
        type: item.type,
        attr: item.attr,
        geometry: new olPoint([item.lon, item.lat]),
      });
    })

    _.map(features, (item) => {
      // debugger
      item.setStyle([that.mStyles[item.get('type')]]);
    })

    this.defaultSource.addFeatures(features);

    return features;
  }

  removeMarker(params) {
    // 设置默认矢量图层
    if (!params.layerName) {
      params.layerName = this.defaultLayerName;
    }

    const layer = this.layerApi.getLayerByName(params.layerName);
    layer.getSource().removeFeature(params.marker);
  }

  /**
   * 根据要素ID移除要素
   * @param {*} id 要素编号
   */
  removeMarkerById(id) {
    const layer = this.layerApi.getLayerByName(params.layerName);
    const source = layer.getSource();

    source.removeFeature(source.getFeatureById(id));
  }

  /**
   * 根据要素类型移除要素
   * @param {*} type 
   */
  removeMarkerByType(type) {
    let that = this;
    let features = this.defaultSource.getFeatures();

    _.map(features, (item) => {
      if (item.get('type') == 'redHot') {
        that.defaultSource.removeFeature(item);
      }
    })
  }

  removeMarkerByTypeAndTaskNum(type, taskNum) {
    let that = this;
    let features = this.defaultSource.getFeatures();

    for (let i = 0; i < features.length; i++) {
      if (features[i].get('type') == 'redHot' && features[i].get('taskNum') ==
        taskNum) {
        that.defaultSource.removeFeature(features[i]);
        break;
      }
    }
  }

  /**
   * 根据指定的属性移除marker
   * @param {*} type 
   * @param {*} attrs 
   */
  removeFeatureByAttrs(type, attrs) {
    let that = this;
    let features = this.defaultSource.getFeatures();
    let removeFeatures = [];

    for (let i = 0; i < features.length; i++) {
      let isRemove = true;

      for (let j = 0; j < attrs.length; j++) {
        if (features[i].get(attrs[j][0]) != attrs[j][1]) {
          isRemove = false;
        }
      }

      if (isRemove) {
        removeFeatures.push(features[i]);
      }
    }

    for (let i = 0; i < removeFeatures.length; i++) {
      that.defaultSource.removeFeature(removeFeatures[i]);
    }
  }

  /**
   * 获取所有marker点
   */
  getMarkers() {
    return this.defaultSource.getFeatures();
  }

  /**
   * 清空矢量图层上的所有元素
   * @param {*} layerName 
   */
  clearMarkers(layerName) {
    this.defaultLayer.getSource().clear();
  }

}

export default markerOper
