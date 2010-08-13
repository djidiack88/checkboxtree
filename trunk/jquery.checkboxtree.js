/**
 * jQuery Checkbox Tree
 *
 * @author Valerio Galano <v.galano@daredevel.it>
 *
 * @see http://checkboxtree.googlecode.com
 *
 * @version 0.4
 */
(function($){

    var checkboxTree = 0;

    $.fn.checkboxTree = function(options) {
var defaults = {
//            checkAllButton: '',
            checkChildren: true, // shortcut:
            checkParents: true, // shortcut:
//ancestors: '', //or 'check', 'uncheck'
//descendants: '', //or 'check', 'uncheck'
//            parentShouldAlwaysBeCheckedIfAndOnlyIfAllChildrenAreChecked: true,
            collapsable: true,
            collapseAllButton: '',
            collapsed: false, // shortcut:
                              // true ->  initializeChecked: 'collapsed', initializeUnchecked: 'collapsed'
                              // false -> initializeChecked: 'expanded',  initializeUnchecked: 'expanded'
            collapseDuration: 500,
            collapseEffect: 'blind',
            collapseImage: '',
            container: 'checkboxTree'+'['+ checkboxTree++ +']',
            cssClass: 'checkboxTree',
            expandAllButton: '',
            expandDuration: 500,
            expandEffect: 'blind',
            expandImage: '',
            initializeChecked: 'expanded', // or 'collapsed'
            initializeUnchecked: 'expanded', // or 'collapsed'
            leafImage: '',
// node: '', // or 'expand', 'collapse'
//            onCheckAscendantsWill: 'check', // or '' or 'uncheck'
//            onUncheckAscendantsWill: 'check', // or '' or 'uncheck'
//            onCheckDescendantsWill: 'check', // or '' or 'uncheck'
//            onUncheckDescendantsWill: 'check', // or '' or 'uncheck'
/*onCheckNodeWill?*/onCheck: '', // or 'expand', 'collapse'
/*onUncheckNodeWill?*/onUncheck: '', // or 'expand', 'collapse'

//preserveCheck: false,
//preserveCollapse: false,

//            uncheckAllButton: '',
        };

        // build main options before element iteration
        var options = $.extend(true, defaults, options);

        // @todo check options

        // setup collapse engine tree
        if (options.collapsable) {

            // @todo remove this as soon as possible
            // mantain compatibility with old "collapsed" option
            if (options.collapsed) {
                options.initializeChecked = 'collapsed';
                options.initializeUnchecked = 'collapsed';
            }

            // @todo replace following anchor code with customizable option
            options.collapseAnchor = (options.collapseImage.length > 0) ? '<img src="'+options.collapseImage+'" />' : '-';
            options.expandAnchor   = (options.expandImage.length > 0)   ? '<img src="'+options.expandImage+'" />'   : '+';
            options.leafAnchor     = (options.leafImage.length > 0)     ? '<img src="'+options.leafImage+'" />'     : '';

            // build collapse all button
            if (options.collapseAllButton.length > 0) {
                this.parent().prepend($('<a/>', {
                    'class': options.cssClass+' all',
                    href:    'javascript:void(0);',
                    html:    options.collapseAllButton,
                    click:   function(){
                        $('[class*=' + options.container + '] li.expanded').each(function(){
                            collapse($(this), options);
                        });
                    }
                }));
            }

            // build expand all button
            if (options.expandAllButton.length > 0) {
                this.parent().prepend($('<a/>', {
                    'class': options.cssClass+' all',
                    href:    'javascript:void(0);',
                    html:    options.expandAllButton,
                    click:   function(){
                        $('[class*=' + options.container + '] li.collapsed').each(function(){
                            expand($(this), options);
                        });
                    }
                }));
            }

            // initialize leafs
            $("li:not(:has(ul))", this).each(function() {
                $(this).prepend($('<span></span>'));
                markAsLeaf($(this), options);
            });

            // initialize checked nodes
            $("li:has(ul):has(input:checked)", this).each(function() {
                $(this).prepend($('<span></span>'));
                options.initializeChecked == 'collapsed' ? collapse($(this), options) : expand($(this), options);
            });

            // initialize unchecked nodes
            $("li:has(ul):not(:has(input:checked))", this).each(function() {
                $(this).prepend($('<span></span>'));
                options.initializeUnchecked == 'collapsed' ? collapse($(this), options) : expand($(this), options);
            });

            // bind expand event
            $('li.collapsed span', this).live("click", function(){
                expand($(this).parents("li:first"), options);
                return false;
            });

            // bind collapse event
            $('li.expanded span', this).live("click", function(){
                collapse($(this).parents("li:first"), options);
                return false;
            });

            // bind collapse/expand uncheck event
            // if (options.node.onUncheck != undefined) {
            $(':checkbox:not(:checked)', this).live("click", function() {
                if (options.onUncheck == 'collapse') {
                    collapse($(this).parents("li:first"), options);
                }
                if (options.onUncheck == 'expand') {
                    expand($(this).parents("li:first"), options);
                }
            });
            //}

            // bind collapse/expand check event
            $(':checkbox:checked', this).live("click", function() {
                if (options.onCheck == 'collapse') {
                    collapse($(this).parents("li:first"), options);
                }
                if (options.onCheck == 'expand') {
                    expand($(this).parents("li:first"), options);
                }
            });

            /**
             * Collapse node
             *
             * @public
             *
             * @param li node to collapse
             */
            this.collapse = function(li)
            {
                if ($(li).hasClass('expanded')) {
                    collapse(li, options);
                }
            }

            /**
             * Expand node
             *
             * @public
             *
             * @param li node to expand
             */
            this.expand = function(li)
            {
                if ($(li).hasClass('collapsed')) {
                    expand(li, options);
                }
            }

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
        this.check = function(li)
        {
            check(li, options);
        }

        /**
         * Uncheck node
         *
         * @public
         *
         * @param li node to uncheck
         */
        this.uncheck = function(li)
        {
            uncheck(li, options);
        }

        return this;
    }

    /**
     * Recursively check parents of passed checkbox
     *
     * @todo move form checkbox to li element
     */
    this.checkParents = function(checkbox, options)
    {
        var parentCheckbox = checkbox.parents("li:first").parents("li:first").find(" :checkbox:first");

        if (!parentCheckbox.is(":checked")) {
            parentCheckbox.attr("checked","checked");
        }

        if (parentCheckbox.parents('[class*=' + options.container + ']').attr('class') != undefined) {
            checkParents(parentCheckbox, options);
        }
    }

    /**
     * Collapse node
     *
     * @private
     *
     * @param li      node to collapse
     * @param options options object
     */
    function collapse(li, options)
    {
        if ($(li).hasClass('collapsed')) return;

        if ($.ui !== undefined) {
            li.children("ul").hide(options.collapseEffect, {}, options.collapseDuration);
        } else {
            li.children("ul").hide(options.collapseDuration);
        }
        markAsCollapsed(li, options);
    }

    /**
     * Expand node
     *
     * @private
     *
     * @param li      node to expand
     * @param options options object
     */
    function expand(li, options)
    {
        if ($(li).hasClass('expanded')) return;

        if ($.ui !== undefined) {
            li.children("ul").show(options.expandEffect, {}, options.expandDuration);
        } else {
            li.children("ul").show(options.expandDuration);
        }
        markAsExpanded(li, options);
    }

    /**
     * Mark node as collapsed
     *
     * @private
     *
     * @param li      node to mark
     * @param options options object
     */
    function markAsCollapsed(li, options)
    {
        li.children("span").html(options.expandAnchor);
        li.addClass("collapsed").removeClass("expanded");
    }

    /**
     * Mark node as expanded
     *
     * @private
     *
     * @param li      node to mark
     * @param options options object
     */
    function markAsExpanded(li, options)
    {
        li.children("span").html(options.collapseAnchor);
        li.addClass("expanded").removeClass("collapsed");
    }

    /**
     * Mark node as leaf
     *
     * @private
     *
     * @param li      node to mark
     * @param options options object
     */
    function markAsLeaf(li, options)
    {
        li.children("span").html(options.leafAnchor);
        li.addClass("leaf");
    }

    /**
     * Check node
     *
     * @private
     *
     * @param li      node to check
     * @param options options object
     */
    this.check = function(li, options)
    {
        if (options.checkChildren) {
            $(li).find('input').attr('checked', 'checked');
        } else {
            $(li).find('input:first').attr('checked', 'checked');
        }
        if (options.checkParents) {
            checkParents($(li).find('input:first'), options);
        }
    }

    /**
     * Uncheck node
     *
     * @private
     *
     * @param li      node to uncheck
     * @param options options object
     */
    this.uncheck = function(li, options)
    {
        if (options.checkChildren) {
            $(li).find('input').attr('checked', '');
        } else {
            $(li).find('input:first').attr('checked', '');
        }
    }

})(jQuery);
