let myChart = echarts.init(document.getElementById('echart-connectivity'));

function connectivityChart(data) {
    $('.echartsWrapper').show();

    let dataChart = {
        "a": 0,
        "b": 0,
        "c": 0,
        "d": 0,
        "e": 0
    };

    data.features.forEach(function (value) {
        let frequencyNum = value.properties.FREQUENCY;
        if (frequencyNum === 0) {
            dataChart.a += 1;
        } else if (frequencyNum > 0 && frequencyNum <= 1) {
            dataChart.b += 1;
        } else if (frequencyNum > 1 && frequencyNum <= 3) {
            dataChart.c += 1;
        } else if (frequencyNum > 3 && frequencyNum <= 5) {
            dataChart.d += 1;
        } else {
            dataChart.e += 1;
        }
    });


    option = {
        title: {
            text: '路段重复系数比例图',
            x: 'center',
            textStyle: {
                color:'#999'
            },
            top: 20
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        toolbox: {
            show: false
        },
        calculable: true,
        series: [
            {
                name: '路段重复系数比例',
                type: 'pie',
                radius: [30, 110],
                center: ['50%', '50%'],
                roseType: 'area',
                x: '10%',               // for funnel
                max: 40,                // for funnel
                sort: 'ascending',     // for funnel
                data: [
                    {value: dataChart.e, name: '大于5'},
                    {value: dataChart.d, name: '3-5'},
                    {value: dataChart.c, name: '1-3'},
                    {value: dataChart.b, name: '1'},
                ]
            }
        ]
    };
    myChart.setOption(option);
}
