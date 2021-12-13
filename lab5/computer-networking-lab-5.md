# 《计算机网络》 实验 5 DNS 域名服务器安装配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/4447dc3b14e745c28a9701a20951cdc9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤流程图

# 安装 DNSmasq（配置工具）

DNSmsq 是一个小巧且方便地用于配置 DNS 和 DHCP 的工具，适用于小型网络，它提供了 DNS 功能和可选择的 DHCP 功能。它服务那些只在本地适用的域名，这些域名是不会在全球的 DNS 服务器中出现的，我们使用 brew install DNSmasq 进行安装。

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc85bc36910541d0b72e9763ed720e8e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 DNSmasq 官网介绍

# 对配置文件进行改写，添加顶级域名 test。

安装好之后新建文件夹: sudo mkdir /etc/resolver，这步的作用是配置额外的解析器。
在该文件夹下添加文件 test（顶级域名，可以修改为其它域名），在该文件添加 nameserver 127.0.0.1，然后输入:wq 保存，这样的话只要你使用 ping \*.test，最后都会重定向到 127.0.0.1。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e6aa7de8cc014fe695aa5d235244da01.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 3 配置顶级域名 test

# 在网络中添加 DNS 服务器 127.0.0.1

我们需要在设置中添加 DNS 服务器，这样才能通过.test 来重新定向到 127.0.0.1。

![在这里插入图片描述](https://img-blog.csdnimg.cn/7a3e8b2ca0c34383b44513d9305d5185.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 在设置-网络中设置 DNS 服务器

# 重启服务，使用 ping 命令测试

使用 sudo brew services restart dnsmasq，在终端中进行 ping 测试，输入 zq.test(顶级域名为.test)，输入后通过 DNS 解析会重新定向到 127.0.0.1。

![在这里插入图片描述](https://img-blog.csdnimg.cn/84064cf5c2a44f889c9d16599ad507f6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 使用 ping 命令进行测试

# 总结域名服务器的应用场景

在实际的本地开发中，我们常常需要用手机进行移动端的测试，这时 dns 服务就起到非常关键的作用。在同一个 wifi 中，通过配置 dns 域名进行 ip 地址的重定向，这样你手机输入 dns 域名后，也可以访问相应的网址。

DNS 服务有点像生活中的道路指示牌，如果我们的网络中没有 DNS 服务器，那么我们只能通过输入 ip 地址访问网址，这样是非常不便于我们浏览日常网页的，有了 dns 服务，我们可以通过输入人类可以记住的域名，从而访问特定的网站。
