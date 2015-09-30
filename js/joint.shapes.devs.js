/*! JointJS v0.9.3 - JavaScript diagramming library  2015-02-03 


This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/*if (typeof exports === 'object') {

    var joint = {
        util: require('../src/core').util,
        shapes: {
            basic: require('./joint.shapes.basic')
        },
        dia: {
            ElementView: require('../src/joint.dia.element').ElementView,
            Link: require('../src/joint.dia.link').Link
        }
    };
    var _ = require('lodash');
}else if(typeof define === 'function' && define.amd){
      

}*/

    joint.shapes.devs = {};

    joint.shapes.devs.Model = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

        markup: ['<g class="rotatable">',
            '<g class="scalable">',
            '<rect class="body"/>',
            '<circle class="svg_delete" r="7"/>',
            '<path class="svg_delete_icon" transform="scale(.5) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
            '<rect class="version_area"><title>版本号</title></rect>',
            '<rect class="sub sub_title1"><title>image的端口</title></rect>',
            '<rect class="sub sub_title2"><title>image的重启方式</title></rect>',
            '<image/></g>',
            '<text class="label"/><text class="version_label" />',
            '<text class="sub_label1"/><text class="sub_label2"/>',
            '<g class="inPorts"/><g class="outPorts"/></g>'
        ].join(),
        portMarkup: '<g class="port port<%= id %>"><path class="port-body" content-tooltip="\'连接到不同类别的image或者template\'"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'devs.Model',
            size: {
                width: 1,
                height: 1
            },

            inPorts: [],
            outPorts: [],

            attrs: {
                '.': {
                    magnet: false
                },
                '.body': {
                    width: 150,
                    height: 150,
                    rx: 3,
                    stroke: '#000000',

                },
                '.svg_delete':{
                    stroke:'#000000',
                    cursor:'pointer',
                    ref: '.body',
                    'ref-x': 168,
                    'ref-y': 0

                },
                '.svg_delete_icon':{
                    stroke:'#000000',
                    cursor:'pointer',
                    ref: '.body',
                    'ref-x': 159,
                    'ref-y': -10

                },
                image: {
                    width: 30,
                    height: 30,
                    ref: '.body',
                    'ref-x': 5,
                    'ref-y': 5,
                    fill: 'transparent'
                },
                '.version_area': {
                    width: 100,
                    height: 20,
                    'ref-x': 20,
                    'ref-y': 50,
                    ref: '.body',
                    fill: 'transparent'
                },
                '.sub': {
                    width: 100,
                    height: 30,
                    rx: 2,
                    stroke: 'grey'
                },
                '.sub_title1': {

                    'ref-x': 0,
                    'ref-y': 20,
                    ref: '.version_area',

                },
                '.sub_title2': {

                    'ref-x': 0,
                    'ref-y': 70,
                    ref: '.version_area',

                },
                '.inPorts .port-body': {
                    //r: 4,
                    d: 'M-10 0L-4 -5.5L-2 -5.5L-2 5.5L-4 5.5Z',

                    magnet: true,
                    stroke: '#000000'

                },
                '.outPorts .port-body': {
                    //r: 4,
                    //d:'M78 35.5L72 30L70 30L70 41L72 41Z' ,
                    d: 'M10 0L4 -5.5L2 -5.5L2 5.5L4 5.5Z',
                    magnet: true,
                    stroke: '#000000'
                },
                text: {
                    'pointer-events': 'none',
                    'font-family': 'Courier New',
                    'font-size': 16,
                    'font-weight': 700
                },
                '.label': {
                    text: 'Model',
                    'ref-dx': 10,
                    'ref-y': 10,
                    ref: 'image',
                    'text-anchor': 'start',
                    fill: '#000000'

                },
                '.version_label': {
                    text: 'latest',
                    'ref-x': 45,
                    'ref-y': 0,
                    ref: '.version_area',
                    'text-anchor': 'start',
                    fill: '#000000'

                },
                '.sub_label1': {
                    text: '...',
                    'ref-x': 10,
                    'ref-y': 10,
                    ref: '.sub_title1',
                    'text-anchor': 'start',
                    fill: '#000000'
                },
                '.sub_label2': {
                    text: '...',
                    'ref-x': 10,
                    'ref-y': 10,
                    ref: '.sub_title2',
                    'text-anchor': 'start',
                    fill: '#000000'
                },
                '.inPorts .port-label': {
                    x: -15,
                    dy: 4,
                    'text-anchor': 'end',
                    fill: '#000000',
                    'font-family': 'Courier New'

                },
                '.outPorts .port-label': {
                    x: 15,
                    dy: 4,
                    fill: '#000000',
                    'font-family': 'Courier New'
                }
            }

        }, joint.shapes.basic.Generic.prototype.defaults),

        getPortAttrs: function(portName, index, total, selector, type) {

            var attrs = {};

            var portClass = 'port' + index;
            var portSelector = selector + '>.' + portClass;
            var portLabelSelector = portSelector + '>.port-label';
            var portBodySelector = portSelector + '>.port-body';

            attrs[portLabelSelector] = {
                text: portName
            };
            attrs[portBodySelector] = {
                port: {
                    id: portName || _.uniqueId(type),
                    type: type
                }
            };
            attrs[portSelector] = {
                ref: '.body',
                'ref-y': (index + 0.5) * (1 / total)
            };

            if (selector === '.outPorts') {
                attrs[portSelector]['ref-dx'] = 0;
            }

            return attrs;
        }
    }));


    joint.shapes.devs.Atomic = joint.shapes.devs.Model.extend({

        defaults: joint.util.deepSupplement({

            type: 'devs.Atomic',
            size: {
                width: 80,
                height: 80
            },
            inPorts: ['ck_r'],

            attrs: {
                '.body': {
                    fill: 'salmon'
                },
                '.label': {
                    text: 'Check'
                },
                '.inPorts .port-body': {
                    fill: 'PaleGreen'
                },
                '.outPorts .port-body': {
                    fill: 'Tomato'
                }
            }

        }, joint.shapes.devs.Model.prototype.defaults)

    });

    joint.shapes.devs.Coupled = joint.shapes.devs.Model.extend({

        defaults: joint.util.deepSupplement({

            type: 'devs.Coupled',
            size: {
                width: 200,
                height: 300
            },
            inPorts: ['in'],
            outPorts: ['out'],

            attrs: {
                '.body': {
                    fill: 'transparent'
                },
                '.label': {
                    text: 'Process'
                },
                '.inPorts .port-body': {
                    fill: '#F2F8FF'
                },
                '.outPorts .port-body': {
                    fill: '<div id="#F2F8FF"></div>'
                }
            }

        }, joint.shapes.devs.Model.prototype.defaults)
    });

    joint.shapes.devs.Link = joint.dia.Link.extend({
        arrowheadMarkup: [
            '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
            '<path class="marker-arrowhead" end="<%= end %>" d="M 16 0 L 0 8 L 16 16 z" />',
            '</g>'
        ].join(''),
        vertexMarkup: undefined,
        defaults: {
            type: 'devs.Link',
            attrs: {
                '.connection': {
                    'stroke-width': 2,
                    stroke: 'grey'
                }
            }
        }
    });

    joint.shapes.devs.ModelView = joint.dia.ElementView.extend(joint.shapes.basic.PortsViewInterface);
    joint.shapes.devs.AtomicView = joint.shapes.devs.ModelView;
    joint.shapes.devs.CoupledView = joint.shapes.devs.ModelView;

    joint.dia.Link.prototype.vertexMarkup = undefined;
    joint.dia.Link.prototype.arrowheadMarkup =
        [
            '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
            '<path class="marker-arrowhead" end="<%= end %>" d="M 16 0 L 0 8 L 16 16 z" />',
            '</g>'
        ].join('');

    /*joint.dia.LinkView.prototype.renderArrowheadMarkers=function() {

         // Custom markups might not have arrowhead markers. Therefore, jump of this function immediately if that's the case.
         if (!this._V.markerArrowheads) return this;

         var $markerArrowheads = $(this._V.markerArrowheads.node);

         $markerArrowheads.empty();

         // A special markup can be given in the `properties.vertexMarkup` property. This might be handy
         // if default styling (elements) are not desired. This makes it possible to use any
         // SVG elements for .marker-vertex and .marker-vertex-remove tools.
         var markupTemplate = _.template(this.model.get('arrowheadMarkup') || this.model.arrowheadMarkup);

         //this._V.sourceArrowhead = V(markupTemplate({ end: 'source' }));
         this._V.targetArrowhead = V(markupTemplate({
             end: 'target'
         }));

         //$markerArrowheads.append(this._V.sourceArrowhead.node, this._V.targetArrowhead.node);
         $markerArrowheads.append(this._V.targetArrowhead.node);

         return this;
     };*/

