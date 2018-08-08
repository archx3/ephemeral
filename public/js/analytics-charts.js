/**
 * Created by arch on 11/14/16.
 */

(function ()
{

   let sources = ["Direct", "Search engines", "Social Networks"].map(Bee.String.toSentenceCase);
   let splineChart = new Highcharts.Chart(
      {
         chart       : {
            renderTo        : 'line-chart',
            type            : 'areaspline',
            options3d       : {
               enabled : false,
               alpha   : 45,
               beta    : 0
            },
            backgroundColor : "#fff"
         },
         colors      : [
            '#f45b5b',
            '#62ECBE',
            '#001097',
            '#e4d354',
            '#f7a35c',
            '#EC3454',
            '#9D4F36',
            '#f15c80',
            '#62ECBE',
            '#7cb5ec',
            '#434348',
            '#90ed7d',
            '#91e8e1',
            '#2598FF',
            ' #62ECBE'],
         title       : {
            text : 'Visitors'
         },
         subtitle    : {
            text  : 'Source: <a href="#">Barge Studios Stats</a>',
            style : {
               color : '#fff'
            }
         },
         xAxis       : {
            categories : sources,
            title      : {
               text : null
            },
            labels     : {
               style : {
                  color : '#000'
               }
            }
         },
         yAxis       : {
            min    : 0,
            title  : {
               text  : 'Actions (times)',
               align : 'high'
            },
            labels : {
               overflow : 'justify',
               style    : {
                  color : '#000'
               }
            }
         },
         tooltip     : {
            valueSuffix : ' times'
         },
         plotOptions : {
            allowPointSelect : true,
            cursor           : 'pointer',
            depth            : 35,
            dataLabels       : {
               enabled : true,
               format  : '{point.name}'
            },
            pointStart       : 2010
         },
         legend      : {
            layout          : 'horizontal',
            align           : 'left',
            verticalAlign   : 'bottom',
            x               : 20,
            y               : 0,
            floating        : false,
            borderWidth     : 0,
            backgroundColor : 'rgba(255, 255, 255, .5)',
            shadow          : false
         },
         credits     : {
            enabled : false
         },
         series      : [{
            name : 'Codes Scanned',
            data : [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
         }, {
            name : 'Codes Generated',
            data : [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
         }, {
            name : 'Cost Per Code',
            data : [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
         }]
      });
   let doughnutChart = new Highcharts.Chart(
      {
         chart       : {
            renderTo        : 'doughnut-chart',
            type            : 'pie',
            backgroundColor : "var(--normalBgColor)"
         },
         colors      : ['#ffcf02',
                        '#001097',
                        '#2598FF',
                        '#ff486b',
                        '#2b908f',
                        '#f45b5b',
                        '#91e8e1',
                        '#9D4F36',
                        '#7cb5ec',
                        '#434348',
                        '#90ed7d',
                        '#f7a35c',
                        '#8085e9',
                        '#f15c80 '],
         title       : {
            enabled : false,
            text    : 'Traffic Sources'
         },
         subtitle    : {
            text  : 'Source: <a href="#">chekkit.com</a>',
            style : {
               color : '#fff'
            }
         },
         xAxis       : {
            categories : sources,
            title      : {
               text  : 'Users',
               align : 'high'
            },
            labels     : {
               style : {
                  color : '#fff'
               }
            }
         },
         yAxis       : {
            min    : 0,
            title  : {
               text  : 'Actions (number of times)',
               align : 'high'
            },
            labels : {
               overflow : 'justify',
               style    : {
                  color : '#fff'
               }
            }
         },
         tooltip     : {
            valueSuffix : ' times'
         },
         plotOptions : {
            pie : {
               showInLegend : true,
               slicedOffset : 20,
               innerSize    : '60%',
               dataLabels   : {
                  enabled   : true,
                  formatter : function ()
                  {
                     return this.point.name + ' : ' +
                            //Highcharts.numberFormat(this.y, 0);
                            Highcharts.numberFormat(this.percentage) + ' %';
                  }
               }
            }
         },
         legend      : {
            layout          : 'horizontal',
            align           : 'left',
            verticalAlign   : 'bottom',
            // x: -30,
            // y: 10,
            floating        : false,
            backgroundColor : ('rgba(255, 255, 255, .5)'),
            shadow          : false
         },
         credits     : {
            enabled : false,
            href    : '#',
            text    : 'No Text to Show for now'
         },
         //series: createSeriesData(Actions2)
         series      : [{
            data : [{ name : "Direct", y : 30 }, { name : "Search engines", y : 269 },
                    { name : "Social Networks", y : 43 }]
         }]
      });

   let columnChart = new Highcharts.Chart(
      {
         chart       : {
            renderTo        : 'column-chart',
            type            : 'column',
            backgroundColor : "var(--normalBgColor)"
         },
         colors      : ['#73b8f4',
                        '#258bd8',
                        '#EC3454',
                        '#eae417',
                        '#f15c80',
                        '#2b908f',
                        '#f45b5b',
                        '#91e8e1',
                        '#2598FF',
                        '#9D4F36',
                        '#434348',
                        '#90ed7d',
                        '#f7a35c',
                        '#62ECBE'],
         title       : {
            text : 'Product Quarterly Performance'
         },
         subtitle    : {
            text  : 'Source: <a href="#">Barge Studios Stats</a>',
            style : {
               color : '#fff'
            }
         },
         xAxis       : {
            categories : [
               'March 2017',
               'June 2017',
               'Sept 2017',
               'December 2017',
               'March 2018',],
            title      : {
               text  : '',
               align : 'high'
            },
            labels     : {
               style : {
                  color : '#000'
               }
            }
         },
         yAxis       : {
            min    : 0,
            title  : {
               text  : 'Actions (number of times)',
               align : 'high'
            },
            labels : {
               overflow : 'justify',
               style    : {
                  color : '#000'
               }
            }
         },
         tooltip     : {
            valueSuffix : ' times'
         },
         plotOptions : {
            bar : {
               dataLabels : {
                  enabled : true
               }
            }
         },
         legend      : {
            layout          : 'horizontal',
            align           : 'center',
            verticalAlign   : 'top',
            x               : 0,
            y               : 20,
            floating        : false,
            borderWidth     : 0,
            backgroundColor : ('rgba(255, 255, 255, .5)'),
            shadow          : false
         },
         credits     : {
            enabled : true,
            href    : '#',
            text    : 'Chekkit.com'
         },
         series      : [{
            name : 'Fanta Orange',
            data : [49.9, 71.5, 106.4, 129.2, 144.0,]
         }, {
            name : 'Shwepps Malt',
            data : [83.6, 78.8, 98.5, 93.4, 106.0,]
         }, {
            name : 'Coca Cola',
            data : [48.9, 38.8, 39.3, 41.4, 47.0,]
         }, {
            name : 'Sprite',
            data : [42.4, 33.2, 34.5, 39.7, 52.6,]
         }]
      });
})();


