# 代码片段

## 获取元素

```ts
// 等待元素出现
function queryElement(id: string): Promise<Element> {
  return new Promise(resolve => {
    let timer = null
    const run = () => {
      // 进来获取一次，查看是否有元素
      let element = document.querySelector(id)
      if (element) {
        clearInterval(timer)
        resolve(element)
      } else if (timer === null) {
        // 没有元素，同时没有定时器，开启定时器
        // 定时器中，再次获取元素，查看是否有元素
        timer = setInterval(() => {
          element = document.querySelector(id)
          if (element) {
            clearInterval(timer)
            resolve(element)
          }
        }, 0)
      }
    }
    // 判断是否支持 requestAnimationFrame
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(run)
    } else {
      timer = setInterval(run, 0)
    }
  })
}
```

## 获取元素宽高

```ts
function getElementSize(element) {
  if (element.getBoundingClientRect) {
    const rect = element.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height,
    }
  } else if (typeof element.offsetWidth !== 'undefined') {
    return {
      width: element.offsetWidth,
      height: element.offsetHeight,
    }
  }
  return {
    width: null,
    height: null,
  }
}
```

## 获取元素几何信息

```ts
function getElementGeometry(element) {
  if (element.getBoundingClientRect) {
    return element.getBoundingClientRect()
  } else if (typeof element.offsetWidth !== 'undefined') {
    let geometry = {
      width: null,
      height: null,
      top: null,
      left: null,
      right: null,
      bottom: null,
    }
    geometry.width = element.offsetWidth
    geometry.height = element.offsetHeight
    let currentElement = element
    geometry.top = 0
    geometry.left = 0
    while (currentElement) {
      geometry.top += currentElement.offsetTop
      geometry.left += currentElement.offsetLeft
      currentElement = currentElement.offsetParent
    }
    geometry.right = geometry.left + geometry.width
    geometry.bottom = geometry.top + geometry.height
    return geometry
  }
}
```