# 《计算机网络》 实验 4 TCP 协议分析

![在这里插入图片描述](https://img-blog.csdnimg.cn/07c5638aa4d24cdca1e1435601432c13.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤流程图

# 使用 wireshark 对数据流进行追踪

## 选取http://www.hdu.edu.cn/ 作为抓包目标网址

## 设置过滤规则

![在这里插入图片描述](https://img-blog.csdnimg.cn/8669ace788ae46d5a12e76647bae8480.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

## 选中 http，并右键跟踪 TCP 数据流。

![在这里插入图片描述](https://img-blog.csdnimg.cn/769e9a5a933d40afb13cdd02c2d22bd5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 wireshark 捕捉到的 TCP 数据流

# 了解并分析 TCP 报文段

首先我们需要了解 TCP 报文段由哪些字段构成，如图 3 所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2d8a6165d3c042928caf95f45e22bed5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 3 TCP 报文段

TCP 报文有首部和数据部分组成，首部的大小为 20 ～ 60 字节，长度可变，而数据部分是可选的，即 TCP 报文中可以不包括数据。

下面分析每个字段的作用：
（1）源端口号（source port）: 该端口号为 16 位，并且与源 IP 地址一起标识发送该 TCP 报文段的通信进程。
（2）目的端口号（destination port）: 该端口号为 16 位，与目的 IP 地址一起标识接受该 TCP 报文段的通信进程。
（3）序号（sequence number）: 占 4 个字节，标示 TCP 报文段中第一个数据字节的序号。
（4）确认号（acknowledgement number）: 占 4 个字节，标示希望收到对方下一个报文段的字节序号。
（5）偏移量（offset）: 告诉你数据从哪里开始（有一个偏移量）
（6）保留号（reserved）: 长度为 6 位，必须为 0，为将来定义新用途保留的
（7）紧急（Urgent bit）: 标示该报文较为紧急，需要紧急发送
（8）确认（Ack bit）: 一般发送的第一个报文该号为 0，为 1 时标示确认号字段有效
（9）推送（Push bit）: 标示该报文的传输优先级高，需要尽快推送给应用程序
（10）复位（Reset bit）: 标示需要释放 TCP 连接并且重新建立连接（为 1 时）
（11）同步（SYN bit）: 标示 TCP 请求连接（为 1 时）
（12）终止（FIN bit）: 标示数据终止发送，要求释放连接 TCP 连接（为 1 时）
（13）窗口（window）: 这是为了滑动窗口（sliding window）设置的，为了告诉另一端发送端的接受缓冲空间（receive buffer space）有多大
（14）校验和（checksum）: 16 位，由发送端计算和存储，到接受端后，由接受端进行验证。
（15）紧急指针（urgent pointer）: 告诉你需要紧急发送的数据在哪一个部分（segment）
（16）选项（options）: 包含最长报文大小、窗口扩大选项等。
（17）填充（padding）: 必须为 0，保证报头的结合和数据的开始处偏移量能够被 32 整除

# 分析数据流中抓到的三次握手过程

![在这里插入图片描述](https://img-blog.csdnimg.cn/034fadb44c1e4a5583120bb5f899d0dc.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 进入http://www.hdu.edu.cn 后截获的三次握手过程

当我们输入网址进入杭电官网的时候，客户端会向服务端先发送一个 SYN 包（synchronized message），由于一般网站服务都是开在 80 端口，所以可以看到后面的 info 是从 50397 -> 80，这个 80 就是指杭电官网的端口。我们点进第 249 条记录后可以看到在在传输层（这里用的是 TCP 协议）中，sequence number 变为 0，这里就表示我们的客户端已经像服务端发送 SYN 包了，就等服务端反应了。

![在这里插入图片描述](https://img-blog.csdnimg.cn/10fda34f2a224de6bd9c9063775b60d6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 第一次握手记录 (Flag 提示为 SYN)

之后，服务端会向客户端发送一个 SYN 包并附带一个表示确认已经收到了 SYN 包的 ACK（acknowledge）包，在 wireshark 中就会提示 [SYN, ACK]状态。

![在这里插入图片描述](https://img-blog.csdnimg.cn/3993e5ac8512400783f569ec1b5471f9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 第二次握手记录 (Flag 提示为 SYN,ACK)

最后客户端会像 server 端发送一个 ACK 包，这个时候客户端和服务端就建立起了 TCP 连接。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ce7039b7761e409d8100a56016d3f9d5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 7 第三次握手记录(Flag 提示为 SYN, ACK)

最后可以看到有一条报文显示“GET / HTTP/1.1”，表示通过三次握手，TCP 连接建立成功。

# 数据流中找到连接终止部分并分析

当客户端没有新的数据要发送的时候，就会释放 TCP 连接，如图 8 所示，也常被称为四次握手过程：

1. FIN + ACK, Seq = K, ACK = L; (客户端发送 FIN，用来关闭客户端到服务端的数据传送)
2. ACK, Seq = L, ACK = K + 1;（当服务端收到 FIN 后，发送 ACK 给客户端）
3. FIN + ACK, Seq = L, ACK = K + 1; （同时服务端向客户端发送 FIN，用来关闭服务端向客户端的数据传送）
4. ACK, Seq = K, ACK = L + 1; （当客户端收到 FIN 后，发送一个 ACK 给 server 端）

![在这里插入图片描述](https://img-blog.csdnimg.cn/5dbfa1797b494478bdb3d8d80c8f3b0e.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 8 TCP 连接终止过程 四次握手

根据图 8 显示，TCP 连接终止成功。

# 认识并分析 TCP 重置

区别于正常的四次握手关闭连接，TCP 中有一个重置功能，用于关闭那些没有必要继续存在的连接，一般情况下表示异常关闭连接，一般产生重置有三个条件：

1. 目的地为某端口的 SYN 到达，但是在该端口上并没有正在监听的服务器；
2. TCP 想取消一个已有连接；
3. TCP 接收到一个根本不存在的连接上的分节；

4. 分析 TCP 可靠数据传输基本原理

个人认为，TCP 可靠数据传输的基本原理主要有三个点： 1.不要传输过多的报文以至于接受者无法处理这些过多的数据包 2. 在接受到报文后，接收方一定要给发送方反馈 3. 使用两个基本方法：
（1）暂停并等待（stop and wait）
（2）滑动窗口（sliding window）

在“暂停并等待”这个方法中，只允许同时一个数据包进行传输，这样效率比较低下，但滑动窗口方法可以同时允许多个数据包同时进行传输。

在滑动窗口算法中，有滑动窗口发送方（SWS）和滑动窗口接收方（RWS），即发送方和接收方，当发送方为 N，接收方为 1，就是“Go-back-N”方法，当其中一个报文发送出现问题时，所有的报文都需要重新发送；当发送方为 N，接收方为 1 时，就是“selective repeat”方法，这个时候当其中一个数据包发送失败时，只会发送那个数据包，其他的数据包不用重复发送。

因为有了滑动窗口算法，因而 TCP 的数据传输是可靠的。

# 实验总结

## 遇到的问题

1. 对滑动窗口算法还不是很了解
   解决方法：可以看下自顶向下或者 stanford CS144 的相关课程，里面有详细的例子

## 心得

感觉这个 TCP 协议还是比较复杂的，由于 CS144 讲的太细了，特别是 TCP 的连接和终止过程其实是有限自动机，在看的时候感觉理解这个有限自动机难度还是比较大，感觉还是要通过做实验来了解 TCP 的连接和终止具体是怎么运作的。
