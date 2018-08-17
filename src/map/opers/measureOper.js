class measureOper {

  constructor(map) {
    this.map = map;
    this.draw = null;

    this.sketch = null;

    // 量算提示信息
    this.startDrawMsg = "请在地图上单击，开始绘制。";
    this.continuePolygonMsg = "单击继续绘制，双击结束。";
    this.continueLineMsg = "单击继续绘制，双击结束";

    // 量算提示Div
    this.helpTooltip = null;
    this.helpTooltipElement = null;

    this.measureTooltip = null;
    this.measureTooltipElement = null;

    this.source = null;
    // this.sphere = new ol.Sphere(6378137);

  }

  // 初始化量算样式
  initMeasureStyle() {
    // 设置绘图样式
    const stroke = new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      lineDash: [10, 10],
      width: 2
    });

    const image = new ol.style.Circle({
      radius: 5,
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.7)'
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      })
    });
    const style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke,
      image
    });
    return style;
  }

  /**
   * 激活距离量算
   * @param {*} source 
   */
  activeMeasureLength(source) {

    const style = this.initMeasureStyle();

    this.deactiveMeasure();
    this.source = source;

    // 创建绘图对象
    this.draw = new ol.interaction.Draw({
      source,
      style: [style],
      type: "LineString"
    });

    this.map.addInteraction(this.draw);

    // 添加地图移动事件
    this.addMapMoveEvent();

    // 创建提示信息
    this.createMeasureTooltip();
    this.createHelpTooltip();

    this.addDrawEvent();

  }

  /**
   * 激活面积量算
   * @param {*} source 
   */
  activeMeasureArea(source) {
    const style = this.initMeasureStyle();

    this.deactiveMeasure();

    // 创建绘图对象
    this.draw = new ol.interaction.Draw({
      source,
      style: [style],
      type: "Polygon"
    });

    this.map.addInteraction(this.draw);

    // 添加地图移动事件
    this.addMapMoveEvent();

    // 创建提示信息
    this.createMeasureTooltip();
    this.createHelpTooltip();

    this.addDrawEvent();
  }

  /** 取消地图量算 */
  deactiveMeasure() {
    // 移除绘图交互
    this.draw && this.map.removeInteraction(this.draw);
    // 移除提示
    this.map.getOverlays().clear();
    // 移除已绘制图形
    this.source && this.source.clear();
  }

  /**
   * 添加绘图事件
   */
  addDrawEvent() {

    var listener;
    let that = this;

    // 创建绘图事件
    this.draw.on('drawstart',
      (evt) => {
        // set sketch
        this.sketch = evt.feature;

        /** @type {ol.Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;

        listener = this.sketch.getGeometry().on('change', function (evt) {

          var geom = evt.target;
          var output;
          if (geom.getType() == "Polygon") {
            output = that.formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom.getType() == "LineString") {
            output = that.formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          }
          that.measureTooltipElement.innerHTML = output;
          that.measureTooltip.setPosition(tooltipCoord);
        });
      }, this);

    this.draw.on('drawend',
      () => {
        that.measureTooltipElement.className = 'tooltip tooltip-static';
        that.measureTooltip.setOffset([0, -7]);
        // unset sketch
        that.sketch = null;
        // unset tooltip so that a new one can be created
        that.measureTooltipElement = null;
        that.createMeasureTooltip();
        ol.Observable.unByKey(listener);

      }, this);
  }

  /**
   * 添加地图移动事件
   */
  addMapMoveEvent() {
    this.map.on('pointermove', (evt) => {
      if (evt.dragging) {
        return;
      }

      /** @type {string} */
      var helpMsg = this.startDrawMsg;

      if (this.sketch) {
        var geom = (this.sketch.getGeometry());
        if (geom.getType() == "Polygon") {
          helpMsg = this.continuePolygonMsg;
        } else if (geom.getType() == "LineString") {
          helpMsg = this.continueLineMsg;
        }
      }

      this.helpTooltipElement.innerHTML = helpMsg;
      this.helpTooltip.setPosition(evt.coordinate);

      this.helpTooltipElement.classList.remove('hidden');
    });
  }

  /**
   * 计算长度
   * @param {*} line 
   */
  formatLength(line) {

    //获取坐标串  
    let coordinates = line.getCoordinates();
    //初始长度为0  
    let length = 0;
    //获取源数据的坐标系  
    var sourceProj = this.map.getView().getProjection();
    //进行点的坐标转换  
    // for (let i = 0; i < coordinates.length - 1; i++) {
    //   //第一个点  
    //   let c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
    //   //第二个点  
    //   let c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
    //   //获取转换后的球面距离  
    //   //Returns the distance from c1 to c2 using the haversine formula.  
    //   debugger
    //   length += this.sphere.haversineDistance(c1, c2);
    // }

    // var length = olSphere.getLength(line) * 6378137;

    length = ol.sphere.getLength(line) * 6378137;

    var output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
    }
    return output;
  };


  /**
   * 计算面积
   * @param {*} polygon 
   */
  formatArea(polygon) {
    var sourceProj = this.map.getView().getProjection();
    //Make a complete copy of the geometry.  
    //Transform each coordinate of the geometry from one coordinate reference system to another.   
    //The geometry is modified in place. For example, a line will be transformed to a line and a circle to a circle.  
    //If you do not want the geometry modified in place, first clone() it and then use this function on the clone.  
    //克隆该几何对象然后转换坐标系  
    var geom = polygon.clone().transform(sourceProj, 'EPSG:4326');
    //Return the Nth linear ring of the polygon geometry.   
    //Return null if the given index is out of range.   
    //The exterior linear ring is available at index 0 and the interior rings at index 1 and beyond.  
    //获取多边形的坐标系  
    var coordinates = geom.getLinearRing(0).getCoordinates();
    //Returns the geodesic area for a list of coordinates.  
    //获取球面面积  
    var area = Math.abs(this.sphere.geodesicArea(coordinates));

    var output;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
    }
    return output;
  };

  /**
   * 创建量测帮助提示
   */
  createHelpTooltip() {
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }

    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'tooltip hidden';
    this.helpTooltip = new ol.Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });
    this.map.addOverlay(this.helpTooltip);
  }

  /**
   * 创建量测结果提示
   */
  createMeasureTooltip() {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }

    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'tooltip tooltip-measure';
    this.measureTooltip = new ol.Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    this.map.addOverlay(this.measureTooltip);
  }
}

export default measureOper;