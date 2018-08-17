import three from '../../templates/module/module.static.three.html';
import service from "../services/service.js";

export class staticThree {
  init() {
    let that = this;
    $(".page-3").empty().append(three);
    that.getData();
    var keytime = that.random(60000, 180000);
    var dataInterval = setInterval(function () {
      that.getData();
    }, keytime);
    console.log("重点人群饼图获取数据时间", keytime);
    // 在1分钟至3分钟内任取时间

  };
  // 请求数据
  getData() {
    let that = this;
    service.requestKeyPeople(lscache.get('userName').communtiyCode, data => {
      let chartsData = [{
        value: data.data[0].drugAddicts,
        name: '吸毒人员'
      },
      {
        value: data.data[0].communityCorrection,
        name: '社区矫正人员'
      },
      {
        value: data.data[0].fullRelease,
        name: '刑满释放人员'
      },
      {
        value: data.data[0].mentalDisorder,
        name: '精神障碍人员'
      },
      {
        value: data.data[0].cult,
        name: '邪教人员'
      },
      {
        value: data.data[0].petition,
        name: '信访人员'
      },
      {
        value: data.data[0].litigation,
        name: '涉法涉诉信访人员'
      },
      {
        value: data.data[0].dangerousGoods,
        name: '危险品从业人员'
      }
      ];
      that.createBars(chartsData);
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
  createBars(data) {
    let dom = $('.page-charts-2')[0];
    let myChart = echarts.init(dom);

    let chartsData = data;

    let option = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      color: ['rgb(254,80,73)', 'rgb(249,191,81)', 'rgb(0,214,150)',
        'rgb(79,205,255)', 'rgb(58,135,250)', 'rgb(242,118,90)',
        'rgb(255,95,144)'
      ],
      series: [{
        name: '重点人群',
        type: 'pie',
        radius: '55%',
        center: ['50%', '55%'],
        data: chartsData,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: function (params) {
            return params.data.name + ":" + params.data.value + "人";
          },
          fontSize: 13,
        }
      }]
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
    if (window.keytime) {
      _.map(keyPieHighInterval, item => {
        window.clearInterval(item);
      })
    } else {
      window.keyPieHighInterval = [];
      window.keytime = false;
    }
    keyPieHighInterval.push(setInterval(function () {
      keytime = true;
      var dataLen = chartsData.length;
      // 取消之前高亮的图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: app.currentIndex
      });
      app.currentIndex = that.random(0, 6);
      // (app.currentIndex + 1) % dataLen;
      // 高亮当前图形
      myChart.dispatchAction({
        type: window.isHideTooltip == "showTip" ? 'highlight' : "downplay",
        seriesIndex: 0,
        dataIndex: app.currentIndex
      });
      // 显示 tooltip
      myChart.dispatchAction({
        type: window.isHideTooltip,
        seriesIndex: 0,
        dataIndex: app.currentIndex
      });
    }, 1000));


  }
}
