import '../styles.css';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nmcwcrbtsxkhajwcoesb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_J-QPuf9C-08pZ0glk7zDcQ_B6jgeasO';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const A = (id, size = 40) => `https://i.pravatar.cc/${size}?img=${id}`;
const img = (id, w = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;

const state = {
  page: 'Home',
  liked: new Set(),
  friends: new Set(),
  saved: new Set(),
  comments: {},
  posts: [],
  authUser: null,
  authBusy: false,
  messages: [
    { person: 'Amara Okafor', avatar: A(47), preview: 'That is a great idea!' },
    { person: 'Daniel James', avatar: A(12), preview: 'I will send the details shortly.' },
    { person: 'Fatima Bello', avatar: A(44), preview: 'Thanks for connecting 😊' }
  ],
  activeChat: 0,
  chatMessages: [
    [
      { text: 'Hey! Welcome to ConnectSphere 👋', mine: false },
      { text: 'Thank you! Excited to connect with everyone.', mine: true },
      { text: 'That is a great idea! Have you considered sharing it with the community?', mine: false }
    ],
    [{ text: 'Hi there, I will send the details shortly.', mine: false }],
    [{ text: 'Thanks for connecting 😊', mine: false }]
  ]
};

const people = [
  { name: 'Amara Okafor', role: 'Product designer', avatar: A(47), mutual: '12 mutual friends' },
  { name: 'Daniel James', role: 'Entrepreneur', avatar: A(12), mutual: '8 mutual friends' },
  { name: 'Fatima Bello', role: 'Content creator', avatar: A(44), mutual: '5 mutual friends' }
];

const products = [
  { id: 1, name: 'Wireless Headphones Pro', category: 'Electronics', price: '₦28,500', seller: 'TechPoint Store', image: img('photo-1505740420928-5e560c06d30e', 500), desc: 'Comfortable wireless headphones with rich sound and long battery life.' },
  { id: 2, name: 'Everyday Classic Sneakers', category: 'Fashion', price: '₦22,000', seller: 'Urban Steps', image: img('photo-1542291026-7eec264c27ff', 500), desc: 'Versatile everyday sneakers with a clean, modern design.' },
  { id: 3, name: 'Minimal Desk Lamp', category: 'Home & Living', price: '₦15,750', seller: 'HomeStyle NG', image: img('photo-1507473885765-e6ed057f782c', 500), desc: 'A stylish desk lamp to brighten your workspace.' },
  { id: 4, name: 'Smart Fitness Watch', category: 'Electronics', price: '₦39,900', seller: 'Gadget Hub', image: img('photo-1523275335684-37898b6baf30', 500), desc: 'Track your daily activity and keep your routine on course.' },
  { id: 5, name: 'Leather Everyday Bag', category: 'Fashion', price: '₦18,000', seller: 'Made Local', image: img('photo-1548036328-c9fa89d128fa', 500), desc: 'A practical bag with a simple, timeless silhouette.' },
  { id: 6, name: 'Indoor Green Plant', category: 'Home & Living', price: '₦8,500', seller: 'Green Corner', image: img('photo-1485955900006-10f4d324d411', 500), desc: 'Bring a little natural colour to your home or office.' }
];

const topics = [
  { icon: '💡', name: 'Business & Startups', meta: '2.4k members', desc: 'Ideas, lessons, and practical advice for building a business.' },
  { icon: '💻', name: 'Technology & AI', meta: '3.8k members', desc: 'Explore tools, trends, and the future of technology.' },
  { icon: '🌱', name: 'Agriculture & Food', meta: '1.2k members', desc: 'Share farming knowledge, market ideas, and opportunities.' },
  { icon: '📚', name: 'Learning & Careers', meta: '2.1k members', desc: 'Grow your skills and discover career opportunities.' }
];

const initialPosts = [
  { id: 1, name: 'Amara Okafor', avatar: A(47), time: '18 min ago', verified: true, text: 'A reminder that great ideas grow when we share them. What is one skill you are learning this month? I am exploring product design and would love to hear yours. ✨', image: null, likes: 28, comments: 6 },
  { id: 2, name: 'Daniel James', avatar: A(12), time: '42 min ago', verified: false, text: 'Small business owners: consistency matters more than perfection. Show up, listen to your customers, and keep improving. What has helped your business grow? #Entrepreneurship #BusinessGrowth', image: img('photo-1556761175-b413da4baf72', 900), likes: 46, comments: 12 },
  { id: 3, name: 'Fatima Bello', avatar: A(44), time: '1 hr ago', verified: true, text: 'Taking time to learn something new is an investment in yourself. Keep asking questions, keep sharing, and keep growing. 💙', image: img('photo-1521737711867-e3b97375f902', 900), likes: 19, comments: 3 }
];

state.posts = initialPosts.map(p => ({ ...p }));

const navItems = [
  ['Home', '⌂'], ['Discover', '⌕'], ['Messages', '✉'],
  ['Communities', '◈'], ['Marketplace', '▦'], ['Saved posts', '♡']
];

const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

function toast(msg) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.append(el);
  setTimeout(() => el.remove(), 2400);
}

