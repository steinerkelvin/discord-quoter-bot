
subscript_numbers = new Map( [
  ["0", "₀"]
  ["1", "₁"]
  ["2", "₂"]
  ["3", "₃"]
  ["4", "₄"]
  ["5", "₅"]
  ["6", "₆"]
  ["7", "₇"]
  ["8", "₈"]
  ["9", "₉"]
] )

module.exports =
  idt: (i) -> i

  get_env: (names) ->
    vars = {}
    for name in names
      if not (value = process.env[name])
        console.warn "'#{name}' environment variable missing"
        vars[name] = null
      else
        vars[name] = value
    return vars

  get_env_check: (names) ->
    vars = {}
    for name in names
      if not (value = process.env[name])
        console.error "'#{name}' environment variable missing"
        process.exit(1)
      else
        vars[name] = value
    return vars

  isTrue: (v) ->
    if typeof v == 'string' and v.toLowerCase() in ['true', '1']
      return true
    else if v == true or v == 1
      return true
    else
      return false

  strNumberToSubscript: (string) ->
    ( (if subscript_numbers.has(c) then subscript_numbers.get(c) else c) for c in string )
    .join ""
