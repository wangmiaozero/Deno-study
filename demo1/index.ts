/*
 * @Description: 
 * @Version: 1.0
 * @Autor: wangmiao
 * @Date: 2020-05-26 11:13:53
 * @LastEditors: wangmiao
 * @LastEditTime: 2020-05-26 11:25:54
 */ 

import { serve } from "https://deno.land/std@0.50.0/http/server.ts";
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
/* 使用 deno run --unstable index.ts 输出的结果是 117，使用 deno run index.ts 输出的结果是 88 。说明稳定的 api 有 88 个，不稳定的有 29 个。 */
console.log(Object.keys(Deno).length)
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}

/*  1.如果直接执行 deno run index.ts, 会报错：error: Uncaught PermissionDenied: network access to "0.0.0.0:8000", run again with the --allow-net flag */
/*  2.所以我们很自然的就会在启动命令的最后加上 --allow-net ，如下：deno run index.ts --allow-net */
/*  3.但是，这样仍然会报错。查了资料才知道 ，--allow-net 、--allow-read 之类的标志是不可以放到文件名后面的，必须紧跟在 deno run 后面，比如，如下才是正确的：deno run --alow-net index.ts */
/*  4. 为什么调换了位置就不行呢？ issue 上的回答是，如果 --allow-net 跟在文件名后面，是传给 js  脚本的，而不是传给 deno 的。想了解更多的，可以看这个 confused by order of cli option flags。反正，记住一点就行：权限标志一定要跟在 deno run 后面！不太清楚安全的重要性，为了避免遇到各种权限问题，我建议平时在写一些练手项目时，直接用 deno run -A 来启用全部的权限。（这只是方便调试，在生产环境中一定要慎用！） */
/* 5.因为实战过程中使用了 mongodb , 所以需要引入 Deno 的第三方模块 mongo，然而在启动项目会报错：error: TS2339 [ERROR]: Property 'openPlugin' does not exist on type 'typeof Deno'.
 */
/* 6.查了一下，发现是因为 openPlugin 这个方法目前还不稳定。默认情况下，deno 只会提供稳定的 api。如果需要开启不稳定 api，可以添加 --stable 标志。比如： deno run -A --unstable index.ts
*/

/* 
  7.如何管理版本？
刚开始我也很疑惑：没有了 package.json， 那怎么控制各依赖的版本呀？比如，我们有10个文件都依赖了 mongo@v0.0.6, 那每个文件都使用以下代码进行引入： import { init, MongoClient } from 'https://deno.land/x/mongo@v0.6.0/mod.ts'

*/
/* 
  8.可是有一天，我突然想把 0.6.0 升级到 0.7.0, 那怎么办呢？一个个文件的进行替换容易漏掉，当然也可以全局搜索批量替换 。但是这种效率都不是很高。
官方给出的推荐做法是，使用 deps.ts 文件来引入远程文件，并管理版本。（当然 ，文件名称不一定叫做 deps.ts, 你也可以改成其他的名称）。具体做法就是，把所有用到的远程依赖，都在 deps.ts 中引入 ，并且通过  Re-export 手段导出各依赖，然后其他文件就可以从 deps.ts 中拿到所需要的依赖了。
回到刚才说10个文件都依赖到 mongo 的问题，如果改成 deps.ts 文件来统一管理是这样的：
*/