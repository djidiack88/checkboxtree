/**
 * jQuery Checkbox Tree
 *
 * @author Valerio Galano <v.galano@daredevel.it>
 *
 * @see http://checkboxtree.daredevel.it
 *
 * @version 0.5
 */

var checkboxTree = 0;

$.widget("daredevel.checkboxTree", {

    options: {
        /**
         * Defines an element of DOM that, if clicked, trigger checkAll() method.
         * Value can be either a jQuery object or a selector string.
         */
        checkAllElement: '',
        /**
         * Defines if tree has collapse capability
         */
        collapsable: true,
        /**
         * Defines an element of DOM that, if clicked, trigger collapseAll() method.
         * Value can be either a jQuery object or a selector string.
         */
        collapseAllElement: '',
        /**
         * Defines duration of collapse effect in ms.
         * Works only if collapseEffect is not null.
         */
        collapseDuration: 500,
        /**
         * Defines the effect used for collapse node.
         */
        collapseEffect: 'blind',
        collapseImage: '',
        cssClass: 'checkboxTree',
//            dataSourceType: '',
//            dataSourceUrl: '',
        /**
         * Defines an element of DOM that, if clicked, trigger expandAll() method.
         * Value can be either a jQuery object or a selector string.
         */
        expandAllElement: '',
        /**
         * Defines duration of expand effect in ms.
         * Works only if expandEffect is not null.
         */
        expandDuration: 500,
        /**
         * Defines the effect used for expand node.
         */
        expandEffect: 'blind',
        expandImage: '',
        /**
         * Defines if checked node are collapsed or not at tree initializing.
         */
        initializeChecked: 'expanded', // or 'collapsed'
        /**
         * Defines if unchecked node are collapsed or not at tree initializing.
         */
        initializeUnchecked: 'expanded', // or 'collapsed'
        leafImage: '',
        /**
         * Defines which actions trigger when a node is checked.
         * Actions are triggered in the following order:
         * 1) node
         * 2) others
         * 3) descendants
         * 4) ancestors
         */
        onCheck: {
            /**
             * Available values: null, 'check', 'uncheck', 'checkIfFull'
             */
            ancestors: 'check',
            /**
             * Available values: null, 'check', 'uncheck'
             */
            descendants: 'check',
            /**
             * Available values: null, 'collapse', 'expand'
             */
            node: '',
            /**
             * Available values: null, 'check', 'uncheck'
             */
            others: ''
        },
        /**
         * Defines which actions trigger when a node is unchecked.
         * Actions are triggered in the following order:
         * 1) node
         * 2) others
         * 3) descendants
         * 4) ancestors
         */
        onUncheck: {
            /**
             * Available values: null, 'check', 'uncheck'
             */
            ancestors: '',
            /**
             * Available values: null, 'check', 'uncheck'
             */
            descendants: 'uncheck',
            /**
             * Available values: null, 'collapse', 'expand'
             */
            node: '',
            /**
             * Available values: null, 'check', 'uncheck'
             */
            others: ''
        },
        /**
         * Defines an element of DOM that, if clicked, trigger uncheckAll() method.
         * Value can be either a jQuery object or a selector string.
         */
        uncheckAllElement: ''
    },

    _create: function() {

        var t = this

        /* setup collapse engine tree */
        if (this.options.collapsable) {

            /* build collapse engine's anchors */
            this.options.collapseAnchor = (this.options.collapseImage.length > 0) ? '<img src="' + this.options.collapseImage + '" />' : '-';
            this.options.expandAnchor = (this.options.expandImage.length > 0) ? '<img src="' + this.options.expandImage + '" />' : '+';
            this.options.leafAnchor = (this.options.leafImage.length > 0) ? '<img src="' + this.options.leafImage + '" />' : '';

            /* initialize leafs */
            this.element.find("li:not(:has(ul))").each(function() {
                $(this).prepend($('<span />'));
                t._markAsLeaf($(this), t.options);
            });

            /* initialize checked nodes */
            this.element.find("li:has(ul):has(input:checkbox:checked)").each(function() {
                $(this).prepend($('<span />'));
                t.options.initializeChecked == 'collapsed' ? t._collapse($(this), t.options, false) : t._expand($(this), t.options, false);
            });

            /* initialize unchecked nodes */
            this.element.find("li:has(ul):not(:has(input:checkbox:checked))").each(function() {
                $(this).prepend($('<span />'));
                t.options.initializeUnchecked == 'collapsed' ? t._collapse($(this), t.options, false) : t._expand($(this), t.options, false);
            });

            /* bind collapse/expand event */
            this.element.find('li span').live("click", function() {
                li = $(this).parents("li:first");

                if (li.hasClass('collapsed')) {
                    t._expand(li, t.options, true);
                } else

                if (li.hasClass('expanded')) {
                    t._collapse(li, t.options, true);
                }
            });

            /* bind collapse all element event */
            $(this.options.collapseAllElement).bind("click", function() {
                t._collapseAll(t.options);
            });

            /* bind expand all element event */
            $(this.options.expandAllElement).bind("click", function() {
                t._expandAll(t.options);
            });

            /* bind collapse on uncheck event */
            if (this.options.onUncheck.node == 'collapse') {
                this.element.find('input:checkbox:not(:checked)').live("click", function() {
                    t._collapse($(this).parents("li:first"), t.options);
                });
            } else

            /* bind expand on uncheck event */
            if (this.options.onUncheck.node == 'expand') {
                this.element.find('input:checkbox:not(:checked)').live("click", function() {
                    t._expand($(this).parents("li:first"), t.options);
                });
            }

            /* bind collapse on check event */
            if (this.options.onCheck.node == 'collapse') {
                this.element.find('input:checkbox:checked').live("click", function() {
                    t._collapse($(this).parents("li:first"), t.options);
                });
            } else

            /* bind expand on check event */
            if (this.options.onCheck.node == 'expand') {
                this.element.find('input:checkbox:checked').live("click", function() {
                    t._expand($(this).parents("li:first"), t.options);
                });
            }
        }

        /* bind node uncheck event */
        this.element.find('input:checkbox:not(:checked)').live('click', function() {
            var li = $(this).parents('li:first');
            t._uncheck(li, t.options);
        });

        /* bind node check event */
        this.element.find('input:checkbox:checked').live('click', function() {
            var li = $(this).parents('li:first');
            t._check(li, t.options);
        });

        /* bind check all element event */
        $(this.options.checkAllElement).bind("click", function() {
            t._checkAll(t.options);
        });

        /* bind uncheck all element event */
        $(this.options.uncheckAllElement).bind("click", function() {
            t._uncheckAll(t.options);
        });

        /* add css class */
        this.element.addClass(this.options.cssClass);
    },

    /**
     * Collapse node
     *
     * @public
     *
     * @param li node to collapse
     */
    collapse: function(li) {
        if (li.hasClass('expanded')) {
            this._collapse(li, this.options, true);
        }
    },

    /**
     * Collapse all nodes
     *
     * @public
     */
    collapseAll: function() {
        this._collapseAll(this.options);
    },

    /**
     * Expand node
     *
     * @public
     *
     * @param li node to expand
     */
    expand: function(li) {
        if (li.hasClass('collapsed')) {
            this._expand(li, this.options, true);
        }
    },

    /**
     * Expand all nodes
     *
     * @public
     */
    expandAll: function() {
        this._expandAll(this.options);
    },

    /**
     * Check node
     *
     * @public
     *
     * @param li node to check
     */
    check: function(li) {
        this._check(li, this.options);
    },

    /**
     * Check all nodes
     *
     * @public
     */
    checkAll: function() {
        this._checkAll(this.options);
    },

    /**
     * Uncheck node
     *
     * @public
     *
     * @param li node to uncheck
     */
    uncheck: function(li) {
        this._uncheck(li, this.options);
    },

    /**
     * Uncheck all nodes
     *
     * @public
     */
    uncheckAll: function() {
        this._uncheckAll(this.options);
    },

    addNode: function(a) {
        this._addNode(a);
    },


    /**
     * Add a new node as children of passed one
     *
     * @private
     *
     * @param parentLi node under which new node will be attached
     * @param options  options object
     */
    _addNode: function(parentLi, options) {
        input = $('<input/>', {
            type: 'checkbox'
        });

        label = $('<label/>', {
            html: 'new'
        });

        span = $('<span/>', {
            html: ''
        });

        li = $('<li/>', {
            class: 'leaf'
        });

        li.append(span).append(input).append(label);

        if (parentLi.hasClass('leaf')) {
            ul = $('<ul/>');
            span = $('<span/>', {
                html: '-'
            });
            parentLi.append(ul.append(li)).removeClass('leaf').addClass('expanded');
            span.prependTo(parentLi);
        } else {
            parentLi.find('ul:first').append(li);
        }
    },

    /**
     * Check if all descendant of passed node are checked
     *
     * @private
     *
     * @param li node
     *
     * @return true if all descendant checked
     */
    _allDescendantChecked: function(li) {
        return (li.parents('li:first').find('li input:checkbox:not(:checked)').length == 0);
    },

    /**
     * Check node
     *
     * @private
     *
     * @param li      node to check
     * @param options options object
     */
    _check: function(li, options) {

        li.find('input:checkbox:first:not(:checked)').attr('checked', 'checked').change();

        /* handle others */
        if (options.onCheck.others == 'check') {
            this._checkOthers(li, options);
        } else

        if (options.onCheck.others == 'uncheck') {
            this._uncheckOthers(li, options);
        }

        /* handle descendants */
        if (options.onCheck.descendants == 'check') {
            this._checkDescendants(li, options);
        } else

        if (options.onCheck.descendants == 'uncheck') {
            this._uncheckDescendants(li, options);
        }

        /* handle ancestors */
        if (options.onCheck.ancestors == 'check') {
            this._checkAncestors(li, options);
        } else

        if (options.onCheck.ancestors == 'uncheck') {
            this._uncheckAncestors(li, options);
        } else

        if (options.onCheck.ancestors == 'checkIfFull') {
            if (this._allDescendantChecked(li) && !this._isRoot(li, options)) {
                this._check(parentNode(li, options), options);
            }
        }

    },

    /**
     * Check all tree elements
     *
     * Don't use check() method because we won't trigger onCheck events
     *
     * @private
     *
     * @param options options object
     */
    _checkAll: function(options) {
        $(this.element).find('input:checkbox:not(:checked)').attr('checked', 'checked').change();
    },

    /**
     * Check ancestors on passed node
     *
     * Don't use check() method because we won't trigger onCheck events
     *
     * @private
     *
     * @param li node
     */
    _checkAncestors: function(li) {
        li.parents('li').find('input:checkbox:first:not(:checked)').attr('checked', 'checked').change();
    },

    /**
     * Check descendants on passed node
     *
     * Don't use check() method because we won't trigger onCheck events
     *
     * @private
     *
     * @param li node
     */
    _checkDescendants: function(li) {
        li.find('li input:checkbox:not(:checked)').attr('checked', 'checked').change();
    },

    /**
     * Check nodes that are neither ancestors or descendants of passed node
     *
     * Don't use check() method because we won't trigger onCheck events
     *
     * @private
     *
     * @param li
     * @param options
     */
    _checkOthers: function(li, options) {
        var t = this;
        li.addClass('exclude');
        li.parents('li').addClass('exclude');
        li.find('li').addClass('exclude');
//		$('[class*="' + options.container + '"] :not(:has([class*="exclude"])) :checkbox:not(:checked)').attr('checked', 'checked').change();
        $(this.element).find('li').each(function() {
            if (!$(this).hasClass('exclude')) {
                $(this).find('input:checkbox:first:not(:checked)').attr('checked', 'checked').change();
            }
        });
        $(this.element).find('li').removeClass('exclude');
    },

    /**
     * Collapse node
     *
     * @private
     *
     * @param li      node to collapse
     * @param options options object
     */
    _collapse: function(li, options) {
        if (li.hasClass('collapsed') || li.hasClass('leaf')) return;

        if ($.ui !== undefined) {
            li.children("ul").hide(options.collapseEffect, {}, options.collapseDuration);
        } else {
            li.children("ul").hide(options.collapseDuration);
        }
        this._markAsCollapsed(li, options);

        li.trigger('collapse');
    },

    /**
     * Collapse all nodes of the tree
     *
     * @private
     *
     * @param options options object
     */
    _collapseAll: function(options) {
        var t = this;
        $(this.element).find('li.expanded').each(function() {
            t._collapse($(this), options);
        });
    },

    /**
     * Expand node
     *
     * @private
     *
     * @param li      node to expand
     * @param options options object
     */
    _expand: function(li, options) {
        if (li.hasClass('expanded') || li.hasClass('leaf')) return;

        if ($.ui !== undefined) {
            li.children("ul").show(options.expandEffect, {}, options.expandDuration);
        } else {
            li.children("ul").show(options.expandDuration);
        }
        this._markAsExpanded(li, options);

        li.trigger('expand');
    },

    /**
     * Expand all nodes of the tree
     *
     * @private
     *
     * @param options options object
     */
    _expandAll: function(options) {
        var t = this;
        $(this.element).find('li.collapsed').each(function() {
            t._expand($(this), options);
        });
    },

    /**
     * Check if passed node is a root
     *
     * @private
     *
     * @param li      node to check
     * @param options options object
     */
    _isRoot: function(li, options) {
        return li.parents('ul:first') == this.element;
    },

    /**
     * Mark node as collapsed
     *
     * @private
     *
     * @param li      node to mark
     * @param options options object
     */
    _markAsCollapsed: function(li, options) {
        li.children("span").html(options.expandAnchor);
        li.addClass("collapsed").removeClass("expanded");
    },

    /**
     * Mark node as expanded
     *
     * @private
     *
     * @param li      node to mark
     * @param options options object
     */
    _markAsExpanded: function(li, options) {
        li.children("span").html(options.collapseAnchor);
        li.addClass("expanded").removeClass("collapsed");
    },

    /**
     * Mark node as leaf
     *
     * @private
     *
     * @param li      node to mark
     * @param options options object
     */
    _markAsLeaf: function(li, options) {
        li.children("span").html(options.leafAnchor);
        li.addClass("leaf");
    },

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
    _parentNode: function(li, options) {
        return li.parents('li:first');
    },

    /**
     * Uncheck node
     *
     * @private
     *
     * @param li      node to uncheck
     * @param options options object
     */
    _uncheck: function(li, options) {

        li.find('input:checkbox:first:checked').attr('checked', '').change();

        /* handle others */
        if (options.onUncheck.others == 'check') {
            this._checkOthers(li, options);
        } else

        if (options.onUncheck.others == 'uncheck') {
            this._uncheckOthers(li, options);
        }

        /* handle descendants */
        if (options.onUncheck.descendants == 'check') {
            this._checkDescendants(li, options);
        } else

        if (options.onUncheck.descendants == 'uncheck') {
            this._uncheckDescendants(li, options);
        }

        /* handle ancestors */
        if (options.onUncheck.ancestors == 'check') {
            this._checkAncestors(li, options);
        } else

        if (options.onUncheck.ancestors == 'uncheck') {
            this._uncheckAncestors(li, options);
        }

    },

    /**
     * Uncheck all tree elements
     *
     * Don't use uncheck() method because we won't trigger onUncheck events
     *
     * @private
     *
     * @param options options object
     */
    _uncheckAll: function(options) {
        $(this.element).find('input:checkbox:checked').attr('checked', '').change();
    },

    /**
     * Uncheck ancestors of passed node
     *
     * Don't use uncheck() method because we won't trigger onUncheck events
     *
     * @private
     *
     * @param li node
     */
    _uncheckAncestors: function(li) {
        li.parents('li').find('input:checkbox:first:checked').attr('checked', '').change();
    },

    /**
     * Uncheck descendants of passed node
     *
     * Don't use uncheck() method because we won't trigger onUncheck events
     *
     * @private
     *
     * @param li node
     */
    _uncheckDescendants: function(li) {
        li.find('li input:checkbox:checked').attr('checked', '').change();
    },

    /**
     * Uncheck nodes that are neither ancestors or descendants of passed node
     *
     * Don't use uncheck() method because we won't trigger onUncheck events
     *
     * @private
     *
     * @param li
     * @param options
     */
    _uncheckOthers: function(li, options) {
        var t = this;
        li.addClass('exclude');
        li.parents('li').addClass('exclude');
        li.find('li').addClass('exclude');
//		$('[class*="' + options.container + '"] :not(:has([class*="exclude"])) :checkbox:checked').attr('checked', '').change();
        $(this.element).find('li').each(function() {
            if (!$(this).hasClass('exclude')) {
                $(this).find('input:checkbox:first:checked').attr('checked', '').change();
            }
        });
        $(this.element).find('li').removeClass('exclude');
    }

    /*
     function descendants(li, options) {
     return li.find('li :checkbox:checkbox');
     }

     function checkParent(li, options){
     parentNode(li).find(':checkbox:first:not(:checked)').each(function(){
     check(this.element.parent('li:first'), options);
     });
     }
     //*/
});
