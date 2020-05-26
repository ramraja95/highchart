/*
 Highcharts JS v8.1.0 (2020-05-05)

 Annotations module

 (c) 2009-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (e) {
    "object" === typeof module && module.exports ? (e["default"] = e, module.exports = e) : "function" === typeof define && define.amd ? define("highcharts/modules/annotations-advanced", ["highcharts"], function (t) {
        e(t);
        e.Highcharts = t;
        return e
    }) : e("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function (e) {
    function t(u, d, e, n) {
        u.hasOwnProperty(d) || (u[d] = n.apply(null, e))
    }

    e = e ? e._modules : {};
    t(e, "annotations/eventEmitterMixin.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var u = d.addEvent,
            n = d.fireEvent, k = d.inArray, c = d.objectEach, l = d.pick, a = d.removeEvent;
        return {
            addEvents: function () {
                var b = this, a = function (a) {
                    u(a, "mousedown", function (a) {
                        b.onMouseDown(a)
                    })
                };
                a(this.graphic.element);
                (b.labels || []).forEach(function (b) {
                    b.options.useHTML && b.graphic.text && a(b.graphic.text.element)
                });
                c(b.options.events, function (a, f) {
                    var g = function (g) {
                        "click" === f && b.cancelClick || a.call(b, b.chart.pointer.normalize(g), b.target)
                    };
                    if (-1 === k(f, b.nonDOMEvents || [])) b.graphic.on(f, g); else u(b, f, g)
                });
                if (b.options.draggable &&
                    (u(b, "drag", b.onDrag), !b.graphic.renderer.styledMode)) {
                    var h = {cursor: {x: "ew-resize", y: "ns-resize", xy: "move"}[b.options.draggable]};
                    b.graphic.css(h);
                    (b.labels || []).forEach(function (b) {
                        b.options.useHTML && b.graphic.text && b.graphic.text.css(h)
                    })
                }
                b.isUpdating || n(b, "add")
            }, removeDocEvents: function () {
                this.removeDrag && (this.removeDrag = this.removeDrag());
                this.removeMouseUp && (this.removeMouseUp = this.removeMouseUp())
            }, onMouseDown: function (b) {
                var a = this, h = a.chart.pointer;
                b.preventDefault && b.preventDefault();
                if (2 !== b.button) {
                    b = h.normalize(b);
                    var q = b.chartX;
                    var g = b.chartY;
                    a.cancelClick = !1;
                    a.chart.hasDraggedAnnotation = !0;
                    a.removeDrag = u(e.doc, "mousemove", function (b) {
                        a.hasDragged = !0;
                        b = h.normalize(b);
                        b.prevChartX = q;
                        b.prevChartY = g;
                        n(a, "drag", b);
                        q = b.chartX;
                        g = b.chartY
                    });
                    a.removeMouseUp = u(e.doc, "mouseup", function (b) {
                        a.cancelClick = a.hasDragged;
                        a.hasDragged = !1;
                        a.chart.hasDraggedAnnotation = !1;
                        n(l(a.target, a), "afterUpdate");
                        a.onMouseUp(b)
                    })
                }
            }, onMouseUp: function (b) {
                var a = this.chart;
                b = this.target || this;
                var h = a.options.annotations;
                a = a.annotations.indexOf(b);
                this.removeDocEvents();
                h[a] = b.options
            }, onDrag: function (b) {
                if (this.chart.isInsidePlot(b.chartX - this.chart.plotLeft, b.chartY - this.chart.plotTop)) {
                    var a = this.mouseMoveToTranslation(b);
                    "x" === this.options.draggable && (a.y = 0);
                    "y" === this.options.draggable && (a.x = 0);
                    this.points.length ? this.translate(a.x, a.y) : (this.shapes.forEach(function (b) {
                        b.translate(a.x, a.y)
                    }), this.labels.forEach(function (b) {
                        b.translate(a.x, a.y)
                    }));
                    this.redraw(!1)
                }
            }, mouseMoveToRadians: function (b, a, h) {
                var f = b.prevChartY -
                    h, g = b.prevChartX - a;
                h = b.chartY - h;
                b = b.chartX - a;
                this.chart.inverted && (a = g, g = f, f = a, a = b, b = h, h = a);
                return Math.atan2(h, b) - Math.atan2(f, g)
            }, mouseMoveToTranslation: function (b) {
                var a = b.chartX - b.prevChartX;
                b = b.chartY - b.prevChartY;
                if (this.chart.inverted) {
                    var h = b;
                    b = a;
                    a = h
                }
                return {x: a, y: b}
            }, mouseMoveToScale: function (b, a, h) {
                a = (b.chartX - a || 1) / (b.prevChartX - a || 1);
                b = (b.chartY - h || 1) / (b.prevChartY - h || 1);
                this.chart.inverted && (h = b, b = a, a = h);
                return {x: a, y: b}
            }, destroy: function () {
                this.removeDocEvents();
                a(this);
                this.hcEvents =
                    null
            }
        }
    });
    t(e, "annotations/ControlPoint.js", [e["parts/Utilities.js"], e["annotations/eventEmitterMixin.js"]], function (e, d) {
        var u = e.merge, n = e.pick;
        return function () {
            function k(c, l, a, b) {
                this.addEvents = d.addEvents;
                this.graphic = void 0;
                this.mouseMoveToRadians = d.mouseMoveToRadians;
                this.mouseMoveToScale = d.mouseMoveToScale;
                this.mouseMoveToTranslation = d.mouseMoveToTranslation;
                this.onDrag = d.onDrag;
                this.onMouseDown = d.onMouseDown;
                this.onMouseUp = d.onMouseUp;
                this.removeDocEvents = d.removeDocEvents;
                this.nonDOMEvents =
                    ["drag"];
                this.chart = c;
                this.target = l;
                this.options = a;
                this.index = n(a.index, b)
            }

            k.prototype.setVisibility = function (c) {
                this.graphic.attr("visibility", c ? "visible" : "hidden");
                this.options.visible = c
            };
            k.prototype.render = function () {
                var c = this.chart, l = this.options;
                this.graphic = c.renderer.symbol(l.symbol, 0, 0, l.width, l.height).add(c.controlPointsGroup).css(l.style);
                this.setVisibility(l.visible);
                this.addEvents()
            };
            k.prototype.redraw = function (c) {
                this.graphic[c ? "animate" : "attr"](this.options.positioner.call(this, this.target))
            };
            k.prototype.destroy = function () {
                d.destroy.call(this);
                this.graphic && (this.graphic = this.graphic.destroy());
                this.options = this.target = this.chart = null
            };
            k.prototype.update = function (c) {
                var l = this.chart, a = this.target, b = this.index;
                c = u(!0, this.options, c);
                this.destroy();
                this.constructor(l, a, c, b);
                this.render(l.controlPointsGroup);
                this.redraw()
            };
            return k
        }()
    });
    t(e, "annotations/MockPoint.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var u = d.defined, n = d.fireEvent;
        return function () {
            function k(c,
                       l, a) {
                this.y = this.x = this.plotY = this.plotX = this.isInside = void 0;
                this.mock = !0;
                this.series = {visible: !0, chart: c, getPlotBox: e.Series.prototype.getPlotBox};
                this.target = l || null;
                this.options = a;
                this.applyOptions(this.getOptions())
            }

            k.fromPoint = function (c) {
                return new k(c.series.chart, null, {x: c.x, y: c.y, xAxis: c.series.xAxis, yAxis: c.series.yAxis})
            };
            k.pointToPixels = function (c, l) {
                var a = c.series, b = a.chart, f = c.plotX, h = c.plotY;
                b.inverted && (c.mock ? (f = c.plotY, h = c.plotX) : (f = b.plotWidth - c.plotY, h = b.plotHeight - c.plotX));
                a && !l && (c = a.getPlotBox(), f += c.translateX, h += c.translateY);
                return {x: f, y: h}
            };
            k.pointToOptions = function (c) {
                return {x: c.x, y: c.y, xAxis: c.series.xAxis, yAxis: c.series.yAxis}
            };
            k.prototype.hasDynamicOptions = function () {
                return "function" === typeof this.options
            };
            k.prototype.getOptions = function () {
                return this.hasDynamicOptions() ? this.options(this.target) : this.options
            };
            k.prototype.applyOptions = function (c) {
                this.command = c.command;
                this.setAxis(c, "x");
                this.setAxis(c, "y");
                this.refresh()
            };
            k.prototype.setAxis = function (c,
                                            l) {
                l += "Axis";
                c = c[l];
                var a = this.series.chart;
                this.series[l] = c instanceof e.Axis ? c : u(c) ? a[l][c] || a.get(c) : null
            };
            k.prototype.toAnchor = function () {
                var c = [this.plotX, this.plotY, 0, 0];
                this.series.chart.inverted && (c[0] = this.plotY, c[1] = this.plotX);
                return c
            };
            k.prototype.getLabelConfig = function () {
                return {x: this.x, y: this.y, point: this}
            };
            k.prototype.isInsidePlot = function () {
                var c = this.plotX, l = this.plotY, a = this.series.xAxis, b = this.series.yAxis,
                    f = {x: c, y: l, isInsidePlot: !0};
                a && (f.isInsidePlot = u(c) && 0 <= c && c <= a.len);
                b &&
                (f.isInsidePlot = f.isInsidePlot && u(l) && 0 <= l && l <= b.len);
                n(this.series.chart, "afterIsInsidePlot", f);
                return f.isInsidePlot
            };
            k.prototype.refresh = function () {
                var c = this.series, l = c.xAxis;
                c = c.yAxis;
                var a = this.getOptions();
                l ? (this.x = a.x, this.plotX = l.toPixels(a.x, !0)) : (this.x = null, this.plotX = a.x);
                c ? (this.y = a.y, this.plotY = c.toPixels(a.y, !0)) : (this.y = null, this.plotY = a.y);
                this.isInside = this.isInsidePlot()
            };
            k.prototype.translate = function (c, l, a, b) {
                this.hasDynamicOptions() || (this.plotX += a, this.plotY += b, this.refreshOptions())
            };
            k.prototype.scale = function (c, l, a, b) {
                if (!this.hasDynamicOptions()) {
                    var f = this.plotY * b;
                    this.plotX = (1 - a) * c + this.plotX * a;
                    this.plotY = (1 - b) * l + f;
                    this.refreshOptions()
                }
            };
            k.prototype.rotate = function (c, l, a) {
                if (!this.hasDynamicOptions()) {
                    var b = Math.cos(a);
                    a = Math.sin(a);
                    var f = this.plotX, h = this.plotY;
                    f -= c;
                    h -= l;
                    this.plotX = f * b - h * a + c;
                    this.plotY = f * a + h * b + l;
                    this.refreshOptions()
                }
            };
            k.prototype.refreshOptions = function () {
                var c = this.series, l = c.xAxis;
                c = c.yAxis;
                this.x = this.options.x = l ? this.options.x = l.toValue(this.plotX,
                    !0) : this.plotX;
                this.y = this.options.y = c ? c.toValue(this.plotY, !0) : this.plotY
            };
            return k
        }()
    });
    t(e, "annotations/controllable/controllableMixin.js", [e["parts/Utilities.js"], e["annotations/ControlPoint.js"], e["annotations/MockPoint.js"], e["parts/Tooltip.js"]], function (e, d, p, n) {
        var k = e.isObject, c = e.isString, l = e.merge, a = e.splat;
        return {
            init: function (b, a, h) {
                this.annotation = b;
                this.chart = b.chart;
                this.options = a;
                this.points = [];
                this.controlPoints = [];
                this.index = h;
                this.linkPoints();
                this.addControlPoints()
            }, attr: function () {
                this.graphic.attr.apply(this.graphic,
                    arguments)
            }, getPointsOptions: function () {
                var b = this.options;
                return b.points || b.point && a(b.point)
            }, attrsFromOptions: function (b) {
                var a = this.constructor.attrsMap, h = {}, q, g = this.chart.styledMode;
                for (q in b) {
                    var m = a[q];
                    !m || g && -1 !== ["fill", "stroke", "stroke-width"].indexOf(m) || (h[m] = b[q])
                }
                return h
            }, anchor: function (b) {
                var a = b.series.getPlotBox();
                b = b.mock ? b.toAnchor() : n.prototype.getAnchor.call({chart: b.series.chart}, b);
                b = {
                    x: b[0] + (this.options.x || 0),
                    y: b[1] + (this.options.y || 0),
                    height: b[2] || 0,
                    width: b[3] || 0
                };
                return {
                    relativePosition: b,
                    absolutePosition: l(b, {x: b.x + a.translateX, y: b.y + a.translateY})
                }
            }, point: function (b, a) {
                if (b && b.series) return b;
                a && null !== a.series || (k(b) ? a = new p(this.chart, this, b) : c(b) ? a = this.chart.get(b) || null : "function" === typeof b && (a = b.call(a, this), a = a.series ? a : new p(this.chart, this, b)));
                return a
            }, linkPoints: function () {
                var b = this.getPointsOptions(), a = this.points, h = b && b.length || 0, q;
                for (q = 0; q < h; q++) {
                    var g = this.point(b[q], a[q]);
                    if (!g) {
                        a.length = 0;
                        return
                    }
                    g.mock && g.refresh();
                    a[q] = g
                }
                return a
            }, addControlPoints: function () {
                var a =
                    this.options.controlPoints;
                (a || []).forEach(function (b, h) {
                    b = l(this.options.controlPointOptions, b);
                    b.index || (b.index = h);
                    a[h] = b;
                    this.controlPoints.push(new d(this.chart, this, b))
                }, this)
            }, shouldBeDrawn: function () {
                return !!this.points.length
            }, render: function (b) {
                this.controlPoints.forEach(function (b) {
                    b.render()
                })
            }, redraw: function (b) {
                this.controlPoints.forEach(function (a) {
                    a.redraw(b)
                })
            }, transform: function (b, a, h, q, g) {
                if (this.chart.inverted) {
                    var m = a;
                    a = h;
                    h = m
                }
                this.points.forEach(function (m, f) {
                    this.transformPoint(b,
                        a, h, q, g, f)
                }, this)
            }, transformPoint: function (a, f, h, q, g, m) {
                var b = this.points[m];
                b.mock || (b = this.points[m] = p.fromPoint(b));
                b[a](f, h, q, g)
            }, translate: function (a, f) {
                this.transform("translate", null, null, a, f)
            }, translatePoint: function (a, f, h) {
                this.transformPoint("translate", null, null, a, f, h)
            }, translateShape: function (a, f) {
                var b = this.annotation.chart, q = this.annotation.userOptions,
                    g = b.annotations.indexOf(this.annotation);
                b = b.options.annotations[g];
                this.translatePoint(a, f, 0);
                b[this.collection][this.index].point =
                    this.options.point;
                q[this.collection][this.index].point = this.options.point
            }, rotate: function (a, f, h) {
                this.transform("rotate", a, f, h)
            }, scale: function (a, f, h, q) {
                this.transform("scale", a, f, h, q)
            }, setControlPointsVisibility: function (a) {
                this.controlPoints.forEach(function (b) {
                    b.setVisibility(a)
                })
            }, destroy: function () {
                this.graphic && (this.graphic = this.graphic.destroy());
                this.tracker && (this.tracker = this.tracker.destroy());
                this.controlPoints.forEach(function (a) {
                    a.destroy()
                });
                this.options = this.controlPoints = this.points =
                    this.chart = null;
                this.annotation && (this.annotation = null)
            }, update: function (a) {
                var b = this.annotation;
                a = l(!0, this.options, a);
                var h = this.graphic.parentGroup;
                this.destroy();
                this.constructor(b, a);
                this.render(h);
                this.redraw()
            }
        }
    });
    t(e, "annotations/controllable/markerMixin.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var u = d.addEvent, n = d.defined, k = d.merge, c = d.objectEach, l = d.uniqueKey, a = {
            arrow: {
                tagName: "marker",
                render: !1,
                id: "arrow",
                refY: 5,
                refX: 9,
                markerWidth: 10,
                markerHeight: 10,
                children: [{
                    tagName: "path",
                    d: "M 0 0 L 10 5 L 0 10 Z", strokeWidth: 0
                }]
            },
            "reverse-arrow": {
                tagName: "marker",
                render: !1,
                id: "reverse-arrow",
                refY: 5,
                refX: 1,
                markerWidth: 10,
                markerHeight: 10,
                children: [{tagName: "path", d: "M 0 5 L 10 0 L 10 10 Z", strokeWidth: 0}]
            }
        };
        e.SVGRenderer.prototype.addMarker = function (a, f) {
            var b = {id: a}, q = {stroke: f.color || "none", fill: f.color || "rgba(0, 0, 0, 0.75)"};
            b.children = f.children.map(function (a) {
                return k(q, a)
            });
            f = this.definition(k(!0, {markerWidth: 20, markerHeight: 20, refX: 0, refY: 0, orient: "auto"}, f, b));
            f.id = a;
            return f
        };
        d = function (a) {
            return function (b) {
                this.attr(a, "url(#" + b + ")")
            }
        };
        d = {
            markerEndSetter: d("marker-end"), markerStartSetter: d("marker-start"), setItemMarkers: function (a) {
                var b = a.options, h = a.chart, q = h.options.defs, g = b.fill, m = n(g) && "none" !== g ? g : b.stroke;
                ["markerStart", "markerEnd"].forEach(function (g) {
                    var c = b[g], f;
                    if (c) {
                        for (f in q) {
                            var d = q[f];
                            if (c === d.id && "marker" === d.tagName) {
                                var v = d;
                                break
                            }
                        }
                        v && (c = a[g] = h.renderer.addMarker((b.id || l()) + "-" + v.id, k(v, {color: m})), a.attr(g, c.attr("id")))
                    }
                })
            }
        };
        u(e.Chart, "afterGetContainer",
            function () {
                this.options.defs = k(a, this.options.defs || {});
                c(this.options.defs, function (a) {
                    "marker" === a.tagName && !1 !== a.render && this.renderer.addMarker(a.id, a)
                }, this)
            });
        return d
    });
    t(e, "annotations/controllable/ControllablePath.js", [e["parts/Globals.js"], e["parts/Utilities.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/controllable/markerMixin.js"]], function (e, d, p, n) {
        var k = d.extend;
        d = d.merge;
        var c = "rgba(192,192,192," + (e.svg ? .0001 : .002) + ")";
        e = function (c, a, b) {
            this.init(c, a, b);
            this.collection =
                "shapes"
        };
        e.attrsMap = {
            dashStyle: "dashstyle",
            strokeWidth: "stroke-width",
            stroke: "stroke",
            fill: "fill",
            zIndex: "zIndex"
        };
        d(!0, e.prototype, p, {
            type: "path", setMarkers: n.setItemMarkers, toD: function () {
                var c = this.options.d;
                if (c) return "function" === typeof c ? c.call(this) : c;
                c = this.points;
                var a = c.length, b = a, f = c[0], h = b && this.anchor(f).absolutePosition, q = 0, g = [];
                if (h) for (g.push(["M", h.x, h.y]); ++q < a && b;) f = c[q], b = f.command || "L", h = this.anchor(f).absolutePosition, "M" === b ? g.push([b, h.x, h.y]) : "L" === b ? g.push([b, h.x, h.y]) :
                    "Z" === b && g.push([b]), b = f.series.visible;
                return b ? this.chart.renderer.crispLine(g, this.graphic.strokeWidth()) : null
            }, shouldBeDrawn: function () {
                return p.shouldBeDrawn.call(this) || !!this.options.d
            }, render: function (d) {
                var a = this.options, b = this.attrsFromOptions(a);
                this.graphic = this.annotation.chart.renderer.path([["M", 0, 0]]).attr(b).add(d);
                a.className && this.graphic.addClass(a.className);
                this.tracker = this.annotation.chart.renderer.path([["M", 0, 0]]).addClass("highcharts-tracker-line").attr({zIndex: 2}).add(d);
                this.annotation.chart.styledMode || this.tracker.attr({
                    "stroke-linejoin": "round",
                    stroke: c,
                    fill: c,
                    "stroke-width": this.graphic.strokeWidth() + 2 * a.snap
                });
                p.render.call(this);
                k(this.graphic, {markerStartSetter: n.markerStartSetter, markerEndSetter: n.markerEndSetter});
                this.setMarkers(this)
            }, redraw: function (c) {
                var a = this.toD(), b = c ? "animate" : "attr";
                a ? (this.graphic[b]({d: a}), this.tracker[b]({d: a})) : (this.graphic.attr({d: "M 0 -9000000000"}), this.tracker.attr({d: "M 0 -9000000000"}));
                this.graphic.placed = this.tracker.placed =
                    !!a;
                p.redraw.call(this, c)
            }
        });
        return e
    });
    t(e, "annotations/controllable/ControllableRect.js", [e["parts/Utilities.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/controllable/ControllablePath.js"]], function (e, d, p) {
        e = e.merge;
        var n = function (d, c, l) {
            this.init(d, c, l);
            this.collection = "shapes"
        };
        n.attrsMap = e(p.attrsMap, {width: "width", height: "height"});
        e(!0, n.prototype, d, {
            type: "rect", translate: d.translateShape, render: function (k) {
                var c = this.attrsFromOptions(this.options);
                this.graphic = this.annotation.chart.renderer.rect(0,
                    -9E9, 0, 0).attr(c).add(k);
                d.render.call(this)
            }, redraw: function (k) {
                var c = this.anchor(this.points[0]).absolutePosition;
                if (c) this.graphic[k ? "animate" : "attr"]({
                    x: c.x,
                    y: c.y,
                    width: this.options.width,
                    height: this.options.height
                }); else this.attr({x: 0, y: -9E9});
                this.graphic.placed = !!c;
                d.redraw.call(this, k)
            }
        });
        return n
    });
    t(e, "annotations/controllable/ControllableCircle.js", [e["parts/Utilities.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/controllable/ControllablePath.js"]], function (e,
                                                                                                                                                                                                       d, p) {
        e = e.merge;
        var n = function (d, c, l) {
            this.init(d, c, l);
            this.collection = "shapes"
        };
        n.attrsMap = e(p.attrsMap, {r: "r"});
        e(!0, n.prototype, d, {
            type: "circle", translate: d.translateShape, render: function (k) {
                var c = this.attrsFromOptions(this.options);
                this.graphic = this.annotation.chart.renderer.circle(0, -9E9, 0).attr(c).add(k);
                d.render.call(this)
            }, redraw: function (k) {
                var c = this.anchor(this.points[0]).absolutePosition;
                if (c) this.graphic[k ? "animate" : "attr"]({
                    x: c.x,
                    y: c.y,
                    r: this.options.r
                }); else this.graphic.attr({x: 0, y: -9E9});
                this.graphic.placed = !!c;
                d.redraw.call(this, k)
            }, setRadius: function (d) {
                this.options.r = d
            }
        });
        return n
    });
    t(e, "annotations/controllable/ControllableLabel.js", [e["parts/Globals.js"], e["parts/Utilities.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/MockPoint.js"], e["parts/Tooltip.js"]], function (e, d, p, n, k) {
        var c = d.extend, l = d.format, a = d.isNumber, b = d.merge, f = d.pick, h = function (a, b, c) {
            this.init(a, b, c);
            this.collection = "labels"
        };
        h.shapesWithoutBackground = ["connector"];
        h.alignedPosition = function (a,
                                      b) {
            var g = a.align, c = a.verticalAlign, f = (b.x || 0) + (a.x || 0), h = (b.y || 0) + (a.y || 0), q, d;
            "right" === g ? q = 1 : "center" === g && (q = 2);
            q && (f += (b.width - (a.width || 0)) / q);
            "bottom" === c ? d = 1 : "middle" === c && (d = 2);
            d && (h += (b.height - (a.height || 0)) / d);
            return {x: Math.round(f), y: Math.round(h)}
        };
        h.justifiedOptions = function (a, b, c, f) {
            var g = c.align, h = c.verticalAlign, m = b.box ? 0 : b.padding || 0, q = b.getBBox();
            b = {align: g, verticalAlign: h, x: c.x, y: c.y, width: b.width, height: b.height};
            c = f.x - a.plotLeft;
            var d = f.y - a.plotTop;
            f = c + m;
            0 > f && ("right" === g ? b.align =
                "left" : b.x = -f);
            f = c + q.width - m;
            f > a.plotWidth && ("left" === g ? b.align = "right" : b.x = a.plotWidth - f);
            f = d + m;
            0 > f && ("bottom" === h ? b.verticalAlign = "top" : b.y = -f);
            f = d + q.height - m;
            f > a.plotHeight && ("top" === h ? b.verticalAlign = "bottom" : b.y = a.plotHeight - f);
            return b
        };
        h.attrsMap = {
            backgroundColor: "fill",
            borderColor: "stroke",
            borderWidth: "stroke-width",
            zIndex: "zIndex",
            borderRadius: "r",
            padding: "padding"
        };
        b(!0, h.prototype, p, {
            translatePoint: function (a, b) {
                p.translatePoint.call(this, a, b, 0)
            }, translate: function (a, b) {
                var g = this.annotation.chart,
                    c = this.annotation.userOptions, f = g.annotations.indexOf(this.annotation);
                f = g.options.annotations[f];
                g.inverted && (g = a, a = b, b = g);
                this.options.x += a;
                this.options.y += b;
                f[this.collection][this.index].x = this.options.x;
                f[this.collection][this.index].y = this.options.y;
                c[this.collection][this.index].x = this.options.x;
                c[this.collection][this.index].y = this.options.y
            }, render: function (a) {
                var b = this.options, c = this.attrsFromOptions(b), f = b.style;
                this.graphic = this.annotation.chart.renderer.label("", 0, -9999, b.shape, null,
                    null, b.useHTML, null, "annotation-label").attr(c).add(a);
                this.annotation.chart.styledMode || ("contrast" === f.color && (f.color = this.annotation.chart.renderer.getContrast(-1 < h.shapesWithoutBackground.indexOf(b.shape) ? "#FFFFFF" : b.backgroundColor)), this.graphic.css(b.style).shadow(b.shadow));
                b.className && this.graphic.addClass(b.className);
                this.graphic.labelrank = b.labelrank;
                p.render.call(this)
            }, redraw: function (a) {
                var b = this.options, c = this.text || b.format || b.text, f = this.graphic, h = this.points[0];
                f.attr({
                    text: c ?
                        l(c, h.getLabelConfig(), this.annotation.chart) : b.formatter.call(h, this)
                });
                b = this.anchor(h);
                (c = this.position(b)) ? (f.alignAttr = c, c.anchorX = b.absolutePosition.x, c.anchorY = b.absolutePosition.y, f[a ? "animate" : "attr"](c)) : f.attr({
                    x: 0,
                    y: -9999
                });
                f.placed = !!c;
                p.redraw.call(this, a)
            }, anchor: function () {
                var a = p.anchor.apply(this, arguments), b = this.options.x || 0, c = this.options.y || 0;
                a.absolutePosition.x -= b;
                a.absolutePosition.y -= c;
                a.relativePosition.x -= b;
                a.relativePosition.y -= c;
                return a
            }, position: function (a) {
                var b = this.graphic,
                    m = this.annotation.chart, d = this.points[0], q = this.options, l = a.absolutePosition,
                    e = a.relativePosition;
                if (a = d.series.visible && n.prototype.isInsidePlot.call(d)) {
                    if (q.distance) var r = k.prototype.getPosition.call({
                        chart: m,
                        distance: f(q.distance, 16)
                    }, b.width, b.height, {
                        plotX: e.x,
                        plotY: e.y,
                        negative: d.negative,
                        ttBelow: d.ttBelow,
                        h: e.height || e.width
                    }); else q.positioner ? r = q.positioner.call(this) : (d = {
                        x: l.x,
                        y: l.y,
                        width: 0,
                        height: 0
                    }, r = h.alignedPosition(c(q, {
                        width: b.width,
                        height: b.height
                    }), d), "justify" === this.options.overflow &&
                    (r = h.alignedPosition(h.justifiedOptions(m, b, q, r), d)));
                    q.crop && (q = r.x - m.plotLeft, d = r.y - m.plotTop, a = m.isInsidePlot(q, d) && m.isInsidePlot(q + b.width, d + b.height))
                }
                return a ? r : null
            }
        });
        e.SVGRenderer.prototype.symbols.connector = function (b, c, f, h, d) {
            var g = d && d.anchorX;
            d = d && d.anchorY;
            var m = f / 2;
            if (a(g) && a(d)) {
                var q = [["M", g, d]];
                var k = c - d;
                0 > k && (k = -h - k);
                k < f && (m = g < b + f / 2 ? k : f - k);
                d > c + h ? q.push(["L", b + m, c + h]) : d < c ? q.push(["L", b + m, c]) : g < b ? q.push(["L", b, c + h / 2]) : g > b + f && q.push(["L", b + f, c + h / 2])
            }
            return q || []
        };
        return h
    });
    t(e, "annotations/controllable/ControllableImage.js",
        [e["parts/Utilities.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/controllable/ControllableLabel.js"]], function (e, d, p) {
            e = e.merge;
            var n = function (d, c, e) {
                this.init(d, c, e);
                this.collection = "shapes"
            };
            n.attrsMap = {width: "width", height: "height", zIndex: "zIndex"};
            e(!0, n.prototype, d, {
                type: "image", translate: d.translateShape, render: function (k) {
                    var c = this.attrsFromOptions(this.options), e = this.options;
                    this.graphic = this.annotation.chart.renderer.image(e.src, 0, -9E9, e.width, e.height).attr(c).add(k);
                    this.graphic.width = e.width;
                    this.graphic.height = e.height;
                    d.render.call(this)
                }, redraw: function (e) {
                    var c = this.anchor(this.points[0]);
                    if (c = p.prototype.position.call(this, c)) this.graphic[e ? "animate" : "attr"]({
                        x: c.x,
                        y: c.y
                    }); else this.graphic.attr({x: 0, y: -9E9});
                    this.graphic.placed = !!c;
                    d.redraw.call(this, e)
                }
            });
            return n
        });
    t(e, "annotations/annotations.src.js", [e["parts/Globals.js"], e["parts/Utilities.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/controllable/ControllableRect.js"], e["annotations/controllable/ControllableCircle.js"],
        e["annotations/controllable/ControllablePath.js"], e["annotations/controllable/ControllableImage.js"], e["annotations/controllable/ControllableLabel.js"], e["annotations/eventEmitterMixin.js"], e["annotations/MockPoint.js"], e["annotations/ControlPoint.js"]], function (e, d, p, n, k, c, l, a, b, f, h) {
        var q = d.addEvent, g = d.defined, m = d.destroyObjectProperties, v = d.erase, A = d.extend, u = d.find,
            w = d.fireEvent, r = d.merge, y = d.pick, B = d.splat;
        d = d.wrap;
        var z = e.Chart.prototype, x = e.Annotation = function (a, b) {
            this.chart = a;
            this.points =
                [];
            this.controlPoints = [];
            this.coll = "annotations";
            this.labels = [];
            this.shapes = [];
            this.options = r(this.defaultOptions, b);
            this.userOptions = b;
            b = this.getLabelsAndShapesOptions(this.options, b);
            this.options.labels = b.labels;
            this.options.shapes = b.shapes;
            this.init(a, this.options)
        };
        r(!0, x.prototype, p, b, {
            nonDOMEvents: ["add", "afterUpdate", "drag", "remove"], defaultOptions: {
                visible: !0,
                draggable: "xy",
                labelOptions: {
                    align: "center",
                    allowOverlap: !1,
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    borderColor: "black",
                    borderRadius: 3,
                    borderWidth: 1,
                    className: "",
                    crop: !1,
                    formatter: function () {
                        return g(this.y) ? this.y : "Annotation label"
                    },
                    overflow: "justify",
                    padding: 5,
                    shadow: !1,
                    shape: "callout",
                    style: {fontSize: "11px", fontWeight: "normal", color: "contrast"},
                    useHTML: !1,
                    verticalAlign: "bottom",
                    x: 0,
                    y: -16
                },
                shapeOptions: {
                    stroke: "rgba(0, 0, 0, 0.75)",
                    strokeWidth: 1,
                    fill: "rgba(0, 0, 0, 0.75)",
                    r: 0,
                    snap: 2
                },
                controlPointOptions: {
                    symbol: "circle",
                    width: 10,
                    height: 10,
                    style: {stroke: "black", "stroke-width": 2, fill: "white"},
                    visible: !1,
                    events: {}
                },
                events: {},
                zIndex: 6
            },
            init: function () {
                this.linkPoints();
                this.addControlPoints();
                this.addShapes();
                this.addLabels();
                this.setLabelCollector()
            }, getLabelsAndShapesOptions: function (a, b) {
                var c = {};
                ["labels", "shapes"].forEach(function (f) {
                    a[f] && (c[f] = B(b[f]).map(function (b, c) {
                        return r(a[f][c], b)
                    }))
                });
                return c
            }, addShapes: function () {
                (this.options.shapes || []).forEach(function (a, b) {
                    a = this.initShape(a, b);
                    r(!0, this.options.shapes[b], a.options)
                }, this)
            }, addLabels: function () {
                (this.options.labels || []).forEach(function (a, b) {
                    a = this.initLabel(a,
                        b);
                    r(!0, this.options.labels[b], a.options)
                }, this)
            }, addClipPaths: function () {
                this.setClipAxes();
                this.clipXAxis && this.clipYAxis && (this.clipRect = this.chart.renderer.clipRect(this.getClipBox()))
            }, setClipAxes: function () {
                var a = this.chart.xAxis, b = this.chart.yAxis,
                    c = (this.options.labels || []).concat(this.options.shapes || []).reduce(function (c, f) {
                        return [a[f && f.point && f.point.xAxis] || c[0], b[f && f.point && f.point.yAxis] || c[1]]
                    }, []);
                this.clipXAxis = c[0];
                this.clipYAxis = c[1]
            }, getClipBox: function () {
                if (this.clipXAxis &&
                    this.clipYAxis) return {
                    x: this.clipXAxis.left,
                    y: this.clipYAxis.top,
                    width: this.clipXAxis.width,
                    height: this.clipYAxis.height
                }
            }, setLabelCollector: function () {
                var a = this;
                a.labelCollector = function () {
                    return a.labels.reduce(function (a, b) {
                        b.options.allowOverlap || a.push(b.graphic);
                        return a
                    }, [])
                };
                a.chart.labelCollectors.push(a.labelCollector)
            }, setOptions: function (a) {
                this.options = r(this.defaultOptions, a)
            }, redraw: function (a) {
                this.linkPoints();
                this.graphic || this.render();
                this.clipRect && this.clipRect.animate(this.getClipBox());
                this.redrawItems(this.shapes, a);
                this.redrawItems(this.labels, a);
                p.redraw.call(this, a)
            }, redrawItems: function (a, b) {
                for (var c = a.length; c--;) this.redrawItem(a[c], b)
            }, renderItems: function (a) {
                for (var b = a.length; b--;) this.renderItem(a[b])
            }, render: function () {
                var a = this.chart.renderer;
                this.graphic = a.g("annotation").attr({
                    zIndex: this.options.zIndex,
                    visibility: this.options.visible ? "visible" : "hidden"
                }).add();
                this.shapesGroup = a.g("annotation-shapes").add(this.graphic).clip(this.chart.plotBoxClip);
                this.labelsGroup =
                    a.g("annotation-labels").attr({translateX: 0, translateY: 0}).add(this.graphic);
                this.addClipPaths();
                this.clipRect && this.graphic.clip(this.clipRect);
                this.renderItems(this.shapes);
                this.renderItems(this.labels);
                this.addEvents();
                p.render.call(this)
            }, setVisibility: function (a) {
                var b = this.options;
                a = y(a, !b.visible);
                this.graphic.attr("visibility", a ? "visible" : "hidden");
                a || this.setControlPointsVisibility(!1);
                b.visible = a
            }, setControlPointsVisibility: function (a) {
                var b = function (b) {
                    b.setControlPointsVisibility(a)
                };
                p.setControlPointsVisibility.call(this, a);
                this.shapes.forEach(b);
                this.labels.forEach(b)
            }, destroy: function () {
                var a = this.chart, c = function (a) {
                    a.destroy()
                };
                this.labels.forEach(c);
                this.shapes.forEach(c);
                this.clipYAxis = this.clipXAxis = null;
                v(a.labelCollectors, this.labelCollector);
                b.destroy.call(this);
                p.destroy.call(this);
                m(this, a)
            }, remove: function () {
                return this.chart.removeAnnotation(this)
            }, update: function (a, b) {
                var c = this.chart, f = this.getLabelsAndShapesOptions(this.userOptions, a),
                    g = c.annotations.indexOf(this);
                a = r(!0, this.userOptions, a);
                a.labels = f.labels;
                a.shapes = f.shapes;
                this.destroy();
                this.constructor(c, a);
                c.options.annotations[g] = a;
                this.isUpdating = !0;
                y(b, !0) && c.redraw();
                w(this, "afterUpdate");
                this.isUpdating = !1
            }, initShape: function (a, b) {
                a = r(this.options.shapeOptions, {controlPointOptions: this.options.controlPointOptions}, a);
                b = new x.shapesMap[a.type](this, a, b);
                b.itemType = "shape";
                this.shapes.push(b);
                return b
            }, initLabel: function (b, c) {
                b = r(this.options.labelOptions, {controlPointOptions: this.options.controlPointOptions},
                    b);
                c = new a(this, b, c);
                c.itemType = "label";
                this.labels.push(c);
                return c
            }, redrawItem: function (a, b) {
                a.linkPoints();
                a.shouldBeDrawn() ? (a.graphic || this.renderItem(a), a.redraw(y(b, !0) && a.graphic.placed), a.points.length && this.adjustVisibility(a)) : this.destroyItem(a)
            }, adjustVisibility: function (a) {
                var b = !1, c = a.graphic;
                a.points.forEach(function (a) {
                    !1 !== a.series.visible && !1 !== a.visible && (b = !0)
                });
                b ? "hidden" === c.visibility && c.show() : c.hide()
            }, destroyItem: function (a) {
                v(this[a.itemType + "s"], a);
                a.destroy()
            }, renderItem: function (a) {
                a.render("label" ===
                a.itemType ? this.labelsGroup : this.shapesGroup)
            }
        });
        x.shapesMap = {rect: n, circle: k, path: c, image: l};
        x.types = {};
        x.MockPoint = f;
        x.ControlPoint = h;
        e.extendAnnotation = function (a, b, c, f) {
            b = b || x;
            r(!0, a.prototype, b.prototype, c);
            a.prototype.defaultOptions = r(a.prototype.defaultOptions, f || {})
        };
        A(z, {
            initAnnotation: function (a) {
                a = new (x.types[a.type] || x)(this, a);
                this.annotations.push(a);
                return a
            }, addAnnotation: function (a, b) {
                a = this.initAnnotation(a);
                this.options.annotations.push(a.options);
                y(b, !0) && a.redraw();
                return a
            },
            removeAnnotation: function (a) {
                var b = this.annotations, c = "annotations" === a.coll ? a : u(b, function (b) {
                    return b.options.id === a
                });
                c && (w(c, "remove"), v(this.options.annotations, c.options), v(b, c), c.destroy())
            }, drawAnnotations: function () {
                this.plotBoxClip.attr(this.plotBox);
                this.annotations.forEach(function (a) {
                    a.redraw()
                })
            }
        });
        z.collectionsWithUpdate.push("annotations");
        z.collectionsWithInit.annotations = [z.addAnnotation];
        z.callbacks.push(function (a) {
            a.annotations = [];
            a.options.annotations || (a.options.annotations =
                []);
            a.plotBoxClip = this.renderer.clipRect(this.plotBox);
            a.controlPointsGroup = a.renderer.g("control-points").attr({zIndex: 99}).clip(a.plotBoxClip).add();
            a.options.annotations.forEach(function (b, c) {
                b = a.initAnnotation(b);
                a.options.annotations[c] = b.options
            });
            a.drawAnnotations();
            q(a, "redraw", a.drawAnnotations);
            q(a, "destroy", function () {
                a.plotBoxClip.destroy();
                a.controlPointsGroup.destroy()
            })
        });
        d(e.Pointer.prototype, "onContainerMouseDown", function (a) {
            this.chart.hasDraggedAnnotation || a.apply(this, Array.prototype.slice.call(arguments,
                1))
        })
    });
    t(e, "annotations/types/BasicAnnotation.js", [e["parts/Globals.js"]], function (e) {
        var d = e.Annotation, p = function () {
            d.apply(this, arguments)
        };
        e.extendAnnotation(p, null, {
            basicControlPoints: {
                label: [{
                    symbol: "triangle-down", positioner: function (d) {
                        if (!d.graphic.placed) return {x: 0, y: -9E7};
                        d = e.Annotation.MockPoint.pointToPixels(d.points[0]);
                        return {x: d.x - this.graphic.width / 2, y: d.y - this.graphic.height / 2}
                    }, events: {
                        drag: function (d, e) {
                            d = this.mouseMoveToTranslation(d);
                            e.translatePoint(d.x, d.y);
                            e.annotation.userOptions.labels[0].point =
                                e.options.point;
                            e.redraw(!1)
                        }
                    }
                }, {
                    symbol: "square", positioner: function (d) {
                        return d.graphic.placed ? {
                            x: d.graphic.alignAttr.x - this.graphic.width / 2,
                            y: d.graphic.alignAttr.y - this.graphic.height / 2
                        } : {x: 0, y: -9E7}
                    }, events: {
                        drag: function (d, e) {
                            d = this.mouseMoveToTranslation(d);
                            e.translate(d.x, d.y);
                            e.annotation.userOptions.labels[0].point = e.options.point;
                            e.redraw(!1)
                        }
                    }
                }], rectangle: [{
                    positioner: function (d) {
                        d = e.Annotation.MockPoint.pointToPixels(d.points[2]);
                        return {x: d.x - 4, y: d.y - 4}
                    }, events: {
                        drag: function (d, e) {
                            var c =
                                e.annotation, l = this.chart.pointer.getCoordinates(d);
                            d = l.xAxis[0].value;
                            l = l.yAxis[0].value;
                            var a = e.options.points;
                            a[1].x = d;
                            a[2].x = d;
                            a[2].y = l;
                            a[3].y = l;
                            c.userOptions.shapes[0].points = e.options.points;
                            c.redraw(!1)
                        }
                    }
                }], circle: [{
                    positioner: function (d) {
                        var k = e.Annotation.MockPoint.pointToPixels(d.points[0]);
                        d = d.options.r;
                        return {
                            x: k.x + d * Math.cos(Math.PI / 4) - this.graphic.width / 2,
                            y: k.y + d * Math.sin(Math.PI / 4) - this.graphic.height / 2
                        }
                    }, events: {
                        drag: function (d, e) {
                            var c = e.annotation;
                            d = this.mouseMoveToTranslation(d);
                            e.setRadius(Math.max(e.options.r + d.y / Math.sin(Math.PI / 4), 5));
                            c.userOptions.shapes[0].r = e.options.r;
                            c.userOptions.shapes[0].point = e.options.point;
                            e.redraw(!1)
                        }
                    }
                }]
            }, addControlPoints: function () {
                var d = this.options, e = this.basicControlPoints, c = d.langKey;
                (d.labels || d.shapes).forEach(function (d) {
                    c && (d.controlPoints = e[c])
                })
            }
        });
        return d.types.basicAnnotation = p
    });
    t(e, "annotations/types/CrookedLine.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var p = d.merge, n = e.Annotation, k = n.MockPoint, c =
            n.ControlPoint;
        d = function () {
            n.apply(this, arguments)
        };
        e.extendAnnotation(d, null, {
            setClipAxes: function () {
                this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis];
                this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis]
            }, getPointsOptions: function () {
                var c = this.options.typeOptions;
                return c.points.map(function (a) {
                    a.xAxis = c.xAxis;
                    a.yAxis = c.yAxis;
                    return a
                })
            }, getControlPointsOptions: function () {
                return this.getPointsOptions()
            }, addControlPoints: function () {
                this.getControlPointsOptions().forEach(function (d,
                                                                 a) {
                    a = new c(this.chart, this, p(this.options.controlPointOptions, d.controlPoint), a);
                    this.controlPoints.push(a);
                    d.controlPoint = a.options
                }, this)
            }, addShapes: function () {
                var c = this.options.typeOptions, a = this.initShape(p(c.line, {
                    type: "path", points: this.points.map(function (a, c) {
                        return function (a) {
                            return a.annotation.points[c]
                        }
                    })
                }), !1);
                c.line = a.options
            }
        }, {
            typeOptions: {xAxis: 0, yAxis: 0, line: {fill: "none"}}, controlPointOptions: {
                positioner: function (c) {
                    var a = this.graphic;
                    c = k.pointToPixels(c.points[this.index]);
                    return {
                        x: c.x -
                            a.width / 2, y: c.y - a.height / 2
                    }
                }, events: {
                    drag: function (c, a) {
                        a.chart.isInsidePlot(c.chartX - a.chart.plotLeft, c.chartY - a.chart.plotTop) && (c = this.mouseMoveToTranslation(c), a.translatePoint(c.x, c.y, this.index), a.options.typeOptions.points[this.index].x = a.points[this.index].x, a.options.typeOptions.points[this.index].y = a.points[this.index].y, a.redraw(!1))
                    }
                }
            }
        });
        return n.types.crookedLine = d
    });
    t(e, "annotations/types/ElliottWave.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var p = d.merge;
        d = e.Annotation;
        var n = d.types.crookedLine, k = function () {
            n.apply(this, arguments)
        };
        e.extendAnnotation(k, n, {
            addLabels: function () {
                this.getPointsOptions().forEach(function (c, d) {
                    var a = this.initLabel(p(c.label, {
                        text: this.options.typeOptions.labels[d], point: function (a) {
                            return a.annotation.points[d]
                        }
                    }), !1);
                    c.label = a.options
                }, this)
            }
        }, {
            typeOptions: {labels: "(0) (A) (B) (C) (D) (E)".split(" "), line: {strokeWidth: 1}}, labelOptions: {
                align: "center",
                allowOverlap: !0,
                crop: !0,
                overflow: "none",
                type: "rect",
                backgroundColor: "none",
                borderWidth: 0,
                y: -5
            }
        });
        return d.types.elliottWave = k
    });
    t(e, "annotations/types/Tunnel.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var p = d.merge;
        d = e.Annotation;
        var n = d.types.crookedLine, k = d.ControlPoint, c = d.MockPoint, l = function () {
            n.apply(this, arguments)
        };
        e.extendAnnotation(l, n, {
            getPointsOptions: function () {
                var a = n.prototype.getPointsOptions.call(this);
                a[2] = this.heightPointOptions(a[1]);
                a[3] = this.heightPointOptions(a[0]);
                return a
            }, getControlPointsOptions: function () {
                return this.getPointsOptions().slice(0,
                    2)
            }, heightPointOptions: function (a) {
                a = p(a);
                a.y += this.options.typeOptions.height;
                return a
            }, addControlPoints: function () {
                n.prototype.addControlPoints.call(this);
                var a = this.options,
                    b = new k(this.chart, this, p(a.controlPointOptions, a.typeOptions.heightControlPoint), 2);
                this.controlPoints.push(b);
                a.typeOptions.heightControlPoint = b.options
            }, addShapes: function () {
                this.addLine();
                this.addBackground()
            }, addLine: function () {
                var a = this.initShape(p(this.options.typeOptions.line, {
                    type: "path", points: [this.points[0], this.points[1],
                        function (a) {
                            a = c.pointToOptions(a.annotation.points[2]);
                            a.command = "M";
                            return a
                        }, this.points[3]]
                }), !1);
                this.options.typeOptions.line = a.options
            }, addBackground: function () {
                var a = this.initShape(p(this.options.typeOptions.background, {
                    type: "path",
                    points: this.points.slice()
                }));
                this.options.typeOptions.background = a.options
            }, translateSide: function (a, b, c) {
                c = Number(c);
                var d = 0 === c ? 3 : 2;
                this.translatePoint(a, b, c);
                this.translatePoint(a, b, d)
            }, translateHeight: function (a) {
                this.translatePoint(0, a, 2);
                this.translatePoint(0,
                    a, 3);
                this.options.typeOptions.height = this.points[3].y - this.points[0].y
            }
        }, {
            typeOptions: {
                xAxis: 0,
                yAxis: 0,
                background: {fill: "rgba(130, 170, 255, 0.4)", strokeWidth: 0},
                line: {strokeWidth: 1},
                height: -2,
                heightControlPoint: {
                    positioner: function (a) {
                        var b = c.pointToPixels(a.points[2]);
                        a = c.pointToPixels(a.points[3]);
                        var d = (b.x + a.x) / 2;
                        return {
                            x: d - this.graphic.width / 2,
                            y: (a.y - b.y) / (a.x - b.x) * (d - b.x) + b.y - this.graphic.height / 2
                        }
                    }, events: {
                        drag: function (a, b) {
                            b.chart.isInsidePlot(a.chartX - b.chart.plotLeft, a.chartY - b.chart.plotTop) &&
                            (b.translateHeight(this.mouseMoveToTranslation(a).y), b.redraw(!1))
                        }
                    }
                }
            }, controlPointOptions: {
                events: {
                    drag: function (a, b) {
                        b.chart.isInsidePlot(a.chartX - b.chart.plotLeft, a.chartY - b.chart.plotTop) && (a = this.mouseMoveToTranslation(a), b.translateSide(a.x, a.y, this.index), b.redraw(!1))
                    }
                }
            }
        });
        return d.types.tunnel = l
    });
    t(e, "annotations/types/InfinityLine.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var p = d.merge;
        d = e.Annotation;
        var n = d.MockPoint, k = d.types.crookedLine, c = function () {
            k.apply(this,
                arguments)
        };
        c.findEdgeCoordinate = function (a, b, c, d) {
            var f = "x" === c ? "y" : "x";
            return (b[c] - a[c]) * (d - a[f]) / (b[f] - a[f]) + a[c]
        };
        c.findEdgePoint = function (a, b) {
            var d = a.series.xAxis, h = b.series.yAxis, e = n.pointToPixels(a), g = n.pointToPixels(b), m = g.x - e.x,
                k = g.y - e.y;
            b = d.left;
            var l = b + d.width;
            d = h.top;
            h = d + h.height;
            var p = 0 > m ? b : l, w = 0 > k ? d : h;
            l = {x: 0 === m ? e.x : p, y: 0 === k ? e.y : w};
            0 !== m && 0 !== k && (m = c.findEdgeCoordinate(e, g, "y", p), e = c.findEdgeCoordinate(e, g, "x", w), m >= d && m <= h ? (l.x = p, l.y = m) : (l.x = e, l.y = w));
            l.x -= b;
            l.y -= d;
            a.series.chart.inverted &&
            (a = l.x, l.x = l.y, l.y = a);
            return l
        };
        var l = function (a, b) {
            return function (d) {
                d = d.annotation;
                var f = d.points, e = d.options.typeOptions.type;
                "horizontalLine" === e ? f = [f[0], new n(d.chart, f[0].target, {
                    x: f[0].x + 1,
                    y: f[0].y,
                    xAxis: f[0].options.xAxis,
                    yAxis: f[0].options.yAxis
                })] : "verticalLine" === e && (f = [f[0], new n(d.chart, f[0].target, {
                    x: f[0].x,
                    y: f[0].y + 1,
                    xAxis: f[0].options.xAxis,
                    yAxis: f[0].options.yAxis
                })]);
                return c.findEdgePoint(f[a], f[b])
            }
        };
        c.endEdgePoint = l(0, 1);
        c.startEdgePoint = l(1, 0);
        e.extendAnnotation(c, k, {
            addShapes: function () {
                var a =
                    this.options.typeOptions, b = [this.points[0], c.endEdgePoint];
                a.type.match(/Line/g) && (b[0] = c.startEdgePoint);
                b = this.initShape(p(a.line, {type: "path", points: b}), !1);
                a.line = b.options
            }
        });
        return d.types.infinityLine = c
    });
    t(e, "annotations/types/Fibonacci.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var p = d.merge;
        d = e.Annotation;
        var n = d.MockPoint, k = d.types.tunnel, c = function (a, b) {
            return function () {
                var c = this.annotation, d = this.anchor(c.startRetracements[a]).absolutePosition,
                    e = this.anchor(c.endRetracements[a]).absolutePosition;
                d = [["M", Math.round(d.x), Math.round(d.y)], ["L", Math.round(e.x), Math.round(e.y)]];
                b && (e = this.anchor(c.endRetracements[a - 1]).absolutePosition, c = this.anchor(c.startRetracements[a - 1]).absolutePosition, d.push(["L", Math.round(e.x), Math.round(e.y)], ["L", Math.round(c.x), Math.round(c.y)]));
                return d
            }
        }, l = function () {
            this.startRetracements = [];
            this.endRetracements = [];
            k.apply(this, arguments)
        };
        l.levels = [0, .236, .382, .5, .618, .786, 1];
        e.extendAnnotation(l, k, {
            linkPoints: function () {
                k.prototype.linkPoints.call(this);
                this.linkRetracementsPoints()
            },
            linkRetracementsPoints: function () {
                var a = this.points, b = a[0].y - a[3].y, c = a[1].y - a[2].y, d = a[0].x, e = a[1].x;
                l.levels.forEach(function (f, h) {
                    var g = a[1].y - c * f;
                    this.linkRetracementPoint(h, d, a[0].y - b * f, this.startRetracements);
                    this.linkRetracementPoint(h, e, g, this.endRetracements)
                }, this)
            }, linkRetracementPoint: function (a, b, c, d) {
                var f = d[a], g = this.options.typeOptions;
                f ? (f.options.x = b, f.options.y = c, f.refresh()) : d[a] = new n(this.chart, this, {
                    x: b,
                    y: c,
                    xAxis: g.xAxis,
                    yAxis: g.yAxis
                })
            }, addShapes: function () {
                l.levels.forEach(function (a,
                                           b) {
                    this.initShape({type: "path", d: c(b)}, !1);
                    0 < b && this.initShape({
                        type: "path",
                        fill: this.options.typeOptions.backgroundColors[b - 1],
                        strokeWidth: 0,
                        d: c(b, !0)
                    })
                }, this)
            }, addLabels: function () {
                l.levels.forEach(function (a, b) {
                    var c = this.options.typeOptions;
                    a = this.initLabel(p(c.labels[b], {
                        point: function (a) {
                            return n.pointToOptions(a.annotation.startRetracements[b])
                        }, text: a.toString()
                    }));
                    c.labels[b] = a.options
                }, this)
            }
        }, {
            typeOptions: {
                height: 2,
                backgroundColors: "rgba(130, 170, 255, 0.4);rgba(139, 191, 216, 0.4);rgba(150, 216, 192, 0.4);rgba(156, 229, 161, 0.4);rgba(162, 241, 130, 0.4);rgba(169, 255, 101, 0.4)".split(";"),
                lineColor: "grey",
                lineColors: [],
                labels: []
            },
            labelOptions: {
                allowOverlap: !0,
                align: "right",
                backgroundColor: "none",
                borderWidth: 0,
                crop: !1,
                overflow: "none",
                shape: "rect",
                style: {color: "grey"},
                verticalAlign: "middle",
                y: 0
            }
        });
        return d.types.fibonacci = l
    });
    t(e, "annotations/types/Pitchfork.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var p = d.merge;
        d = e.Annotation;
        var n = d.MockPoint, k = d.types.infinityLine, c = function () {
            k.apply(this, arguments)
        };
        c.findEdgePoint = function (a, b, c) {
            b = Math.atan2(c.plotY - b.plotY,
                c.plotX - b.plotX);
            return {x: a.plotX + 1E7 * Math.cos(b), y: a.plotY + 1E7 * Math.sin(b)}
        };
        c.middleLineEdgePoint = function (a) {
            var b = a.annotation;
            return k.findEdgePoint(b.points[0], new n(b.chart, a, b.midPointOptions()))
        };
        var l = function (a) {
            return function (b) {
                var d = b.annotation, e = d.points;
                return c.findEdgePoint(e[a], e[0], new n(d.chart, b, d.midPointOptions()))
            }
        };
        c.topLineEdgePoint = l(1);
        c.bottomLineEdgePoint = l(0);
        e.extendAnnotation(c, k, {
            midPointOptions: function () {
                var a = this.points;
                return {
                    x: (a[1].x + a[2].x) / 2, y: (a[1].y +
                        a[2].y) / 2, xAxis: a[0].series.xAxis, yAxis: a[0].series.yAxis
                }
            }, addShapes: function () {
                this.addLines();
                this.addBackgrounds()
            }, addLines: function () {
                this.initShape({type: "path", points: [this.points[0], c.middleLineEdgePoint]}, !1);
                this.initShape({type: "path", points: [this.points[1], c.topLineEdgePoint]}, !1);
                this.initShape({type: "path", points: [this.points[2], c.bottomLineEdgePoint]}, !1)
            }, addBackgrounds: function () {
                var a = this.shapes, b = this.options.typeOptions, c = this.initShape(p(b.innerBackground, {
                    type: "path", points: [function (a) {
                        var b =
                            a.annotation;
                        a = b.points;
                        b = b.midPointOptions();
                        return {x: (a[1].x + b.x) / 2, y: (a[1].y + b.y) / 2, xAxis: b.xAxis, yAxis: b.yAxis}
                    }, a[1].points[1], a[2].points[1], function (a) {
                        var b = a.annotation;
                        a = b.points;
                        b = b.midPointOptions();
                        return {x: (b.x + a[2].x) / 2, y: (b.y + a[2].y) / 2, xAxis: b.xAxis, yAxis: b.yAxis}
                    }]
                }));
                a = this.initShape(p(b.outerBackground, {
                    type: "path",
                    points: [this.points[1], a[1].points[1], a[2].points[1], this.points[2]]
                }));
                b.innerBackground = c.options;
                b.outerBackground = a.options
            }
        }, {
            typeOptions: {
                innerBackground: {
                    fill: "rgba(130, 170, 255, 0.4)",
                    strokeWidth: 0
                }, outerBackground: {fill: "rgba(156, 229, 161, 0.4)", strokeWidth: 0}
            }
        });
        return d.types.pitchfork = c
    });
    t(e, "annotations/types/VerticalLine.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var p = d.merge;
        d = e.Annotation;
        var n = d.MockPoint, k = function () {
            e.Annotation.apply(this, arguments)
        };
        k.connectorFirstPoint = function (c) {
            c = c.annotation;
            var d = c.points[0], a = n.pointToPixels(d, !0), b = a.y, e = c.options.typeOptions.label.offset;
            c.chart.inverted && (b = a.x);
            return {
                x: d.x, xAxis: d.series.xAxis,
                y: b + e
            }
        };
        k.connectorSecondPoint = function (c) {
            var d = c.annotation;
            c = d.options.typeOptions;
            var a = d.points[0], b = c.yOffset;
            d = n.pointToPixels(a, !0)[d.chart.inverted ? "x" : "y"];
            0 > c.label.offset && (b *= -1);
            return {x: a.x, xAxis: a.series.xAxis, y: d + b}
        };
        e.extendAnnotation(k, null, {
            getPointsOptions: function () {
                return [this.options.typeOptions.point]
            }, addShapes: function () {
                var c = this.options.typeOptions, d = this.initShape(p(c.connector, {
                    type: "path",
                    points: [k.connectorFirstPoint, k.connectorSecondPoint]
                }), !1);
                c.connector = d.options
            },
            addLabels: function () {
                var c = this.options.typeOptions, d = c.label, a = 0, b = d.offset, e = 0 > d.offset ? "bottom" : "top",
                    h = "center";
                this.chart.inverted && (a = d.offset, b = 0, e = "middle", h = 0 > d.offset ? "right" : "left");
                d = this.initLabel(p(d, {verticalAlign: e, align: h, x: a, y: b}));
                c.label = d.options
            }
        }, {
            typeOptions: {
                yOffset: 10, label: {
                    offset: -40,
                    point: function (c) {
                        return c.annotation.points[0]
                    },
                    allowOverlap: !0,
                    backgroundColor: "none",
                    borderWidth: 0,
                    crop: !0,
                    overflow: "none",
                    shape: "rect",
                    text: "{y:.2f}"
                }, connector: {strokeWidth: 1, markerEnd: "arrow"}
            }
        });
        return d.types.verticalLine = k
    });
    t(e, "annotations/types/Measure.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function (e, d) {
        var p = d.extend, n = d.isNumber, k = d.merge, c = e.Annotation, l = c.ControlPoint;
        d = function () {
            c.apply(this, arguments)
        };
        c.types.measure = d;
        e.extendAnnotation(d, null, {
            init: function () {
                c.prototype.init.apply(this, arguments);
                this.resizeY = this.resizeX = this.offsetY = this.offsetX = 0;
                this.calculations.init.call(this);
                this.addValues();
                this.addShapes()
            }, setClipAxes: function () {
                this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis];
                this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis]
            }, pointsOptions: function () {
                return this.options.points
            }, shapePointsOptions: function () {
                var a = this.options.typeOptions, b = a.xAxis;
                a = a.yAxis;
                return [{x: this.xAxisMin, y: this.yAxisMin, xAxis: b, yAxis: a}, {
                    x: this.xAxisMax,
                    y: this.yAxisMin,
                    xAxis: b,
                    yAxis: a
                }, {x: this.xAxisMax, y: this.yAxisMax, xAxis: b, yAxis: a}, {
                    x: this.xAxisMin,
                    y: this.yAxisMax,
                    xAxis: b,
                    yAxis: a
                }]
            }, addControlPoints: function () {
                var a = this.options.typeOptions.selectType;
                var b = new l(this.chart,
                    this, this.options.controlPointOptions, 0);
                this.controlPoints.push(b);
                "xy" !== a && (b = new l(this.chart, this, this.options.controlPointOptions, 1), this.controlPoints.push(b))
            }, addValues: function (a) {
                var b = this.options.typeOptions, c = b.label.formatter;
                this.calculations.recalculate.call(this, a);
                b.label.enabled && (0 < this.labels.length ? this.labels[0].text = c && c.call(this) || this.calculations.defaultFormatter.call(this) : this.initLabel(p({
                    shape: "rect", backgroundColor: "none", color: "black", borderWidth: 0, dashStyle: "dash",
                    overflow: "none", align: "left", vertical: "top", crop: !0, point: function (a) {
                        a = a.annotation;
                        var c = a.chart, d = c.inverted, e = c.yAxis[b.yAxis], f = c.plotTop, h = c.plotLeft;
                        return {
                            x: (d ? f : 10) + c.xAxis[b.xAxis].toPixels(a.xAxisMin, !d),
                            y: (d ? -h + 10 : f) + e.toPixels(a.yAxisMin)
                        }
                    }, text: c && c.call(this) || this.calculations.defaultFormatter.call(this)
                }, b.label)))
            }, addShapes: function () {
                this.addCrosshairs();
                this.addBackground()
            }, addBackground: function () {
                "undefined" !== typeof this.shapePointsOptions()[0].x && this.initShape(p({
                    type: "path",
                    points: this.shapePointsOptions()
                }, this.options.typeOptions.background), !1)
            }, addCrosshairs: function () {
                var a = this.chart, b = this.options.typeOptions, c = this.options.typeOptions.point,
                    d = a.xAxis[b.xAxis], e = a.yAxis[b.yAxis], g = a.inverted;
                a = d.toPixels(this.xAxisMin);
                d = d.toPixels(this.xAxisMax);
                var m = e.toPixels(this.yAxisMin), l = e.toPixels(this.yAxisMax), n = {point: c, type: "path"};
                c = [];
                e = [];
                g && (g = a, a = m, m = g, g = d, d = l, l = g);
                b.crosshairX.enabled && (c = [["M", a, m + (l - m) / 2], ["L", d, m + (l - m) / 2]]);
                b.crosshairY.enabled && (e = [["M",
                    a + (d - a) / 2, m], ["L", a + (d - a) / 2, l]]);
                0 < this.shapes.length ? (this.shapes[0].options.d = c, this.shapes[1].options.d = e) : (a = k(n, b.crosshairX), b = k(n, b.crosshairY), this.initShape(p({d: c}, a), !1), this.initShape(p({d: e}, b), !1))
            }, onDrag: function (a) {
                var b = this.mouseMoveToTranslation(a), c = this.options.typeOptions.selectType;
                a = "y" === c ? 0 : b.x;
                b = "x" === c ? 0 : b.y;
                this.translate(a, b);
                this.offsetX += a;
                this.offsetY += b;
                this.redraw(!1, !1, !0)
            }, resize: function (a, b, c, d) {
                var e = this.shapes[2];
                "x" === d ? 0 === c ? (e.translatePoint(a, 0, 0), e.translatePoint(a,
                    b, 3)) : (e.translatePoint(a, 0, 1), e.translatePoint(a, b, 2)) : "y" === d ? 0 === c ? (e.translatePoint(0, b, 0), e.translatePoint(0, b, 1)) : (e.translatePoint(0, b, 2), e.translatePoint(0, b, 3)) : (e.translatePoint(a, 0, 1), e.translatePoint(a, b, 2), e.translatePoint(0, b, 3));
                this.calculations.updateStartPoints.call(this, !1, !0, c, a, b);
                this.options.typeOptions.background.height = Math.abs(this.startYMax - this.startYMin);
                this.options.typeOptions.background.width = Math.abs(this.startXMax - this.startXMin)
            }, redraw: function (a, b, c) {
                this.linkPoints();
                this.graphic || this.render();
                c && this.calculations.updateStartPoints.call(this, !0, !1);
                this.clipRect && this.clipRect.animate(this.getClipBox());
                this.addValues(b);
                this.addCrosshairs();
                this.redrawItems(this.shapes, a);
                this.redrawItems(this.labels, a);
                this.controlPoints.forEach(function (a) {
                    a.redraw()
                })
            }, translate: function (a, b) {
                this.shapes.forEach(function (c) {
                    c.translate(a, b)
                });
                this.options.typeOptions.point.x = this.startXMin;
                this.options.typeOptions.point.y = this.startYMin
            }, calculations: {
                init: function () {
                    var a =
                            this.options.typeOptions, b = this.chart, c = this.calculations.getPointPos, d = b.inverted,
                        e = b.xAxis[a.xAxis], g = b.yAxis[a.yAxis], m = a.background, k = d ? m.height : m.width;
                    m = d ? m.width : m.height;
                    var l = a.selectType, p = d ? b.plotLeft : b.plotTop;
                    b = d ? b.plotTop : b.plotLeft;
                    this.startXMin = a.point.x;
                    this.startYMin = a.point.y;
                    n(k) ? this.startXMax = this.startXMin + k : this.startXMax = c(e, this.startXMin, parseFloat(k));
                    n(m) ? this.startYMax = this.startYMin - m : this.startYMax = c(g, this.startYMin, parseFloat(m));
                    "x" === l ? (this.startYMin = g.toValue(p),
                        this.startYMax = g.toValue(p + g.len)) : "y" === l && (this.startXMin = e.toValue(b), this.startXMax = e.toValue(b + e.len))
                }, recalculate: function (a) {
                    var b = this.calculations, c = this.options.typeOptions, d = this.chart.xAxis[c.xAxis];
                    c = this.chart.yAxis[c.yAxis];
                    var e = this.calculations.getPointPos, g = this.offsetX, m = this.offsetY;
                    this.xAxisMin = e(d, this.startXMin, g);
                    this.xAxisMax = e(d, this.startXMax, g);
                    this.yAxisMin = e(c, this.startYMin, m);
                    this.yAxisMax = e(c, this.startYMax, m);
                    this.min = b.min.call(this);
                    this.max = b.max.call(this);
                    this.average = b.average.call(this);
                    this.bins = b.bins.call(this);
                    a && this.resize(0, 0)
                }, getPointPos: function (a, b, c) {
                    return a.toValue(a.toPixels(b) + c)
                }, updateStartPoints: function (a, b, c, d, e) {
                    var g = this.options.typeOptions, f = g.selectType, h = this.chart.xAxis[g.xAxis];
                    g = this.chart.yAxis[g.yAxis];
                    var k = this.calculations.getPointPos, l = this.startXMin, q = this.startXMax, r = this.startYMin,
                        y = this.startYMax, B = this.offsetX, z = this.offsetY;
                    b && ("x" === f ? 0 === c ? this.startXMin = k(h, l, d) : this.startXMax = k(h, q, d) : "y" === f ? 0 === c ? this.startYMin =
                        k(g, r, e) : this.startYMax = k(g, y, e) : (this.startXMax = k(h, q, d), this.startYMax = k(g, y, e)));
                    a && (this.startXMin = k(h, l, B), this.startXMax = k(h, q, B), this.startYMin = k(g, r, z), this.startYMax = k(g, y, z), this.offsetY = this.offsetX = 0)
                }, defaultFormatter: function () {
                    return "Min: " + this.min + "<br>Max: " + this.max + "<br>Average: " + this.average + "<br>Bins: " + this.bins
                }, getExtremes: function (a, b, c, d) {
                    return {
                        xAxisMin: Math.min(b, a),
                        xAxisMax: Math.max(b, a),
                        yAxisMin: Math.min(d, c),
                        yAxisMax: Math.max(d, c)
                    }
                }, min: function () {
                    var a = Infinity, b =
                            this.chart.series,
                        c = this.calculations.getExtremes(this.xAxisMin, this.xAxisMax, this.yAxisMin, this.yAxisMax),
                        d = !1;
                    b.forEach(function (b) {
                        b.visible && "highcharts-navigator-series" !== b.options.id && b.points.forEach(function (b) {
                            !b.isNull && b.y < a && b.x > c.xAxisMin && b.x <= c.xAxisMax && b.y > c.yAxisMin && b.y <= c.yAxisMax && (a = b.y, d = !0)
                        })
                    });
                    d || (a = "");
                    return a
                }, max: function () {
                    var a = -Infinity, b = this.chart.series,
                        c = this.calculations.getExtremes(this.xAxisMin, this.xAxisMax, this.yAxisMin, this.yAxisMax),
                        d = !1;
                    b.forEach(function (b) {
                        b.visible &&
                        "highcharts-navigator-series" !== b.options.id && b.points.forEach(function (b) {
                            !b.isNull && b.y > a && b.x > c.xAxisMin && b.x <= c.xAxisMax && b.y > c.yAxisMin && b.y <= c.yAxisMax && (a = b.y, d = !0)
                        })
                    });
                    d || (a = "");
                    return a
                }, average: function () {
                    var a = "";
                    "" !== this.max && "" !== this.min && (a = (this.max + this.min) / 2);
                    return a
                }, bins: function () {
                    var a = 0, b = this.chart.series,
                        c = this.calculations.getExtremes(this.xAxisMin, this.xAxisMax, this.yAxisMin, this.yAxisMax),
                        d = !1;
                    b.forEach(function (b) {
                        b.visible && "highcharts-navigator-series" !== b.options.id &&
                        b.points.forEach(function (b) {
                            !b.isNull && b.x > c.xAxisMin && b.x <= c.xAxisMax && b.y > c.yAxisMin && b.y <= c.yAxisMax && (a++, d = !0)
                        })
                    });
                    d || (a = "");
                    return a
                }
            }
        }, {
            typeOptions: {
                selectType: "xy",
                xAxis: 0,
                yAxis: 0,
                background: {fill: "rgba(130, 170, 255, 0.4)", strokeWidth: 0, stroke: void 0},
                crosshairX: {enabled: !0, zIndex: 6, dashStyle: "Dash", markerEnd: "arrow"},
                crosshairY: {enabled: !0, zIndex: 6, dashStyle: "Dash", markerEnd: "arrow"},
                label: {enabled: !0, style: {fontSize: "11px", color: "#666666"}, formatter: void 0}
            }, controlPointOptions: {
                positioner: function (a) {
                    var b =
                        this.index, c = a.chart, d = a.options, e = d.typeOptions, g = e.selectType;
                    d = d.controlPointOptions;
                    var m = c.inverted, k = c.xAxis[e.xAxis];
                    c = c.yAxis[e.yAxis];
                    e = a.xAxisMax;
                    var l = a.yAxisMax, n = a.calculations.getExtremes(a.xAxisMin, a.xAxisMax, a.yAxisMin, a.yAxisMax);
                    "x" === g && (l = (n.yAxisMax - n.yAxisMin) / 2, 0 === b && (e = a.xAxisMin));
                    "y" === g && (e = n.xAxisMin + (n.xAxisMax - n.xAxisMin) / 2, 0 === b && (l = a.yAxisMin));
                    m ? (a = c.toPixels(l), b = k.toPixels(e)) : (a = k.toPixels(e), b = c.toPixels(l));
                    return {x: a - d.width / 2, y: b - d.height / 2}
                }, events: {
                    drag: function (a,
                                    b) {
                        var c = this.mouseMoveToTranslation(a);
                        a = b.options.typeOptions.selectType;
                        var d = "y" === a ? 0 : c.x;
                        c = "x" === a ? 0 : c.y;
                        b.resize(d, c, this.index, a);
                        b.resizeX += d;
                        b.resizeY += c;
                        b.redraw(!1, !0)
                    }
                }
            }
        });
        return c.types.measure = d
    });
    t(e, "mixins/navigation.js", [], function () {
        return {
            initUpdate: function (e) {
                e.navigation || (e.navigation = {
                    updates: [], update: function (d, e) {
                        this.updates.forEach(function (n) {
                            n.update.call(n.context, d, e)
                        })
                    }
                })
            }, addUpdate: function (e, d) {
                d.navigation || this.initUpdate(d);
                d.navigation.updates.push({
                    update: e,
                    context: d
                })
            }
        }
    });
    t(e, "annotations/navigationBindings.js", [e["parts/Globals.js"], e["parts/Utilities.js"], e["mixins/navigation.js"]], function (e, d, p) {
        function n(b) {
            var c = b.prototype.defaultOptions.events && b.prototype.defaultOptions.events.click;
            g(!0, b.prototype.defaultOptions.events, {
                click: function (b) {
                    var d = this, e = d.chart.navigationBindings, g = e.activeAnnotation;
                    c && c.click.call(d, b);
                    g !== d ? (e.deselectAnnotation(), e.activeAnnotation = d, d.setControlPointsVisibility(!0), a(e, "showPopup", {
                        annotation: d, formType: "annotation-toolbar",
                        options: e.annotationToFields(d), onSubmit: function (a) {
                            var b = {};
                            "remove" === a.actionType ? (e.activeAnnotation = !1, e.chart.removeAnnotation(d)) : (e.fieldsToOptions(a.fields, b), e.deselectAnnotation(), a = b.typeOptions, "measure" === d.options.type && (a.crosshairY.enabled = 0 !== a.crosshairY.strokeWidth, a.crosshairX.enabled = 0 !== a.crosshairX.strokeWidth), d.update(b))
                        }
                    })) : (e.deselectAnnotation(), a(e, "closePopup"));
                    b.activeAnnotation = !0
                }
            })
        }

        var k = d.addEvent, c = d.attr, l = d.format, a = d.fireEvent, b = d.isArray, f = d.isFunction,
            h = d.isNumber, q = d.isObject, g = d.merge, m = d.objectEach, v = d.pick, A = e.doc, C = e.win,
            w = function () {
                function d(a, b) {
                    this.selectedButton = this.boundClassNames = void 0;
                    this.chart = a;
                    this.options = b;
                    this.eventsToUnbind = [];
                    this.container = A.getElementsByClassName(this.options.bindingsClassName || "")
                }

                d.prototype.initEvents = function () {
                    var a = this, b = a.chart, c = a.container, d = a.options;
                    a.boundClassNames = {};
                    m(d.bindings || {}, function (b) {
                        a.boundClassNames[b.className] = b
                    });
                    [].forEach.call(c, function (b) {
                        a.eventsToUnbind.push(k(b,
                            "click", function (c) {
                                var d = a.getButtonEvents(b, c);
                                d && a.bindingsButtonClick(d.button, d.events, c)
                            }))
                    });
                    m(d.events || {}, function (b, c) {
                        f(b) && a.eventsToUnbind.push(k(a, c, b))
                    });
                    a.eventsToUnbind.push(k(b.container, "click", function (c) {
                        !b.cancelClick && b.isInsidePlot(c.chartX - b.plotLeft, c.chartY - b.plotTop) && a.bindingsChartClick(this, c)
                    }));
                    a.eventsToUnbind.push(k(b.container, "mousemove", function (b) {
                        a.bindingsContainerMouseMove(this, b)
                    }))
                };
                d.prototype.initUpdate = function () {
                    var a = this;
                    p.addUpdate(function (b) {
                            a.update(b)
                        },
                        this.chart)
                };
                d.prototype.bindingsButtonClick = function (b, c, d) {
                    var e = this.chart;
                    this.selectedButtonElement && (a(this, "deselectButton", {button: this.selectedButtonElement}), this.nextEvent && (this.currentUserDetails && "annotations" === this.currentUserDetails.coll && e.removeAnnotation(this.currentUserDetails), this.mouseMoveEvent = this.nextEvent = !1));
                    this.selectedButton = c;
                    this.selectedButtonElement = b;
                    a(this, "selectButton", {button: b});
                    c.init && c.init.call(this, b, d);
                    (c.start || c.steps) && e.renderer.boxWrapper.addClass("highcharts-draw-mode")
                };
                d.prototype.bindingsChartClick = function (b, c) {
                    b = this.chart;
                    var d = this.selectedButton;
                    b = b.renderer.boxWrapper;
                    var e;
                    if (e = this.activeAnnotation && !c.activeAnnotation && c.target.parentNode) {
                        a:{
                            e = c.target;
                            var g = C.Element.prototype,
                                m = g.matches || g.msMatchesSelector || g.webkitMatchesSelector, f = null;
                            if (g.closest) f = g.closest.call(e, ".highcharts-popup"); else {
                                do {
                                    if (m.call(e, ".highcharts-popup")) break a;
                                    e = e.parentElement || e.parentNode
                                } while (null !== e && 1 === e.nodeType)
                            }
                            e = f
                        }
                        e = !e
                    }
                    e && (a(this, "closePopup"), this.deselectAnnotation());
                    d && d.start && (this.nextEvent ? (this.nextEvent(c, this.currentUserDetails), this.steps && (this.stepIndex++, d.steps[this.stepIndex] ? this.mouseMoveEvent = this.nextEvent = d.steps[this.stepIndex] : (a(this, "deselectButton", {button: this.selectedButtonElement}), b.removeClass("highcharts-draw-mode"), d.end && d.end.call(this, c, this.currentUserDetails), this.mouseMoveEvent = this.nextEvent = !1, this.selectedButton = null))) : (this.currentUserDetails = d.start.call(this, c), d.steps ? (this.stepIndex = 0, this.steps = !0, this.mouseMoveEvent =
                        this.nextEvent = d.steps[this.stepIndex]) : (a(this, "deselectButton", {button: this.selectedButtonElement}), b.removeClass("highcharts-draw-mode"), this.steps = !1, this.selectedButton = null, d.end && d.end.call(this, c, this.currentUserDetails))))
                };
                d.prototype.bindingsContainerMouseMove = function (a, b) {
                    this.mouseMoveEvent && this.mouseMoveEvent(b, this.currentUserDetails)
                };
                d.prototype.fieldsToOptions = function (a, b) {
                    m(a, function (a, c) {
                        var d = parseFloat(a), e = c.split("."), g = b, m = e.length - 1;
                        !h(d) || a.match(/px/g) || c.match(/format/g) ||
                        (a = d);
                        "" !== a && "undefined" !== a && e.forEach(function (b, c) {
                            var d = v(e[c + 1], "");
                            m === c ? g[b] = a : (g[b] || (g[b] = d.match(/\d/g) ? [] : {}), g = g[b])
                        })
                    });
                    return b
                };
                d.prototype.deselectAnnotation = function () {
                    this.activeAnnotation && (this.activeAnnotation.setControlPointsVisibility(!1), this.activeAnnotation = !1)
                };
                d.prototype.annotationToFields = function (a) {
                    function c(d, e, g, h) {
                        if (g && -1 === n.indexOf(e) && (0 <= (g.indexOf && g.indexOf(e)) || g[e] || !0 === g)) if (b(d)) h[e] = [], d.forEach(function (a, b) {
                            q(a) ? (h[e][b] = {}, m(a, function (a, d) {
                                c(a,
                                    d, f[e], h[e][b])
                            })) : c(a, 0, f[e], h[e])
                        }); else if (q(d)) {
                            var r = {};
                            b(h) ? (h.push(r), r[e] = {}, r = r[e]) : h[e] = r;
                            m(d, function (a, b) {
                                c(a, b, 0 === e ? g : f[e], r)
                            })
                        } else "format" === e ? h[e] = [l(d, a.labels[0].points[0]).toString(), "text"] : b(h) ? h.push([d, k(d)]) : h[e] = [d, k(d)]
                    }

                    var e = a.options, g = d.annotationsEditable, f = g.nestedOptions, k = this.utils.getFieldType,
                        h = v(e.type, e.shapes && e.shapes[0] && e.shapes[0].type, e.labels && e.labels[0] && e.labels[0].itemType, "label"),
                        n = d.annotationsNonEditable[e.langKey] || [], r = {langKey: e.langKey, type: h};
                    m(e, function (a, b) {
                        "typeOptions" === b ? (r[b] = {}, m(e[b], function (a, d) {
                            c(a, d, f, r[b], !0)
                        })) : c(a, b, g[h], r)
                    });
                    return r
                };
                d.prototype.getClickedClassNames = function (a, b) {
                    var d = b.target;
                    b = [];
                    for (var e; d && ((e = c(d, "class")) && (b = b.concat(e.split(" ").map(function (a) {
                        return [a, d]
                    }))), d = d.parentNode, d !== a);) ;
                    return b
                };
                d.prototype.getButtonEvents = function (a, b) {
                    var c = this, d;
                    this.getClickedClassNames(a, b).forEach(function (a) {
                        c.boundClassNames[a[0]] && !d && (d = {events: c.boundClassNames[a[0]], button: a[1]})
                    });
                    return d
                };
                d.prototype.update =
                    function (a) {
                        this.options = g(!0, this.options, a);
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
                    measure: ["background", "crosshairY", "crosshairX"],
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
        w.prototype.utils = {
            updateRectSize: function (a, b) {
                var c = b.chart, d = b.options.typeOptions, e = c.pointer.getCoordinates(a);
                a = e.xAxis[0].value - d.point.x;
                d = d.point.y - e.yAxis[0].value;
                b.update({typeOptions: {background: {width: c.inverted ? d : a, height: c.inverted ? a : d}}})
            }, getFieldType: function (a) {
                return {string: "text", number: "number", "boolean": "checkbox"}[typeof a]
            }
        };
        e.Chart.prototype.initNavigationBindings = function () {
            var a = this.options;
            a && a.navigation && a.navigation.bindings && (this.navigationBindings = new w(this, a.navigation), this.navigationBindings.initEvents(), this.navigationBindings.initUpdate())
        };
        k(e.Chart, "load", function () {
            this.initNavigationBindings()
        });
        k(e.Chart, "destroy", function () {
            this.navigationBindings && this.navigationBindings.destroy()
        });
        k(w, "deselectButton", function () {
            this.selectedButtonElement = null
        });
        k(e.Annotation, "remove", function () {
            this.chart.navigationBindings && this.chart.navigationBindings.deselectAnnotation()
        });
        e.Annotation && (n(e.Annotation), m(e.Annotation.types, function (a) {
            n(a)
        }));
        e.setOptions({
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
                        className: "highcharts-circle-annotation", start: function (a) {
                            a = this.chart.pointer.getCoordinates(a);
                            var b = this.chart.options.navigation;
                            return this.chart.addAnnotation(g({
                                langKey: "circle", type: "basicAnnotation", shapes: [{
                                    type: "circle",
                                    point: {xAxis: 0, yAxis: 0, x: a.xAxis[0].value, y: a.yAxis[0].value},
                                    r: 5
                                }]
                            }, b.annotationsOptions, b.bindings.circleAnnotation.annotationsOptions))
                        }, steps: [function (a, b) {
                            var c = b.options.shapes[0].point, d = this.chart.xAxis[0].toPixels(c.x);
                            c = this.chart.yAxis[0].toPixels(c.y);
                            var e = this.chart.inverted;
                            b.update({shapes: [{r: Math.max(Math.sqrt(Math.pow(e ? c - a.chartX : d - a.chartX, 2) + Math.pow(e ? d - a.chartY : c - a.chartY, 2)), 5)}]})
                        }]
                    }, rectangleAnnotation: {
                        className: "highcharts-rectangle-annotation", start: function (a) {
                            var b = this.chart.pointer.getCoordinates(a);
                            a = this.chart.options.navigation;
                            var c = b.xAxis[0].value;
                            b = b.yAxis[0].value;
                            return this.chart.addAnnotation(g({
                                langKey: "rectangle",
                                type: "basicAnnotation",
                                shapes: [{
                                    type: "path",
                                    points: [{xAxis: 0, yAxis: 0, x: c, y: b}, {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: c,
                                        y: b
                                    }, {xAxis: 0, yAxis: 0, x: c, y: b}, {xAxis: 0, yAxis: 0, x: c, y: b}]
                                }]
                            }, a.annotationsOptions, a.bindings.rectangleAnnotation.annotationsOptions))
                        }, steps: [function (a, b) {
                            var c = b.options.shapes[0].points, d = this.chart.pointer.getCoordinates(a);
                            a = d.xAxis[0].value;
                            d = d.yAxis[0].value;
                            c[1].x = a;
                            c[2].x = a;
                            c[2].y = d;
                            c[3].y = d;
                            b.update({shapes: [{points: c}]})
                        }]
                    },
                    labelAnnotation: {
                        className: "highcharts-label-annotation", start: function (a) {
                            a = this.chart.pointer.getCoordinates(a);
                            var b = this.chart.options.navigation;
                            return this.chart.addAnnotation(g({
                                langKey: "label",
                                type: "basicAnnotation",
                                labelOptions: {format: "{y:.2f}"},
                                labels: [{
                                    point: {xAxis: 0, yAxis: 0, x: a.xAxis[0].value, y: a.yAxis[0].value},
                                    overflow: "none",
                                    crop: !0
                                }]
                            }, b.annotationsOptions, b.bindings.labelAnnotation.annotationsOptions))
                        }
                    }
                }, events: {}, annotationsOptions: {}
            }
        });
        return w
    });
    t(e, "annotations/popup.js", [e["parts/Globals.js"],
        e["annotations/navigationBindings.js"], e["parts/Utilities.js"]], function (e, d, p) {
        var n = p.addEvent, k = p.createElement, c = p.defined, l = p.isArray, a = p.isObject, b = p.isString,
            f = p.objectEach, h = p.pick;
        p = p.wrap;
        var q = /\d/g;
        p(e.Pointer.prototype, "onContainerMouseDown", function (a, c) {
            var d = c.target && c.target.className;
            b(d) && 0 <= d.indexOf("highcharts-popup-field") || a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        e.Popup = function (a, b) {
            this.init(a, b)
        };
        e.Popup.prototype = {
            init: function (a, b) {
                this.container = k("div",
                    {className: "highcharts-popup"}, null, a);
                this.lang = this.getLangpack();
                this.iconsURL = b;
                this.addCloseBtn()
            }, addCloseBtn: function () {
                var a = this;
                var b = k("div", {className: "highcharts-popup-close"}, null, this.container);
                b.style["background-image"] = "url(" + this.iconsURL + "close.svg)";
                ["click", "touchstart"].forEach(function (c) {
                    n(b, c, function () {
                        a.closePopup()
                    })
                })
            }, addColsContainer: function (a) {
                var b = k("div", {className: "highcharts-popup-lhs-col"}, null, a);
                a = k("div", {className: "highcharts-popup-rhs-col"}, null, a);
                k("div",
                    {className: "highcharts-popup-rhs-col-wrapper"}, null, a);
                return {lhsCol: b, rhsCol: a}
            }, addInput: function (a, b, c, d) {
                var e = a.split(".");
                e = e[e.length - 1];
                var g = this.lang;
                b = "highcharts-" + b + "-" + e;
                b.match(q) || k("label", {innerHTML: g[e] || e, htmlFor: b}, null, c);
                k("input", {
                    name: b,
                    value: d[0],
                    type: d[1],
                    className: "highcharts-popup-field"
                }, null, c).setAttribute("highcharts-data-name", a)
            }, addButton: function (a, b, c, d, e) {
                var g = this, f = this.closePopup, m = this.getFields;
                var h = k("button", {innerHTML: b}, null, a);
                ["click", "touchstart"].forEach(function (a) {
                    n(h,
                        a, function () {
                            f.call(g);
                            return d(m(e, c))
                        })
                });
                return h
            }, getFields: function (a, b) {
                var c = a.querySelectorAll("input"),
                    d = a.querySelectorAll("#highcharts-select-series > option:checked")[0];
                a = a.querySelectorAll("#highcharts-select-volume > option:checked")[0];
                var e, g;
                var f = {actionType: b, linkedTo: d && d.getAttribute("value"), fields: {}};
                [].forEach.call(c, function (a) {
                    g = a.getAttribute("highcharts-data-name");
                    (e = a.getAttribute("highcharts-data-series-id")) ? f.seriesId = a.value : g ? f.fields[g] = a.value : f.type = a.value
                });
                a && (f.fields["params.volumeSeriesID"] = a.getAttribute("value"));
                return f
            }, showPopup: function () {
                var a = this.container, b = a.querySelectorAll(".highcharts-popup-close")[0];
                a.innerHTML = "";
                0 <= a.className.indexOf("highcharts-annotation-toolbar") && (a.classList.remove("highcharts-annotation-toolbar"), a.removeAttribute("style"));
                a.appendChild(b);
                a.style.display = "block"
            }, closePopup: function () {
                this.popup.container.style.display = "none"
            }, showForm: function (a, b, c, d) {
                this.popup = b.navigationBindings.popup;
                this.showPopup();
                "indicators" === a && this.indicators.addForm.call(this, b, c, d);
                "annotation-toolbar" === a && this.annotations.addToolbar.call(this, b, c, d);
                "annotation-edit" === a && this.annotations.addForm.call(this, b, c, d);
                "flag" === a && this.annotations.addForm.call(this, b, c, d, !0)
            }, getLangpack: function () {
                return e.getOptions().lang.navigation.popup
            }, annotations: {
                addToolbar: function (a, b, c) {
                    var d = this, e = this.lang, g = this.popup.container, f = this.showForm;
                    -1 === g.className.indexOf("highcharts-annotation-toolbar") && (g.className += " highcharts-annotation-toolbar");
                    g.style.top = a.plotTop + 10 + "px";
                    k("span", {innerHTML: h(e[b.langKey] || b.langKey, b.shapes && b.shapes[0].type)}, null, g);
                    var m = this.addButton(g, e.removeButton || "remove", "remove", c, g);
                    m.className += " highcharts-annotation-remove-button";
                    m.style["background-image"] = "url(" + this.iconsURL + "destroy.svg)";
                    m = this.addButton(g, e.editButton || "edit", "edit", function () {
                        f.call(d, "annotation-edit", a, b, c)
                    }, g);
                    m.className += " highcharts-annotation-edit-button";
                    m.style["background-image"] = "url(" + this.iconsURL + "edit.svg)"
                }, addForm: function (a,
                                      b, c, d) {
                    var e = this.popup.container, g = this.lang;
                    k("h2", {innerHTML: g[b.langKey] || b.langKey, className: "highcharts-popup-main-title"}, null, e);
                    var f = k("div", {className: "highcharts-popup-lhs-col highcharts-popup-lhs-full"}, null, e);
                    var m = k("div", {className: "highcharts-popup-bottom-row"}, null, e);
                    this.annotations.addFormFields.call(this, f, a, "", b, [], !0);
                    this.addButton(m, d ? g.addButton || "add" : g.saveButton || "save", d ? "add" : "save", c, e)
                }, addFormFields: function (b, c, d, e, h, n) {
                    var g = this, m = this.annotations.addFormFields,
                        p = this.addInput, v = this.lang, w, A;
                    f(e, function (e, f) {
                        w = "" !== d ? d + "." + f : f;
                        a(e) && (!l(e) || l(e) && a(e[0]) ? (A = v[f] || f, A.match(q) || h.push([!0, A, b]), m.call(g, b, c, w, e, h, !1)) : h.push([g, w, "annotation", b, e]))
                    });
                    n && (h = h.sort(function (a) {
                        return a[1].match(/format/g) ? -1 : 1
                    }), h.forEach(function (a) {
                        !0 === a[0] ? k("span", {
                            className: "highcharts-annotation-title",
                            innerHTML: a[1]
                        }, null, a[2]) : p.apply(a[0], a.splice(1))
                    }))
                }
            }, indicators: {
                addForm: function (a, b, c) {
                    var d = this.indicators, e = this.lang;
                    this.tabs.init.call(this, a);
                    b = this.popup.container.querySelectorAll(".highcharts-tab-item-content");
                    this.addColsContainer(b[0]);
                    d.addIndicatorList.call(this, a, b[0], "add");
                    var g = b[0].querySelectorAll(".highcharts-popup-rhs-col")[0];
                    this.addButton(g, e.addButton || "add", "add", c, g);
                    this.addColsContainer(b[1]);
                    d.addIndicatorList.call(this, a, b[1], "edit");
                    g = b[1].querySelectorAll(".highcharts-popup-rhs-col")[0];
                    this.addButton(g, e.saveButton || "save", "edit", c, g);
                    this.addButton(g, e.removeButton || "remove", "remove", c, g)
                }, addIndicatorList: function (a, b, c) {
                    var d = this, e = b.querySelectorAll(".highcharts-popup-lhs-col")[0];
                    b = b.querySelectorAll(".highcharts-popup-rhs-col")[0];
                    var g = "edit" === c, h = g ? a.series : a.options.plotOptions, m = this.indicators.addFormFields,
                        l;
                    var p = k("ul", {className: "highcharts-indicator-list"}, null, e);
                    var q = b.querySelectorAll(".highcharts-popup-rhs-col-wrapper")[0];
                    f(h, function (b, c) {
                        var e = b.options;
                        if (b.params || e && e.params) {
                            var f = d.indicators.getNameType(b, c), v = f.type;
                            l = k("li", {className: "highcharts-indicator-list", innerHTML: f.name}, null, p);
                            ["click", "touchstart"].forEach(function (c) {
                                n(l, c, function () {
                                    m.call(d,
                                        a, g ? b : h[v], f.type, q);
                                    g && b.options && k("input", {
                                        type: "hidden",
                                        name: "highcharts-id-" + v,
                                        value: b.options.id
                                    }, null, q).setAttribute("highcharts-data-series-id", b.options.id)
                                })
                            })
                        }
                    });
                    0 < p.childNodes.length && p.childNodes[0].click()
                }, getNameType: function (a, b) {
                    var c = a.options, d = e.seriesTypes;
                    d = d[b] && d[b].prototype.nameBase || b.toUpperCase();
                    c && c.type && (b = a.options.type, d = a.name);
                    return {name: d, type: b}
                }, listAllSeries: function (a, b, d, e, f) {
                    a = "highcharts-" + b + "-type-" + a;
                    var g;
                    k("label", {innerHTML: this.lang[b] || b, htmlFor: a},
                        null, e);
                    var h = k("select", {name: a, className: "highcharts-popup-field"}, null, e);
                    h.setAttribute("id", "highcharts-select-" + b);
                    d.series.forEach(function (a) {
                        g = a.options;
                        !g.params && g.id && "highcharts-navigator-series" !== g.id && k("option", {
                            innerHTML: g.name || g.id,
                            value: g.id
                        }, null, h)
                    });
                    c(f) && (h.value = f)
                }, addFormFields: function (a, b, c, d) {
                    var e = b.params || b.options.params, g = this.indicators.getNameType;
                    d.innerHTML = "";
                    k("h3", {className: "highcharts-indicator-title", innerHTML: g(b, c).name}, null, d);
                    k("input", {
                        type: "hidden",
                        name: "highcharts-type-" + c, value: c
                    }, null, d);
                    this.indicators.listAllSeries.call(this, c, "series", a, d, b.linkedParent && e.volumeSeriesID);
                    e.volumeSeriesID && this.indicators.listAllSeries.call(this, c, "volume", a, d, b.linkedParent && b.linkedParent.options.id);
                    this.indicators.addParamInputs.call(this, a, "params", e, c, d)
                }, addParamInputs: function (b, c, d, e, h) {
                    var g = this, k = this.indicators.addParamInputs, l = this.addInput, m;
                    f(d, function (d, f) {
                        m = c + "." + f;
                        a(d) ? k.call(g, b, m, d, e, h) : "params.volumeSeriesID" !== m && l.call(g, m, e, h,
                            [d, "text"])
                    })
                }, getAmount: function () {
                    var a = 0;
                    f(this.series, function (b) {
                        var c = b.options;
                        (b.params || c && c.params) && a++
                    });
                    return a
                }
            }, tabs: {
                init: function (a) {
                    var b = this.tabs;
                    a = this.indicators.getAmount.call(a);
                    var c = b.addMenuItem.call(this, "add");
                    b.addMenuItem.call(this, "edit", a);
                    b.addContentItem.call(this, "add");
                    b.addContentItem.call(this, "edit");
                    b.switchTabs.call(this, a);
                    b.selectTab.call(this, c, 0)
                }, addMenuItem: function (a, b) {
                    var c = this.popup.container, d = "highcharts-tab-item", e = this.lang;
                    0 === b && (d += " highcharts-tab-disabled");
                    b = k("span", {innerHTML: e[a + "Button"] || a, className: d}, null, c);
                    b.setAttribute("highcharts-data-tab-type", a);
                    return b
                }, addContentItem: function () {
                    return k("div", {className: "highcharts-tab-item-content"}, null, this.popup.container)
                }, switchTabs: function (a) {
                    var b = this, c;
                    this.popup.container.querySelectorAll(".highcharts-tab-item").forEach(function (d, e) {
                        c = d.getAttribute("highcharts-data-tab-type");
                        "edit" === c && 0 === a || ["click", "touchstart"].forEach(function (a) {
                            n(d, a, function () {
                                b.tabs.deselectAll.call(b);
                                b.tabs.selectTab.call(b,
                                    this, e)
                            })
                        })
                    })
                }, selectTab: function (a, b) {
                    var c = this.popup.container.querySelectorAll(".highcharts-tab-item-content");
                    a.className += " highcharts-tab-item-active";
                    c[b].className += " highcharts-tab-item-show"
                }, deselectAll: function () {
                    var a = this.popup.container, b = a.querySelectorAll(".highcharts-tab-item");
                    a = a.querySelectorAll(".highcharts-tab-item-content");
                    var c;
                    for (c = 0; c < b.length; c++) b[c].classList.remove("highcharts-tab-item-active"), a[c].classList.remove("highcharts-tab-item-show")
                }
            }
        };
        n(d, "showPopup",
            function (a) {
                this.popup || (this.popup = new e.Popup(this.chart.container, this.chart.options.navigation.iconsURL || this.chart.options.stockTools && this.chart.options.stockTools.gui.iconsURL || "https://code.highcharts.com/8.1.0/gfx/stock-icons/"));
                this.popup.showForm(a.formType, this.chart, a.options, a.onSubmit)
            });
        n(d, "closePopup", function () {
            this.popup && this.popup.closePopup()
        })
    });
    t(e, "masters/modules/annotations-advanced.src.js", [], function () {
    })
});
//# sourceMappingURL=annotations-advanced.js.map