function setPage(page) {
  state.page = page;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navButton(name, icon) {
  return `<button class="nav-item ${state.page === name ? 'active' : ''}" data-page="${name}">
    <span class="nav-emoji">${icon}</span>${name}
    ${name === 'Messages' ? '<span class="count">3</span>' : ''}
  </button>`;
}

function accountStatus() {
  if (!state.authUser) {
    return `<div class="notice">You are browsing as a guest. Sign in to publish posts to ConnectSphere.</div>`;
  }

  return `<div class="notice" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
    <span>Signed in as <strong>${escapeHTML(state.authUser.email || 'ConnectSphere member')}</strong></span>
    <button class="btn btn-outline" type="button" id="sign-out">Sign out</button>
  </div>`;
}

function authPanel() {
  if (state.authUser) return accountStatus();

  return `<div class="side-card page-panel" style="margin-bottom:15px">
    <h2>Welcome to ConnectSphere</h2>
    <p>Sign in or create an account to publish posts.</p>
    <form id="auth-form">
      <input name="email" type="email" placeholder="Email address" autocomplete="email" required
        style="box-sizing:border-box;width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;margin:8px 0">
      <input name="password" type="password" placeholder="Password (at least 6 characters)" autocomplete="current-password"
        minlength="6" required style="box-sizing:border-box;width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;margin:8px 0">
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
        <button class="btn" type="submit" name="auth-action" value="signin" ${state.authBusy ? 'disabled' : ''}>Sign in</button>
        <button class="btn btn-outline" type="button" id="create-account" ${state.authBusy ? 'disabled' : ''}>Create account</button>
      </div>
    </form>
    <p class="subtle" style="margin-top:12px">Use an email address you can access. Supabase may send a confirmation email before your first sign-in.</p>
  </div>`;
}

async function signInOrRegister(action, email, password) {
  if (state.authBusy) return;
  state.authBusy = true;
  render();

  try {
    const result = action === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) throw result.error;

    if (action === 'signup' && !result.data.session) {
      toast('Account created. Check your email for a confirmation link.');
    } else {
      toast(action === 'signup' ? 'Account created successfully.' : 'You are signed in.');
    }

    state.authUser = result.data.user || null;
    await loadSavedPosts();
  } catch (error) {
    toast(error.message || 'Authentication failed. Please try again.');
  } finally {
    state.authBusy = false;
    render();
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast(error.message);
    return;
  }

  state.authUser = null;
  toast('You have signed out.');
  render();
}

