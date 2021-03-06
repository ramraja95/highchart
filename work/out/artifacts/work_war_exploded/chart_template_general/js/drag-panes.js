/*
 Highstock JS v8.1.0 (2020-05-05)

 Drag-panes module

 (c) 2010-2019 Highsoft AS
 Author: Kacper Madej

 License: www.highcharts.com/license
*/
(function (a) {
    "object" === typeof module && module.exports ? (a["default"] = a, module.exports = a) : "function" === typeof define && define.amd ? define("highcharts/modules/drag-panes", ["highcharts", "highcharts/modules/stock"], function (m) {
        a(m);
        a.Highcharts = m;
        return a
    }) : a("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function (a) {
    function m(a, b, e, q) {
        a.hasOwnProperty(b) || (a[b] = q.apply(null, e))
    }

    a = a ? a._modules : {};
    m(a, "modules/drag-panes.src.js", [a["parts/Globals.js"], a["parts/Utilities.js"]], function (a, b) {
        var e = b.addEvent,
            q = b.clamp, m = b.isNumber, y = b.merge, z = b.objectEach, v = b.relativeLength;
        b = b.wrap;
        var A = a.hasTouch, l = a.Axis, w = a.Pointer, x = function () {
            function a(c) {
                this.options = this.lastPos = this.controlLine = this.axis = void 0;
                this.init(c)
            }

            a.prototype.init = function (c, a) {
                this.axis = c;
                this.options = c.options.resize;
                this.render();
                a || this.addMouseEvents()
            };
            a.prototype.render = function () {
                var c = this.axis, a = c.chart, d = this.options, b = d.x || 0, e = d.y,
                    h = q(c.top + c.height + e, a.plotTop, a.plotTop + a.plotHeight), k = {};
                a.styledMode || (k = {
                    cursor: d.cursor,
                    stroke: d.lineColor, "stroke-width": d.lineWidth, dashstyle: d.lineDashStyle
                });
                this.lastPos = h - e;
                this.controlLine || (this.controlLine = a.renderer.path().addClass("highcharts-axis-resizer"));
                this.controlLine.add(c.axisGroup);
                d = a.styledMode ? this.controlLine.strokeWidth() : d.lineWidth;
                k.d = a.renderer.crispLine([["M", c.left + b, h], ["L", c.left + c.width + b, h]], d);
                this.controlLine.attr(k)
            };
            a.prototype.addMouseEvents = function () {
                var c = this, a = c.controlLine.element, d = c.axis.chart.container, b = [], n, h, k;
                c.mouseMoveHandler = n =
                    function (a) {
                        c.onMouseMove(a)
                    };
                c.mouseUpHandler = h = function (a) {
                    c.onMouseUp(a)
                };
                c.mouseDownHandler = k = function (a) {
                    c.onMouseDown(a)
                };
                b.push(e(d, "mousemove", n), e(d.ownerDocument, "mouseup", h), e(a, "mousedown", k));
                A && b.push(e(d, "touchmove", n), e(d.ownerDocument, "touchend", h), e(a, "touchstart", k));
                c.eventsToUnbind = b
            };
            a.prototype.onMouseMove = function (a) {
                a.touches && 0 === a.touches[0].pageX || !this.grabbed || (this.hasDragged = !0, this.updateAxes(this.axis.chart.pointer.normalize(a).chartY - this.options.y))
            };
            a.prototype.onMouseUp =
                function (a) {
                    this.hasDragged && this.updateAxes(this.axis.chart.pointer.normalize(a).chartY - this.options.y);
                    this.grabbed = this.hasDragged = this.axis.chart.activeResizer = null
                };
            a.prototype.onMouseDown = function (a) {
                this.axis.chart.pointer.reset(!1, 0);
                this.grabbed = this.axis.chart.activeResizer = !0
            };
            a.prototype.updateAxes = function (a) {
                var c = this, d = c.axis.chart, b = c.options.controlledAxis,
                    e = 0 === b.next.length ? [d.yAxis.indexOf(c.axis) + 1] : b.next;
                b = [c.axis].concat(b.prev);
                var n = [], k = !1, t = d.plotTop, p = d.plotHeight, l =
                    t + p;
                a = q(a, t, l);
                var u = a - c.lastPos;
                1 > u * u || ([b, e].forEach(function (b, e) {
                    b.forEach(function (b, g) {
                        var f = (b = m(b) ? d.yAxis[b] : e || g ? d.get(b) : b) && b.options;
                        if (f && "navigator-y-axis" !== f.id) {
                            g = b.top;
                            var h = Math.round(v(f.minLength, p));
                            var r = Math.round(v(f.maxLength, p));
                            e ? (u = a - c.lastPos, f = Math.round(q(b.len - u, h, r)), g = b.top + u, g + f > l && (r = l - f - g, a += r, g += r), g < t && (g = t, g + f > l && (f = p)), f === h && (k = !0), n.push({
                                axis: b,
                                options: {top: 100 * (g - t) / p + "%", height: 100 * f / p + "%"}
                            })) : (f = Math.round(q(a - g, h, r)), f === r && (k = !0), a = g + f, n.push({
                                axis: b,
                                options: {height: 100 * f / p + "%"}
                            }))
                        }
                    })
                }), k || (n.forEach(function (a) {
                    a.axis.update(a.options, !1)
                }), d.redraw(!1)))
            };
            a.prototype.destroy = function () {
                var a = this;
                delete a.axis.resizer;
                this.eventsToUnbind && this.eventsToUnbind.forEach(function (a) {
                    a()
                });
                a.controlLine.destroy();
                z(a, function (b, c) {
                    a[c] = null
                })
            };
            a.resizerOptions = {
                minLength: "10%",
                maxLength: "100%",
                resize: {
                    controlledAxis: {next: [], prev: []},
                    enabled: !1,
                    cursor: "ns-resize",
                    lineColor: "#cccccc",
                    lineDashStyle: "Solid",
                    lineWidth: 4,
                    x: 0,
                    y: 0
                }
            };
            return a
        }();
        l.keepProps.push("resizer");
        e(l, "afterRender", function () {
            var b = this.resizer, c = this.options.resize;
            c && (c = !1 !== c.enabled, b ? c ? b.init(this, !0) : b.destroy() : c && (this.resizer = new a.AxisResizer(this)))
        });
        e(l, "destroy", function (a) {
            !a.keepEvents && this.resizer && this.resizer.destroy()
        });
        b(w.prototype, "runPointActions", function (a) {
            this.chart.activeResizer || a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        b(w.prototype, "drag", function (a) {
            this.chart.activeResizer || a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        y(!0, l.defaultYAxisOptions,
            x.resizerOptions);
        a.AxisResizer = x;
        return a.AxisResizer
    });
    m(a, "masters/modules/drag-panes.src.js", [], function () {
    })
});
//# sourceMappingURL=drag-panes.js.map