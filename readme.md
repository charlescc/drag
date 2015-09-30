# drag for yaml
这个demo是通过拖拽来SVG来生成对应的json，再由json转为yaml,现在做到的情况是生成json。
## 引用的框架
主要是用到jointjs来绘制SVG，以及jsyaml来将json转yaml.
## 实现的思路
### 绘制SVG的思路
通过左侧sidebar的拖拽，获取mousedown--》mousemove--》mouseup这个动作最后落在SVG画布上的坐标，在用调用jointjs进行绘制SVG元素，而jointjs除了提供绘制基础的元素之外，本demo通过复写joint的对象的属性来定制SVG元素的样子，主要在./js/joint.shapes.devs.js里：

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
由于定制的SVG元素的布局不是类似HTML元素的流式布局，而是通过指定参考元素，以及相对参考元素的偏移坐标来布局，比较麻烦。    
### SVG导出生成json
绘制完SVG，并且用户通过连线完成拖拽后，调用`graph.toJSON()`来导出当前SVG中的所有元素，详情可参考[jointjs](http://www.jointjs.com/)。
由于`graph.toJSON()`导出的结果是数组，通过`app.js`中的`function graphToTree()`来完成解析，并构建成相应的树状数据结构。
再通过`app.js`中的`function create_json()`来先序遍历树结构，生成json。
### json转为yaml（未完成）
利用引入的jsyaml模块的`jsyaml.safeDump()`来将上一步生成的json转为yaml即可。