async function loadSavedPosts() {
  if (!state.authUser) {
    state.posts = initialPosts.map(p => ({ ...p }));
    return;
  }

  const { data, error } = await supabase
    .from('posts')
    .select('id, user_id, content, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Could not load posts:', error.message);
    toast('Could not load saved posts. Check your Supabase table and policies.');
    return;
  }

  const savedPosts = (data || []).map(p => ({
    id: p.id,
    userId: p.user_id,
    name: p.user_id === state.authUser.id
      ? (state.authUser.email || 'You')
      : 'ConnectSphere member',
    avatar: A(11),
    time: new Date(p.created_at).toLocaleString(),
    verified: false,
    text: p.content,
    image: null,
    likes: 0,
    comments: 0
  }));

  state.posts = [...savedPosts, ...initialPosts.map(p => ({ ...p }))];
}
function sidebar() {
  return `<aside class="sidebar">
    <div class="side-card profile-mini">
      <div class="profile-cover"></div>
      <img class="avatar" src="${A(11, 100)}" alt="Your profile">
      <h3>Iyke Kelly</h3>
      <div class="subtle">@iykekelly · ${state.authUser ? 'Member' : 'Guest'}</div>
      <div class="profile-stats">
        <div><strong>248</strong><span>Friends</span></div>
        <div><strong>${state.posts.length + 18}</strong><span>Posts</span></div>
        <div><strong>16</strong><span>Groups</span></div>
      </div>
    </div>
    <div class="side-card nav-card">
      ${navItems.map(n => navButton(...n)).join('')}
      <button class="nav-item" data-page="Ideas"><span class="nav-emoji">✧</span>Share an idea</button>
      <button class="nav-item" data-page="Profile"><span class="nav-emoji">◉</span>My profile</button>
      <button class="nav-item" data-page="Settings"><span class="nav-emoji">⚙</span>Settings</button>
    </div>
    <div class="side-bottom">About · Privacy · Guidelines · Help<br>© 2026 ConnectSphere</div>
  </aside>`;
}

function rightColumn() {
  return `<aside class="rightcol">
    <div class="side-card right-card">
      <div class="right-title"><h3>People you may know</h3><button class="text-link" data-page="Discover">See all</button></div>
      ${people.map((p, i) => `<div class="person-row">
        <img class="avatar" src="${p.avatar}" alt="">
        <div class="person-info"><strong>${p.name}</strong><span>${p.mutual}</span></div>
        <button class="add-btn" data-friend="${i}" title="Add friend">${state.friends.has(i) ? '✓' : '+'}</button>
      </div>`).join('')}
    </div>
    <div class="side-card right-card">
      <div class="right-title"><h3>Trending communities</h3><button class="text-link" data-page="Communities">Explore</button></div>
      ${topics.slice(0, 3).map(t => `<div class="topic"><div class="topic-icon">${t.icon}</div><div><strong>${t.name}</strong><span>${t.meta}</span></div></div>`).join('')}
    </div>
    <div class="side-card right-card">
      <div class="ad-box"><small>Featured promotion · Demo</small><h4>Give your business a bigger stage.</h4>
      <p>Discover the marketplace and connect with people who share your interests.</p>
      <button class="btn" data-page="Marketplace">Explore marketplace ↗</button></div>
    </div>
    <div class="footer">Community guidelines · Terms · Privacy<br>ConnectSphere is a demo social platform.</div>
  </aside>`;
}

function header() {
  return `<header class="topbar">
    <a href="#" class="brand" data-page="Home"><span class="brand-mark">C</span>ConnectSphere</a>
    <div class="search-wrap"><span class="search-icon">⌕</span><input id="global-search" placeholder="Search people, ideas, products..." aria-label="Search"></div>
    <div class="top-actions">
      <button class="icon-btn" data-page="Messages" title="Messages">✉<i class="dot"></i></button>
      <button class="icon-btn" data-toast="Notifications are ready to connect to a backend." title="Notifications">♧</button>
      <img class="avatar" src="${A(11, 80)}" alt="Profile">
    </div>
  </header>`;
}

function mobileNav() {
  return `<nav class="mobile-nav">${[['Home', '⌂'], ['Discover', '⌕'], ['Create', '＋'], ['Messages', '✉'], ['Profile', '◉']]
    .map(([p, i]) => `<button data-page="${p}" class="${state.page === p ? 'active' : ''}"><span>${i}</span>${p}</button>`).join('')}</nav>`;
}

function storyStrip() {
  return `<div class="stories">${[{ n: 'Your story', a: A(11) }, ...people.map(p => ({ n: p.name.split(' ')[0], a: p.avatar })), { n: 'Michael', a: A(22) }, { n: 'Zainab', a: A(25) }]
    .map((s, i) => `<button class="story" data-toast="${i === 0 ? 'Story creation will be enabled with media upload.' : 'Stories will be available when story storage is connected.'}">
      <div class="story-ring"><img src="${s.a}" alt=""></div><strong>${s.n}</strong><small>${i === 0 ? 'Add story' : 'View story'}</small>
    </button>`).join('')}</div>`;
}

