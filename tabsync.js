/**
 * TabSync v1.0.0
 * Cross-tab reactive state manager
 */
class TabSync {
  constructor(storeName, initialState = {}) {
    this.storeName = storeName;
    this.channel = new BroadcastChannel('tabsync_' + storeName);
    this.listeners = [];
    this._isSyncing = false; // Флаг для защиты от бесконечного цикла

    // Восстанавливаем данные или берем начальные
    const saved = localStorage.getItem(storeName);
    const baseState = saved ? JSON.parse(saved) : initialState;

    this.state = this._observe(baseState);

    // Слушаем изменения из ДРУГИХ вкладок
    this.channel.onmessage = (event) => {
      this._isSyncing = true;
      Object.assign(this.state, event.data); // Обновляем локальный стейт
      this._isSyncing = false;
      this._notify();
    };
  }

  _observe(obj) {
    const self = this;
    return new Proxy(obj, {
      set(target, prop, value) {
        target[prop] = value;
        
        // Если изменение произошло в ЭТОЙ вкладке (а не прилетело из соседней)
        if (!self._isSyncing) {
          localStorage.setItem(self.storeName, JSON.stringify(target));
          self.channel.postMessage(target); // Рассылаем всем соседям
          self._notify(); // Обновляем свой UI
        }
        return true;
      }
    });
  }

  _notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // Метод для подписки UI на обновления
  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.state); // Сразу отдаем текущее состояние
  }
}

if (typeof module !== 'undefined') module.exports = TabSync;
