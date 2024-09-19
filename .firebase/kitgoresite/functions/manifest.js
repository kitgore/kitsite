export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["bubble.png","cat.png","CEVnoise3.gif","CEVnoise4.gif","CEVnoise8.mp4","CEVnoise8.webm","coda.png","favicon.png","perfectDOS.ttf"]),
	mimeTypes: {".png":"image/png",".gif":"image/gif",".mp4":"video/mp4",".webm":"video/webm",".ttf":"font/ttf"},
	_: {
		client: {"start":"_app/immutable/entry/start.BSH_riEg.js","app":"_app/immutable/entry/app.DnTdn4mK.js","imports":["_app/immutable/entry/start.BSH_riEg.js","_app/immutable/chunks/entry.a7i589M7.js","_app/immutable/chunks/scheduler.W2pu3yam.js","_app/immutable/entry/app.DnTdn4mK.js","_app/immutable/chunks/scheduler.W2pu3yam.js","_app/immutable/chunks/index.BefiF1ZC.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
