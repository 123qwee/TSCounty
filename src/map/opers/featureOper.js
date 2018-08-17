import olImageWms from '../../static/ol/source/ImageWMS.js';

import olFeature from '../../static/ol/Feature.js';
import olGeoPolygon from '../../static/ol/geom/Polygon.js';

import olStyle from '../../static/ol/style/Style.js';
import olStyleFill from '../../static/ol/style/Fill.js';

/**
 * @desc 要素操作
 */
class featureOper {
  constructor(map) {
    this.map = map;
  }
  queryWmsFeatureInfoUrl(wmsSource, coordinate, resolution,
    projection =
      'EPSG:4326', params = {
        INFO_FORMAT: 'application/json',
        FEATURE_COUNT: 1
      }) {
    let url = "";
    if (wmsSource instanceof ol.source.ImageWMS) {
      url = wmsSource.getGetFeatureInfoUrl(coordinate, resolution,
        projection,
        params);
    }
    return url;
  };

  /**
   * 添加多边形要素到矢量图层
   * @param {*} layer 图层
   * @param {*} polyCoords 多边形点串
   */
  addPolygon(props, layer, polyCoords) {
    polyCoords = polyCoords[0];
    let feature = new olFeature({
      geometry: new olGeoPolygon(polyCoords)
    });
    var fillColor = "";
    switch (props.COLORID) {
      case 1:
        fillColor = "rgba(255, 138, 31 , 0.6)";
        break;
      case 2:
        fillColor = "rgba(235, 210, 6 , 0.6)";
        break;
      case 3:
        fillColor = "rgba(64, 166, 255 , 0.6)";
        break;
      case 4:
        fillColor = "rgba(195, 40, 229 , 0.6)";
        break;
    }
    // 设置feature样式
    const style = new olStyle({
      fill: new olStyleFill({
        color: fillColor
      })
    });

    feature.setStyle([style]);

    layer.getSource().addFeature(feature);
  }

}

export default featureOper
