---
title:  《计算机网络》 实验 9 交换机VLAN 间路由
categories: technology
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/eafb9831b7bf49c689c5a21ab9b8667c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图1 实验步骤

# 设置实验环境

我们直接打开packet tracer软件配置实验拓扑图，其中PC两台，交换机选用2960-24型号两台，三层交换机选用3560-24PS型号，zqPC1的fa0口连接zqSwitch2的fa0/1口，zqSwitch2的fa0/23口连接zqMultiplayer Switch1的fa0/23口；zqPC2的fa0口连接zqSwitch3的fa0/2口，zqSwitch3的fa0/24口连接zqMultiplayer Switch1的fa0/24口，连接线材选用Copper Straight-Through。
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/8cfd9d8ee45c46b9ba8de233b60bc6a5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)


> 图2 三层交换机实验拓扑图



# 配置三层交换机

在三层交换机中，vlan是一种将同一物理局域网设备从逻辑上划分成一个个不同网段，从而实现虚拟工作组的数据交换技术，我们可以利用第三层交换机划分vlan，从而实现vlan划分网络之间的相互访问。以下为配置过程：

首先进入三层交换机中的CLI，然后输入以下指令：
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

尤其注意“ip address 192.168.10.254 255.255.255.0”、“ ip address 192.168.20.254 255.255.255.0”、“ip routing”，这三个指令。前面两个分别配置了PC1和PC2的网关地址，后面那个是开启IP路由，两者缺一不可，不然后面ping可能没用。
配置完后三层交换机的界面：

![在这里插入图片描述](https://img-blog.csdnimg.cn/93971990d0bf4c559a2fd0991f04b76d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图3 三层交换机配置结果图


# 配置二层交换机

对于交换机2：

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

 
> 图4 交换机2配置结果图

对于交换机3:

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

 
> 图5 交换机3配置结果图


# 配置PC

对于PC，我们只需配置他们分别的网关地址，以及ip地址即可。

PC1配置：


![在这里插入图片描述](https://img-blog.csdnimg.cn/7f54c5b4066d48f694da841b5a04be23.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

 
> 图6 PC1 网关地址配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/f6ee9eb8b87e4e0f93c622b840fbeb1e.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图7 PC1 IP地址配置

PC2配置：

![在这里插入图片描述](https://img-blog.csdnimg.cn/81fe22d6ce644a24aaa9f451e7e5e79f.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图8 PC2 网关地址配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/107e5d70171a44a9b583ef52eafe9c83.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图9 PC2 IP地址配置

# 测试结果

我们可以使用ipconfig指令查看当前PC的ip地址，同时对另外一台PC进行ping指令。值得注意的是，PC1首先会把数据包转发给自己的网关，PC1的网关会把数据包转发给PC2的网关，最终PC2的网关再转发给PC2，从而实现两个网络的通信，因为网关的IP地址其实是具有路由功能的设备的IP地址，前提是你要在第三层交换机中输入“ip routing”指令。

对于PC1:

![在这里插入图片描述](https://img-blog.csdnimg.cn/4bb7b043a7294333b292e230612c4b8b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图10 PC1 ping命令测试


对于PC2：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5bdad10a5fcb4504a4508d5c7f08857e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)


> 图11 PC2 ping命令测试

从两张图中可以看出，测试均成功。


# 总结方法

二层交换机基于MAC地址的访问，只是做了数据转发，工作在数据链路层，而三层交换机应用在网络层，增加了路由的功能，可以配置不同vlan的ip地址。总结一句话，就是三层路由，二层交换。
