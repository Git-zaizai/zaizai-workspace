let code = (children, item) => {
  return `<ul v-if="!${item}.children.langth" class="VPDocOutlineItem nested">
    <li v-for="${item} in ${children}">
      <a class="outline-link" :href="link" @click="onClick" :title="title">{{ title }}</a>
      
    </li>
  </ul>
`
}

let children = 'children'

let link = 'link'

let title = 'link'

let yuancode = `<ul class="VPDocOutlineItem root" :class="root ? 'root' : 'nested'">
    <li v-for="{ children, link, title } in headers">
      <a class="outline-link" :href="link" @click="onClick" :title="title">{{ title }}</a>
      
    </li>
  </ul>
`

let codes = []
for (let u = 1; u <= 6; u++) {}
