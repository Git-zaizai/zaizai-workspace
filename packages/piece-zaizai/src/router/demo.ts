// @unocss-include
import type { RouteRecordRaw } from 'vue-router'

const demoRoutes: RouteRecordRaw[] = [
  {
    path: 'test',
    meta: {
      title: '测试页面',
      icon: 'i-ph-finn-the-human-fill',
    },
    component: () => import('@/views/demo/test.vue'),
  },
  {
    path: '404',
    meta: {
      title: '404',
    },
    component: () => import('@/views/common/404.vue'),
  },
  {
    path: 'MarkdownRenderer',
    meta: {
      title: 'MarkdownRenderer',
      icon: 'i-ph:markdown-logo',
    },
    component: () => import('@/views/demo/demo-markdown-renderer.vue'),
  },
  {
    path: 'loading-vue',
    meta: {
      title: '自定义Loading',
      icon: 'i-ph:spinner-bold',
    },
    component: () => import('@/views/demo/zidingyi-loading.vue'),
  },
  {
    path: 'form-v1',
    meta: {
      title: '表单-v1',
      icon: 'i-ph:waveform-fill',
    },
    component: () => import('@/views/demo/table/table-v1.vue'),
  },
  {
    path: 'form-v2',
    meta: {
      title: '表单-v2',
      icon: 'i-ph:waveform-fill',
    },
    component: () => import('@/views/demo/table/table-v2.vue'),
  },
  {
    path: 'hook-test',
    meta: {
      title: 'vue关于hook的实验',
      icon: 'i-ph:webhooks-logo',
    },
    component: () => import('@/views/demo/hook-test/index.vue'),
  },
  {
    path: 'crud',
    meta: {
      title: 'crud',
      icon: 'i-ph:at-fill',
    },
    component: () => import('@/views/demo/crud/index.vue'),
  },
  {
    path: 'icons',
    meta: {
      title: '引入icon的多种方式',
      icon: 'i-ph:intersect-duotone',
    },
    component: () => import('@/views/demo/icons.vue'),
  },
  {
    path: 'login',
    meta: {
      title: 'login',
      icon: 'i-ph:intersect-duotone',
    },
    component: () => import('@/views/components/login.vue'),
  },
  {
    path: 'upload-web',
    meta: {
      title: 'upload-web端',
      icon: 'i-ph-file-arrow-up-duotone',
    },
    component: () => import('@/views/demo/upload-web.vue'),
  },
  {
    path: 'audio-stream',
    meta: {
      title: 'audio-stream流播放',
      icon: 'i-ph-file-arrow-up-duotone',
    },
    component: () => import('@/views/demo/audio-stream.vue'),
  },
  {
    path: 'webrtc',
    meta: {
      title: 'webrtc',
      icon: 'i-ph-rocket-launch',
    },
    component: () => import('@/views/demo/webrtc/index.vue'),
  },
  {
    path: 'stream-md',
    meta: {
      title: 'stream-md',
      icon: 'i-ph:markdown-logo',
    },
    children: [
      {
        path: 'stream-md-renderer',
        meta: {
          title: '流式markdown渲染器',
          icon: 'i-ph:markdown-logo',
        },
        component: () => import('@/views/demo/chat/stream-md.vue'),
      },
      {
        path: 'chat-message',
        meta: {
          title: '聊天消息渲染器',
          icon: 'i-ph:markdown-logo',
        },
        component: () => import('@/views/demo/chat/index.vue'),
      },
    ],
  },
  {
    path: 'code-snippet',
    meta: {
      title: '代码片段',
      icon: 'i-ph-rocket-launch',
    },
    component: () => import('@/views/demo/code/index.vue'),
  },
  {
    path: 'web-vscode',
    meta: {
      title: 'vscode',
      icon: 'i-vscode-icons-file-type-vscode',
    },
    component: () => import('@/views/demo/web-vscode.vue'),
  },
  {
    path: 'select-item',
    meta: {
      title: 'select-item 拿出来做也列表',
      icon: '',
    },
    component: () => import('@/views/demo/select-item.vue'),
  },
]

export default demoRoutes
