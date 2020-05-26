/*
 Highstock JS v8.1.0 (2020-05-05)

 All technical indicators for Highstock

 (c) 2010-2019 Pawel Fus

 License: www.highcharts.com/license
*/
(function (k) {
    "object" === typeof module && module.exports ? (k["default"] = k, module.exports = k) : "function" === typeof define && define.amd ? define("highcharts/indicators/indicators-all", ["highcharts", "highcharts/modules/stock"], function (v) {
        k(v);
        k.Highcharts = v;
        return k
    }) : k("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function (k) {
    function v(e, f, l, h) {
        e.hasOwnProperty(f) || (e[f] = h.apply(null, l))
    }

    k = k ? k._modules : {};
    v(k, "mixins/indicator-required.js", [k["parts/Utilities.js"]], function (e) {
        var f = e.error;
        return {
            isParentLoaded: function (l,
                                      h, d, a, c) {
                if (l) return a ? a(l) : !0;
                f(c || this.generateMessage(d, h));
                return !1
            }, generateMessage: function (l, h) {
                return 'Error: "' + l + '" indicator type requires "' + h + '" indicator loaded before. Please read docs: https://api.highcharts.com/highstock/plotOptions.' + l
            }
        }
    });
    v(k, "indicators/indicators.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/indicator-required.js"]], function (e, f, l) {
        var h = f.addEvent, d = f.error, a = f.extend, c = f.isArray, b = f.pick, g = f.seriesType, t = f.splat,
            r = e.Series, m = e.seriesTypes,
            p = e.seriesTypes.ohlc.prototype, q = l.generateMessage;
        h(e.Series, "init", function (b) {
            b = b.options;
            b.useOhlcData && "highcharts-navigator-series" !== b.id && a(this, {
                pointValKey: p.pointValKey,
                keys: p.keys,
                pointArrayMap: p.pointArrayMap,
                toYData: p.toYData
            })
        });
        h(r, "afterSetOptions", function (b) {
            b = b.options;
            var c = b.dataGrouping;
            c && b.useOhlcData && "highcharts-navigator-series" !== b.id && (c.approximation = "ohlc")
        });
        g("sma", "line", {
                name: void 0,
                tooltip: {valueDecimals: 4},
                linkedTo: void 0,
                compareToMain: !1,
                params: {index: 0, period: 14}
            },
            {
                processData: function () {
                    var b = this.options.compareToMain, c = this.linkedParent;
                    r.prototype.processData.apply(this, arguments);
                    c && c.compareValue && b && (this.compareValue = c.compareValue)
                },
                bindTo: {series: !0, eventName: "updatedData"},
                hasDerivedData: !0,
                useCommonDataGrouping: !0,
                nameComponents: ["period"],
                nameSuffixes: [],
                calculateOn: "init",
                requiredIndicators: [],
                requireIndicators: function () {
                    var b = {allLoaded: !0};
                    this.requiredIndicators.forEach(function (c) {
                        m[c] ? m[c].prototype.requireIndicators() : (b.allLoaded = !1, b.needed =
                            c)
                    });
                    return b
                },
                init: function (b, c) {
                    function g() {
                        var b = a.points || [], c = (a.xData || []).length,
                            g = a.getValues(a.linkedParent, a.options.params) || {values: [], xData: [], yData: []},
                            d = [], n = !0;
                        if (c && !a.hasGroupedData && a.visible && a.points) if (a.cropped) {
                            if (a.xAxis) {
                                var m = a.xAxis.min;
                                var h = a.xAxis.max
                            }
                            c = a.cropData(g.xData, g.yData, m, h);
                            for (m = 0; m < c.xData.length; m++) d.push([c.xData[m]].concat(t(c.yData[m])));
                            c = g.xData.indexOf(a.xData[0]);
                            m = g.xData.indexOf(a.xData[a.xData.length - 1]);
                            -1 === c && m === g.xData.length - 2 && d[0][0] ===
                            b[0].x && d.shift();
                            a.updateData(d)
                        } else g.xData.length !== c - 1 && g.xData.length !== c + 1 && (n = !1, a.updateData(g.values));
                        n && (a.xData = g.xData, a.yData = g.yData, a.options.data = g.values);
                        !1 === a.bindTo.series && (delete a.processedXData, a.isDirty = !0, a.redraw());
                        a.isDirtyData = !1
                    }

                    var a = this, n = a.requireIndicators();
                    if (!n.allLoaded) return d(q(a.type, n.needed));
                    r.prototype.init.call(a, b, c);
                    b.linkSeries();
                    a.dataEventsToUnbind = [];
                    if (!a.linkedParent) return d("Series " + a.options.linkedTo + " not found! Check `linkedTo`.", !1,
                        b);
                    a.dataEventsToUnbind.push(h(a.bindTo.series ? a.linkedParent : a.linkedParent.xAxis, a.bindTo.eventName, g));
                    if ("init" === a.calculateOn) g(); else var m = h(a.chart, a.calculateOn, function () {
                        g();
                        m()
                    });
                    return a
                },
                getName: function () {
                    var c = this.name, a = [];
                    c || ((this.nameComponents || []).forEach(function (c, g) {
                        a.push(this.options.params[c] + b(this.nameSuffixes[g], ""))
                    }, this), c = (this.nameBase || this.type.toUpperCase()) + (this.nameComponents ? " (" + a.join(", ") + ")" : ""));
                    return c
                },
                getValues: function (b, a) {
                    var g = a.period, d =
                        b.xData;
                    b = b.yData;
                    var t = b.length, m = 0, n = 0, h = [], r = [], p = [], q = -1;
                    if (!(d.length < g)) {
                        for (c(b[0]) && (q = a.index ? a.index : 0); m < g - 1;) n += 0 > q ? b[m] : b[m][q], m++;
                        for (a = m; a < t; a++) {
                            n += 0 > q ? b[a] : b[a][q];
                            var l = [d[a], n / g];
                            h.push(l);
                            r.push(l[0]);
                            p.push(l[1]);
                            n -= 0 > q ? b[a - m] : b[a - m][q]
                        }
                        return {values: h, xData: r, yData: p}
                    }
                },
                destroy: function () {
                    this.dataEventsToUnbind.forEach(function (b) {
                        b()
                    });
                    r.prototype.destroy.apply(this, arguments)
                }
            });
        ""
    });
    v(k, "indicators/accumulation-distribution.src.js", [k["parts/Utilities.js"]], function (e) {
        var f =
            e.error;
        e = e.seriesType;
        e("ad", "sma", {params: {volumeSeriesID: "volume"}}, {
            nameComponents: !1, nameBase: "Accumulation/Distribution", getValues: function (l, h) {
                var d = h.period, a = l.xData, c = l.yData, b = h.volumeSeriesID, g = l.chart.get(b);
                h = g && g.yData;
                var t = c ? c.length : 0, r = [], m = [], p = [];
                if (!(a.length <= d && t && 4 !== c[0].length)) {
                    if (g) {
                        for (; d < t; d++) {
                            l = r.length;
                            b = c[d][1];
                            g = c[d][2];
                            var q = c[d][3], n = h[d];
                            b = [a[d], q === b && q === g || b === g ? 0 : (2 * q - g - b) / (b - g) * n];
                            0 < l && (b[1] += r[l - 1][1]);
                            r.push(b);
                            m.push(b[0]);
                            p.push(b[1])
                        }
                        return {
                            values: r,
                            xData: m, yData: p
                        }
                    }
                    f("Series " + b + " not found! Check `volumeSeriesID`.", !0, l.chart)
                }
            }
        });
        ""
    });
    v(k, "indicators/ao.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"]], function (e, f) {
        var l = f.correctFloat, h = f.isArray;
        f = f.seriesType;
        f("ao", "sma", {
            greaterBarColor: "#06B535",
            lowerBarColor: "#F21313",
            threshold: 0,
            groupPadding: .2,
            pointPadding: .2,
            crisp: !1,
            states: {hover: {halo: {size: 0}}}
        }, {
            nameBase: "AO",
            nameComponents: !1,
            markerAttribs: e.noop,
            getColumnMetrics: e.seriesTypes.column.prototype.getColumnMetrics,
            crispCol: e.seriesTypes.column.prototype.crispCol,
            translate: e.seriesTypes.column.prototype.translate,
            drawPoints: e.seriesTypes.column.prototype.drawPoints,
            drawGraph: function () {
                var d = this.options, a = this.points, c = d.greaterBarColor;
                d = d.lowerBarColor;
                var b = a[0];
                if (!this.userOptions.color && b) for (b.color = c, b = 1; b < a.length; b++) a[b].color = a[b].y > a[b - 1].y ? c : a[b].y < a[b - 1].y ? d : a[b - 1].color
            },
            getValues: function (d) {
                var a = d.xData || [];
                d = d.yData || [];
                var c = d.length, b = [], g = [], t = [], r = 0, m = 0, p;
                if (!(34 >= a.length) && h(d[0]) && 4 === d[0].length) {
                    for (p = 0; 33 > p; p++) {
                        var q = (d[p][1] +
                            d[p][2]) / 2;
                        29 <= p && (r = l(r + q));
                        m = l(m + q)
                    }
                    for (p = 33; p < c; p++) {
                        q = (d[p][1] + d[p][2]) / 2;
                        r = l(r + q);
                        m = l(m + q);
                        q = r / 5;
                        var n = m / 34;
                        q = l(q - n);
                        b.push([a[p], q]);
                        g.push(a[p]);
                        t.push(q);
                        q = p + 1 - 5;
                        n = p + 1 - 34;
                        r = l(r - (d[q][1] + d[q][2]) / 2);
                        m = l(m - (d[n][1] + d[n][2]) / 2)
                    }
                    return {values: b, xData: g, yData: t}
                }
            }
        });
        ""
    });
    v(k, "mixins/multipe-lines.js", [k["parts/Globals.js"], k["parts/Utilities.js"]], function (e, f) {
        var l = f.defined, h = f.error, d = f.merge, a = e.seriesTypes.sma;
        return {
            pointArrayMap: ["top", "bottom"], pointValKey: "top", linesApiNames: ["bottomLine"],
            getTranslatedLinesNames: function (c) {
                var b = [];
                (this.pointArrayMap || []).forEach(function (a) {
                    a !== c && b.push("plot" + a.charAt(0).toUpperCase() + a.slice(1))
                });
                return b
            }, toYData: function (c) {
                var b = [];
                (this.pointArrayMap || []).forEach(function (a) {
                    b.push(c[a])
                });
                return b
            }, translate: function () {
                var c = this, b = c.pointArrayMap, g = [], d;
                g = c.getTranslatedLinesNames();
                a.prototype.translate.apply(c, arguments);
                c.points.forEach(function (a) {
                    b.forEach(function (b, t) {
                        d = a[b];
                        null !== d && (a[g[t]] = c.yAxis.toPixels(d, !0))
                    })
                })
            }, drawGraph: function () {
                var c =
                        this, b = c.linesApiNames, g = c.points, t = g.length, r = c.options, m = c.graph,
                    p = {options: {gapSize: r.gapSize}}, q = [], n;
                c.getTranslatedLinesNames(c.pointValKey).forEach(function (b, c) {
                    for (q[c] = []; t--;) n = g[t], q[c].push({x: n.x, plotX: n.plotX, plotY: n[b], isNull: !l(n[b])});
                    t = g.length
                });
                b.forEach(function (b, g) {
                    q[g] ? (c.points = q[g], r[b] ? c.options = d(r[b].styles, p) : h('Error: "There is no ' + b + ' in DOCS options declared. Check if linesApiNames are consistent with your DOCS line names." at mixin/multiple-line.js:34'), c.graph =
                        c["graph" + b], a.prototype.drawGraph.call(c), c["graph" + b] = c.graph) : h('Error: "' + b + " doesn't have equivalent in pointArrayMap. To many elements in linesApiNames relative to pointArrayMap.\"")
                });
                c.points = g;
                c.options = r;
                c.graph = m;
                a.prototype.drawGraph.call(c)
            }
        }
    });
    v(k, "indicators/aroon.src.js", [k["parts/Utilities.js"], k["mixins/multipe-lines.js"]], function (e, f) {
        function l(a, c) {
            var b = a[0], g = 0, d;
            for (d = 1; d < a.length; d++) if ("max" === c && a[d] >= b || "min" === c && a[d] <= b) b = a[d], g = d;
            return g
        }

        var h = e.merge, d = e.pick;
        e = e.seriesType;
        e("aroon", "sma", {
            params: {period: 25},
            marker: {enabled: !1},
            tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span><b> {series.name}</b><br/>Aroon Up: {point.y}<br/>Aroon Down: {point.aroonDown}<br/>'},
            aroonDown: {styles: {lineWidth: 1, lineColor: void 0}},
            dataGrouping: {approximation: "averages"}
        }, h(f, {
            nameBase: "Aroon",
            pointArrayMap: ["y", "aroonDown"],
            pointValKey: "y",
            linesApiNames: ["aroonDown"],
            getValues: function (a, c) {
                c = c.period;
                var b = a.xData, g = (a = a.yData) ? a.length : 0, t = [], h = [], m = [], p;
                for (p = c - 1; p <
                g; p++) {
                    var q = a.slice(p - c + 1, p + 2);
                    var n = l(q.map(function (b) {
                        return d(b[2], b)
                    }), "min");
                    q = l(q.map(function (b) {
                        return d(b[1], b)
                    }), "max");
                    q = q / c * 100;
                    n = n / c * 100;
                    b[p + 1] && (t.push([b[p + 1], q, n]), h.push(b[p + 1]), m.push([q, n]))
                }
                return {values: t, xData: h, yData: m}
            }
        }));
        ""
    });
    v(k, "indicators/aroon-oscillator.src.js", [k["parts/Globals.js"], k["mixins/multipe-lines.js"], k["mixins/indicator-required.js"], k["parts/Utilities.js"]], function (e, f, l, h) {
        var d = h.merge;
        h = h.seriesType;
        var a = e.seriesTypes.aroon;
        h("aroonoscillator", "aroon",
            {
                params: {period: 25},
                tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span><b> {series.name}</b>: {point.y}'}
            }, d(f, {
                nameBase: "Aroon Oscillator",
                pointArrayMap: ["y"],
                pointValKey: "y",
                linesApiNames: [],
                init: function () {
                    var c = arguments, b = this;
                    l.isParentLoaded(a, "aroon", b.type, function (a) {
                        a.prototype.init.apply(b, c)
                    })
                },
                getValues: function (c, b) {
                    var g = [], d = [], h = [];
                    c = a.prototype.getValues.call(this, c, b);
                    for (b = 0; b < c.yData.length; b++) {
                        var m = c.yData[b][0];
                        var p = c.yData[b][1];
                        m -= p;
                        g.push([c.xData[b],
                            m]);
                        d.push(c.xData[b]);
                        h.push(m)
                    }
                    return {values: g, xData: d, yData: h}
                }
            }));
        ""
    });
    v(k, "indicators/atr.src.js", [k["parts/Utilities.js"]], function (e) {
        function f(d, a) {
            return Math.max(d[1] - d[2], a === h ? 0 : Math.abs(d[1] - a[3]), a === h ? 0 : Math.abs(d[2] - a[3]))
        }

        var l = e.isArray;
        e = e.seriesType;
        var h;
        e("atr", "sma", {params: {period: 14}}, {
            getValues: function (d, a) {
                a = a.period;
                var c = d.xData, b = (d = d.yData) ? d.length : 0, g = 1, h = 0, r = 0, m = [], p = [], q = [], n;
                var e = [[c[0], d[0]]];
                if (!(c.length <= a) && l(d[0]) && 4 === d[0].length) {
                    for (n = 1; n <= b; n++) if (e.push([c[n],
                        d[n]]), a < g) {
                        var x = a;
                        var u = c[n - 1], A = f(d[n - 1], d[n - 2]);
                        x = [u, (h * (x - 1) + A) / x];
                        h = x[1];
                        m.push(x);
                        p.push(x[0]);
                        q.push(x[1])
                    } else a === g ? (h = r / (n - 1), m.push([c[n - 1], h]), p.push(c[n - 1]), q.push(h)) : r += f(d[n - 1], d[n - 2]), g++;
                    return {values: m, xData: p, yData: q}
                }
            }
        });
        ""
    });
    v(k, "indicators/bollinger-bands.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/multipe-lines.js"]], function (e, f, l) {
        var h = f.isArray, d = f.merge;
        f = f.seriesType;
        var a = e.seriesTypes.sma;
        f("bb", "sma", {
            params: {period: 20, standardDeviation: 2, index: 3},
            bottomLine: {styles: {lineWidth: 1, lineColor: void 0}},
            topLine: {styles: {lineWidth: 1, lineColor: void 0}},
            tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'},
            marker: {enabled: !1},
            dataGrouping: {approximation: "averages"}
        }, d(l, {
            pointArrayMap: ["top", "middle", "bottom"],
            pointValKey: "middle",
            nameComponents: ["period", "standardDeviation"],
            linesApiNames: ["topLine", "bottomLine"],
            init: function () {
                a.prototype.init.apply(this,
                    arguments);
                this.options = d({
                    topLine: {styles: {lineColor: this.color}},
                    bottomLine: {styles: {lineColor: this.color}}
                }, this.options)
            },
            getValues: function (c, b) {
                var g = b.period, d = b.standardDeviation, r = c.xData, m = (c = c.yData) ? c.length : 0, p = [],
                    q = [], n = [], l;
                if (!(r.length < g)) {
                    var x = h(c[0]);
                    for (l = g; l <= m; l++) {
                        var u = r.slice(l - g, l);
                        var f = c.slice(l - g, l);
                        var e = a.prototype.getValues.call(this, {xData: u, yData: f}, b);
                        u = e.xData[0];
                        e = e.yData[0];
                        for (var k = 0, w = f.length, z = 0; z < w; z++) {
                            var E = (x ? f[z][b.index] : f[z]) - e;
                            k += E * E
                        }
                        E = Math.sqrt(k /
                            (w - 1));
                        f = e + d * E;
                        E = e - d * E;
                        p.push([u, f, e, E]);
                        q.push(u);
                        n.push([f, e, E])
                    }
                    return {values: p, xData: q, yData: n}
                }
            }
        }));
        ""
    });
    v(k, "indicators/cci.src.js", [k["parts/Utilities.js"]], function (e) {
        function f(h) {
            return h.reduce(function (d, a) {
                return d + a
            }, 0)
        }

        var l = e.isArray;
        e = e.seriesType;
        e("cci", "sma", {params: {period: 14}}, {
            getValues: function (h, d) {
                d = d.period;
                var a = h.xData, c = (h = h.yData) ? h.length : 0, b = [], g = 1, t = [], r = [], m = [];
                if (!(a.length <= d) && l(h[0]) && 4 === h[0].length) {
                    for (; g < d;) {
                        var p = h[g - 1];
                        b.push((p[1] + p[2] + p[3]) / 3);
                        g++
                    }
                    for (g =
                             d; g <= c; g++) {
                        p = h[g - 1];
                        p = (p[1] + p[2] + p[3]) / 3;
                        var q = b.push(p);
                        var n = b.slice(q - d);
                        q = f(n) / d;
                        var e, x = n.length, u = 0;
                        for (e = 0; e < x; e++) u += Math.abs(q - n[e]);
                        n = u / d;
                        p = (p - q) / (.015 * n);
                        t.push([a[g - 1], p]);
                        r.push(a[g - 1]);
                        m.push(p)
                    }
                    return {values: t, xData: r, yData: m}
                }
            }
        });
        ""
    });
    v(k, "indicators/cmf.src.js", [k["parts/Utilities.js"]], function (e) {
        e = e.seriesType;
        e("cmf", "sma", {params: {period: 14, volumeSeriesID: "volume"}}, {
            nameBase: "Chaikin Money Flow", isValid: function () {
                var f = this.chart, l = this.options, h = this.linkedParent;
                f = this.volumeSeries ||
                    (this.volumeSeries = f.get(l.params.volumeSeriesID));
                var d = h && h.yData && 4 === h.yData[0].length;
                return !!(h && f && h.xData && h.xData.length >= l.params.period && f.xData && f.xData.length >= l.params.period && d)
            }, getValues: function (f, l) {
                if (this.isValid()) return this.getMoneyFlow(f.xData, f.yData, this.volumeSeries.yData, l.period)
            }, getMoneyFlow: function (f, l, h, d) {
                function a(b, c) {
                    var a = b[1], g = b[2];
                    b = b[3];
                    return null !== c && null !== a && null !== g && null !== b && a !== g ? (b - g - (a - b)) / (a - g) * c : (n = q, null)
                }

                var c = l.length, b = [], g = 0, t = 0, r = [],
                    m = [], p = [], q, n = -1;
                if (0 < d && d <= c) {
                    for (q = 0; q < d; q++) b[q] = a(l[q], h[q]), g += h[q], t += b[q];
                    r.push(f[q - 1]);
                    m.push(q - n >= d && 0 !== g ? t / g : null);
                    for (p.push([r[0], m[0]]); q < c; q++) {
                        b[q] = a(l[q], h[q]);
                        g -= h[q - d];
                        g += h[q];
                        t -= b[q - d];
                        t += b[q];
                        var e = [f[q], q - n >= d ? t / g : null];
                        r.push(e[0]);
                        m.push(e[1]);
                        p.push([e[0], e[1]])
                    }
                }
                return {values: p, xData: r, yData: m}
            }
        });
        ""
    });
    v(k, "indicators/dpo.src.js", [k["parts/Utilities.js"]], function (e) {
        function f(d, a, c, b, g) {
            a = h(a[c][b], a[c]);
            return g ? l(d - a) : l(d + a)
        }

        var l = e.correctFloat, h = e.pick;
        e = e.seriesType;
        e("dpo", "sma", {params: {period: 21}}, {
            nameBase: "DPO", getValues: function (d, a) {
                var c = a.period;
                a = a.index;
                var b = c + Math.floor(c / 2 + 1), g = d.xData || [];
                d = d.yData || [];
                var t = d.length, r = [], m = [], p = [], l = 0, n, e;
                if (!(g.length <= b)) {
                    for (n = 0; n < c - 1; n++) l = f(l, d, n, a);
                    for (e = 0; e <= t - b; e++) {
                        var x = e + c - 1;
                        n = e + b - 1;
                        l = f(l, d, x, a);
                        x = h(d[n][a], d[n]);
                        x -= l / c;
                        l = f(l, d, e, a, !0);
                        r.push([g[n], x]);
                        m.push(g[n]);
                        p.push(x)
                    }
                    return {values: r, xData: m, yData: p}
                }
            }
        });
        ""
    });
    v(k, "indicators/ema.src.js", [k["parts/Utilities.js"]], function (e) {
        var f = e.correctFloat,
            l = e.isArray;
        e = e.seriesType;
        e("ema", "sma", {params: {index: 3, period: 9}}, {
            accumulatePeriodPoints: function (h, d, a) {
                for (var c = 0, b = 0, g; b < h;) g = 0 > d ? a[b] : a[b][d], c += g, b++;
                return c
            }, calculateEma: function (h, d, a, c, b, g, t) {
                h = h[a - 1];
                d = 0 > g ? d[a - 1] : d[a - 1][g];
                c = "undefined" === typeof b ? t : f(d * c + b * (1 - c));
                return [h, c]
            }, getValues: function (h, d) {
                var a = d.period, c = h.xData, b = (h = h.yData) ? h.length : 0, g = 2 / (a + 1), t = [], r = [],
                    m = [], p = -1;
                if (!(b < a)) {
                    l(h[0]) && (p = d.index ? d.index : 0);
                    d = this.accumulatePeriodPoints(a, p, h);
                    for (d /= a; a < b + 1; a++) {
                        var f =
                            this.calculateEma(c, h, a, g, f, p, d);
                        t.push(f);
                        r.push(f[0]);
                        m.push(f[1]);
                        f = f[1]
                    }
                    return {values: t, xData: r, yData: m}
                }
            }
        });
        ""
    });
    v(k, "indicators/chaikin.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/indicator-required.js"]], function (e, f, l) {
        var h = f.correctFloat, d = f.error;
        f = f.seriesType;
        var a = e.seriesTypes.ema, c = e.seriesTypes.ad;
        f("chaikin", "ema", {params: {volumeSeriesID: "volume", periods: [3, 10]}}, {
            nameBase: "Chaikin Osc", nameComponents: ["periods"], init: function () {
                var b = arguments, c = this;
                l.isParentLoaded(a,
                    "ema", c.type, function (a) {
                        a.prototype.init.apply(c, b)
                    })
            }, getValues: function (b, g) {
                var t = g.periods, l = g.period, m = [], p = [], f = [], n;
                if (2 !== t.length || t[1] <= t[0]) d('Error: "Chaikin requires two periods. Notice, first period should be lower than the second one."'); else if (g = c.prototype.getValues.call(this, b, {
                    volumeSeriesID: g.volumeSeriesID,
                    period: l
                })) if (b = a.prototype.getValues.call(this, g, {period: t[0]}), g = a.prototype.getValues.call(this, g, {period: t[1]}), b && g) {
                    t = t[1] - t[0];
                    for (n = 0; n < g.yData.length; n++) l = h(b.yData[n +
                    t] - g.yData[n]), m.push([g.xData[n], l]), p.push(g.xData[n]), f.push(l);
                    return {values: m, xData: p, yData: f}
                }
            }
        });
        ""
    });
    v(k, "indicators/dema.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/indicator-required.js"]], function (e, f, l) {
        var h = f.correctFloat, d = f.isArray;
        f = f.seriesType;
        var a = e.seriesTypes.ema;
        f("dema", "ema", {}, {
            init: function () {
                var c = arguments, b = this;
                l.isParentLoaded(a, "ema", b.type, function (a) {
                    a.prototype.init.apply(b, c)
                })
            }, getEMA: function (c, b, g, d, h, m) {
                return a.prototype.calculateEma(m ||
                    [], c, "undefined" === typeof h ? 1 : h, this.chart.series[0].EMApercent, b, "undefined" === typeof d ? -1 : d, g)
            }, getValues: function (c, b) {
                var g = b.period, l = 2 * g, f = c.xData, m = c.yData, p = m ? m.length : 0, e = -1, n = [], y = [],
                    x = [], u = 0, A = [], k;
                c.EMApercent = 2 / (g + 1);
                if (!(p < 2 * g - 1)) {
                    d(m[0]) && (e = b.index ? b.index : 0);
                    c = a.prototype.accumulatePeriodPoints(g, e, m);
                    b = c / g;
                    c = 0;
                    for (k = g; k < p + 2; k++) {
                        k < p + 1 && (u = this.getEMA(m, C, b, e, k)[1], A.push(u));
                        var C = u;
                        if (k < l) c += u; else {
                            k === l && (b = c / g);
                            u = A[k - g - 1];
                            var w = this.getEMA([u], w, b)[1];
                            var z = [f[k - 2], h(2 * u - w)];
                            n.push(z);
                            y.push(z[0]);
                            x.push(z[1])
                        }
                    }
                    return {values: n, xData: y, yData: x}
                }
            }
        });
        ""
    });
    v(k, "indicators/tema.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/indicator-required.js"]], function (e, f, l) {
        var h = f.correctFloat, d = f.isArray;
        f = f.seriesType;
        var a = e.seriesTypes.ema;
        f("tema", "ema", {}, {
            init: function () {
                var c = arguments, b = this;
                l.isParentLoaded(a, "ema", b.type, function (a) {
                    a.prototype.init.apply(b, c)
                })
            }, getEMA: function (c, b, g, d, h, m) {
                return a.prototype.calculateEma(m || [], c, "undefined" === typeof h ?
                    1 : h, this.chart.series[0].EMApercent, b, "undefined" === typeof d ? -1 : d, g)
            }, getTemaPoint: function (a, b, g, d) {
                return [a[d - 3], h(3 * g.level1 - 3 * g.level2 + g.level3)]
            }, getValues: function (c, b) {
                var g = b.period, h = 2 * g, l = 3 * g, m = c.xData, p = c.yData, f = p ? p.length : 0, n = -1, e = [],
                    x = [], u = [], k = [], B = [], C, w, z = {};
                c.EMApercent = 2 / (g + 1);
                if (!(f < 3 * g - 2)) {
                    d(p[0]) && (n = b.index ? b.index : 0);
                    c = a.prototype.accumulatePeriodPoints(g, n, p);
                    b = c / g;
                    c = 0;
                    for (C = g; C < f + 3; C++) {
                        C < f + 1 && (z.level1 = this.getEMA(p, E, b, n, C)[1], k.push(z.level1));
                        var E = z.level1;
                        if (C < h) c +=
                            z.level1; else {
                            C === h && (b = c / g, c = 0);
                            z.level1 = k[C - g - 1];
                            z.level2 = this.getEMA([z.level1], L, b)[1];
                            B.push(z.level2);
                            var L = z.level2;
                            if (C < l) c += z.level2; else {
                                C === l && (b = c / g);
                                C === f + 1 && (z.level1 = k[C - g - 1], z.level2 = this.getEMA([z.level1], L, b)[1], B.push(z.level2));
                                z.level1 = k[C - g - 2];
                                z.level2 = B[C - 2 * g - 1];
                                z.level3 = this.getEMA([z.level2], z.prevLevel3, b)[1];
                                if (w = this.getTemaPoint(m, l, z, C)) e.push(w), x.push(w[0]), u.push(w[1]);
                                z.prevLevel3 = z.level3
                            }
                        }
                    }
                    return {values: e, xData: x, yData: u}
                }
            }
        });
        ""
    });
    v(k, "indicators/trix.src.js", [k["parts/Globals.js"],
        k["parts/Utilities.js"], k["mixins/indicator-required.js"]], function (e, f, l) {
        var h = f.correctFloat;
        f = f.seriesType;
        var d = e.seriesTypes.tema;
        f("trix", "tema", {}, {
            init: function () {
                var a = arguments, c = this;
                l.isParentLoaded(d, "tema", c.type, function (b) {
                    b.prototype.init.apply(c, a)
                })
            }, getTemaPoint: function (a, c, b, g) {
                if (g > c) var d = [a[g - 3], 0 !== b.prevLevel3 ? h(b.level3 - b.prevLevel3) / b.prevLevel3 * 100 : null];
                return d
            }
        });
        ""
    });
    v(k, "indicators/apo.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/indicator-required.js"]],
        function (e, f, l) {
            var h = f.error;
            f = f.seriesType;
            var d = e.seriesTypes.ema;
            f("apo", "ema", {params: {periods: [10, 20]}}, {
                nameBase: "APO", nameComponents: ["periods"], init: function () {
                    var a = arguments, c = this;
                    l.isParentLoaded(d, "ema", c.type, function (b) {
                        b.prototype.init.apply(c, a)
                    })
                }, getValues: function (a, c) {
                    var b = c.periods, g = c.index;
                    c = [];
                    var l = [], f = [], m;
                    if (2 !== b.length || b[1] <= b[0]) h('Error: "APO requires two periods. Notice, first period should be lower than the second one."'); else {
                        var p = d.prototype.getValues.call(this,
                            a, {index: g, period: b[0]});
                        a = d.prototype.getValues.call(this, a, {index: g, period: b[1]});
                        if (p && a) {
                            b = b[1] - b[0];
                            for (m = 0; m < a.yData.length; m++) g = p.yData[m + b] - a.yData[m], c.push([a.xData[m], g]), l.push(a.xData[m]), f.push(g);
                            return {values: c, xData: l, yData: f}
                        }
                    }
                }
            });
            ""
        });
    v(k, "indicators/ichimoku-kinko-hyo.src.js", [k["parts/Globals.js"], k["parts/Color.js"], k["parts/Utilities.js"]], function (e, f, l) {
        function h(b) {
            return b.reduce(function (b, a) {
                return Math.max(b, a[1])
            }, -Infinity)
        }

        function d(b) {
            return b.reduce(function (b,
                                      a) {
                return Math.min(b, a[2])
            }, Infinity)
        }

        function a(b) {
            return {high: h(b), low: d(b)}
        }

        function c(b) {
            var a, c, g, d, h;
            b.series.forEach(function (b) {
                if (b.xData) for (d = b.xData, h = c = b.xIncrement ? 1 : d.length - 1; 0 < h; h--) if (g = d[h] - d[h - 1], a === n || g < a) a = g
            });
            return a
        }

        function b(b, a, c, g) {
            if (b && a && c && g) {
                var d = a.plotX - b.plotX;
                a = a.plotY - b.plotY;
                var h = g.plotX - c.plotX;
                g = g.plotY - c.plotY;
                var m = b.plotX - c.plotX, n = b.plotY - c.plotY;
                c = (-a * m + d * n) / (-h * a + d * g);
                h = (h * n - g * m) / (-h * a + d * g);
                if (0 <= c && 1 >= c && 0 <= h && 1 >= h) return {
                    plotX: b.plotX + h * d, plotY: b.plotY +
                        h * a
                }
            }
            return !1
        }

        function g(b) {
            var a = b.indicator;
            a.points = b.points;
            a.nextPoints = b.nextPoints;
            a.color = b.color;
            a.options = p(b.options.senkouSpan.styles, b.gap);
            a.graph = b.graph;
            a.fillGraph = !0;
            k.prototype.drawGraph.call(a)
        }

        var t = f.parse, r = l.defined, m = l.isArray, p = l.merge, q = l.objectEach;
        f = l.seriesType;
        var n, k = e.seriesTypes.sma;
        e.approximations["ichimoku-averages"] = function () {
            var b = [], a;
            [].forEach.call(arguments, function (c, g) {
                b.push(e.approximations.average(c));
                a = !a && "undefined" === typeof b[g]
            });
            return a ? void 0 :
                b
        };
        f("ikh", "sma", {
            params: {period: 26, periodTenkan: 9, periodSenkouSpanB: 52},
            marker: {enabled: !1},
            tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span> <b> {series.name}</b><br/>TENKAN SEN: {point.tenkanSen:.3f}<br/>KIJUN SEN: {point.kijunSen:.3f}<br/>CHIKOU SPAN: {point.chikouSpan:.3f}<br/>SENKOU SPAN A: {point.senkouSpanA:.3f}<br/>SENKOU SPAN B: {point.senkouSpanB:.3f}<br/>'},
            tenkanLine: {styles: {lineWidth: 1, lineColor: void 0}},
            kijunLine: {styles: {lineWidth: 1, lineColor: void 0}},
            chikouLine: {
                styles: {
                    lineWidth: 1,
                    lineColor: void 0
                }
            },
            senkouSpanA: {styles: {lineWidth: 1, lineColor: void 0}},
            senkouSpanB: {styles: {lineWidth: 1, lineColor: void 0}},
            senkouSpan: {styles: {fill: "rgba(255, 0, 0, 0.5)"}},
            dataGrouping: {approximation: "ichimoku-averages"}
        }, {
            pointArrayMap: ["tenkanSen", "kijunSen", "chikouSpan", "senkouSpanA", "senkouSpanB"],
            pointValKey: "tenkanSen",
            nameComponents: ["periodSenkouSpanB", "period", "periodTenkan"],
            init: function () {
                k.prototype.init.apply(this, arguments);
                this.options = p({
                    tenkanLine: {styles: {lineColor: this.color}},
                    kijunLine: {styles: {lineColor: this.color}},
                    chikouLine: {styles: {lineColor: this.color}},
                    senkouSpanA: {styles: {lineColor: this.color, fill: t(this.color).setOpacity(.5).get()}},
                    senkouSpanB: {styles: {lineColor: this.color, fill: t(this.color).setOpacity(.5).get()}},
                    senkouSpan: {styles: {fill: t(this.color).setOpacity(.2).get()}}
                }, this.options)
            },
            toYData: function (b) {
                return [b.tenkanSen, b.kijunSen, b.chikouSpan, b.senkouSpanA, b.senkouSpanB]
            },
            translate: function () {
                var b = this;
                k.prototype.translate.apply(b);
                b.points.forEach(function (a) {
                    b.pointArrayMap.forEach(function (c) {
                        r(a[c]) &&
                        (a["plot" + c] = b.yAxis.toPixels(a[c], !0), a.plotY = a["plot" + c], a.tooltipPos = [a.plotX, a["plot" + c]], a.isNull = !1)
                    })
                })
            },
            drawGraph: function () {
                var a = this, c = a.points, d = c.length, h = a.options, m = a.graph, n = a.color,
                    l = {options: {gapSize: h.gapSize}}, f = a.pointArrayMap.length, e = [[], [], [], [], [], []], t = {
                        tenkanLine: e[0],
                        kijunLine: e[1],
                        chikouLine: e[2],
                        senkouSpanA: e[3],
                        senkouSpanB: e[4],
                        senkouSpan: e[5]
                    }, y = [], D = a.options.senkouSpan, v = D.color || D.styles.fill, N = D.negativeColor, J = [[], []],
                    M = [[], []], P = 0, K, Q, O;
                for (a.ikhMap = t; d--;) {
                    var F =
                        c[d];
                    for (K = 0; K < f; K++) D = a.pointArrayMap[K], r(F[D]) && e[K].push({
                        plotX: F.plotX,
                        plotY: F["plot" + D],
                        isNull: !1
                    });
                    N && d !== c.length - 1 && (D = t.senkouSpanB.length - 1, F = b(t.senkouSpanA[D - 1], t.senkouSpanA[D], t.senkouSpanB[D - 1], t.senkouSpanB[D]), K = {
                        plotX: F.plotX,
                        plotY: F.plotY,
                        isNull: !1,
                        intersectPoint: !0
                    }, F && (t.senkouSpanA.splice(D, 0, K), t.senkouSpanB.splice(D, 0, K), y.push(D)))
                }
                q(t, function (b, c) {
                    h[c] && "senkouSpan" !== c && (a.points = e[P], a.options = p(h[c].styles, l), a.graph = a["graph" + c], a.fillGraph = !1, a.color = n, k.prototype.drawGraph.call(a),
                        a["graph" + c] = a.graph);
                    P++
                });
                a.graphCollection && a.graphCollection.forEach(function (b) {
                    a[b].destroy();
                    delete a[b]
                });
                a.graphCollection = [];
                if (N && t.senkouSpanA[0] && t.senkouSpanB[0]) {
                    y.unshift(0);
                    y.push(t.senkouSpanA.length - 1);
                    for (f = 0; f < y.length - 1; f++) {
                        D = y[f];
                        F = y[f + 1];
                        d = t.senkouSpanB.slice(D, F + 1);
                        D = t.senkouSpanA.slice(D, F + 1);
                        if (1 <= Math.floor(d.length / 2)) if (F = Math.floor(d.length / 2), d[F].plotY === D[F].plotY) {
                            for (O = K = F = 0; O < d.length; O++) F += d[O].plotY, K += D[O].plotY;
                            F = F > K ? 0 : 1
                        } else F = d[F].plotY > D[F].plotY ? 0 : 1;
                        else F = d[0].plotY > D[0].plotY ? 0 : 1;
                        J[F] = J[F].concat(d);
                        M[F] = M[F].concat(D)
                    }
                    ["graphsenkouSpanColor", "graphsenkouSpanNegativeColor"].forEach(function (b, c) {
                        J[c].length && M[c].length && (Q = 0 === c ? v : N, g({
                            indicator: a,
                            points: J[c],
                            nextPoints: M[c],
                            color: Q,
                            options: h,
                            gap: l,
                            graph: a[b]
                        }), a[b] = a.graph, a.graphCollection.push(b))
                    })
                } else g({
                    indicator: a,
                    points: t.senkouSpanB,
                    nextPoints: t.senkouSpanA,
                    color: v,
                    options: h,
                    gap: l,
                    graph: a.graphsenkouSpan
                }), a.graphsenkouSpan = a.graph;
                delete a.nextPoints;
                delete a.fillGraph;
                a.points =
                    c;
                a.options = h;
                a.graph = m
            },
            getGraphPath: function (b) {
                b = b || this.points;
                if (this.fillGraph && this.nextPoints) {
                    var a = k.prototype.getGraphPath.call(this, this.nextPoints);
                    a[0][0] = "L";
                    var c = k.prototype.getGraphPath.call(this, b);
                    a = a.slice(0, c.length);
                    for (var g = a.length - 1; 0 <= g; g--) c.push(a[g])
                } else c = k.prototype.getGraphPath.apply(this, arguments);
                return c
            },
            getValues: function (b, g) {
                var d = g.period, h = g.periodTenkan;
                g = g.periodSenkouSpanB;
                var l = b.xData, f = b.yData, p = f && f.length || 0;
                b = c(b.xAxis);
                var t = [], e = [], r;
                if (!(l.length <=
                    d) && m(f[0]) && 4 === f[0].length) {
                    var q = l[0] - d * b;
                    for (r = 0; r < d; r++) e.push(q + r * b);
                    for (r = 0; r < p; r++) {
                        if (r >= h) {
                            var k = f.slice(r - h, r);
                            k = a(k);
                            k = (k.high + k.low) / 2
                        }
                        if (r >= d) {
                            var u = f.slice(r - d, r);
                            u = a(u);
                            u = (u.high + u.low) / 2;
                            var y = (k + u) / 2
                        }
                        if (r >= g) {
                            var x = f.slice(r - g, r);
                            x = a(x);
                            x = (x.high + x.low) / 2
                        }
                        q = f[r][3];
                        var v = l[r];
                        t[r] === n && (t[r] = []);
                        t[r + d] === n && (t[r + d] = []);
                        t[r + d][0] = k;
                        t[r + d][1] = u;
                        t[r + d][2] = n;
                        t[r][2] = q;
                        r <= d && (t[r + d][3] = n, t[r + d][4] = n);
                        t[r + 2 * d] === n && (t[r + 2 * d] = []);
                        t[r + 2 * d][3] = y;
                        t[r + 2 * d][4] = x;
                        e.push(v)
                    }
                    for (r = 1; r <= d; r++) e.push(v +
                        r * b);
                    return {values: t, xData: e, yData: t}
                }
            }
        });
        ""
    });
    v(k, "indicators/keltner-channels.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/multipe-lines.js"]], function (e, f, l) {
        var h = f.correctFloat, d = f.merge;
        f = f.seriesType;
        var a = e.seriesTypes.sma, c = e.seriesTypes.ema, b = e.seriesTypes.atr;
        f("keltnerchannels", "sma", {
            params: {period: 20, periodATR: 10, multiplierATR: 2},
            bottomLine: {styles: {lineWidth: 1, lineColor: void 0}},
            topLine: {styles: {lineWidth: 1, lineColor: void 0}},
            tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span><b> {series.name}</b><br/>Upper Channel: {point.top}<br/>EMA({series.options.params.period}): {point.middle}<br/>Lower Channel: {point.bottom}<br/>'},
            marker: {enabled: !1},
            dataGrouping: {approximation: "averages"},
            lineWidth: 1
        }, d(l, {
            pointArrayMap: ["top", "middle", "bottom"],
            pointValKey: "middle",
            nameBase: "Keltner Channels",
            nameComponents: ["period", "periodATR", "multiplierATR"],
            linesApiNames: ["topLine", "bottomLine"],
            requiredIndicators: ["ema", "atr"],
            init: function () {
                a.prototype.init.apply(this, arguments);
                this.options = d({
                    topLine: {styles: {lineColor: this.color}},
                    bottomLine: {styles: {lineColor: this.color}}
                }, this.options)
            },
            getValues: function (a, d) {
                var g = d.period,
                    m = d.periodATR, l = d.multiplierATR, f = a.yData;
                f = f ? f.length : 0;
                var n = [];
                d = c.prototype.getValues(a, {period: g, index: d.index});
                var t = b.prototype.getValues(a, {period: m}), e = [], k = [], A;
                if (!(f < g)) {
                    for (A = g; A <= f; A++) {
                        var B = d.values[A - g];
                        var C = t.values[A - m];
                        var w = B[0];
                        a = h(B[1] + l * C[1]);
                        C = h(B[1] - l * C[1]);
                        B = B[1];
                        n.push([w, a, B, C]);
                        e.push(w);
                        k.push([a, B, C])
                    }
                    return {values: n, xData: e, yData: k}
                }
            }
        }));
        ""
    });
    v(k, "indicators/macd.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"]], function (e, f) {
        var l = f.correctFloat, h = f.defined,
            d = f.merge;
        f = f.seriesType;
        var a = e.seriesTypes.sma, c = e.seriesTypes.ema;
        f("macd", "sma", {
            params: {shortPeriod: 12, longPeriod: 26, signalPeriod: 9, period: 26},
            signalLine: {zones: [], styles: {lineWidth: 1, lineColor: void 0}},
            macdLine: {zones: [], styles: {lineWidth: 1, lineColor: void 0}},
            threshold: 0,
            groupPadding: .1,
            pointPadding: .1,
            crisp: !1,
            states: {hover: {halo: {size: 0}}},
            tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span> <b> {series.name}</b><br/>Value: {point.MACD}<br/>Signal: {point.signal}<br/>Histogram: {point.y}<br/>'},
            dataGrouping: {approximation: "averages"},
            minPointLength: 0
        }, {
            nameComponents: ["longPeriod", "shortPeriod", "signalPeriod"],
            requiredIndicators: ["ema"],
            pointArrayMap: ["y", "signal", "MACD"],
            parallelArrays: ["x", "y", "signal", "MACD"],
            pointValKey: "y",
            markerAttribs: e.noop,
            getColumnMetrics: e.seriesTypes.column.prototype.getColumnMetrics,
            crispCol: e.seriesTypes.column.prototype.crispCol,
            init: function () {
                a.prototype.init.apply(this, arguments);
                this.options && (this.options = d({
                    signalLine: {styles: {lineColor: this.color}},
                    macdLine: {styles: {color: this.color}}
                }, this.options), this.macdZones = {
                    zones: this.options.macdLine.zones,
                    startIndex: 0
                }, this.signalZones = {
                    zones: this.macdZones.zones.concat(this.options.signalLine.zones),
                    startIndex: this.macdZones.zones.length
                }, this.resetZones = !0)
            },
            toYData: function (b) {
                return [b.y, b.signal, b.MACD]
            },
            translate: function () {
                var b = this, a = ["plotSignal", "plotMACD"];
                e.seriesTypes.column.prototype.translate.apply(b);
                b.points.forEach(function (c) {
                    [c.signal, c.MACD].forEach(function (g, d) {
                        null !== g && (c[a[d]] =
                            b.yAxis.toPixels(g, !0))
                    })
                })
            },
            destroy: function () {
                this.graph = null;
                this.graphmacd = this.graphmacd && this.graphmacd.destroy();
                this.graphsignal = this.graphsignal && this.graphsignal.destroy();
                a.prototype.destroy.apply(this, arguments)
            },
            drawPoints: e.seriesTypes.column.prototype.drawPoints,
            drawGraph: function () {
                for (var b = this, c = b.points, l = c.length, f = b.options, m = b.zones, e = {options: {gapSize: f.gapSize}}, q = [[], []], n; l--;) n = c[l], h(n.plotMACD) && q[0].push({
                    plotX: n.plotX,
                    plotY: n.plotMACD,
                    isNull: !h(n.plotMACD)
                }), h(n.plotSignal) &&
                q[1].push({plotX: n.plotX, plotY: n.plotSignal, isNull: !h(n.plotMACD)});
                ["macd", "signal"].forEach(function (c, g) {
                    b.points = q[g];
                    b.options = d(f[c + "Line"].styles, e);
                    b.graph = b["graph" + c];
                    b.currentLineZone = c + "Zones";
                    b.zones = b[b.currentLineZone].zones;
                    a.prototype.drawGraph.call(b);
                    b["graph" + c] = b.graph
                });
                b.points = c;
                b.options = f;
                b.zones = m;
                b.currentLineZone = null
            },
            getZonesGraphs: function (b) {
                var c = a.prototype.getZonesGraphs.call(this, b), d = c;
                this.currentLineZone && (d = c.splice(this[this.currentLineZone].startIndex + 1),
                    d.length ? d.splice(0, 0, b[0]) : d = [b[0]]);
                return d
            },
            applyZones: function () {
                var b = this.zones;
                this.zones = this.signalZones.zones;
                a.prototype.applyZones.call(this);
                this.graphmacd && this.options.macdLine.zones.length && this.graphmacd.hide();
                this.zones = b
            },
            getValues: function (b, a) {
                var d = 0, g = [], m = [], f = [];
                if (!(b.xData.length < a.longPeriod + a.signalPeriod)) {
                    var e = c.prototype.getValues(b, {period: a.shortPeriod});
                    var n = c.prototype.getValues(b, {period: a.longPeriod});
                    e = e.values;
                    n = n.values;
                    for (b = 1; b <= e.length; b++) h(n[b - 1]) &&
                    h(n[b - 1][1]) && h(e[b + a.shortPeriod + 1]) && h(e[b + a.shortPeriod + 1][0]) && g.push([e[b + a.shortPeriod + 1][0], 0, null, e[b + a.shortPeriod + 1][1] - n[b - 1][1]]);
                    for (b = 0; b < g.length; b++) m.push(g[b][0]), f.push([0, null, g[b][3]]);
                    a = c.prototype.getValues({xData: m, yData: f}, {period: a.signalPeriod, index: 2});
                    a = a.values;
                    for (b = 0; b < g.length; b++) g[b][0] >= a[0][0] && (g[b][2] = a[d][1], f[b] = [0, a[d][1], g[b][3]], null === g[b][3] ? (g[b][1] = 0, f[b][0] = 0) : (g[b][1] = l(g[b][3] - a[d][1]), f[b][0] = l(g[b][3] - a[d][1])), d++);
                    return {values: g, xData: m, yData: f}
                }
            }
        });
        ""
    });
    v(k, "indicators/mfi.src.js", [k["parts/Utilities.js"]], function (e) {
        function f(a) {
            return a.reduce(function (a, b) {
                return a + b
            })
        }

        function l(a) {
            return (a[1] + a[2] + a[3]) / 3
        }

        var h = e.error, d = e.isArray;
        e = e.seriesType;
        e("mfi", "sma", {params: {period: 14, volumeSeriesID: "volume", decimals: 4}}, {
            nameBase: "Money Flow Index", getValues: function (a, c) {
                var b = c.period, g = a.xData, e = a.yData, r = e ? e.length : 0, m = c.decimals, p = 1,
                    q = a.chart.get(c.volumeSeriesID), n = q && q.yData, k = [], x = [], u = [], A = [], B = [];
                if (!q) h("Series " + c.volumeSeriesID +
                    " not found! Check `volumeSeriesID`.", !0, a.chart); else if (!(g.length <= b) && d(e[0]) && 4 === e[0].length && n) {
                    for (a = l(e[p]); p < b + 1;) c = a, a = l(e[p]), c = a >= c, q = a * n[p], A.push(c ? q : 0), B.push(c ? 0 : q), p++;
                    for (b = p - 1; b < r; b++) b > p - 1 && (A.shift(), B.shift(), c = a, a = l(e[b]), c = a > c, q = a * n[b], A.push(c ? q : 0), B.push(c ? 0 : q)), c = f(B), q = f(A), c = q / c, c = parseFloat((100 - 100 / (1 + c)).toFixed(m)), k.push([g[b], c]), x.push(g[b]), u.push(c);
                    return {values: k, xData: x, yData: u}
                }
            }
        });
        ""
    });
    v(k, "indicators/momentum.src.js", [k["parts/Utilities.js"]], function (e) {
        function f(h,
                   d, a, c, b) {
            a = a[c - 1][3] - a[c - b - 1][3];
            d = d[c - 1];
            h.shift();
            return [d, a]
        }

        var l = e.isArray;
        e = e.seriesType;
        e("momentum", "sma", {params: {period: 14}}, {
            nameBase: "Momentum", getValues: function (h, d) {
                d = d.period;
                var a = h.xData, c = (h = h.yData) ? h.length : 0, b = a[0], g = [], e = [], r = [];
                if (!(a.length <= d) && l(h[0])) {
                    var m = h[0][3];
                    m = [[b, m]];
                    for (b = d + 1; b < c; b++) {
                        var p = f(m, a, h, b, d, void 0);
                        g.push(p);
                        e.push(p[0]);
                        r.push(p[1])
                    }
                    p = f(m, a, h, b, d, void 0);
                    g.push(p);
                    e.push(p[0]);
                    r.push(p[1]);
                    return {values: g, xData: e, yData: r}
                }
            }
        });
        ""
    });
    v(k, "indicators/natr.src.js",
        [k["parts/Globals.js"], k["parts/Utilities.js"]], function (e, f) {
            f = f.seriesType;
            var l = e.seriesTypes.atr;
            f("natr", "sma", {tooltip: {valueSuffix: "%"}}, {
                requiredIndicators: ["atr"], getValues: function (h, d) {
                    var a = l.prototype.getValues.apply(this, arguments), c = a.values.length, b = d.period - 1,
                        g = h.yData, f = 0;
                    if (a) {
                        for (; f < c; f++) a.yData[f] = a.values[f][1] / g[b][3] * 100, a.values[f][1] = a.yData[f], b++;
                        return a
                    }
                }
            });
            ""
        });
    v(k, "indicators/pivot-points.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"]], function (e, f) {
        function l(c,
                   b) {
            var d = c.series.pointArrayMap, h = d.length;
            for (a.prototype.pointClass.prototype[b].call(c); h--;) b = "dataLabel" + d[h], c[b] && c[b].element && c[b].destroy(), c[b] = null
        }

        var h = f.defined, d = f.isArray;
        f = f.seriesType;
        var a = e.seriesTypes.sma;
        f("pivotpoints", "sma", {
            params: {period: 28, algorithm: "standard"},
            marker: {enabled: !1},
            enableMouseTracking: !1,
            dataLabels: {enabled: !0, format: "{point.pivotLine}"},
            dataGrouping: {approximation: "averages"}
        }, {
            nameBase: "Pivot Points", pointArrayMap: "R4 R3 R2 R1 P S1 S2 S3 S4".split(" "),
            pointValKey: "P", toYData: function (a) {
                return [a.P]
            }, translate: function () {
                var c = this;
                a.prototype.translate.apply(c);
                c.points.forEach(function (b) {
                    c.pointArrayMap.forEach(function (a) {
                        h(b[a]) && (b["plot" + a] = c.yAxis.toPixels(b[a], !0))
                    })
                });
                c.plotEndPoint = c.xAxis.toPixels(c.endPoint, !0)
            }, getGraphPath: function (c) {
                for (var b = this, d = c.length, f = [[], [], [], [], [], [], [], [], []], l = [], m = b.plotEndPoint, e = b.pointArrayMap.length, q, n, k; d--;) {
                    n = c[d];
                    for (k = 0; k < e; k++) q = b.pointArrayMap[k], h(n[q]) && f[k].push({
                        plotX: n.plotX, plotY: n["plot" +
                        q], isNull: !1
                    }, {plotX: m, plotY: n["plot" + q], isNull: !1}, {plotX: m, plotY: null, isNull: !0});
                    m = n.plotX
                }
                f.forEach(function (c) {
                    l = l.concat(a.prototype.getGraphPath.call(b, c))
                });
                return l
            }, drawDataLabels: function () {
                var c = this, b = c.pointArrayMap, d, h, f;
                if (c.options.dataLabels.enabled) {
                    var l = c.points.length;
                    b.concat([!1]).forEach(function (g, m) {
                        for (f = l; f--;) h = c.points[f], g ? (h.y = h[g], h.pivotLine = g, h.plotY = h["plot" + g], d = h["dataLabel" + g], m && (h["dataLabel" + b[m - 1]] = h.dataLabel), h.dataLabels || (h.dataLabels = []), h.dataLabels[0] =
                            h.dataLabel = d = d && d.element ? d : null) : h["dataLabel" + b[m - 1]] = h.dataLabel;
                        a.prototype.drawDataLabels.apply(c, arguments)
                    })
                }
            }, getValues: function (a, b) {
                var c = b.period, h = a.xData, f = (a = a.yData) ? a.length : 0;
                b = this[b.algorithm + "Placement"];
                var l = [], e = [], k = [], n;
                if (!(h.length < c) && d(a[0]) && 4 === a[0].length) {
                    for (n = c + 1; n <= f + c; n += c) {
                        var y = h.slice(n - c - 1, n);
                        var x = a.slice(n - c - 1, n);
                        var u = y.length;
                        var A = y[u - 1];
                        x = this.getPivotAndHLC(x);
                        x = b(x);
                        x = l.push([A].concat(x));
                        e.push(A);
                        k.push(l[x - 1].slice(1))
                    }
                    this.endPoint = y[0] + (A - y[0]) /
                        u * c;
                    return {values: l, xData: e, yData: k}
                }
            }, getPivotAndHLC: function (a) {
                var b = -Infinity, c = Infinity, d = a[a.length - 1][3];
                a.forEach(function (a) {
                    b = Math.max(b, a[1]);
                    c = Math.min(c, a[2])
                });
                return [(b + c + d) / 3, b, c, d]
            }, standardPlacement: function (a) {
                var b = a[1] - a[2];
                return [null, null, a[0] + b, 2 * a[0] - a[2], a[0], 2 * a[0] - a[1], a[0] - b, null, null]
            }, camarillaPlacement: function (a) {
                var b = a[1] - a[2];
                return [a[3] + 1.5 * b, a[3] + 1.25 * b, a[3] + 1.1666 * b, a[3] + 1.0833 * b, a[0], a[3] - 1.0833 * b, a[3] - 1.1666 * b, a[3] - 1.25 * b, a[3] - 1.5 * b]
            }, fibonacciPlacement: function (a) {
                var b =
                    a[1] - a[2];
                return [null, a[0] + b, a[0] + .618 * b, a[0] + .382 * b, a[0], a[0] - .382 * b, a[0] - .618 * b, a[0] - b, null]
            }
        }, {
            destroyElements: function () {
                l(this, "destroyElements")
            }, destroy: function () {
                l(this, "destroyElements")
            }
        });
        ""
    });
    v(k, "indicators/ppo.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/indicator-required.js"]], function (e, f, l) {
        var h = f.correctFloat, d = f.error;
        f = f.seriesType;
        var a = e.seriesTypes.ema;
        f("ppo", "ema", {params: {periods: [12, 26]}}, {
            nameBase: "PPO", nameComponents: ["periods"], init: function () {
                var c =
                    arguments, b = this;
                l.isParentLoaded(a, "ema", b.type, function (a) {
                    a.prototype.init.apply(b, c)
                })
            }, getValues: function (c, b) {
                var g = b.periods, f = b.index;
                b = [];
                var l = [], m = [], e;
                if (2 !== g.length || g[1] <= g[0]) d('Error: "PPO requires two periods. Notice, first period should be lower than the second one."'); else {
                    var k = a.prototype.getValues.call(this, c, {index: f, period: g[0]});
                    c = a.prototype.getValues.call(this, c, {index: f, period: g[1]});
                    if (k && c) {
                        g = g[1] - g[0];
                        for (e = 0; e < c.yData.length; e++) f = h((k.yData[e + g] - c.yData[e]) / c.yData[e] *
                            100), b.push([c.xData[e], f]), l.push(c.xData[e]), m.push(f);
                        return {values: b, xData: l, yData: m}
                    }
                }
            }
        });
        ""
    });
    v(k, "mixins/reduce-array.js", [], function () {
        return {
            minInArray: function (e, f) {
                return e.reduce(function (l, h) {
                    return Math.min(l, h[f])
                }, Number.MAX_VALUE)
            }, maxInArray: function (e, f) {
                return e.reduce(function (l, h) {
                    return Math.max(l, h[f])
                }, -Number.MAX_VALUE)
            }, getArrayExtremes: function (e, f, l) {
                return e.reduce(function (h, d) {
                    return [Math.min(h[0], d[f]), Math.max(h[1], d[l])]
                }, [Number.MAX_VALUE, -Number.MAX_VALUE])
            }
        }
    });
    v(k, "indicators/price-channel.src.js", [k["parts/Utilities.js"], k["mixins/reduce-array.js"], k["mixins/multipe-lines.js"]], function (e, f, l) {
        var h = e.merge;
        e = e.seriesType;
        var d = f.getArrayExtremes;
        e("pc", "sma", {
            params: {period: 20},
            lineWidth: 1,
            topLine: {styles: {lineColor: "#90ed7d", lineWidth: 1}},
            bottomLine: {styles: {lineColor: "#f45b5b", lineWidth: 1}},
            dataGrouping: {approximation: "averages"}
        }, h(l, {
            pointArrayMap: ["top", "middle", "bottom"],
            pointValKey: "middle",
            nameBase: "Price Channel",
            nameComponents: ["period"],
            linesApiNames: ["topLine",
                "bottomLine"],
            getValues: function (a, c) {
                c = c.period;
                var b = a.xData, g = (a = a.yData) ? a.length : 0, h = [], f = [], l = [], e;
                if (!(g < c)) {
                    for (e = c; e <= g; e++) {
                        var k = b[e - 1];
                        var n = a.slice(e - c, e);
                        var y = d(n, 2, 1);
                        n = y[1];
                        var x = y[0];
                        y = (n + x) / 2;
                        h.push([k, n, y, x]);
                        f.push(k);
                        l.push([n, y, x])
                    }
                    return {values: h, xData: f, yData: l}
                }
            }
        }));
        ""
    });
    v(k, "indicators/price-envelopes.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"]], function (e, f) {
        var l = f.isArray, h = f.merge;
        f = f.seriesType;
        var d = e.seriesTypes.sma;
        f("priceenvelopes", "sma", {
            marker: {enabled: !1},
            tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'},
            params: {period: 20, topBand: .1, bottomBand: .1},
            bottomLine: {styles: {lineWidth: 1, lineColor: void 0}},
            topLine: {styles: {lineWidth: 1}},
            dataGrouping: {approximation: "averages"}
        }, {
            nameComponents: ["period", "topBand", "bottomBand"],
            nameBase: "Price envelopes",
            pointArrayMap: ["top", "middle", "bottom"],
            parallelArrays: ["x", "y", "top", "bottom"],
            pointValKey: "middle",
            init: function () {
                d.prototype.init.apply(this, arguments);
                this.options = h({
                    topLine: {styles: {lineColor: this.color}},
                    bottomLine: {styles: {lineColor: this.color}}
                }, this.options)
            },
            toYData: function (a) {
                return [a.top, a.middle, a.bottom]
            },
            translate: function () {
                var a = this, c = ["plotTop", "plotMiddle", "plotBottom"];
                d.prototype.translate.apply(a);
                a.points.forEach(function (b) {
                    [b.top, b.middle, b.bottom].forEach(function (d, h) {
                        null !== d && (b[c[h]] = a.yAxis.toPixels(d, !0))
                    })
                })
            },
            drawGraph: function () {
                for (var a = this, c = a.points, b = c.length,
                         g = a.options, f = a.graph, l = {options: {gapSize: g.gapSize}}, e = [[], []], k; b--;) k = c[b], e[0].push({
                    plotX: k.plotX,
                    plotY: k.plotTop,
                    isNull: k.isNull
                }), e[1].push({plotX: k.plotX, plotY: k.plotBottom, isNull: k.isNull});
                ["topLine", "bottomLine"].forEach(function (b, c) {
                    a.points = e[c];
                    a.options = h(g[b].styles, l);
                    a.graph = a["graph" + b];
                    d.prototype.drawGraph.call(a);
                    a["graph" + b] = a.graph
                });
                a.points = c;
                a.options = g;
                a.graph = f;
                d.prototype.drawGraph.call(a)
            },
            getValues: function (a, c) {
                var b = c.period, g = c.topBand, h = c.bottomBand, f = a.xData,
                    e = (a = a.yData) ? a.length : 0, k = [], q = [], n = [], y;
                if (!(f.length < b) && l(a[0]) && 4 === a[0].length) {
                    for (y = b; y <= e; y++) {
                        var x = f.slice(y - b, y);
                        var u = a.slice(y - b, y);
                        u = d.prototype.getValues.call(this, {xData: x, yData: u}, c);
                        x = u.xData[0];
                        u = u.yData[0];
                        var A = u * (1 + g);
                        var B = u * (1 - h);
                        k.push([x, A, u, B]);
                        q.push(x);
                        n.push([A, u, B])
                    }
                    return {values: k, xData: q, yData: n}
                }
            }
        });
        ""
    });
    v(k, "indicators/psar.src.js", [k["parts/Utilities.js"]], function (e) {
        e = e.seriesType;
        e("psar", "sma", {
            lineWidth: 0, marker: {enabled: !0}, states: {hover: {lineWidthPlus: 0}},
            params: {initialAccelerationFactor: .02, maxAccelerationFactor: .2, increment: .02, index: 2, decimals: 4}
        }, {
            nameComponents: !1, getValues: function (f, e) {
                var h = f.xData;
                f = f.yData;
                var d = f[0][1], a = e.maxAccelerationFactor, c = e.increment, b = e.initialAccelerationFactor,
                    g = f[0][2], l = e.decimals, k = e.index, m = [], p = [], q = [], n = 1, y;
                if (!(k >= f.length)) {
                    for (y = 0; y < k; y++) d = Math.max(f[y][1], d), g = Math.min(f[y][2], parseFloat(g.toFixed(l)));
                    var x = f[y][1] > g ? 1 : -1;
                    e = e.initialAccelerationFactor;
                    var u = e * (d - g);
                    m.push([h[k], g]);
                    p.push(h[k]);
                    q.push(parseFloat(g.toFixed(l)));
                    for (y = k + 1; y < f.length; y++) {
                        k = f[y - 1][2];
                        var A = f[y - 2][2];
                        var B = f[y - 1][1];
                        var C = f[y - 2][1];
                        var w = f[y][1];
                        var z = f[y][2];
                        null !== A && null !== C && null !== k && null !== B && null !== w && null !== z && (g = x === n ? 1 === x ? g + u < Math.min(A, k) ? g + u : Math.min(A, k) : g + u > Math.max(C, B) ? g + u : Math.max(C, B) : d, k = 1 === x ? w > d ? w : d : z < d ? z : d, w = 1 === n && z > g || -1 === n && w > g ? 1 : -1, n = w, u = k, z = c, A = a, B = b, e = n === x ? 1 === n && u > d ? e === A ? A : parseFloat((e + z).toFixed(2)) : -1 === n && u < d ? e === A ? A : parseFloat((e + z).toFixed(2)) : e : B, d = k - g, u = e * d, m.push([h[y], parseFloat(g.toFixed(l))]), p.push(h[y]),
                            q.push(parseFloat(g.toFixed(l))), n = x, x = w, d = k)
                    }
                    return {values: m, xData: p, yData: q}
                }
            }
        });
        ""
    });
    v(k, "indicators/roc.src.js", [k["parts/Utilities.js"]], function (e) {
        var f = e.isArray;
        e = e.seriesType;
        e("roc", "sma", {params: {index: 3, period: 9}}, {
            nameBase: "Rate of Change", getValues: function (e, h) {
                var d = h.period, a = e.xData, c = (e = e.yData) ? e.length : 0, b = [], g = [], l = [], k = -1;
                if (!(a.length <= d)) {
                    f(e[0]) && (k = h.index);
                    for (h = d; h < c; h++) {
                        var m = 0 > k ? (m = e[h - d]) ? (e[h] - m) / m * 100 : null : (m = e[h - d][k]) ? (e[h][k] - m) / m * 100 : null;
                        m = [a[h], m];
                        b.push(m);
                        g.push(m[0]);
                        l.push(m[1])
                    }
                    return {values: b, xData: g, yData: l}
                }
            }
        });
        ""
    });
    v(k, "indicators/rsi.src.js", [k["parts/Utilities.js"]], function (e) {
        var f = e.isArray;
        e = e.seriesType;
        e("rsi", "sma", {params: {period: 14, decimals: 4}}, {
            getValues: function (e, h) {
                var d = h.period, a = e.xData, c = (e = e.yData) ? e.length : 0;
                h = h.decimals;
                var b = 1, g = [], l = [], k = [], m = 0, p = 0, q;
                if (!(a.length < d) && f(e[0]) && 4 === e[0].length) {
                    for (; b < d;) {
                        var n = parseFloat((e[b][3] - e[b - 1][3]).toFixed(h));
                        0 < n ? m += n : p += Math.abs(n);
                        b++
                    }
                    var y = parseFloat((m / (d - 1)).toFixed(h));
                    for (q = parseFloat((p / (d - 1)).toFixed(h)); b < c; b++) n = parseFloat((e[b][3] - e[b - 1][3]).toFixed(h)), 0 < n ? (m = n, p = 0) : (m = 0, p = Math.abs(n)), y = parseFloat(((y * (d - 1) + m) / d).toFixed(h)), q = parseFloat(((q * (d - 1) + p) / d).toFixed(h)), m = 0 === q ? 100 : 0 === y ? 0 : parseFloat((100 - 100 / (1 + y / q)).toFixed(h)), g.push([a[b], m]), l.push(a[b]), k.push(m);
                    return {values: g, xData: l, yData: k}
                }
            }
        });
        ""
    });
    v(k, "indicators/stochastic.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/reduce-array.js"], k["mixins/multipe-lines.js"]], function (e,
                                                                                                                                                                f, l, h) {
        var d = f.isArray, a = f.merge;
        f = f.seriesType;
        var c = e.seriesTypes.sma, b = l.getArrayExtremes;
        f("stochastic", "sma", {
            params: {periods: [14, 3]},
            marker: {enabled: !1},
            tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span><b> {series.name}</b><br/>%K: {point.y}<br/>%D: {point.smoothed}<br/>'},
            smoothedLine: {styles: {lineWidth: 1, lineColor: void 0}},
            dataGrouping: {approximation: "averages"}
        }, a(h, {
            nameComponents: ["periods"],
            nameBase: "Stochastic",
            pointArrayMap: ["y", "smoothed"],
            parallelArrays: ["x", "y",
                "smoothed"],
            pointValKey: "y",
            linesApiNames: ["smoothedLine"],
            init: function () {
                c.prototype.init.apply(this, arguments);
                this.options = a({smoothedLine: {styles: {lineColor: this.color}}}, this.options)
            },
            getValues: function (a, e) {
                var g = e.periods[0];
                e = e.periods[1];
                var h = a.xData, f = (a = a.yData) ? a.length : 0, l = [], n = [], k = [], t = null, u;
                if (!(f < g) && d(a[0]) && 4 === a[0].length) {
                    for (u = g - 1; u < f; u++) {
                        var A = a.slice(u - g + 1, u + 1);
                        var B = b(A, 2, 1);
                        var C = B[0];
                        A = a[u][3] - C;
                        C = B[1] - C;
                        A = A / C * 100;
                        n.push(h[u]);
                        k.push([A, null]);
                        u >= g - 1 + (e - 1) && (t = c.prototype.getValues.call(this,
                            {xData: n.slice(-e), yData: k.slice(-e)}, {period: e}), t = t.yData[0]);
                        l.push([h[u], A, t]);
                        k[k.length - 1][1] = t
                    }
                    return {values: l, xData: n, yData: k}
                }
            }
        }));
        ""
    });
    v(k, "indicators/slow-stochastic.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/indicator-required.js"]], function (e, f, l) {
        f = f.seriesType;
        var h = e.seriesTypes;
        f("slowstochastic", "stochastic", {params: {periods: [14, 3, 3]}}, {
            nameBase: "Slow Stochastic", init: function () {
                var d = arguments, a = this;
                l.isParentLoaded(e.seriesTypes.stochastic, "stochastic", a.type,
                    function (c) {
                        c.prototype.init.apply(a, d)
                    })
            }, getValues: function (d, a) {
                var c = a.periods, b = h.stochastic.prototype.getValues.call(this, d, a);
                d = {values: [], xData: [], yData: []};
                a = 0;
                if (b) {
                    d.xData = b.xData.slice(c[1] - 1);
                    b = b.yData.slice(c[1] - 1);
                    var g = h.sma.prototype.getValues.call(this, {xData: d.xData, yData: b}, {index: 1, period: c[2]});
                    if (g) {
                        for (var e = d.xData.length; a < e; a++) d.yData[a] = [b[a][1], g.yData[a - c[2] + 1] || null], d.values[a] = [d.xData[a], b[a][1], g.yData[a - c[2] + 1] || null];
                        return d
                    }
                }
            }
        });
        ""
    });
    v(k, "indicators/supertrend.src.js",
        [k["parts/Globals.js"], k["parts/Utilities.js"]], function (e, f) {
            function l(a, b, c) {
                return {index: b, close: a.yData[b][c], x: a.xData[b]}
            }

            var h = f.correctFloat, d = f.merge, a = f.seriesType, c = f.isArray, b = f.objectEach,
                g = e.seriesTypes.atr, k = e.seriesTypes.sma;
            a("supertrend", "sma", {
                params: {multiplier: 3, period: 10},
                risingTrendColor: "#06B535",
                fallingTrendColor: "#F21313",
                changeTrendLine: {styles: {lineWidth: 1, lineColor: "#333333", dashStyle: "LongDash"}}
            }, {
                nameBase: "Supertrend", nameComponents: ["multiplier", "period"], requiredIndicators: ["atr"],
                init: function () {
                    k.prototype.init.apply(this, arguments);
                    var a = this.options;
                    a.cropThreshold = this.linkedParent.options.cropThreshold - (a.params.period - 1)
                }, drawGraph: function () {
                    var a = this, c = a.options, g = a.linkedParent, e = g ? g.points : [], h = a.points, f = a.graph,
                        t = h.length, u = e.length - t;
                    u = 0 < u ? u : 0;
                    for (var A = {options: {gapSize: c.gapSize}}, B = {top: [], bottom: [], intersect: []}, C = {
                        top: {
                            styles: {
                                lineWidth: c.lineWidth,
                                lineColor: c.fallingTrendColor || c.color,
                                dashStyle: c.dashStyle
                            }
                        }, bottom: {
                            styles: {
                                lineWidth: c.lineWidth, lineColor: c.risingTrendColor ||
                                    c.color, dashStyle: c.dashStyle
                            }
                        }, intersect: c.changeTrendLine
                    }, w, z, E, v, G, H, D, I; t--;) w = h[t], z = h[t - 1], E = e[t - 1 + u], v = e[t - 2 + u], G = e[t + u], H = e[t + u + 1], D = w.options.color, I = {
                        x: w.x,
                        plotX: w.plotX,
                        plotY: w.plotY,
                        isNull: !1
                    }, !v && E && g.yData[E.index - 1] && (v = l(g, E.index - 1, 3)), !H && G && g.yData[G.index + 1] && (H = l(g, G.index + 1, 3)), !E && v && g.yData[v.index + 1] ? E = l(g, v.index + 1, 3) : !E && G && g.yData[G.index - 1] && (E = l(g, G.index - 1, 3)), w && E && G && v && w.x !== E.x && (w.x === G.x ? (v = E, E = G) : w.x === v.x ? (E = v, v = {
                        close: g.yData[E.index - 1][3], x: g.xData[E.index -
                        1]
                    }) : H && w.x === H.x && (E = H, v = G)), z && v && E ? (G = {
                        x: z.x,
                        plotX: z.plotX,
                        plotY: z.plotY,
                        isNull: !1
                    }, w.y >= E.close && z.y >= v.close ? (w.color = D || c.fallingTrendColor || c.color, B.top.push(I)) : w.y < E.close && z.y < v.close ? (w.color = D || c.risingTrendColor || c.color, B.bottom.push(I)) : (B.intersect.push(I), B.intersect.push(G), B.intersect.push(d(G, {isNull: !0})), w.y >= E.close && z.y < v.close ? (w.color = D || c.fallingTrendColor || c.color, z.color = D || c.risingTrendColor || c.color, B.top.push(I), B.top.push(d(G, {isNull: !0}))) : w.y < E.close && z.y >= v.close &&
                        (w.color = D || c.risingTrendColor || c.color, z.color = D || c.fallingTrendColor || c.color, B.bottom.push(I), B.bottom.push(d(G, {isNull: !0}))))) : E && (w.y >= E.close ? (w.color = D || c.fallingTrendColor || c.color, B.top.push(I)) : (w.color = D || c.risingTrendColor || c.color, B.bottom.push(I)));
                    b(B, function (b, c) {
                        a.points = b;
                        a.options = d(C[c].styles, A);
                        a.graph = a["graph" + c + "Line"];
                        k.prototype.drawGraph.call(a);
                        a["graph" + c + "Line"] = a.graph
                    });
                    a.points = h;
                    a.options = c;
                    a.graph = f
                }, getValues: function (a, b) {
                    var d = b.period;
                    b = b.multiplier;
                    var e =
                        a.xData, f = a.yData, l = [], k = [], m = [], t = 0 === d ? 0 : d - 1, r = [], C = [], w;
                    if (!(e.length <= d || !c(f[0]) || 4 !== f[0].length || 0 > d)) {
                        a = g.prototype.getValues.call(this, a, {period: d}).yData;
                        for (w = 0; w < a.length; w++) {
                            var z = f[t + w];
                            var v = f[t + w - 1] || [];
                            var L = r[w - 1];
                            var G = C[w - 1];
                            var H = m[w - 1];
                            0 === w && (L = G = H = 0);
                            d = h((z[1] + z[2]) / 2 + b * a[w]);
                            var D = h((z[1] + z[2]) / 2 - b * a[w]);
                            r[w] = d < L || v[3] > L ? d : L;
                            C[w] = D > G || v[3] < G ? D : G;
                            if (H === L && z[3] < r[w] || H === G && z[3] < C[w]) var I = r[w]; else if (H === L && z[3] > r[w] || H === G && z[3] > C[w]) I = C[w];
                            l.push([e[t + w], I]);
                            k.push(e[t +
                            w]);
                            m.push(I)
                        }
                        return {values: l, xData: k, yData: m}
                    }
                }
            });
            ""
        });
    v(k, "indicators/volume-by-price.src.js", [k["parts/Globals.js"], k["parts/Point.js"], k["parts/Utilities.js"]], function (e, f, l) {
        var h = l.addEvent, d = l.animObject, a = l.arrayMax, c = l.arrayMin, b = l.correctFloat, g = l.error,
            k = l.extend, r = l.isArray;
        l = l.seriesType;
        var m = Math.abs, p = e.noop, q = e.seriesTypes.column.prototype;
        l("vbp", "sma", {
            params: {ranges: 12, volumeSeriesID: "volume"},
            zoneLines: {enabled: !0, styles: {color: "#0A9AC9", dashStyle: "LongDash", lineWidth: 1}},
            volumeDivision: {
                enabled: !0,
                styles: {positiveColor: "rgba(144, 237, 125, 0.8)", negativeColor: "rgba(244, 91, 91, 0.8)"}
            },
            animationLimit: 1E3,
            enableMouseTracking: !1,
            pointPadding: 0,
            zIndex: -1,
            crisp: !0,
            dataGrouping: {enabled: !1},
            dataLabels: {
                allowOverlap: !0,
                enabled: !0,
                format: "P: {point.volumePos:.2f} | N: {point.volumeNeg:.2f}",
                padding: 0,
                style: {fontSize: "7px"},
                verticalAlign: "top"
            }
        }, {
            nameBase: "Volume by Price",
            bindTo: {series: !1, eventName: "afterSetExtremes"},
            calculateOn: "render",
            markerAttribs: p,
            drawGraph: p,
            getColumnMetrics: q.getColumnMetrics,
            crispCol: q.crispCol,
            init: function (a) {
                e.seriesTypes.sma.prototype.init.apply(this, arguments);
                var b = this.options.params;
                var c = this.linkedParent;
                b = a.get(b.volumeSeriesID);
                this.addCustomEvents(c, b);
                return this
            },
            addCustomEvents: function (a, b) {
                function c() {
                    d.chart.redraw();
                    d.setData([]);
                    d.zoneStarts = [];
                    d.zoneLinesSVG && (d.zoneLinesSVG.destroy(), delete d.zoneLinesSVG)
                }

                var d = this;
                d.dataEventsToUnbind.push(h(a, "remove", function () {
                    c()
                }));
                b && d.dataEventsToUnbind.push(h(b, "remove", function () {
                    c()
                }));
                return d
            },
            animate: function (a) {
                var b =
                    this, c = b.chart.inverted, g = b.group, e = {};
                !a && g && (a = c ? "translateY" : "translateX", c = c ? b.yAxis.top : b.xAxis.left, g["forceAnimate:" + a] = !0, e[a] = c, g.animate(e, k(d(b.options.animation), {
                    step: function (a, c) {
                        b.group.attr({scaleX: Math.max(.001, c.pos)})
                    }
                })))
            },
            drawPoints: function () {
                this.options.volumeDivision.enabled && (this.posNegVolume(!0, !0), q.drawPoints.apply(this, arguments), this.posNegVolume(!1, !1));
                q.drawPoints.apply(this, arguments)
            },
            posNegVolume: function (a, b) {
                var c = b ? ["positive", "negative"] : ["negative", "positive"],
                    d = this.options.volumeDivision, g = this.points.length, e = [], h = [], f = 0, l;
                a ? (this.posWidths = e, this.negWidths = h) : (e = this.posWidths, h = this.negWidths);
                for (; f < g; f++) {
                    var k = this.points[f];
                    k[c[0] + "Graphic"] = k.graphic;
                    k.graphic = k[c[1] + "Graphic"];
                    if (a) {
                        var n = k.shapeArgs.width;
                        var m = this.priceZones[f];
                        (l = m.wholeVolumeData) ? (e.push(n / l * m.positiveVolumeData), h.push(n / l * m.negativeVolumeData)) : (e.push(0), h.push(0))
                    }
                    k.color = b ? d.styles.positiveColor : d.styles.negativeColor;
                    k.shapeArgs.width = b ? this.posWidths[f] : this.negWidths[f];
                    k.shapeArgs.x = b ? k.shapeArgs.x : this.posWidths[f]
                }
            },
            translate: function () {
                var c = this, d = c.options, g = c.chart, e = c.yAxis, h = e.min, f = c.options.zoneLines,
                    l = c.priceZones, k = 0, p, t, r;
                q.translate.apply(c);
                var v = c.points;
                if (v.length) {
                    var H = .5 > d.pointPadding ? d.pointPadding : .1;
                    d = c.volumeDataArray;
                    var D = a(d);
                    var I = g.plotWidth / 2;
                    var N = g.plotTop;
                    var J = m(e.toPixels(h) - e.toPixels(h + c.rangeStep));
                    var M = m(e.toPixels(h) - e.toPixels(h + c.rangeStep));
                    H && (h = m(J * (1 - 2 * H)), k = m((J - h) / 2), J = m(h));
                    v.forEach(function (a, d) {
                        t = a.barX = a.plotX =
                            0;
                        r = a.plotY = e.toPixels(l[d].start) - N - (e.reversed ? J - M : J) - k;
                        p = b(I * l[d].wholeVolumeData / D);
                        a.pointWidth = p;
                        a.shapeArgs = c.crispCol.apply(c, [t, r, p, J]);
                        a.volumeNeg = l[d].negativeVolumeData;
                        a.volumePos = l[d].positiveVolumeData;
                        a.volumeAll = l[d].wholeVolumeData
                    });
                    f.enabled && c.drawZones(g, e, c.zoneStarts, f.styles)
                }
            },
            getValues: function (a, b) {
                var c = a.processedXData, d = a.processedYData, e = this.chart, h = b.ranges, f = [], l = [], k = [], m;
                if (a.chart) if (m = e.get(b.volumeSeriesID)) if ((b = r(d[0])) && 4 !== d[0].length) g("Type of " + a.name +
                    " series is different than line, OHLC or candlestick.", !0, e); else return (this.priceZones = this.specifyZones(b, c, d, h, m)).forEach(function (a, b) {
                    f.push([a.x, a.end]);
                    l.push(f[b][0]);
                    k.push(f[b][1])
                }), {
                    values: f,
                    xData: l,
                    yData: k
                }; else g("Series " + b.volumeSeriesID + " not found! Check `volumeSeriesID`.", !0, e); else g("Base series not found! In case it has been removed, add a new one.", !0, e)
            },
            specifyZones: function (d, e, g, h, f) {
                if (d) {
                    var l = g.length;
                    for (var k = g[0][3], m = k, n = 1, p; n < l; n++) p = g[n][3], p < k && (k = p), p > m && (m =
                        p);
                    l = {min: k, max: m}
                } else l = !1;
                l = (k = l) ? k.min : c(g);
                p = k ? k.max : a(g);
                k = this.zoneStarts = [];
                m = [];
                var t = 0;
                n = 1;
                if (!l || !p) return this.points.length && (this.setData([]), this.zoneStarts = [], this.zoneLinesSVG.destroy()), [];
                var q = this.rangeStep = b(p - l) / h;
                for (k.push(l); t < h - 1; t++) k.push(b(k[t] + q));
                k.push(p);
                for (h = k.length; n < h; n++) m.push({index: n - 1, x: e[0], start: k[n - 1], end: k[n]});
                return this.volumePerZone(d, m, f, e, g)
            },
            volumePerZone: function (a, b, c, d, g) {
                var e = this, h = c.processedXData, f = c.processedYData, l = b.length - 1, k = g.length;
                c = f.length;
                var n, p, t, q, r;
                m(k - c) && (d[0] !== h[0] && f.unshift(0), d[k - 1] !== h[c - 1] && f.push(0));
                e.volumeDataArray = [];
                b.forEach(function (b) {
                    b.wholeVolumeData = 0;
                    b.positiveVolumeData = 0;
                    for (r = b.negativeVolumeData = 0; r < k; r++) t = p = !1, q = a ? g[r][3] : g[r], n = r ? a ? g[r - 1][3] : g[r - 1] : q, q <= b.start && 0 === b.index && (p = !0), q >= b.end && b.index === l && (t = !0), (q > b.start || p) && (q < b.end || t) && (b.wholeVolumeData += f[r], n > q ? b.negativeVolumeData += f[r] : b.positiveVolumeData += f[r]);
                    e.volumeDataArray.push(b.wholeVolumeData)
                });
                return b
            },
            drawZones: function (a,
                                 b, c, d) {
                var g = a.renderer, e = this.zoneLinesSVG, h = [], f = a.plotWidth, k = a.plotTop, l;
                c.forEach(function (c) {
                    l = b.toPixels(c) - k;
                    h = h.concat(a.renderer.crispLine([["M", 0, l], ["L", f, l]], d.lineWidth))
                });
                e ? e.animate({d: h}) : e = this.zoneLinesSVG = g.path(h).attr({
                    "stroke-width": d.lineWidth,
                    stroke: d.color,
                    dashstyle: d.dashStyle,
                    zIndex: this.group.zIndex + .1
                }).add(this.group)
            }
        }, {
            destroy: function () {
                this.negativeGraphic && (this.negativeGraphic = this.negativeGraphic.destroy());
                return f.prototype.destroy.apply(this, arguments)
            }
        });
        ""
    });
    v(k, "indicators/vwap.src.js", [k["parts/Utilities.js"]], function (e) {
        var f = e.error, l = e.isArray;
        e = e.seriesType;
        e("vwap", "sma", {params: {period: 30, volumeSeriesID: "volume"}}, {
            getValues: function (e, d) {
                var a = e.chart, c = e.xData;
                e = e.yData;
                var b = d.period, g = !0, h;
                if (h = a.get(d.volumeSeriesID)) return l(e[0]) || (g = !1), this.calculateVWAPValues(g, c, e, h, b);
                f("Series " + d.volumeSeriesID + " not found! Check `volumeSeriesID`.", !0, a)
            }, calculateVWAPValues: function (e, d, a, c, b) {
                var g = c.yData, h = c.xData.length, f = d.length;
                c = [];
                var l = [], k = [], q = [], n = [], y;
                h = f <= h ? f : h;
                for (y = f = 0; f < h; f++) {
                    var v = e ? (a[f][1] + a[f][2] + a[f][3]) / 3 : a[f];
                    v *= g[f];
                    v = y ? c[f - 1] + v : v;
                    var u = y ? l[f - 1] + g[f] : g[f];
                    c.push(v);
                    l.push(u);
                    n.push([d[f], v / u]);
                    k.push(n[f][0]);
                    q.push(n[f][1]);
                    y++;
                    y === b && (y = 0)
                }
                return {values: n, xData: k, yData: q}
            }
        });
        ""
    });
    v(k, "indicators/williams-r.src.js", [k["parts/Utilities.js"], k["mixins/reduce-array.js"]], function (e, f) {
        var l = e.isArray;
        e = e.seriesType;
        var h = f.getArrayExtremes;
        e("williamsr", "sma", {params: {period: 14}}, {
            nameBase: "Williams %R", getValues: function (d,
                                                          a) {
                a = a.period;
                var c = d.xData, b = (d = d.yData) ? d.length : 0, e = [], f = [], k = [], m;
                if (!(c.length < a) && l(d[0]) && 4 === d[0].length) {
                    for (m = a - 1; m < b; m++) {
                        var p = d.slice(m - a + 1, m + 1);
                        var q = h(p, 2, 1);
                        p = q[0];
                        q = q[1];
                        var n = d[m][3];
                        p = (q - n) / (q - p) * -100;
                        c[m] && (e.push([c[m], p]), f.push(c[m]), k.push(p))
                    }
                    return {values: e, xData: f, yData: k}
                }
            }
        });
        ""
    });
    v(k, "indicators/wma.src.js", [k["parts/Utilities.js"]], function (e) {
        function f(d, a) {
            a *= (a + 1) / 2;
            return d.reduce(function (a, b, d) {
                return [null, a[1] + b[1] * (d + 1)]
            })[1] / a
        }

        function k(d, a, c, b) {
            c = f(d, d.length);
            a = a[b - 1];
            d.shift();
            return [a, c]
        }

        var h = e.isArray;
        e = e.seriesType;
        e("wma", "sma", {params: {index: 3, period: 9}}, {
            getValues: function (d, a) {
                var c = a.period, b = d.xData, e = (d = d.yData) ? d.length : 0, f = 1, l = b[0], m = d[0], p = [],
                    q = [], n = [], v = -1;
                if (!(b.length < c)) {
                    h(d[0]) && (v = a.index, m = d[0][v]);
                    for (a = [[l, m]]; f !== c;) a.push([b[f], 0 > v ? d[f] : d[f][v]]), f++;
                    for (c = f; c < e; c++) f = k(a, b, d, c), p.push(f), q.push(f[0]), n.push(f[1]), a.push([b[c], 0 > v ? d[c] : d[c][v]]);
                    f = k(a, b, d, c);
                    p.push(f);
                    q.push(f[0]);
                    n.push(f[1]);
                    return {values: p, xData: q, yData: n}
                }
            }
        });
        ""
    });
    v(k, "indicators/zigzag.src.js", [k["parts/Utilities.js"]], function (e) {
        e = e.seriesType;
        e("zigzag", "sma", {params: {lowIndex: 2, highIndex: 1, deviation: 1}}, {
            nameComponents: ["deviation"], nameSuffixes: ["%"], nameBase: "Zig Zag", getValues: function (e, k) {
                var f = k.lowIndex, d = k.highIndex, a = k.deviation / 100;
                k = 1 + a;
                var c = 1 - a;
                a = e.xData;
                var b = e.yData;
                e = b ? b.length : 0;
                var g = [], l = [], r = [], m, p, q = !1, n = !1;
                if (!(!a || 1 >= a.length || e && (void 0 === b[0][f] || void 0 === b[0][d]))) {
                    var v = b[0][f];
                    var x = b[0][d];
                    for (m = 1; m < e; m++) {
                        if (b[m][f] <=
                            x * c) {
                            g.push([a[0], x]);
                            var u = [a[m], b[m][f]];
                            q = p = !0
                        } else b[m][d] >= v * k && (g.push([a[0], v]), u = [a[m], b[m][d]], p = !1, q = !0);
                        if (q) {
                            l.push(g[0][0]);
                            r.push(g[0][1]);
                            var A = m++;
                            m = e
                        }
                    }
                    for (m = A; m < e; m++) p ? (b[m][f] <= u[1] && (u = [a[m], b[m][f]]), b[m][d] >= u[1] * k && (n = d)) : (b[m][d] >= u[1] && (u = [a[m], b[m][d]]), b[m][f] <= u[1] * c && (n = f)), !1 !== n && (g.push(u), l.push(u[0]), r.push(u[1]), u = [a[m], b[m][n]], p = !p, n = !1);
                    f = g.length;
                    0 !== f && g[f - 1][0] < a[e - 1] && (g.push(u), l.push(u[0]), r.push(u[1]));
                    return {values: g, xData: l, yData: r}
                }
            }
        });
        ""
    });
    v(k, "indicators/regressions.src.js",
        [k["parts/Utilities.js"]], function (e) {
            var f = e.isArray;
            e = e.seriesType;
            e("linearRegression", "sma", {params: {xAxisUnit: void 0}, tooltip: {valueDecimals: 4}}, {
                nameBase: "Linear Regression Indicator", getRegressionLineParameters: function (e, h) {
                    var d = this.options.params.index, a = function (a, b) {
                        return f(a) ? a[b] : a
                    }, c = e.reduce(function (a, b) {
                        return b + a
                    }, 0), b = h.reduce(function (b, c) {
                        return a(c, d) + b
                    }, 0);
                    c /= e.length;
                    b /= h.length;
                    var g = 0, k = 0, l;
                    for (l = 0; l < e.length; l++) {
                        var m = e[l] - c;
                        var p = a(h[l], d) - b;
                        g += m * p;
                        k += Math.pow(m, 2)
                    }
                    e =
                        k ? g / k : 0;
                    return {slope: e, intercept: b - e * c}
                }, getEndPointY: function (e, f) {
                    return e.slope * f + e.intercept
                }, transformXData: function (e, f) {
                    var d = e[0];
                    return e.map(function (a) {
                        return (a - d) / f
                    })
                }, findClosestDistance: function (e) {
                    var f, d;
                    for (d = 1; d < e.length - 1; d++) {
                        var a = e[d] - e[d - 1];
                        0 < a && ("undefined" === typeof f || a < f) && (f = a)
                    }
                    return f
                }, getValues: function (e, f) {
                    var d = e.xData;
                    e = e.yData;
                    f = f.period;
                    var a, c = {xData: [], yData: [], values: []},
                        b = this.options.params.xAxisUnit || this.findClosestDistance(d);
                    for (a = f - 1; a <= d.length - 1; a++) {
                        var g =
                            a - f + 1;
                        var h = a + 1;
                        var k = d[a];
                        var l = d.slice(g, h);
                        g = e.slice(g, h);
                        h = this.transformXData(l, b);
                        l = this.getRegressionLineParameters(h, g);
                        g = this.getEndPointY(l, h[h.length - 1]);
                        c.values.push({regressionLineParameters: l, x: k, y: g});
                        c.xData.push(k);
                        c.yData.push(g)
                    }
                    return c
                }
            });
            e("linearRegressionSlope", "linearRegression", {}, {
                nameBase: "Linear Regression Slope Indicator",
                getEndPointY: function (e) {
                    return e.slope
                }
            });
            e("linearRegressionIntercept", "linearRegression", {}, {
                nameBase: "Linear Regression Intercept Indicator",
                getEndPointY: function (e) {
                    return e.intercept
                }
            });
            e("linearRegressionAngle", "linearRegression", {tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span>{series.name}: <b>{point.y}\u00b0</b><br/>'}}, {
                nameBase: "Linear Regression Angle Indicator",
                slopeToAngle: function (e) {
                    return 180 / Math.PI * Math.atan(e)
                },
                getEndPointY: function (e) {
                    return this.slopeToAngle(e.slope)
                }
            });
            ""
        });
    v(k, "indicators/acceleration-bands.src.js", [k["parts/Globals.js"], k["parts/Utilities.js"], k["mixins/multipe-lines.js"]], function (e, f, k) {
        var h = f.correctFloat, d = f.merge;
        f =
            f.seriesType;
        var a = e.seriesTypes.sma;
        f("abands", "sma", {
            params: {period: 20, factor: .001, index: 3},
            lineWidth: 1,
            topLine: {styles: {lineWidth: 1}},
            bottomLine: {styles: {lineWidth: 1}},
            dataGrouping: {approximation: "averages"}
        }, d(k, {
            pointArrayMap: ["top", "middle", "bottom"],
            pointValKey: "middle",
            nameBase: "Acceleration Bands",
            nameComponents: ["period", "factor"],
            linesApiNames: ["topLine", "bottomLine"],
            getValues: function (c, b) {
                var d = b.period, e = b.factor;
                b = b.index;
                var f = c.xData, k = (c = c.yData) ? c.length : 0, l = [], q = [], n = [], v = [],
                    x = [], u;
                if (!(k < d)) {
                    for (u = 0; u <= k; u++) {
                        if (u < k) {
                            var A = c[u][2];
                            var B = c[u][1];
                            var C = e;
                            A = h(B - A) / (h(B + A) / 2) * 1E3 * C;
                            l.push(c[u][1] * h(1 + 2 * A));
                            q.push(c[u][2] * h(1 - 2 * A))
                        }
                        if (u >= d) {
                            A = f.slice(u - d, u);
                            var w = c.slice(u - d, u);
                            C = a.prototype.getValues.call(this, {xData: A, yData: l.slice(u - d, u)}, {period: d});
                            B = a.prototype.getValues.call(this, {xData: A, yData: q.slice(u - d, u)}, {period: d});
                            w = a.prototype.getValues.call(this, {xData: A, yData: w}, {period: d, index: b});
                            A = w.xData[0];
                            C = C.yData[0];
                            B = B.yData[0];
                            w = w.yData[0];
                            n.push([A, C, w, B]);
                            v.push(A);
                            x.push([C, w, B])
                        }
                    }
                    return {values: n, xData: v, yData: x}
                }
            }
        }));
        ""
    });
    v(k, "indicators/trendline.src.js", [k["parts/Utilities.js"]], function (e) {
        var f = e.isArray;
        e = e.seriesType;
        e("trendline", "sma", {params: {index: 3}}, {
            nameBase: "Trendline", nameComponents: !1, getValues: function (e, h) {
                var d = e.xData, a = e.yData;
                e = [];
                var c = [], b = [], g = 0, k = 0, l = 0, m = 0, p = d.length, q = h.index;
                for (h = 0; h < p; h++) {
                    var n = d[h];
                    var v = f(a[h]) ? a[h][q] : a[h];
                    g += n;
                    k += v;
                    l += n * v;
                    m += n * n
                }
                a = (p * l - g * k) / (p * m - g * g);
                isNaN(a) && (a = 0);
                g = (k - a * g) / p;
                for (h = 0; h < p; h++) n = d[h], v = a *
                    n + g, e[h] = [n, v], c[h] = n, b[h] = v;
                return {xData: c, yData: b, values: e}
            }
        });
        ""
    });
    v(k, "masters/indicators/indicators-all.src.js", [], function () {
    })
});
//# sourceMappingURL=indicators-all.js.map