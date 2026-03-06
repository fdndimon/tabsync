# 🔄 TabSync

A zero-dependency, ultra-lightweight JavaScript library to reactively sync state across multiple browser tabs in real-time.

## ✨ Why TabSync?
When a user opens your app in multiple tabs, keeping the UI synchronized (like cart items, theme preferences, or auth state) can be a headache. TabSync uses the modern `BroadcastChannel` API and JS `Proxy` to make cross-tab communication invisible and effortless.

## 🚀 Features
- **Real-time**: Tabs communicate instantly.
- **Persistent**: Uses `localStorage` to remember state after closing.
- **Reactive**: Just mutate `store.state` and your UI updates everywhere.
- **Tiny**: ~50 lines of code.

## 💻 Usage

```html
<script src="tabsync.js"></script>
<script>
  const store = new TabSync('my-awesome-app', { theme: 'light' });

  // 1. Subscribe to changes
  store.subscribe((state) => {
    document.body.className = state.theme;
  });

  // 2. Mutate state (will instantly update all other open tabs!)
  document.getElementById('btn').onclick = () => {
    store.state.theme = 'dark'; 
  };
</script>
```
## 🛠 Tech
* JS ES6
* BroadcastChannel API
* Proxy API