function postCard(p) {
  const liked = state.liked.has(p.id);
  const saved = state.saved.has(p.id);
  const comments = state.comments[p.id] || [];

  return `<article class="side-card post" id="post-${p.id}">
    <div class="post-head"><img class="avatar" src="${p.avatar}" alt="">
      <div class="post-person"><strong>${escapeHTML(p.name)} ${p.verified ? '✦' : ''}</strong><span>${escapeHTML(p.time)} · ◉</span></div>
      <button class="more" data-toast="Post options can include report, hide, and copy link." aria-label="More options">···</button>
    </div>
    <p class="post-copy">${escapeHTML(p.text).replace(/#([A-Za-z0-9]+)/g, '<span class="tag">#$1</span>')}</p>
    ${p.image ? `<img class="post-image" src="${p.image}" alt="Post image" loading="lazy">` : ''}
    <div class="post-metrics"><span>💙 ${p.likes + (liked ? 1 : 0)} reactions</span><span>${p.comments + comments.length} comments · 2 shares</span></div>
    <div class="post-actions">
      <button class="post-action ${liked ? 'liked' : ''}" data-like="${p.id}">${liked ? '♥ Liked' : '♡ Like'}</button>
      <button class="post-action" data-comment="${p.id}">▢ Comment</button>
      <button class="post-action" data-share="${p.id}">↗ Share</button>
      <button class="post-action ${saved ? 'liked' : ''}" data-save="${p.id}">${saved ? '▣ Saved' : '♧ Save'}</button>
    </div>
    ${comments.length ? `<div class="comments">${comments.map(c => `<div class="comment-line"><strong>You:</strong> ${escapeHTML(c)}</div>`).join('')}</div>` : ''}
    <form class="comment-form" data-comment-form="${p.id}" style="margin-top:10px">
      <input name="comment" placeholder="Write a comment..." aria-label="Write a comment" required><button>Send</button>
    </form>
  </article>`;
}

function composer() {
  if (!state.authUser) return authPanel();

  return `<form class="side-card composer" id="post-form">
    <div class="composer-top"><img class="avatar" src="${A(11, 80)}" alt="">
      <input name="post" placeholder="What would you like to share today?" maxlength="800" required aria-label="Create a post">
    </div>
    <div class="composer-tools">
      <button class="tool-btn" type="button" data-toast="Image upload needs file storage integration.">▧ Photo / Video</button>
      <button class="tool-btn" type="button" data-page="Ideas">✧ Share an idea</button>
      <button class="tool-btn" type="button" data-toast="Poll creation can be added to the next release.">▤ Create poll</button>
      <button class="btn" style="margin-left:auto;padding:8px 15px" type="submit">Publish post ↗</button>
    </div>
  </form>`;
}

function homePage() {
  return `<section class="feed">
    <div class="welcome"><div><h1>Good to see you, Iyke! 👋</h1>
      <p>Your space to connect with friends, exchange ideas, and discover something new.</p>
      <div style="margin-top:16px"><button class="btn btn-light" data-page="Discover">Explore your community ↗</button></div>
    </div><div class="welcome-art">🌐</div></div>
    ${composer()}
    <div class="section-head"><h2>Stories & updates</h2><button class="text-link" data-toast="Stories will be available with media storage.">View all</button></div>
    ${storyStrip()}
    <div class="section-head"><h2>Your community feed</h2><select id="feed-filter" aria-label="Feed order"><option>Most relevant</option><option>Most recent</option></select></div>
    <div id="posts-list">${state.posts.map(postCard).join('')}</div>
  </section>`;
}

function productCard(p) {
  return `<article class="side-card product">
    <img class="product-img" src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy">
    <div class="product-body"><span class="product-category">${p.category}</span><h3>${escapeHTML(p.name)}</h3>
      <div class="price">${p.price}</div><div class="seller"><span>◉</span>${p.seller}</div>
      <button class="btn" data-product="${p.id}">View details</button>
    </div>
  </article>`;
}

