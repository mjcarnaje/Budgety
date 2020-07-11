//! BUDGET CONTROLLER

// Keeps track all the income and expenses;
var budgetController = (function () {
	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	// var allExpenses = [];
	// var allIncomes = [];

	var data = {
		allItems: {
			exp: [],
			inc: [],
		},
		total: {
			exp: [],
			inc: [],
		},
		// allExpenses: [];
		// llIncomes: [];
	};

	return {
		addItem: function (type, des, val) {
			var newItem, ID;

			// [1 2 3 4 5 ], next ID = 6
			// [1 2 4 6 8 ], next ID = 9
			// ID = lastID + 1
			if (data.allItems[type].length > 0) {
				// Create new ID
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // we only need the new id / last id + 1
			} else {
				ID = 0;
			}
			// Create new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			// Push it into our data structure
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		},
		testing: function () {
			console.log(data);
		},
	};
})();

//! UI CONTROLLER

var UIController = (function () {
	// Document.querySelector in a variable
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn',
		//new
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
	};

	// THIS WILL GO TO THE PUBLIC
	return {
		// All the input that the user input;
		getInput: function () {
			return {
				type: document.querySelector(DOMstrings.inputType).value, // +-
				description: document.querySelector(DOMstrings.inputDescription).value, //desciption
				value: document.querySelector(DOMstrings.inputValue).value, // value
			};
		},

		// edit the html update the UI
		//obj = newItem = addItem
		addListItem: function (obj, type) {
			var html, newHtml, element;
			// Ctreate HTML with placeholder text;

			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html =
					'<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;

				html =
					'<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		clearFields: function () {
			var fields, fieldArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

			fieldArr = Array.prototype.slice.call(fields);

			fieldArr.forEach(function (current, index, array) {
				current.value = '';
			});

			fieldArr[0].focus();
		},

		getDOMStrings: function () {
			return DOMstrings;
		},
	};
})();

//! GLOBAL APP CONTROLLER
//* tell the other modules what to do;

var controller = (function (budgetCtrl, UICtrl) {
	// Event Listener; and also it needs to be call public so that it will wo
	var setupEventListeners = function () {
		// We get the object/variables from IU controller
		var DOM = UICtrl.getDOMStrings();
		//when button is CLICKED && when ENTER is pressed call the function
		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});
	};

	// Main functions;
	var ctrlAddItem = function () {
		var input, newItem;

		// 1. Get the field input data
		input = UICtrl.getInput();

		// 2. Add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// 3. Add the item to the UI
		UICtrl.addListItem(newItem, input.type);

		// 4. Clear the fields
		UICtrl.clearFields();
		budgetCtrl.testing();

		// 4. Calcualte the budget
		// 5. Display the budget  into the UI
	};
	return {
		init: function () {
			console.log('God is great!');
			setupEventListeners(); // call the setup even listener
		},
	};
})(budgetController, UIController);

controller.init();
