
module.exports =
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

#module.exports = {}