function marketplacePage() {
  return `<section class="feed">
    <div class="welcome"><div><h1>Discover the marketplace 🛍️</h1><p>Find products, support businesses, and connect directly with sellers.</p></div><div class="welcome-art">🛒</div></div>
    <div class="side-card composer">
      <div class="composer-top"><input id="product-search" placeholder="Search products and categories..." aria-label="Search products">
      <select id="product-category" style="border:1px solid var(--line);border-radius:10px;padding:10px;color:#60708a">
        <option value="All">All categories</option><option>Electronics</option><option>Fashion</option><option>Home & Living</option>
      </select></div>
      <div style="margin-top:12px"><button class="btn" data-toast="Seller listing creation will be connected to account and database services.">＋ List a product</button><span class="subtle" style="margin-left:10px">Demo listings · Prices are examples</span></div>
    </div>
    <div class="section-head"><h2>Featured products</h2><span class="subtle">${products.length} demo listings</span></div>
    <div class="market-grid" id="products-grid">${products.map(productCard).join('')}</div>
  </section>`;
}

function discoverPage() {
  return `<section class="feed"><div class="side-card page-panel"><h1>Discover your next connection ✨</h1>
    <p>Find people, communities, and conversations that match your interests.</p>
    <div class="search-wrap" style="max-width:none;margin:18px 0"><span class="search-icon">⌕</span><input id="discover-search" placeholder="Search people and communities..."></div>
    <div class="section-head"><h2>People you may know</h2></div>
    <div id="discover-people">${people.map((p, i) => `<div class="person-row"><img class="avatar" src="${p.avatar}" alt="">
      <div class="person-info"><strong>${p.name}</strong><span>${p.role} · ${p.mutual}</span></div>
      <button class="btn" data-friend="${i}">${state.friends.has(i) ? 'Connected' : '＋ Connect'}</button>
    </div>`).join('')}</div>
    <div class="section-head"><h2>Popular communities</h2></div>
    <div class="idea-grid">${topics.map(t => `<article class="idea-card"><div class="topic-icon">${t.icon}</div><h3>${t.name}</h3><p>${t.desc}</p>
      <span class="subtle">${t.meta}</span><div style="margin-top:13px"><button class="btn btn-outline" data-toast="Community membership requires a user account and backend.">Explore community</button></div>
    </article>`).join('')}</div>
  </div></section>`;
}

function ideasPage() {
  return `<section class="feed"><div class="side-card page-panel"><h1>Ideas & communities 💡</h1>
    <p>Good conversations can turn into meaningful opportunities. Explore a topic or share an idea with the community.</p>
    <form id="idea-form" class="side-card" style="padding:15px;margin:18px 0">
      <input name="title" placeholder="Give your idea a clear title" required style="width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;margin-bottom:10px">
      <textarea name="idea" placeholder="Describe your idea or question..." required rows="4" style="width:100%;resize:vertical;padding:12px;border:1px solid var(--line);border-radius:10px"></textarea>
      <div style="display:flex;justify-content:flex-end;margin-top:10px"><button class="btn">Share idea ↗</button></div>
    </form>
    <div id="idea-list" class="idea-grid">${topics.map(t => `<article class="idea-card"><div class="topic-icon">${t.icon}</div><h3>${t.name}</h3><p>${t.desc}</p><span class="subtle">${t.meta}</span></article>`).join('')}</div>
  </div></section>`;
}

function messagesPage() {
  const m = state.messages[state.activeChat];

  return `<section class="feed"><div class="side-card chat-layout">
    <div class="chat-list"><h3>Messages</h3>${state.messages.map((p, i) => `<div class="chat-person ${i === state.activeChat ? 'selected' : ''}" data-chat="${i}">
      <img class="avatar" src="${p.avatar}" alt=""><div><strong>${p.person}</strong><span>${p.preview}</span></div>
    </div>`).join('')}</div>
    <div class="chat-window"><div class="chat-head"><img class="avatar" src="${m.avatar}" alt="">
      <div style="flex:1"><strong>${m.person}</strong><span>Demo conversation · not connected to a live server</span></div>
      <button class="icon-btn" data-toast="Voice calling needs WebRTC or a calling provider.">☎</button>
      <button class="icon-btn" data-toast="Video calling needs WebRTC or a calling provider.">▣</button>
    </div>
    <div class="chat-messages" id="chat-messages">${state.chatMessages[state.activeChat].map(x => `<div class="bubble ${x.mine ? 'mine' : ''}">${escapeHTML(x.text)}</div>`).join('')}</div>
    <form class="chat-compose" id="chat-form"><input name="message" placeholder="Write a message..." maxlength="1000" required aria-label="Message"><button class="btn">Send ↗</button></form>
    </div>
  </div><div class="notice"><strong>Demo mode:</strong> messages appear in this browser session only.</div></section>`;
}

