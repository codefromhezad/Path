var Debug = new (function(is_active) {
	this.is_active = is_active || is_active === undefined ? true : false;
	this.initialized = false;
	
	this.$wrapperElement;
	this.$currentElement;

	this.debugCategory = null;

	this.timerStartDate;
	this.processNiceName;

	this.buildUI = function() {
		this.$wrapperElement = $('<ul id="__path_debug_div"></ul>');

		$('body').append(this.$wrapperElement);

		this.$wrapperElement.on('click', 'a.__path_debug_obj_more', function(e) {
			e.preventDefault();
			$(this).toggleClass('opened').siblings('.__path_debug_object').toggle();
			return false;
		});

		this.initialized = true;

		this.$currentElement = this.$wrapperElement;
	}

	this.parseItem = function(what) {
		if( typeof what === "object" ) {
			what = '<a href="#" class="__path_debug_obj_more">[Object]</a>'+
					  '<pre class="__path_debug_object">' + JSON.stringify(what, undefined, 2) + '</pre>';
		}
		return what;
	}

	this.startProcess = function(processNiceName) {
		this.processNiceName = processNiceName;
		this.timerStartDate = Math.floor(Date.now() / 1000);

		var $baseItem = this.addItem('<em>'+capitalizeString(this.processNiceName)+'</em>');

		var $newElement = $('<div class="__path_debug_process_progress __path_progress_for_'+this.processNiceName+'">' +
								'<div class="__path_progress_indicator"></div>' +
							'</div>' +
							'<div class="__path_progress_status">...</div>'
							);

		$baseItem.append($newElement);
	}

	this.updateProgress = function(currentValue, finalValue, addItemEveryNPercent) {
		if( addItemEveryNPercent === undefined ) {
			addItemEveryNPercent = 10;
		}
		var percent = (100 * (currentValue + 1) / finalValue);
		if( percent % addItemEveryNPercent == 0 ) {
			$('.__path_debug_process_progress').attr('data-progress', percent).find('.__path_progress_indicator').width(percent+'%').html(percent + '%');
		}
	}

	this.stopProcess = function() {
		var finishTime = Math.floor(Date.now() / 1000);
		$('.__path_progress_status').html('Done in <em>'+(finishTime - this.timerStartDate)+'</em> seconds');
		this.processNiceName = null;
	}

	this.addItem = function(content) {
		var itemCategoryClass = "";
		var itemCategoryLabel = "";

		if( this.debugCategory ) {
			itemCategoryClass = "__path_has_category __path_category_" + this.debugCategory;
			itemCategoryLabel = '<label>' + capitalizeString(this.debugCategory) + '</label>';
		}

		var $newItem = $('<li class="'+itemCategoryClass+'"></li>');
		
		content = itemCategoryLabel + this.parseItem(content);

		$newItem.html(content);

		this.$currentElement.append( $newItem );

		return $newItem;
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
			finalElement += this.parseItem(arguments[i]);
		}

		var $newItem = this.addItem(finalElement);

		this.debugCategory = null;
	}

})(DEBUG);