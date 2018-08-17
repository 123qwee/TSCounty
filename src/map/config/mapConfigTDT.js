var mapConfig = {
  domId: 'map',
  centerX: 105.682167921712,
  centerY: 34.5739567124737,
  // centerX: 12959773,
  // centerY: 4853101,
  zoomLevel: 16,
  projection: 'EPSG:4326',
  minZoom: 1,
  maxZoom: 18,
  // 默认全国范围
  bounds: [122.35473632896162, 31.341247558929496, 122.35748291099287,
    31.34399414096076
  ],
  initLayers: [
    {
      id: '100',
      name: '基础底图-天地图影像',
      type: 'WMTS',
      url: 'http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}',
      projection: 'EPSG:4326',
      isLoad: true,
      isVisible: true
    },
    {
      id: '101',
      name: '基础底图-天地图标注',
      type: 'WMTS',
      url: 'http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}',
      projection: 'EPSG:4326',
      isLoad: true,
      isVisible: true
    },
    {
      id: '201',
      name: '默认矢量图层',
      type: 'Vector',
      isLoad: true,
      isVisible: true,
    },
    {
      id: '202',
      name: '默认标记图层',
      type: 'Vector',
      isLoad: true,
      isVisible: true,
    },
    {
      id: '301',
      name: '',
      type: 'WMS',
      url: '',
      projection: 'EPSG:4326',
      isLoad: true,
      isVisible: true,
      layers: '',
    },
  ],
}

export default mapConfig;
