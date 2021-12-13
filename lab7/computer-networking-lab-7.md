---
title:  《计算机网络》 实验 7 ARP协议分析
categories: technology
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/c2391e79c9c4413e9b3e73cae37604aa.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
> 图1 实验步骤

# 设置实验环境

我这里用的是本地WIFI，然后启动VMware虚拟机，以下分别是mac主机和VMware虚拟机的IP地址：

![在这里插入图片描述](https://img-blog.csdnimg.cn/714597eab45e4f1790beedb47d55da71.png)
 
> 图2 mac主机IP地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/e856e2b9db084872bcabe4cdf893bba7.png)
 
> 图3 VMware ubuntu虚拟机IP地址

接下来我们在wireshark中选择vmnet8 网卡进行抓包，这是虚拟机上的网卡。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e9ef93e00512408e96ce6074e28e3d0e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图4 vmnet8网卡抓包

就此，初始实验环境设置完毕。

# 使用wireshark进行抓包

ARP协议是根据IP地址获取物理地址的一个TCP/IP协议。

当PCA想和PCB进行通信的时候，需要同时知道PCB的IP地址和MAC地址，而在广播的时候，往往只知道IP地址，不知道物理MAC地址。所以这个时候就要通过ARP协议进行分析，获取IP地址对应的物理MAC地址。那么我们可以在ubuntu虚拟机上对mac主机的IP地址ping，因为这个时候虚拟机只知道IP地址，所以ARP协议就会来帮忙解析，获取对应的物理MAC地址。

我们先启动wireshark抓包，然后在ubuntu虚拟的控制台中输入 ping 172.16.246.1，这个时候wireshark就会抓到ARP数据包，一次一共有两条，分别是请求和回应。

![在这里插入图片描述](https://img-blog.csdnimg.cn/b2dc18ce306e4b76b7b758bdb89450fb.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图5 wireshark捕获ARP数据包

接下来我们分析ARP协议的报文格式

# 了解ARP报文格式

![在这里插入图片描述](https://img-blog.csdnimg.cn/4372e3e677f44a6487918a64d0549fc8.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)


> 图6 ARP报文格式

硬件类型：表明ARP协议实现在哪种类型的网络上；
协议类型：表示解析协议（上层协议）；
硬件地址长度：即MAC地址长度，此处为6个字节；
协议地址长度：IP地址长度，此处为4个字节；
操作类型：表示ARP协议数据类型。1表示ARP协议请求，2表示ARP协议应答；
源MAC地址：发送端MAC地址
源IP地址：发送端IP地址
目标MAC地址：接收端MAC地址
目标IP地址：接收端IP地址

了解了ARP报文格式之后，我们就可以对捕获到的ARP数据包进行分析。

# 对抓到的ARP数据包进行具体分析

首先我们分析ARP请求包

![在这里插入图片描述](https://img-blog.csdnimg.cn/06c8b5da93304182b47fb00d453bae8d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图7 ARP请求包 第一帧

Frame 1表示第一帧数据包，提供了一些基本信息，如封装类型、到达时间等。

![在这里插入图片描述](https://img-blog.csdnimg.cn/4ac1bb38578841269ea1d279ab5ec1d6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图8 ARP请求包 以太网帧

方框内容表示以太网帧的头部信息，其中源MAC地址为：00:50:56:c0:00:08，目标MAC地址为ff:ff:ff:ff:ff:ff，后者表示广播地址，表示局域网中的所有设备都会收到该数据包。

![在这里插入图片描述](https://img-blog.csdnimg.cn/00afe007a1bb42f3a0a9504aab6a02f0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图9 ARP请求包 地址解析协议内容

可以看到，request表示“请求”，硬件类型为以太网，协议类型为IPV4，硬件地址长度6位，协议长度4位，操作码为1，表示这是ARP请求包，发送端的MAC地址为00:0c:29:71:f8:94，发送端的IP地址为：172.16.246.128，接收端的MAC地址为00:00:00:00:00:00，接收端的IP地址为172.16.246.1。

下面分析ARP接收包的内容：

![在这里插入图片描述](https://img-blog.csdnimg.cn/271b3712c4cd41cbaf9f4995ef037313.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图10 ARP请求包 第一帧

Frame 1表示第一帧数据包，长度为42bytes。

![在这里插入图片描述](https://img-blog.csdnimg.cn/57c3bda9e883407487858115611108ca.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图11 ARP请求包 以太网帧

方框内容表示以太网帧的头部信息，其中源MAC地址为：00:50:56:c0:00:08，目标MAC地址为00:0c:29:71:f8:94，说明我们找到了目标IP地址对应的MAC物理地址，Great！

![在这里插入图片描述](https://img-blog.csdnimg.cn/1781b408942745d5bdeceecc3b3b415f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图12 ARP请求包 地址解析协议内容

可以看到，reply表示“接收”，硬件类型为以太网，协议类型为IPV4，硬件地址长度6位，协议长度4位，操作码为1，表示这是ARP请求包，发送端的MAC地址为00:50:56:c0:00:08，接收端的IP地址为172.16.246.1, 接收的MAC地址为00:0c:29:71:f8:94，接收的IP地址为：172.16.246.12。

# 总结方法

要想捕捉到ARP协议，请求包一定是广播，因为你不知道IP地址对应的物理地址在哪里，要想达到这个目的，要么是局域里有人发广播，要么是你本地通过虚拟机往自己主机发送请求。
