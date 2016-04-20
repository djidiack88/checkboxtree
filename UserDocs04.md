

# Deployment #
checkboxTree needs jQuery library to work. jQueryUI is required only if you want to improve collapse/expand effects handling.

For best result, always use last library versions.

```
        <!-- include jQuery libraries -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.3/jquery-ui.min.js"></script>

        <!-- include checkboxTree plugin -->
        <link rel="stylesheet" type="text/css" href="jquery.checkboxtree.min.css">
        <script type="text/javascript" src="jquery.checkboxtree.min.js"></script>

        <!-- initialize checkboxTree plugin -->
        <script type="text/javascript">
        //<!--
            $(document).ready(function() {
                $('#tree').checkboxTree({
                /*
                    specify here your options
                */
                });
            });
        //-->
        </script>
```
## Online libraries ##
An online version of checkboxtree plugin is hosted on googlecode and can be directly used including the following code:
```
        <!-- include checkboxTree plugin -->
        <link rel="stylesheet" type="text/css" href="http://checkboxtree.googlecode.com/svn/tags/checkboxtree-X.X.X/jquery.checkboxtree.min.css">
        <script type="text/javascript" src="http://checkboxtree.googlecode.com/svn/tags/checkboxtree-X.X.X/jquery.checkboxtree.min.js"></script>
```
where X.X.X is desidered release version.

# Configurable options #
Following options can be specified when checkboxTree is initialized.

~~Striked~~ options are deprecated: they still working in this release, but will be removed from next release.

**To avoid problems with those old options, set "checkChildren: false" and "checkParents: false".** Read [issue 23](https://code.google.com/p/checkboxtree/issues/detail?id=23) for more informations.

| **options**           | **type**         | **default value**     | **description** |
|:----------------------|:-----------------|:----------------------|:----------------|
| ~~checkChildren~~     | boolean          | true                  | If node's children must be checked when node is checked. This option is deprecaded and will be removed from release 0.5. |
| ~~checkParents~~      | boolean          | true                  | If node's ancestors must be checked when node is checked. This option is deprecaded and will be removed from release 0.5. |
| collapsable           | boolean          | true                  | If tree has collapsable nodes. |
| ~~collapseAllButton~~ | object           | {}                    | Build an clickable element to collapse all node. [Read more](#collapseAllButton.md) |
| collapseAllElement    | object|string    | ''                    | Attach a collapse all event to your own element. Value passed can be the object representing element or the string used as element selector. |
| collapsed             | boolean          | false                 | If all nodes must be all collapsed on script start. |
| collapseDuration      | integer          | 500                   | Collapse effect duration in ms. |
| collapseEffect        | string           | 'blind'               | Effect to use for node collapse. In case of very big tree, effects can slow down script execution: to fix this problem, set option value to '' to remove effect. Requires jQueryUI. See jQueryUI effect documentation for effect list. |
| collapseImage         | string           | ''                    | Image to use as anchor for expanded node. |
| container             | string           | 'checkboxTree`[n]`'   | Class to contain tree. Is usefull if you want to handle more than one tree in the page. |
| cssClass              | string           | 'checkboxTree'        | Class for css linking. |
| ~~expandAllButton~~   | object           | {}                    | Build a clickable element to expand all nodes. [Read more](#expandAllButton.md) |
| expandAllElement      | object|string    | ''                    | Attach a expand all event to your own element. Value passed can be the object representing element or the string used as element selector. |
| expandDuration        | integer          | 500                   | Collapse effect duration in ms. |
| expandEffect          | string           | 'blind'               | Effect to use for node collapse. In case of very big tree, effects can slow down script execution: to fix this problem, set option value to '' to remove effect. Requires jQueryUI. See jQueryUI effect documentation for effect list. |
| expandImage           | string           | ''                    | Image to use as anchor for collapsed nodes. |
| initializeChecked     | string           | 'expanded'            | On tree setup, decide the initial state of checked nodes. Can be set to 'expanded' or 'collapsed'. |
| initializeUnchecked   | string           | 'expanded'            | On tree setup, decide the initial state of unchecked nodes. Can be set to 'expanded' or 'collapsed'. |
| leafImage             | string           | ''                    | Image to use for not collapsable nodes. |
| onCheck               | object           | [Read more](#onCheck.md) | Contains operations to perform when a node is checked. [Read more](#onCheck.md) |
| onUncheck             | object           | [Read more](#onUncheck.md) | Contains operations to perform when a node is unchecked. [Read more](#onUncheck.md) |

## collapseAllButton ##
Using this option, checkboxTree will build an element that collapse all nodes when it is clicked. That element will have the _html_ parameter as label and will be placed into element passed as _container_.

Please note: collapseAllButton is deprecated and will be remove in next release. If you prefer you can use collapseAllElement option.

```
    collapseAllButton: {
        html: 'Self-generated Collapse all',
        container: $('#buttons-4')
    },
```

## expandAllButton ##
Using this option, checkboxTree will build an element that expand all nodes when it is clicked. That element will have the _html_ parameter as label and will be placed into element passed as _container_.

Please note: expandAllButton is deprecated and will be remove in next release. If you prefer you can use expandAllElement option.
```
    expandAllButton: {
        html: 'Self-generated Expand all',
        container: $('#buttons-4')
    },
```

## onCheck ##
```
onCheck: {
    ancestors: 'check', //or '', 'uncheck'
    descendants: 'check', //or '', 'uncheck'
    node: '' // or 'collapse', 'expand'
},
```

## onUncheck ##
```
onUncheck: {
    ancestors: '', //or 'check', 'uncheck'
    descendants: 'uncheck', //or '', 'check'
    node: '' // or 'collapse', 'expand'
}
```

# Public methods #

| check(li)     | Check passed node. |
|:--------------|:-------------------|
| collapse(li)  | Collapse passed node. |
| collapseAll() | Collapse all nodes. |
| expand(li)    | Expand passed node. |
| expandAll()   | Expand all nodes.  |
| uncheck(li)   | Uncheck passed node. |

## Example of public method usage ##

Each tree node is something like that:
```
<li id="nodeIWantToCheck"><input type="checkbox">Node to check
```

To call a method that operates on a node, you need to pass the correspondent li element.
```
tree = $('#tree').checkboxTree();
tree.collapse($('#nodeIWantToCheck'));
```