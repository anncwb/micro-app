## 1、我需要用到微前端框架吗
目前实现微前端的主流方式有两种：iframe和微前端框架。

iframe将子应用作为一个窗口嵌入到基座应用中，由于需要初始化整个window，所以性能不好，又因为需要指定宽高，导致出现双滚动条和弹窗无法覆盖全局的问题，当然还有其它一些问题，但iframe依然是最稳定，上手难度最低的方案。

微前端框架是将子应用的静态资源加载到基座应用进行执行和渲染，所以本质上是一个页面。它可以避免iframe存在的各种问题，但有上手难度，需要对框架、路由运行原理有一定了解。

总结下来，iframe更加稳定，微前端框架上限更高。如果是比较简单、对渲染速度不敏感的页面，可以使用iframe。如果页面比较复杂，对渲染速度有一定要求，推荐使用微前端框架。当然如果你喜欢折腾，也推荐使用微前端框架，它会帮助你更好的理解路由和框架原理。

以上只是我们的建议，没有完美的方案，适合自己的就是最好的。

## 2、子应用静态资源一定要支持跨域吗？
是的！

如果是开发环境，可以设置headers支持跨域。
```js
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
},
```

如果是线上环境，可以通过[配置nginx](https://segmentfault.com/a/1190000012550346)支持跨域。

## 3、微应用无法渲染但没有报错
请检查路由配置是否正确，详情查看[路由](/zh-cn/route)一章。

## 4、开发时每次保存文件时报错 (热更新导致报错)
在一些场景下，热更新会导致保存时报错，请关闭热更新来解决这个问题，同时我们也在尝试更好的解决方案。

## 5、webpack jsonpFunction 冲突导致渲染失败
  这种情况常见于基座应用和子应用都是通过create-react-app等类似脚手架创建的项目。

  如果基座应用和子应用在配置webapck时具有相同的jsonpFunction名称，会导致资源加载混乱。

  解决方式：这种方式通常可以通过修改基座应用或子应用的package.json中的name值解决。
  
  如果上述方法无法解决，需要手动修改webpack配置。
  ```js
  // webpack.config.js
  module.exports = {
    ...
    output: {
      jsonpFunction: `webpackJsonp_自定义名称`,
    },
  }
  ```

## 6、vue3的问题
**1、样式失效**

vue3中样式失效的问题可以尝试配置[macro](/zh-cn/configure?id=macro)解决，如果依然有问题，可以通过[关闭样式隔离](/zh-cn/configure?id=disablescopecss)解决。

**2、图片等静态资源无法正常加载**

vue3中需要配置publicPath补全资源地址，详情请查看[public-path](/zh-cn/static-source?id=手动补全)


## 7、开发环境中渲染angular子应用报错
目前需要关闭angular的热更新来解决这个问题，同时我们也在尝试更好的解决方案。
```bash
"scripts": {
  "start": "ng serve --live-reload false",
},
```

## 8、Micro App 报错 an app named xx already exists
这是`name`名称冲突导致的，请确保每个子应用的`name`值是唯一的。

## 9、基座应用的样式影响到子应用
虽然我们将子应用的样式进行隔离，但基座应用的样式依然会影响到子应用，如果发生冲突，推荐通过约定前缀或CSS Modules方式解决。

如果你使用的是`ant-design`等组件库，一般会提供添加前缀进行样式隔离的功能。

## 10、兼容性如何
`Micro App`是依赖于CustomElement和Proxy的，这意味着我们不再兼容IE。

浏览器兼容性查看：[Can I Use](https://caniuse.com/?search=customElement)

## 11、支持vite吗
支持，详情请查看[适配vite](/zh-cn/other?id=_3、适配vite)

## 12、子应用在沙箱环境中如何获取到外部真实window？
  目前有3种方式在子应用中获取外部真实window
  - 1、new Function("return window")() 或 Function("return window")()
  - 2、(0, eval)('window')
  - 3、window.rawWindow

## 13、错误信息 `ReferenceError: xxxx is not defined`
  在微前端的沙箱环境中，顶层变量不会泄漏为全局变量。

  例如在正常情况下，通过 var name 或 function name () {} 定义的顶层变量会泄漏为全局变量，通过window.name或name就可以全局访问。但是在微前端环境下，所有js都会放入一个沙箱函数中运行，导致这些顶层变量无法泄漏为全局变量，从而导致上述问题。

  解决方式：通过 window.name = xx，明确声明全局变量。

## 14、子应用加载sockjs-node失败
  这个问题常见于create-react-app创建的子应用，推荐通过插件系统来解决。
```js
microApp.start({
  plugins: {
    modules: {
      '子应用name': [{
        loader(code) {
          if (code.indexOf('sockjs-node') > -1) {
            code = code.replace('window.location.port', '子应用端口').replace('window.location.hostname', '子应用host，如果和基座相同则不需要替换hostname')
          }
          return code
        }
      }],
    }
  }
})
```
实际情况可能更加复杂，上面只是一种解决思路。
