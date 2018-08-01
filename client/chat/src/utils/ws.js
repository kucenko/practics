
const listeners = {
	connected_new_user: [],
	disconnected_user: [],
	message: [],
}

/**
 * 
 * Подписка на получение данных от WebSocket
 * 
 * @param {string} name Имя события connected_new_user|disconnected_user|message
 * @param {Function} fn Функция callback при срабатывании события
 */
export function addWsListener(name, fn) {
	if (listeners[name]) {
		listeners[name].push(fn);
	}
}

/**
 * 
 * Отписка от получения данных по WebSocket
 * 
 * @param {string} name Имя события connected_new_user|disconnected_user|message
 * @param {Function} fn Функция callback при срабатывании события
 */
export function removeWsListener(name, fn) {
	if (listeners[name]) {
		const index = listeners[name].indexOf(fn);

		if (index >= 0) {
			listeners[name].splice(index, 1);
		}
	}
}

function getParams(messageObj) {
	switch (messageObj.type) {
		case 'connected_new_user':
			return messageObj;
		case 'disconnected_user':
			return messageObj.userID;
		case 'message':
			return messageObj.data;
	}
}


/**
 * Подключение WebSocket к приложению
 * 
 * @param {string} wsUrl Базовый урл для WebSocket
 */
export function connectWs(wsUrl) {
	const ws = new WebSocket(wsUrl)

	ws.onopen = () => {
		console.log('WS Open!')
	}

	ws.onmessage = (message) => {
		const messageObj = JSON.parse(message.data)

		console.log('ws message: ', messageObj);

		if (listeners[messageObj.type]) {
			const data = getParams(messageObj);

			listeners[messageObj.type].forEach(fn => fn(data))
		}
	}

	let countReconnect = 0
	const emit = (message) => {
		if (countReconnect > 5) return

		if (ws.readyState === ws.CONNECTING) {
			setTimeout(() => {
				emit(message)
				countReconnect++
			}, 500)
			return
		}

		ws.send(message)
		countReconnect = 0
	}

	return { emit }
}
