# 《计算机网络》 实验 10 交换机 VLAN 间路由

![在这里插入图片描述](https://img-blog.csdnimg.cn/5a7bd0fa438b46aca374eac3057c212d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤

# 设置实验环境

为了测试快速生成树，所以本实验需要设置环路，所以我们需要两个交换机和两台 PC，其中两台交换机分别用两根线连接，fa0/1 和 fa0/1 连接，fa0/2 和 fa0/2 连接。之后 switch1 的 fa0/3 口连接 PC1 的 fa0 口，swtich2 的 fa0/3 连接 PC2 的 fa0 口，如图 2 所示。

![在这里插入图片描述]![在这里插入图片描述](https://img-blog.csdnimg.cn/ef7de96ce7314d7eb450217f15948457.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 实验拓扑图

# 配置 PC 网关 IP

由于需要测试在生成树开启后，PC1 是否能 ping 通 PC2，所以需要分别 PC1 和 PC2 的网关和 IP 地址，如图 2、3、4 所示。
PC1 和 PC2 的网关地址为：192.168.1.1
PC1 的 IP 地址：192.168.1.2
PC2 的 IP 地址：192.168.1.3

![在这里插入图片描述](https://img-blog.csdnimg.cn/29c9f38cad0e4b8cbe884ad78a6155e9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 3 PC1 IP 地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/37d93583aef5458baa9b667a9c77ce03.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 PC2 IP 地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/f37a5747fd6f4d37afd34d8146656511.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 PC1/2 网关地址

# 配置交换机(配置 vlan 使得两台 PC 能够相互通信)

下面配置交换机。
对于交换机 1:

> enable
> configure terminal
> hostname S1
> interface fa0/3
> switchport access vlan 2
> exit
> interface range fa0/1-2
> switchport mode trunk
> exit
> 对于交换机 2:
> enable
> configure terminal
> hostname S2
> interface fa0/3
> switchport access vlan 2
> exit
> interface range fa0/1-2
> switchport mode trunk
> exit

swtichport access vlan 2 这条指令就是在端口 3 上创建 vlan2 并进行划分。
interface range fa 0/1-2 是对 0 号槽位 1 号和 2 号端口进行批量设置。
switchport mode trunk 为了让 PC 机能够互通，进入 trunk 模式。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5ba92f7a38534bd4861ccb012459dd48.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 switch1 配置结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/9a6dea27d20a4f199bcf30199756bf2d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 7 switch2 配置结果

# 设置快速生成树

在快速生成树中，树的根位根桥的交换机。由根桥开始，逐渐会形成一棵树，根桥定时发送配置报文，非根桥接收配置并转发。如果交换机中有循环回路，此时交换机会根据端口的配置选出一个端口并把其他的端口阻塞，消除循环。

开启快速生成树需要分别在两个交换机中输入以下指令：

> spanning-tree mode rapid-pvst

开启之后，可以看到在交换机的两根线中，有一个是橘色的，说明这根没通，另外一根是通的，说明快速生成树生效了。

快速生成树可以起以下两个作用：

1. 阻塞端口，消除循环。
2. 当有一根线路信号中断时，快速生成树可以自动分配其他端口以供通信。

下面我们来测试：

对于 1:
我们直接进入 PC1 命令行，输入 ping -t 192.168.1.3（PC2 IP 地址）：

![在这里插入图片描述](https://img-blog.csdnimg.cn/ff051f14671a472c939ed213487873f6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 8 PC1 ping PC2 结果

结果可以发现 ping 的通，说明快速生成树起了作用。

下面我们来测试 2，可以把其中一个端口断开，在 switch1 中输入以下指令：

> int fa 0/1
> shut
> 在 ping 不中断的同时，输入以上指令，可以看到快速生成树起了作用，自动更换了端口

![在这里插入图片描述](https://img-blog.csdnimg.cn/a711695c697e42698b70866bf3086364.gif)

> 图 9 快速生成树 分配端口

# 总结方法

这个实验就是通过对交换机进行快速生成树配置，达到在其中一条线路中断时，数据传输不中断。生成树其实是一种数据结构，但是用在计算机网络就有很大的作用，可以用来自动分配端口，防止环路出现的问题。又比如在路由算法中使用了 bell-man ford 算法。RSTP 在 STP 的基础上，处理了网络临时失去连通性的问题。RSTP 规定在某些情况下， 处于阻塞状态的窗口不必经历 2 倍的时延而可以直接进入转发状态。

在软件中，我们可以通过 show spanning-tree 来获取交换机的生成树信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2ec32b80dbc74459915298b881073dcc.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 10 生成树信息

其中 root 表示的是根网桥信息， priority 表示优先级。
优先级是用于根桥的选举的，通过比较优先级和 MAC 地址，可以用来选举根桥，优先级越小越优，若优先级相同，则比较 MAC 地址，越小越优。
对于根端口，是根据 RPC（root path cost）来选举端口。
我们可以看到由于 Fa0/1 的 Prio.Nbr 较小，所以算法优先选择了 fa0/1 连通。
在 STP 中有五种状态：禁用、监听、学习、转发和阻塞，在本次实验中，我主要学习了禁用和阻塞两种状态。通过 shut 指令，可以让某个端口进入禁用状态，这样我们就可以检查 STP 会不会进行端口的切换。
