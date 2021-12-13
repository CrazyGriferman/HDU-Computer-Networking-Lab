
---
title:  《计算机网络》 实验 6 SOCKET 网络程序设计
categories: technology
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/379601ae9af8462e92121886a451c838.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图1 实验步骤流程图

# 使用socket框架编写程序

我们这里使用的语言是html和javascript，使用web前端框架react进行客户端的编写，用nodejs进行服务端的编写。

首先使用进行服务端的编写：

输入命令: npm init -y
安装socket express包：
cnpm install socket express

编写服务端程序：

![在这里插入图片描述](https://img-blog.csdnimg.cn/6967b08c18e746f9bd055802ffafff33.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图2 服务端程序

这边可以看到是服务端向客户端发送的信息，这是当客户端向服务端发送请求的时候，服务端接受成功后后发出的信息，我们这边监听的端口号是5233（学号尾号四位）。

之后我们编写客户端的程序，核心代码：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f1f6e81646134cfdae85e40b6019ccf6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图3 客户端程序

第一行socket = io（）就是客户端向客户端建立通信连接，可以看到，我们这里是从服务端向客户端发送消息。

# 启动服务器

启动服务器后，我们可以看到客户端向服务端发送的信息 "zq 19205133 hello world":
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/abfd5727cf4243cf8c625e3b27f52d0a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图4 服务端接收到的信息

# 使用wireshark进行抓包

打开wireshark开始抓包，并且刷新网页页面，这个时候客户端向服务端再发送信息，这之后wireshark会侦测到TCP三次握手连接，并且会抓到websocket的信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d235b936f30443078bfcb11ee27fd878.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图5 wireshark抓包结果


# 对websocket信息结果分析

通过使用过滤器 websocket，我们可以过滤到websocket的信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/bd8ca8ad1c7347bda2d0d8cc7d1d48bf.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

>图6 websocket text（客户端向服务端发送的信息）

客户端会和服务端建立连接（一次握手），然后发送数据（masked是发送请求的数据包，没有masked的是服务端响应的数据）。

# 总结方法

websocket是一种在单个TCP连接上进行通信的协议，在websocket API中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。通过本次试验，我学会了基本的socket编程，对websocket协议有了进一步的了解。
