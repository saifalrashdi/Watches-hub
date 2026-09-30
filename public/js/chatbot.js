'use strict';
/* ============================================================
   Watches Hub — chat assistant (rule-based, bilingual, no AI API)
   Answers how to sell, how offers work, accounts, safety;
   searches the live marketplace and replies with listing cards.
   ============================================================ */
(function () {
  const C = {
    en: {
      title: 'Hub Assistant', sub: 'Always here — EN / عربي',
      hello: 'Ahlan! I am the Watches Hub assistant. Ask me how to sell your watch, how offers and auctions work, or name a brand and I will search the live listings.',
      chips: ['How do I sell?', 'How do auctions work?', 'How do offers work?', 'Rolex', 'Safety tips'],
      auction: 'Auctions use Bid4U-style proxy bidding:\n• Enter the MAXIMUM you are willing to pay — not your first bid.\n• The system automatically bids the smallest step needed to keep you on top, and stops at your max. You often pay less than your maximum.\n• Outbid? You get a badge on My account → My bids, and you can raise your max.\n• A bid in the last 2 minutes extends the timer by 2 minutes — no sniping.\n• Bids are binding and cannot be retracted, and you cannot bid on your own listing.\n• Some auctions have a hidden reserve — if bidding ends below it, the seller reviews the high bid as an offer.',
      auctionSell: 'To run an auction: on the Sell page choose Sale type = Auction, set a starting price, pick a duration (1, 3, 5 or 7 days) and optionally a hidden reserve. Buyers bid with a maximum and the system bids for them. Highest bid wins when the timer ends.',
      sell: 'Selling takes a minute:\n• Create a free account (top right).\n• Tap "Sell" in the menu.\n• Add photos, brand, year, condition and your price.\nYour watch goes live instantly and buyers can make offers or message you.',
      offers: 'Offers are how negotiation works here:\n• On any listing, tap "Make an offer" and name your price.\n• The seller sees it in their Offers inbox and can accept or reject.\n• You can track every offer you sent under My account → Offers sent.\nOne pending offer per listing — no spam bidding.',
      chat: 'Every listing has a "Message seller" button. It opens a private chat between you and the seller — only you two can read it. All your conversations live under My account → Messages.',
      account: 'Tap "Sign in" at the top, then "Create an account". You only need a name, email and password. Adding your WhatsApp number is optional and helps buyers reach you faster.',
      free: 'Yes — Watches Hub is completely free. No listing fees, no commission, no subscription. You deal directly with the other party.',
      safety: 'A few ground rules for safe deals:\n• Meet in a public place and inspect the watch before paying.\n• Never pay in advance to a stranger.\n• Check serial numbers and papers.\n• If a deal feels wrong, walk away — there is always another watch.',
      story: 'Watches Hub is a peer-to-peer marketplace for watch lovers — like the car classifieds, but for timepieces. Sellers list for free, buyers negotiate directly. More on the About page.',
      lang: 'Use the عربي / EN button in the header — the whole marketplace flips between English and Arabic, and remembers your choice.',
      found: 'I found this on the marketplace for you:',
      notFound: 'Nothing listed matches that right now. Try a brand like Rolex, Patek Philippe or Richard Mille — or ask me anything else.',
      fallback: 'I am a simple assistant and did not quite catch that. Try one of the chips below, or browse the marketplace.',
      placeholder: 'Ask about selling, offers, a brand…',
      viewPiece: 'View listing',
      soldNow: 'sold',
      browse: 'Browse all watches',
    },
    ar: {
      title: 'مساعد هب', sub: 'دائماً هنا — EN / عربي',
      hello: 'أهلاً! أنا مساعد ووتشز هب. اسألني كيف تبيع ساعتك، كيف تعمل العروض والمزادات، أو اذكر ماركة وسأبحث في الإعلانات الحالية.',
      chips: ['كيف أبيع؟', 'كيف تعمل المزادات؟', 'كيف تعمل العروض؟', 'رولكس', 'نصائح الأمان'],
      auction: 'المزادات تعمل بالمزايدة بالوكالة على طريقة Bid4U:\n• أدخل أقصى مبلغ مستعد لدفعه — وليس مزايدتك الأولى.\n• النظام يزايد تلقائياً بأصغر خطوة تُبقيك في الصدارة ويتوقف عند سقفك — غالباً تدفع أقل من سقفك.\n• تم تجاوزك؟ يظهر تنبيه في حسابي ← مزايداتي، ويمكنك رفع سقفك.\n• مزايدة في آخر دقيقتين تمدد المؤقت دقيقتين — لا خطف في اللحظة الأخيرة.\n• المزايدات ملزمة ولا تُسحب، ولا يمكنك المزايدة على إعلانك.\n• بعض المزادات لها سعر احتياطي مخفي — إن انتهت دونه، يراجع البائع أعلى مزايدة كعرض.',
      auctionSell: 'لإقامة مزاد: في صفحة البيع اختر نوع البيع = مزاد، حدد السعر الافتتاحي، اختر المدة (١ أو ٣ أو ٥ أو ٧ أيام) واختيارياً سعراً احتياطياً مخفياً. يزايد المشترون بسقف أقصى والنظام يزايد عنهم. أعلى مزايدة تفوز عند انتهاء الوقت.',
      sell: 'البيع يستغرق دقيقة:\n• أنشئ حساباً مجانياً (أعلى الصفحة).\n• اضغط «بيع» في القائمة.\n• أضف الصور، الماركة، السنة، الحالة وسعرك.\nتظهر ساعتك فوراً ويمكن للمشترين تقديم عروض أو مراسلتك.',
      offers: 'العروض هي طريقة التفاوض هنا:\n• في أي إعلان، اضغط «قدّم عرضاً» وحدد سعرك.\n• يرى البائع العرض في صندوق العروض ويمكنه القبول أو الرفض.\n• تتابع كل عروضك المرسلة من حسابي ← العروض المرسلة.\nعرض واحد معلّق لكل إعلان — بلا مزايدات مزعجة.',
      chat: 'كل إعلان فيه زر «راسل البائع». يفتح محادثة خاصة بينك وبين البائع — لا يقرأها غيركما. كل محادثاتك تجدها في حسابي ← الرسائل.',
      account: 'اضغط «تسجيل الدخول» في الأعلى ثم «إنشاء حساب». تحتاج فقط اسماً وبريداً وكلمة مرور. إضافة رقم واتساب اختيارية وتساعد المشترين على الوصول إليك أسرع.',
      free: 'نعم — ووتشز هب مجاني تماماً. بلا رسوم إعلان، بلا عمولة، بلا اشتراك. تتعامل مباشرة مع الطرف الآخر.',
      safety: 'قواعد بسيطة لصفقات آمنة:\n• التقِ في مكان عام وافحص الساعة قبل الدفع.\n• لا تدفع مقدماً لشخص لا تعرفه.\n• تحقق من الأرقام التسلسلية والأوراق.\n• إذا شعرت أن الصفقة مشبوهة، انسحب — هناك دائماً ساعة أخرى.',
      story: 'ووتشز هب سوق بين الأفراد لعشاق الساعات — مثل إعلانات السيارات لكن للساعات. البائعون ينشرون مجاناً، والمشترون يفاوضون مباشرة. المزيد في صفحة عن المنصة.',
      lang: 'استخدم زر عربي / EN في الأعلى — السوق كله يتحول بين العربية والإنجليزية، ويتذكر اختيارك.',
      found: 'وجدت هذا في السوق لك:',
      notFound: 'لا يوجد إعلان يطابق طلبك حالياً. جرّب ماركة مثل رولكس أو باتيك فيليب أو ريتشارد ميل — أو اسألني عن أي شيء آخر.',
      fallback: 'أنا مساعد بسيط ولم أفهم قصدك تماماً. جرّب أحد الأزرار أدناه، أو تصفح السوق.',
      placeholder: 'اسأل عن البيع، العروض، ماركة…',
      viewPiece: 'عرض الإعلان',
      soldNow: 'مُباع',
      browse: 'تصفح كل الساعات',
    },
  };

  let open = false;
  let booted = false;

  function lang() { return (window.OrgLux && OrgLux.state.lang) || 'en'; }
  function s(key) { return C[lang()][key]; }
  function esc(x) { return window.OrgLux ? OrgLux.esc(x) : String(x); }

  /* ---------- DOM ---------- */
  function build() {
    const fab = document.createElement('button');
    fab.className = 'chat-fab'; fab.id = 'chatFab'; fab.setAttribute('aria-label', 'Chat');
    fab.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M21 12c0 4.4-4 8-9 8-1.2 0-2.4-.2-3.4-.6L3 20l1.3-4.1C3.5 14.6 3 13.4 3 12c0-4.4 4-8 9-8s9 3.6 9 8z"/>
      <circle cx="8.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="12" r="1" fill="currentColor" stroke="none"/></svg>`;

    const panel = document.createElement('div');
    panel.className = 'chat-panel'; panel.id = 'chatPanel';
    panel.innerHTML = `
      <div class="chat-head"><img src="/images/wh-logo.png" alt="" class="chat-logo"><div><div class="ch-title"></div><div class="ch-sub"></div></div></div>
      <div class="chat-log" id="chatLog"></div>
      <div class="chat-chips" id="chatChips"></div>
      <div class="chat-input-row">
        <input id="chatInput" type="text" maxlength="300">
        <button class="chat-send" id="chatSend" aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </div>`;
    document.body.appendChild(fab);
    document.body.appendChild(panel);

    fab.addEventListener('click', () => { open = !open; panel.classList.toggle('open', open); if (open) greet(); });
    document.getElementById('chatSend').addEventListener('click', send);
    document.getElementById('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    refreshChrome();
  }
  function refreshChrome() {
    const p = document.getElementById('chatPanel');
    if (!p) return;
    p.querySelector('.ch-title').textContent = s('title');
    p.querySelector('.ch-sub').textContent = s('sub');
    document.getElementById('chatInput').placeholder = s('placeholder');
    renderChips();
  }
  function renderChips() {
    document.getElementById('chatChips').innerHTML =
      s('chips').map(c => `<button class="chat-chip">${esc(c)}</button>`).join('');
    document.querySelectorAll('.chat-chip').forEach(ch =>
      ch.addEventListener('click', () => handleUser(ch.textContent)));
  }

  /* ---------- messages ---------- */
  function addMsg(html, who) {
    const log = document.getElementById('chatLog');
    const el = document.createElement('div');
    el.className = 'chat-msg ' + who;
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }
  function typingOn() {
    const log = document.getElementById('chatLog');
    const el = document.createElement('div');
    el.className = 'chat-msg bot'; el.id = 'chatTyping';
    el.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    log.appendChild(el); log.scrollTop = log.scrollHeight;
  }
  function typingOff() { const el = document.getElementById('chatTyping'); if (el) el.remove(); }
  function botReply(html, delay = 600) {
    typingOn();
    setTimeout(() => { typingOff(); addMsg(html, 'bot'); }, delay);
  }
  function greet() {
    refreshChrome();
    if (booted) return;
    booted = true;
    botReply(esc(s('hello')), 500);
  }

  /* ---------- intents ---------- */
  const norm = str => str.toLowerCase().trim()
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ');
  const singular = w => w.replace(/(es|s)$/i, '');

  const KEYWORDS = {
    sell: ['sell', 'selling', 'post', 'list', 'listing', 'advertise', 'بيع', 'بيع', 'انشر', 'اعلن', 'اعلان', 'اضف'],
    auction: ['auction', 'auctions', 'bidding', 'bid4u', 'bids', 'reserve', 'مزاد', 'مزادات', 'مزايده', 'زايد', 'احتياطي'],
    offers: ['offer', 'offers', 'negotiate', 'negotiation', 'bid', 'price', 'discount', 'عرض', 'عروض', 'تفاوض', 'فاوض', 'سوم', 'خصم', 'سعر'],
    chat: ['chat', 'message', 'messages', 'contact', 'talk', 'محادثه', 'رساله', 'رسائل', 'كلم', 'تواصل'],
    account: ['account', 'register', 'signup', 'sign', 'login', 'password', 'حساب', 'تسجيل', 'دخول', 'كلمه', 'انشئ'],
    free: ['free', 'fee', 'fees', 'commission', 'cost', 'charge', 'مجاني', 'رسوم', 'عموله', 'تكلفه'],
    safety: ['safe', 'safety', 'scam', 'fraud', 'trust', 'fake', 'امان', 'نصب', 'احتيال', 'مزيف', 'ثقه'],
    story: ['story', 'about', 'who', 'what', 'hub', 'قصه', 'من', 'عن', 'ما', 'ايش', 'شو'],
    lang: ['language', 'arabic', 'english', 'switch', 'عربي', 'انجليزي', 'لغه'],
    greet: ['hi', 'hello', 'hey', 'salam', 'مرحبا', 'اهلا', 'هلا', 'سلام'],
  };
  const BRANDS = ['rolex', 'patek', 'philippe', 'richard', 'mille', 'audemars', 'piguet', 'omega',
    'cartier', 'vacheron', 'tudor', 'breitling', 'iwc', 'jaeger', 'hublot', 'panerai', 'seiko',
    'رولكس', 'باتيك', 'فيليب', 'ريتشارد', 'ميل', 'اوديمار', 'بيغيه', 'اوميغا', 'كارتييه', 'تيودور', 'هوبلو', 'سيكو'];
  const GENERIC = ['watch', 'watche', 'chrono', 'diver', 'dress', 'gold', 'steel',
    'ساعه', 'ساعات', 'كرونو', 'ذهب', 'ستانلس'];

  async function answer(text) {
    const words = norm(text).split(' ').filter(Boolean);
    const has = list => words.some(w => list.includes(w) || list.includes(singular(w)));

    if (has(KEYWORDS.greet) && words.length <= 3) return botReply(esc(s('hello')));
    if (has(KEYWORDS.sell) && has(KEYWORDS.auction)) return botReply(esc(s('auctionSell')).replace(/\n/g, '<br>') + `<br><br><a href="#/sell">${esc(lang() === 'ar' ? 'ابدأ البيع' : 'Start selling')}</a>`);
    if (has(KEYWORDS.auction)) return botReply(esc(s('auction')).replace(/\n/g, '<br>') + `<br><br><a href="#/browse?sort=ending_soon">${esc(lang() === 'ar' ? 'مزادات تنتهي قريباً' : 'Auctions ending soon')}</a>`);
    if (has(KEYWORDS.sell)) return botReply(esc(s('sell')).replace(/\n/g, '<br>') + `<br><br><a href="#/sell">${esc(lang() === 'ar' ? 'ابدأ البيع' : 'Start selling')}</a>`);
    if (has(KEYWORDS.offers)) return botReply(esc(s('offers')).replace(/\n/g, '<br>'));
    if (has(KEYWORDS.chat)) return botReply(esc(s('chat')).replace(/\n/g, '<br>'));
    if (has(KEYWORDS.account)) return botReply(esc(s('account')).replace(/\n/g, '<br>') + `<br><br><a href="#/register">${esc(lang() === 'ar' ? 'إنشاء حساب' : 'Create an account')}</a>`);
    if (has(KEYWORDS.free)) return botReply(esc(s('free')));
    if (has(KEYWORDS.safety)) return botReply(esc(s('safety')).replace(/\n/g, '<br>'));
    if (has(KEYWORDS.lang)) return botReply(esc(s('lang')));
    if (has(KEYWORDS.story) && words.length <= 4) {
      return botReply(esc(s('story')) + `<br><br><a href="#/about">${esc(lang() === 'ar' ? 'عن المنصة' : 'About page')}</a>`);
    }

    // listing search: any brand/generic word, or 2+ word query → search marketplace
    const isSearch = has(BRANDS) || has(GENERIC.map(singular)) || words.length >= 2;
    if (isSearch) {
      const q = words.filter(w => !['the', 'a', 'an', 'for', 'me', 'show', 'find', 'want', 'do', 'you', 'have', 'any', 'ابحث', 'عندكم', 'اريد', 'في', 'هل', 'عن'].includes(w))
        .map(singular).join(' ');
      try {
        let results = await (await fetch('/api/listings?q=' + encodeURIComponent(q))).json();
        if (results.length === 0) {
          for (const w of words.map(singular)) {
            if (w.length < 3) continue;
            results = await (await fetch('/api/listings?q=' + encodeURIComponent(w))).json();
            if (results.length) break;
          }
        }
        if (results.length) {
          const cards = results.slice(0, 3).map(l => `
            <a class="chat-product" href="#/listing/${l.id}">
              <img src="${esc((l.photos && l.photos[0]) || '/images/wh-logo.png')}" alt="">
              <span><span class="cp-name">${esc(l.title)}</span><br>
              <span class="cp-price">${OrgLux.fmtPrice(l.price, l.currency)}</span>
              ${l.status === 'sold' ? `<br><span style="font-size:11px;color:var(--ink-faint)">${esc(s('soldNow'))}</span>` : ''}</span>
            </a>`).join('');
          return botReply(esc(s('found')) + cards);
        }
        return botReply(esc(s('notFound')) + `<br><br><a href="#/browse">${esc(s('browse'))}</a>`);
      } catch { return botReply(esc(s('fallback'))); }
    }
    return botReply(esc(s('fallback')));
  }

  function handleUser(text) {
    if (!text.trim()) return;
    addMsg(esc(text), 'user');
    answer(text);
  }
  function send() {
    const input = document.getElementById('chatInput');
    handleUser(input.value);
    input.value = '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    build();
    const lt = document.getElementById('langToggle');
    if (lt) lt.addEventListener('click', () => setTimeout(refreshChrome, 50));
  });
})();
