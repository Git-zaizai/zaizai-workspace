# vue部分

`当你在 script 中引入 css 的时候，又打包成一个 css 文件时`
导入的顺序会影响最终的样式顺序，他会按照顺序打包到最终的样式文件中

比如:

```vue
<script setup lang="ts">
import '../styles/fonts.css'
import '../styles/vars.css'
import '../styles/icons.css'
import '../styles/base.css'
import '../styles/utils.css'
import '../styles/components/custom-block.css'
import '../styles/components/vp-code-group.css'
import '../styles/components/vp-code.css'
import '../styles/components/vp-doc.css'
import '../styles/components/vp-sponsor.css'

import { ref, shallowRef, onMounted, nextTick, computed, type Ref, watch, onUnmounted } from 'vue'
import { type MenuItem, getHeaders, useActiveAnchor, findScrollableParent, isScrollHeight } from './outline'


import VPDocOutlineItem from './VPDocOutlineItem.vue'
import VPLocalNavOutlineDropdown from './VPLocalNavOutlineDropdown.vue'
</script>

```

按照上面的代码，最终打包的顺序就是你引入的顺序

## vue-tsc 生成 d.ts 文件


## 可以借助 vue-tsc 生成所有的 d.ts 文件，生成 d.ts 文件底层是调用 typescript 的 API，在 rollup 中也是一样，那些插件都是基于 ts 提供的 API 来实现的