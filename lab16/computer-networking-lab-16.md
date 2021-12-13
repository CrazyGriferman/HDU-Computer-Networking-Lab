---
title:  《计算机网络》 实验 16 DHCP的基本配置
categories: technology
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/5c0b1474de07404dacc2acb4a4837de9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
> 图1 实验步骤

# 配置实验拓扑图

![在这里插入图片描述](https://img-blog.csdnimg.cn/f37728a8fa0c4d7b8ea2536e6254cc00.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图2 实验拓扑图

本次实验中，我们使用一个DHCP的服务器给两个网段的设备分配IP地址，同时利用router1作为DHCP中继。server使用server-PT型号，router使用router-PT型号，交换机使用2950-24型号，每个子网有3台PC，以下为串口配置：

DHCP f0 -> switch1 fa0/1
PC1 f0 -> switch1 fa0/2
PC2 f0 -> switch1 fa0/3
PC3 f0 -> switch1 fa0/4
switch1 fa0/6 -> router1 f0/0
router1 fa1/0 -> switch2 fa0/1
switch2 fa0/2 -> PC3 f0
switch2 fa0/3 -> PC4 f0
switch2 fa0/4 -> PC5 f0

线材均使用直通线。

# 配置服务器
对于服务器，我们首先要配置它的IP地址和网关：

网关 -> 172.16.0.1
IP地址 -> 172.16.0.2

配置完之后才能动态分配主机IP。
在这之后，我们打开services界面，点击左边的DHCP，进入配置界面，在点击“service on”之后，我们要为两个网段的设备分别配置IP地址：
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/667f8c8779a24c3c8545d24a526c9d4a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图3 PC1、2、3 所在网段 配置  
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/1d2197fe9c5349ab9412dace73fdbea1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图4 PC4、5、6所在网段配置

值得注意的是，当DHCP中有多个地址池的时候，每个地址池需要有对应的网关（这个非常重要），终端的PC与哪个网关处于一个网络中，就获取网关的对应的地址池中的IP地址，以实现网络主机地址信息的动态配置。例如，server直接与交换机连接，server的网关地址为172.16.0.1，恰好是DHCP中配置的网关，那么服务器的DHCP就会为switch下的设备分配172.16.0.1网关对应的IP地址池中的IP地址。

# 配置 DHCP中继

而对于swtich2构建的子网来说，它并没有和server在同一个子网中，所以就需要DHCP中继代理，来实现DHCP服务器的动态分配功能，即在DHCP服务器和客户端之间转发DHCP数据包（DHCP中继代理在收到DHCP消息后，会重新生成一个DHCP消息转发出去，所以并不是原来的）。对于DHCP客户端（子网下的设备）来说，DHCP中继代理就像DHCP服务器；而对DHCP服务器看来，DHCP中继代理就像DHCP客户端。
在本拓扑网络中，我们选用router1作为DHCP中继，要配置DHCP中继，我们需要找到roter1和交换机switch2连接的串口，然后在该串口上进行操作：
Router1
> en
> conf t
> ip helper-address 172.16.0.2

最后一条指令就是指定 DHCP服务器，通过fa1/0串口向该服务器发送DHCP请求包。

# 测试动态分配结果
要测试动态分配结果，我们需要点进PC，然后选中Desktop，进入第一个IP Configuration。
 
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/46aab0841e4c4e66bed40c7e9929d714.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
> 图5 PC Desktop界面

然后点中进入，选中DHCP，然后等待分配结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/6298fba208a64220852fc97aeeb00f0e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图6 子网1中设备分配结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/04313ed00c324524a197f8bfbe50e612.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图7 子网2中设备分配结果

发现子网中的设备都可以获取网关地址以及动态分配的IP地址，说明DHCP及DHCP中继代理配置成功。

# 总结方法

DHCP在日常生活中也经常可见，例如你连接wifi后，再查看电脑的IP地址，会发现连接不同的wifi给你分配的ip地址可能不一样，这跟电脑里DHCP的配置有关。在本实验中，只是进行了简单的DHCP配置，没有涉及到新设备加入之后DHCP是如何分配的，其实有分四个步骤，分别是 DHCP server discovery/ DHCP server offer/ DHCP request/ DHCP ACK，具体细节还得看书中细节了。
