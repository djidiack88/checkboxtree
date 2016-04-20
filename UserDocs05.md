
# What's jQuery checkboxTree? #
checkboxTree is a jQuery UI widget that you ca use to add advanced features to an html tree (built using nested unordered lists) that contains a checkbox input for each li element.

This guide is designed to help you to deploy and configure version 0.5.x of the widget. If you are migrating from a previous release (0.4.x, 0.3.x, etc.), please check [Changelog](Changelog.md) and [MigrationNotes](MigrationNotes.md) to get help for upgrade.

## Compatibility ##
Because of the plugin is build on top of jQuery library, it follows the same [browser compatility](http://docs.jquery.com/Browser_Compatibility).

As jQueryUI widget, it also follows [jQueryUI development guidelines](http://jqueryui.com/docs/Developer_Guide) and can be graphically customized as described in [jQueryUI theming guide](http://jqueryui.com/docs/Theming).

# Download #
Please, download the latest release from [here](http://code.google.com/p/checkboxtree/downloads/list). Package contains development code, mified code, jQuery/jQueryUI library used for development and some demo files.

Alternatively, you can include the script directly from googlecode as described in [Deployment section](#Deployment.md).

# Deployment #
checkboxTree needs jQuery 1.4+ and jQueryUI 1.8+ (Core, Effect, Widget) library to work correctly. To deploy it, the following code can be included in html page:

```
<!-- include jQuery and jQueryUI libraries -->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/jquery-ui.min.js"></script>
<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/themes/smoothness/jquery-ui.css" />

<!-- include checkboxTree plugin -->
<script type="text/javascript" src="jquery.checkboxtree.min.js"></script>
<link rel="stylesheet" type="text/css" href="jquery.checkboxtree.min.css" />

<!-- initialize checkboxTree plugin -->
<script type="text/javascript">
//<!--
  $(document).ready(function() {
    $('.selector').checkboxTree({
      /* specify here your options */
    });
  });
//-->
</script>
```
An online version of checkboxtree plugin is hosted on googlecode and can be directly include by using the following code:
```
<!-- include checkboxTree plugin -->
<script type="text/javascript" src="http://checkboxtree.googlecode.com/svn/tags/checkboxtree-X.X.X/jquery.checkboxtree.min.js"></script>
<link rel="stylesheet" type="text/css" href="http://checkboxtree.googlecode.com/svn/tags/checkboxtree-X.X.X/jquery.checkboxtree.min.css" />
```
where X.X.X is desidered release version.

The object to attach the plugin instance to must be a valid nested unordered list containing checkbox inputs. Something like this:
```
<ul id=".selector">
    <li><input type="checkbox"><label>Node 1</label>
        <ul>
            <li><input type="checkbox"><label>Node 1.1</label>
                <ul>
                    <li><input type="checkbox"><label>Node 1.1.1</label>
                </ul>
        </ul>
        <ul>
            <li><input type="checkbox"><label>Node 1.2</label>
                <ul>
                    <li><input type="checkbox"><label>Node 1.2.1</label>
                    <li><input type="checkbox"><label>Node 1.2.2</label>
                    <li><input type="checkbox"><label>Node 1.2.3</label>
                        <ul>
                            <li><input type="checkbox"><label>Node 1.2.3.1</label>
                            <li><input type="checkbox"><label>Node 1.2.3.2</label>
                        </ul>
                    <li><input type="checkbox"><label>Node 1.2.4</label>
                    <li><input type="checkbox"><label>Node 1.2.5</label>
                    <li><input type="checkbox"><label>Node 1.2.6</label>
                </ul>
        </ul>
    <li><input type="checkbox"><label>Node 2</label>
        <ul>
            <li><input type="checkbox"><label>Node 2.1</label>
                <ul>
                    <li><input type="checkbox"><label>Node 2.1.1</label>
                </ul>
            <li><input type="checkbox"><label>Node 2.2</label>
                <ul>
                    <li><input type="checkbox"><label>Node 2.2.1</label>
                    <li><input type="checkbox"><label>Node 2.2.2</label>
                    <li><input type="checkbox"><label>Node 2.2.3</label>
                        <ul>
                            <li><input type="checkbox"><label>Node 2.2.3.1</label>
                            <li><input type="checkbox"><label>Node 2.2.3.2</label>
                        </ul>
                    <li><input type="checkbox"><label>Node 2.2.4</label>
                    <li><input type="checkbox"><label>Node 2.2.5</label>
                    <li><input type="checkbox"><label>Node 2.2.6</label>
                </ul>
        </ul>
</ul>
```

# Set/get options #
The widget can be customized by passing option values directly during initialization, in the following way:
```
// Initialize
$( '.selector' ).checkboxTree({
    collapseDuration: 200,
    expandDuration: 200
});
```

Alternatively, options value can be get/set after initialization in the following way:
```
Get or set the collapseDuration option, after init.
//getter
var collapseDuration = $( '.selector' ).dialog( 'option', 'collapseDuration' );
//setter
$( '.selector' ).dialog( 'option', 'collapseDuration', 300);
```

## Available options ##
The following table contains a list of all available options with a short description. Complex options will be explained below.

~~Striked~~ options are deprecated: they still working in this release, but will be removed from next release.

| **options**           | **type**         | **default value**        | **description** |
|:----------------------|:-----------------|:-------------------------|:----------------|
| collapsable           | boolean          | true                     | Defines if tree has collapse capability. |
| ~~collapseAllElement~~ | object|string    | ''                       | Attach a collapse all event to one or more DOM element. Value passed can be either the object representing element or the string used as element selector. When user click on the identified element collapse all element will be trough. This feature can be simply replaced by collapseAll method. |
| collapseDuration      | integer          | 500                      | Defines duration of collapse effect in ms. Works only if collapseEffect is not null. |
| collapseEffect        | string           | 'blind'                  | Defines the effect used for collapse node. In case of very big tree, effects can slow down script execution: to fix this problem, set option value to '' to remove effect. See jQueryUI effect documentation to discover available effects. |
| ~~collapseImage~~     | string           | ''                       | Defines URL of image used for collapse anchor. |
| collapseUiIcon        | string           | 'ui-icon-triangle-1-e'   | Defines jQueryUI icon class used for collapse anchor. See jQueryUI themes documentation to discover available icons. |
| ~~expandAllElement~~  | object|string    | ''                       | Attach an expand all event to one or more DOM. Value passed can be the object representing element or the string used as element selector. When user click on the identified element expand all element will be trough. This feature can be simply replaced by expandAll method. |
| expandDuration        | integer          | 500                      | Defines duration of expand effect in ms. Works only if expandEffect is not null. |
| expandEffect          | string           | 'blind'                  | Defines the effect used for expand node.  In case of very big tree, effects can slow down script execution: to fix this problem, set option value to '' to remove effect. See jQueryUI effect documentation to discover available effects.|
| ~~expandImage~~       | string           | ''                       | Defines URL of image used for expand anchor. |
| expandUiIcon          | string           | 'ui-icon-triangle-1-se'  | Defines jQueryUI icon class used for expand anchor. See jQueryUI themes documentation to discover available icons. |
| initializeChecked     | string           | 'expanded'               | Defines if checked node are collapsed or not at tree initializing. Can be set to 'expanded' or 'collapsed'. |
| initializeUnchecked   | string           | 'expanded'               | Defines if unchecked node are collapsed or not at tree initializing. Can be set to 'expanded' or 'collapsed'. |
| ~~leafImage~~         | string           | ''                       | Defines URL of image used for leaf anchor. |
| leafUiIcon            | string           | ''                       | Defines jQueryUI icon class used for leaf nodes. See jQueryUI themes documentation to discover available icons. |
| onCheck               | object           | [Read more](#onCheck.md)   | Defines which actions trigger when a node is checked. [Read more](#onCheck.md) |
| onUncheck             | object           | [Read more](#onUncheck.md) | Defines which actions trigger when a node is unchecked. [Read more](#onUncheck.md) |

## onCheck ##
This option is an object composed by following options:

| **options**           | **type**         | **default value**        | **description** |
|:----------------------|:-----------------|:-------------------------|:----------------|
| ancestors             | string           | 'check'                  | Defines action to perform on ancestors of the checked node. Available values: null, 'check', 'uncheck', 'checkIfFull'. |
| descendants           | string           | 'check'                  | Defines action to perform on descendants of the checked node. Available values: null, 'check', 'uncheck'. |
| node                  | string           | ''                       | Defines action to perform on checked node. Available values: null, 'collapse', 'expand'. |
| other                 | string           | ''                       | Defines action to perform on each other node (checked one excluded). Available values: null, 'check', 'uncheck'. |

Actions are triggered in the following order:
  1. node
  1. others
  1. descendants
  1. ancestors

## onUncheck ##
This option is an object composed by following options:

| **options**           | **type**         | **default value**        | **description** |
|:----------------------|:-----------------|:-------------------------|:----------------|
| ancestors             | string           | ''                       | Defines action to perform on ancestors of the unchecked node. Available values: null, 'check', 'uncheck'.          |
| descendants           | string           | 'uncheck'                | Defines action to perform on descendants of the unchecked node. Available values: null, 'check', 'uncheck'.        |
| node                  | string           | ''                       | Defines action to perform on unchecked node. Available values: null, 'collapse', 'expand'.                         |
| other                 | string           | ''                       | Defines action to perform on each other node (unchecked one excluded). Available values: null, 'check', 'uncheck'. |

Actions are triggered in the following order:
  1. node
  1. others
  1. descendants
  1. ancestors

# Handle events #
Events can be handled suppling a callback function as an init option:
```
$( ".selector" ).checkboxTree({
   collapse: function(event, ui) { ... }
});
```
Alternatively, you can bind to the event by type: checkboxtree + eventName as follow:
```
$( ".selector" ).bind( "checkboxtreecollapse", function(event, ui) {
  ...
});
```

## Available events ##
| **event**    | **type**               | **description** |
|:-------------|:-----------------------|:----------------|
| collapse     | checkboxtreecollapse   | Triggered when a node is collapsed. |
| expand       | checkboxtreeexpand     | Triggered when a node is expanded. |

# Call methods #
Methods can be called as follow:
```
$( ".selector" ).checkboxTree( method, arg1, arg2, ... );
```

## Available methods ##
| **method**      | **arguments** | **description** |
|:----------------|:--------------|:----------------|
| check(li)       | li object     | Check passed node. |
| checkAll()      |               | Check all nodes. |
| collapse(li)    | li object     | Collapse passed node. |
| collapseAll()   |               | Collapse all nodes. |
| expand(li)      | li object     | Expand passed node. |
| expandAll()     |               | Expand all nodes. |
| uncheck(li)     | li object     | Uncheck passed node. |
| uncheckAll()    |               | Uncheck all nodes. |

# Theming #
The plugin uses the jQuery UI CSS Framework to style its look and feel, so you can use the [ThemeRoller tool](http://jqueryui.com/themeroller/) to create and download custom themes that are easy to build and maintain.

# Support #

## Report bugs ##
If you find a bug, please report it at http://code.google.com/p/checkboxtree/issues/list.

## Donate ##
If you think that my work made you save your time and you want to show you appreciation, or want to support development, please click [here](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KWY8ZUCUBGVXG) to make a donation.