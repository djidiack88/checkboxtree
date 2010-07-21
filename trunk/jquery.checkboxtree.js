/**
 * jQuery Checkbox Tree
 *
 * @author Valerio Galano <valerio.galano@gmail.com>
 *
 * @see http://checkboxtree.googlecode.com
 *
 * @version 0.4
 */
(function($){

    var checkboxTree = 0;

    $.fn.checkboxTree = function(options) {

        // build main options before element iteration
        var options = $.extend({
            checkChildren: true,
//            checkDescendants: true,
            checkParents: true,
//            checkAscendants: true,
//            parentShouldAlwaysBeCheckedIfAndOnlyIfAllChildrenAreChecked: true,
            collapsable: true,
            collapseAllButton: '',
            // @todo remove next option as soon as possible
            collapsed: false, // deprecated: replaced by initializeChecked and initializeUnchecked
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
//            OnCheck: '', // or 'expand', 'collapse'
//            OnUncheck: '' // or 'expand', 'collapse'
        }, options);

        // @todo check options

        // check jQuery version
//        if (1.4 >  $().jquery.substr(0,3)) {
//            alert('jQuery Checkbox Tree need jQuery 1.4+ to work')
//        }
//

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
            this.find('li.collapsed span').live("click", function(){
                expand($(this).parents("li:first"), options);
                return false;
            });

            // bind collapse event
            this.find('li.expanded span').live("click", function(){
                collapse($(this).parents("li:first"), options);
                return false;
            });

            // bind collapse/expand uncheck event
//            this.find(':checkbox:not(:checked)').live("click", function() {
//            });

            // bind collapse/expand check event
//            this.find(':checkbox:checked').live("click", function() {
//            });

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

        // bind tree check/unckeck
/*        this.find(':checkbox').bind("click", function(e, a) {
            if (options.checkChildren) {
                toggleChildren($(this));
            }
            if (options.checkParents && $(this).is(":checked")) {
                checkParents($(this), options);
            }
        });//*/

        $(':checkbox:not(:checked)', this).live('click', function() {
            var li = $(this).parents('li:first');
            uncheck(li, options);
        });

        $(':checkbox:checked', this).live('click', function() {
            var li = $(this).parents('li:first');
            check(li, options);
        });

        // add container class
        this.addClass(options.container);

        // add css class
        this.addClass(options.cssClass);

        //
        this.check = function(li)
        {
            check(li, options);
        }

        this.uncheck = function(li)
        {
            uncheck(li, options);
        }

        return this;
    }

    /**
     * Recursively check parents of passed checkbox
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
     * Check/uncheck children of passed checkbox
     */
/*    this.toggleChildren = function(checkbox)
    {
        checkbox.parents('li:first').find('li :checkbox').attr('checked',checkbox.attr('checked') ? 'checked' : '');
    }*/

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
