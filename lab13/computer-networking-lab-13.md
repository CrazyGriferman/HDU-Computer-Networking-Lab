---
title:  《计算机网络》 实验 13 OSPF 基本配置
categories: technology
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/9ef21d9107524532ab5be7f9bc1e389f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图1 实验步骤

# 配置实验拓扑图
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/641ff16dce564a86a71f84d692780208.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图2 实验拓扑图

图中PC1模拟为校园内的主机，PC2模拟为校园外的主机，该实验目的为让校园内的主机和校园外的主机能够相互通信。
三层交换机我们采用3560-24型号，路由器采用Router-PT型号，下面为端口连接配置：

PC1 fa0/0 -> 三层交换机 fa0/10
三层交换机 fa0/20 -> router1 fa0/0
router1 serial2/0 -> router2 serial2/0 serial DCE线，顺序不可错
router2 fa0/0 -> PC2 fa0/0

# 配置三层交换机
对于三层交换机，我们划分vlan10用于连接PC1， vlan20用于连接router1，以下是配置指令：

> en
> conf t
> vlan 10
> exit
> vlan 20
> exit
> interface fa0/10
> switchport access vlan 10
> exit
> interface fa0/20
> switchport access vlan 20
> exit
> interface vlan 10
> ip address 192.168.1.1 255.255.255.0
> exit
> interface vlan 20
> ip address 192.168.3.1 255.255.255.0
> exit
> router ospf 1
> network 192.168.1.0 0.0.0.255 area 0
> network 192.168.3.0 0.0.0.255 area 0
> end

以下为配置好的图片：
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/b9c3e4ca2c544c0a97117affae4264a9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图3 三层交换机配置结果图
> 
为什么我们要用到三层交换机呢？因为三层交换机具有三层转发技术，即路由器工作在三层。
通过RIP协议虽然能够配置动态路由（通过UDP520端口），但是RIP以跳数来评估最优路径，实际上可能不是如此，其次最大跳数只有16，只能用于小型网络，并且在更新时会发送全部路由表，浪费网络资源，而且收敛速度慢。
OSPF能够改善RIP协议的很多缺点，比如只会传播部分路由信息，网络收敛迅速，避免了网络资源浪费。
根据网上查到的资料，在OSPF协议开启后，路由器会定时广播Hello包（TTL为1），寻找邻居，当有路由器接收到Hello包时，并返回信息时，说明找到了周边的设备，此时两个设备开始建立邻接关系。在建立邻接关系之后，OSPF有一个选举DR和BDR的过程（实际上就是从邻居中找一个设备），用于管理划分出来的单区域。由于本实验实现的是单区域，所以在配置的时候，我们只需要设置骨干（原始）区域即可（即为network 192.168.1.0 0.0.0.255 area 0 中的 area 0），就没有与其连接的单区域了。对于DR和BDR，我们可以通过show ip ospf neighbor查看：

在三层交换机中输入指令后，我们发现neighbor ID interface为192.168.4.1的邻居被选举为了BDR，也就是router1:

![在这里插入图片描述](https://img-blog.csdnimg.cn/2e7239ca9d494a8a81afe5abf13d3eac.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图4 三层交换机 邻居信息

在router1中输入该指令，可以发现neighbor ID interface为192.168.3.1的邻居被选举为了DR，实际上就是三层交换机的vlan20端口：

![在这里插入图片描述](https://img-blog.csdnimg.cn/492e17940dfe4586a094d9fc276a1e58.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图5 router1 邻居图

DR即为该单区域的管理者，假如当DR坏掉时就有BDR路由器取得所有权进行管理。

# 配置剩余两个路由器及OSPF协议

由于两个路由器用serial DCE线连接，所以需要在router1上配置clock rate：
对于router1
> en
> conf t
> interface fa0/0
> no shut
> ip addrss 192.168.3.2 255.255.255.0
> exit
> interface serial 2/0
> no shut
> clock rate 64000
> ip address 192.168.4.1 255.255.255.0
> exit
> router ospf 1
> network 192.168.3.0 0.0.0.255 area 0
> network 192.168.4.0 0.0.0.255 areao 0
> exit

 ![在这里插入图片描述](https://img-blog.csdnimg.cn/53e7643bab1249e7817afc693ab08651.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图6 router1 路由信息

对于router2：
> en
> conf t
> int fa0/0
> no shut
> ip address 192.168.2.1 255.255.255.0
> exit
> int serial2/0
> no shut
> ip address 192.168.4.2 255.255.255.0
> exit
> router ospf 1
> network 192.168.2.0 0.0.0.255 area 0
> network 192.168.4.0 0.0.0.255 area 0
> end
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/71f6e70b0567422bb44fa574be8d16c1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图7 router2 路由信息

通过show ip route我们可以看到两个路由器的路由信息，其中O开头的就是通过OSPF产生的路由，接下来我们就来配置PC。

# 配置PC

对于PC，我们只需配置网关和IP地址即可：

PC1 网关 -> 192.168.1.1
PC1 IP地址 -> 192.168.1.2

PC2 网关 -> 192.168.2.1
PC2 IP地址 -> 192.168.2.2

下面再简要给出三个路由器的串口IP地址，方便后面测试用：

三层交换机 vlan10 -> 192.168.1.1
三层交换机 vlan20 -> 192.168.3.1
router1 fa0/0 -> 192.168.3.2 （和vlan20连接）
router1 serial2/0 -> 192.168.4.1
router2 fa0/0 -> 192.168.2.1
router2 serial2/0 -> 192.168.4.2

# 测试网络连接性

我们可以先用PC1 ping PC2:

![在这里插入图片描述](https://img-blog.csdnimg.cn/0c16d3e6f399413695c77bb68e653281.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图8 PC1 ping PC2

发现可以ping通，再ping其它几个交换机的串口：

![在这里插入图片描述](https://img-blog.csdnimg.cn/fbf7f6c39ae4411f832fe633caa09d9f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图9 PC2 ping 路由器的串口ip

发现都可以ping通，说明OSPF配置成功，实现全网通。
6. 总结方法
如果想要再细致了解下OSPF，可以通过show ip ospf interface 指令查看对应串口的信息，例如再router1中输入show ip ospf interface fastEthernet 0/0，得到以下信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0f34df0523e04c8790c131370c69caaf.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图10 router1 fa0/0接口的 OSPF协议配置信息

我们可以看到DR（192.168.3.1）和BDR（192.168.4.1）的信息，同时也可以看到Hello包的一些配置，例如发送Hello数据包的时间间隔为10秒，如果40秒内没有收到Hello包的话就会断开邻居关系。并且，三个路由器都在area 0 中，如果是不同的区域的话是不能作为邻居的。
