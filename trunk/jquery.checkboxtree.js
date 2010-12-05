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
            container: 'checkboxTree'+'['+ checkboxTree++ +']',
            cssClass: 'checkboxTree',
            expandAllElement: '',
            expandDuration: 500,
            expandEffect: 'blind',
            expandImage: '',
            initializeChecked: 'expanded', // or 'collapsed'
            initializeUnchecked: 'expanded', // or 'collapsed'
            leafImage: '',
            onCheck: {
                ancestors: 'check', //or '', 'uncheck'
                descendants: 'check', //or '', 'uncheck'
                node: '' // or 'collapse', 'expand'
            },
            onUncheck: {
                ancestors: '', //or 'check', 'uncheck'
                descendants: 'uncheck', //or '', 'uncheck'
                node: '' // or 'collapse', 'expand'
            },
            uncheckAllElement: '',
        //uncheckedImage: ''
        };

        /* build main options before element iteration */
        var options = $.extend(true, defaults, options);

        /* setup collapse engine tree */
        if (options.collapsable) {

            /* build collapse engine's anchors */
            options.collapseAnchor = (options.collapseImage.length > 0) ? '<img src="'+options.collapseImage+'" />' : '-';
            options.expandAnchor   = (options.expandImage.length > 0)   ? '<img src="'+options.expandImage+'" />'   : '+';
            options.leafAnchor     = (options.leafImage.length > 0)     ? '<img src="'+options.leafImage+'" />'     : '';

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
            this.collapse = function(li)
            {
                if ($(li).hasClass('expanded')) {
                    collapse(li, options);
                }
            }

            /**
             * Collapse all nodes
             *
             * @public
             */
            this.collapseAll = function()
            {
                collapseAll(options);
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

            /**
             * Expand all nodes
             *
             * @public
             */
            this.expandAll = function()
            {
                expandAll(options);
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
     * Check node
     *
     * @private
     *
     * @param li      node to check
     * @param options options object
     */
    function check(li, options)
    {
        $(li).find('input:first:not(:checked)').attr('checked', 'checked').change();

        if (options.onCheck.ancestors == 'check') {
            checkAncestors(li, options);
        } else

        if (options.onCheck.ancestors == 'uncheck') {
            uncheckAncestors(li, options);
        }

        if (options.onCheck.descendants == 'check') {
            checkDescendants(li, options);
        } else

        if (options.onCheck.descendants == 'uncheck') {
            uncheckDescendants(li, options);
        }
    }

    /**
     * Check ancestors on passed node
     *
     * @private
     *
     * @param li      node
     * @param options options object
     */
    function checkAncestors(li, options)
    {
        li.parents('li').find('input:first:not(:checked)').attr('checked','checked').change();
    }

    /**
     */
    function checkAll(options)
    {
        $('[class*=' + options.container + '] :checkbox:not(:checked)').each(function(){
            check($(this).parent('li:first'), options);
        });
    }

    /**
     */
    function uncheckAll(options)
    {
        $('[class*=' + options.container + '] :checkbox:checked').each(function(){
            uncheck($(this).parent('li:first'), options);
        });
    }

    /**
     * Check descendants on passed node
     *
     * @private
     *
     * @param li      node
     * @param options options object
     */
    function checkDescendants(li, options)
    {
        li.find('li input:not(:checked)').attr('checked', 'checked').change();
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
        if ($(li).hasClass('collapsed') || $(li).hasClass('leaf')) return;

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
    function collapseAll(options)
    {
        $('[class*=' + options.container + '] li.expanded').each(function(){
            collapse($(this), options);
        });
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
        if ($(li).hasClass('expanded') || $(li).hasClass('leaf')) return;

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
    function expandAll(options)
    {
        $('[class*=' + options.container + '] li.collapsed').each(function(){
            expand($(this), options);
        });
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
     * Uncheck node
     *
     * @private
     *
     * @param li      node to uncheck
     * @param options options object
     */
    function uncheck(li, options)
    {
        $(li).find('input:first:checked').attr('checked', '').change();

        if (options.onUncheck.ascendants == 'check') {
            checkAncestors(li, options);
        } else

        if (options.onUncheck.ascendants == 'uncheck') {
            uncheckAncestors(li, options);
        }

        if (options.onUncheck.descendants == 'check') {
            checkDescendants(li, options);
        } else

        if (options.onUncheck.descendants == 'uncheck') {
            uncheckDescendants(li, options);
        }
    }

    /**
     * Uncheck ancestors on passed node
     *
     * @private
     *
     * @param li      node
     * @param options options object
     */
    function uncheckAncestors(li, options)
    {
        li.parents('li').find('input:first:checked').attr('checked','').change();
    }

    /**
     * Uncheck descendants on passed node
     *
     * @private
     *
     * @param li      node
     * @param options options object
     */
    function uncheckDescendants(li, options)
    {
        li.find('li input:checked').attr('checked', '').change();
    }

})(jQuery);
