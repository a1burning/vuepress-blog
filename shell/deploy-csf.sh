#!/usr/bin/env bash
# 在这里编写项目的提测脚本
#!/bin/sh
rm -rf docs/.vuepress/dist

name=vuepress-blog
echo building project $name:
# 打包
npm run docs:build
# 发布
rsync -arz docs/.vuepress/dist/ root@www.hu77.top:/root/home/$name/

echo you can visit http://blog.hu77.top/
