import {
    mapApi
} from './main.js';
import mapTemplete from '../templates/map.html';

// 添加模版到body中
$(".page-4-1").append(mapTemplete);
// 执行地图初始化
window.mapApi = new mapApi();
window.mapApi.init();