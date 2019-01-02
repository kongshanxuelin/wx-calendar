import es6 from '../assets/plugins/es6-promise'

/**
 * 创建资源对象的工厂函数
 * 
 * @param {string} url 一个含有参数的URL模板
 * @param {Object} paramDefaults URL参数的默认值
 * @param {Object} actions 资源方法的默认值
 * @param {Object} options 资源方法后缀字符串的默认值
 * 
 * @example
 * 
 * ```js
	// 例如以下为后台提供的接口文档
	// GET /api/users：获取所有用户资源
	// GET /api/users/ID：获取某个指定用户的信息
	// POST /api/users：新建一个用户
	// PUT /api/users/ID：更新某个指定用户的信息
	// DELETE /api/users/ID：删除某个指定用户
	 
	// 创建资源实例对象，接收四个参数url, paramDefaults, actions, options
	const user = new Resource('/api/users/:id', {id:'@id'}, {
        list: {
            method: 'GET',
            header: {
                    Authorization: 'Authorization',
            },
        },
	}, {
        stripTrailingSlashes: true,
        suffix: 'Async',
	})
	          
	// 获取所有用户资源
	user.listAsync()
	.then(res => console.log(res))
	.catch(err => console.log(err))
	 
	// 获取ID=123用户的信息
	user.getAsync({ id: 123 })
	.then(res => console.log(res))
	.catch(err => console.log(err))
	 
	// 新建一个用户
	user.saveAsync({ name: '微信小程序' })
	.then(res => console.log(res))
	.catch(err => console.log(err))
	 
	// 更新ID=123用户的信息
	user.updateAsync({ id: 123 },{ name: '微信小程序联盟' })
	.then(res => console.log(res))
	.catch(err => console.log(err))
	 
	// 删除ID=123用户的信息
	user.deleteAsync({ id: 123 })
	.then(res => console.log(res))
	.catch(err => console.log(err))
	 
	// 返回的实例对象包含六个默认方法，getAsync、saveAsync、queryAsync、removeAsync、deleteAsync与一个自定义方法listAsync
	//
	// user.getAsync({id: 123}) 向/api/users/123发起一个GET请求，params作为填充url中变量，一般用来请求某个指定资源
	// user.queryAsync(params) 同getAsync()方法使用类似，一般用来请求多个资源
	// user.saveAsync(params, payload) 发起一个POST请，payload作为请求体，一般用来新建一个资源
	// user.updateAsync(params, payload) 发起一个PUT请，payload作为请求体，一般用来更新某个指定资源
	// user.deleteAsync(params, payload) 发起一个DELETE请求，payload作为请求体，一般用来移除某个指定资源
	// user.removeAsync(params, payload) 同deleteAsync()方法使用类似，一般用来移除多个资源
	//
	// user.listAsync({}) 向/api/users发送一个GET请求

 * ```
 */
class Resource {
    constructor(url = '', paramDefaults = {}, actions = {}, options = {}) {
    	Object.assign(this, {
    		url, 
    		paramDefaults, 
    		actions, 
    		options, 
    	})
        this.__init()
    }

    /**
     * __init
     */
    __init() {
    	this.__initTools()
    	this.__initDefaults()
    	this.__initResource()
    }

