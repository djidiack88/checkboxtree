/**
 * jQuery Checkbox Tree
 *
 * @author Valerio Galano <v.galano@daredevel.it>
 *
 * @see http://checkboxtree.daredevel.it
 *
 * @version 0.5
 */
(function($){

    var checkboxTree = 0;

	$.fn.checkboxTree = function(options) {
		var defaults = {
			checkAllElement: '',
			//checkedImage: '',
			collapsable: true,
			collapseAllElement: '',
			collapseDuration: 500,
			collapseEffect: 'blind',
			collapseImage: '',
			container: 'checkboxTree' + '[' + checkboxTree++ + ']',
			cssClass: 'checkboxTree',
			expandAllElement: '',
			expandDuration: 500,
			expandEffect: 'blind',
			expandImage: '',
			initializeChecked: 'expanded', // or 'collapsed'
			initializeUnchecked: 'expanded', // or 'collapsed'
			leafImage: '',
			onCheck: {
				ancestors: 'check', //or '', 'uncheck', 'checkIfFull'
				descendants: 'check', //or '', 'uncheck'
				node: '', // or 'collapse', 'expand'
				others: '' //or 'check', 'uncheck'
			},
			onUncheck: {
				ancestors: '', //or 'check', 'uncheck'
				descendants: 'uncheck', //or '', 'check'
				node: '', // or 'collapse', 'expand'
				others: '' //or 'check', 'uncheck'
			},
			uncheckAllElement: ''
			//uncheckedImage: ''
		};

		/* build main options before element iteration */
		var options = $.extend(true, defaults, options);

		/* setup collapse engine tree */
		if (options.collapsable) {

			/* build collapse engine's anchors */
			options.collapseAnchor = (options.collapseImage.length > 0) ? '<img src="' + options.collapseImage + '" />' : '-';
			options.expandAnchor = (options.expandImage.length > 0) ? '<img src="' + options.expandImage + '" />' : '+';
			options.leafAnchor = (options.leafImage.length > 0) ? '<img src="' + options.leafImage + '" />' : '';

			/* initialize leafs */
			$("li:not(:has(ul))", this).each(function() {
				$(this).prepend($('<span></span>'));
				markAsLeaf($(this), options);
			});

			/* initialize checked nodes */
			$("li:has(ul):has(input:checked)", this).each(function() {
				$(this).prepend($('<span></span>'));
				options.initializeChecked == 'collapsed' ? collapse($(this), options) : expand($(this), options);
			});

			/* initialize unchecked nodes */
			$("li:has(ul):not(:has(input:checked))", this).each(function() {
				$(this).prepend($('<span></span>'));
				options.initializeUnchecked == 'collapsed' ? collapse($(this), options) : expand($(this), options);
			});

            /* bind collapse/expand event */
            $('li span', this).live("click", function(){
				li = $(this).parents("li:first");

				if (li.hasClass('collapsed')) {
                	expand(li, options);
				} else

				if (li.hasClass('expanded')) {
                	collapse(li, options);
				}
            });

			// bind collapse all element event
			$(options.collapseAllElement).bind("click", function() {
				collapseAll(options);
			});

			// bind expand all element event
			$(options.expandAllElement).bind("click", function() {
				expandAll(options);
			});

			// bind collapse on uncheck event
			if (options.onUncheck.node == 'collapse') {
				$(':checkbox:not(:checked)', this).live("click", function() {
					collapse($(this).parents("li:first"), options);
				});
			} else

			// bind expand on uncheck event
			if (options.onUncheck.node == 'expand') {
				$(':checkbox:not(:checked)', this).live("click", function() {
					expand($(this).parents("li:first"), options);
				});
			}

			// bind collapse on check event
			if (options.onCheck.node == 'collapse') {
				$(':checkbox:checked', this).live("click", function() {
					collapse($(this).parents("li:first"), options);
				});
			} else

			// bind expand on check event
			if (options.onCheck.node == 'expand') {
				$(':checkbox:checked', this).live("click", function() {
					expand($(this).parents("li:first"), options);
				});
			}

			/**
			 * Collapse node
			 *
			 * @public
			 *
			 * @param li node to collapse
			 */
			this.collapse = function(li) {
				if (li.hasClass('expanded')) {
					collapse(li, options);
				}
			};

			/**
			 * Collapse all nodes
			 *
			 * @public
			 */
			this.collapseAll = function() {
				collapseAll(options);
			};

			/**
			 * Expand node
			 *
			 * @public
			 *
			 * @param li node to expand
			 */
			this.expand = function(li) {
				if (li.hasClass('collapsed')) {
					expand(li, options);
				}
			};

			/**
			 * Expand all nodes
			 *
			 * @public
			 */
			this.expandAll = function() {
				expandAll(options);
			};

		}

		// bind node uncheck event
		$(':checkbox:not(:checked)', this).live('click', function() {
			var li = $(this).parents('li:first');
			uncheck(li, options);
		});

		// bind node check event
		$(':checkbox:checked', this).live('click', function() {
			var li = $(this).parents('li:first');
			check(li, options);
		});

		// bind check all element event
		$(options.checkAllElement).bind("click", function() {
			checkAll(options);
		});

		// bind uncheck all element event
		$(options.uncheckAllElement).bind("click", function() {
			uncheckAll(options);
		});

		// add container class
		this.addClass(options.container);

		// add css class
		this.addClass(options.cssClass);

		/**
		 * Check node
		 *
		 * @public
		 *
		 * @param li node to check
		 */
		this.check = function(li) {
			check(li, options);
		};

		/**
		 * Check all nodes
		 *
		 * @public
		 */
		this.checkAll = function() {
			checkAll(options);
		};

		/**
		 * Uncheck node
		 *
		 * @public
		 *
		 * @param li node to uncheck
		 */
		this.uncheck = function(li) {
			uncheck(li, options);
		};

		/**
		 * Uncheck all nodes
		 *
		 * @public
		 */
		this.uncheckAll = function() {
			uncheckAll(options);
		};

		return this;
	};

	/**
	 * Check if all descendant of passed node are checked
	 *
	 * @private
	 *
	 * @param li node
	 *
	 * @return true if all descendant checked
	 */
	function allDescendantChecked(li) {
		return (li.parents('li:first').find('li :checkbox:not(:checked)').length == 0);
	}

	/**
	 * Check node
	 *
	 * @private
	 *
	 * @param li	  node to check
	 * @param options options object
	 */
	function check(li, options) {
		li.find('input:first:not(:checked)').attr('checked', 'checked').change();

		/* handle others */
		if (options.onCheck.others == 'check') {
			checkOthers(li, options);
		} else

		if (options.onCheck.others == 'uncheck') {
			uncheckOthers(li, options);
		}

		/* handle descendants */
		if (options.onCheck.descendants == 'check') {
			checkDescendants(li, options);
		} else

		if (options.onCheck.descendants == 'uncheck') {
			uncheckDescendants(li, options);
		}

		/* handle ancestors */
		if (options.onCheck.ancestors == 'check') {
			checkAncestors(li, options);
		} else

		if (options.onCheck.ancestors == 'uncheck') {
			uncheckAncestors(li, options);
		} else

		if (options.onCheck.ancestors == 'checkIfFull') {
			if (allDescendantChecked(li)) {
				check(parentNode(li, options), options);
			}
		}

	}

	/**
	 * Check all tree elements
	 *
	 * @private
	 *
	 * @param options options object
	 */
	function checkAll(options) {
		$('[class*="' + options.container + '"] :checkbox:not(:checked)').attr('checked', 'checked').change();
	}

	/**
	 * Check ancestors on passed node
	 *
	 * @private
	 *
	 * @param li node
	 */
	function checkAncestors(li) {
		li.parents('li').find('input:first:not(:checked)').attr('checked', 'checked').change();
	}

	/**
	 * Check descendants on passed node
	 *
	 * @private
	 *
	 * @param li node
	 */
	function checkDescendants(li) {
		li.find('li input:not(:checked)').attr('checked', 'checked').change();
	}

	/**
	 * Check nodes that are neither ancestors or descendants of passed node
	 *
	 * @private
	 *
	 * @param li
	 * @param options
	 */
	function checkOthers(li, options) {
		li.addClass('exclude');
		li.parents('li').addClass('exclude');
		li.find('li').addClass('exclude');
//		$('[class*="' + options.container + '"] :not(:has([class*="exclude"])) :checkbox:not(:checked)').attr('checked', 'checked').change();
		$('[class*="' + options.container + '"] li').each(function(){
			if (!$(this).hasClass('exclude')) {
				$(this).find(':checkbox:first:not(:checked)').attr('checked', 'checked').change();
			}
		});
		$('[class*="' + options.container + '"] li').removeClass('exclude');
	}

	function uncheckOthers(li, options) {
		li.addClass('exclude');
		li.parents('li').addClass('exclude');
		li.find('li').addClass('exclude');
//		$('[class*="' + options.container + '"] :not(:has([class*="exclude"])) :checkbox:checked').attr('checked', '').change();
		$('[class*="' + options.container + '"] li').each(function(){
			if (!$(this).hasClass('exclude')) {
				$(this).find(':checkbox:first:checked').attr('checked', '').change();
			}
		});
		$('[class*="' + options.container + '"] li').removeClass('exclude');
	}
	/**
	 * Collapse node
	 *
	 * @private
	 *
	 * @param li	  node to collapse
	 * @param options options object
	 */
	function collapse(li, options) {
		if (li.hasClass('collapsed') || li.hasClass('leaf')) return;

		if ($.ui !== undefined) {
			li.children("ul").hide(options.collapseEffect, {}, options.collapseDuration);
		} else {
			li.children("ul").hide(options.collapseDuration);
		}
		markAsCollapsed(li, options);
	}

	/**
	 * Collapse all nodes of the tree
	 *
	 * @private
	 *
	 * @param options options object
	 */
	function collapseAll(options) {
		$('[class*="' + options.container + '"] li.expanded').each(function() {
			collapse($(this), options);
		});
	}

	/**
	 * Expand node
	 *
	 * @private
	 *
	 * @param li	  node to expand
	 * @param options options object
	 */
	function expand(li, options) {
		if (li.hasClass('expanded') || li.hasClass('leaf')) return;

		if ($.ui !== undefined) {
			li.children("ul").show(options.expandEffect, {}, options.expandDuration);
		} else {
			li.children("ul").show(options.expandDuration);
		}
		markAsExpanded(li, options);
	}

	/**
	 * Expand all nodes of the tree
	 *
	 * @private
	 *
	 * @param options options object
	 */
	function expandAll(options) {
		$('[class*="' + options.container + '"] li.collapsed').each(function() {
			expand($(this), options);
		});
	}

	/**
	 * Mark node as collapsed
	 *
	 * @private
	 *
	 * @param li	  node to mark
	 * @param options options object
	 */
	function markAsCollapsed(li, options) {
		li.children("span").html(options.expandAnchor);
		li.addClass("collapsed").removeClass("expanded");
	}

	/**
	 * Mark node as expanded
	 *
	 * @private
	 *
	 * @param li	  node to mark
	 * @param options options object
	 */
	function markAsExpanded(li, options) {
		li.children("span").html(options.collapseAnchor);
		li.addClass("expanded").removeClass("collapsed");
	}

	/**
	 * Mark node as leaf
	 *
	 * @private
	 *
	 * @param li	  node to mark
	 * @param options options object
	 */
	function markAsLeaf(li, options) {
		li.children("span").html(options.leafAnchor);
		li.addClass("leaf");
	}

	/**
	 * Return parent li of the passed li
	 *
	 * @private
	 *
	 * @param li      node
	 * @param options options object
	 *
	 * @return parent li
	 */
	function parentNode(li, options) {
		return li.parents('li:first');
	}

	/**
	 * Uncheck node
	 *
	 * @private
	 *
	 * @param li	  node to uncheck
	 * @param options options object
	 */
	function uncheck(li, options) {
		li.find('input:first:checked').attr('checked', '').change();

		/* handle others */
		if (options.onUncheck.others == 'check') {
			checkOthers(li, options);
		} else

		if (options.onUncheck.others == 'uncheck') {
			uncheckOthers(li, options);
		}

		/* handle descendants */
		if (options.onUncheck.descendants == 'check') {
			checkDescendants(li, options);
		} else

		if (options.onUncheck.descendants == 'uncheck') {
			uncheckDescendants(li, options);
		}

		/* handle ancestors */
		if (options.onUncheck.ancestors == 'check') {
			checkAncestors(li, options);
		} else

		if (options.onUncheck.ancestors == 'uncheck') {
			uncheckAncestors(li, options);
		}
	}

	/**
	 * Uncheck all tree elements
	 *
	 * @private
	 *
	 * @param options options object
	 */
	function uncheckAll(options) {
		$('[class*="' + options.container + '"] :checkbox:checked').attr('checked', '').change();
		/*$('[class*="' + options.container + '"] :checkbox:checked').each(function() {
			uncheck($(this).parent('li:first'), options);
		});*/
	}

	/**
	 * Uncheck ancestors of passed node
	 *
	 * @private
	 *
	 * @param li node
	 */
	function uncheckAncestors(li) {
		li.parents('li').find('input:first:checked').attr('checked', '').change();
	}

	/**
	 * Uncheck descendants of passed node
	 *
	 * @private
	 *
	 * @param li node
	 */
	function uncheckDescendants(li) {
		li.find('li input:checked').attr('checked', '').change();
	}































	function descendants(li, options) {
		return li.find('li input:checkbox');
	}

	function checkParent(li, options){
		parentNode(li).find('input:first:not(:checked)').each(function(){
			check($(this).parent('li:first'), options);
		});
	}
	
})(jQuery);
