## Options ##

| **options**         | **type**  | **default value**     | **description** |
|:--------------------|:----------|:----------------------|:----------------|
| checkChildren       | boolean   | true                  | If node's children must be checked when node is checked. |
| checkParents        | boolean   | true                  | If node's ancestors must be checked when node is checked. |
| collapsable         | boolean   | true                  | If tree has collapsable nodes. |
| collapseAllButton   | string    | ''                    | Label of Collapse All button. If null, button is ignored. |
| collapsed           | boolean   | false                 | If all nodes must be all collapsed on script start. |
| collapseDuration    | integer   | 500                   | Collapse effect duration in ms. |
| collapseEffect      | string    | 'blind'               | Effect to use for node collapse. In case of very big tree, effects can slow down script execution: to fix this problem, set option value to '' to remove effect. Requires jQueryUI. See jQueryUI effect documentation for effect list. |
| collapseImage       | string    | ''                    | Image to use as anchor for expanded node. |
| container           | string    | 'checkboxTree`[n]`'   | Class to contain tree. |
| cssClass            | string    | 'checkboxTree'        | Class for css linking. |
| expandAllButton     | string    | ''                    | Label of Expand All button. If null, button is ignored. |
| expandDuration      | integer   | 500                   | Collapse effect duration in ms. |
| expandEffect        | string    | 'blind'               | Effect to use for node collapse. In case of very big tree, effects can slow down script execution: to fix this problem, set option value to '' to remove effect. Requires jQueryUI. See jQueryUI effect documentation for effect list. |
| expandImage         | string    | ''                    | Image to use as anchor for collapsed nodes. |
| leafImage           | string    | ''                    | Image to use for not collapsable nodes. |