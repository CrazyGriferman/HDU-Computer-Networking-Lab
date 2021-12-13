# 《计算机网络》 实验 6 SOCKET 网络程序设计

![在这里插入图片描述](https://img-blog.csdnimg.cn/379601ae9af8462e92121886a451c838.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤流程图

# 使用 socket 框架编写程序

我们这里使用的语言是 html 和 javascript，使用 web 前端框架 react 进行客户端的编写，用 nodejs 进行服务端的编写。

首先使用进行服务端的编写：

输入命令: npm init -y
安装 socket express 包：
cnpm install socket express

编写服务端程序：

![在这里插入图片描述](https://img-blog.csdnimg.cn/6967b08c18e746f9bd055802ffafff33.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 服务端程序

这边可以看到是服务端向客户端发送的信息，这是当客户端向服务端发送请求的时候，服务端接受成功后后发出的信息，我们这边监听的端口号是 5233（学号尾号四位）。

之后我们编写客户端的程序，核心代码：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f1f6e81646134cfdae85e40b6019ccf6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 3 客户端程序

第一行 socket = io（）就是客户端向客户端建立通信连接，可以看到，我们这里是从服务端向客户端发送消息。

# 启动服务器

启动服务器后，我们可以看到客户端向服务端发送的信息 "zq 19205133 hello world":

![在这里插入图片描述](https://img-blog.csdnimg.cn/abfd5727cf4243cf8c625e3b27f52d0a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 服务端接收到的信息

# 使用 wireshark 进行抓包

打开 wireshark 开始抓包，并且刷新网页页面，这个时候客户端向服务端再发送信息，这之后 wireshark 会侦测到 TCP 三次握手连接，并且会抓到 websocket 的信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d235b936f30443078bfcb11ee27fd878.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 wireshark 抓包结果

# 对 websocket 信息结果分析

通过使用过滤器 websocket，我们可以过滤到 websocket 的信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/bd8ca8ad1c7347bda2d0d8cc7d1d48bf.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 websocket text（客户端向服务端发送的信息）

客户端会和服务端建立连接（一次握手），然后发送数据（masked 是发送请求的数据包，没有 masked 的是服务端响应的数据）。

# 总结方法

websocket 是一种在单个 TCP 连接上进行通信的协议，在 websocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。通过本次试验，我学会了基本的 socket 编程，对 websocket 协议有了进一步的了解。
