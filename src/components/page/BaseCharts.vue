<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-pie-chart"></i> 数据报表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
<!--            <div class="plugins-tips">-->
<!--                vue-schart：vue.js封装sChart.js的图表组件。-->
<!--                访问地址：-->
<!--                <a-->
<!--                    href="https://github.com/lin-xin/vue-schart"-->
<!--                    target="_blank"-->
<!--                >vue-schart</a>-->
<!--            </div>-->
            <div class="schart-box">
                <div class="content-title">柱状图</div>
                <schart class="schart" canvasId="bar" :options="options1"></schart>
            </div>
            <div class="schart-box">
                <div class="content-title">折线图</div>
                <schart class="schart" canvasId="line" :options="options2"></schart>
            </div>
            <div class="schart-box">
                <div class="content-title">饼状图</div>
                <schart class="schart" canvasId="pie" :options="options3"></schart>
            </div>
<!--            <div class="schart-box">-->
<!--                <div class="content-title">环形图</div>-->
<!--                <schart class="schart" canvasId="ring" :options="options4"></schart>-->
<!--            </div>-->
        </div>
    </div>
</template>

<script>
import Schart from 'vue-schart';
export default {
    name: 'basecharts',
    components: {
        Schart
    },
    data() {
        return {
            options1: {
                type: 'bar',
                title: {
                    text: '最近一周房价波动图'
                },
                bgColor: '#fbfbfb',
                labels: ['周一', '周二', '周三', '周四', '周五'],
                datasets: [
                    {
                        label: '标准单人间',
                        fillColor: 'rgba(241, 49, 74, 0.5)',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '豪华双人间',
                        data: [164, 178, 190, 135, 160]
                    },
                    {
                        label: '大床房',
                        data: [144, 198, 150, 235, 120]
                    },
                  {
                    label: '棋牌房',
                    data: [177, 198, 180, 210, 190]
                  }
                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '最近几个月酒店订单成交总额'
                },
                bgColor: '#fbfbfb',
                labels: ['6月', '7月', '8月', '9月', '10月'],
                datasets: [
                    {
                        label: '订单总额',
                        data: [150000, 200000, 270000, 160000, 250000]
                    }
                ]
            },
            options3: {
                type: 'pie',
                title: {
                    text: '最近一周酒店房型销售图'
                },
                legend: {
                    position: 'left'
                },
                bgColor: '#fbfbfb',
                labels: ['标准单人间', '豪华双人间', '大床房', '棋牌房', '套房'],
                datasets: [
                    {
                        data: [20, 15, 25, 23, 5]
                    }
                ]
            },
            // options4: {
            //     type: 'ring',
            //     title: {
            //         text: '环形三等分'
            //     },
            //     showValue: false,
            //     legend: {
            //         position: 'bottom',
            //         bottom: 40
            //     },
            //     bgColor: '#fbfbfb',
            //     labels: ['vue', 'react', 'angular'],
            //     datasets: [
            //         {
            //             data: [500, 500, 500]
            //         }
            //     ]
            // }
        };
    }
};
</script>

<style scoped>
.schart-box {
    display: inline-block;
    margin: 20px;
}
.schart {
    width: 600px;
    height: 400px;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
</style>
