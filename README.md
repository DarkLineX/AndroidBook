# AndroidBook

安卓系统 逆向 · 内核 · 运行时 —— 从 boot.img patch 到 KPM 内核工程的一本条理化教程。

**在线阅读：https://darklinex.github.io/AndroidBook/**

## 这本书讲什么

这不是一本"技巧合集"，而是一本按能力阶梯组织的工程手册。全书围绕三条主线展开：

- **可信链**（怎么验证）
- **运行链**（怎么执行）
- **检测链**（怎么发现）

所有技术，都是在这三条线上的某个点做文章。

## 目录

| 部分 | 内容 | 讲数 |
| --- | --- | --- |
| 第一部 · 系统与检测基础 | boot.img / 启动链 / TEE 与三绿 / zygote / linker / ptrace / hook / dex | 16 |
| 第二部 · 内核基础 | 进程调度 / 内存 / 异常 / VFS / 追踪 / BTF / KASLR / SELinux | 8 |
| 第三部 · Frida 详解 | 启动注入 / 脚本时机 / IPC / SELinux / Stalker / 自定义 linker | 11 |
| 第四部 · KPM 内核工程 | 模块生命周期 / 观测面 / Text Shadow / 单步 / 硬件断点 | 7 |
| 第五部 · LSPosed | LSPlant / 回调链 / DEX 生命周期 / 版本适配 / 侧信道 | 10 |
| 企业壳实战 | DexProtect / Promon 导览 | 3 |
| 二期 · 混淆与 VMP | 编译原理 → VMP 分析 | 2 |
| 实战训练营 | 造检测→破→加固→再破 | 3 |
| 附录 | 速查表 / 术语 / 学习路线 / 自测答案 / 排错 | 5 |

## 怎么读

1. **先建模型，再记细节**。模型对了，细节可以查；模型错了，细节全是散的。
2. **每个结论配一个可证伪实验**。不做实验的"理解"，多半是错觉。
3. **改完必须回归**。任何"应该没问题"的改动，都要用同一套用例重跑。

## 技术说明

- 纯静态站点，无构建依赖，无 JavaScript 框架
- 60 幅原理图，全部为矢量式位图（1080px 宽，扁平风格）
- 支持移动端、代码一键复制、目录搜索
- `.nojekyll` 已启用，绕过 Jekyll 处理（文件名含下划线/特殊字符也能正常访问）

## 本地预览

```bash
git clone https://github.com/DarkLineX/AndroidBook.git
cd AndroidBook
python -m http.server 8000
# 打开 http://localhost:8000
```

## 许可

本书内容仅供学习与研究使用。
