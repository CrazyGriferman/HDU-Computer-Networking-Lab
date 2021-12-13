---
title:  《计算机网络》 实验 14 配置静态动态 NAT
categories: technology
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/21b59dd1990a4e60b98abe75fb37c359.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图1 实验步骤

# 配置实验拓扑图

![在这里插入图片描述](https://img-blog.csdnimg.cn/e70a5822f2da4735a46e4280b9419574.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图2 实验拓扑图

为了模拟“服务器”，相比以往的实验拓扑图，本实验多加了一台server，选用server-PT型号，同时交换机选用2960型号，路由选用2811型号，串口连接如下：

PC1 f0/0 -> switch1 f0/2
PC2 f0/0 -> switch2 f0/3
switch1 f0/1 -> router1 f0/0
router1 f0/1 -> router2 f0/0
router2 f0/1 -> swerver-pt f0

# 配置静态NAT

## 配置PC
首先我们配置PC网关地址和IP地址：

PC1 网关 -> 192.168.0.1
PC1 IP地址 -> 192.168.0.10
PC2 网关 -> 192.168.0.1
PC2 IP地址 -> 192.168.0.20

![在这里插入图片描述](https://img-blog.csdnimg.cn/049958d2260b47c6b8e5c075ef4e1ef9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图3 PC1 配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/b6370fbfb3b049fe995cbc2fcf9d1776.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图4 PC2 配置

## 配置路由器

首先我们配置router1的端口ip地址及默认路由：

> en
> conf t
> interface f0/0
> ip address 192.168.0.1 255.255.255.0
> no shutdown
> interface f0/1
> ip address 201.1.1.1 255.255.255.0
> no shutdown
> exit
配置内网的静态路由
> ip route 0.0.0.0 0.0.0.0 201.1.1.254

接下来配置路由器2，由于存在NAT，对于外网来说，内网的地址会被转换和隐藏。

> en
> conft
> interface f0/0
> ip address 201.1.1.254 255.255.255.0
> no shutdown
> interface f0/1
> ip address 200.1.1.1 255.255.255.0
> no shutdown

## 配置router1上的NAT转换表

配置静态NAT，其实就是配置静态映射，把内网的IP地址映射到外网去，由于是静态NAT，所以需要在router1上手动配置：

> ip nat inside source static 192.168.0.10 201.1.1.2
> ip nat inside source static 192.168.0.20 201.1.1.3

除此之外，我们还要在router1上设置好NAT的内外端口,此处f0/0为内端口，f0/1为外端口：

> interface f0/0
> ip nat inside
> interface f0/1
> ip nat outside

## 配置服务器

对于server-PT，我们也需要配置网关和IP地址：

server网关 -> 200.1.1.1
server IP地址 -> 200.1.1.10
 

至此，对于静态NAT我们配置完毕，接下来我们进行测试，看PC1和PC2能否ping通server。

# 测试通信结果

首先使用PC1 ping server：

![在这里插入图片描述](https://img-blog.csdnimg.cn/e37fb8fb01284b49bb3540b65d77b802.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图5 PC1 ping server 结果

结果可以ping通。

再使用PC2 ping server：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a1023d8df40149efa244b45979f8c16d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图6 PC2 ping server 结果

通过配置静态NAT，我们可以把Router1作为一个进出口，例如当PC1发送ping请求后，发送的数据包到达Router1之后，因为之前设置了这两条：
> ip nat inside source static 192.168.0.10 201.1.1.2
> ip nat inside source static 192.168.0.20 201.1.1.3

所以当Router1 看到数据包源地址为192.168.0.20时就会把其源地址转换为201.1.1.2，发送出去，即完成从内部IP地址转变为外部地址这个过程，PC2发数据包的时候同理，再通过router2将数据包转发，即可到达server处。

我们还可以通过使用show ip nat translations 查看NAT转换表:

![在这里插入图片描述](https://img-blog.csdnimg.cn/6f784c6d2c00495e97cce0a3467f0386.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图7 router1 NAT转换表

# 配置动态NAT

相比于静态NAT，动态NAT其实“检测”的是网段，R1可以向ISP申请地址池，通过配置IP地址池，内网指定范围的IP地址（ACL决定）可以被动态、随机地转换为合法地址。（看IP池）

## 删除静态NAT配置

由于先前我们已经配置了PC和server，对于配置动态NAT，我们得先将之前再Router1上配置的静态NAT删除：

> en
> conf t
> no ip nat inside source static 192.168.0.10 201.1.1.2
> no ip nat inside source static 192.168.0.20 201.1.1.3

## 配置IP访问控制列表

接下来，我们就要指定哪些IP地址可以被访问、转换，为此我们需要在Router1 上配置ACL：

> access-list permit 1 192.168.0.0 0.0.0.255

我们指定开头为192.168的IP地址可以被访问。

## 在R1上配置IP地址池

ACL中的IP地址都可以被转换到这个池子内的外网IP地址

> ip nat pool natpool 201.1.1.2 201.1.1.5 netmask 255.255.255.0

为了能够将内网转换为外网IP地址，我们需要将ACL和这个IP池联系起来：

> ip nat inside source list 1 pool natpool

## 测试网络通信

为了测试动态NAT是否配置成功，我将PC1的IP地址随便改了下，该成了192.168.0.130，再ping 服务器的IP地址，如果ping得通，说明我们的内网IP地址通过动态NAT 随机地被转换成了外网地址：

![在这里插入图片描述](https://img-blog.csdnimg.cn/362a5dafcfdc4a2cabee4c7a6ecc2e1a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图8 PC1 ping server结果

结果可以ping通，说明动态NAT配置成功。注意，NAT转换表提供的是“转换过程”，假如你还没有使用ping，那么你查看NAT转换表的时候是没有任何东西的。


我们可以查看此时的Router1的NAT转换表：

![在这里插入图片描述](https://img-blog.csdnimg.cn/349d0cec465d46e79517d60b9ba3292b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图9 PC1 ping之后的NAT转换表


由于IP是被动态、随机的转换的，假如我们再ping一下， 那么NAT转换表中的内容就会变化：

![在这里插入图片描述](https://img-blog.csdnimg.cn/8f06e1dc55954c98a2ee4dfc86b18125.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
图10 前后两次ping的NAT转换表对比

# 总结方法

静态NAT的配置是相对比较简单的，因为只涉及具体IP地址的转换，而动态NAT要考虑的是一个范围的IP地址，所以引入了ACL确定内网IP地址转换的范围，引入IP池确定由内网地址转换为外网IP地址的范围。
