/**
 * jQuery Checkbox Tree
 *
 * @author Valerio Galano <valerio.galano@gmail.com>
 *
 * @version 0.2
 */
(function($){

    var checkboxTree = 0;

    $.fn.checkboxTree = function(options) {

        // build main options before element iteration
        var options = $.extend({
            checkChildren: true,
            checkParents: true,
            collapsable: true,
            collapseAllButton: 'Collapse all',
            collapsed: false,
            collapseDuration: 500,
            collapseEffect: 'slide',
            collapseImage: 'images/minus.png',
            container: 'checkboxTree'+'['+ checkboxTree++ +']',
            cssClass: 'checkboxTree',
            expandAllButton: 'Expande all',
            expandDuration: 500,
            expandEffect: 'slide',
            expandImage: 'images/plus.png',
            leafImage: 'images/blank.png'
        }, options);

        // build collapse all button
        if (options.collapseAllButton.length > 0) {

            $collapseAllButton = $('<a class="'+options.cssClass+' all" id="'+options.container+'collapseAll" href="javascript:void(0);">'+options.collapseAllButton+'</a>').bind('click', function(){
                $('[class*=' + options.container + '] img').each(function(){
                    if ($(this).data("collapsed") === 1) {
                        collapse($(this), options);
                    }
                });
            });

            this.parent().prepend($collapseAllButton);
        }

        // build expand all button
        if (options.expandAllButton.length > 0) {

            $expandAllButton = $('<a class="'+options.cssClass+' all" id="'+options.container+'expandAll" href="javascript:void(0);">'+options.expandAllButton+'</a>').bind('click', function(){
                $('[class*=' + options.container + '] img').each(function(){
                    if ($(this).data("collapsed") === 0) {
                        expand($(this), options);
                    }
                });
            });

            this.parent().prepend($expandAllButton);
        }

        // setup tree
        $("li", this).each(function() {

            if (options.collapsable) {
                var $img;

                if ($(this).is(":has(ul)")) {
                    if (options.collapsed) {
                        $(this).find("ul").hide();
                        $img = $('<img src="'+options.expandImage+'" />').data("collapsed",0);
                    } else {
                        $img = $('<img src="'+options.collapseImage+'" />').data("collapsed",1)
                    }
                } else {
                     $img = $('<img src="'+options.leafImage+'" />');
                }

                $(this).prepend($img);
            }
        });

        // handle single expand/collapse
        this.find('img').bind("click", function(e, a){

            if ($(this).data("collapsed") == undefined) {
                return;
            }

            if ($(this).data("collapsed") === 0) {
                expand($(this), options);
            } else {
                collapse($(this), options);
            }
        });

        // handle tree select/unselect
        this.find(':checkbox').bind("click", function(e, a) {

            if (options.checkChildren) {
                toggleChildren($(this));
            }

            if (options.checkParents && $(this).is(":checked")) {
                checkParents($(this), options);
            }
        });

        // add container class
        this.addClass(options.container);

        // add css class
        this.addClass(options.cssClass);

        return this;
    };


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
     * Collapse tree element
     */
    this.collapse = function(img, options)
    {
        var listItem = img.parents("li:first");

        if ($.ui !== undefined) {
            listItem.children("ul").hide(options.collapseEffect, {}, options.collapseDuration);
        } else {
            listItem.children("ul").hide(options.collapseDuration);
        }

        listItem.children("img").attr("src",options.expandImage);
        img.data("collapsed",0)
    }

    /**
     * Expand tree element
     */
    this.expand = function(img, options)
    {
        var listItem = img.parents("li:first");

        if ($.ui !== undefined) {
            listItem.children("ul").show(options.expandEffect, {}, options.expandDuration);
        } else {
            listItem.children("ul").show(options.expandDuration);
        }

        listItem.children("img").attr("src",options.collapseImage);
        img.data("collapsed",1)
    }

    /**
     * Check/uncheck children of passed checkbox
     */
    this.toggleChildren = function(checkbox)
    {
        checkbox.parents('li:first').find('li :checkbox').attr('checked',checkbox.attr('checked') ? 'checked' : '');
    }

})(jQuery);
