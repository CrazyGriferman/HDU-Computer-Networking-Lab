---
title:  《计算机网络》 实验 10 交换机VLAN 间路由
categories: technology
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/5a7bd0fa438b46aca374eac3057c212d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

 
> 图1 实验步骤

# 设置实验环境

为了测试快速生成树，所以本实验需要设置环路，所以我们需要两个交换机和两台PC，其中两台交换机分别用两根线连接，fa0/1和fa0/1连接，fa0/2和fa0/2连接。之后switch1的fa0/3口连接PC1的fa0口，swtich2的fa0/3连接PC2的fa0口，如图2所示。

![在这里插入图片描述]![在这里插入图片描述](https://img-blog.csdnimg.cn/ef7de96ce7314d7eb450217f15948457.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图2 实验拓扑图

# 配置PC网关IP
由于需要测试在生成树开启后，PC1是否能ping通PC2，所以需要分别PC1和PC2的网关和IP地址，如图2、3、4所示。
PC1和PC2的网关地址为：192.168.1.1
PC1的IP地址：192.168.1.2
PC2的IP地址：192.168.1.3

![在这里插入图片描述](https://img-blog.csdnimg.cn/29c9f38cad0e4b8cbe884ad78a6155e9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图3 PC1 IP地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/37d93583aef5458baa9b667a9c77ce03.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图4 PC2 IP地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/f37a5747fd6f4d37afd34d8146656511.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图5 PC1/2 网关地址

# 配置交换机(配置vlan使得两台PC能够相互通信)
下面配置交换机。
对于交换机1:
> enable
> configure terminal
> hostname S1
> interface fa0/3
> switchport access vlan 2
> exit
> interface range fa0/1-2
> switchport mode trunk
> exit
对于交换机2:
> enable
> configure terminal
> hostname S2
> interface fa0/3
> switchport access vlan 2
> exit
> interface range fa0/1-2
> switchport mode trunk
> exit

swtichport access vlan 2 这条指令就是在端口3上创建vlan2并进行划分。
interface range fa 0/1-2 是对0号槽位1号和2号端口进行批量设置。
switchport mode trunk 为了让PC机能够互通，进入trunk模式。
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/5ba92f7a38534bd4861ccb012459dd48.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图6 switch1 配置结果
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/9a6dea27d20a4f199bcf30199756bf2d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图7 switch2 配置结果

# 设置快速生成树
在快速生成树中，树的根位根桥的交换机。由根桥开始，逐渐会形成一棵树，根桥定时发送配置报文，非根桥接收配置并转发。如果交换机中有循环回路，此时交换机会根据端口的配置选出一个端口并把其他的端口阻塞，消除循环。

开启快速生成树需要分别在两个交换机中输入以下指令：

> spanning-tree mode rapid-pvst

开启之后，可以看到在交换机的两根线中，有一个是橘色的，说明这根没通，另外一根是通的，说明快速生成树生效了。

快速生成树可以起以下两个作用：
1. 阻塞端口，消除循环。
2. 当有一根线路信号中断时，快速生成树可以自动分配其他端口以供通信。

下面我们来测试：

对于1:
我们直接进入PC1命令行，输入ping -t 192.168.1.3（PC2 IP地址）：

![在这里插入图片描述](https://img-blog.csdnimg.cn/ff051f14671a472c939ed213487873f6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图8 PC1 ping PC2结果

结果可以发现ping的通，说明快速生成树起了作用。

下面我们来测试2，可以把其中一个端口断开，在switch1中输入以下指令：
> int fa 0/1
> shut
在ping不中断的同时，输入以上指令，可以看到快速生成树起了作用，自动更换了端口
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/a711695c697e42698b70866bf3086364.gif)
 
> 图9 快速生成树 分配端口

# 总结方法
这个实验就是通过对交换机进行快速生成树配置，达到在其中一条线路中断时，数据传输不中断。生成树其实是一种数据结构，但是用在计算机网络就有很大的作用，可以用来自动分配端口，防止环路出现的问题。又比如在路由算法中使用了bell-man ford算法。RSTP在STP的基础上，处理了网络临时失去连通性的问题。RSTP规定在某些情况下， 处于阻塞状态的窗口不必经历2倍的时延而可以直接进入转发状态。

在软件中，我们可以通过 show spanning-tree来获取交换机的生成树信息：
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/2ec32b80dbc74459915298b881073dcc.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图10 生成树信息

其中 root 表示的是根网桥信息， priority表示优先级。
优先级是用于根桥的选举的，通过比较优先级和MAC地址，可以用来选举根桥，优先级越小越优，若优先级相同，则比较MAC地址，越小越优。
对于根端口，是根据 RPC（root path cost）来选举端口。
我们可以看到由于 Fa0/1 的 Prio.Nbr 较小，所以算法优先选择了fa0/1连通。
在STP中有五种状态：禁用、监听、学习、转发和阻塞，在本次实验中，我主要学习了禁用和阻塞两种状态。通过shut指令，可以让某个端口进入禁用状态，这样我们就可以检查STP会不会进行端口的切换。
