---
title:  《计算机网络》 实验 2 wireshark实验
categories: technology
---

# 设定实验环境

## 安装并打开 wireshark：
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/28c6cdbad3bb412f9070423aff0a5946.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图1 wireshark界面

## 连接网络
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/bf861d922b7f46daa101fdc14a5b42e5.png)
 
> 图2 实验环境拓扑图(主机-路由器-因特网)

## 选取http://www.hdu.edu.cn/ 以及https://www.stanford.edu/ 作为目标抓包网址；
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/8728f16ba71d4946b0e0617e27d08505.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图3 杭电和斯坦福大学官网

# wireshark使用

## 分析实例一: 杭电官网

### 设置过滤规则

![在这里插入图片描述](https://img-blog.csdnimg.cn/56270eec1f1a428db02dc9a9009b1914.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

### 分析三次握手过程

![在这里插入图片描述](https://img-blog.csdnimg.cn/89248ab6354a4d43b85c2e908ec7596a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图4 进入http://www.hdu.edu.cn 后截获的三次握手过程

当我们输入网址进入杭电官网的时候，客户端会向服务端先发送一个SYN包（synchronized message），由于一般网站服务都是开在80端口，所以可以看到后面的info是从50397 -> 80，这个80就是指杭电官网的端口。我们点进第249条记录后可以看到在在传输层（这里用的是TCP协议）中，sequence number变为0，这里就表示我们的客户端已经像服务端发送SYN包了，就等服务端反应了。
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/315369df660a410ab71ad4906e884ead.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图5 第一次握手记录 (Flag 提示为 SYN)

之后，服务端会向客户端发送一个SYN包并附带一个表示确认已经收到了SYN包的ACK（acknowledge）包，在wireshark中就会提示 [SYN, ACK]状态。

![在这里插入图片描述](https://img-blog.csdnimg.cn/aac77afa4fe644818d3110ba3608fff5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图6 第二次握手记录 (Flag提示为 SYN,ACK)

最后客户端会像server端发送一个ACK包，这个时候客户端和服务端就建立起了TCP连接。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c7a5c4777e5f4d8e904588948678d1e4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图7 第三次握手记录(Flag 提示为 SYN, ACK)

### IP数据包格式分析

在抓到的每个包中，我们可以看到有一个"Internet Protocol"的栏目， 点进去可以看到IP报文的各个部分参数，例如对图7中IP数据包进行报文分析。
首先可以看到版本号为4，说明该是IPv4，报头长度为5，总长度为52，标识符为0。Flags为3比特，此处为0x40。Fragment Offset为分段偏移，此处为0。TTL为64，这是防止IP包在传输中发生死循环所设置的。由于使用了TCP，所以Protocol为6。Header Checksum为报头校验和，长度16位。之后的Source Address和Destination Address分别为源/目标地址，可以看到我们主机使用的IP地址为10.66.111.226,而目标地址为192.168.102.6。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9b7d85881ef642bfbc72b2494ccf24ae.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图8 IP数据包具体参数


### 捕获完整HTTP、ping数据流
只要在过滤规则中添加 http，即可捕获完整HTTP数据流。
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/dc645f669b764a728189322f895cef2c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图9 HTTP数据流

要想捕获ICMP数据流，需要在终端中对目标网站进行ping指令操作（图10），在mac上打开终端，输入 ping hdu.edu.cn，此时打开wireshark进行捕获，即可捕获到ICMP数据流（图11）。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d047f877661044f182f3f6d6c3378c56.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图10 终端执行ping hdu.edu.cn后的结果
 
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/f2997c594cbe4b04ae229031b25d3826.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图11 ICMP数据流


## 分析实例2: 斯坦福大学官网

由于过程分析大同小异，对于第二个案例只展示结果。

### 设置过滤规则

![在这里插入图片描述](https://img-blog.csdnimg.cn/373042cef32741338e5bb9b17da5a1ea.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

### 三次握手过程

注：由于使用了VPN，所以IP地址发生了变化:

![在这里插入图片描述](https://img-blog.csdnimg.cn/a16122943f7744f399756d6704c51bdf.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图12 第一次握手

![在这里插入图片描述](https://img-blog.csdnimg.cn/c1014559c49e483cad632e518e5ba8ca.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图13 第二次握手

 ![在这里插入图片描述](https://img-blog.csdnimg.cn/8f768be1f2174cf993f1414031fe7a93.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图14 第三次握手


### IP数据包格式分析

虽然是访问外网，但这个数据包也是IPV4，大致没有什么区别，版本号为4，报头字节长度为20，总长度为64，标示符为0，标记为0x40，分段偏移为0，TTL为64，用的是TCP协议，协议号为6，报头校验和为0x7204，源地址为10.66.111.226，目标地址为59.111.19.33。

![在这里插入图片描述](https://img-blog.csdnimg.cn/23c4050456d84e09b2e8883099716ccf.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图15 IP数据包格式分析

### 捕获完整HTTP、ping数据流
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/a2624ddf1feb4bd384007f65a4c666ad.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图16 HTTP数据流
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/1803b7cca2ed4567a99679bdd3aeaf14.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图17 ICMP数据流

# 实验总结：

## 遇到的问题

1. Mac 上wireshark打开无法抓包报错：
The capture session could not be initiated on interface 'en0' (You don't have permission to capture on that device.)
原因：没有权限查看/dev/bfp* 文件夹造成。
解决办法：
打开终端输入 sudo chmod o+r /dev/bpf*

2. 访问斯坦福大学网站的时候，抓包的时候捕获不到http数据流
解决办法：挂VPN再进行捕获，此时源IP地址发生变化。

## 思考问题

1. 实验所用主机的IP地址、子网掩码、网络号、子网号分别是多少？该主机的IP地址属于哪类？
主机的IP地址为10.66.111.226，子网掩码为255.255.192.0，网络号为10.66.64.1，子网号为10.66.64.0。主机的IP地址属于IPv4。
2. IP数据包在从源主机出发目的主机的过程中，IP首部中的IP源地址和目的地址字段是否发生变化？
没有变化。在IP数据包发送之前，网络层就已经对IP地址进行了封装，确定了源地址和目标地址，至于如何从源地址到目标地址，是通过packet switching这个过程完成的。简单来说，每个“站点”其实都有一张表，告诉这个包要发送到哪个地址，因而每次包交换的过程都是独立的，表上的地址也是独立的。

## 收获和体会

做了本次实验，特别是利用终端traceroute了一下国内是如何访问国外网站的，虽然有很多地方被屏蔽了，但可以看到计算机网络的神奇之处。例如我访问布朗大学官网的时候，经过了中国、圣荷西（一个城市）、纽约、波士顿，最终到达布朗大学某个实验室。在数据抓包的时候，我发现一直有个HangZhou_3a 在发Who has .... tell 10.66.64.2，目的地显示的是broadcast，就很神奇，竟然没有目标地址，不知道是怎么做到的。其次通过这次实验，了解了三次握手的基本过程，感觉收获还是挺大的
