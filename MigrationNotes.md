### Migration from release 0.4 to 0.5 ###
First of all, a 0.5 release shouldn't contains deprecated options of 0.4 release: please refer to [from release 0.3 to 0.4](#Migration.md) to replace them.

  * "cssClass" and "container" options have been removed, but can be replaced with code like this:
```
$('#tree').addClass('cssClassString');
$('#tree').addClass('containerString');
```
> where "cssClassString" and "containerString" are your previous values for removed options.

  * "collapsed" option has been removed. To replace use the following options:
    * initializeChecked: 'expanded', initializeUnchecked: 'expanded', // if was collapsed: false;
    * initializeChecked: 'collapsed', initializeUnchecked: 'collapsed', // if was collapsed: true;

  * Way of calling method has been changed, so your code should change as follow:
```
// this code:
$('#tree').collapse(li);
// should became:
$('#tree').checkboxTree('collapse', li);
```

### Migration from release 0.3 to 0.4 ###
With release 0.4, I added some new options and marked some other as deprecated (still working, but removed in next release). You can compare documentations: UserDocs03 and UserDocs04

Working 0.3 releases, should work correctly out of the box with 0.4 version, but I recommend to follow next instructions to ensure future compatibility:

  * if setted checkChildren: false, replace with: "onCheck: { descendants: '' }, onUncheck: { descendants: '' }"
  * if setted checkParents: false, replace with:  "onCheck: { ancestors: '' }, onUncheck: { ancestors: '' }"
  * if setted "collapseAllButton: 'Collapse All'", set the option "collapseAllElement: '#collapseAll'" and put the following code in your page where you want the button:
```
<button id="collapseAll">Collapse All</button>
```

  * if setted "expandAllButton: 'Expand All'", set the option "expandAllElement: '#expandAll'" and put the following code in your page where you want the button:
```
<button id="expandAll">Expand All</button>
```

### Migration from release 0.2 to 0.3 ###
With release 0.3, a lot of default options are changed. You can compare options: UserDocs02 and UserDocs03

If you have a working release 0.2, please be sure to follow next steps in order to preserve your script behaviour:

  * if not just setted, set "collapseAllButton: 'Collapse All'"
  * if not just setted, set "expandAllButton: 'Expande All'"
  * if not just setted, set "collapseEffect: 'slide'"
  * if not just setted, set "expandEffect: 'slide'"
  * if not just setted, set "collapseImage: 'images/minus.png'"
  * if not just setted, set "expandImage: 'images/plus.png'"
  * if not just setted, set "leafImage: 'images/blank.png'"