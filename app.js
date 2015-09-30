var myModule = angular.module('myModule', ['mydirective']);
myModule.controller('myController', function($scope, $timeout, $http, $compile) {
	var timer = $timeout(function() {
		$scope.showLoad = false;
	}, 2000);
	$scope.showLoad = true;
	$scope.$on('$destroy', function(e) {
		$timeout.cancel(timer);
	});
	var getJson = function(url, callback) {
			$http({
				method: 'get',
				//type: 'json',
				url: url,
			}).success(function(data) {
				var json = (typeof data == 'object') ? data : JSON.parse(data);
				callback(undefined, json);


			}).error(function(err, status, headers) {
				callback(err);
				return;
			});
		}
		/*$scope.options = [{
			title: 'Available Image1',
			images: [{
				name: 'test-image1',
				url: './img/process.png',
				show_params:['xx1'],
				params: [{
					name: 'xxx1',
					type: 'String',
					require: 1
				}, {
					name: 'xxx2',
					type: 'String'
				}]
			}, {
				name: 'test-image2',
				url: './img/process.png',
				params: [{
					name: 'xxx1',
					type: 'String',
					require: 1
				}, {
					name: 'xxx2',
					type: 'String'
				}]
			}, {
				name: 'test-image3',
				url: './img/process.png',
				params: [{
					name: 'xxx1',
					type: 'String',
					require: 1
				}, {
					name: 'xxx2',
					type: 'String'
				}]
			}]
		}, {
			title: 'web',
			images: [{
				name: 'test-image1',
				url: './img/process.png',
				description: 'xxx',
				params: [{
					name: 'xxx1',
					type: 'String',
					require: 1
				}, {
					name: 'xxx2',
					type: 'String'
				}]
			}, {
				name: 'wordpress2',
				url: './img/process.png',
				description: 'xxx',
				show_params:['restart'],
				params: [{
					name: 'version',
					type: 'String'
				}, {
					name: 'ports',
					//textarea:1,
					type: 'Array',
					value: []
				}, {
					name: 'environment',
					textarea: 1,
					type: 'Object',
					value: []
				}, {
					name: 'restart',
					type: 'String'
				}, {
					name: 'labels',
					//textarea:1,
					type: 'Object',
					value: []

				}]
			}, {
				name: 'wordpress3',
				url: './img/process.png',
				description: 'xxx',
				show_params:['restart'],
				params: [{
					name: 'version',
					type: 'String'
				}, {
					name: 'ports',
					//textarea:1,
					type: 'Array',
					value: []
				}, {
					name: 'environment',
					textarea: 1,
					type: 'Array',
					value: []
				}, {
					name: 'restart',
					type: 'String'
				}, {
					name: 'labels',
					//textarea:1,
					type: 'Object',
					value: []

				}]
			}]
		}, {
			title: 'db',
			images: [{
				name: 'mysql',
				url: './img/process.png',
				params: [{
					name: 'environment',
					//textarea:1,
					type: 'Object',
					value: []
				}, {
					name: 'restart',
					type: 'String'
				}, {
					name: 'labels',
					//textarea:1,
					type: 'Object',
					value: []
				}]
			}, {
				name: 'nosql',
				url: './img/process.png',
				params: [{
					name: 'environment',
					//textarea:1,
					type: 'Object',
					value: []
				}, {
					name: 'restart',
					type: 'String'
				}, {
					name: 'labels',
					//textarea:1,
					type: 'Object',
					value: []
				}]
			}, {
				name: 'Redis',
				url: './img/process.png',
				params: [{
					name: 'environment',
					//textarea:1,
					type: 'Object',
					value: []
				}, {
					name: 'restart',
					type: 'String'
				}, {
					name: 'labels',
					//textarea:1,
					type: 'Object',
					value: []
				}]
			}]
		}]*/
	$scope.options = [];
	getJson('./test.json', function(err, json) {
		if (err) {
			throw new Error(err);
		}
		console.log(json);
		if (!(json instanceof Array)) json = [json];
		$scope.options = json;
		//$scope.$apply();


	});

	var all_json = [];
	var graph = new joint.dia.Graph;

	var paper = new joint.dia.Paper({
		el: $('.canvas-view'),
		width: '100%',
		height: '100%',
		gridSize: 1,
		model: graph,
		//defaultLink:joint.shapes.devs.Link,
		snapLinks: true,
		embeddingMode: true,
		validateEmbedding: function(childView, parentView) {
			return parentView.model instanceof joint.shapes.devs.Coupled;
		},
		validateConnection: function(sourceView, sourceMagnet, targetView, targetMagnet) {
			return sourceMagnet != targetMagnet;
		}
	});
	var connect = function(source, sourcePort, target, targetPort) {
		var link = new joint.shapes.devs.Link({
			source: {
				id: source.id,
				selector: source.getPortSelector(sourcePort)
			},
			target: {
				id: target.id,
				selector: target.getPortSelector(targetPort)
			}
		});
		link.addTo(graph).reparent();
	};
	var process = function(x, y, action, version, image, inPorts, outPorts) {

		var cell = new joint.shapes.devs.Coupled({
			position: {
				x: x,
				y: y
			},
			size: {
				width: 200,
				height: 200
			},
			inPorts: inPorts instanceof Array ? inPorts : undefined,
			outPorts: outPorts instanceof Array ? outPorts : undefined,
			attrs: {
				'.label': {
					text: action
				},
				image: {
					'xlink:href': './img/' + image,

				},
				'.version_label': {
					text: version ? version : 'latest'
				}
			}
		});
		//cell.translate(20, 20);
		//cell.attr('.body/filter', { name: 'dropShadow', args: { dx: 2, dy: 2, blur: 3,color:'grey' } });
		graph.addCell(cell);
		return cell;
	}
	var createStandardProcess = function(x, y, action, version, click_func) {
		var p = process(x, y, action, version, 'docker.jpg');

		return p;
	}
	var removeStandardProcess = function(_id) {
		var cell = graph.getCell(_id);
		cell.remove();
	}
	var existId = function(id, obj_array) {
		for (var i = 0; i < obj_array.length; i++) {
			if (obj_array[i].id == id) {
				return i;
			}
		}
		return;
	}


	//var process_1 = createStandardProcess(600, 300, 'createInstance');
	//var process_2 = createStandardProcess(200, 500, 'createRds');
	//var process_3 = createStandardProcess(500, 300, 'ceateSlb');
	var last_Svg = 0;
	//$scope.version_array = [];
	$scope.$on('addNewSvg', function(e, x, y, title_id, index) {
		console.log('image项' + title_id + '<-->' + index + '被添加到位置:(' + x + ',' + y + ')');
		var category = $scope.options[title_id].title;
		var title = $scope.options[title_id].images[index].name;
		$scope.node_version = 'latest';
		var new_cell = createStandardProcess(x - 100, y - 100, title.toUpperCase() + ' Node');

		//$compile()($scope);
		$compile(angular.element("g[model-id='" + new_cell.id + "']").contents())($scope);
		$scope.$apply();

		$("g[model-id='" + new_cell.id + "']").on('mousedown', function(e) {
			//console.log(e);
			var oldX = e.offsetX;
			var oldY = e.offsetY;
			$(this).on('mouseup', function() {
				if ((e.offsetY == oldY) && (e.offsetX == oldX)) {
					$scope.$emit('changeConfigSvg_' + last_Svg);
					last_Svg = (last_Svg + 1) % 10;

					var list_id = existId(new_cell.id, all_json);
					//current_SVG_count=list_id;
					if (!isNaN(list_id)) {
						$scope.list_title = all_json[list_id].name;
						$scope.list = all_json[list_id].params;
					} else {

						var temp = $scope.options[title_id].images[index].params;
						var array = [];
						for (var x = 0; x < temp.length; x++) {
							var _obj = {};
							for (var h in temp[x]) {
								if (temp[x].hasOwnProperty(h)) {
									_obj[h] = temp[x][h];
								}
							}
							array.push(_obj);
						}
						$scope.list_title = title;
						$scope.list = array;
						all_json.push({
							id: new_cell.id,
							category: category,
							name: title,
							params: $scope.list
						});
					}

					var my_watch = $scope.$watch('list', function(_new, _old) {
						for (var i = 0; i < _new.length; i++) {
							if (_new[i].name == 'version') {
								var pos = i;
								//break;
							} else if (_new[i].name == 'ports') {
								var pos_1 = i;
							} else if (_new[i].name == 'restart') {
								var pos_2 = i;
							}
						}
						if (typeof pos != 'undefined') {
							if (_new[pos].value != _old[pos].value) {
								var value = _new[pos].value == '' ? 'latest' : _new[pos].value
								$("g[model-id='" + new_cell.id + "'] .version_label").text(value);
								//$scope.version_array.push(_new[pos].value==''?'latest':_new[pos].value);
							}
						}
						if (typeof pos_1 != 'undefined') {
							if (_new[pos_1].value != _old[pos_1].value) {
								var value_1 = 'port：';
								if (_new[pos_1].value instanceof Array) {

									for (var i = 0; i < _new[pos_1].value.length; i++) {
										value_1 += (_new[pos_1].value[i].value + ' ');
										value_1 += '...';
										break;
									}
									if (_new[pos_1].value.length == 0) {
										value_1 += '80';
									}
								} else {
									value_1 += _new[pos_1].value;
								}
								//var value_1=(_new[pos_1].value instanceof Array?_new[pos_1].value.join(','):_new[pos_1].value);			
								$("g[model-id='" + new_cell.id + "'] .sub_label1").text(value_1);
								//$scope.version_array.push(_new[pos].value==''?'latest':_new[pos].value);
							}
						}
						if (typeof pos_2 != 'undefined') {
							var value_2 = 'restart：';
							if (_new[pos_2].value != _old[pos_2].value) {
								value_2 += (_new[pos_2].value == '' ? 'default' : _new[pos_2].value);
								$("g[model-id='" + new_cell.id + "'] .sub_label2").text(value_2);
								//$scope.version_array.push(_new[pos].value==''?'latest':_new[pos].value);
							}
						}
					}, true);
					$scope.$on('changeConfigSvg_' + last_Svg, function() {
						my_watch();
					});
					//});
					$scope.$apply();
					console.log(all_json);


				}

			});
		});
		$("g[model-id='" + new_cell.id + "'] .svg_delete_icon").on('mousedown', function(e) {
			e.stopPropagation();
			console.log('delete');
			var list_id = existId(new_cell.id, all_json);
			if (!isNaN(list_id)) {
				all_json.splice(list_id, 1);

			}


			removeStandardProcess(new_cell.id);
		});


	});

	var item = function() {
		var id;
		var afters = [];
		this.setId = function(_id) {
			id = _id;
		}
		this.getId = function() {
			return id;
		}
		this.removeChild = function(_id) {
			for (var i = 0; i < afters.length; i++) {
				if (afters[i].getId() == _id) {
					afters.splice(i, 1);
					return true;
				}
			}
			return false;
		}
		this.chain = function(_item) {
			if (_item instanceof item) {
				afters.push(_item);
			} else if ((_item instanceof Array) || (_item[0] instanceof item)) {
				afters = afters.concat(_item);
			}
		}
		this.getAfters = function() {
			return afters;
		}
	}
	$scope.tree = function() {
		console.log(graph.toJSON());
	}
	var validateCoupled = function(id, graph_obj) {
		for (var x = 0; x < graph_obj.cells.length; x++) {
			var cell = graph_obj.cells[x];
			if ((cell.type == 'devs.Coupled') && (cell.id == id)) {
				return true;
			}
		}
		return false;
	}
	var graphToTree = function() {
		var graph_obj = graph.toJSON();
		var item_root = new item();
		item_root.setId('pre_root');
		var item_array = [];

		for (var x = 0; x < graph_obj.cells.length; x++) {
			var cell = graph_obj.cells[x];
			if (cell.type == 'devs.Link' || cell.type == 'link') { //link对象
				var source = cell.source;
				var target = cell.target;

				if (validateCoupled(source.id, graph_obj) && validateCoupled(target.id, graph_obj)) {
					//var source_item = cellIdExist(source.id, item_array);
					//var target_item = cellIdExist(target.id, item_array);
					var source_item = undefined,
						target_item = undefined;
					for (var k = 0; k < item_array.length; k++) {
						if (item_array[k].getId() == source.id) {
							source_item = item_array[k];
						} else if (item_array[k].getId() == target.id) {
							target_item = item_array[k];
						}
					}


					if (!source_item && !target_item) { //头尾节点均未构建
						var father = new item();
						var child = new item();
						if (source.port == 'out') {
							father.setId(source.id);
							child.setId(target.id);
							father.chain(child);
						} else if (source.port == 'in') {
							father.setId(target.id);
							child.setId(source.id);
							father.chain(child);
						}
						item_array.push(father);
						item_array.push(child);

						item_root.chain(father);
					} else if (source_item && !target_item) {
						if (source.port == 'out') {
							var child = new item();
							child.setId(target.id);
							source_item.chain(child);
							item_array.push(child);
						} else if (source.port == 'in') {
							var father = new item();


							father.setId(target.id);
							father.chain(source_item);
							item_array.push(father);
							if (item_root.removeChild(source_item.getId())) { //source记录在root_item中
								item_root.chain(father);
							}
						}
					} else if (!source_item && target_item) {
						if (target.port == 'out') {
							var child = new item();
							child.setId(source.id);
							target_item.chain(child);
							item_array.push(child);
						} else if (target.port == 'in') {
							var father = new item();
							father.setId(source.id);
							father.chain(target_item);
							item_array.push(father);
							if (item_root.removeChild(target_item.getId())) {
								item_root.chain(father);
							}
						}



					} else {
						if (source.port == 'out') {
							source_item.chain(target_item);
							/*if (target_item.getId() == item_root.getId()) {
							    item_root = source_item;
							}*/
							if (item_root.removeChild(target_item.getId())) { //source记录在root_item中
								item_root.removeChild(source_item.getId());
								item_root.chain(source_item);
							}
						} else if (source.port == 'in') {
							target_item.chain(source_item);
							/*if (source_item.getId() == item_root.getId()) {
							    item_root = target_item;
							}*/
							if (item_root.removeChild(target_item.getId())) { //source记录在root_item中
								item_root.removeChild(source_item.getId());
								item_root.chain(source_item);
							}

						}
					}
				}
			}
		}
		console.log(item_array);
		return item_root;
	}
	$scope.addSvgHeight = function(e) {
		//var target=e.target;
		var target = $('.canvas-view');
		var old = target.height();
		target.css('height', old + 200);
		target = null;
	}
	$scope.delSvgHeight = function(e) {
		var target = $('.canvas-view');
		var old = target.height();
		target.css('height', old - 200);
		target = null;
	}
	$scope.addSvgWidth = function(e) {
		var target = $('.canvas-view');
		var old = target.width();
		target.css('width', old + 200);
		target = null;
	}
	$scope.delSvgWidth = function(e) {
		var target = $('.canvas-view');
		var old = target.width();
		target.css('width', old - 200);
		target = null;
	}
	$scope.addInput = function() {
		$scope.list.push({
			editable: 1,
			type: 'String'

		});
	}
	$scope.addTextarea = function() {
		$scope.list.push({
			editable: 1,
			textarea: 1,
			type: 'String'

		});
	}
	$scope.addProperty = function(e, index) {
		e.stopPropagation();
		var temp = $scope.list[index].value;
		temp ? temp = temp : temp = [];
		temp.push({
			name: '',
			value: ''
		});
	}
	$scope.formate_json = {};
	var create_json = function() {
		var root = graphToTree();

		accessTree(root, undefined, function(id, father_id) {

			for (var x = 0; x < all_json.length; x++) {
				if (id == all_json[x].id) {
					var child = all_json[x];
				}
				if (father_id == all_json[x].id) {
					var father = all_json[x];
				}
			}
			if (child) {
				var _obj = {};

				var temp = child.params;
				for (var i = 0; i < temp.length; i++) {
					if (temp[i].type == 'String') {

						var temp_name = temp[i].name;
						if (temp_name != 'version') {
							_obj[temp_name] = temp[i].value;
						} else {
							var version = temp[i].value;
						}

					} else if (temp[i].type == 'Array') {
						var temp_name = temp[i].name;
						var temp_array = [];
						for (var x = 0; x < temp[i].value.length; x++) {
							var single_value = temp[i].value[x].value;
							if (single_value !== '') {
								temp_array.push(single_value);
							}
						}
						_obj[temp_name] = temp_array;

					} else if (temp[i].type == 'Object') {
						var temp_obj = {};
						var temp_name = temp[i].name;
						for (var y = 0; y < temp[i].value.length; y++) {
							var single_key = temp[i].value[y].name;
							var single_value = temp[i].value[y].value;
							if ((single_key !== '') && (single_value !== '')) {
								temp_obj[single_key] = single_value;
							}
						}
						_obj[temp_name] = temp_obj;

					}

				}
				_obj.image = child.name + (version ? ':' + version : '');
				//father ? father.links= child.category+':'+child.name : 1 + 1;
				if (father) {
					var father_obj = $scope.formate_json[father.category];
					father_obj.links ? 1 + 1 : father_obj.links = [];
					father_obj.links.push(child.category + ':' + child.name);
				}
				$scope.formate_json[child.category] = _obj;
			}
		});
	}
	$scope.preview_json = function() {
			create_json();
			$scope.showJson = true;
			if ($scope.showJson == true) {
				$scope.formated_json_string = JSON.stringify($scope.formate_json, null, 4);
			}

		}
		/*$scope.preview_yaml=function(){
			"use strict";
			var YAML = window.YAML;
			create_json();
			$scope.showJson=true;
			if($scope.showJson == true){
				$scope.formated_json_string = YAML.stringify($scope.formate_json);
			}
		}*/

	function accessTree(node, father_id, callback) {
		//var item = [];
		var id = node.getId();
		callback(id, father_id);
		var array = node.getAfters();
		for (var x = 0; x < array.length; x++) {
			accessTree(array[x], id, callback);

		}
	}
});