function profilePage() {
  return `<section class="feed"><div class="side-card page-panel" style="padding:0;overflow:hidden">
    <div style="height:150px;background:linear-gradient(120deg,#c9dcff,#a7c4ff,#e7d8ff)"></div>
    <div style="padding:0 22px 22px"><img src="${A(11, 140)}" alt="" class="avatar" style="width:94px;height:94px;border:5px solid white;margin-top:-48px">
      <h1 style="margin-top:5px">Iyke Kelly</h1><p>${escapeHTML(state.authUser?.email || '@iykekelly')} · ConnectSphere member</p>
      <p>Connecting with people, learning new things, and sharing ideas that help us grow.</p>
      <div style="display:flex;gap:25px;margin:18px 0"><span><strong>${state.posts.length + 18}</strong> posts</span><span><strong>${248 + state.friends.size}</strong> friends</span><span><strong>16</strong> communities</span></div>
      <button class="btn btn-outline" data-page="Settings">Edit profile settings</button>
    </div>
  </div><div class="section-head"><h2>Your recent posts</h2></div>${state.posts.map(postCard).join('')}</section>`;
}

function savedPage() {
  const ps = state.posts.filter(p => state.saved.has(p.id));
  return `<section class="feed"><div class="side-card page-panel"><h1>Saved posts</h1><p>Keep useful ideas and conversations close at hand.</p>
    ${ps.length ? ps.map(postCard).join('') : '<div class="empty-state">♡<strong>No saved posts yet</strong>Use the Save action on a post to find it here later.</div>'}
  </div></section>`;
}

function settingsPage() {
  return `<section class="feed">
    <div class="side-card page-panel">
      <h1>Settings & privacy ⚙</h1>
      <p>Manage your account preferences.</p>

      ${[['Profile visibility', 'Control who can view your profile.'], ['Message requests', 'Choose who can start a conversation.'], ['Notifications', 'Manage alerts and updates.'], ['Account security', 'Set up verification and secure login.']].map((x, i) => `
        <div style="padding:16px 0;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:14px">
          <div class="topic-icon">${['◉', '✉', '♧', '🔒'][i]}</div>
          <div style="flex:1">
            <strong style="font-size:13px">${x[0]}</strong>
            <p style="margin:4px 0">${x[1]}</p>
          </div>
          <button class="btn btn-outline" data-toast="This setting requires authenticated backend storage.">Manage</button>
        </div>`).join('')}

      <div class="notice" style="margin-top:20px">
        <strong>Account deletion</strong>
        <p>This permanently deletes your ConnectSphere authentication account. Other database content is deleted only if your server function or database cascade rules also handle it.</p>
        ${state.authUser
          ? '<button class="btn" id="delete-account-button" type="button" style="background:#b42318;color:white">Delete my account</button>'
          : '<p>Please sign in to access account deletion.</p>'}
      </div>

      ${accountStatus()}
    </div>
  </section>`;
}

function renderPage() {
  switch (state.page) {
    case 'Home': return homePage();
    case 'Discover': return discoverPage();
    case 'Messages': return messagesPage();
    case 'Communities': return ideasPage();
    case 'Marketplace': return marketplacePage();
    case 'Saved posts': return savedPage();
    case 'Ideas': return ideasPage();
    case 'Profile': return profilePage();
    case 'Settings': return settingsPage();
    default: return homePage();
  }
}

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `${header()}<main class="layout">${sidebar()}${renderPage()}${rightColumn()}</main>${mobileNav()}`;
  bindEvents();
}
function bindProductFilters() {
  const s = document.getElementById('product-search');
  const c = document.getElementById('product-category');

  const apply = () => {
    const q = (s?.value || '').toLowerCase();
    const cat = c?.value || 'All';
    const filtered = products.filter(p =>
      (cat === 'All' || p.category === cat) &&
      (`${p.name} ${p.category} ${p.seller}`).toLowerCase().includes(q)
    );

    const grid = document.getElementById('products-grid');
    if (grid) {
      grid.innerHTML = filtered.length
        ? filtered.map(productCard).join('')
        : '<div class="empty-state" style="grid-column:1/-1">⌕<strong>No products found</strong>Try another search or category.</div>';
      bindEvents();
    }
  };

  s?.addEventListener('input', apply);
  c?.addEventListener('change', apply);
}

