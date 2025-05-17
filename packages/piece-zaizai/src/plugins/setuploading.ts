import { getCurrentTheme } from '@/utils/initTheme'

export function setuploading(show = false) {
  const html = `<svg class="truck" style="width:12em" viewBox="0 0 48 24" width="48px" height="24px">
        <g fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            transform="translate(0,2)">
            <g class="tt-bb">
                <g stroke-dasharray="105 105">
                    <polyline class="tt-oo1" points="2 17,1 17,1 11,5 9,7 1,39 1,39 6" />
                    <polyline class="tt-oo2" points="39 12,39 17,31.5 17" />
                    <polyline class="tt-oo3" points="22.5 17,11 17" />
                    <polyline class="tt-ww1" points="6.5 4,8 4,8 9,5 9" />
                    <polygon class="tt-ww2" points="10 4,10 9,14 9,14 4" />
                </g>
                <polyline class="tt-ll" points="43 8,31 8" stroke-dasharray="10 2 10 2 10 2 10 2 10 2 10 26" />
                <polyline class="tt-ll" points="47 10,31 10" stroke-dasharray="14 2 14 2 14 2 14 2 14 18" />
            </g>
            <g stroke-dasharray="15.71 15.71">
                <g class="tt-ee">
                    <circle class="tt-ee-spin" r="2.5" cx="6.5" cy="17" />
                </g>
                <g class="tt-ee">
                    <circle class="tt-ee-spin" r="2.5" cx="27" cy="17" />
                </g>
            </g>
        </g>
    </svg>`

  let lacalTheme = getCurrentTheme()

  // 有些浏览器主题自动切换不大标准，已手动设置为准
  let appStore: any = localStorage.getItem('zai-app-store')
  if (appStore) {
    appStore = JSON.parse(appStore)
    if (lacalTheme !== appStore.theme) {
      lacalTheme = appStore.theme
    }
  }

  const cssVars = `
	--zai-loading-bg:${lacalTheme === 'dark' ? 'rgb(24, 24, 28)' : '#fff'};
	--zai-loading-color: ${lacalTheme === 'dark' ? '#63e2b7' : '#18a058'};`

  const element = document.createElement('div')
  element.innerHTML = html
  const app = document.querySelector('#app-loading') as HTMLElement
  app.style.cssText = cssVars
  app.appendChild(element)
  const Observer = new MutationObserver(() => {
    setTimeout(() => {
      app.style.display = 'none'
    }, 700)
  })

  Observer.observe(document.querySelector('#app'), { childList: true, subtree: true })

  if (show) {
    app.style.display = 'none'
  }

  // 随便在做一下 body 的初始化
  if (lacalTheme === 'dark') {
    document.body.style.backgroundColor = 'rgb(24, 24, 28)'
    // document.documentElement.classList.add('vitepress-dark')
  } else {
    document.body.style.backgroundColor = '#fff'
    // document.documentElement.classList.remove('vitepress-dark')
  }
}

setuploading()