	/**
	 * Utility functions.
	 */
    __initTools() {
    	this.__tools = {
    		isArray(value) {
				return Array.isArray(value)
			},
			isFunction(value) {
				return typeof value === 'function'
			},
			isDefined(value) {
				return typeof value !== 'undefined'
			},
			isObject(value) {
				return value !== null && typeof value === 'object'
			},
			type(obj) {
				const toString = Object.prototype.toString

				if ( obj == null ) {
					return obj + ''
				}

				return typeof obj === 'object' || typeof obj === 'function' ? toString.call(obj) || 'object' : typeof obj
			},
			clone(obj) {
			    if (typeof obj !== 'object' || !obj) {
			        return obj
			    }
			    let copy = {}
			    for (let attr in obj) {
			        if (obj.hasOwnProperty(attr)) {
			            copy[attr] = obj[attr]
			        }
			    }
			    return copy
			},
			each(obj, iterator) {
			    let i, key
			    if (obj && typeof obj.length === 'number') {
			        for (i = 0; i < obj.length; i++) {
			            iterator.call(obj[i], obj[i], i)
			        }
			    } else if (this.isObject(obj)) {
			        for (key in obj) {
			            if (obj.hasOwnProperty(key)) {
			                iterator.call(obj[key], obj[key], key)
			            }
			        }
			    }
			    return obj
			},
			isPlainObject(obj) {
				let getProto = Object.getPrototypeOf
				let class2type = {}
				let toString = class2type.toString
				let hasOwn = class2type.hasOwnProperty
				let fnToString = hasOwn.toString
				let ObjectFunctionString = fnToString.call(Object)
				let proto, Ctor
				if (!obj || this.type(obj) !== '[object Object]') {
					return !1
				}
				proto = getProto( obj )
				if ( !proto ) {
					return !0
				}
				Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
				return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString
			},
			extend() {
				let src, copyIsArray, copy, name, options, clone,
					target = arguments[0] || {},
					i = 1,
					length = arguments.length,
					deep = !1;

				if (typeof target === 'boolean') {
					deep = target
					target = arguments[ i ] || {}
					i++
				}

				if (typeof target !== 'object' && !this.isFunction(target)) {
					target = {}
				}

				if (i === length) {
					target = this
					i--
				}

				for (; i < length; i++) {
					if ( (options = arguments[ i ]) != null ) {
						for (name in options) {
							src = target[name]
							copy = options[name]

							if (target === copy) {
								continue
							}

							if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
								if (copyIsArray) {
									copyIsArray = !1
									clone = src && isArray(src) ? src : []
								} else {
									clone = src && this.isPlainObject(src) ? src : {}
								}
								target[name] = this.extend(deep, clone, copy)
							} else if (copy !== undefined) {
								target[name] = copy
							}
						}
					}
				}
				return target
			},
			encodeUriSegment(val) {
				return this.encodeUriQuery(val, true).
					replace(/%26/gi, '&').
					replace(/%3D/gi, '=').
					replace(/%2B/gi, '+')
			},
			encodeUriQuery(val, pctEncodeSpaces) {
				return encodeURIComponent(val).
					replace(/%40/gi, '@').
					replace(/%3A/gi, ':').
					replace(/%24/g, '$').
					replace(/%2C/gi, ',').
					replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'))
			},
    	}
    }

    /**
     * __initDefaults
     */
    __initDefaults() {
    	this.defaults = {
    		// 拦截器
    		interceptors: [{
    			request: (request) => {
    				return request
    			},
    			requestError: (requestError) => {
    				return requestError
    			},
    			response: (response) => {
    				return response
    			},
    			responseError: (responseError) => {
    				return responseError
    			},
    		}],

    		// URL是否以‘/‘结尾
			stripTrailingSlashes: true,

			// 方法名后缀字符串
			suffix: 'Async',

			// 默认方法
			actions: {
				'get': { method: 'GET' },
				'save': { method: 'POST' },
				'update': { method: 'PUT' },
				'query': { method: 'GET' },
				'remove': { method: 'DELETE' },
				'delete': { method: 'DELETE' },
			}
		}
    }

    /**
     * __initRoute         
     */
    __initRoute(template, defaults) {
    	const that = this
    	const PROTOCOL_AND_DOMAIN_REGEX = /^https?:\/\/[^\/]*/

		function Route(template, defaults) {
			this.template = template
			this.defaults = that.__tools.extend({}, that.defaults, defaults)
			this.urlParams = {}
		}

		Route.prototype = {
			setUrlParams: function(config, params, actionUrl) {
				let self = this, url = actionUrl || self.template, val, encodedVal, protocolAndDomain = ''
				let urlParams = self.urlParams = {}

				that.__tools.each(url.split(/\W/), (param, key) => {
					if (param === 'hasOwnProperty') {
						throw `hasOwnProperty is not a valid parameter name.`
					}
					if (!(new RegExp('^\\d+$').test(param)) && param && (new RegExp('(^|[^\\\\]):' + param + '(\\W|$)').test(url))) {
						urlParams[param] = {
							isQueryParamValue: (new RegExp('\\?.*=:' + param + '(?:\\W|$)')).test(url)
						}
					}
				})

				url = url.replace(/\\:/g, ':')
				url = url.replace(PROTOCOL_AND_DOMAIN_REGEX, function(match) {
					protocolAndDomain = match
					return ''
				})

				params = params || {}

				that.__tools.each(self.urlParams, (paramInfo, urlParam) => {
					val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam]
					if (that.__tools.isDefined(val) && val !== null) {
						if (paramInfo.isQueryParamValue) {
							encodedVal = that.__tools.encodeUriQuery(val, true)
						} else {
							encodedVal = that.__tools.encodeUriSegment(val)
						}
						url = url.replace(new RegExp(':' + urlParam + '(\\W|$)', 'g'), function(match, p1) {
							return encodedVal + p1
						})
					} else {
						url = url.replace(new RegExp('(/?):' + urlParam + '(\\W|$)', 'g'), function(match, leadingSlashes, tail) {
							if (tail.charAt(0) === '/') {
								return tail
							} else {
								return leadingSlashes + tail
							}
						})
					}
				})

				// strip trailing slashes and set the url (unless this behavior is specifically disabled)
				if (self.defaults.stripTrailingSlashes) {
					url = url.replace(/\/+$/, '') || '/'
				}

				// then replace collapse `/.` if found in the last URL path segment before the query
				// E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
				url = url.replace(/\/\.(?=\w+($|\?))/, '.')

				// replace escaped `/\.` with `/.`
				config.url = protocolAndDomain + url.replace(/\/\\\./, '/.')

				// set params - delegate param encoding to $http
				that.__tools.each(params, (value, key) => {
					if (!self.urlParams[key]) {
						config.data = config.data || {}
						config.data[key] = value
					}
				})
			}
		}

		return new Route(template, defaults)
    }

    /**
     * __initResource
     */
    __initResource() {
    	const route = this.__initRoute(this.url, this.options)
    	const actions = this.__tools.extend({}, this.defaults.actions, this.actions)

    	for(let name in actions) {
    		this[name + route.defaults.suffix] = (...args) => {
				const httpConfig = this.__setHttpConfig(route, actions[name], ...args)
				return this.__defaultRequest(httpConfig)
    		}
    	}
    }

    /**
     * 设置httpConfig
     */
    __setHttpConfig(route, action, ...args) {
    	const MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/
    	
    	// 判断是否为有效的路径
		const isValidDottedPath = (path) => {
			return (path != null && path !== '' && path !== 'hasOwnProperty' && MEMBER_NAME_REGEX.test('.' + path))
		}

		// 查找路径
		const lookupDottedPath = (obj, path) => {
			if (!isValidDottedPath(path)) {
				throw `badmember, Dotted member path ${path} is invalid.`
			}
			let keys = path.split('.')
			for (let i = 0, ii = keys.length; i < ii && this.__tools.isDefined(obj); i++) {
				let key = keys[i]
				obj = (obj !== null) ? obj[key] : undefined
			}
			return obj
		}

		// 提取参数
		const extractParams = (data, actionParams) => {
			let ids = {}
			actionParams = this.__tools.extend({}, this.paramDefaults, actionParams)
			for(let key in actionParams) {
				let value = actionParams[key]
				if (this.__tools.isFunction(value)) { 
					value = value(data) 
				}
				ids[key] = value && value.charAt && value.charAt(0) === '@' ? lookupDottedPath(data, value.substr(1)) : value
			}
			return ids
        }

    	let params = {}, data = {}, httpConfig = {}, hasBody = /^(POST|PUT|PATCH)$/i.test(action.method)

    	// 判断参数个数
		switch (args.length) {
			case 2:
				params = args[0]
				data = args[1]
				break
			case 1:
				if (hasBody) data = args[0]
				else params = args[0]
				break
			case 0: break
			default:
				throw `Expected up to 2 arguments [params, data, success, error], got ${args.length} arguments`
		}

		// 设置httpConfig
		for(let key in action) {
			switch (key) {
				default:
					httpConfig[key] = this.__tools.clone(action[key])
					break
				case 'params':
					break
			}
		}

		// 判断是否为(POST|PUT|PATCH)请求，设置请求data
		if (hasBody) {
			httpConfig.data = data
		}

		// 解析URL
		route.setUrlParams(httpConfig, this.__tools.extend({}, extractParams(data, action.params || {}), params), action.url)

		return httpConfig
    }

    /**
     * 以wx.request作为底层方法
     * @param {Object} httpConfig 请求参数配置
     */
    __defaultRequest(httpConfig) {
    	// 注入拦截器
    	const chainInterceptors = (promise, interceptors) => {
			for (let i = 0, ii = interceptors.length; i < ii;) {
				let thenFn = interceptors[i++]
				let rejectFn = interceptors[i++]
				promise = promise.then(thenFn, rejectFn)
			}
			return promise
		}

		let requestInterceptors = []
		let responseInterceptors = []
		let reversedInterceptors = this.defaults.interceptors
		let promise = this.__resolve(httpConfig)

		// 缓存拦截器
		reversedInterceptors.forEach((n, i) => {
			if (n.request || n.requestError) {
				requestInterceptors.push(n.request, n.requestError)
			}
			if (n.response || n.responseError) {
				responseInterceptors.unshift(n.response, n.responseError)
			}
		})

		// 注入请求拦截器
        promise = chainInterceptors(promise, requestInterceptors)

        // 发起HTTPS请求
        promise = promise.then(this.__http)

        // 注入响应拦截器
        promise = chainInterceptors(promise, responseInterceptors)

        // 接口调用成功，res = {data: '开发者服务器返回的内容'}
        promise = promise.then(res => res.data, err => err)

		return promise	
    }

    /**
     * __http - wx.request
     */
    __http(obj) {
		return new es6.Promise((resolve, reject) => {
			obj.success = (res) => resolve(res)
			obj.fail = (res) => reject(res)
            wx.request(obj)
        })
	}

	/**
	 * __resolve
	 */
	__resolve(res) {
		return new es6.Promise((resolve, reject) => {
			resolve(res)
		})
	}

	/**
	 * __reject
	 */
	__reject(res) {
		return new es6.Promise((resolve, reject) => {
			reject(res)
		})
	}

	/**
	 * setDefaults
	 */
    setDefaults(newDefaults) {
    	this.__tools.extend(this.defaults, newDefaults)
    }
}

export default Resource