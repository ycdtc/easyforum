配置环境：
1. 下载安装mongodb和node，安装文件在software文件夹里
2. 在MongoDB的bin文件夹下创建data文件夹
3. 在local数据库下创建两个名为"forum_info"和"user_info"的集合
4. 以管理员身份运行命令提示符，运行到bin文件夹，输入mongod --dbpath data
5. 工程右上角edit configuration把nodejs的路径设置好
6. 在web中运行即可