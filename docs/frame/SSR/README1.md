---
title: SSR Q&A
tags: 
  - SSR
prev: false
next: false
sidebarDepth: 5
---

## 是否可以将一个简单的 vue 项目改造成服务端渲染首页，其他界面仍然使用客户端渲染？

答：是可以做到的，但是不建议在使用 VueCLI 创建的项目中改造集成 Vue SSR 的支持，因为你发现改造到最后相当于手动重新搭建了一个。

所有建议做法是：

- 手动搭建 Vue SSR 开发环境，就像课程中那样。
- 使用 NuxtJS 开发框架（推荐），即便是把一个已有的 Vue.js 普通项目移植为 NuxtJS 成本也很低。

如果你的首页中没有需要动态变化的数据，可以考虑使用预渲染的方案：[https://github.com/chrisvfritz/prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin)。 

所谓的预渲染指的就是提前把组件编译为纯静态的 HTMl 文件。反之，如果有动态数据内容，则必须用正经的服务端渲染了。