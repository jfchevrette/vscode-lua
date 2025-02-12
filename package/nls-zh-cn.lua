local example = require 'package.nls-example'

return {
    ['config.awakened.cat']               = 'PLAY WITH ME >_<\n\n（这会启用还处于开发中的beta版，欢迎测试反馈！改变此选项需要重载窗口！）',
    ["config.runtime.version"]            = "Lua运行版本。",
    ["config.runtime.path"]               = "`package.path`",
    ["config.runtime.special"]            = [[将自定义全局变量视为一些特殊的内置变量，语言服务将提供特殊的支持。
下面这个例子表示将 `include` 视为 `require` 。
]] .. example.special,
    ["config.runtime.unicodeName"]        = "允许在名字中使用 Unicode 字符。",
    ["config.runtime.nonstandardSymbol"]  = "支持非标准的符号。请务必确认你的运行环境支持这些符号。",
    ["config.runtime.plugin"]             = "（实验）插件路径。",
    ["config.runtime.fileEncoding"]       = "文件编码，`ansi` 选项只在 `Windows` 平台下有效。",
    ['config.runtime.builtin']            = [[
调整内置库的启用状态，你可以根据实际运行环境禁用掉不存在的库（或重新定义）。

* `default`: 表示库会根据运行版本启用或禁用
* `enable`: 总是启用
* `disable`: 总是禁用
]],
    ["config.diagnostics.enable"]         = "启用诊断。",
    ["config.diagnostics.disable"]        = "禁用的诊断（使用浮框括号内的代码）。\n",-- .. example.disable,
    ["config.diagnostics.globals"]        = "已定义的全局变量。\n",-- .. example.globals,
    ["config.diagnostics.severity"]       = "修改诊断等级。\n",-- .. example.severity,
    ["config.diagnostics.neededFileStatus"]     = "如果你只想诊断打开的文件，选Opened；否则，选Any。\n",-- .. example.neededFileStatus,
    ["config.diagnostics.workspaceDelay"] = "进行工作区诊断的延迟（毫秒）。当你启动工作区，或编辑了任意文件后，将会在后台对整个工作区进行重新诊断。设置为负数可以禁用工作区诊断。",
    ["config.diagnostics.workspaceRate"]  = "工作区诊断的运行速率（百分比）。降低该值会减少CPU占用，但是也会降低工作区诊断的速度。你当前正在编辑的文件的诊断总是全速完成，不受该选项影响。",
    ["config.workspace.ignoreDir"]        = "忽略的文件与目录（使用 `.gitignore` 语法）。\n",-- .. example.ignoreDir,
    ["config.workspace.ignoreSubmodules"] = "忽略子模块。",
    ["config.workspace.useGitIgnore"]     = "忽略 `.gitignore` 中列举的文件。",
    ["config.workspace.maxPreload"]       = "最大预加载文件数。",
    ["config.workspace.preloadFileSize"]  = "预加载时跳过大小大于该值（KB）的文件。",
    ["config.workspace.library"]          = [[
外部函数库的目录路径。
语言服务会额外加载这些目录中的lua文件，即使他们不在当前的工作目录中，用于函数定义、自动完成等功能。
]],
    ['config.completion.enable']                 = '启用自动完成。',
    ['config.completion.callSnippet']            = '显示函数调用片段。',
    ['config.completion.callSnippet.Disable']    = "只显示 `函数名`。",
    ['config.completion.callSnippet.Both']       = "显示 `函数名` 与 `调用片段`。",
    ['config.completion.callSnippet.Replace']    = "只显示 `调用片段`。",
    ['config.completion.keywordSnippet']         = '显示关键字语法片段',
    ['config.completion.keywordSnippet.Disable'] = "只显示 `关键字`。",
    ['config.completion.keywordSnippet.Both']    = "显示 `关键字` 与 `语法片段`。",
    ['config.completion.keywordSnippet.Replace'] = "只显示 `语法片段`。",
    ['config.completion.displayContext']         = "预览建议的相关代码片段，可能可以帮助你了解这项建议的用法。设置的数字表示代码片段的截取行数，设置为`0`可以禁用此功能。",
    ['config.completion.workspaceWord']          = "显示工作区范围内的单词",
    ['config.color.mode']                        = "着色模式。",
    ['config.color.mode.Semantic']               = "语义着色。你可能需要同时将 `editor.semanticHighlighting.enabled` 设置为 `true` 才能生效。",
    ['config.color.mode.Grammar']                = "语法着色。",
    ['config.signatureHelp.enable']              = "启用参数提示。",
    ['config.hover.enable']                      = "启用悬停提示。",
    ['config.hover.viewString']                  = "悬停提示查看字符串内容（仅当字面量包含转义符时）。",
    ['config.hover.viewStringMax']               = "悬停提示查看字符串内容时的最大长度。",
    ['config.hover.viewNumber']                  = "悬停提示查看数字内容（仅当字面量不是十进制时）。",
    ['config.hover.fieldInfer']                  = "悬停提示查看表时，会对表的每个字段进行类型推测，当类型推测的用时累计达到该设定值（毫秒）时，将跳过后续字段的类型推测。",
    ['config.hover.previewFields']               = "悬停提示查看表时，限制表内字段的最大预览数量。",
    ['config.zzzzzz.cat']                        = 'DONT TOUCH ME, LET ME SLEEP >_<',
    ['config.develop.enable']                    = '开发者模式。请勿开启，会影响性能。',
    ['config.develop.debuggerPort']              = '调试器监听端口。',
    ['config.develop.debuggerWait']              = '调试器连接之前挂起。',
    ['config.intelliSense.searchDepth']          = '设置智能感知的搜索深度。增大该值可以增加准确度，但会降低性能。不同的项目对该设置的容忍度差异较大，请自己调整为合适的值。',
    ['config.intelliSense.fastGlobal']          = '在对全局变量进行补全，及查看 `_G` 的悬浮提示时进行优化。这会略微降低类型推测的准确度，但是对于大量使用全局变量的项目会有大幅的性能提升。',
    ['config.window.statusBar']                 = '在状态栏显示插件状态。',
    ['config.window.progressBar']               = '在状态栏显示进度条。',
    ['config.hint.enable']                      = '启用内联提示。',
    ['config.hint.paramType']                   = '在函数的参数位置提示类型。',
    ['config.hint.setType']                     = '在赋值操作位置提示类型。',
    ['config.hint.paramName']                   = '调用的参数为字面量时提示参数名。',
    ['config.telemetry.enable']                 = [[
启用遥测，通过网络发送你的编辑器信息与错误日志
* [会发送哪些数据](https://github.com/sumneko/lua-language-server/blob/master/script/service/telemetry.lua)
* [如何使用这些数据](https://github.com/sumneko/lua-telemetry-server/tree/master/method)
]],
    ['config.misc.parameters']                   = 'VSCode中启动语言服务时的[命令行参数](https://github.com/sumneko/lua-language-server/wiki/Command-line)。',

    -- TODO 英文翻译
    ['config.diagnostics.unused-local']          = '未使用的局部变量',
    ['config.diagnostics.unused-function']       = '未使用的函数',
    ['undefined-global']                         = '未定义的全局变量',
    ['global-in-nil-env']                        = '不能使用全局变量（ `_ENV` 被设置为了 `nil`）',
    ['unused-label']                             = '未使用的标签',
    ['unused-vararg']                            = '未使用的不定参数',
    ['trailing-space']                           = '后置空格',
    ['redefined-local']                          = '重复定义的局部变量',
    ['newline-call']                             = '以 `(` 开始的新行，在语法上被解析为了上一行的函数调用',
    ['newfield-call']                            = '在字面量表中，2行代码之间缺少分隔符，在语法上被解析为了一次索引操作',
    ['redundant-parameter']                      = '函数调用时，传入了多余的参数',
    ['ambiguity-1']                              = '优先级歧义，如：`num or 0 + 1`，推测用户的实际期望为 `(num or 0) + 1` ',
    ['lowercase-global']                         = '首字母小写的全局变量定义',
    ['undefined-env-child']                      = '`_ENV` 被设置为了新的字面量表，但是试图获取的全局变量不再这张表中',
    ['duplicate-index']                          = '在字面量表中重复定义了索引',
    ['empty-block']                              = '空代码块',
    ['redundant-value']                          = '赋值操作时，值的数量比被赋值的对象多',
}
