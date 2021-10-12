---
title: Git Hooks
tags: 
  - 前端工程化
  - 模块化开发
prev: false
next: false
sidebarDepth: 5
---

如果团队中某个成员没有按照要求使用lint工具，在代码提交至仓库之前未执行lint工作，把有问题的代码提交到了远程仓库。

如果口头约定让大家进行lint操作只是形式，所以可以**通过Git Hooks在代码提交前强制lint**

## Git Hooks介绍
- Git Hooks也称之为git钩子，每个钩子都对应一个任务，比如commit，push
- 通过 shell脚本可以编写钩子任务触发时要具体执行的操作

## Git Hooks工作机制
1. 创建一个文件夹`githooks-sample`，然后使用`git init`初始化一个仓库
2. 在`.git/hooks/`中有很多的`.sample`文件，每一个sample就是一个钩子。
3. 我们需要重点关心`pre-commit.sample`的钩子，它对应的就是我们的commit操作，当我们触发commit操作的时候就可以触发里面的任务。
4. 在`.git/hooks/`中新建一个文件，名为`pre-commit`，写测试代码

```js
#!/bin/sh
echo "before commit"
```
5. 在`githooks-sample`中创建`demo.txt`文件

```bash
touch demo.txt
vim demo.txt
```
随便编辑一些东西，保存之后git提交到本地
```bash
$ git commit -m '2222'
# 这里可以看到pre-commit里面的代码输出了。
before commit
[master (root-commit) 6f48ff4] 2222
 1 file changed, 1 insertion(+)
 create mode 100644 demo.txt

```
这样我们就可以在钩子执行的时候定义一些我们要执行的任务。我们就可以在commit之前强制执行lint操作。

## ESLint 结合 Git Hooks
面临的问题：
很多前端开发者并不擅长使用shell脚本来编写功能，所以 有人开发了一个npm模块 —— **Husky**
### Husky
Husky可以实现在不编写脚本的情况下也可以直接使用Git Hooks带来的一些功能。

1. 安装eslint`npm i eslint -D`并初始化，安装模块`npm install husky -D`，在`.git/hooks/`中我们可以看到文件中有很多自定义的钩子

![image](~@public/assets/program/modules/githooks1.png)

2. 准备文件index.js

```js
const a=1;
```
3. 在package.json中填写配置

```js
{
  ...
  "scripts": {
    "test": "eslint index.js"
  },
  ...
  "husky":{
  // 钩子对象里面写对应的任务
    "hooks": {
      "pre-commit": "npm run test"
    }
  }
}

```
3. 写`.gitignore`把`node_modules`忽略，进行git提交`git commit -m 'commit lint'`，可以看到eslint有输出，这样代码就不会直接提交到仓库中了。


![image](~@public/assets/program/modules/githooks2.png)

但是如果我们除了在提交前检查完eslint还要进行格式化，那这个husky就不够用了。需要另一个插件 —— lint-staged
### lint-staged

1. 安装模块 `npm i lint-staged -D`，在安装格式化工具`npm i prettier -D`
2. 在package.json中进行配置选项

```js
{
  ...
  "scripts": {
    "test": "eslint index.js",
    // 这里使用命令
    "precommit": "lint-staged"
  },
  ...
  "husky": {
    "hooks": {
      // 这里执行precommit命令
      "pre-commit": "npm run precommit"
    }
  },
  "lint-staged": {
    // 这里要进行严格的语法配置，值是一个数组，依次执行命令
    "*.js": [
      "eslint",
      // 这里执行eslint之后执行perttier
      "prettier"
    ]
  }
}

```

3. an在命令行中提交代码就可以看到先执行eslint，之后执行prettier

![image](~@public/assets/program/modules/githooks3.png)

这里旨在演示怎么用，具体的东西还需要查阅相关文档。