---
title: Prettier
tags: 
  - 前端工程化
  - 模块化开发
prev: false
next: false
sidebarDepth: 5
---

是近期使用频率非常多的一款前端代码格式化工具，很强大，几乎可以完成前端所有代码的格式化工作。在日常使用中，也可以使用他完成代码的格式化，或者针对markdown进行格式化。

1. 下载模板
2. 安装模块`npm i prettier -D`并执行命令`npx perttier style.css`文件
3. 可以看到被格式化的代码已经输出到命令行中，这是默认的输出方式。
4. 使用`npx perttier style.css --write`可以自动格式化之后覆盖源文件。
5. 匹配文件可以使用通配符的方式，例如我们匹配所有文件`npx perttier . --write`就可以一次性将所有文件格式化。

不过还是希望大家不要依赖工具去写出良好的代码，因为在编码的时候本身就应该遵守这些格式。