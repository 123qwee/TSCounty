import olVectorSource from '../../static/ol/source/Vector.js'
import olTileGrid from '../../static/ol/tilegrid/TileGrid.js';
import olImageSource from '../../static/ol/source/TileImage.js';
import TileLayer from '../../static/ol/layer/Tile.js';
export class layerOper {
  constructor(map) {
    this.map = map;
  }
  /********************************************************************************************** */
  // 自定义分辨率和瓦片坐标系
  //     var resolutions = [];
  // var maxZoom = 18;
  // // 计算百度使用的分辨率
  // for (var i = 0; i <= maxZoom + 1; i++) {
  //   resolutions[i] = Math.pow(2, maxZoom - i);
  // }
  // var tilegrid = new ol.tilegrid.TileGrid({
  //   origin: [0, 0], // 设置原点坐标
  //   resolutions: resolutions // 设置分辨率
  // });
  // // 创建百度行政区划
  // var baiduSource = new ol.source.TileImage({
  //   tileGrid: tilegrid,
  //   tileUrlFunction: function (tileCoord, pixelRatio, proj) {
  //     var z = tileCoord[0];
  //     var x = tileCoord[1];
  //     var y = tileCoord[2];

  //     // 百度瓦片服务url将负数使用M前缀来标识
  //     if (x < 0) {
  //       x = 'M' + (-x);
  //     }
  //     if (y < 0) {
  //       y = 'M' + (-y);
  //     }

  //     // return "http://online0.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20170115&scaler=1&p=1";
  //     //street
  //     return 'http://online' + parseInt(Math.random() * 10) + '.map.bdimg.com/onlinelabel/?qt=tile&x=' +
  //       x + '&y=' + y + '&z=' + z + '&styles=pl&udt=20170620&scaler=1&p=1';
  //   }
  // });
  // // 百度影像
  // var baiduSourceRaster = new ol.source.TileImage({
  //   tileGrid: tilegrid,
  //   tileUrlFunction: function (tileCoord, pixelRatio, proj) {
  //     var z = tileCoord[0];
  //     var x = tileCoord[1];
  //     var y = tileCoord[2];

  //     // 百度瓦片服务url将负数使用M前缀来标识
  //     if (x < 0) {
  //       x = 'M' + (-x);
  //     }
  //     if (y < 0) {
  //       y = 'M' + (-y);
  //     }
  //     return 'http://shangetu' + parseInt(Math.random() * 10) + '.map.bdimg.com/it/u=x=' + x +
  //       ';y=' + y + ';z=' + z + ';v=009;type=sate&fm=46&udt=20170606';
  //   }
  // });
  // // 百度标注
  // var baiduSourceLabel = new ol.source.TileImage({
  //   tileGrid: tilegrid,
  //   tileUrlFunction: function (tileCoord, pixelRatio, proj) {
  //     var z = tileCoord[0];
  //     var x = tileCoord[1];
  //     var y = tileCoord[2];

  //     // 百度瓦片服务url将负数使用M前缀来标识
  //     if (x < 0) {
  //       x = 'M' + (-x);
  //     }
  //     if (y < 0) {
  //       y = 'M' + (-y);
  //     }
  //     return 'http://online' + parseInt(Math.random() * 10) + '.map.bdimg.com/onlinelabel/?qt=tile&x=' +
  //       x + '&y=' + y + '&z=' + z + '&styles=sl&udt=20170620&scaler=1&p=1';
  //   }
  // });





