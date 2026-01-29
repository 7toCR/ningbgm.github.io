const DATA_URL = "./data/example_mp4.json";

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null) continue;
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, String(v));
  }
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child === undefined || child === null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function setStatus(msg) {
  const status = document.getElementById("status");
  if (!status) return;
  status.textContent = msg || "";
}

function mediaNode(kind, src, caption) {
  if (!src) {
    return el("div", { class: "media" }, [
      el("div", { class: "badge", text: "未提供媒体路径" }),
      el("div", { class: "caption", text: caption || "" }),
    ]);
  }

  if (kind === "video") {
    return el("div", { class: "media" }, [
      el("video", { controls: "", preload: "metadata", src }),
      caption ? el("div", { class: "caption", text: caption }) : null,
    ]);
  }

  return el("div", { class: "media" }, [
    el("audio", { controls: "", preload: "metadata", src }),
    caption ? el("div", { class: "caption", text: caption }) : null,
  ]);
}

function renderVideoGallery(container, data) {
  container.innerHTML = "";
  const title = data?.title || "Examples";
  const videos = Array.isArray(data?.videos) ? data.videos : [];

  container.appendChild(el("div", { class: "section-head" }, [
    el("h2", { class: "h2", text: title }),
    el("p", { class: "muted", text: "只展示仓库 example/ 目录下的 mp4（GitHub Pages 可直接播放）。" }),
  ]));

  if (!videos.length) {
    container.appendChild(el("div", { class: "card" }, [
      el("p", { class: "muted", text: "未找到可展示的视频（请检查 web/data/example_mp4.json）" }),
    ]));
    return;
  }

  const grid = el("div", { class: "gallery" });
  for (const v of videos) {
    grid.appendChild(el("div", { class: "video-card" }, [
      el("div", { class: "video-title" }, [
        el("span", { class: "badge", text: v.id || "video" }),
        el("span", { class: "muted tiny", text: v.title || "" }),
      ]),
      mediaNode("video", v.src, ""),
      v.src ? el("div", { class: "caption", text: v.src }) : null,
    ]));
  }

  container.appendChild(grid);
}

async function loadData() {
  setStatus("正在加载 example_mp4.json…");
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`加载失败：${res.status} ${res.statusText}`);
  return await res.json();
}

async function renderAll() {
  try {
    const data = await loadData();
    renderVideoGallery(document.getElementById("videoGallery"), data);
    setStatus(`已加载：${new Date().toLocaleString()}`);
  } catch (e) {
    console.error(e);
    setStatus(String(e?.message || e));
  }
}

document.getElementById("reloadBtn")?.addEventListener("click", () => {
  renderAll();
});

renderAll();