function bindEvents() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      setPage(el.dataset.page);
    });
  });

  document.querySelectorAll('[data-toast]').forEach(el => {
    el.addEventListener('click', () => toast(el.dataset.toast));
  });

  document.querySelectorAll('[data-like]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.like;
      state.liked.has(id) ? state.liked.delete(id) : state.liked.add(id);
      render();
    });
  });

  document.querySelectorAll('[data-save]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.save;
      state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
      render();
      toast(state.saved.has(id) ? 'Post saved.' : 'Post removed from saved posts.');
    });
  });

  document.querySelectorAll('[data-share]').forEach(el => {
    el.addEventListener('click', async () => {
      const p = state.posts.find(x => String(x.id) === el.dataset.share);
      try {
        if (navigator.share) {
          await navigator.share({ title: 'ConnectSphere post', text: p?.text || 'Check out this post' });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(p?.text || '');
          toast('Post text copied.');
        } else {
          toast('Sharing is not supported in this browser.');
        }
      } catch {}
    });
  });

  document.querySelectorAll('[data-comment]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelector(`#post-${CSS.escape(el.dataset.comment)} input[name="comment"]`)?.focus();
    });
  });

  document.querySelectorAll('[data-comment-form]').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const id = f.dataset.commentForm;
      const txt = new FormData(f).get('comment').trim();
      if (!txt) return;
      (state.comments[id] ??= []).push(txt);
      render();
      toast('Comment added to this demo post.');
    });
  });

  document.querySelectorAll('[data-friend]').forEach(el => {
    el.addEventListener('click', () => {
      const i = Number(el.dataset.friend);
      state.friends.has(i) ? state.friends.delete(i) : state.friends.add(i);
      render();
      toast(state.friends.has(i) ? `Connection request sent to ${people[i].name}.` : 'Connection request withdrawn.');
    });
  });

  document.querySelectorAll('[data-product]').forEach(el => {
    el.addEventListener('click', () => {
      const p = products.find(x => x.id === Number(el.dataset.product));
      if (!p) return;

      const modal = document.createElement('div');
      modal.className = 'product-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:#101c3288;z-index:80;display:grid;place-items:center;padding:20px';
      modal.innerHTML = `<div class="side-card" style="max-width:520px;width:100%;overflow:hidden;position:relative">
        <button class="more" data-close style="position:absolute;right:10px;top:10px;background:#fff;border-radius:8px;z-index:1">✕</button>
        <img src="${p.image}" alt="" style="width:100%;height:230px;object-fit:cover">
        <div style="padding:22px"><span class="product-category">${p.category}</span><h2 style="font:800 22px Manrope;margin:7px 0">${escapeHTML(p.name)}</h2>
          <div class="price" style="font-size:22px">${p.price}</div><p style="font-size:13px;line-height:1.7;color:#65738a">${p.desc}</p>
          <p class="subtle">Seller: ${p.seller}</p><button class="btn" data-contact>Contact seller</button>
          <div class="notice">Demo listing. No purchase or payment is being processed.</div>
        </div>
      </div>`;

      document.body.append(modal);

      modal.addEventListener('click', e => {
        if (e.target === modal || e.target.closest('[data-close]')) modal.remove();
        if (e.target.closest('[data-contact]')) {
          modal.remove();
          setPage('Messages');
          toast('Connect a seller account to enable real enquiries.');
        }
      });
    });
  });

  document.querySelectorAll('[data-chat]').forEach(el => {
    el.addEventListener('click', () => {
      state.activeChat = Number(el.dataset.chat);
      render();
    });
  });

  const chat = document.getElementById('chat-form');
  chat?.addEventListener('submit', e => {
    e.preventDefault();
    const msg = new FormData(chat).get('message').trim();
    if (!msg) return;
    state.chatMessages[state.activeChat].push({ text: msg, mine: true });
    state.messages[state.activeChat].preview = msg;
    render();
    const box = document.getElementById('chat-messages');
    if (box) box.scrollTop = box.scrollHeight;
  });

  const authForm = document.getElementById('auth-form');
  authForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(authForm);
    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '');
    await signInOrRegister('signin', email, password);
  });

  document.getElementById('create-account')?.addEventListener('click', async () => {
    const form = document.getElementById('auth-form');
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    await signInOrRegister('signup', String(fd.get('email')).trim(), String(fd.get('password')));
  });

  document.getElementById('sign-out')?.addEventListener('click', signOut);

  const postForm = document.getElementById('post-form');
  postForm?.addEventListener('submit', async e => {
    e.preventDefault();

    if (!state.authUser) {
      toast('Please sign in before publishing.');
      return;
    }

    const input = postForm.elements.post;
    const content = input.value.trim();
    if (!content) return;

    const submitButton = postForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({ user_id: state.authUser.id, content })
        .select('id, user_id, content, created_at')
        .single();

      if (error) throw error;

      state.posts.unshift({
        id: data.id,
        userId: data.user_id,
        name: state.authUser.email || 'You',
        avatar: A(11),
        time: new Date(data.created_at).toLocaleString(),
        verified: false,
        text: data.content,
        image: null,
        likes: 0,
        comments: 0
      });

      state.page = 'Home';
      render();
      toast('Your post was published successfully!');
    } catch (error) {
      console.error('Post publishing failed:', error);
      toast(error.message || 'Could not publish your post.');
      if (submitButton) submitButton.disabled = false;
    }
  });

  document.getElementById('idea-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get('title') || '').trim();
    const idea = String(fd.get('idea') || '').trim();
    if (!title || !idea) return;

    const el = document.createElement('article');
    el.className = 'idea-card';
    el.innerHTML = `<div class="topic-icon">💡</div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(idea)}</p><span class="subtle">Shared by you · Just now</span>`;
    document.getElementById('idea-list')?.prepend(el);
    e.currentTarget.reset();
    toast('Your idea was added to this demo.');
  });

  document.getElementById('discover-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#discover-people .person-row').forEach((el, i) => {
      el.classList.toggle('hidden', !(`${people[i].name} ${people[i].role}`.toLowerCase().includes(q)));
    });
  });

  document.getElementById('feed-filter')?.addEventListener('change', e => {
    if (e.target.value === 'Most recent') {
      state.posts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      render();
    }
  });

  document.getElementById('global-search')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      setPage('Marketplace');
      const s = document.getElementById('product-search');
      if (s) {
        s.value = q;
        s.dispatchEvent(new Event('input'));
      }
    }
  });

  // Account deletion requires an exact typed confirmation.
  document.getElementById('delete-account-button')?.addEventListener('click', async () => {
    if (!state.authUser) {
      toast('Please sign in first.');
      return;
    }

    const confirmation = window.prompt(
      'WARNING: This permanently deletes your ConnectSphere account. Type DELETE MY ACCOUNT to continue:'
    );
    if (confirmation !== 'DELETE MY ACCOUNT') {
      toast('Account deletion cancelled.');
      return;
    }

    const button = document.getElementById('delete-account-button');
    if (button) button.disabled = true;

    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { confirmation: 'DELETE MY ACCOUNT' }
      });
      if (error) throw error;
      if (!data?.success) {
        throw new Error(data?.error || 'The server did not confirm account deletion.');
      }

      // The server has confirmed deletion; clear local state even if session
      // cleanup fails because the account no longer exists.
      state.authUser = null;
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.warn('Session cleanup after account deletion:', signOutError);
      }

      state.page = 'Home';
      render();
      toast('Your account deletion was confirmed.');
    } catch (error) {
      console.error('Account deletion failed:', error);
      toast(error.message || 'Could not delete your account. Please try again.');
      const currentButton = document.getElementById('delete-account-button');
      if (currentButton) currentButton.disabled = false;
    }
  });
}

async function initializeSupabase() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    state.authUser = data.session?.user || null;
    await loadSavedPosts();
  } catch (error) {
    console.error('Supabase initialization failed:', error);
    toast('Could not connect to the account service. Please refresh the page.');
  }

  render();
}

supabase.auth.onAuthStateChange((_event, session) => {
  state.authUser = session?.user || null;
  if (state.authUser) {
    loadSavedPosts().then(render);
  } else {
    state.posts = initialPosts.map(p => ({ ...p }));
    render();
  }
});

render();
initializeSupabase();
