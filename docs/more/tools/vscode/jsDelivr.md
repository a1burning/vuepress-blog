---
title: VSCode使用jsDelivr获取cdn链接
tags: 
  - VSCode
  - Tools
date: 2022-1-26
sidebarDepth: 5
---
# jsDelivr

- [官网](https://www.jsdelivr.com/)

这里面提供了npm，github和workpress的三个平台的cdn资源，cdn链接，开源，资源在中国有服务器节点，所以使用资源比较快.

## 使用场景
自己写demo的时候，不需要安装，直接发送即可

### 一、网页中搜索

1. 在搜索栏搜索

![image.png](~@public/assets/images/tools/vscode/jsDelivr1.png)

2. 点进去可以复制地址

![image.png](~@public/assets/images/tools/vscode/jsDelivr2.png)

3. 在html中直接赋值粘贴就可以运行

```html
<div id="app">
    {{ msg }}
</div>

<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js"></script>
<script>
  const vm = new Vue({
    el: '#app',
    data: {
      msg: 'Hello Vue'
    }
  })
</script>
```

### 二、VSCode安装插件

1. 商店搜索

![image.png](~@public/assets/images/tools/vscode/jsDelivr3.png)

2. `ctrl + shift + P`，输入`jsDelivr`

![image.png](~@public/assets/images/tools/vscode/jsDelivr4.png)

3. 然后输入自己要用的cdn的名称

![image.png](~@public/assets/images/tools/vscode/jsDelivr5.png)

4. 选择版本号

![image.png](~@public/assets/images/tools/vscode/jsDelivr6.png)

5. 选择对应文件

![image.png](~@public/assets/images/tools/vscode/jsDelivr7.png)

6. 选择插入方式

![image.png](~@public/assets/images/tools/vscode/jsDelivr7.png)

7. 回车就能得到想要的链接