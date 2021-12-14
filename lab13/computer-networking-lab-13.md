# 《计算机网络》 实验 13 OSPF 基本配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/9ef21d9107524532ab5be7f9bc1e389f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤

# 配置实验拓扑图

![在这里插入图片描述](https://img-blog.csdnimg.cn/641ff16dce564a86a71f84d692780208.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 实验拓扑图

图中 PC1 模拟为校园内的主机，PC2 模拟为校园外的主机，该实验目的为让校园内的主机和校园外的主机能够相互通信。
三层交换机我们采用 3560-24 型号，路由器采用 Router-PT 型号，下面为端口连接配置：

PC1 fa0/0 -> 三层交换机 fa0/10
三层交换机 fa0/20 -> router1 fa0/0
router1 serial2/0 -> router2 serial2/0 serial DCE 线，顺序不可错
router2 fa0/0 -> PC2 fa0/0

# 配置三层交换机

对于三层交换机，我们划分 vlan10 用于连接 PC1， vlan20 用于连接 router1，以下是配置指令：

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

> 图 3 三层交换机配置结果图
>
> 为什么我们要用到三层交换机呢？因为三层交换机具有三层转发技术，即路由器工作在三层。
> 通过 RIP 协议虽然能够配置动态路由（通过 UDP520 端口），但是 RIP 以跳数来评估最优路径，实际上可能不是如此，其次最大跳数只有 16，只能用于小型网络，并且在更新时会发送全部路由表，浪费网络资源，而且收敛速度慢。
> OSPF 能够改善 RIP 协议的很多缺点，比如只会传播部分路由信息，网络收敛迅速，避免了网络资源浪费。
> 根据网上查到的资料，在 OSPF 协议开启后，路由器会定时广播 Hello 包（TTL 为 1），寻找邻居，当有路由器接收到 Hello 包时，并返回信息时，说明找到了周边的设备，此时两个设备开始建立邻接关系。在建立邻接关系之后，OSPF 有一个选举 DR 和 BDR 的过程（实际上就是从邻居中找一个设备），用于管理划分出来的单区域。由于本实验实现的是单区域，所以在配置的时候，我们只需要设置骨干（原始）区域即可（即为 network 192.168.1.0 0.0.0.255 area 0 中的 area 0），就没有与其连接的单区域了。对于 DR 和 BDR，我们可以通过 show ip ospf neighbor 查看：

在三层交换机中输入指令后，我们发现 neighbor ID interface 为 192.168.4.1 的邻居被选举为了 BDR，也就是 router1:

![在这里插入图片描述](https://img-blog.csdnimg.cn/2e7239ca9d494a8a81afe5abf13d3eac.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 三层交换机 邻居信息

在 router1 中输入该指令，可以发现 neighbor ID interface 为 192.168.3.1 的邻居被选举为了 DR，实际上就是三层交换机的 vlan20 端口：

![在这里插入图片描述](https://img-blog.csdnimg.cn/492e17940dfe4586a094d9fc276a1e58.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 router1 邻居图

DR 即为该单区域的管理者，假如当 DR 坏掉时就有 BDR 路由器取得所有权进行管理。

# 配置剩余两个路由器及 OSPF 协议

由于两个路由器用 serial DCE 线连接，所以需要在 router1 上配置 clock rate：
对于 router1

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

> 图 6 router1 路由信息

对于 router2：

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

> 图 7 router2 路由信息

通过 show ip route 我们可以看到两个路由器的路由信息，其中 O 开头的就是通过 OSPF 产生的路由，接下来我们就来配置 PC。

# 配置 PC

对于 PC，我们只需配置网关和 IP 地址即可：

PC1 网关 -> 192.168.1.1
PC1 IP 地址 -> 192.168.1.2

PC2 网关 -> 192.168.2.1
PC2 IP 地址 -> 192.168.2.2

下面再简要给出三个路由器的串口 IP 地址，方便后面测试用：

三层交换机 vlan10 -> 192.168.1.1
三层交换机 vlan20 -> 192.168.3.1
router1 fa0/0 -> 192.168.3.2 （和 vlan20 连接）
router1 serial2/0 -> 192.168.4.1
router2 fa0/0 -> 192.168.2.1
router2 serial2/0 -> 192.168.4.2

# 测试网络连接性

我们可以先用 PC1 ping PC2:

![在这里插入图片描述](https://img-blog.csdnimg.cn/0c16d3e6f399413695c77bb68e653281.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 8 PC1 ping PC2

发现可以 ping 通，再 ping 其它几个交换机的串口：

![在这里插入图片描述](https://img-blog.csdnimg.cn/fbf7f6c39ae4411f832fe633caa09d9f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 9 PC2 ping 路由器的串口 ip

发现都可以 ping 通，说明 OSPF 配置成功，实现全网通。 6. 总结方法
如果想要再细致了解下 OSPF，可以通过 show ip ospf interface 指令查看对应串口的信息，例如再 router1 中输入 show ip ospf interface fastEthernet 0/0，得到以下信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0f34df0523e04c8790c131370c69caaf.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 10 router1 fa0/0 接口的 OSPF 协议配置信息

我们可以看到 DR（192.168.3.1）和 BDR（192.168.4.1）的信息，同时也可以看到 Hello 包的一些配置，例如发送 Hello 数据包的时间间隔为 10 秒，如果 40 秒内没有收到 Hello 包的话就会断开邻居关系。并且，三个路由器都在 area 0 中，如果是不同的区域的话是不能作为邻居的。

# 总结方法

如果想要再细致了解下 OSPF，可以通过 show ip ospf interface 指令查看对应串口的信息，例如再 router1 中输入 show ip ospf interface fastEthernet 0/0，得到以下信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0f34df0523e04c8790c131370c69caaf.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 10 router1 fa0/0 接口的 OSPF 协议配置信息

我们可以看到 DR（192.168.3.1）和 BDR（192.168.4.1）的信息，同时也可以看到 Hello 包的一些配置，例如发送 Hello 数据包的时间间隔为 10 秒，如果 40 秒内没有收到 Hello 包的话就会断开邻居关系。并且，三个路由器都在 area 0 中，如果是不同的区域的话是不能作为邻居的。
