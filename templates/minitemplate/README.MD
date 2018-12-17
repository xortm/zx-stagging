> 目录结构

├── config　　　　　　　　　　　　# 配置文件

├── dist　　　　　　　　　　　　　　# 最终生成目录

├── node_modules　　　　　　　　 # npm依赖包

├── src　　　　　　　　　　　　　　# 开发目录

│ ├── common　　　　　　　　　　　# 公共文件

│ │ ├── api　　　　　　　　　　　 # 接口

│ ├── components　　　　　　　　 # 组件

│ ├── core　　　　　　　　　　　　 # 微信原生方法封装（此文件内 不得与业务逻辑有关）

│ ├── pages　　　　　　　　　　　　# 业务文件

├── .babelrc　　　　　　　　　　　 # babel 配置文件

├── .eslintrc　　　　　　　　　　　# eslint 配置文件

├── .gulpfile.babel.js　　　　　 # gulp task文件

├── package.json　　　　　　　　　# npm 配置文件

> 简述

此框架主要解决原生框架不足之处，不增加额外API。

**核心思想 简洁 有序 满足需求 不增加额外学习成本**

> 新增功能

1. 支持通过npm安装包依赖
2. 支持配置环境变量

> 注意事项

1. core文件中为微信核心API的二次封装，及一些工具方法，不得有与业务逻辑有关的代码存在(之后会单独打包)
2. common文件中为与业务逻辑有关的公共方法
3. 微信小程序开发者工具要指向 dist目录
4. 样式支持less写法
5. 样式中的url 使用绝对路径即可 打包时自动会加上图片地址
6. pages中只存放底导首页页面，其余页面按路径放在packageSub中

> 使用方法

```
npm i # 安装依赖包
```

```
npm run watch:dev # 开发环境
```

```
npm run build:production #打包发布
```
