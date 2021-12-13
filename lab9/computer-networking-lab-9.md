# 《计算机网络》 实验 9 交换机 VLAN 间路由

![在这里插入图片描述](https://img-blog.csdnimg.cn/eafb9831b7bf49c689c5a21ab9b8667c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤

# 设置实验环境

我们直接打开 packet tracer 软件配置实验拓扑图，其中 PC 两台，交换机选用 2960-24 型号两台，三层交换机选用 3560-24PS 型号，zqPC1 的 fa0 口连接 zqSwitch2 的 fa0/1 口，zqSwitch2 的 fa0/23 口连接 zqMultiplayer Switch1 的 fa0/23 口；zqPC2 的 fa0 口连接 zqSwitch3 的 fa0/2 口，zqSwitch3 的 fa0/24 口连接 zqMultiplayer Switch1 的 fa0/24 口，连接线材选用 Copper Straight-Through。

![在这里插入图片描述](https://img-blog.csdnimg.cn/8cfd9d8ee45c46b9ba8de233b60bc6a5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 三层交换机实验拓扑图

# 配置三层交换机

在三层交换机中，vlan 是一种将同一物理局域网设备从逻辑上划分成一个个不同网段，从而实现虚拟工作组的数据交换技术，我们可以利用第三层交换机划分 vlan，从而实现 vlan 划分网络之间的相互访问。以下为配置过程：

首先进入三层交换机中的 CLI，然后输入以下指令：

> enable
> configure terminal
> vlan 10
> vlan 20
> exit
> interface vlan 10
> ip address 192.168.10.254 255.255.255.0
> interface vlan 20
> ip address 192.168.20.254 255.255.255.0
> no shutdown
> interface vlan 20
> no shutdown
> exit
> ip routing
> interface fa0/23
> switchport trunk encapsulation dot1q
> switchport mode trunk
> exit
> interface fa0/24
> switchport trunk encapsulation dot1q
> switchport mode trunk
> exit

尤其注意“ip address 192.168.10.254 255.255.255.0”、“ ip address 192.168.20.254 255.255.255.0”、“ip routing”，这三个指令。前面两个分别配置了 PC1 和 PC2 的网关地址，后面那个是开启 IP 路由，两者缺一不可，不然后面 ping 可能没用。
配置完后三层交换机的界面：

![在这里插入图片描述](https://img-blog.csdnimg.cn/93971990d0bf4c559a2fd0991f04b76d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 3 三层交换机配置结果图

# 配置二层交换机

对于交换机 2：

> enable
> configure terminal
> vlan 10
> exit
> interface fa0/1
> switchport access vlan 10
> exit
> interface fa0/23
> witch mode trunk
> exit

![在这里插入图片描述](https://img-blog.csdnimg.cn/aca5620c19ed478087032ac7a1e4b94b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 交换机 2 配置结果图

对于交换机 3:

> enable
> configure terminal
> vlan 20
> exit
> interface fa0/2
> switchport access vlan 20
> exit
> interface fa0/24
> witch mode trunk
> exit

![在这里插入图片描述](https://img-blog.csdnimg.cn/8234426dc2374a7c8f71b2fe22e1cd0a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 交换机 3 配置结果图

# 配置 PC

对于 PC，我们只需配置他们分别的网关地址，以及 ip 地址即可。

PC1 配置：

![在这里插入图片描述](https://img-blog.csdnimg.cn/7f54c5b4066d48f694da841b5a04be23.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 PC1 网关地址配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/f6ee9eb8b87e4e0f93c622b840fbeb1e.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 7 PC1 IP 地址配置

PC2 配置：

![在这里插入图片描述](https://img-blog.csdnimg.cn/81fe22d6ce644a24aaa9f451e7e5e79f.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 8 PC2 网关地址配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/107e5d70171a44a9b583ef52eafe9c83.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 9 PC2 IP 地址配置

# 测试结果

我们可以使用 ipconfig 指令查看当前 PC 的 ip 地址，同时对另外一台 PC 进行 ping 指令。值得注意的是，PC1 首先会把数据包转发给自己的网关，PC1 的网关会把数据包转发给 PC2 的网关，最终 PC2 的网关再转发给 PC2，从而实现两个网络的通信，因为网关的 IP 地址其实是具有路由功能的设备的 IP 地址，前提是你要在第三层交换机中输入“ip routing”指令。

对于 PC1:

![在这里插入图片描述](https://img-blog.csdnimg.cn/4bb7b043a7294333b292e230612c4b8b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 10 PC1 ping 命令测试

对于 PC2：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5bdad10a5fcb4504a4508d5c7f08857e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 11 PC2 ping 命令测试

从两张图中可以看出，测试均成功。

# 总结方法

二层交换机基于 MAC 地址的访问，只是做了数据转发，工作在数据链路层，而三层交换机应用在网络层，增加了路由的功能，可以配置不同 vlan 的 ip 地址。总结一句话，就是三层路由，二层交换。
