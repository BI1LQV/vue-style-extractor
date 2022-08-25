import Tokens from "./token"
export default {
  [Tokens.noEditingCode]: "no editing code",
  [Tokens.noStyle]: "style attribute not detected or no style to extract",
  [Tokens.requireQuery]: "Input the target CSS query",
  [Tokens.querySample]: "#id or .className or some more complex ones",
} as Record<Tokens, string>
