import two from '../../templates/module/module.static.two.html';
import service from "../services/service.js";

export class staticTwo {
  init() {
    let that = this;
    $(".page-2").empty().append(two);
    that.getData();
    var agetime = that.random(60000, 180000);
    var dataInterval = setInterval(function () {
      that.getData();
    }, agetime);
    console.log("人口年龄获取数据时间", agetime);
    // 在1分钟至3分钟内任取时间
  };
  getData() {
    let that = this;
    service.requestAge(lscache.get('userName').communtiyCode, data => {
      let ageData = _.cloneDeep(data.data[0]);
      delete ageData.id;
      delete ageData.communityCode;
      var wAge = _.filter(ageData, (item, key) => {
        if (key.indexOf("wAge") != -1) {
          return true;
        }
      });
      var mAge = _.filter(ageData, (item, key) => {
        if (key.indexOf("mAge") != -1) {
          return true;
        }
      });
      that.createBars([wAge, mAge]);
    })
  }
  /**
* 产生随机整数，包含下限值，包括上限值
* @param {Number} lower 下限
* @param {Number} upper 上限
* @return {Number} 返回在下限到上限之间的一个随机整数
*/
  random(lower, upper) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }
  createBars(ageData) {
    let dom = $('.page-charts-1')[0];
    let myChart = echarts.init(dom);

    let legendData = ['0-9岁', '10-19岁', '20-29岁', '30-39岁', '40-49岁',
      '50-59岁', '60-69岁', '70-79岁', '80-89岁', '90-99岁', '100岁以上'
    ];

    let option = {
      baseOption: {
        legend: {
          data: [{
            name: '男',
            textStyle: {
              color: '#3A87F9',
              fontWeight: 600
            },

            icon: 'image:// ../../../../src/static/images/content/man.png'
          }, {
            name: '女',
            textStyle: {
              color: '#FF5F8F',
              fontWeight: 600
            },
            icon: 'image://../../../../src/static/images/content/woman.png'
          }],
          top: 0,
          itemGap: 80,
          itemWidth: 14,
          itemHeight: 14,
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{b}<br/>{a}: {c}人',
          axisPointer: {
            type: 'shadow',
          }
        },

        grid: [{
          show: false,
          left: '5%',
          top: 30,
          bottom: 10,
          containLabel: true,
          width: '35%',
        }, {
          show: false,
          left: '52.5%',
          top: 30,
          bottom: 10,
          width: '0%',
        }, {
          show: false,
          right: '5%',
          top: 30,
          bottom: 10,
          containLabel: true,
          width: '35%',
        },],

        xAxis: [{
          type: 'value',
          inverse: true,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          position: 'top',
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        }, {
          gridIndex: 1,
          show: false,
        }, {
          gridIndex: 2,
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          position: 'top',
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },],
        yAxis: [{
          type: 'category',
          inverse: false,
          position: 'right',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            margin: 8,
            textStyle: {
              color: '#9D9EA0',
              fontSize: 12,
            },
          },
          data: legendData,
        }, {
          gridIndex: 1,
          type: 'category',
          inverse: false,
          position: 'left',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#9ec9ff',
              fontSize: 12,
              align: 'center'
            },
          },
          data: _.map(legendData, item => {
            return {
              value: item,
              textStyle: {
                align: 'center',
              }
            }
          })
        }, {
          gridIndex: 2,
          type: 'category',
          inverse: false,
          position: 'left',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            textStyle: {
              color: '#9D9EA0',
              fontSize: 12,
            }
          },
          data: legendData,
        },],
        series: [{
          name: '男',
          type: 'bar',
          barGap: '40%',
          barWidth: '40%',
          label: {
            normal: {
              show: true,
              position: 'left'
            },
          },
          itemStyle: {
            normal: {
              color: '#3A87F9',
            },
            emphasis: {
              color: '#08C7AE',
            },
          },
          data: ageData[1],
        },
        {
          name: '女',
          type: 'bar',
          barGap: '40%',
          barWidth: '40%',
          xAxisIndex: 2,
          yAxisIndex: 2,
          label: {
            normal: {
              show: true,
              position: 'right'
            },
            emphasis: {
              show: true,
              position: 'right',
            },
          },
          itemStyle: {
            normal: {
              color: '#FF5F8F',
            },
            emphasis: {
              color: '#F94646',
            },
          },
          data: ageData[0],
        }
        ],

      }
    };
    if (option && typeof option === "object") {
      myChart.clear();
      myChart.setOption(option, true);
    }

    $(window).resize(() => {
      myChart.resize();
    });

    var app = {
      currentIndex: -1
    };
    var that = this;
    if (window.agetime) {
      _.map(ageBarHighInterval, item => {
        window.clearInterval(item);
      })
    } else {
      window.ageBarHighInterval = [];
      window.agetime = false;
    }
    ageBarHighInterval.push(setInterval(function () {
      agetime = true;

      // 取消之前高亮的图形
      var index = that.random(0, 1);
      var dataLen = ageData[index].length;
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: index,
        dataIndex: app.currentIndex
      });
      app.currentIndex = that.random(0, dataLen);
      // (app.currentIndex + 1) % dataLen;
      // 高亮当前图形
      myChart.dispatchAction({
        type: window.isHideTooltip == "showTip" ? 'highlight' : "downplay",
        seriesIndex: index,
        dataIndex: app.currentIndex
      });
      // 显示 tooltip
      myChart.dispatchAction({
        type: window.isHideTooltip,
        seriesIndex: index,
        dataIndex: app.currentIndex
      });
    }, 1000));
  }
}
