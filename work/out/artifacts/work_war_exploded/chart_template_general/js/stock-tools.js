/*
 Highstock JS v8.1.0 (2020-05-05)

 Advanced Highstock tools

 (c) 2010-2019 Highsoft AS
 Author: Torstein Honsi

 License: www.highcharts.com/license
*/
(function (g) {
    "object" === typeof module && module.exports ? (g["default"] = g, module.exports = g) : "function" === typeof define && define.amd ? define("highcharts/modules/stock-tools", ["highcharts", "highcharts/modules/stock"], function (q) {
        g(q);
        g.Highcharts = q;
        return g
    }) : g("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function (g) {
    function q(m, l, g, n) {
        m.hasOwnProperty(l) || (m[l] = n.apply(null, g))
    }

    g = g ? g._modules : {};
    q(g, "mixins/navigation.js", [], function () {
        return {
            initUpdate: function (m) {
                m.navigation || (m.navigation = {
                    updates: [],
                    update: function (l, m) {
                        this.updates.forEach(function (n) {
                            n.update.call(n.context, l, m)
                        })
                    }
                })
            }, addUpdate: function (m, l) {
                l.navigation || this.initUpdate(l);
                l.navigation.updates.push({update: m, context: l})
            }
        }
    });
    q(g, "annotations/navigationBindings.js", [g["parts/Globals.js"], g["parts/Utilities.js"], g["mixins/navigation.js"]], function (m, l, g) {
        function n(b) {
            var d = b.prototype.defaultOptions.events && b.prototype.defaultOptions.events.click;
            a(!0, b.prototype.defaultOptions.events, {
                click: function (a) {
                    var b = this, c = b.chart.navigationBindings,
                        e = c.activeAnnotation;
                    d && d.click.call(b, a);
                    e !== b ? (c.deselectAnnotation(), c.activeAnnotation = b, b.setControlPointsVisibility(!0), u(c, "showPopup", {
                        annotation: b,
                        formType: "annotation-toolbar",
                        options: c.annotationToFields(b),
                        onSubmit: function (a) {
                            var d = {};
                            "remove" === a.actionType ? (c.activeAnnotation = !1, c.chart.removeAnnotation(b)) : (c.fieldsToOptions(a.fields, d), c.deselectAnnotation(), a = d.typeOptions, "measure" === b.options.type && (a.crosshairY.enabled = 0 !== a.crosshairY.strokeWidth, a.crosshairX.enabled = 0 !== a.crosshairX.strokeWidth),
                                b.update(d))
                        }
                    })) : (c.deselectAnnotation(), u(c, "closePopup"));
                    a.activeAnnotation = !0
                }
            })
        }

        var v = l.addEvent, y = l.attr, t = l.format, u = l.fireEvent, p = l.isArray, q = l.isFunction, w = l.isNumber,
            h = l.isObject, a = l.merge, b = l.objectEach, c = l.pick, e = m.doc, k = m.win, f = function () {
                function d(a, b) {
                    this.selectedButton = this.boundClassNames = void 0;
                    this.chart = a;
                    this.options = b;
                    this.eventsToUnbind = [];
                    this.container = e.getElementsByClassName(this.options.bindingsClassName || "")
                }

                d.prototype.initEvents = function () {
                    var a = this, d = a.chart, c = a.container,
                        e = a.options;
                    a.boundClassNames = {};
                    b(e.bindings || {}, function (b) {
                        a.boundClassNames[b.className] = b
                    });
                    [].forEach.call(c, function (b) {
                        a.eventsToUnbind.push(v(b, "click", function (d) {
                            var c = a.getButtonEvents(b, d);
                            c && a.bindingsButtonClick(c.button, c.events, d)
                        }))
                    });
                    b(e.events || {}, function (b, d) {
                        q(b) && a.eventsToUnbind.push(v(a, d, b))
                    });
                    a.eventsToUnbind.push(v(d.container, "click", function (b) {
                        !d.cancelClick && d.isInsidePlot(b.chartX - d.plotLeft, b.chartY - d.plotTop) && a.bindingsChartClick(this, b)
                    }));
                    a.eventsToUnbind.push(v(d.container,
                        "mousemove", function (b) {
                            a.bindingsContainerMouseMove(this, b)
                        }))
                };
                d.prototype.initUpdate = function () {
                    var a = this;
                    g.addUpdate(function (b) {
                        a.update(b)
                    }, this.chart)
                };
                d.prototype.bindingsButtonClick = function (a, b, d) {
                    var c = this.chart;
                    this.selectedButtonElement && (u(this, "deselectButton", {button: this.selectedButtonElement}), this.nextEvent && (this.currentUserDetails && "annotations" === this.currentUserDetails.coll && c.removeAnnotation(this.currentUserDetails), this.mouseMoveEvent = this.nextEvent = !1));
                    this.selectedButton =
                        b;
                    this.selectedButtonElement = a;
                    u(this, "selectButton", {button: a});
                    b.init && b.init.call(this, a, d);
                    (b.start || b.steps) && c.renderer.boxWrapper.addClass("highcharts-draw-mode")
                };
                d.prototype.bindingsChartClick = function (a, b) {
                    a = this.chart;
                    var d = this.selectedButton;
                    a = a.renderer.boxWrapper;
                    var c;
                    if (c = this.activeAnnotation && !b.activeAnnotation && b.target.parentNode) {
                        a:{
                            c = b.target;
                            var e = k.Element.prototype, f = e.matches || e.msMatchesSelector || e.webkitMatchesSelector,
                                r = null;
                            if (e.closest) r = e.closest.call(c, ".highcharts-popup");
                            else {
                                do {
                                    if (f.call(c, ".highcharts-popup")) break a;
                                    c = c.parentElement || c.parentNode
                                } while (null !== c && 1 === c.nodeType)
                            }
                            c = r
                        }
                        c = !c
                    }
                    c && (u(this, "closePopup"), this.deselectAnnotation());
                    d && d.start && (this.nextEvent ? (this.nextEvent(b, this.currentUserDetails), this.steps && (this.stepIndex++, d.steps[this.stepIndex] ? this.mouseMoveEvent = this.nextEvent = d.steps[this.stepIndex] : (u(this, "deselectButton", {button: this.selectedButtonElement}), a.removeClass("highcharts-draw-mode"), d.end && d.end.call(this, b, this.currentUserDetails),
                        this.mouseMoveEvent = this.nextEvent = !1, this.selectedButton = null))) : (this.currentUserDetails = d.start.call(this, b), d.steps ? (this.stepIndex = 0, this.steps = !0, this.mouseMoveEvent = this.nextEvent = d.steps[this.stepIndex]) : (u(this, "deselectButton", {button: this.selectedButtonElement}), a.removeClass("highcharts-draw-mode"), this.steps = !1, this.selectedButton = null, d.end && d.end.call(this, b, this.currentUserDetails))))
                };
                d.prototype.bindingsContainerMouseMove = function (a, b) {
                    this.mouseMoveEvent && this.mouseMoveEvent(b,
                        this.currentUserDetails)
                };
                d.prototype.fieldsToOptions = function (a, d) {
                    b(a, function (a, b) {
                        var e = parseFloat(a), f = b.split("."), r = d, k = f.length - 1;
                        !w(e) || a.match(/px/g) || b.match(/format/g) || (a = e);
                        "" !== a && "undefined" !== a && f.forEach(function (b, d) {
                            var e = c(f[d + 1], "");
                            k === d ? r[b] = a : (r[b] || (r[b] = e.match(/\d/g) ? [] : {}), r = r[b])
                        })
                    });
                    return d
                };
                d.prototype.deselectAnnotation = function () {
                    this.activeAnnotation && (this.activeAnnotation.setControlPointsVisibility(!1), this.activeAnnotation = !1)
                };
                d.prototype.annotationToFields =
                    function (a) {
                        function e(d, c, f, r) {
                            if (f && -1 === g.indexOf(c) && (0 <= (f.indexOf && f.indexOf(c)) || f[c] || !0 === f)) if (p(d)) r[c] = [], d.forEach(function (a, d) {
                                h(a) ? (r[c][d] = {}, b(a, function (a, b) {
                                    e(a, b, k[c], r[c][d])
                                })) : e(a, 0, k[c], r[c])
                            }); else if (h(d)) {
                                var x = {};
                                p(r) ? (r.push(x), x[c] = {}, x = x[c]) : r[c] = x;
                                b(d, function (a, b) {
                                    e(a, b, 0 === c ? f : k[c], x)
                                })
                            } else "format" === c ? r[c] = [t(d, a.labels[0].points[0]).toString(), "text"] : p(r) ? r.push([d, l(d)]) : r[c] = [d, l(d)]
                        }

                        var f = a.options, r = d.annotationsEditable, k = r.nestedOptions, l = this.utils.getFieldType,
                            m = c(f.type, f.shapes && f.shapes[0] && f.shapes[0].type, f.labels && f.labels[0] && f.labels[0].itemType, "label"),
                            g = d.annotationsNonEditable[f.langKey] || [], n = {langKey: f.langKey, type: m};
                        b(f, function (a, d) {
                            "typeOptions" === d ? (n[d] = {}, b(f[d], function (a, b) {
                                e(a, b, k, n[d], !0)
                            })) : e(a, d, r[m], n)
                        });
                        return n
                    };
                d.prototype.getClickedClassNames = function (a, b) {
                    var d = b.target;
                    b = [];
                    for (var c; d && ((c = y(d, "class")) && (b = b.concat(c.split(" ").map(function (a) {
                        return [a, d]
                    }))), d = d.parentNode, d !== a);) ;
                    return b
                };
                d.prototype.getButtonEvents =
                    function (a, b) {
                        var d = this, c;
                        this.getClickedClassNames(a, b).forEach(function (a) {
                            d.boundClassNames[a[0]] && !c && (c = {events: d.boundClassNames[a[0]], button: a[1]})
                        });
                        return c
                    };
                d.prototype.update = function (b) {
                    this.options = a(!0, this.options, b);
                    this.removeEvents();
                    this.initEvents()
                };
                d.prototype.removeEvents = function () {
                    this.eventsToUnbind.forEach(function (a) {
                        a()
                    })
                };
                d.prototype.destroy = function () {
                    this.removeEvents()
                };
                d.annotationsEditable = {
                    nestedOptions: {
                        labelOptions: ["style", "format", "backgroundColor"],
                        labels: ["style"],
                        label: ["style"],
                        style: ["fontSize", "color"],
                        background: ["fill", "strokeWidth", "stroke"],
                        innerBackground: ["fill", "strokeWidth", "stroke"],
                        outerBackground: ["fill", "strokeWidth", "stroke"],
                        shapeOptions: ["fill", "strokeWidth", "stroke"],
                        shapes: ["fill", "strokeWidth", "stroke"],
                        line: ["strokeWidth", "stroke"],
                        backgroundColors: [!0],
                        connector: ["fill", "strokeWidth", "stroke"],
                        crosshairX: ["strokeWidth", "stroke"],
                        crosshairY: ["strokeWidth", "stroke"]
                    },
                    circle: ["shapes"],
                    verticalLine: [],
                    label: ["labelOptions"],
                    measure: ["background",
                        "crosshairY", "crosshairX"],
                    fibonacci: [],
                    tunnel: ["background", "line", "height"],
                    pitchfork: ["innerBackground", "outerBackground"],
                    rect: ["shapes"],
                    crookedLine: [],
                    basicAnnotation: []
                };
                d.annotationsNonEditable = {rectangle: ["crosshairX", "crosshairY", "label"]};
                return d
            }();
        f.prototype.utils = {
            updateRectSize: function (a, b) {
                var d = b.chart, c = b.options.typeOptions, e = d.pointer.getCoordinates(a);
                a = e.xAxis[0].value - c.point.x;
                c = c.point.y - e.yAxis[0].value;
                b.update({
                    typeOptions: {
                        background: {
                            width: d.inverted ? c : a, height: d.inverted ?
                                a : c
                        }
                    }
                })
            }, getFieldType: function (a) {
                return {string: "text", number: "number", "boolean": "checkbox"}[typeof a]
            }
        };
        m.Chart.prototype.initNavigationBindings = function () {
            var a = this.options;
            a && a.navigation && a.navigation.bindings && (this.navigationBindings = new f(this, a.navigation), this.navigationBindings.initEvents(), this.navigationBindings.initUpdate())
        };
        v(m.Chart, "load", function () {
            this.initNavigationBindings()
        });
        v(m.Chart, "destroy", function () {
            this.navigationBindings && this.navigationBindings.destroy()
        });
        v(f, "deselectButton",
            function () {
                this.selectedButtonElement = null
            });
        v(m.Annotation, "remove", function () {
            this.chart.navigationBindings && this.chart.navigationBindings.deselectAnnotation()
        });
        m.Annotation && (n(m.Annotation), b(m.Annotation.types, function (a) {
            n(a)
        }));
        m.setOptions({
            lang: {
                navigation: {
                    popup: {
                        simpleShapes: "Simple shapes",
                        lines: "Lines",
                        circle: "Circle",
                        rectangle: "Rectangle",
                        label: "Label",
                        shapeOptions: "Shape options",
                        typeOptions: "Details",
                        fill: "Fill",
                        format: "Text",
                        strokeWidth: "Line width",
                        stroke: "Line color",
                        title: "Title",
                        name: "Name",
                        labelOptions: "Label options",
                        labels: "Labels",
                        backgroundColor: "Background color",
                        backgroundColors: "Background colors",
                        borderColor: "Border color",
                        borderRadius: "Border radius",
                        borderWidth: "Border width",
                        style: "Style",
                        padding: "Padding",
                        fontSize: "Font size",
                        color: "Color",
                        height: "Height",
                        shapes: "Shape options"
                    }
                }
            }, navigation: {
                bindingsClassName: "highcharts-bindings-container", bindings: {
                    circleAnnotation: {
                        className: "highcharts-circle-annotation", start: function (b) {
                            b = this.chart.pointer.getCoordinates(b);
                            var d = this.chart.options.navigation;
                            return this.chart.addAnnotation(a({
                                langKey: "circle",
                                type: "basicAnnotation",
                                shapes: [{
                                    type: "circle",
                                    point: {xAxis: 0, yAxis: 0, x: b.xAxis[0].value, y: b.yAxis[0].value},
                                    r: 5
                                }]
                            }, d.annotationsOptions, d.bindings.circleAnnotation.annotationsOptions))
                        }, steps: [function (a, b) {
                            var d = b.options.shapes[0].point, c = this.chart.xAxis[0].toPixels(d.x);
                            d = this.chart.yAxis[0].toPixels(d.y);
                            var e = this.chart.inverted;
                            b.update({
                                shapes: [{
                                    r: Math.max(Math.sqrt(Math.pow(e ? d - a.chartX : c - a.chartX, 2) +
                                        Math.pow(e ? c - a.chartY : d - a.chartY, 2)), 5)
                                }]
                            })
                        }]
                    }, rectangleAnnotation: {
                        className: "highcharts-rectangle-annotation", start: function (b) {
                            var d = this.chart.pointer.getCoordinates(b);
                            b = this.chart.options.navigation;
                            var c = d.xAxis[0].value;
                            d = d.yAxis[0].value;
                            return this.chart.addAnnotation(a({
                                langKey: "rectangle",
                                type: "basicAnnotation",
                                shapes: [{
                                    type: "path",
                                    points: [{xAxis: 0, yAxis: 0, x: c, y: d}, {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: c,
                                        y: d
                                    }, {xAxis: 0, yAxis: 0, x: c, y: d}, {xAxis: 0, yAxis: 0, x: c, y: d}]
                                }]
                            }, b.annotationsOptions, b.bindings.rectangleAnnotation.annotationsOptions))
                        },
                        steps: [function (a, b) {
                            var d = b.options.shapes[0].points, c = this.chart.pointer.getCoordinates(a);
                            a = c.xAxis[0].value;
                            c = c.yAxis[0].value;
                            d[1].x = a;
                            d[2].x = a;
                            d[2].y = c;
                            d[3].y = c;
                            b.update({shapes: [{points: d}]})
                        }]
                    }, labelAnnotation: {
                        className: "highcharts-label-annotation", start: function (b) {
                            b = this.chart.pointer.getCoordinates(b);
                            var c = this.chart.options.navigation;
                            return this.chart.addAnnotation(a({
                                langKey: "label", type: "basicAnnotation", labelOptions: {format: "{y:.2f}"}, labels: [{
                                    point: {
                                        xAxis: 0, yAxis: 0, x: b.xAxis[0].value,
                                        y: b.yAxis[0].value
                                    }, overflow: "none", crop: !0
                                }]
                            }, c.annotationsOptions, c.bindings.labelAnnotation.annotationsOptions))
                        }
                    }
                }, events: {}, annotationsOptions: {}
            }
        });
        return f
    });
    q(g, "modules/stock-tools-bindings.js", [g["parts/Globals.js"], g["annotations/navigationBindings.js"], g["parts/Utilities.js"]], function (m, l, g) {
        var n = g.correctFloat, v = g.defined, q = g.extend, t = g.fireEvent, u = g.isNumber, p = g.merge, y = g.pick,
            w = g.uniqueKey, h = l.prototype.utils;
        h.addFlagFromForm = function (a) {
            return function (b) {
                var c = this, e = c.chart, k =
                    e.stockTools, f = h.getFieldType;
                b = h.attractToPoint(b, e);
                var d = {
                    type: "flags",
                    onSeries: b.series.id,
                    shape: a,
                    data: [{x: b.x, y: b.y}],
                    point: {
                        events: {
                            click: function () {
                                var a = this, b = a.options;
                                t(c, "showPopup", {
                                    point: a,
                                    formType: "annotation-toolbar",
                                    options: {
                                        langKey: "flags",
                                        type: "flags",
                                        title: [b.title, f(b.title)],
                                        name: [b.name, f(b.name)]
                                    },
                                    onSubmit: function (b) {
                                        "remove" === b.actionType ? a.remove() : a.update(c.fieldsToOptions(b.fields, {}))
                                    }
                                })
                            }
                        }
                    }
                };
                k && k.guiEnabled || e.addSeries(d);
                t(c, "showPopup", {
                    formType: "flag", options: {
                        langKey: "flags",
                        type: "flags", title: ["A", f("A")], name: ["Flag A", f("Flag A")]
                    }, onSubmit: function (a) {
                        c.fieldsToOptions(a.fields, d.data[0]);
                        e.addSeries(d)
                    }
                })
            }
        };
        h.manageIndicators = function (a) {
            var b = this.chart, c = {linkedTo: a.linkedTo, type: a.type}, e = ["ad", "cmf", "mfi", "vbp", "vwap"],
                k = "ad atr cci cmf macd mfi roc rsi ao aroon aroonoscillator trix apo dpo ppo natr williamsr stochastic slowstochastic linearRegression linearRegressionSlope linearRegressionIntercept linearRegressionAngle".split(" ");
            if ("edit" === a.actionType) this.fieldsToOptions(a.fields,
                c), (a = b.get(a.seriesId)) && a.update(c, !1); else if ("remove" === a.actionType) {
                if (a = b.get(a.seriesId)) {
                    var f = a.yAxis;
                    a.linkedSeries && a.linkedSeries.forEach(function (a) {
                        a.remove(!1)
                    });
                    a.remove(!1);
                    0 <= k.indexOf(a.type) && (f.remove(!1), this.resizeYAxes())
                }
            } else c.id = w(), this.fieldsToOptions(a.fields, c), 0 <= k.indexOf(a.type) ? (f = b.addAxis({
                id: w(),
                offset: 0,
                opposite: !0,
                title: {text: ""},
                tickPixelInterval: 40,
                showLastLabel: !1,
                labels: {align: "left", y: -2}
            }, !1, !1), c.yAxis = f.options.id, this.resizeYAxes()) : c.yAxis = b.get(a.linkedTo).options.yAxis,
            0 <= e.indexOf(a.type) && (c.params.volumeSeriesID = b.series.filter(function (a) {
                return "column" === a.options.type
            })[0].options.id), b.addSeries(c, !1);
            t(this, "deselectButton", {button: this.selectedButtonElement});
            b.redraw()
        };
        h.updateHeight = function (a, b) {
            b.update({typeOptions: {height: this.chart.pointer.getCoordinates(a).yAxis[0].value - b.options.typeOptions.points[1].y}})
        };
        h.attractToPoint = function (a, b) {
            a = b.pointer.getCoordinates(a);
            var c = a.xAxis[0].value;
            a = a.yAxis[0].value;
            var e = Number.MAX_VALUE, k;
            b.series.forEach(function (a) {
                a.points.forEach(function (a) {
                    a &&
                    e > Math.abs(a.x - c) && (e = Math.abs(a.x - c), k = a)
                })
            });
            return {
                x: k.x,
                y: k.y,
                below: a < k.y,
                series: k.series,
                xAxis: k.series.xAxis.index || 0,
                yAxis: k.series.yAxis.index || 0
            }
        };
        h.isNotNavigatorYAxis = function (a) {
            return "highcharts-navigator-yaxis" !== a.userOptions.className
        };
        h.updateNthPoint = function (a) {
            return function (b, c) {
                var e = c.options.typeOptions;
                b = this.chart.pointer.getCoordinates(b);
                var k = b.xAxis[0].value, f = b.yAxis[0].value;
                e.points.forEach(function (b, c) {
                    c >= a && (b.x = k, b.y = f)
                });
                c.update({typeOptions: {points: e.points}})
            }
        };
        q(l.prototype, {
            getYAxisPositions: function (a, b, c) {
                function e(a) {
                    return v(a) && !u(a) && a.match("%")
                }

                var k = 0;
                a = a.map(function (a) {
                    var d = e(a.options.height) ? parseFloat(a.options.height) / 100 : a.height / b;
                    a = e(a.options.top) ? parseFloat(a.options.top) / 100 : n(a.top - a.chart.plotTop) / b;
                    u(d) || (d = c / 100);
                    k = n(k + d);
                    return {height: 100 * d, top: 100 * a}
                });
                a.allAxesHeight = k;
                return a
            }, getYAxisResizers: function (a) {
                var b = [];
                a.forEach(function (c, e) {
                    c = a[e + 1];
                    b[e] = c ? {enabled: !0, controlledAxis: {next: [y(c.options.id, c.options.index)]}} :
                        {enabled: !1}
                });
                return b
            }, resizeYAxes: function (a) {
                a = a || 20;
                var b = this.chart, c = b.yAxis.filter(h.isNotNavigatorYAxis), e = c.length;
                b = this.getYAxisPositions(c, b.plotHeight, a);
                var k = this.getYAxisResizers(c), f = b.allAxesHeight, d = a;
                1 < f ? (6 > e ? (b[0].height = n(b[0].height - d), b = this.recalculateYAxisPositions(b, d)) : (a = 100 / e, b = this.recalculateYAxisPositions(b, a / (e - 1), !0, -1)), b[e - 1] = {
                    top: n(100 - a),
                    height: a
                }) : (d = 100 * n(1 - f), 5 > e ? (b[0].height = n(b[0].height + d), b = this.recalculateYAxisPositions(b, d)) : b = this.recalculateYAxisPositions(b,
                    d / e, !0, 1));
                b.forEach(function (a, b) {
                    c[b].update({height: a.height + "%", top: a.top + "%", resize: k[b]}, !1)
                })
            }, recalculateYAxisPositions: function (a, b, c, e) {
                a.forEach(function (k, f) {
                    f = a[f - 1];
                    k.top = f ? n(f.height + f.top) : 0;
                    c && (k.height = n(k.height + e * b))
                });
                return a
            }
        });
        g = {
            segment: {
                className: "highcharts-segment", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "segment", type: "crookedLine", typeOptions: {
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }]
                        }
                    }, b.annotationsOptions, b.bindings.segment.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1)]
            },
            arrowSegment: {
                className: "highcharts-arrow-segment", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "arrowSegment",
                        type: "crookedLine",
                        typeOptions: {
                            line: {markerEnd: "arrow"},
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }]
                        }
                    }, b.annotationsOptions, b.bindings.arrowSegment.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1)]
            },
            ray: {
                className: "highcharts-ray", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "ray",
                        type: "crookedLine",
                        typeOptions: {
                            type: "ray",
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }]
                        }
                    }, b.annotationsOptions, b.bindings.ray.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1)]
            },
            arrowRay: {
                className: "highcharts-arrow-ray",
                start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "arrowRay",
                        type: "infinityLine",
                        typeOptions: {
                            type: "ray",
                            line: {markerEnd: "arrow"},
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }]
                        }
                    }, b.annotationsOptions, b.bindings.arrowRay.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1)]
            },
            infinityLine: {
                className: "highcharts-infinity-line", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "infinityLine",
                        type: "infinityLine",
                        typeOptions: {
                            type: "line",
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }]
                        }
                    }, b.annotationsOptions, b.bindings.infinityLine.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1)]
            },
            arrowInfinityLine: {
                className: "highcharts-arrow-infinity-line", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "arrowInfinityLine",
                        type: "infinityLine",
                        typeOptions: {
                            type: "line",
                            line: {markerEnd: "arrow"},
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }]
                        }
                    }, b.annotationsOptions, b.bindings.arrowInfinityLine.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1)]
            },
            horizontalLine: {
                className: "highcharts-horizontal-line", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "horizontalLine", type: "infinityLine", draggable: "y",
                        typeOptions: {type: "horizontalLine", points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}]}
                    }, b.annotationsOptions, b.bindings.horizontalLine.annotationsOptions);
                    this.chart.addAnnotation(a)
                }
            },
            verticalLine: {
                className: "highcharts-vertical-line", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "verticalLine",
                        type: "infinityLine",
                        draggable: "x",
                        typeOptions: {type: "verticalLine", points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}]}
                    }, b.annotationsOptions, b.bindings.verticalLine.annotationsOptions);
                    this.chart.addAnnotation(a)
                }
            },
            crooked3: {
                className: "highcharts-crooked3", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "crooked3",
                        type: "crookedLine",
                        typeOptions: {
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }, {x: a.xAxis[0].value, y: a.yAxis[0].value}]
                        }
                    }, b.annotationsOptions, b.bindings.crooked3.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1), h.updateNthPoint(2)]
            },
            crooked5: {
                className: "highcharts-crooked5",
                start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "crookedLine",
                        type: "crookedLine",
                        typeOptions: {
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }, {x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }, {x: a.xAxis[0].value, y: a.yAxis[0].value}]
                        }
                    }, b.annotationsOptions, b.bindings.crooked5.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1), h.updateNthPoint(2),
                    h.updateNthPoint(3), h.updateNthPoint(4)]
            },
            elliott3: {
                className: "highcharts-elliott3", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "elliott3",
                        type: "elliottWave",
                        typeOptions: {
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }, {x: a.xAxis[0].value, y: a.yAxis[0].value}, {x: a.xAxis[0].value, y: a.yAxis[0].value}]
                        },
                        labelOptions: {style: {color: "#666666"}}
                    }, b.annotationsOptions, b.bindings.elliott3.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1), h.updateNthPoint(2), h.updateNthPoint(3)]
            },
            elliott5: {
                className: "highcharts-elliott5",
                start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "elliott5", type: "elliottWave", typeOptions: {
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }, {x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }, {x: a.xAxis[0].value, y: a.yAxis[0].value},
                                {x: a.xAxis[0].value, y: a.yAxis[0].value}]
                        }, labelOptions: {style: {color: "#666666"}}
                    }, b.annotationsOptions, b.bindings.elliott5.annotationsOptions);
                    return this.chart.addAnnotation(a)
                },
                steps: [h.updateNthPoint(1), h.updateNthPoint(2), h.updateNthPoint(3), h.updateNthPoint(4), h.updateNthPoint(5)]
            },
            measureX: {
                className: "highcharts-measure-x", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "measure", type: "measure", typeOptions: {
                            selectType: "x",
                            point: {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value, xAxis: 0, yAxis: 0
                            },
                            crosshairX: {strokeWidth: 1, stroke: "#000000"},
                            crosshairY: {enabled: !1, strokeWidth: 0, stroke: "#000000"},
                            background: {width: 0, height: 0, strokeWidth: 0, stroke: "#ffffff"}
                        }, labelOptions: {style: {color: "#666666"}}
                    }, b.annotationsOptions, b.bindings.measureX.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateRectSize]
            },
            measureY: {
                className: "highcharts-measure-y", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "measure",
                        type: "measure",
                        typeOptions: {
                            selectType: "y",
                            point: {x: a.xAxis[0].value, y: a.yAxis[0].value, xAxis: 0, yAxis: 0},
                            crosshairX: {enabled: !1, strokeWidth: 0, stroke: "#000000"},
                            crosshairY: {strokeWidth: 1, stroke: "#000000"},
                            background: {width: 0, height: 0, strokeWidth: 0, stroke: "#ffffff"}
                        },
                        labelOptions: {style: {color: "#666666"}}
                    }, b.annotationsOptions, b.bindings.measureY.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateRectSize]
            },
            measureXY: {
                className: "highcharts-measure-xy", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "measure",
                        type: "measure",
                        typeOptions: {
                            selectType: "xy",
                            point: {x: a.xAxis[0].value, y: a.yAxis[0].value, xAxis: 0, yAxis: 0},
                            background: {width: 0, height: 0, strokeWidth: 10},
                            crosshairX: {strokeWidth: 1, stroke: "#000000"},
                            crosshairY: {strokeWidth: 1, stroke: "#000000"}
                        },
                        labelOptions: {style: {color: "#666666"}}
                    }, b.annotationsOptions, b.bindings.measureXY.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateRectSize]
            },
            fibonacci: {
                className: "highcharts-fibonacci",
                start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "fibonacci",
                        type: "fibonacci",
                        typeOptions: {
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }]
                        },
                        labelOptions: {style: {color: "#666666"}}
                    }, b.annotationsOptions, b.bindings.fibonacci.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1), h.updateHeight]
            },
            parallelChannel: {
                className: "highcharts-parallel-channel", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "parallelChannel",
                        type: "tunnel",
                        typeOptions: {
                            points: [{x: a.xAxis[0].value, y: a.yAxis[0].value}, {
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value
                            }]
                        }
                    }, b.annotationsOptions, b.bindings.parallelChannel.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1), h.updateHeight]
            },
            pitchfork: {
                className: "highcharts-pitchfork", start: function (a) {
                    a = this.chart.pointer.getCoordinates(a);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "pitchfork", type: "pitchfork",
                        typeOptions: {
                            points: [{
                                x: a.xAxis[0].value,
                                y: a.yAxis[0].value,
                                controlPoint: {style: {fill: "red"}}
                            }, {x: a.xAxis[0].value, y: a.yAxis[0].value}, {x: a.xAxis[0].value, y: a.yAxis[0].value}],
                            innerBackground: {fill: "rgba(100, 170, 255, 0.8)"}
                        }, shapeOptions: {strokeWidth: 2}
                    }, b.annotationsOptions, b.bindings.pitchfork.annotationsOptions);
                    return this.chart.addAnnotation(a)
                }, steps: [h.updateNthPoint(1), h.updateNthPoint(2)]
            },
            verticalCounter: {
                className: "highcharts-vertical-counter", start: function (a) {
                    a = h.attractToPoint(a, this.chart);
                    var b = this.chart.options.navigation, c = v(this.verticalCounter) ? this.verticalCounter : 0;
                    a = p({
                        langKey: "verticalCounter",
                        type: "verticalLine",
                        typeOptions: {
                            point: {x: a.x, y: a.y, xAxis: a.xAxis, yAxis: a.yAxis},
                            label: {offset: a.below ? 40 : -40, text: c.toString()}
                        },
                        labelOptions: {style: {color: "#666666", fontSize: "11px"}},
                        shapeOptions: {stroke: "rgba(0, 0, 0, 0.75)", strokeWidth: 1}
                    }, b.annotationsOptions, b.bindings.verticalCounter.annotationsOptions);
                    a = this.chart.addAnnotation(a);
                    a.options.events.click.call(a, {})
                }
            },
            verticalLabel: {
                className: "highcharts-vertical-label",
                start: function (a) {
                    a = h.attractToPoint(a, this.chart);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "verticalLabel",
                        type: "verticalLine",
                        typeOptions: {
                            point: {x: a.x, y: a.y, xAxis: a.xAxis, yAxis: a.yAxis},
                            label: {offset: a.below ? 40 : -40}
                        },
                        labelOptions: {style: {color: "#666666", fontSize: "11px"}},
                        shapeOptions: {stroke: "rgba(0, 0, 0, 0.75)", strokeWidth: 1}
                    }, b.annotationsOptions, b.bindings.verticalLabel.annotationsOptions);
                    a = this.chart.addAnnotation(a);
                    a.options.events.click.call(a, {})
                }
            },
            verticalArrow: {
                className: "highcharts-vertical-arrow",
                start: function (a) {
                    a = h.attractToPoint(a, this.chart);
                    var b = this.chart.options.navigation;
                    a = p({
                        langKey: "verticalArrow",
                        type: "verticalLine",
                        typeOptions: {
                            point: {x: a.x, y: a.y, xAxis: a.xAxis, yAxis: a.yAxis},
                            label: {offset: a.below ? 40 : -40, format: " "},
                            connector: {fill: "none", stroke: a.below ? "red" : "green"}
                        },
                        shapeOptions: {stroke: "rgba(0, 0, 0, 0.75)", strokeWidth: 1}
                    }, b.annotationsOptions, b.bindings.verticalArrow.annotationsOptions);
                    a = this.chart.addAnnotation(a);
                    a.options.events.click.call(a, {})
                }
            },
            flagCirclepin: {
                className: "highcharts-flag-circlepin",
                start: h.addFlagFromForm("circlepin")
            },
            flagDiamondpin: {className: "highcharts-flag-diamondpin", start: h.addFlagFromForm("flag")},
            flagSquarepin: {className: "highcharts-flag-squarepin", start: h.addFlagFromForm("squarepin")},
            flagSimplepin: {className: "highcharts-flag-simplepin", start: h.addFlagFromForm("nopin")},
            zoomX: {
                className: "highcharts-zoom-x", init: function (a) {
                    this.chart.update({chart: {zoomType: "x"}});
                    t(this, "deselectButton", {button: a})
                }
            },
            zoomY: {
                className: "highcharts-zoom-y", init: function (a) {
                    this.chart.update({chart: {zoomType: "y"}});
                    t(this, "deselectButton", {button: a})
                }
            },
            zoomXY: {
                className: "highcharts-zoom-xy", init: function (a) {
                    this.chart.update({chart: {zoomType: "xy"}});
                    t(this, "deselectButton", {button: a})
                }
            },
            seriesTypeLine: {
                className: "highcharts-series-type-line", init: function (a) {
                    this.chart.series[0].update({type: "line", useOhlcData: !0});
                    t(this, "deselectButton", {button: a})
                }
            },
            seriesTypeOhlc: {
                className: "highcharts-series-type-ohlc", init: function (a) {
                    this.chart.series[0].update({type: "ohlc"});
                    t(this, "deselectButton", {button: a})
                }
            },
            seriesTypeCandlestick: {
                className: "highcharts-series-type-candlestick",
                init: function (a) {
                    this.chart.series[0].update({type: "candlestick"});
                    t(this, "deselectButton", {button: a})
                }
            },
            fullScreen: {
                className: "highcharts-full-screen", init: function (a) {
                    this.chart.fullscreen.toggle();
                    t(this, "deselectButton", {button: a})
                }
            },
            currentPriceIndicator: {
                className: "highcharts-current-price-indicator", init: function (a) {
                    var b = this.chart, c = b.series[0], e = c.options,
                        k = e.lastVisiblePrice && e.lastVisiblePrice.enabled;
                    e = e.lastPrice && e.lastPrice.enabled;
                    b = b.stockTools;
                    var f = b.getIconsURL();
                    b && b.guiEnabled &&
                    (a.firstChild.style["background-image"] = e ? 'url("' + f + 'current-price-show.svg")' : 'url("' + f + 'current-price-hide.svg")');
                    c.update({
                        lastPrice: {enabled: !e, color: "red"},
                        lastVisiblePrice: {enabled: !k, label: {enabled: !0}}
                    });
                    t(this, "deselectButton", {button: a})
                }
            },
            indicators: {
                className: "highcharts-indicators", init: function () {
                    var a = this;
                    t(a, "showPopup", {
                        formType: "indicators", options: {}, onSubmit: function (b) {
                            a.utils.manageIndicators.call(a, b)
                        }
                    })
                }
            },
            toggleAnnotations: {
                className: "highcharts-toggle-annotations", init: function (a) {
                    var b =
                        this.chart, c = b.stockTools, e = c.getIconsURL();
                    this.toggledAnnotations = !this.toggledAnnotations;
                    (b.annotations || []).forEach(function (a) {
                        a.setVisibility(!this.toggledAnnotations)
                    }, this);
                    c && c.guiEnabled && (a.firstChild.style["background-image"] = this.toggledAnnotations ? 'url("' + e + 'annotations-hidden.svg")' : 'url("' + e + 'annotations-visible.svg")');
                    t(this, "deselectButton", {button: a})
                }
            },
            saveChart: {
                className: "highcharts-save-chart", init: function (a) {
                    var b = this.chart, c = [], e = [], k = [], f = [];
                    b.annotations.forEach(function (a,
                                                    b) {
                        c[b] = a.userOptions
                    });
                    b.series.forEach(function (a) {
                        a.is("sma") ? e.push(a.userOptions) : "flags" === a.type && k.push(a.userOptions)
                    });
                    b.yAxis.forEach(function (a) {
                        h.isNotNavigatorYAxis(a) && f.push(a.options)
                    });
                    m.win.localStorage.setItem("highcharts-chart", JSON.stringify({
                        annotations: c,
                        indicators: e,
                        flags: k,
                        yAxes: f
                    }));
                    t(this, "deselectButton", {button: a})
                }
            }
        };
        m.setOptions({navigation: {bindings: g}});
        l.prototype.utils = p(h, l.prototype.utils)
    });
    q(g, "modules/stock-tools-gui.js", [g["parts/Globals.js"], g["parts/Utilities.js"],
        g["annotations/navigationBindings.js"]], function (g, l, q) {
        var n = l.addEvent, m = l.createElement, y = l.css, t = l.extend, u = l.fireEvent, p = l.getStyle,
            z = l.isArray, w = l.merge, h = l.pick;
        g.setOptions({
            lang: {
                stockTools: {
                    gui: {
                        simpleShapes: "Simple shapes",
                        lines: "Lines",
                        crookedLines: "Crooked lines",
                        measure: "Measure",
                        advanced: "Advanced",
                        toggleAnnotations: "Toggle annotations",
                        verticalLabels: "Vertical labels",
                        flags: "Flags",
                        zoomChange: "Zoom change",
                        typeChange: "Type change",
                        saveChart: "Save chart",
                        indicators: "Indicators",
                        currentPriceIndicator: "Current Price Indicators",
                        zoomX: "Zoom X",
                        zoomY: "Zoom Y",
                        zoomXY: "Zooom XY",
                        fullScreen: "Fullscreen",
                        typeOHLC: "OHLC",
                        typeLine: "Line",
                        typeCandlestick: "Candlestick",
                        circle: "Circle",
                        label: "Label",
                        rectangle: "Rectangle",
                        flagCirclepin: "Flag circle",
                        flagDiamondpin: "Flag diamond",
                        flagSquarepin: "Flag square",
                        flagSimplepin: "Flag simple",
                        measureXY: "Measure XY",
                        measureX: "Measure X",
                        measureY: "Measure Y",
                        segment: "Segment",
                        arrowSegment: "Arrow segment",
                        ray: "Ray",
                        arrowRay: "Arrow ray",
                        line: "Line",
                        arrowLine: "Arrow line",
                        horizontalLine: "Horizontal line",
                        verticalLine: "Vertical line",
                        infinityLine: "Infinity line",
                        crooked3: "Crooked 3 line",
                        crooked5: "Crooked 5 line",
                        elliott3: "Elliott 3 line",
                        elliott5: "Elliott 5 line",
                        verticalCounter: "Vertical counter",
                        verticalLabel: "Vertical label",
                        verticalArrow: "Vertical arrow",
                        fibonacci: "Fibonacci",
                        pitchfork: "Pitchfork",
                        parallelChannel: "Parallel channel"
                    }
                }, navigation: {
                    popup: {
                        circle: "Circle",
                        rectangle: "Rectangle",
                        label: "Label",
                        segment: "Segment",
                        arrowSegment: "Arrow segment",
                        ray: "Ray",
                        arrowRay: "Arrow ray",
                        line: "Line",
                        arrowLine: "Arrow line",
                        horizontalLine: "Horizontal line",
                        verticalLine: "Vertical line",
                        crooked3: "Crooked 3 line",
                        crooked5: "Crooked 5 line",
                        elliott3: "Elliott 3 line",
                        elliott5: "Elliott 5 line",
                        verticalCounter: "Vertical counter",
                        verticalLabel: "Vertical label",
                        verticalArrow: "Vertical arrow",
                        fibonacci: "Fibonacci",
                        pitchfork: "Pitchfork",
                        parallelChannel: "Parallel channel",
                        infinityLine: "Infinity line",
                        measure: "Measure",
                        measureXY: "Measure XY",
                        measureX: "Measure X",
                        measureY: "Measure Y",
                        flags: "Flags",
                        addButton: "add",
                        saveButton: "save",
                        editButton: "edit",
                        removeButton: "remove",
                        series: "Series",
                        volume: "Volume",
                        connector: "Connector",
                        innerBackground: "Inner background",
                        outerBackground: "Outer background",
                        crosshairX: "Crosshair X",
                        crosshairY: "Crosshair Y",
                        tunnel: "Tunnel",
                        background: "Background"
                    }
                }
            }, stockTools: {
                gui: {
                    enabled: !0,
                    className: "highcharts-bindings-wrapper",
                    toolbarClassName: "stocktools-toolbar",
                    buttons: "indicators separator simpleShapes lines crookedLines measure advanced toggleAnnotations separator verticalLabels flags separator zoomChange fullScreen typeChange separator currentPriceIndicator saveChart".split(" "),
                    definitions: {
                        separator: {symbol: "separator.svg"},
                        simpleShapes: {
                            items: ["label", "circle", "rectangle"],
                            circle: {symbol: "circle.svg"},
                            rectangle: {symbol: "rectangle.svg"},
                            label: {symbol: "label.svg"}
                        },
                        flags: {
                            items: ["flagCirclepin", "flagDiamondpin", "flagSquarepin", "flagSimplepin"],
                            flagSimplepin: {symbol: "flag-basic.svg"},
                            flagDiamondpin: {symbol: "flag-diamond.svg"},
                            flagSquarepin: {symbol: "flag-trapeze.svg"},
                            flagCirclepin: {symbol: "flag-elipse.svg"}
                        },
                        lines: {
                            items: "segment arrowSegment ray arrowRay line arrowLine horizontalLine verticalLine".split(" "),
                            segment: {symbol: "segment.svg"},
                            arrowSegment: {symbol: "arrow-segment.svg"},
                            ray: {symbol: "ray.svg"},
                            arrowRay: {symbol: "arrow-ray.svg"},
                            line: {symbol: "line.svg"},
                            arrowLine: {symbol: "arrow-line.svg"},
                            verticalLine: {symbol: "vertical-line.svg"},
                            horizontalLine: {symbol: "horizontal-line.svg"}
                        },
                        crookedLines: {
                            items: ["elliott3", "elliott5", "crooked3", "crooked5"],
                            crooked3: {symbol: "crooked-3.svg"},
                            crooked5: {symbol: "crooked-5.svg"},
                            elliott3: {symbol: "elliott-3.svg"},
                            elliott5: {symbol: "elliott-5.svg"}
                        },
                        verticalLabels: {
                            items: ["verticalCounter",
                                "verticalLabel", "verticalArrow"],
                            verticalCounter: {symbol: "vertical-counter.svg"},
                            verticalLabel: {symbol: "vertical-label.svg"},
                            verticalArrow: {symbol: "vertical-arrow.svg"}
                        },
                        advanced: {
                            items: ["fibonacci", "pitchfork", "parallelChannel"],
                            pitchfork: {symbol: "pitchfork.svg"},
                            fibonacci: {symbol: "fibonacci.svg"},
                            parallelChannel: {symbol: "parallel-channel.svg"}
                        },
                        measure: {
                            items: ["measureXY", "measureX", "measureY"],
                            measureX: {symbol: "measure-x.svg"},
                            measureY: {symbol: "measure-y.svg"},
                            measureXY: {symbol: "measure-xy.svg"}
                        },
                        toggleAnnotations: {symbol: "annotations-visible.svg"},
                        currentPriceIndicator: {symbol: "current-price-show.svg"},
                        indicators: {symbol: "indicators.svg"},
                        zoomChange: {
                            items: ["zoomX", "zoomY", "zoomXY"],
                            zoomX: {symbol: "zoom-x.svg"},
                            zoomY: {symbol: "zoom-y.svg"},
                            zoomXY: {symbol: "zoom-xy.svg"}
                        },
                        typeChange: {
                            items: ["typeOHLC", "typeLine", "typeCandlestick"],
                            typeOHLC: {symbol: "series-ohlc.svg"},
                            typeLine: {symbol: "series-line.svg"},
                            typeCandlestick: {symbol: "series-candlestick.svg"}
                        },
                        fullScreen: {symbol: "fullscreen.svg"},
                        saveChart: {symbol: "save-chart.svg"}
                    }
                }
            }
        });
        n(g.Chart, "afterGetContainer", function () {
            this.setStockTools()
        });
        n(g.Chart, "getMargins", function () {
            var a = this.stockTools && this.stockTools.listWrapper;
            (a = a && (a.startWidth + p(a, "padding-left") + p(a, "padding-right") || a.offsetWidth)) && a < this.plotWidth && (this.plotLeft += a)
        });
        n(g.Chart, "destroy", function () {
            this.stockTools && this.stockTools.destroy()
        });
        n(g.Chart, "redraw", function () {
            this.stockTools && this.stockTools.guiEnabled && this.stockTools.redraw()
        });
        l = function () {
            function a(a, c, e) {
                this.wrapper = this.toolbar =
                    this.submenu = this.showhideBtn = this.listWrapper = this.arrowWrapper = this.arrowUp = this.arrowDown = void 0;
                this.chart = e;
                this.options = a;
                this.lang = c;
                this.iconsURL = this.getIconsURL();
                this.guiEnabled = a.enabled;
                this.visible = h(a.visible, !0);
                this.placed = h(a.placed, !1);
                this.eventsToUnbind = [];
                this.guiEnabled && (this.createHTML(), this.init(), this.showHideNavigatorion());
                u(this, "afterInit")
            }

            a.prototype.init = function () {
                var a = this, c = this.lang, e = this.options, k = this.toolbar, f = a.addSubmenu, d = e.definitions,
                    h = k.childNodes,
                    g;
                e.buttons.forEach(function (b) {
                    g = a.addButton(k, d, b, c);
                    a.eventsToUnbind.push(n(g.buttonWrapper, "click", function () {
                        a.eraseActiveButtons(h, g.buttonWrapper)
                    }));
                    z(d[b].items) && f.call(a, g, d[b])
                })
            };
            a.prototype.addSubmenu = function (a, c) {
                var b = this, k = a.submenuArrow, f = a.buttonWrapper, d = p(f, "width"), g = this.wrapper,
                    h = this.listWrapper, l = this.toolbar.childNodes, t = 0, q;
                this.submenu = q = m("ul", {className: "highcharts-submenu-wrapper"}, null, f);
                this.addSubmenuItems(f, c);
                b.eventsToUnbind.push(n(k, "click", function (a) {
                    a.stopPropagation();
                    b.eraseActiveButtons(l, f);
                    0 <= f.className.indexOf("highcharts-current") ? (h.style.width = h.startWidth + "px", f.classList.remove("highcharts-current"), q.style.display = "none") : (q.style.display = "block", t = q.offsetHeight - f.offsetHeight - 3, q.offsetHeight + f.offsetTop > g.offsetHeight && f.offsetTop > t || (t = 0), y(q, {
                        top: -t + "px",
                        left: d + 3 + "px"
                    }), f.className += " highcharts-current", h.startWidth = g.offsetWidth, h.style.width = h.startWidth + p(h, "padding-left") + q.offsetWidth + 3 + "px")
                }))
            };
            a.prototype.addSubmenuItems = function (a, c) {
                var b =
                    this, k = this.submenu, f = this.lang, d = this.listWrapper, h;
                c.items.forEach(function (e) {
                    h = b.addButton(k, c, e, f);
                    b.eventsToUnbind.push(n(h.mainButton, "click", function () {
                        b.switchSymbol(this, a, !0);
                        d.style.width = d.startWidth + "px";
                        k.style.display = "none"
                    }))
                });
                var g = k.querySelectorAll("li > .highcharts-menu-item-btn")[0];
                b.switchSymbol(g, !1)
            };
            a.prototype.eraseActiveButtons = function (a, c, e) {
                [].forEach.call(a, function (a) {
                    a !== c && (a.classList.remove("highcharts-current"), a.classList.remove("highcharts-active"), e = a.querySelectorAll(".highcharts-submenu-wrapper"),
                    0 < e.length && (e[0].style.display = "none"))
                })
            };
            a.prototype.addButton = function (b, c, e, g) {
                void 0 === g && (g = {});
                c = c[e];
                var f = c.items, d = c.className || "";
                e = m("li", {className: h(a.prototype.classMapping[e], "") + " " + d, title: g[e] || e}, null, b);
                b = m("span", {className: "highcharts-menu-item-btn"}, null, e);
                if (f && f.length) {
                    var k = m("span", {className: "highcharts-submenu-item-arrow highcharts-arrow-right"}, null, e);
                    k.style["background-image"] = "url(" + this.iconsURL + "arrow-bottom.svg)"
                } else b.style["background-image"] = "url(" + this.iconsURL +
                    c.symbol + ")";
                return {buttonWrapper: e, mainButton: b, submenuArrow: k}
            };
            a.prototype.addNavigation = function () {
                var a = this.wrapper;
                this.arrowWrapper = m("div", {className: "highcharts-arrow-wrapper"});
                this.arrowUp = m("div", {className: "highcharts-arrow-up"}, null, this.arrowWrapper);
                this.arrowUp.style["background-image"] = "url(" + this.iconsURL + "arrow-right.svg)";
                this.arrowDown = m("div", {className: "highcharts-arrow-down"}, null, this.arrowWrapper);
                this.arrowDown.style["background-image"] = "url(" + this.iconsURL + "arrow-right.svg)";
                a.insertBefore(this.arrowWrapper, a.childNodes[0]);
                this.scrollButtons()
            };
            a.prototype.scrollButtons = function () {
                var a = 0, c = this.wrapper, e = this.toolbar, g = .1 * c.offsetHeight;
                this.eventsToUnbind.push(n(this.arrowUp, "click", function () {
                    0 < a && (a -= g, e.style["margin-top"] = -a + "px")
                }));
                this.eventsToUnbind.push(n(this.arrowDown, "click", function () {
                    c.offsetHeight + a <= e.offsetHeight + g && (a += g, e.style["margin-top"] = -a + "px")
                }))
            };
            a.prototype.createHTML = function () {
                var a = this.chart, c = this.options, e = a.container;
                a = a.options.navigation;
                this.wrapper = a = m("div", {className: "highcharts-stocktools-wrapper " + c.className + " " + (a && a.bindingsClassName)});
                e.parentNode.insertBefore(a, e);
                this.toolbar = e = m("ul", {className: "highcharts-stocktools-toolbar " + c.toolbarClassName});
                this.listWrapper = c = m("div", {className: "highcharts-menu-wrapper"});
                a.insertBefore(c, a.childNodes[0]);
                c.insertBefore(e, c.childNodes[0]);
                this.showHideToolbar();
                this.addNavigation()
            };
            a.prototype.showHideNavigatorion = function () {
                this.visible && this.toolbar.offsetHeight > this.wrapper.offsetHeight -
                50 ? this.arrowWrapper.style.display = "block" : (this.toolbar.style.marginTop = "0px", this.arrowWrapper.style.display = "none")
            };
            a.prototype.showHideToolbar = function () {
                var a = this.chart, c = this.wrapper, e = this.listWrapper, g = this.submenu, f = this.visible, d;
                this.showhideBtn = d = m("div", {className: "highcharts-toggle-toolbar highcharts-arrow-left"}, null, c);
                d.style["background-image"] = "url(" + this.iconsURL + "arrow-right.svg)";
                f ? (c.style.height = "100%", d.style.top = p(e, "padding-top") + "px", d.style.left = c.offsetWidth + p(e, "padding-left") +
                    "px") : (g && (g.style.display = "none"), d.style.left = "0px", this.visible = f = !1, e.classList.add("highcharts-hide"), d.classList.toggle("highcharts-arrow-right"), c.style.height = d.offsetHeight + "px");
                this.eventsToUnbind.push(n(d, "click", function () {
                    a.update({stockTools: {gui: {visible: !f, placed: !0}}})
                }))
            };
            a.prototype.switchSymbol = function (a, c) {
                var b = a.parentNode, g = b.classList.value;
                b = b.parentNode.parentNode;
                b.className = "";
                g && b.classList.add(g.trim());
                b.querySelectorAll(".highcharts-menu-item-btn")[0].style["background-image"] =
                    a.style["background-image"];
                c && this.selectButton(b)
            };
            a.prototype.selectButton = function (a) {
                0 <= a.className.indexOf("highcharts-active") ? a.classList.remove("highcharts-active") : a.classList.add("highcharts-active")
            };
            a.prototype.unselectAllButtons = function (a) {
                var b = a.parentNode.querySelectorAll(".highcharts-active");
                [].forEach.call(b, function (b) {
                    b !== a && b.classList.remove("highcharts-active")
                })
            };
            a.prototype.update = function (a) {
                w(!0, this.chart.options.stockTools, a);
                this.destroy();
                this.chart.setStockTools(a);
                this.chart.navigationBindings && this.chart.navigationBindings.update()
            };
            a.prototype.destroy = function () {
                var a = this.wrapper, c = a && a.parentNode;
                this.eventsToUnbind.forEach(function (a) {
                    a()
                });
                c && c.removeChild(a);
                this.chart.isDirtyBox = !0;
                this.chart.redraw()
            };
            a.prototype.redraw = function () {
                this.showHideNavigatorion()
            };
            a.prototype.getIconsURL = function () {
                return this.chart.options.navigation.iconsURL || this.options.iconsURL || "https://code.highcharts.com/8.1.0/gfx/stock-icons/"
            };
            return a
        }();
        l.prototype.classMapping =
            {
                circle: "highcharts-circle-annotation",
                rectangle: "highcharts-rectangle-annotation",
                label: "highcharts-label-annotation",
                segment: "highcharts-segment",
                arrowSegment: "highcharts-arrow-segment",
                ray: "highcharts-ray",
                arrowRay: "highcharts-arrow-ray",
                line: "highcharts-infinity-line",
                arrowLine: "highcharts-arrow-infinity-line",
                verticalLine: "highcharts-vertical-line",
                horizontalLine: "highcharts-horizontal-line",
                crooked3: "highcharts-crooked3",
                crooked5: "highcharts-crooked5",
                elliott3: "highcharts-elliott3",
                elliott5: "highcharts-elliott5",
                pitchfork: "highcharts-pitchfork",
                fibonacci: "highcharts-fibonacci",
                parallelChannel: "highcharts-parallel-channel",
                measureX: "highcharts-measure-x",
                measureY: "highcharts-measure-y",
                measureXY: "highcharts-measure-xy",
                verticalCounter: "highcharts-vertical-counter",
                verticalLabel: "highcharts-vertical-label",
                verticalArrow: "highcharts-vertical-arrow",
                currentPriceIndicator: "highcharts-current-price-indicator",
                indicators: "highcharts-indicators",
                flagCirclepin: "highcharts-flag-circlepin",
                flagDiamondpin: "highcharts-flag-diamondpin",
                flagSquarepin: "highcharts-flag-squarepin",
                flagSimplepin: "highcharts-flag-simplepin",
                zoomX: "highcharts-zoom-x",
                zoomY: "highcharts-zoom-y",
                zoomXY: "highcharts-zoom-xy",
                typeLine: "highcharts-series-type-line",
                typeOHLC: "highcharts-series-type-ohlc",
                typeCandlestick: "highcharts-series-type-candlestick",
                fullScreen: "highcharts-full-screen",
                toggleAnnotations: "highcharts-toggle-annotations",
                saveChart: "highcharts-save-chart",
                separator: "highcharts-separator"
            };
        t(g.Chart.prototype, {
            setStockTools: function (a) {
                var b =
                    this.options, c = b.lang;
                a = w(b.stockTools && b.stockTools.gui, a && a.gui);
                this.stockTools = new g.Toolbar(a, c.stockTools && c.stockTools.gui, this);
                this.stockTools.guiEnabled && (this.isDirtyBox = !0)
            }
        });
        n(q, "selectButton", function (a) {
            var b = a.button, c = this.chart.stockTools;
            c && c.guiEnabled && (c.unselectAllButtons(a.button), 0 <= b.parentNode.className.indexOf("highcharts-submenu-wrapper") && (b = b.parentNode.parentNode), c.selectButton(b))
        });
        n(q, "deselectButton", function (a) {
            a = a.button;
            var b = this.chart.stockTools;
            b && b.guiEnabled &&
            (0 <= a.parentNode.className.indexOf("highcharts-submenu-wrapper") && (a = a.parentNode.parentNode), b.selectButton(a))
        });
        g.Toolbar = l;
        return g.Toolbar
    });
    q(g, "masters/modules/stock-tools.src.js", [], function () {
    })
});
//# sourceMappingURL=stock-tools.js.map