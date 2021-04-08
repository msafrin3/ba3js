var ba3 = {
    // color_scheme: 'steelblue',
    color_scheme: "#1d639e",
    // dark_color: '#181c29',
    dark_color: '#25282c',
    renderedCharts: [],
    theme: "light",
    returnColor: function(data) {
        var scale = chroma.scale(['#a8b5d8', this.color_scheme]);
        var max = data[0];
        var perc = [];
        data.forEach(function(v,i) {
            var color = scale(v/max).hex();
            perc.push(color);
        });
        
        return perc;
    },
    returnThemeColor: function() {
        var color = '';
        if(this.theme == 'dark') {
            color =  '#ffff'
        } else if(this.theme == 'light') {
            color =  '#000'
        }
        return color;
    },
    toggleTheme: function() {
        var theme = this.theme;
        if(theme == 'dark') {
            this.setTheme('light');
        } else {
            this.setTheme('dark');
        }
    },
    setTheme: function(theme) {
        this.theme = theme;
        if(theme == 'dark') {
            $("body").css({background: this.dark_color, color: 'white'});
            $(".text-theme").css({fill: 'white'});
            $(".highcharts-axis-labels text").css({fill: 'white'});
        } else if(theme == 'light') {
            $("body").css({background: 'white', color: 'black'});
            $(".text-theme").css({fill: 'black'});
            $(".highcharts-axis-labels text").css({fill: 'black'});
        }
    },
    returnArrayFormat: function(data) {
        var arr = Object.keys(data[0]);
        var obj = {};
        arr.forEach(function(v,i) {
            obj[v] = [];
        });
        
        data.forEach(function(value,index) {
            $.each(value, function(i,v) {
                obj[i].push(v);
            });
        });

        return obj;
    },
    random: function(char) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < char; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    renderBarchart: function(options) {
        var that = Highcharts.chart(options.el, {
            chart: {
                type: 'bar',
                height: (18*options.data[0].data.length) + 60,
                width: 250,
                backgroundColor: 'transparent'
            },
            colors: this.returnColor(options.data[0].data),
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            title: {
                text: '<span class="text-theme">'+options.title+'</span>',
                style: {
                    fontFamily: 'arial',
                    fontSize: 14
                }
            },
            subtitle: {
                // text: '<span class="text-theme">'+options.subtitle+'</span>',
                text: '',
                style: {
                    fontFamily: 'arial',
                    fontSize: '12px'
                }
            },
            xAxis: {
                categories: options.categories,
                lineWidth: 0,
                labels: {
                    formatter: function() {
                        return '<span class="text-theme">'+this.value+'</span>'
                    },
                    style: {
                        fontSize: '12px',
                        color: this.returnThemeColor()
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                labels: {
                    enabled: false,
                    formatter: function() {
                        return '<span class="text-theme">'+this.value+'</span>'
                    },
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    // pointWidth: 18,
                    cursor: 'pointer',
                    stacking: 'normal',
                    groupPadding: 0,
                    // pointPadding: 0.01,
                    events: {
                        click: function(e) {
                            console.log(e);
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        align: 'right',
                        defer: false,
                        inside: false,
                        x: 20,
                        style: {
                            color: this.returnThemeColor(),
                            fontFamily: 'arial',
                            fontWeight: 1,
                            textOutline: 0
                        },
                        formatter: function() {
                            return '<span class="text-theme">'+this.y+'</span>'
                        }
    
                    },
                    borderWidth: 0,
                    // borderColor: 'transparent'
                    // pointWidth: 18,
                }
            },
            series: options.data
        });
    
        this.renderedCharts.push(that);
    },
    renderBarchart2: function(options) {
        var color_scheme = this.color_scheme;
        var obj = this.returnArrayFormat(options.data);
        var colors = this.returnColor(obj.value);
        var tr = '';
        var max = options.data[0].value;
        var uniqid = this.random(6);
        $.each(options.data, function(index,value) {
            var perc = value.value/max;
            tr += '<tr>'+
                '<td class="td-title">' + value.key + '</td>'+
                '<td class="td-flex"><div id="bar'+uniqid+'_'+index+'" class="bar" style="background:'+color_scheme+';width:1px;opacity:'+perc+';"></div><div style="padding-left: 4px">' + value.value + '</div></td>'+
            '</tr>'
        });
        $('#'+options.el).html('<table class="table-barchart">' + tr + '</table>');
        $.each(options.data, function(index,value) {
            var width = value.value/max*100;
            $("#bar"+uniqid+"_"+index).css({width: width+'%'});
        });
    },
    renderTimeseries: function() {
        var thats = this;
        Highcharts.getJSON(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json',
            function (data) {
    
                var that = Highcharts.chart('timeseries', {
                    credits: {
                        enabled: false
                    },
                    colors: [this.color_scheme],
                    exporting: {
                        enabled: false
                    },
                    chart: {
                        zoomType: 'x',
                        backgroundColor: 'transparent'
                    },
                    title: {
                        text: '<span class="text-theme">USD to EUR exchange rate over time</span>',
                        style: {
                            fontSize: 14
                        }
                    },
                    subtitle: {
                        text: '<span class="text-theme">Click and drag in the plot area to zoom in</span>'
                    },
                    xAxis: {
                        type: 'datetime',
                        events: {
                            afterSetExtremes: function(e) {
                                thats.setTheme(thats.theme);
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, thats.color_scheme],
                                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },
    
                    series: [{
                        type: 'area',
                        name: 'USD to EUR',
                        data: data
                    }]
                });
                thats.renderedCharts.push(that);
            }
        );
    },
    renderPie: function() {
        // Make monochrome colors
        var pieColors = (function () {
            var _colors = [],
                base = this.color_scheme,
                i;

            for (i = 0; i < 10; i += 1) {
                // Start out with a darkened base color (negative brighten), and end
                // up with a much brighter color
                _colors.push(Highcharts.color(base).brighten(i / 12).get());
            }
            return _colors;
        }());
        var data = [{
            name: 'Chrome',
            y: 61.41
        }, {
            name: 'Internet Explorer',
            y: 11.84
        }, {
            name: 'Firefox',
            y: 10.85
        }, {
            name: 'Edge',
            y: 4.67
        }, {
            name: 'Safari',
            y: 4.18
        }, {
            name: 'Sogou Explorer',
            y: 1.64
        }, {
            name: 'Opera',
            y: 1.6
        }, {
            name: 'QQ',
            y: 1.2
        }, {
            name: 'Other',
            y: 2.61
        }];
        var data_color = [61.41,11.84,10.85,4.67,4.18,2.16,1.64,1.6,1.2];
        var that = Highcharts.chart('piechart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                backgroundColor: 'transparent'
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            title: {
                text: '<span class="text-theme">Browser market shares in January, 2018</span>',
                style: {
                    color: this.returnThemeColor(),
                    fontSize: 14
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    borderWidth: 0,
                    colors: pieColors,
                    dataLabels: {
                        enabled: true,
                        format: '<span class="text-theme" style="font-size: 12px">{point.name}: {point.percentage:.1f} %</span>',
                        style: {
                            color: this.returnThemeColor(),
                            fontFamily: 'arial',
                            fontWeight: 1,
                            textOutline: 0,
                            fontSize: '11px'
                        },
                    }
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: data
            }]
        });
        this.renderedCharts.push(that);
    }
}

$(".ba3-toggle-theme").click(function() {
    ba3.toggleTheme();
});

// function returnColor(data) {
//     var scale = chroma.scale(['#a8b5d8', color_scheme]);
//     var max = data[0];
//     var perc = [];
//     data.forEach(function(v,i) {
//         var color = scale(v/max).hex();
//         perc.push(color);
//     });
    
//     return perc;
// }

// function returnThemeColor() {
//     color = '';
//     if(theme == 'dark') {
//         color =  '#ffff'
//     } else if(theme == 'light') {
//         color =  '#000'
//     }
//     return color;
// }

// function toggleTheme() {
//     if(theme == 'dark') {
//         theme = 'light';
//         $("body").css({background: 'white', color: 'black'});
//         // $.each(renderedCharts, function(index,value) {
//         //     value.update(barchart_light);
//         // });
//     } else if(theme == 'light') {
//         theme = 'dark';
//         $("body").css({background: dark_color, color: 'white'});
//         // $.each(renderedCharts, function(index,value) {
//         //     value.update(barchart_dark);
//         // });
//     }

//     renderedCharts.forEach(function(value, index) {
//         if(value.types[0] == 'area') {
//             value.update({
//                 xAxis: {
//                     labels: {
//                         style: {
//                             color: returnThemeColor()
//                         }
//                     }
//                 }
//             });
//         }
//     });

//     $(".text-theme").toggleClass("text-for-dark");
// }

// function setTheme(t) {
//     theme = t;
//     if(t == 'light') {
//         $("body").css({background: 'white', color: 'black'});
//     } else if(t == 'dark') {
//         $("body").css({background: dark_color, color: 'white'});
//     }
// }

// function renderBarchart(el, title, subtitle, categories, data) {
//     var that = Highcharts.chart(el, {
//         chart: {
//             type: 'bar',
//             height: (18*data[0].data.length) + 70,
//             width: 250,
//             backgroundColor: 'transparent'
//         },
//         colors: returnColor(data[0].data),
//         credits: {
//             enabled: false
//         },
//         exporting: {
//             enabled: false
//         },
//         title: {
//             text: '<span class="text-theme">'+title+'</span>',
//             style: {
//                 fontFamily: 'arial',
//                 fontSize: 14
//             }
//         },
//         subtitle: {
//             text: '<span class="text-theme">'+subtitle+'</span>',
//             style: {
//                 fontFamily: 'arial',
//                 fontSize: '12px'
//             }
//         },
//         xAxis: {
//             categories: categories,
//             lineWidth: 0,
//             labels: {
//                 formatter: function() {
//                     return '<span class="text-theme">'+this.value+'</span>'
//                 },
//                 style: {
//                     fontSize: '12px',
//                     color: returnThemeColor()
//                 }
//             }
//         },
//         yAxis: {
//             min: 0,
//             title: {
//                 text: ''
//             },
//             gridLineWidth: 0,
//             labels: {
//                 enabled: false,
//                 formatter: function() {
//                     return '<span class="text-theme">'+this.value+'</span>'
//                 },
//             }
//         },
//         legend: {
//             enabled: false
//         },
//         plotOptions: {
//             series: {
//                 cursor: 'pointer',
//                 stacking: 'normal',
//                 groupPadding: 0,
//                 // pointPadding: 0,
//                 events: {
//                     click: function(e) {
//                         console.log(e);
//                     }
//                 },
//                 dataLabels: {
//                     enabled: true,
//                     align: 'right',
//                     defer: false,
//                     inside: false,
//                     x: 20,
//                     style: {
//                         color: returnThemeColor(),
//                         fontFamily: 'arial',
//                         fontWeight: 1,
//                         textOutline: 0
//                     },
//                     formatter: function() {
//                         return '<span class="text-theme">'+this.y+'</span>'
//                     }

//                 },
//                 borderWidth: 0,
//                 // borderColor: 'transparent'
//                 // pointWidth: 18,
//             },
//         },
//         series: data
//     });

//     renderedCharts.push(that);
// }

// function renderTimeseries() {
//     Highcharts.getJSON(
//         'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json',
//         function (data) {

//             var that = Highcharts.chart('timeseries', {
//                 credits: {
//                     enabled: false
//                 },
//                 colors: [color_scheme],
//                 exporting: {
//                     enabled: false
//                 },
//                 chart: {
//                     zoomType: 'x',
//                     backgroundColor: 'transparent'
//                 },
//                 title: {
//                     text: '<span class="text-theme">USD to EUR exchange rate over time</span>',
//                     style: {
//                         fontSize: 14
//                     }
//                 },
//                 subtitle: {
//                     text: '<span class="text-theme">Click and drag in the plot area to zoom in</span>'
//                 },
//                 xAxis: {
//                     type: 'datetime',
//                     labels: {
//                         style: {
//                             color: returnThemeColor()
//                         },
//                         // formatter: function() {
//                         //     console.log(this);
//                         // }
//                     }
//                 },
//                 yAxis: {
//                     title: {
//                         text: ''
//                     },
//                     labels: {
//                         style: {
//                             color: returnThemeColor()
//                         },
//                         formatter: function() {
//                             return '<span class="text-theme">'+this.value+'</span>'
//                         }
//                     }
//                 },
//                 legend: {
//                     enabled: false
//                 },
//                 plotOptions: {
//                     area: {
//                         fillColor: {
//                             linearGradient: {
//                                 x1: 0,
//                                 y1: 0,
//                                 x2: 0,
//                                 y2: 1
//                             },
//                             stops: [
//                                 [0, color_scheme],
//                                 [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
//                             ]
//                         },
//                         marker: {
//                             radius: 2
//                         },
//                         lineWidth: 1,
//                         states: {
//                             hover: {
//                                 lineWidth: 1
//                             }
//                         },
//                         threshold: null
//                     }
//                 },

//                 series: [{
//                     type: 'area',
//                     name: 'USD to EUR',
//                     data: data
//                 }]
//             });
//             renderedCharts.push(that);
//         }
//     );
    
// }

// function renderPie() {
//     // Make monochrome colors
//     var pieColors = (function () {
//         var _colors = [],
//             base = color_scheme,
//             i;

//         for (i = 0; i < 10; i += 1) {
//             // Start out with a darkened base color (negative brighten), and end
//             // up with a much brighter color
//             _colors.push(Highcharts.color(base).brighten(i / 12).get());
//         }
//         return _colors;
//     }());
//     var data = [{
//         name: 'Chrome',
//         y: 61.41
//     }, {
//         name: 'Internet Explorer',
//         y: 11.84
//     }, {
//         name: 'Firefox',
//         y: 10.85
//     }, {
//         name: 'Edge',
//         y: 4.67
//     }, {
//         name: 'Safari',
//         y: 4.18
//     }, {
//         name: 'Sogou Explorer',
//         y: 1.64
//     }, {
//         name: 'Opera',
//         y: 1.6
//     }, {
//         name: 'QQ',
//         y: 1.2
//     }, {
//         name: 'Other',
//         y: 2.61
//     }];
//     var data_color = [61.41,11.84,10.85,4.67,4.18,2.16,1.64,1.6,1.2];
//     var that = Highcharts.chart('piechart', {
//         chart: {
//             plotBackgroundColor: null,
//             plotBorderWidth: null,
//             plotShadow: false,
//             type: 'pie',
//             backgroundColor: 'transparent'
//         },
//         credits: {
//             enabled: false
//         },
//         exporting: {
//             enabled: false
//         },
//         title: {
//             text: '<span class="text-theme">Browser market shares in January, 2018</span>',
//             style: {
//                 color: returnThemeColor(),
//                 fontSize: 14
//             }
//         },
//         tooltip: {
//             pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//         },
//         accessibility: {
//             point: {
//                 valueSuffix: '%'
//             }
//         },
//         plotOptions: {
//             pie: {
//                 allowPointSelect: true,
//                 cursor: 'pointer',
//                 borderWidth: 0,
//                 colors: pieColors,
//                 dataLabels: {
//                     enabled: true,
//                     format: '<span class="text-theme" style="font-size: 12px">{point.name}: {point.percentage:.1f} %</span>',
//                     style: {
//                         color: returnThemeColor(),
//                         fontFamily: 'arial',
//                         fontWeight: 1,
//                         textOutline: 0,
//                         fontSize: '11px'
//                     },
//                 }
//             }
//         },
//         series: [{
//             name: 'Brands',
//             colorByPoint: true,
//             data: data
//         }]
//     });
//     renderedCharts.push(that);
// }