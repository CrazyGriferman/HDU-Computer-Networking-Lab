# 《计算机网络》 实验 2 wireshark 实验

# 设定实验环境

## 安装并打开 wireshark：

![在这里插入图片描述](https://img-blog.csdnimg.cn/28c6cdbad3bb412f9070423aff0a5946.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 wireshark 界面

## 连接网络

![在这里插入图片描述](https://img-blog.csdnimg.cn/bf861d922b7f46daa101fdc14a5b42e5.png)

> 图 2 实验环境拓扑图(主机-路由器-因特网)

## 选取http://www.hdu.edu.cn/ 以及https://www.stanford.edu/ 作为目标抓包网址；

![在这里插入图片描述](https://img-blog.csdnimg.cn/8728f16ba71d4946b0e0617e27d08505.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 3 杭电和斯坦福大学官网

# wireshark 使用

## 分析实例一: 杭电官网

### 设置过滤规则

![在这里插入图片描述](https://img-blog.csdnimg.cn/56270eec1f1a428db02dc9a9009b1914.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

### 分析三次握手过程

![在这里插入图片描述](https://img-blog.csdnimg.cn/89248ab6354a4d43b85c2e908ec7596a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 进入http://www.hdu.edu.cn 后截获的三次握手过程

当我们输入网址进入杭电官网的时候，客户端会向服务端先发送一个 SYN 包（synchronized message），由于一般网站服务都是开在 80 端口，所以可以看到后面的 info 是从 50397 -> 80，这个 80 就是指杭电官网的端口。我们点进第 249 条记录后可以看到在在传输层（这里用的是 TCP 协议）中，sequence number 变为 0，这里就表示我们的客户端已经像服务端发送 SYN 包了，就等服务端反应了。

![在这里插入图片描述](https://img-blog.csdnimg.cn/315369df660a410ab71ad4906e884ead.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 第一次握手记录 (Flag 提示为 SYN)

之后，服务端会向客户端发送一个 SYN 包并附带一个表示确认已经收到了 SYN 包的 ACK（acknowledge）包，在 wireshark 中就会提示 [SYN, ACK]状态。

![在这里插入图片描述](https://img-blog.csdnimg.cn/aac77afa4fe644818d3110ba3608fff5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 第二次握手记录 (Flag 提示为 SYN,ACK)

最后客户端会像 server 端发送一个 ACK 包，这个时候客户端和服务端就建立起了 TCP 连接。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c7a5c4777e5f4d8e904588948678d1e4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 7 第三次握手记录(Flag 提示为 SYN, ACK)

### IP 数据包格式分析

在抓到的每个包中，我们可以看到有一个"Internet Protocol"的栏目， 点进去可以看到 IP 报文的各个部分参数，例如对图 7 中 IP 数据包进行报文分析。
首先可以看到版本号为 4，说明该是 IPv4，报头长度为 5，总长度为 52，标识符为 0。Flags 为 3 比特，此处为 0x40。Fragment Offset 为分段偏移，此处为 0。TTL 为 64，这是防止 IP 包在传输中发生死循环所设置的。由于使用了 TCP，所以 Protocol 为 6。Header Checksum 为报头校验和，长度 16 位。之后的 Source Address 和 Destination Address 分别为源/目标地址，可以看到我们主机使用的 IP 地址为 10.66.111.226,而目标地址为 192.168.102.6。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9b7d85881ef642bfbc72b2494ccf24ae.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 8 IP 数据包具体参数

### 捕获完整 HTTP、ping 数据流

只要在过滤规则中添加 http，即可捕获完整 HTTP 数据流。

![在这里插入图片描述](https://img-blog.csdnimg.cn/dc645f669b764a728189322f895cef2c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 9 HTTP 数据流

要想捕获 ICMP 数据流，需要在终端中对目标网站进行 ping 指令操作（图 10），在 mac 上打开终端，输入 ping hdu.edu.cn，此时打开 wireshark 进行捕获，即可捕获到 ICMP 数据流（图 11）。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d047f877661044f182f3f6d6c3378c56.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 10 终端执行 ping hdu.edu.cn 后的结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/f2997c594cbe4b04ae229031b25d3826.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 11 ICMP 数据流

## 分析实例 2: 斯坦福大学官网

由于过程分析大同小异，对于第二个案例只展示结果。

### 设置过滤规则

![在这里插入图片描述](https://img-blog.csdnimg.cn/373042cef32741338e5bb9b17da5a1ea.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

### 三次握手过程

注：由于使用了 VPN，所以 IP 地址发生了变化:

![在这里插入图片描述](https://img-blog.csdnimg.cn/a16122943f7744f399756d6704c51bdf.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 12 第一次握手

![在这里插入图片描述](https://img-blog.csdnimg.cn/c1014559c49e483cad632e518e5ba8ca.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 13 第二次握手

![在这里插入图片描述](https://img-blog.csdnimg.cn/8f768be1f2174cf993f1414031fe7a93.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 14 第三次握手

### IP 数据包格式分析

虽然是访问外网，但这个数据包也是 IPV4，大致没有什么区别，版本号为 4，报头字节长度为 20，总长度为 64，标示符为 0，标记为 0x40，分段偏移为 0，TTL 为 64，用的是 TCP 协议，协议号为 6，报头校验和为 0x7204，源地址为 10.66.111.226，目标地址为 59.111.19.33。

![在这里插入图片描述](https://img-blog.csdnimg.cn/23c4050456d84e09b2e8883099716ccf.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 15 IP 数据包格式分析

### 捕获完整 HTTP、ping 数据流

![在这里插入图片描述](https://img-blog.csdnimg.cn/a2624ddf1feb4bd384007f65a4c666ad.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 16 HTTP 数据流

![在这里插入图片描述](https://img-blog.csdnimg.cn/1803b7cca2ed4567a99679bdd3aeaf14.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 17 ICMP 数据流

# 实验总结：

## 遇到的问题

1. Mac 上 wireshark 打开无法抓包报错：
   The capture session could not be initiated on interface 'en0' (You don't have permission to capture on that device.)
   原因：没有权限查看/dev/bfp* 文件夹造成。
   解决办法：
   打开终端输入 sudo chmod o+r /dev/bpf*

2. 访问斯坦福大学网站的时候，抓包的时候捕获不到 http 数据流
   解决办法：挂 VPN 再进行捕获，此时源 IP 地址发生变化。

## 思考问题

1. 实验所用主机的 IP 地址、子网掩码、网络号、子网号分别是多少？该主机的 IP 地址属于哪类？
   主机的 IP 地址为 10.66.111.226，子网掩码为 255.255.192.0，网络号为 10.66.64.1，子网号为 10.66.64.0。主机的 IP 地址属于 IPv4。
2. IP 数据包在从源主机出发目的主机的过程中，IP 首部中的 IP 源地址和目的地址字段是否发生变化？
   没有变化。在 IP 数据包发送之前，网络层就已经对 IP 地址进行了封装，确定了源地址和目标地址，至于如何从源地址到目标地址，是通过 packet switching 这个过程完成的。简单来说，每个“站点”其实都有一张表，告诉这个包要发送到哪个地址，因而每次包交换的过程都是独立的，表上的地址也是独立的。

## 收获和体会

做了本次实验，特别是利用终端 traceroute 了一下国内是如何访问国外网站的，虽然有很多地方被屏蔽了，但可以看到计算机网络的神奇之处。例如我访问布朗大学官网的时候，经过了中国、圣荷西（一个城市）、纽约、波士顿，最终到达布朗大学某个实验室。在数据抓包的时候，我发现一直有个 HangZhou_3a 在发 Who has .... tell 10.66.64.2，目的地显示的是 broadcast，就很神奇，竟然没有目标地址，不知道是怎么做到的。其次通过这次实验，了解了三次握手的基本过程，感觉收获还是挺大的
