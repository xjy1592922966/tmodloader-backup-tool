const fs = require('fs');
const path = require('path');

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error('使用方法: npm run copy -- <源目录路径> <目标目录路径>');
    process.exit(1);
}

const sourceDir = args[0];
const targetDir = args[1];

// 检查源目录是否存在
if (!fs.existsSync(sourceDir)) {
    console.error('错误: 源目录不存在');
    process.exit(1);
}

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// 比较版本号字符串
function compareVersions(a, b) {
    const partsA = a.split('.');
    const partsB = b.split('.');
    
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const numA = parseInt(partsA[i] || '0');
        const numB = parseInt(partsB[i] || '0');
        
        if (numA !== numB) {
            return numB - numA;
        }
    }
    return 0;
}

// 获取目录下最新的子目录（按文件夹名称判断）
function getLatestSubDirectory(directory) {
    const items = fs.readdirSync(directory)
        .map(item => {
            const fullPath = path.join(directory, item);
            return {
                name: item,
                path: fullPath,
                isDirectory: fs.statSync(fullPath).isDirectory()
            };
        })
        .filter(item => item.isDirectory);

    if (items.length === 0) return null;

    // 按版本号排序
    items.sort((a, b) => compareVersions(a.name, b.name));
    return items[0].path;
}

// 检查文件是否为mod文件
function isModFile(filename) {
    return filename.toLowerCase().endsWith('.tmod');
}

// 复制mod文件
function copyModFiles(sourceDir, targetDir) {
    console.log(`正在搜索目录: ${sourceDir}`);
    const files = fs.readdirSync(sourceDir);
    let copiedFiles = 0;

    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        if (isModFile(file)) {
            const targetPath = path.join(targetDir, file);
            try {
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`已复制: ${file}`);
                console.log(`从: ${sourcePath}`);
                console.log(`到: ${targetPath}\n`);
                copiedFiles++;
            } catch (error) {
                console.error(`复制文件失败: ${file}`);
                console.error(`错误信息: ${error.message}\n`);
            }
        }
    });

    return copiedFiles;
}

// 主流程
console.log('开始搜索mod目录...\n');
let totalCopiedFiles = 0;

// 获取所有第一层目录
const modDirs = fs.readdirSync(sourceDir)
    .map(item => path.join(sourceDir, item))
    .filter(item => fs.statSync(item).isDirectory());

// 处理每个mod目录
modDirs.forEach(modDir => {
    console.log(`处理mod目录: ${modDir}`);
    const latestDir = getLatestSubDirectory(modDir);
    
    if (latestDir) {
        console.log(`找到最新子目录: ${latestDir}`);
        const count = copyModFiles(latestDir, targetDir);
        totalCopiedFiles += count;
        if (count > 0) {
            console.log(`从 ${path.basename(modDir)} 复制了 ${count} 个mod文件\n`);
        }
    } else {
        console.log(`在 ${path.basename(modDir)} 中未找到子目录\n`);
    }
});

if (totalCopiedFiles === 0) {
    console.log('未找到任何.tmod文件');
} else {
    console.log(`\n完成! 总共复制了 ${totalCopiedFiles} 个mod文件到 ${targetDir}`);
}
