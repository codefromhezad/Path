var Debug = new (function(is_active) {
	this.is_active = is_active || is_active === undefined ? true : false;
	this.initialized = false;
	
	this.$wrapperElement;
	this.$currentElement;

	this.debugCategory = null;

	this.timerStartDate;

	this.buildUI = function() {
		this.$wrapperElement = $('<ul id="__path_debug_div"></ul>');

		$('body').append(this.$wrapperElement);

		this.$wrapperElement.on('click', 'a.__path_debug_obj_more', function(e) {
			e.preventDefault();
			$(this).siblings('.__path_debug_object').toggle();
			return false;
		});

		this.initialized = true;
	}

	this.parseItem = function(what) {
		if( typeof what === "object" ) {
			what = '<a href="#" class="__path_debug_obj_more">[Object]</a>'+
					  '<pre class="__path_debug_object">' + JSON.stringify(what, undefined, 2) + '</pre>';
		}
		return what;
	}

	this.startTimer = function() {
		this.timerStartDate = Math.floor(Date.now() / 1000);
	}

	this.showProgress = function(currentValue, finalValue, addItemEveryNPercent) {
		if( addItemEveryNPercent === undefined ) {
			addItemEveryNPercent = 10;
		}
		var percent = (100 * (currentValue + 1) / finalValue);
		if( percent % addItemEveryNPercent == 0 ) {
			this.show(' > ' + percent + "%");
		}
	}

	this.stopTimer = function() {
		var finishTime = Math.floor(Date.now() / 1000);
		this.show('Process finished in '+(finishTime - this.timerStartDate)+' seconds');
	}

	this.addItem = function(content) {
		var itemCategoryClass = "";

		if( this.debugCategory ) {
			itemCategoryClass = "__path_has_category __path_category_" + this.debugCategory;
		}

		var $newItem = $('<li class="'+itemCategoryClass+'"></li>');
		
		content = this.parseItem(content);

		$newItem.html(content);

		this.$wrapperElement.append( $newItem );
	}

	this.as = function(debugCategory) {
		this.debugCategory = debugCategory;
		return this;
	}

	this.show = function() {
		if( ! this.is_active ) {
			return;
		}

		if( ! this.initialized ) {
			this.buildUI();
		}

		var finalElement = "";

		for(var i = 0; i < arguments.length; i++) {
			finalElement += this.parseItem(arguments[i])
		}

		this.addItem(finalElement);

		this.debugCategory = null;

		return this;
	}

})(DEBUG);