  /********************************************************************************************** */
  createBaiduLayer(params) {
    let projection = ol.proj.get(params.projection);
    let resolutions = [];
    for (let i = 0; i < 19; i++) {
      resolutions[i] = Math.pow(2, 18 - i);
    }
    let tilegrid = new olTileGrid({
      origin: [0, 0],
      resolutions: resolutions
    });

    let baidu_source = new olImageSource({
      projection: projection,
      tileGrid: tilegrid,
      tileUrlFunction: function (tileCoord, pixelRatio, proj) {
        if (!tileCoord) {
          return "";
        }

        let z = tileCoord[0];
        let x = tileCoord[1];
        let y = tileCoord[2];

        if (x < 0) {
          x = "M" + (-x);
        }
        if (y < 0) {
          y = "M" + (-y);
        }
        let url = 'http://shangetu' + parseInt(Math.random() * 10) + '.map.bdimg.com/it/u=x=' + x +
          ';y=' + y + ';z=' + z + ';v=009;type=sate&fm=46&udt=20170606';
        // let url = params.url + "/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20151021&scaler=1&p=1";
        console.log(url)
        return url;
      }
    });

    let baiduLayer = new TileLayer({
      source: baidu_source
    });

    return baiduLayer;
  }
  createBaiduLayerlabel() {
    let resolutions = [];
    for (let i = 0; i < 19; i++) {
      resolutions[i] = Math.pow(2, 18 - i);
    }
    let tilegrid = new olTileGrid({
      origin: [0, 0],
      resolutions: resolutions
    });
    // // 百度标注
    var baiduSourceLabel = new ol.source.TileImage({
      tileGrid: tilegrid,
      tileUrlFunction: function (tileCoord, pixelRatio, proj) {
        var z = tileCoord[0];
        var x = tileCoord[1];
        var y = tileCoord[2];

        // 百度瓦片服务url将负数使用M前缀来标识
        if (x < 0) {
          x = 'M' + (-x);
        }
        if (y < 0) {
          y = 'M' + (-y);
        }
        return 'http://online' + parseInt(Math.random() * 10) + '.map.bdimg.com/onlinelabel/?qt=tile&x=' +
          x + '&y=' + y + '&z=' + z + '&styles=sl&udt=20170620&scaler=1&p=1';
      }
    });
    let baiduLayer = new TileLayer({
      source: baiduSourceLabel
    });

    return baiduLayer;
  }

  /**
   * 创建WMTS图层
   * @param {*} params 
   */
  createWmtsLayer(params) {
    return new ol.layer.Tile({
      title: params.name,
      visible: params.isVisible,
      source: new ol.source.XYZ({
        url: params.url,
        tileUrlFunction: function (tileCoord) {
          let x = tileCoord[1]
          let y = -tileCoord[2] - 1;
          let l = tileCoord[0];
          let url = params.url.replace('{x}', x).replace('{y}', y).replace(
            '{z}',
            l);
          return url;
        }
      })
    });
  }

  /**
   * 创建WMS图层
   * @param {*} params 
   */
  createWmsLayer(params) {
    let projection = ol.proj.get(params.projection);
    const wmsSource = new ol.source.ImageWMS({
      url: params.url,
      params: {
        'LAYERS': params.layers,
        'VERSION': '1.1.0'
      },
      serverType: 'geoserver',
    });

    const wmsLayer = new ol.layer.Image({
      name: params.name,
      source: wmsSource,
      visible: params.isVisible
    });
    return wmsLayer;
  }

  /**
   * 创建Vector矢量图层
   * @param {*} params 
   */
  createVectorLayer(params) {

    // 设置矢量图层样式
    const style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    });

    const vectorLayer = new ol.layer.Vector({
      name: params.name,
      source: new olVectorSource(),
      visible: params.isVisible,
      style: [style]
    });

    return vectorLayer;
  }

  /**
   * 根据WFS服务创建矢量图层
   * @param {*} params 
   */
  createVectorLayerByWFS(params) {
    // 配置点图层所用样式图片
    const style = new ol.style.Style({
      image: new ol.style.Icon({
        src: params.styleImg
      })
    });

    const source = new ol.source.Vector({
      url: params.url + "?" +
        'service=WFS&' +
        'version=1.0.0&' +
        'request=GetFeature&' +
        'typeNames=' + params.layers + "&" +
        'outputFormat=json&' +
        'srsname=' + params.projection,
      format: new ol.format.GeoJSON()
    })

    const vectorLayer = new ol.source.Vector({
      name: params.name,
      source: source,
      preload: Infinity,
      visible: params.isVisible,
      style: [style]
    });
    return vectorLayer;
  }

  /**
   * 根据Name获取图层
   * @param {*} name 
   */
  getLayerByName(name) {
    let layers = this.map.getLayers().getArray();
    let layer = null;

    for (let i = 0; i < layers.length; i++) {
      if (layers[i].get('name') == name) {
        layer = layers[i];
        break;
      }
    }

    return layer;
  }

  /**
   * 添加图层到地图
   * @param {*} layer 
   */
  addLayer(layer) {
    this.map.addLayer(layer);
  }

  /**
   * 设置图层可见性
   * @param {*} name 图层名称
   * @param {*} isVisible 可见性
   */
  setLayerVisibility(name, isVisible = false) {
    let layer = this.getLayerByName(name);
    layer.setVisible(isVisible);
  }
}
