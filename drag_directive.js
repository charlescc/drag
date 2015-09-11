var app = angular.module('mydirective', []);
app.directive('contentTooltip', ['$compile', function($compile) {
	return {
		restrict: 'A',
		//replace:true,
		//replace:false,
		scope: {
			content: '=contentTooltip'
		},
		//template:'<div class="tooltip" ng-show="tooltip_show">{{content}}</div>',
		link: function(scope, element, attrs) {
			//console.log(element);
			//element.append('<div class="tooltip" ng-show="tooltip_show">{{content}}</div>');
			//$compile(element.contents())(scope);
			//scope.tooltip_show=false;

			element.on('mouseenter', function(e) {
				//e.stopPropagation();
				//console.log(e);
				var pageX = e.pageX;
				var pageY = e.pageY;
				var offsetX = $(this).context.localName != 'path' ? e.offsetX : 0;
				var offsetY = $(this).context.localName != 'path' ? e.offsetY : 0;
				var targetX = pageX - offsetX+8;
				//if(e.target == e.currentTarget){ 
				   var targetY = pageY - offsetY + $(e.target).height() + 8;
			    //}else{
			    	//var targetY = pageY - offsetY + $(this).height() + 8;
			   // }

				$('body').append('<div class="tooltip">' + scope.content + '</div>');
				$('.tooltip').css({
					'left': targetX,
					'top': targetY
				});
				//scope.tooltip_show=true;
				//scope.$apply();



			});
			element.on('mouseout', function(e) {
				//e.stopPropagation();
				console.log(e);
				//scope.tooltip_show=false;
				//scope.$apply();
				$('.tooltip').remove();
			});

		}

	}
}]);
app.directive('accordion',function(){
	return {
		restrict:'EA',
		replace:true,
		transclude:true,
		template:'<div ng-transclude></div>',
		controller:function(){
			var expanders=[];
			this.addExpander = function(expander) {
				expanders.push(expander);
			}
			this.gotOpened = function(selectedExpander) {

				angular.forEach(expanders, function(expander) {
					if (selectedExpander != expander) {
						expander.showList = false;
					}
				});
			}
		}
	};
});
app.directive('imageexpander', function() {
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		templateUrl: 'image_template.html',
		require:'^?accordion',
		scope: {
			title: '=imageExpanderTitle',
			title_id: '=imageExpanderIndex',
			images: '=imageGroup'
				//output: '=outputObj'
		},
		link: function(scope, element, attrs,accordionController) {
			//$scope.myBackgound={backgound-image}
			console.log(scope.title);
			accordionController.addExpander(scope);
			scope.toggleList = function(e) {
				e.stopPropagation();
				accordionController.gotOpened(scope);
				scope.showList ? scope.showList = false : scope.showList = true;
			}
			scope.mousedown = function(e, index) {
				var flag = true;
				var drag = true;
				$('body').on('mousemove', function(e) {
					//console.log(e);
					flag = false;

				});
				$('.canvas-view').on('mouseup', function(e) {
					//console.log('draw');
					if ((drag == true) && (flag === false)) {
						$('body').unbind('mousemove');
						//console.log('draw1');
						var x = e.offsetX;
						var y = e.offsetY;
						drag = false;
						/*scope.output = {
							x: x,
							y: y,
							in_index:index
						};*/


						scope.$emit('addNewSvg', x, y, scope.title_id, index);


					}
				});
				$('#body').on('mouseup', function(e) {

					//console.log('unbind');
					if (flag === false) {
						$('body').unbind('mousemove');
					}
				});
			}


		}
	}
});
