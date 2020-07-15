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

	// we create a function that calculate the sum of the input data(value) and also input the data dependingif it is inc or exp
	var calculateTotal = function (type) {
		var sum = 0;
		data.allItems[type].forEach(function (cur) {
			sum += cur.value; //cur = income || expense
		});
		data.total[type] = sum; // store the income or expenses to the data.total object

		/* 
			0 
			[100, 200, 300]
			sum = 0 + 100
			sum = 100 + 200
			sum = 300 + 300
			sum = 600
		*/
	};

	// var allExpenses = [];
	// var allIncomes = [];
	// allExpenses: [];
	// llIncomes: [];

	var data = {
		allItems: {
			exp: [], // type
			inc: [], // type
		},
		total: {
			exp: 0, // type
			inc: 0, // type
		},
		budget: 0, // the the function (inc - exp) will be stored here because we called it in the public
		percentage: -1, // usually a value that we use to say that something is not existed because the income and the expenses are set to zero
	};

	return {
		addItem: function (type, des, val) {
			var newItem, ID;

			// [1 2 3 4 5 ], next ID = 6
			// [1 2 4 6 8 ], next ID = 9
			// ID = lastID + 1
			if (data.allItems[type].length > 0) {
				// Create new ID
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
				// we only need the new id / last id + 1
			} else {
				ID = 0;
			}
			// Create new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val); // new variable that will substiture
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val); // new variable that will substiture
			}

			// Push it into our data structure
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		},
		deleteItem: function (type, id) {
			var ids, index;
			// id = 6
			// data.allItem[type][id];
			// ids = [1 2 4 6 8]
			// index = 3
			// map returns a brand new array
			ids = data.allItems[type].map(function (current) {
				return current.id;
			});

			index = ids.indexOf(id);
			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},
		calculateBudget: function () {
			// calculate total income and expeses
			calculateTotal('exp');
			calculateTotal('inc');
			// calculate the budget: income - expenses
			data.budget = data.total.inc - data.total.exp;

			// calculate the percentage of income that we spent

			if (data.total.inc > 0) {
				data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
			} else {
				data.percentage = -1;
			}

			/* example: expenses = 100 and income 200, spent 50% = 100/200 = .5 * 100 */
		},
		getBudget: function () {
			return {
				budget: data.budget,
				totalInc: data.total.inc,
				totalExp: data.total.exp,
				percentage: data.percentage,
			};
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
		//html
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		//budget controller
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		//delete button
		container: '.container',
	};

	// THIS WILL GO TO THE PUBLIC
	return {
		// All the input that the user input;
		getInput: function () {
			return {
				type: document.querySelector(DOMstrings.inputType).value, // +-
				description: document.querySelector(DOMstrings.inputDescription).value, //desciption
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value), // parseFloat - convert string into a number
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
					'<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;

				html =
					'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},
		// clear the fields after submitting
		clearFields: function () {
			var fields, fieldArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

			fieldArr = Array.prototype.slice.call(fields);

			fieldArr.forEach(function (current, index, array) {
				current.value = '';
			});

			fieldArr[0].focus();
		},

		displayBudget: function (obj) {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
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

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	};

	var updateBudget = function () {
		// 5. Calcualte the budget
		budgetCtrl.calculateBudget();
		// 6. return the budget
		var budget = budgetCtrl.getBudget();
		// 7. Display the budget  into the UI
		UICtrl.displayBudget(budget);
	};

	// Main functions;
	var ctrlAddItem = function () {
		var input, newItem;

		// 1. Get the field input data
		input = UICtrl.getInput();

		//it will be true if it is the number and vice versa
		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			// 4. Clear the fields
			UICtrl.clearFields();

			// 5. Calculate and update the budget into the UI
			updateBudget();
		} else {
			alert('Provide all the details');
		}
	};

	var ctrlDeleteItem = function (e) {
		var itemID, splitID, type, ID;
		itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
		//it will get the id

		console.log(itemID);

		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// 1) delete the item to the data structure

			budgetCtrl.deleteItem(type, ID);

			// 2) delte the item to the user interface;
			// 3) update and show the new budget
		}
	};

	return {
		init: function () {
			console.log('God is great!'); // testing
			setupEventListeners(); // call the setup even listener

			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1,
			});
		},
	};
})(budgetController, UIController);

controller.init();
