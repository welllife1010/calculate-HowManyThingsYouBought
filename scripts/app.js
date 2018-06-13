// MVC - model(數據生成, 數據結構模型), view(顯示), controller(數據傳遞媒介)
//API
var model = (function(){

	var item = function(id, name, value){
		this.id = id;
		this.name = name;
		this.value = value;
	};

	// allItems = [];
	// totals = 0;

	var data = {
		allItems: [],
		total: 0
	};

	return {
		addItem: function(name, value) { //create a newItem object and send/save to controller addItem mathod's newItem variable
			
			var ID;

			// [1,2,3,4,5]  next 6 ID = array.length + 1
			// [1,2,4,5,6]  next 7 ID = last_element.id + 1 

			if(data.allItems.length > 0){
				ID = data.allItems[data.allItems.length - 1].id + 1;
			} else {
				ID = 0;
			}
			
			var newItem = new item(ID, name, value);

			data.allItems.push(newItem);

			return newItem;
		},

		test: function(){
			console.log(data);
		}
	}

})();

var view = (function(){
	
	var DOMstrings = {
		name: '.name',
		value: '.value',
		btn: '.bought_btn',
		list: '.bought_list'
	};

	return {
		getInfo: function(){
			return {
				name: document.querySelector(DOMstrings.name).value,
				value: parseFloat(document.querySelector(DOMstrings.value).value)
			};
		},

		addListItem: function(object){
			var newHTML;
			var element = DOMstrings.list;
			var html = '<div class="item clearfix" id="%id%"><div class="item_name">%name%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="delete"><button class="delete_btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			newHTML = html.replace('%id%', object.id);
			newHTML = newHTML.replace('%name%', object.name);
			newHTML = newHTML.replace('%value%', object.value);
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},

		clearInput: function(){
			var inputs = document.querySelectorAll(DOMstrings.name + ',' + DOMstrings.value);
			// console.log(inputs);
			var inputArray = Array.prototype.slice.call(inputs);
			// console.log(inputArray);
			inputArray.forEach(function(currentVal){
				currentVal.value = '';
			});
			inputArray[0].focus();
		},

		getDOMstrings: function(){
			return DOMstrings;
		}
	};

})();

var controller = (function(m, v){
	
	var setupEventListener = function(){
		var DOMstrings = view.getDOMstrings();
		document.querySelector(DOMstrings.btn).addEventListener('click', addItem);
		document.addEventListener('keypress', function(event){
			if(event.keycode === 13 || event.which === 13){
				addItem();
			}
		});
	};

	var addItem = function(){
		var input = view.getInfo();
		// console.log(input);
		if(input.name !== '' && !isNaN(input.value) && input.value > 0){
			var newItem = model.addItem(input.name, input.value); 
			view.addListItem(newItem);
			view.clearInput();
		}
	};

	return {
		init: function(){
			console.log('App started.');
			setupEventListener();
		}
	}

})(model, view);


controller.init();



