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
		totals: 0
	};

	var calculateTotal = function() {
		var sum = 0;
		data.allItems.forEach(function(currentVal){
			sum += currentVal.value;
		});
		data.totals = sum;
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
			return newItem; //object
		},

		deleteItem: function(id){ // the id attribute of the div that the user click to delete
			var ids = data.allItems.map(function(currentVal){ //create a new array of only data.allItems' ids (data.allItems.id) in it
				return currentVal.id;
			});
			var index = ids.indexOf(parseInt(id, 10)); //index number/position of id(itemID) in data.allItems which the users click to delete
			// console.log(index);
			if(index >= 0){ //make sure that the id attribute of the div exist in the data.allItems
				data.allItems.splice(index, 1);
			}			
			// console.log(ids);
		},

		calculateSum: function(){
			calculateTotal();
			return {
				sum: data.totals
			}
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
		list: '.bought_list',
		sumLabel: '.total_value',
		container: '.container'
	};

	var formatting = function(number){
		number = number.toFixed(2);
		number = number.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		return number;
	};

	return {
		getInfo: function(){
			return {
				name: document.querySelector(DOMstrings.name).value,
				value: parseFloat(document.querySelector(DOMstrings.value).value)
			};
		},

		addListItem: function(object){ //add the user input (newly created) object into html
			var newHTML;
			var element = DOMstrings.list;
			var html = '<div class="item clearfix" id="%id%"><div class="item_name">%name%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="delete"><button class="delete_btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			newHTML = html.replace('%id%', object.id);
			newHTML = newHTML.replace('%name%', object.name);
			newHTML = newHTML.replace('%value%', formatting(object.value) + '元');
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},

		deleteListItem: function(id){
			var element = document.getElementById(id);
			// console.log(element.parentNode);
			element.parentNode.removeChild(element);
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

		displaySum: function(object){
			document.querySelector(DOMstrings.sumLabel).textContent = formatting(object.sum) + '元';
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
		document.querySelector(DOMstrings.container).addEventListener('click', deleteItem);
	};

	var deleteItem = function(event){
		//event.target's return value - a reference to the object on which the element originally occured
		var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //get <div class="item clearfix" id="%id%">'s id value
		// console.log(typeof itemID); //string
		model.deleteItem(itemID);
		view.deleteListItem(itemID);
		updateTotal();
	};

	var updateTotal = function(){
		var sum = model.calculateSum(); // returns data.totals as an object
		// console.log(sum);
		view.displaySum(sum);
	};

	var addItem = function(){
		var input = view.getInfo();
		// console.log(input);
		if(input.name !== '' && !isNaN(input.value) && input.value > 0){
			var newItem = model.addItem(input.name, input.value); //create a new (item) object
			view.addListItem(newItem);
			view.clearInput();
			updateTotal();
		}
	};

	return {
		init: function(){
			console.log('App started.');
			view.displaySum({sum: 0});
			setupEventListener();
		}
	}

})(model, view);


controller.init();



