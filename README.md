# Mod File Copier

一个Node.js实用工具，用于自动从多个mod目录中找到最新版本的mod文件并复制到指定位置。特别适用于泰拉瑞亚（Terraria）的Tmodloader模组管理。

## 适用场景

- 泰拉瑞亚Tmodloader模组管理
- Steam Workshop模组备份
- 多版本模组更新
- 模组文件迁移

### Tmodloader相关说明

本工具特别适合处理Tmodloader的模组文件：
- 自动处理Steam Workshop下载的模组
- 支持找出最新版本的.tmod文件
- 适用于Tmodloader所有版本（1.4.x和1.3.x）
- 可用于模组的备份和迁移

默认的模组位置：
```
C:/Users/[用户名]/Documents/My Games/Terraria/ModLoader/Mods  # 本地模组
C:/Program Files (x86)/Steam/steamapps/workshop/content/1281930  # Steam Workshop模组
```

### 搭配Everything使用

推荐使用[Everything](https://www.voidtools.com/)来快速查找模组文件：

1. 使用Everything快速定位模组位置：
   - 搜索关键词：`.tmod`
   - 过滤器：`path:workshop\content\1281930`
   - 可以看到所有已下载的Workshop模组

2. 复制Everything中的路径：
   ```bash
   # 例如从Everything复制的路径
   npm run copy -- "C:\Program Files (x86)\Steam\steamapps\workshop\content\1281930" "D:\ModBackup"
   ```

3. 批量处理技巧：
   - 使用Everything的高级搜索功能定位特定版本的模组
   - 可以通过日期筛选最近更新的模组
   - 支持导出搜索结果列表

## 功能特点

- 自动扫描多个mod目录
- 基于文件夹名称的版本号识别（如 2024.1）
- 智能识别最新版本
- 自动复制.tmod文件
- 详细的操作日志输出

## 系统要求

- Node.js >= 12.0.0
- Windows/Linux/MacOS

### Node.js 安装

1. Windows 安装方法：
   - 访问 Node.js 官方网站：[https://nodejs.org/](https://nodejs.org/)
   - 下载并安装 LTS（长期支持）版本
   - 安装时勾选"Automatically install the necessary tools"
   - 安装完成后，打开命令提示符（CMD）输入以下命令验证：
     ```bash
     node --version
     npm --version
     ```

2. 使用软件包管理器安装（推荐）：
   - Windows (使用 [Chocolatey](https://chocolatey.org/)):
     ```bash
     choco install nodejs-lts
     ```
   - macOS (使用 [Homebrew](https://brew.sh/)):
     ```bash
     brew install node
     ```

3. 如果遇到权限问题：
   - Windows: 以管理员身份运行命令提示符
   - Linux/macOS: 使用 `sudo` 运行安装命令

4. 验证安装：
   ```bash
   node --version  # 应显示 v12.0.0 或更高版本
   npm --version   # 应显示 6.0.0 或更高版本
   ```

## 安装

1. 克隆仓库：
```bash
git clone [repository-url]
cd mod-file-copier
```

2. 安装依赖：
```bash
npm install
```

## 使用方法

使用npm run命令执行脚本：

```bash
npm run copy -- <源目录路径> <目标目录路径>
```

### 示例

```bash
npm run copy -- "D:/games/mods" "D:/output"
```

### 目录结构要求

源目录结构通常来自Steam Workshop：
```
Steam Workshop目录/
  ├── 2831179995/  # 模组ID目录
  │   ├── 2023.12/
  │   ├── 2024.1/  # 最新版本
  │   └── 2023.11/
  ├── 3153589462/  # 另一个模组
  │   ├── 2023.12/
  │   └── 2024.1/
  └── ...
```

每个模组ID目录下：
- 包含多个版本目录（如2024.1）
- .tmod文件位于版本目录中
- 版本号通常对应Tmodloader的更新

程序会：
1. 扫描源目录下的所有一级目录
2. 在每个一级目录中找到版本号最大的子目录
3. 复制找到的子目录中的所有.tmod文件到目标目录

## 版本号规则

- 版本号应采用 `年份.月份` 的格式（如 2024.1）
- 支持多级版本号（如 2024.1.2）
- 版本号比较采用数字比较，而不是字符串比较
- 不存在的版本号部分视为0（如 2024.1 和 2024.1.0 视为相同）

## 使用建议

1. 模组备份：
   - 定期备份重要的模组
   - 保存特定版本的模组以防止更新导致的问题
   - 可以创建不同的备份目录对应不同的游戏版本

2. 多设备同步：
   - 在多台电脑间同步模组文件
   - 快速迁移模组到新的设备
   - 共享模组配置给其他玩家

3. 版本管理：
   - 保存模组的特定版本
   - 在模组更新导致问题时可以回退版本
   - 管理不同Tmodloader版本的模组

## 注意事项

- 源目录必须存在
- 目标目录如果不存在会自动创建
- 如果目标目录中存在同名文件，将会被覆盖
- 确保对源目录和目标目录有足够的读写权限

## 错误处理

程序会处理以下情况：
- 源目录不存在
- 目录无法访问
- 文件复制失败
- 版本号格式错误

所有错误都会在控制台中显示详细信息。

## 常见问题

Q: 为什么需要备份模组？
A: Steam Workshop的模组可能会被作者更新或下架，备份可以保留特定版本的模组文件。

Q: 如何找到Steam Workshop的模组目录？
A: 可以通过Everything搜索`.tmod`文件，或者在Steam的Workshop内容目录中查找（通常在Steam安装目录下的steamapps/workshop/content/1281930）。

Q: 模组版本号格式不是年份.月份怎么办？
A: 程序会尝试将版本号解析为数字进行比较，只要版本号中的数字大小符合实际版本先后即可。

## 贡献指南

欢迎提交问题和改进建议！请：
1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件

## 作者

[Your Name]

## 更新日志

### 1.0.0 (2023-12-19)
- 初始版本发布
- 支持基于版本号的mod文件复制
- 添加详细的操作日志
