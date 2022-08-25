import Tokens from "./token"
export default {
  [Tokens.noEditingCode]: "没有正在编写的代码",
  [Tokens.noStyle]: "没有可供抽取的style样式",
  [Tokens.requireQuery]: "输入目标 CSS query",
  [Tokens.querySample]: "#id 或 .className 或更复杂的 query",

} as Record<Tokens, string>
