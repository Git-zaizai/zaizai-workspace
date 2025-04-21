```js
 const mian = async () => {
  const mdRenderer = await createMarkdownRenderer()
  let res = await fetch('../public/markdown.md')
  let text = await res.text()
  let html = mdRenderer.render(text)
  document.querySelector('#app').innerHTML = html
}
mian()
```