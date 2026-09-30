'use strict';
/* ============================================================
   Watches Hub — marketplace app (vanilla JS, hash routing)
   Bilingual EN/AR, RTL, user accounts, listings, offers, chat
   ============================================================ */

/* ---------------- i18n ---------------- */
const I18N = {
  en: {
    'brand.hub': 'Hub',
    'nav.home': 'Home', 'nav.browse': 'Browse', 'nav.sell': 'Sell', 'nav.about': 'About', 'nav.admin': 'Admin',
    'auth.signin': 'Sign in', 'auth.signout': 'Sign out', 'auth.myaccount': 'My account',
    'footer.tag': 'The marketplace for rare watches — post, negotiate, deal.',
    'footer.note': 'Every deal is between the buyer and the seller — we just make the introduction.',
    'footer.rights': '© Watches Hub. Deal safely: inspect before you pay.',

    'hero.kicker': 'The watch marketplace · UAE & GCC',
    'hero.title': 'Find your next <em>rare watch.</em>',
    'hero.sub': 'Watches Hub is where collectors buy and sell directly. Post your watch in minutes, receive offers, negotiate in private chat — no middlemen, no commissions.',
    'hero.search.ph': 'Search Rolex, Nautilus, Daytona…',
    'hero.search.btn': 'Search',
    'hero.cta.sell': 'Sell your watch', 'hero.cta.browse': 'Browse watches',

    'home.latest': 'Latest <em>listings</em>',
    'home.latest.more': 'Browse all',
    'steps.title': 'How it <em>works</em>',
    'steps.s1.t': 'Post your watch', 'steps.s1.d': 'Photos, price, condition — your listing is live in two minutes, free.',
    'steps.s2.t': 'Receive offers', 'steps.s2.d': 'Buyers send you negotiation offers. Accept, reject, or keep them waiting.',
    'steps.s3.t': 'Chat & deal', 'steps.s3.d': 'Talk directly in private chat, meet, inspect, and close the deal your way.',

    'browse.title': 'Browse <em>watches</em>',
    'browse.sub': 'Every listing is posted directly by its owner.',
    'filter.search.ph': 'Search listings…',
    'filter.brand.all': 'All brands', 'filter.cond.all': 'Any condition',
    'cond.unworn': 'Unworn', 'cond.excellent': 'Excellent', 'cond.good': 'Good', 'cond.fair': 'Fair',
    'cond.needs_service': 'Needs service',
    'yes': 'Yes', 'no': 'No',
    'form.box': 'Box', 'form.papers': 'Papers', 'listing.box': 'Box', 'listing.papers': 'Papers',
    'sort.new': 'Newest first', 'sort.price_asc': 'Price: low to high', 'sort.price_desc': 'Price: high to low',
    'browse.empty': 'No watches match your search yet.',
    'browse.count': '{n} watches',

    'listing.negotiable': 'Negotiable', 'listing.firm': 'Price firm',
    'listing.sold': 'Sold',
    'listing.makeoffer': 'Make an offer', 'listing.message': 'Message seller',
    'listing.yourlisting': 'This is your listing',
    'listing.edit': 'Edit listing', 'listing.marksold': 'Mark as sold', 'listing.reactivate': 'Reactivate',
    'listing.brand': 'Brand', 'listing.year': 'Year', 'listing.condition': 'Condition', 'listing.posted': 'Posted',
    'listing.memberSince': 'Member since', 'listing.activelistings': '{n} active listings',
    'listing.moreFromSeller': 'More from this seller',
    'listing.back': 'Back to browse',

    'offer.title': 'Make an offer',
    'offer.sub': 'Your offer goes to the seller\'s inbox. They can accept or reject it — negotiate details in chat.',
    'offer.amount': 'Your offer', 'offer.message': 'Message to the seller (optional)',
    'offer.submit': 'Send offer',
    'offer.done': 'Offer sent — track it in My account → Offers sent.',
    'offer.login': 'Please sign in to make an offer.',

    'sell.title': 'Sell your <em>watch</em>',
    'sell.sub': 'Free to post. Your listing goes live immediately.',
    'sell.edit.title': 'Edit <em>listing</em>',
    'sell.photos': 'Photos (up to 5)', 'sell.photos.hint': 'Click to add photos — the first one is the cover.',
    'form.title': 'Listing title', 'form.brand': 'Brand', 'form.year': 'Year', 'form.condition': 'Condition',
    'form.price': 'Asking price', 'form.currency': 'Currency',
    'form.negotiable': 'Open to negotiation offers',
    'form.description': 'Description — box & papers, service history, defects…',
    'form.submit': 'Post listing', 'form.update': 'Save changes',
    'form.posted': 'Your watch is live!',
    'sell.login': 'Please sign in to post your watch.',

    'login.title': 'Welcome <em>back</em>',
    'login.sub': 'Sign in to post watches, make offers and chat.',
    'login.email': 'Email', 'login.password': 'Password', 'login.submit': 'Sign in',
    'login.noaccount': 'New to Watches Hub?', 'login.create': 'Create an account',

    'reg.title': 'Join <em>Watches Hub</em>',
    'reg.sub': 'One account to buy and sell. Free, forever.',
    'reg.name': 'Full name', 'reg.phone': 'Phone (optional)', 'reg.whatsapp': 'WhatsApp number (optional, digits only)',
    'reg.submit': 'Create account', 'reg.have': 'Already have an account?', 'reg.signin': 'Sign in',

    'account.title': 'My <em>account</em>',
    'tab.listings': 'My listings', 'tab.received': 'Offers received', 'tab.sent': 'Offers sent', 'tab.messages': 'Messages',
    'mylist.empty': 'You have not posted any watches yet.', 'mylist.post': 'Post your first watch',
    'mylist.offers': '{n} pending offers', 'mylist.delete': 'Delete',
    'mylist.confirmDelete': 'Delete this listing? This cannot be undone.',
    'mylist.deleted': 'Listing deleted',
    'mylist.solddone': 'Marked as sold', 'mylist.activedone': 'Listing is active again',

    'offers.received.empty': 'No offers yet. Share your listings with collectors!',
    'offers.sent.empty': 'You have not made any offers yet.',
    'offers.from': 'from', 'offers.asking': 'asking',
    'offers.accept': 'Accept', 'offers.reject': 'Reject', 'offers.withdraw': 'Withdraw',
    'offers.status.pending': 'Pending', 'offers.status.accepted': 'Accepted',
    'offers.status.rejected': 'Rejected', 'offers.status.withdrawn': 'Withdrawn',
    'offers.acceptedHint': 'Accepted — message the buyer to arrange the deal.',
    'offers.messageBuyer': 'Message buyer',

    'conv.empty': 'No conversations yet. Message a seller from any listing page.',
    'conv.role.buying': 'buying', 'conv.role.selling': 'selling',

    'chat.placeholder': 'Write a message…',
    'chat.soldwarn': 'This watch is marked as sold.',
    'chat.about': 'about',

    'about.kicker': 'About Watches Hub',
    'about.title': 'The souk, <em>rebuilt for collectors.</em>',
    'about.body': 'Watches Hub started with a simple observation: the best watch deals in the Gulf happen between people who know each other. We built the place for everyone else — post your watch, name your price, negotiate directly. No commissions, no middlemen, no mystery.',
    'about.f1.num': '0%', 'about.f1.lbl': 'Commission on any deal',
    'about.f2.num': '2 min', 'about.f2.lbl': 'To post a listing',
    'about.f3.num': '100%', 'about.f3.lbl': 'Direct buyer–seller chat',

    'toast.welcome': 'Welcome to Watches Hub, {name}',
    'toast.signedout': 'Signed out',
    'toast.lang': 'Switched to English',
    'err.generic': 'Something went wrong. Please try again.',
    'err.login': 'Please sign in first',

    'admin.kicker': 'Moderation', 'admin.title': 'Admin panel',
    'admin.user': 'Username', 'admin.pass': 'Password', 'admin.signin': 'Sign in',
    'admin.welcome': 'Welcome, admin', 'admin.bye': 'Signed out',
    'admin.tab.listings': 'Listings', 'admin.tab.users': 'Users', 'admin.tab.offers': 'Offers',
    'admin.remove': 'Remove', 'admin.restore': 'Restore',
    'admin.confirmRemove': 'Remove this listing? It will be hidden from the marketplace.',
    'admin.removed': 'Listing removed', 'admin.restored': 'Listing restored',
    'admin.th.name': 'Name', 'admin.th.email': 'Email', 'admin.th.phone': 'Phone',
    'admin.th.listings': 'Listings', 'admin.th.joined': 'Joined',
    'admin.th.listing': 'Listing', 'admin.th.buyer': 'Buyer', 'admin.th.seller': 'Seller',
    'admin.th.amount': 'Amount', 'admin.th.status': 'Status', 'admin.th.date': 'Date',
    'admin.tab.reports': 'Reports', 'admin.th.reason': 'Reason', 'admin.th.reporter': 'Reporter',
    'admin.dismiss': 'Dismiss', 'admin.dismissed': 'Report dismissed',

    'fav.add': 'Save to favorites', 'fav.remove': 'Remove from favorites',
    'fav.added': 'Saved to favorites', 'fav.removed': 'Removed from favorites',
    'fav.login': 'Sign in to save favorites',
    'tab.favorites': 'Favorites', 'fav.empty': 'No favorites yet. Tap the heart on any watch to save it here.',

    'filter.city.all': 'All cities', 'form.city': 'City',
    'chips.popular': 'Popular:',

    'time.now': 'now', 'time.min': '{n} min ago', 'time.hour': '{n} h ago',
    'time.day': '{n} d ago', 'time.week': '{n} w ago',

    'listing.city': 'City', 'listing.id': 'Listing ID',
    'listing.share': 'Share', 'listing.copied': 'Link copied',
    'listing.report': 'Report listing', 'listing.report.ph': 'What is wrong? (fake, scam, wrong category…)',
    'listing.report.done': 'Report sent — thank you. Our team will review it.',
    'listing.phone.show': 'Show phone number', 'listing.phone.login': 'Sign in to see the number',
    'listing.whatsapp': 'WhatsApp',
    'listing.photos': '{n} photos',

    'safety.title': 'Safety tips',
    'safety.1': 'Meet in a public place and inspect the watch before paying.',
    'safety.2': 'Never pay or transfer money in advance to a stranger.',
    'safety.3': 'Check serial numbers, box and papers.',
    'safety.4': 'If a deal feels wrong, walk away — there is always another watch.',

    // auctions — Bid4U-style proxy bidding
    'sort.ending': 'Ending soon',
    'form.saletype': 'Sale type', 'form.fixed': 'Fixed price', 'form.auction': 'Auction',
    'form.starting': 'Starting price', 'form.duration': 'Auction duration',
    'form.days': '{n} days',
    'form.reserve': 'Reserve price (optional)',
    'form.reserve.hint': 'Hidden minimum. If bidding ends below it, you review the high bid as an offer.',
    'form.auction.hint': 'Buyers name a maximum — the system bids the smallest step needed to keep them on top (Bid4U style). Bids are binding.',
    'form.auction.locked': 'Bidding has started — starting price and reserve are locked. You can no longer extend the auction.',
    'form.auction.extend': 'No bids yet — you can extend or restart the timer:',
    'auc.badge': 'Auction',
    'auc.current': 'Current bid', 'auc.starting': 'Starting bid',
    'auc.bids': '{n} bids', 'auc.bid': '{n} bid',
    'auc.endsin': 'Ends in', 'auc.ended': 'Auction ended',
    'auc.place': 'Place bid', 'auc.max.ph': 'Your maximum bid',
    'auc.minnext': 'Enter {n} or more',
    'auc.hint': 'Bid4U style: enter the maximum you are willing to pay — we automatically bid the smallest increment needed to keep you on top, and stop at your max. Bids are binding and cannot be retracted.',
    'auc.raise': 'Raise your maximum',
    'auc.yourmax': 'Your maximum',
    'auc.winning': 'You are the highest bidder',
    'auc.outbid': 'You have been outbid — raise your maximum',
    'auc.outbid.toast': 'You were outbid on «{title}»',
    'auc.won': 'You won this auction!',
    'auc.won.hint': 'Message the seller to arrange payment and delivery.',
    'auc.ended.win': 'Won by {name}',
    'auc.ended.nobids': 'This auction ended with no bids.',
    'auc.ended.review': 'Bidding ended below the reserve — the seller is reviewing the high bid.',
    'auc.reserve.none': 'No reserve', 'auc.reserve.met': 'Reserve met', 'auc.reserve.notmet': 'Reserve not met',
    'auc.history': 'Bid history', 'auc.history.empty': 'No bids yet — be the first.',
    'auc.auto': 'auto',
    'auc.login': 'Sign in to bid',
    'auc.self': 'This is your auction — watch the bids roll in.',
    'auc.extended': 'Late bid! The auction was extended by 2 minutes.',
    'auc.placed.win': 'Bid placed — you are the highest bidder.',
    'auc.placed.out': 'Bid placed, but you were immediately outbid by a higher maximum.',
    'auc.count.bidders': '{n} bidders', 'auc.count.bidder': '{n} bidder',
    'tab.bids': 'My bids',
    'bids.empty': 'No bids yet. Find an auction and name your maximum.',
    'bids.active': 'Live auctions', 'bids.finished': 'Finished',
    'bids.pos.winning': 'Winning', 'bids.pos.outbid': 'Outbid', 'bids.pos.won': 'Won', 'bids.pos.ended': 'Ended',
    'bids.mymax': 'your max', 'bids.raise': 'Raise bid',
    'mylist.auction.ends': 'ends', 'mylist.auction.nobids': 'no bids yet',
  },
  ar: {
    'brand.hub': 'هب',
    'nav.home': 'الرئيسية', 'nav.browse': 'تصفح', 'nav.sell': 'بيع', 'nav.about': 'عن المنصة', 'nav.admin': 'الإدارة',
    'auth.signin': 'تسجيل الدخول', 'auth.signout': 'تسجيل الخروج', 'auth.myaccount': 'حسابي',
    'footer.tag': 'سوق الساعات النادرة — انشر، فاوض، وأتمم الصفقة.',
    'footer.note': 'كل صفقة تتم بين البائع والمشتري مباشرة — نحن فقط نقرّب المسافة.',
    'footer.rights': '© ووتشز هب. تداول بأمان: افحص الساعة قبل الدفع.',

    'hero.kicker': 'سوق الساعات · الإمارات والخليج',
    'hero.title': 'اعثر على <em>ساعتك النادرة</em> القادمة.',
    'hero.sub': 'ووتشز هب حيث يبيع الهواة ويشترون مباشرة. انشر ساعتك في دقائق، استقبل العروض، فاوض في محادثة خاصة — بلا وسطاء وبلا عمولات.',
    'hero.search.ph': 'ابحث: رولكس، نوتيلوس، دايتونا…',
    'hero.search.btn': 'بحث',
    'hero.cta.sell': 'بِع ساعتك', 'hero.cta.browse': 'تصفح الساعات',

    'home.latest': 'أحدث <em>الإعلانات</em>',
    'home.latest.more': 'تصفح الكل',
    'steps.title': 'كيف <em>تعمل</em>',
    'steps.s1.t': 'انشر ساعتك', 'steps.s1.d': 'صور وسعر وحالة — إعلانك يظهر مباشرة خلال دقيقتين، مجاناً.',
    'steps.s2.t': 'استقبل العروض', 'steps.s2.d': 'يرسل لك المشترون عروض التفاوض. اقبل أو ارفض أو اتركهم بانتظارك.',
    'steps.s3.t': 'تحادث وأتمم', 'steps.s3.d': 'تواصل مباشرة في محادثة خاصة، التقِ، افحص، وأتمم الصفقة بطريقتك.',

    'browse.title': 'تصفح <em>الساعات</em>',
    'browse.sub': 'كل إعلان ينشره مالكه مباشرة.',
    'filter.search.ph': 'ابحث في الإعلانات…',
    'filter.brand.all': 'كل الماركات', 'filter.cond.all': 'أي حالة',
    'cond.unworn': 'جديدة', 'cond.excellent': 'ممتازة', 'cond.good': 'جيدة', 'cond.fair': 'مقبولة',
    'cond.needs_service': 'تحتاج صيانة',
    'yes': 'نعم', 'no': 'لا',
    'form.box': 'العلبة', 'form.papers': 'الأوراق', 'listing.box': 'العلبة', 'listing.papers': 'الأوراق',
    'sort.new': 'الأحدث أولاً', 'sort.price_asc': 'السعر: من الأقل', 'sort.price_desc': 'السعر: من الأعلى',
    'browse.empty': 'لا ساعات تطابق بحثك بعد.',
    'browse.count': '{n} ساعة',

    'listing.negotiable': 'قابل للتفاوض', 'listing.firm': 'السعر ثابت',
    'listing.sold': 'مُباعة',
    'listing.makeoffer': 'قدّم عرضاً', 'listing.message': 'راسل البائع',
    'listing.yourlisting': 'هذا إعلانك',
    'listing.edit': 'تعديل الإعلان', 'listing.marksold': 'وضع كمُباعة', 'listing.reactivate': 'إعادة التفعيل',
    'listing.brand': 'الماركة', 'listing.year': 'السنة', 'listing.condition': 'الحالة', 'listing.posted': 'نُشرت',
    'listing.memberSince': 'عضو منذ', 'listing.activelistings': '{n} إعلانات نشطة',
    'listing.moreFromSeller': 'المزيد من هذا البائع',
    'listing.back': 'العودة للتصفح',

    'offer.title': 'قدّم عرضاً',
    'offer.sub': 'يصل عرضك إلى صندوق عروض البائع. يمكنه القبول أو الرفض — وتفاوضا على التفاصيل في المحادثة.',
    'offer.amount': 'عرضك', 'offer.message': 'رسالة للبائع (اختياري)',
    'offer.submit': 'إرسال العرض',
    'offer.done': 'أُرسل العرض — تابعه في حسابي ← العروض المرسلة.',
    'offer.login': 'سجّل الدخول لتقديم عرض.',

    'sell.title': 'بِع <em>ساعتك</em>',
    'sell.sub': 'النشر مجاني. إعلانك يظهر فوراً.',
    'sell.edit.title': 'تعديل <em>الإعلان</em>',
    'sell.photos': 'الصور (حتى ٥)', 'sell.photos.hint': 'اضغط لإضافة صور — الأولى هي صورة الغلاف.',
    'form.title': 'عنوان الإعلان', 'form.brand': 'الماركة', 'form.year': 'السنة', 'form.condition': 'الحالة',
    'form.price': 'السعر المطلوب', 'form.currency': 'العملة',
    'form.negotiable': 'أقبل عروض التفاوض',
    'form.description': 'الوصف — العلبة والأوراق، سجل الصيانة، العيوب…',
    'form.submit': 'انشر الإعلان', 'form.update': 'حفظ التعديلات',
    'form.posted': 'ساعتك أصبحت منشورة!',
    'sell.login': 'سجّل الدخول لنشر ساعتك.',

    'login.title': 'أهلاً <em>بعودتك</em>',
    'login.sub': 'سجّل الدخول لنشر الساعات وتقديم العروض والمحادثة.',
    'login.email': 'البريد الإلكتروني', 'login.password': 'كلمة المرور', 'login.submit': 'تسجيل الدخول',
    'login.noaccount': 'جديد على ووتشز هب؟', 'login.create': 'أنشئ حساباً',

    'reg.title': 'انضم إلى <em>ووتشز هب</em>',
    'reg.sub': 'حساب واحد للبيع والشراء. مجاني دائماً.',
    'reg.name': 'الاسم الكامل', 'reg.phone': 'الهاتف (اختياري)', 'reg.whatsapp': 'رقم الواتساب (اختياري، أرقام فقط)',
    'reg.submit': 'إنشاء الحساب', 'reg.have': 'لديك حساب بالفعل؟', 'reg.signin': 'تسجيل الدخول',

    'account.title': '<em>حسابي</em>',
    'tab.listings': 'إعلاناتي', 'tab.received': 'العروض الواردة', 'tab.sent': 'العروض المرسلة', 'tab.messages': 'الرسائل',
    'mylist.empty': 'لم تنشر أي ساعات بعد.', 'mylist.post': 'انشر ساعتك الأولى',
    'mylist.offers': '{n} عروض معلقة', 'mylist.delete': 'حذف',
    'mylist.confirmDelete': 'حذف هذا الإعلان؟ لا يمكن التراجع.',
    'mylist.deleted': 'حُذف الإعلان',
    'mylist.solddone': 'تم وضعها كمُباعة', 'mylist.activedone': 'الإعلان نشط مجدداً',

    'offers.received.empty': 'لا عروض بعد. شارك إعلاناتك مع الهواة!',
    'offers.sent.empty': 'لم تقدّم أي عروض بعد.',
    'offers.from': 'من', 'offers.asking': 'المطلوب',
    'offers.accept': 'قبول', 'offers.reject': 'رفض', 'offers.withdraw': 'سحب',
    'offers.status.pending': 'معلق', 'offers.status.accepted': 'مقبول',
    'offers.status.rejected': 'مرفوض', 'offers.status.withdrawn': 'مسحوب',
    'offers.acceptedHint': 'مقبول — راسل المشتري لترتيب الصفقة.',
    'offers.messageBuyer': 'مراسلة المشتري',

    'conv.empty': 'لا محادثات بعد. راسل بائعاً من أي صفحة إعلان.',
    'conv.role.buying': 'شراء', 'conv.role.selling': 'بيع',

    'chat.placeholder': 'اكتب رسالة…',
    'chat.soldwarn': 'هذه الساعة مُعلَّمة كمُباعة.',
    'chat.about': 'بخصوص',

    'about.kicker': 'عن ووتشز هب',
    'about.title': 'السوق، <em>أُعيد بناؤه للهواة.</em>',
    'about.body': 'بدأ ووتشز هب من ملاحظة بسيطة: أفضل صفقات الساعات في الخليج تتم بين أناس يعرفون بعضهم. بنينا المكان لكل الآخرين — انشر ساعتك، حدد سعرك، فاوض مباشرة. بلا عمولات، بلا وسطاء، بلا غموض.',
    'about.f1.num': '0%', 'about.f1.lbl': 'عمولة على أي صفقة',
    'about.f2.num': 'دقيقتان', 'about.f2.lbl': 'لنشر إعلان',
    'about.f3.num': '100%', 'about.f3.lbl': 'محادثة مباشرة بين الطرفين',

    'toast.welcome': 'أهلاً بك في ووتشز هب، {name}',
    'toast.signedout': 'تم تسجيل الخروج',
    'toast.lang': 'تم التبديل إلى العربية',
    'err.generic': 'حدث خطأ ما. حاول مجدداً.',
    'err.login': 'يرجى تسجيل الدخول أولاً',

    'admin.kicker': 'الإشراف', 'admin.title': 'لوحة الإدارة',
    'admin.user': 'اسم المستخدم', 'admin.pass': 'كلمة المرور', 'admin.signin': 'دخول',
    'admin.welcome': 'أهلاً أيها المشرف', 'admin.bye': 'تم تسجيل الخروج',
    'admin.tab.listings': 'الإعلانات', 'admin.tab.users': 'المستخدمون', 'admin.tab.offers': 'العروض',
    'admin.remove': 'إزالة', 'admin.restore': 'استعادة',
    'admin.confirmRemove': 'إزالة هذا الإعلان؟ سيختفي من السوق.',
    'admin.removed': 'تمت إزالة الإعلان', 'admin.restored': 'تمت استعادة الإعلان',
    'admin.th.name': 'الاسم', 'admin.th.email': 'البريد', 'admin.th.phone': 'الهاتف',
    'admin.th.listings': 'الإعلانات', 'admin.th.joined': 'انضم',
    'admin.th.listing': 'الإعلان', 'admin.th.buyer': 'المشتري', 'admin.th.seller': 'البائع',
    'admin.th.amount': 'المبلغ', 'admin.th.status': 'الحالة', 'admin.th.date': 'التاريخ',
    'admin.tab.reports': 'البلاغات', 'admin.th.reason': 'السبب', 'admin.th.reporter': 'المُبلِغ',
    'admin.dismiss': 'تجاهل', 'admin.dismissed': 'تم تجاهل البلاغ',

    'fav.add': 'احفظ في المفضلة', 'fav.remove': 'أزل من المفضلة',
    'fav.added': 'أُضيفت إلى المفضلة', 'fav.removed': 'أُزيلت من المفضلة',
    'fav.login': 'سجّل الدخول لحفظ المفضلة',
    'tab.favorites': 'المفضلة', 'fav.empty': 'لا مفضلات بعد. اضغط القلب على أي ساعة لحفظها هنا.',

    'filter.city.all': 'كل المدن', 'form.city': 'المدينة',
    'chips.popular': 'الأكثر بحثاً:',

    'time.now': 'الآن', 'time.min': 'قبل {n} دقيقة', 'time.hour': 'قبل {n} ساعة',
    'time.day': 'قبل {n} يوم', 'time.week': 'قبل {n} أسبوع',

    'listing.city': 'المدينة', 'listing.id': 'رقم الإعلان',
    'listing.share': 'مشاركة', 'listing.copied': 'تم نسخ الرابط',
    'listing.report': 'الإبلاغ عن الإعلان', 'listing.report.ph': 'ما المشكلة؟ (مزيف، احتيال، تصنيف خاطئ…)',
    'listing.report.done': 'أُرسل البلاغ — شكراً لك. سيراجعه فريقنا.',
    'listing.phone.show': 'أظهر رقم الهاتف', 'listing.phone.login': 'سجّل الدخول لرؤية الرقم',
    'listing.whatsapp': 'واتساب',
    'listing.photos': '{n} صور',

    'safety.title': 'نصائح الأمان',
    'safety.1': 'التقِ في مكان عام وافحص الساعة قبل الدفع.',
    'safety.2': 'لا تدفع أو تحوّل مالاً مقدماً لشخص لا تعرفه.',
    'safety.3': 'تحقق من الأرقام التسلسلية والعلبة والأوراق.',
    'safety.4': 'إذا شعرت أن الصفقة مشبوهة، انسحب — هناك دائماً ساعة أخرى.',

    // المزادات — مزايدة بالوكالة على طريقة Bid4U
    'sort.ending': 'تنتهي قريباً',
    'form.saletype': 'نوع البيع', 'form.fixed': 'سعر ثابت', 'form.auction': 'مزاد',
    'form.starting': 'السعر الافتتاحي', 'form.duration': 'مدة المزاد',
    'form.days': '{n} أيام',
    'form.reserve': 'السعر الاحتياطي (اختياري)',
    'form.reserve.hint': 'حد أدنى مخفي. إذا انتهى المزاد دونه، تصلك أعلى مزايدة كعرض لمراجعته.',
    'form.auction.hint': 'يحدد المشترون سقفهم الأقصى — والنظام يزايد تلقائياً بأصغر خطوة تُبقيهم في الصدارة (على طريقة Bid4U). المزايدات ملزمة.',
    'form.auction.locked': 'بدأت المزايدة — السعر الافتتاحي والاحتياطي مقفلان، ولا يمكن تمديد المزاد.',
    'form.auction.extend': 'لا مزايدات بعد — يمكنك تمديد المؤقت أو إعادة تشغيله:',
    'auc.badge': 'مزاد',
    'auc.current': 'المزايدة الحالية', 'auc.starting': 'السعر الافتتاحي',
    'auc.bids': '{n} مزايدات', 'auc.bid': 'مزايدة واحدة',
    'auc.endsin': 'ينتهي خلال', 'auc.ended': 'انتهى المزاد',
    'auc.place': 'زايد', 'auc.max.ph': 'سقفك الأقصى للمزايدة',
    'auc.minnext': 'أدخل {n} أو أكثر',
    'auc.hint': 'على طريقة Bid4U: أدخل أقصى مبلغ مستعد لدفعه — نزايد تلقائياً بأصغر خطوة تُبقيك في الصدارة، ونتوقف عند سقفك. المزايدات ملزمة ولا يمكن سحبها.',
    'auc.raise': 'ارفع سقفك',
    'auc.yourmax': 'سقفك',
    'auc.winning': 'أنت أعلى مزايد',
    'auc.outbid': 'تم تجاوز مزايدتك — ارفع سقفك',
    'auc.outbid.toast': 'تم تجاوز مزايدتك على «{title}»',
    'auc.won': 'فزت بهذا المزاد!',
    'auc.won.hint': 'راسل البائع لترتيب الدفع والتسليم.',
    'auc.ended.win': 'فاز بها {name}',
    'auc.ended.nobids': 'انتهى هذا المزاد دون مزايدات.',
    'auc.ended.review': 'انتهت المزايدة دون السعر الاحتياطي — البائع يراجع أعلى مزايدة.',
    'auc.reserve.none': 'بلا سعر احتياطي', 'auc.reserve.met': 'تم بلوغ الاحتياطي', 'auc.reserve.notmet': 'لم يُبلغ الاحتياطي',
    'auc.history': 'سجل المزايدات', 'auc.history.empty': 'لا مزايدات بعد — كن الأول.',
    'auc.auto': 'تلقائي',
    'auc.login': 'سجّل الدخول للمزايدة',
    'auc.self': 'هذا مزادك — تابع المزايدات وهي تصل.',
    'auc.extended': 'مزايدة أخيرة! تم تمديد المزاد دقيقتين.',
    'auc.placed.win': 'تمت المزايدة — أنت الأعلى حالياً.',
    'auc.placed.out': 'تمت المزايدة، لكن سقفاً أعلى تجاوزك فوراً.',
    'auc.count.bidders': '{n} مزايدون', 'auc.count.bidder': 'مزايد واحد',
    'tab.bids': 'مزايداتي',
    'bids.empty': 'لا مزايدات بعد. جد مزاداً وحدد سقفك.',
    'bids.active': 'مزادات جارية', 'bids.finished': 'منتهية',
    'bids.pos.winning': 'في الصدارة', 'bids.pos.outbid': 'تم تجاوزك', 'bids.pos.won': 'فزت', 'bids.pos.ended': 'انتهى',
    'bids.mymax': 'سقفك', 'bids.raise': 'ارفع المزايدة',
    'mylist.auction.ends': 'ينتهي', 'mylist.auction.nobids': 'لا مزايدات بعد',
  },
};

/* ---------------- state & helpers ---------------- */
const LS_LANG = 'orglux_lang';
const state = {
  lang: localStorage.getItem(LS_LANG) === 'ar' ? 'ar' : 'en',
  user: null,
  counts: { unread_messages: 0, pending_offers: 0, answered_offers: 0, outbid_count: 0 },
  config: null,
};

function t(key, vars) {
  let s = (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
  if (vars) for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, vars[k]);
  return s;
}
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
async function api(path, opts) {
  const res = await fetch(path, opts ? {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  } : undefined);
  let data = null;
  try { data = await res.json(); } catch { /* ignore */ }
  if (!res.ok) {
    const err = new Error((data && data.error) || t('err.generic'));
    err.status = res.status;
    throw err;
  }
  return data;
}
function fmtNum(x) {
  return new Intl.NumberFormat(state.lang === 'ar' ? 'ar-AE' : 'en-US', { maximumFractionDigits: 0 }).format(Math.round(x));
}
const CUR_LABEL = {
  AED: ['AED', 'د.إ'], USD: ['USD', 'دولار'], EUR: ['EUR', 'يورو'], GBP: ['GBP', 'جنيه'],
  SAR: ['SAR', 'ريال'], KWD: ['KWD', 'د.ك'], QAR: ['QAR', 'ر.ق'], BHD: ['BHD', 'د.ب'],
  OMR: ['OMR', 'ر.ع'], CHF: ['CHF', 'فرنك'],
};
function fmtPrice(price, currency) {
  const cur = (currency || 'AED').toUpperCase();
  const lbl = (CUR_LABEL[cur] || [cur, cur])[state.lang === 'ar' ? 1 : 0];
  return `${fmtNum(price)} ${lbl}`;
}
function toast(msg, isError) {
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.textContent = msg;
  stack.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .4s'; setTimeout(() => el.remove(), 450); }, 3600);
}
function cover(l) { return (l.photos && l.photos[0]) || '/images/wh-logo.png'; }
function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(String(d).replace(' ', 'T') + 'Z');
  return dt.toLocaleDateString(state.lang === 'ar' ? 'ar-AE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(d) {
  const dt = new Date(String(d).replace(' ', 'T') + 'Z');
  return dt.toLocaleTimeString(state.lang === 'ar' ? 'ar-AE' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
}
function timeAgo(d) {
  if (!d) return '';
  const dt = new Date(String(d).replace(' ', 'T') + 'Z');
  const sec = Math.max(0, (Date.now() - dt.getTime()) / 1000);
  if (sec < 300) return t('time.now');
  if (sec < 3600) return t('time.min', { n: Math.floor(sec / 60) });
  if (sec < 86400) return t('time.hour', { n: Math.floor(sec / 3600) });
  if (sec < 604800) return t('time.day', { n: Math.floor(sec / 86400) });
  return t('time.week', { n: Math.floor(sec / 604800) });
}

/* ---------------- favorites ---------------- */
const HEART_SVG = `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z"/></svg>`;
function heartHTML(l) {
  return `<button class="heart-btn${l.is_favorite ? ' on' : ''}" data-fav="${l.id}" aria-label="${t('fav.add')}" title="${t(l.is_favorite ? 'fav.remove' : 'fav.add')}">${HEART_SVG}</button>`;
}
async function toggleFavorite(id, btn) {
  if (!state.user) { toast(t('fav.login'), true); location.hash = '#/login'; return; }
  try {
    const r = await api(`/api/listings/${id}/favorite`, { method: 'POST', body: '{}' });
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => b.classList.toggle('on', r.favorited));
    toast(t(r.favorited ? 'fav.added' : 'fav.removed'));
    if (!r.favorited && btn && btn.closest('[data-fav-card]')) {
      const card = btn.closest('[data-fav-card]');
      card.style.opacity = '0'; setTimeout(() => card.remove(), 300);
    }
  } catch (e) { toast(e.message, true); }
}
function bindHearts(rootEl) {
  rootEl.querySelectorAll('[data-fav]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    toggleFavorite(Number(b.dataset.fav), b);
  }));
}

/* ---------------- language ---------------- */
function applyLang() {
  const ar = state.lang === 'ar';
  document.documentElement.lang = ar ? 'ar' : 'en';
  document.documentElement.dir = ar ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.getElementById('langToggle').textContent = ar ? 'EN' : 'عربي';
}
function setLang(lang) {
  state.lang = lang;
  localStorage.setItem(LS_LANG, lang);
  applyLang();
  route();
}

/* ---------------- auth area ---------------- */
async function refreshMe() {
  try {
    const me = await api('/api/auth/me');
    state.user = me.user;
    if (me.user) state.counts = { unread_messages: me.unread_messages, pending_offers: me.pending_offers, answered_offers: me.answered_offers, outbid_count: me.outbid_count || 0 };
  } catch { state.user = null; }
  renderAuthArea();
}
function renderAuthArea() {
  const el = document.getElementById('authArea');
  if (!state.user) {
    el.innerHTML = `<a class="auth-link" href="#/login">${t('auth.signin')}</a>`;
    return;
  }
  const badge = state.counts.unread_messages + state.counts.pending_offers;
  el.innerHTML = `
    <a class="account-chip" href="#/account/listings">
      ${esc(state.user.name.split(' ')[0])}
      ${badge > 0 ? `<span class="dot-badge">${badge > 99 ? '99+' : badge}</span>` : ''}
    </a>`;
}
async function logout() {
  await api('/api/auth/logout', { method: 'POST', body: '{}' }).catch(() => {});
  state.user = null;
  renderAuthArea();
  toast(t('toast.signedout'));
  location.hash = '#/';
}

/* ---------------- shared rendering ---------------- */
function listingCard(l) {
  const isAuc = l.sale_type === 'auction';
  return `
    <a class="product-card" href="#/listing/${l.id}">
      <div class="card-media">
        ${isAuc ? `<span class="card-badge"><span class="badge badge-auction">${t('auc.badge')}</span></span>`
          : l.negotiable ? `<span class="card-badge"><span class="badge badge-low">${t('listing.negotiable')}</span></span>` : ''}
        ${heartHTML(l)}
        ${l.photos && l.photos.length > 1 ? `<span class="photo-count">${l.photos.length}</span>` : ''}
        <img src="${esc(cover(l))}" alt="${esc(l.title)}" loading="lazy">
        <div class="veil"></div>
        <span class="card-view">${state.lang === 'ar' ? 'عرض' : 'View'} <span class="arrow">→</span></span>
      </div>
      <div class="card-info">
        <div class="card-brand">${esc(l.brand)}${l.year ? ' · ' + esc(l.year) : ''}</div>
        <div class="card-name">${esc(l.title)}</div>
        <div class="card-meta">
          <span class="card-price">${fmtPrice(isAuc && l.current_price != null ? l.current_price : l.price, l.currency)}</span>
          <span class="cond-badge">${t('cond.' + l.condition)}</span>
        </div>
        ${isAuc ? `<div class="card-auction-line">${l.bid_count ? t(l.bid_count === 1 ? 'auc.bid' : 'auc.bids', { n: fmtNum(l.bid_count) }) : t('auc.history.empty')} · <span class="auc-countdown-sm" data-ends="${esc(l.auction_ends_at)}">${fmtCountdown(l.auction_ends_at)}</span></div>` : ''}
        <div class="card-seller">${esc(l.seller_name || '')}${l.city ? ` · ${esc(l.city)}` : ''}${l.created_at ? ` · ${timeAgo(l.created_at)}` : ''}</div>
      </div>
    </a>`;
}

/* countdown: "2d 4h" / "3h 12m" / "04:59" ticking down to auction end */
function parseDateUTC(d) { return d ? new Date(String(d).replace(' ', 'T').replace(/Z$/, '') + 'Z') : null; }
function fmtCountdown(endsAt) {
  const end = parseDateUTC(endsAt);
  if (!end) return '';
  const ms = end.getTime() - Date.now();
  if (ms <= 0) return t('auc.ended');
  const sec = Math.floor(ms / 1000);
  if (sec >= 86400) return `${Math.floor(sec / 86400)}d ${Math.floor((sec % 86400) / 3600)}h`;
  if (sec >= 3600) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function pageHead(titleHTML, sub) {
  return `<div class="page-head"><h1>${titleHTML}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;
}
function statusPill(status) {
  return `<span class="status-pill status-offer-${esc(status)}">${t('offers.status.' + status)}</span>`;
}

/* ---------------- home ---------------- */
async function renderHome(root) {
  let latest = [];
  try { latest = (await api('/api/listings')).slice(0, 8); } catch { /* offline-safe */ }
  root.innerHTML = `
    <section class="hero">
      <div>
        <div class="hero-kicker"><span class="rule"></span><span class="label">${t('hero.kicker')}</span></div>
        <h1>${t('hero.title')}</h1>
        <p class="hero-sub">${t('hero.sub')}</p>
        <div class="search-hero">
          <form id="heroSearch">
            <input type="text" id="heroQ" placeholder="${t('hero.search.ph')}">
            <button type="submit">${t('hero.search.btn')}</button>
          </form>
        </div>
        <div class="hero-cta">
          <a class="btn btn-solid" href="#/sell">${t('hero.cta.sell')}<span class="arrow">→</span></a>
          <a class="btn btn-ghost" href="#/browse">${t('hero.cta.browse')}</a>
        </div>
      </div>
      <figure class="hero-figure">
        <div class="frame"><img src="/images/hero.jpg" alt="Watches Hub" loading="eager"></div>
        <figcaption class="caption">Watches Hub</figcaption>
      </figure>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <span>${state.lang === 'ar' ? 'انشر ساعتك مجاناً' : 'Post your watch for free'}</span>
        <span>${state.lang === 'ar' ? 'عروض تفاوض مباشرة' : 'Direct negotiation offers'}</span>
        <span>${state.lang === 'ar' ? 'محادثة خاصة بين الطرفين' : 'Private buyer–seller chat'}</span>
        <span>${state.lang === 'ar' ? 'بلا عمولات' : 'Zero commission'}</span>
        <span>${state.lang === 'ar' ? 'انشر ساعتك مجاناً' : 'Post your watch for free'}</span>
        <span>${state.lang === 'ar' ? 'عروض تفاوض مباشرة' : 'Direct negotiation offers'}</span>
        <span>${state.lang === 'ar' ? 'محادثة خاصة بين الطرفين' : 'Private buyer–seller chat'}</span>
        <span>${state.lang === 'ar' ? 'بلا عمولات' : 'Zero commission'}</span>
      </div>
    </div>

    <section class="section">
      <div class="section-head">
        <h2>${t('home.latest')}</h2>
        <a class="more-link" href="#/browse">${t('home.latest.more')} <span class="arrow ${state.lang === 'ar' ? 'flip-rtl' : ''}">→</span></a>
      </div>
      <div class="product-grid stagger">${latest.map(listingCard).join('')}</div>
    </section>

    <div class="brand-strip">
      <span>Rolex</span><span>Patek Philippe</span><span>Richard Mille</span>
      <span>Audemars Piguet</span><span>Cartier</span><span>Omega</span>
    </div>

    <section class="section">
      <div class="section-head"><h2>${t('steps.title')}</h2></div>
      <div class="steps">
        <div><span class="step-num">01</span><h3>${t('steps.s1.t')}</h3><p>${t('steps.s1.d')}</p></div>
        <div><span class="step-num">02</span><h3>${t('steps.s2.t')}</h3><p>${t('steps.s2.d')}</p></div>
        <div><span class="step-num">03</span><h3>${t('steps.s3.t')}</h3><p>${t('steps.s3.d')}</p></div>
      </div>
    </section>`;
  document.getElementById('heroSearch').addEventListener('submit', e => {
    e.preventDefault();
    const q = document.getElementById('heroQ').value.trim();
    location.hash = '#/browse' + (q ? '?q=' + encodeURIComponent(q) : '');
  });
  bindHearts(root);
}

/* ---------------- browse ---------------- */
const browseState = { q: '', brand: 'all', condition: 'all', sort: 'new', city: 'all' };
const POPULAR_BRANDS = ['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Richard Mille', 'Omega', 'Cartier', 'Tudor'];

async function renderBrowse(root, query) {
  if (query) {
    const p = new URLSearchParams(query);
    browseState.q = p.get('q') || '';
    browseState.brand = p.get('brand') || 'all';
    browseState.city = p.get('city') || 'all';
    browseState.sort = p.get('sort') || browseState.sort;
  }
  const cfg = state.config || { brands: [], conditions: [], cities: [] };
  let listings = [];
  const params = new URLSearchParams();
  if (browseState.q) params.set('q', browseState.q);
  if (browseState.brand !== 'all') params.set('brand', browseState.brand);
  if (browseState.condition !== 'all') params.set('condition', browseState.condition);
  if (browseState.city !== 'all') params.set('city', browseState.city);
  if (browseState.sort !== 'new') params.set('sort', browseState.sort);
  try { listings = await api('/api/listings?' + params.toString()); } catch (e) { toast(e.message, true); }

  root.innerHTML = `
    ${pageHead(t('browse.title'), t('browse.sub'))}
    <section class="section" style="padding-top:28px">
      <div class="browse-toolbar">
        <form class="search-inline" id="browseSearch">
          <input type="text" id="browseQ" value="${esc(browseState.q)}" placeholder="${t('filter.search.ph')}">
        </form>
        <select id="fBrand">
          <option value="all">${t('filter.brand.all')}</option>
          ${cfg.brands.map(b => `<option ${b === browseState.brand ? 'selected' : ''}>${b}</option>`).join('')}
        </select>
        <select id="fCond">
          <option value="all">${t('filter.cond.all')}</option>
          ${cfg.conditions.map(c => `<option value="${c}" ${c === browseState.condition ? 'selected' : ''}>${t('cond.' + c)}</option>`).join('')}
        </select>
        <select id="fCity">
          <option value="all">${t('filter.city.all')}</option>
          ${(cfg.cities || []).map(c => `<option ${c === browseState.city ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <select id="fSort">
          <option value="new" ${browseState.sort === 'new' ? 'selected' : ''}>${t('sort.new')}</option>
          <option value="ending_soon" ${browseState.sort === 'ending_soon' ? 'selected' : ''}>${t('sort.ending')}</option>
          <option value="price_asc" ${browseState.sort === 'price_asc' ? 'selected' : ''}>${t('sort.price_asc')}</option>
          <option value="price_desc" ${browseState.sort === 'price_desc' ? 'selected' : ''}>${t('sort.price_desc')}</option>
        </select>
      </div>
      <div class="brand-chips">
        <span class="label">${t('chips.popular')}</span>
        ${POPULAR_BRANDS.map(b => `<button class="chip${browseState.brand === b ? ' on' : ''}" data-chip="${esc(b)}">${esc(b)}</button>`).join('')}
      </div>
      ${listings.length
        ? `<p class="label" style="margin-bottom:20px">${t('browse.count', { n: fmtNum(listings.length) })}</p>
           <div class="product-grid">${listings.map(listingCard).join('')}</div>`
        : `<div class="empty-state"><span class="serif">—</span>${t('browse.empty')}</div>`}
    </section>`;

  bindHearts(root);
  const apply = () => {
    browseState.q = document.getElementById('browseQ').value.trim();
    browseState.brand = document.getElementById('fBrand').value;
    browseState.condition = document.getElementById('fCond').value;
    browseState.city = document.getElementById('fCity').value;
    browseState.sort = document.getElementById('fSort').value;
    renderBrowse(root);
  };
  document.getElementById('browseSearch').addEventListener('submit', e => { e.preventDefault(); apply(); });
  document.getElementById('fBrand').addEventListener('change', apply);
  document.getElementById('fCond').addEventListener('change', apply);
  document.getElementById('fCity').addEventListener('change', apply);
  document.getElementById('fSort').addEventListener('change', apply);
  root.querySelectorAll('[data-chip]').forEach(ch => ch.addEventListener('click', () => {
    browseState.brand = browseState.brand === ch.dataset.chip ? 'all' : ch.dataset.chip;
    renderBrowse(root);
  }));
}

/* ---------------- auction panel (Bid4U-style proxy bidding) ---------------- */
let auctionTimers = [];
function stopAuctionTimers() { auctionTimers.forEach(clearInterval); auctionTimers = []; }

function reserveLabel(auc) {
  if (!auc || auc.reserve === 'none') return t('auc.reserve.none');
  return auc.reserve === 'met' ? t('auc.reserve.met') : t('auc.reserve.notmet');
}
function aucCountLine(auc) {
  if (!auc.bid_count) return '';
  const b = t(auc.bid_count === 1 ? 'auc.bid' : 'auc.bids', { n: fmtNum(auc.bid_count) });
  const ppl = t(auc.bidder_count === 1 ? 'auc.count.bidder' : 'auc.count.bidders', { n: fmtNum(auc.bidder_count) });
  return b + ' · ' + ppl;
}
function bidHistoryHTML(auc) {
  if (!auc || !auc.history || !auc.history.length) return `<div class="ap-h-empty">${t('auc.history.empty')}</div>`;
  return auc.history.map(e => `
    <div class="ap-h-row${e.mine ? ' mine' : ''}">
      <span class="ap-h-bidder">${esc(e.bidder)}${e.kind === 'auto' ? ` <span class="ap-auto">${t('auc.auto')}</span>` : ''}</span>
      <span class="ap-h-amount">${fmtNum(e.amount)}</span>
      <span class="ap-h-time">${fmtTime(e.created_at)}</span>
    </div>`).join('');
}

function auctionPanelHTML(l, auc, mine) {
  const cur = auc.current_price;
  const ended = auc.settled || l.status === 'sold';
  return `
  <div class="auction-panel" id="aucPanel">
    <div class="ap-top">
      <div>
        <div class="ap-label" id="apPriceLbl">${cur != null ? t('auc.current') : t('auc.starting')}</div>
        <div class="ap-price" id="apPrice">${fmtPrice(cur != null ? cur : l.price, l.currency)}</div>
        <div class="ap-sub" id="apBids">${aucCountLine(auc)}</div>
      </div>
      <div class="ap-timerbox">
        <div class="ap-label">${t('auc.endsin')}</div>
        <div class="ap-timer" id="apTimer">${fmtCountdown(l.auction_ends_at)}</div>
        <div class="ap-sub reserve-pill" id="apReserve">${reserveLabel(auc)}</div>
      </div>
    </div>

    <div id="apBanner">${auctionBannerHTML(l, auc, mine)}</div>

    ${!ended && !mine && state.user ? `
    <form id="bidForm" class="ap-bidform">
      <div class="ap-inputwrap">
        <input type="number" id="bidAmount" min="1" step="any" placeholder="${t('auc.max.ph')}" autocomplete="off">
        <span class="ap-cur">${esc(l.currency)}</span>
      </div>
      <button class="btn btn-terra" type="submit">${auc.my_max_bid ? t('auc.raise') : t('auc.place')}</button>
    </form>
    <div class="ap-min" id="apMinHint">${auc.min_next_bid ? t('auc.minnext', { n: fmtNum(auc.min_next_bid) }) : ''}</div>
    <p class="ap-hint">${t('auc.hint')}</p>` : ''}
    ${!ended && !mine && !state.user ? `<p class="ap-hint">${t('auc.hint')}</p><div style="margin-top:10px"><a class="btn btn-terra" href="#/login">${t('auc.login')}</a></div>` : ''}
    ${!ended && mine ? `<div class="ap-self">${t('auc.self')}</div>` : ''}

    <div class="ap-history">
      <div class="ap-h-title">${t('auc.history')}</div>
      <div id="apHistory">${bidHistoryHTML(auc)}</div>
    </div>
  </div>`;
}

function auctionBannerHTML(l, auc, mine) {
  const ended = auc.settled || l.status === 'sold';
  if (ended) {
    if (auc.i_am_winner) return `<div class="ap-banner won">${t('auc.won')}<small>${t('auc.won.hint')}</small></div>`;
    if (l.status === 'sold') return `<div class="ap-banner">${auc.winner ? t('auc.ended.win', { name: esc(auc.winner.name) }) : t('listing.sold')}${auc.sold_price ? ` — ${fmtPrice(auc.sold_price, l.currency)}` : ''}</div>`;
    if (!auc.bid_count) return `<div class="ap-banner">${t('auc.ended.nobids')}</div>`;
    return `<div class="ap-banner">${t('auc.ended.review')}</div>`;
  }
  if (!state.user || mine) return '';
  if (auc.i_am_leader) return `<div class="ap-banner winning">${t('auc.winning')}<small>${t('auc.yourmax')}: ${fmtNum(auc.my_max_bid)} ${esc(l.currency)}</small></div>`;
  if (auc.my_max_bid) return `<div class="ap-banner outbid">${t('auc.outbid')}<small>${t('auc.yourmax')}: ${fmtNum(auc.my_max_bid)} ${esc(l.currency)}</small></div>`;
  return '';
}

function wireAuction(root, l, auc0, mine) {
  let lastLeader = auc0.i_am_leader;
  let endsAt = l.auction_ends_at;

  // 1s countdown
  auctionTimers.push(setInterval(() => {
    const el = document.getElementById('apTimer');
    if (!el) { stopAuctionTimers(); return; }
    el.textContent = fmtCountdown(endsAt);
    const end = parseDateUTC(endsAt);
    if (end && end.getTime() <= Date.now()) refreshAuction(true);
  }, 1000));

  async function refreshAuction(settleCheck) {
    let auc;
    try { auc = await api(`/api/listings/${l.id}/bids`); }
    catch { return; }
    if (auc.ends_at) endsAt = auc.ends_at;
    // ended → re-render the whole page so banners/buttons swap
    if (auc.settled || auc.status === 'sold') { stopAuctionTimers(); renderListing(root, l.id); return; }
    const priceEl = document.getElementById('apPrice');
    if (!priceEl) { stopAuctionTimers(); return; }
    priceEl.textContent = fmtPrice(auc.current_price != null ? auc.current_price : l.price, l.currency);
    document.getElementById('apPriceLbl').textContent = auc.current_price != null ? t('auc.current') : t('auc.starting');
    document.getElementById('apBids').textContent = aucCountLine(auc);
    document.getElementById('apReserve').textContent = reserveLabel(auc);
    document.getElementById('apHistory').innerHTML = bidHistoryHTML(auc);
    document.getElementById('apBanner').innerHTML = auctionBannerHTML(l, auc, mine);
    const minEl = document.getElementById('apMinHint');
    if (minEl) minEl.textContent = auc.min_next_bid ? t('auc.minnext', { n: fmtNum(auc.min_next_bid) }) : '';
    const submitBtn = document.querySelector('#bidForm button[type="submit"]');
    if (submitBtn) submitBtn.textContent = auc.my_max_bid ? t('auc.raise') : t('auc.place');
    if (lastLeader && !auc.i_am_leader && !mine) {
      toast(t('auc.outbid.toast', { title: l.title }), true);
      refreshMe();
    }
    lastLeader = auc.i_am_leader;
    if (!settleCheck) { /* periodic */ }
  }
  auctionTimers.push(setInterval(() => refreshAuction(false), 8000));

  const bidForm = document.getElementById('bidForm');
  if (bidForm) bidForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!state.user) { toast(t('auc.login'), true); location.hash = '#/login'; return; }
    const amount = Number(document.getElementById('bidAmount').value);
    if (!amount || amount <= 0) { toast(t('err.generic'), true); return; }
    try {
      const r = await api(`/api/listings/${l.id}/bids`, { method: 'POST', body: JSON.stringify({ max_amount: amount }) });
      toast(r.i_am_leader ? t('auc.placed.win') : t('auc.placed.out'), !r.i_am_leader);
      if (r.extended) setTimeout(() => toast(t('auc.extended')), 600);
      document.getElementById('bidAmount').value = '';
      await refreshAuction(false);
      refreshMe();
    } catch (err) { toast(err.message, true); }
  });
}

/* ---------------- listing detail ---------------- */
async function renderListing(root, id) {
  let l;
  try { l = await api('/api/listings/' + id); }
  catch {
    root.innerHTML = `<div class="section"><div class="empty-state"><span class="serif">404</span>${t('err.generic')}</div></div>`;
    return;
  }
  const mine = state.user && state.user.id === l.user_id;
  const sold = l.status === 'sold';
  const isAuc = l.sale_type === 'auction';
  const auc = isAuc ? await api(`/api/listings/${id}/bids`).catch(() => null) : null;
  const more = (await api('/api/listings?seller=' + l.user_id).catch(() => [])).filter(x => x.id !== l.id).slice(0, 4);

  root.innerHTML = `
    <section class="section">
      <nav class="crumbs">
        <a href="#/browse">${t('nav.browse')}</a><span>›</span>
        <a href="#/browse?brand=${encodeURIComponent(l.brand)}">${esc(l.brand)}</a><span>›</span>
        <em>${esc(l.title)}</em>
      </nav>
      <div class="product-page">
        <div>
          <div class="gallery-main"><img id="galMain" src="${esc(cover(l))}" alt="${esc(l.title)}"></div>
          ${l.photos.length > 1 ? `<div class="gallery-thumbs">
            ${l.photos.map((p, i) => `<img src="${esc(p)}" class="${i === 0 ? 'active' : ''}" data-full="${esc(p)}" alt="">`).join('')}
          </div>` : ''}
          ${sold ? `<div class="sold-banner">${t('listing.sold')}</div>` : ''}
        </div>
        <div class="pd-info">
          <div class="pd-topline">
            <span class="label">${esc(l.brand)}</span>
            <span class="pd-topline-actions">
              ${heartHTML(l)}
              <button class="heart-btn" id="shareBtn" title="${t('listing.share')}" aria-label="${t('listing.share')}">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v13M7 8l5-5 5 5M5 13v7h14v-7"/></svg>
              </button>
            </span>
          </div>
          <h1>${esc(l.title)}</h1>
          ${isAuc && auc ? auctionPanelHTML(l, auc, mine) : `<div class="pd-price">${fmtPrice(l.price, l.currency)}</div>`}
          <div style="display:flex;gap:10px;align-items:center;margin:6px 0 4px;flex-wrap:wrap">
            ${isAuc ? `<span class="badge badge-auction">${t('auc.badge')}</span>`
              : l.negotiable ? `<span class="tag-neg">${t('listing.negotiable')}</span>` : `<span class="cond-badge">${t('listing.firm')}</span>`}
            <span class="cond-badge">${t('cond.' + l.condition)}</span>
            <span class="pd-time">${timeAgo(l.created_at)}</span>
          </div>
          <p class="pd-desc">${esc(l.description)}</p>
          <dl class="pd-facts">
            <div><dt>${t('listing.brand')}</dt><dd>${esc(l.brand)}</dd></div>
            ${l.year ? `<div><dt>${t('listing.year')}</dt><dd>${esc(l.year)}</dd></div>` : ''}
            <div><dt>${t('listing.condition')}</dt><dd>${t('cond.' + l.condition)}</dd></div>
            <div><dt>${t('listing.box')}</dt><dd>${t(l.box ? 'yes' : 'no')}</dd></div>
            <div><dt>${t('listing.papers')}</dt><dd>${t(l.papers ? 'yes' : 'no')}</dd></div>
            ${l.city ? `<div><dt>${t('listing.city')}</dt><dd>${esc(l.city)}</dd></div>` : ''}
            <div><dt>${t('listing.posted')}</dt><dd>${fmtDate(l.created_at)}</dd></div>
            <div><dt>${t('listing.id')}</dt><dd>${l.id}</dd></div>
          </dl>

          <div class="seller-card">
            <div class="sc-head">
              <span class="seller-avatar">${esc((l.seller_name || '?')[0])}</span>
              <div>
                <div class="sc-name">${esc(l.seller_name)}</div>
                <div class="sc-meta">${t('listing.memberSince')} ${fmtDate(l.seller_since)} · ${t('listing.activelistings', { n: fmtNum(l.seller_listing_count) })}</div>
              </div>
            </div>
            <div class="sc-actions">
              ${mine ? `
                <span class="cond-badge">${t('listing.yourlisting')}</span>
                <a class="btn btn-ghost btn-small" href="#/sell/edit/${l.id}">${t('listing.edit')}</a>
                ${sold
                  ? `<button class="btn btn-ghost btn-small" id="reactivateBtn">${t('listing.reactivate')}</button>`
                  : `<button class="btn btn-ghost btn-small" id="soldBtn">${t('listing.marksold')}</button>`}
              ` : sold ? `
                <span class="badge badge-out">${t('listing.sold')}</span>
              ` : isAuc ? `
                <button class="btn btn-ghost" id="msgBtn">${t('listing.message')}</button>
              ` : `
                <button class="btn btn-terra" id="offerBtn">${t('listing.makeoffer')}</button>
                <button class="btn btn-ghost" id="msgBtn">${t('listing.message')}</button>
              `}
            </div>
            ${!mine ? `<div class="sc-contact">
              ${l.seller_has_phone ? `<button class="btn btn-solid btn-small" id="phoneBtn">${t('listing.phone.show')}</button>` : ''}
              ${l.seller_has_whatsapp ? `<a class="btn btn-ghost btn-small" id="waBtn" target="_blank" rel="noopener" style="display:none">${t('listing.whatsapp')}</a>` : ''}
            </div>` : ''}
          </div>

          <div class="safety-box">
            <div class="sb-title">${t('safety.title')}</div>
            <ul><li>${t('safety.1')}</li><li>${t('safety.2')}</li><li>${t('safety.3')}</li><li>${t('safety.4')}</li></ul>
          </div>
          ${!mine ? `<button class="report-link" id="reportBtn">${t('listing.report')}</button>` : ''}
        </div>
      </div>

      ${more.length ? `
        <div class="section-head" style="margin-top:64px"><h2>${t('listing.moreFromSeller')}</h2></div>
        <div class="product-grid">${more.map(listingCard).join('')}</div>` : ''}
    </section>`;

  bindHearts(root);
  if (isAuc && auc) wireAuction(root, l, auc, mine);

  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) shareBtn.addEventListener('click', async () => {
    const url = location.origin + location.pathname + '#/listing/' + l.id;
    try { await navigator.clipboard.writeText(url); toast(t('listing.copied')); }
    catch { prompt(t('listing.share'), url); }
  });

  const phoneBtn = document.getElementById('phoneBtn');
  if (phoneBtn) phoneBtn.addEventListener('click', async () => {
    if (!state.user) { toast(t('listing.phone.login'), true); location.hash = '#/login'; return; }
    try {
      const c = await api(`/api/listings/${l.id}/phone`);
      if (c.phone) { phoneBtn.textContent = c.phone; phoneBtn.disabled = true; }
      if (c.whatsapp) {
        const waBtn = document.getElementById('waBtn');
        if (waBtn) { waBtn.href = `https://wa.me/${c.whatsapp}`; waBtn.style.display = ''; }
      }
    } catch (e) { toast(e.message, true); }
  });

  const reportBtn = document.getElementById('reportBtn');
  if (reportBtn) reportBtn.addEventListener('click', async () => {
    if (!state.user) { toast(t('err.login'), true); location.hash = '#/login'; return; }
    const reason = prompt(t('listing.report.ph'));
    if (!reason || !reason.trim()) return;
    try {
      await api(`/api/listings/${l.id}/reports`, { method: 'POST', body: JSON.stringify({ reason: reason.trim() }) });
      toast(t('listing.report.done'));
    } catch (e) { toast(e.message, true); }
  });

  document.querySelectorAll('.gallery-thumbs img').forEach(th => th.addEventListener('click', () => {
    document.getElementById('galMain').src = th.dataset.full;
    document.querySelectorAll('.gallery-thumbs img').forEach(x => x.classList.remove('active'));
    th.classList.add('active');
  }));

  const offerBtn = document.getElementById('offerBtn');
  if (offerBtn) offerBtn.addEventListener('click', () => {
    if (!state.user) { toast(t('offer.login'), true); location.hash = '#/login'; return; }
    openOfferModal(l);
  });
  const msgBtn = document.getElementById('msgBtn');
  if (msgBtn) msgBtn.addEventListener('click', async () => {
    if (!state.user) { toast(t('err.login'), true); location.hash = '#/login'; return; }
    try {
      const r = await api(`/api/listings/${l.id}/conversations`, { method: 'POST', body: '{}' });
      location.hash = '#/chat/' + r.id;
    } catch (e) { toast(e.message, true); }
  });
  const soldBtn = document.getElementById('soldBtn');
  if (soldBtn) soldBtn.addEventListener('click', async () => {
    try {
      await api('/api/listings/' + l.id, { method: 'PATCH', body: JSON.stringify({ status: 'sold' }) });
      toast(t('mylist.solddone')); renderListing(root, l.id);
    } catch (e) { toast(e.message, true); }
  });
  const reBtn = document.getElementById('reactivateBtn');
  if (reBtn) reBtn.addEventListener('click', async () => {
    try {
      await api('/api/listings/' + l.id, { method: 'PATCH', body: JSON.stringify({ status: 'active' }) });
      toast(t('mylist.activedone')); renderListing(root, l.id);
    } catch (e) { toast(e.message, true); }
  });
}

function openOfferModal(l) {
  const ov = document.createElement('div');
  ov.className = 'modal-overlay';
  ov.innerHTML = `
    <div class="modal-card">
      <h3>${t('offer.title')}</h3>
      <p>${t('offer.sub')}</p>
      <div class="field"><label>${t('offer.amount')} (${esc(l.currency)})</label>
        <input type="number" id="offAmount" min="1" step="any" placeholder="${fmtNum(l.price)}"></div>
      <div class="field"><label>${t('offer.message')}</label>
        <textarea id="offMsg" maxlength="400" style="min-height:70px"></textarea></div>
      <div class="modal-actions">
        <button class="btn btn-ghost btn-small" id="offCancel">${state.lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
        <button class="btn btn-terra btn-small" id="offSubmit">${t('offer.submit')}</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  const close = () => ov.remove();
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  ov.querySelector('#offCancel').addEventListener('click', close);
  ov.querySelector('#offSubmit').addEventListener('click', async () => {
    const amount = Number(ov.querySelector('#offAmount').value);
    const message = ov.querySelector('#offMsg').value.trim();
    if (!amount || amount <= 0) { toast(t('err.generic'), true); return; }
    try {
      await api(`/api/listings/${l.id}/offers`, { method: 'POST', body: JSON.stringify({ amount, message }) });
      close(); toast(t('offer.done'));
    } catch (e) { toast(e.message, true); }
  });
}

/* ---------------- sell / edit ---------------- */
let sellPhotos = []; // dataURLs for new photos

async function renderSell(root, editId) {
  if (!state.user) {
    root.innerHTML = `<div class="section"><div class="empty-state"><span class="serif">${t('sell.login')}</span></div>
      <div style="text-align:center;margin-top:18px"><a class="btn btn-solid" href="#/login">${t('auth.signin')}</a></div></div>`;
    return;
  }
  const cfg = state.config || { brands: [], conditions: [], currencies: [] };
  let existing = null;
  if (editId) {
    try { existing = await api('/api/listings/' + editId); } catch { /* ignore */ }
    if (existing && existing.user_id !== state.user.id) existing = null;
  }
  sellPhotos = [];
  const existingPhotos = existing ? existing.photos.slice() : [];

  root.innerHTML = `
    ${pageHead(existing ? t('sell.edit.title') : t('sell.title'), existing ? '' : t('sell.sub'))}
    <section class="section" style="padding-top:30px;max-width:820px">
      <form id="sellForm" novalidate>
        <div class="field full">
          <label>${t('sell.photos')}</label>
          <div class="file-drop" id="photoDrop">${t('sell.photos.hint')}</div>
          <input type="file" id="photoInput" accept="image/png,image/jpeg,image/webp" multiple hidden>
          <div class="photo-previews" id="photoPreviews"></div>
        </div>
        <div class="form-grid" style="margin-top:20px">
          <div class="field full"><label>${t('form.title')} *</label>
            <input name="title" maxlength="140" required value="${existing ? esc(existing.title) : ''}"></div>
          <div class="field"><label>${t('form.brand')} *</label>
            <select name="brand">${cfg.brands.map(b => `<option ${existing && existing.brand === b ? 'selected' : ''}>${b}</option>`).join('')}</select></div>
          <div class="field"><label>${t('form.year')}</label>
            <input name="year" maxlength="12" placeholder="2019" value="${existing ? esc(existing.year) : ''}"></div>
          <div class="field"><label>${t('form.condition')} *</label>
            <select name="condition">${cfg.conditions.map(c => `<option value="${c}" ${existing && existing.condition === c ? 'selected' : ''}>${t('cond.' + c)}</option>`).join('')}</select></div>
          <div class="field"><label>${t('form.saletype')} *</label>
            <select name="sale_type" id="fSaleType" ${existing ? 'disabled' : ''}>
              <option value="fixed" ${!existing || existing.sale_type !== 'auction' ? 'selected' : ''}>${t('form.fixed')}</option>
              <option value="auction" ${existing && existing.sale_type === 'auction' ? 'selected' : ''}>${t('form.auction')}</option>
            </select></div>
          <div class="field"><label id="priceLabel">${t('form.price')} *</label>
            <input name="price" id="fPrice" type="number" min="1" step="any" required value="${existing ? existing.price : ''}" ${existing && existing.sale_type === 'auction' && existing.bid_count > 0 ? 'readonly' : ''}></div>
          <div class="field auc-only" style="display:none"><label>${t('form.duration')}</label>
            <select name="auction_days" id="fDuration" ${existing && existing.bid_count > 0 ? 'disabled' : ''}>
              ${(cfg.auction_durations || [1, 3, 5, 7]).map(d => `<option value="${d}" ${d === 3 ? 'selected' : ''}>${t('form.days', { n: fmtNum(d) })}</option>`).join('')}
            </select></div>
          <div class="field auc-only" style="display:none"><label>${t('form.reserve')}</label>
            <input name="reserve_price" type="number" min="0" step="any" placeholder="0" value="${existing && existing.reserve_price ? existing.reserve_price : ''}" ${existing && existing.sale_type === 'auction' && existing.bid_count > 0 ? 'readonly' : ''}>
            <small class="field-hint">${t('form.reserve.hint')}</small></div>
          <div class="field full auc-only" style="display:none">
            <small class="field-hint" id="aucHint">${t('form.auction.hint')}</small>
            ${existing && existing.sale_type === 'auction'
              ? `<small class="field-hint" style="display:block;margin-top:6px">${existing.bid_count > 0 ? t('form.auction.locked') : t('form.auction.extend')}</small>` : ''}
          </div>
          <div class="field"><label>${t('form.currency')}</label>
            <select name="currency">${cfg.currencies.map(c => `<option ${existing && existing.currency === c ? 'selected' : c === 'AED' && !existing ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
          <div class="field"><label>${t('form.city')}</label>
            <select name="city">${(cfg.cities || []).map(c => `<option ${existing && existing.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
          <div class="field"><label>${t('form.box')}</label>
            <select name="box">
              <option value="1" ${existing && existing.box ? 'selected' : ''}>${t('yes')}</option>
              <option value="0" ${existing && !existing.box ? 'selected' : ''}>${t('no')}</option>
            </select></div>
          <div class="field"><label>${t('form.papers')}</label>
            <select name="papers">
              <option value="1" ${existing && existing.papers ? 'selected' : ''}>${t('yes')}</option>
              <option value="0" ${existing && !existing.papers ? 'selected' : ''}>${t('no')}</option>
            </select></div>
          <div class="field" id="negWrap" style="justify-content:end">
            <label class="check-line"><input type="checkbox" name="negotiable" ${!existing || existing.negotiable ? 'checked' : ''}> <span>${t('form.negotiable')}</span></label></div>
          <div class="field full"><label>${t('form.description')}</label>
            <textarea name="description" maxlength="2000">${existing ? esc(existing.description) : ''}</textarea></div>
        </div>
        <button class="btn btn-terra" style="margin-top:24px" type="submit">${existing ? t('form.update') : t('form.submit')}<span class="arrow">→</span></button>
      </form>
    </section>`;

  const previews = document.getElementById('photoPreviews');
  function drawPreviews() {
    previews.innerHTML = '';
    existingPhotos.forEach((p, i) => {
      const d = document.createElement('div');
      d.className = 'pp';
      d.innerHTML = `<img src="${esc(p)}"><button type="button" data-old="${i}">✕</button>`;
      previews.appendChild(d);
    });
    sellPhotos.forEach((p, i) => {
      const d = document.createElement('div');
      d.className = 'pp';
      d.innerHTML = `<img src="${p}"><button type="button" data-new="${i}">✕</button>`;
      previews.appendChild(d);
    });
    previews.querySelectorAll('[data-old]').forEach(b => b.addEventListener('click', () => { existingPhotos.splice(Number(b.dataset.old), 1); drawPreviews(); }));
    previews.querySelectorAll('[data-new]').forEach(b => b.addEventListener('click', () => { sellPhotos.splice(Number(b.dataset.new), 1); drawPreviews(); }));
  }
  drawPreviews();

  const input = document.getElementById('photoInput');
  document.getElementById('photoDrop').addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    const files = Array.from(input.files || []).slice(0, 5 - existingPhotos.length - sellPhotos.length);
    for (const f of files) {
      if (f.size > 8 * 1024 * 1024) { toast(t('err.generic'), true); continue; }
      const r = new FileReader();
      r.onload = () => { sellPhotos.push(r.result); drawPreviews(); };
      r.readAsDataURL(f);
    }
    input.value = '';
  });

  // sale type toggle — show auction fields, swap the price label
  const saleTypeSel = document.getElementById('fSaleType');
  function syncSaleType() {
    const isAuc = saleTypeSel.value === 'auction';
    document.querySelectorAll('.auc-only').forEach(el => { el.style.display = isAuc ? '' : 'none'; });
    document.getElementById('priceLabel').textContent = isAuc ? t('form.starting') + ' *' : t('form.price') + ' *';
    const neg = document.getElementById('negWrap');
    if (neg) neg.style.display = isAuc ? 'none' : '';
  }
  saleTypeSel.addEventListener('change', syncSaleType);
  syncSaleType();

  document.getElementById('sellForm').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const isAuc = existing ? existing.sale_type === 'auction' : saleTypeSel.value === 'auction';
    const body = {
      title: String(fd.get('title') || '').trim(),
      brand: fd.get('brand'), year: String(fd.get('year') || '').trim(),
      condition: fd.get('condition'), price: Number(fd.get('price')),
      currency: fd.get('currency'), negotiable: isAuc ? 0 : (fd.get('negotiable') ? 1 : 0),
      description: String(fd.get('description') || '').trim(),
      city: fd.get('city'),
      box: fd.get('box') === '1' ? 1 : 0,
      papers: fd.get('papers') === '1' ? 1 : 0,
      sale_type: existing ? existing.sale_type : saleTypeSel.value,
      auction_days: Number(fd.get('auction_days')) || 3,
      reserve_price: isAuc ? (Number(fd.get('reserve_price')) || 0) : 0,
    };
    if (!body.title || !body.price) { toast(t('err.generic'), true); return; }
    if (existingPhotos.length + sellPhotos.length === 0) { toast(t('sell.photos'), true); return; }
    try {
      if (existing) {
        body.photos = existingPhotos;
        body.new_photos = sellPhotos;
        await api('/api/listings/' + existing.id, { method: 'PATCH', body: JSON.stringify(body) });
        toast(t('form.updated') || 'Saved');
        location.hash = '#/listing/' + existing.id;
      } else {
        body.photos = sellPhotos;
        const r = await api('/api/listings', { method: 'POST', body: JSON.stringify(body) });
        toast(t('form.posted'));
        location.hash = '#/listing/' + r.id;
      }
    } catch (err) { toast(err.message, true); }
  });
}

/* ---------------- auth pages ---------------- */
function renderLogin(root) {
  root.innerHTML = `
    <div class="admin-shell">
      <div class="auth-card">
        <h1>${t('login.title')}</h1>
        <p>${t('login.sub')}</p>
        <form id="loginForm">
          <div class="field"><label>${t('login.email')}</label><input name="email" type="email" required autocomplete="email"></div>
          <div class="field"><label>${t('login.password')}</label><input name="password" type="password" required autocomplete="current-password"></div>
          <button class="btn btn-solid" type="submit">${t('login.submit')}</button>
        </form>
        <div class="auth-switch">${t('login.noaccount')} <a href="#/register">${t('login.create')}</a></div>
      </div>
    </div>`;
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const r = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }) });
      await refreshMe();
      toast(t('toast.welcome', { name: r.user.name.split(' ')[0] }));
      location.hash = '#/';
    } catch (err) { toast(err.message, true); }
  });
}

function renderRegister(root) {
  root.innerHTML = `
    <div class="admin-shell">
      <div class="auth-card">
        <h1>${t('reg.title')}</h1>
        <p>${t('reg.sub')}</p>
        <form id="regForm">
          <div class="field"><label>${t('reg.name')} *</label><input name="name" required maxlength="80" autocomplete="name"></div>
          <div class="field"><label>${t('login.email')} *</label><input name="email" type="email" required autocomplete="email"></div>
          <div class="field"><label>${t('login.password')} *</label><input name="password" type="password" required minlength="6" autocomplete="new-password"></div>
          <div class="field"><label>${t('reg.phone')}</label><input name="phone" type="tel" maxlength="40"></div>
          <div class="field"><label>${t('reg.whatsapp')}</label><input name="whatsapp" type="tel" maxlength="40"></div>
          <button class="btn btn-terra" type="submit">${t('reg.submit')}</button>
        </form>
        <div class="auth-switch">${t('reg.have')} <a href="#/login">${t('reg.signin')}</a></div>
      </div>
    </div>`;
  document.getElementById('regForm').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const r = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: fd.get('name'), email: fd.get('email'), password: fd.get('password'), phone: fd.get('phone'), whatsapp: fd.get('whatsapp') }),
      });
      await refreshMe();
      toast(t('toast.welcome', { name: r.user.name.split(' ')[0] }));
      location.hash = '#/';
    } catch (err) { toast(err.message, true); }
  });
}

/* ---------------- account ---------------- */
const ACCOUNT_TABS = ['listings', 'received', 'sent', 'messages', 'bids', 'favorites'];

async function renderAccount(root, tab) {
  if (!state.user) {
    root.innerHTML = `<div class="section"><div class="empty-state"><span class="serif">${t('err.login')}</span></div>
      <div style="text-align:center;margin-top:18px"><a class="btn btn-solid" href="#/login">${t('auth.signin')}</a></div></div>`;
    return;
  }
  if (!ACCOUNT_TABS.includes(tab)) tab = 'listings';
  const badges = {
    received: state.counts.pending_offers,
    messages: state.counts.unread_messages,
    bids: state.counts.outbid_count,
  };
  root.innerHTML = `
    ${pageHead(t('account.title'))}
    <section class="section" style="padding-top:26px">
      <nav class="account-tabs">
        ${ACCOUNT_TABS.map(tb => `<a href="#/account/${tb}" class="${tb === tab ? 'active' : ''}">${t('tab.' + tb)}${badges[tb] ? ` <span class="mini-badge">${badges[tb]}</span>` : ''}</a>`).join('')}
        <a href="#" id="logoutLink" style="margin-inline-start:auto">${t('auth.signout')}</a>
      </nav>
      <div id="accountBody"></div>
    </section>`;
  document.getElementById('logoutLink').addEventListener('click', e => { e.preventDefault(); logout(); });
  const body = document.getElementById('accountBody');
  if (tab === 'listings') await renderMyListings(body);
  else if (tab === 'received') await renderOffersReceived(body);
  else if (tab === 'sent') await renderOffersSent(body);
  else if (tab === 'messages') await renderConversations(body);
  else if (tab === 'bids') await renderMyBids(body);
  else if (tab === 'favorites') await renderFavorites(body);
}

/* ---------------- my bids (auctions) ---------------- */
function bidRowHTML(r) {
  const pos = r.position;
  const live = pos === 'winning' || pos === 'outbid';
  return `
  <div class="offer-card">
    <a href="#/listing/${r.id}"><img src="${esc(cover(r))}" alt=""></a>
    <div>
      <a href="#/listing/${r.id}"><div class="oc-title">${esc(r.title)}</div></a>
      <div class="oc-meta">${t('auc.current')}: <strong>${fmtPrice(r.current_price != null ? r.current_price : r.price, r.currency)}</strong>
        · ${t('bids.mymax')}: ${fmtNum(r.max_amount)} ${esc(r.currency)} · ${esc(r.seller_name)}</div>
      <div class="oc-meta" style="margin-top:6px">
        ${live ? `${t('auc.endsin')} <span class="auc-countdown-sm">${fmtCountdown(r.auction_ends_at)}</span>` : fmtDate(r.bid_at)}
      </div>
    </div>
    <div class="offer-side">
      <span class="status-pill bid-pos-${pos}">${t('bids.pos.' + pos)}</span>
      ${pos === 'outbid' ? `<a class="btn btn-terra btn-small" href="#/listing/${r.id}">${t('bids.raise')}</a>` : ''}
      ${pos === 'won' ? `<a class="btn btn-ghost btn-small" href="#/listing/${r.id}">${t('listing.message')}</a>` : ''}
    </div>
  </div>`;
}

async function renderMyBids(body) {
  const rows = await api('/api/my/bids').catch(() => []);
  if (!rows.length) {
    body.innerHTML = `<div class="empty-state"><span class="serif">⌛</span>${t('bids.empty')}</div>`;
    return;
  }
  const active = rows.filter(r => r.position === 'winning' || r.position === 'outbid');
  const finished = rows.filter(r => r.position === 'won' || r.position === 'ended');
  body.innerHTML =
    (active.length ? `<div class="bids-sub">${t('bids.active')}</div>${active.map(bidRowHTML).join('')}` : '') +
    (finished.length ? `<div class="bids-sub" style="margin-top:26px">${t('bids.finished')}</div>${finished.map(bidRowHTML).join('')}` : '');
}

async function renderFavorites(body) {
  const rows = await api('/api/my/favorites').catch(() => []);
  if (!rows.length) {
    body.innerHTML = `<div class="empty-state"><span class="serif">♡</span>${t('fav.empty')}</div>`;
    return;
  }
  body.innerHTML = `<div class="product-grid">${rows.map(l => `<div data-fav-card="${l.id}">${listingCard(l)}</div>`).join('')}</div>`;
  bindHearts(body);
}

async function renderMyListings(body) {
  const rows = await api('/api/my/listings').catch(() => []);
  if (!rows.length) {
    body.innerHTML = `<div class="empty-state"><span class="serif">${t('mylist.empty')}</span>
      <a class="btn btn-terra" href="#/sell" style="margin-top:16px">${t('mylist.post')}</a></div>`;
    return;
  }
  body.innerHTML = rows.map(l => `
    <div class="offer-card">
      <a href="#/listing/${l.id}"><img src="${esc(cover(l))}" alt=""></a>
      <div>
        <a href="#/listing/${l.id}"><div class="oc-title">${esc(l.title)}</div></a>
        <div class="oc-meta">${fmtPrice(l.sale_type === 'auction' && l.current_price != null ? l.current_price : l.price, l.currency)} · ${t('cond.' + l.condition)} · ${fmtDate(l.created_at)}</div>
        <div style="display:flex;gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap">
          ${l.status === 'sold' ? `<span class="status-pill status-offer-withdrawn">${t('listing.sold')}</span>` : `<span class="status-pill status-offer-accepted">${l.status === 'active' ? (state.lang === 'ar' ? 'نشط' : 'Active') : l.status}</span>`}
          ${l.sale_type === 'auction' ? `<span class="status-pill status-offer-pending">${t('auc.badge')} · ${l.bid_count ? t(l.bid_count === 1 ? 'auc.bid' : 'auc.bids', { n: fmtNum(l.bid_count) }) : t('mylist.auction.nobids')} · ${t('mylist.auction.ends')} ${fmtCountdown(l.auction_ends_at)}</span>` : ''}
          ${l.pending_offers ? `<span class="status-pill status-offer-pending">${t('mylist.offers', { n: l.pending_offers })}</span>` : ''}
        </div>
      </div>
      <div class="offer-side">
        <div class="offer-actions">
          <a class="btn btn-ghost btn-small" href="#/sell/edit/${l.id}">${t('listing.edit')}</a>
          ${l.status === 'sold'
            ? `<button class="btn btn-ghost btn-small" data-react="${l.id}">${t('listing.reactivate')}</button>`
            : `<button class="btn btn-ghost btn-small" data-sold="${l.id}">${t('listing.marksold')}</button>`}
          <button class="btn btn-danger btn-small" data-del="${l.id}">${t('mylist.delete')}</button>
        </div>
      </div>
    </div>`).join('');
  body.querySelectorAll('[data-sold]').forEach(b => b.addEventListener('click', async () => {
    try { await api('/api/listings/' + b.dataset.sold, { method: 'PATCH', body: JSON.stringify({ status: 'sold' }) }); toast(t('mylist.solddone')); renderMyListings(body); } catch (e) { toast(e.message, true); }
  }));
  body.querySelectorAll('[data-react]').forEach(b => b.addEventListener('click', async () => {
    try { await api('/api/listings/' + b.dataset.react, { method: 'PATCH', body: JSON.stringify({ status: 'active' }) }); toast(t('mylist.activedone')); renderMyListings(body); } catch (e) { toast(e.message, true); }
  }));
  body.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
    if (!confirm(t('mylist.confirmDelete'))) return;
    try { await api('/api/listings/' + b.dataset.del, { method: 'DELETE' }); toast(t('mylist.deleted')); renderMyListings(body); } catch (e) { toast(e.message, true); }
  }));
}

function offerCardHTML(o, mode) {
  const coverImg = (o.listing_photos && o.listing_photos[0]) || '/images/wh-logo.png';
  const otherName = mode === 'received' ? o.buyer_name : o.seller_name;
  return `
    <div class="offer-card">
      <a href="#/listing/${o.listing_id}"><img src="${esc(coverImg)}" alt=""></a>
      <div>
        <a href="#/listing/${o.listing_id}"><div class="oc-title">${esc(o.listing_title)}</div></a>
        <div class="oc-meta">${t('offers.from')} <strong>${esc(otherName)}</strong> · ${t('offers.asking')} ${fmtPrice(o.asking_price, o.listing_currency)} · ${fmtDate(o.created_at)}</div>
        ${o.message ? `<div class="oc-msg">${esc(o.message)}</div>` : ''}
        ${o.status === 'accepted' && mode === 'received' ? `<div class="oc-meta" style="margin-top:8px;color:#3f6b2a">${t('offers.acceptedHint')}</div>` : ''}
      </div>
      <div class="offer-side">
        <div class="offer-amount">${fmtPrice(o.amount, o.currency)}<small>${statusPill(o.status)}</small></div>
        <div class="offer-actions">
          ${mode === 'received' && o.status === 'pending' ? `
            <button class="btn btn-terra btn-small" data-accept="${o.id}">${t('offers.accept')}</button>
            <button class="btn btn-ghost btn-small" data-reject="${o.id}">${t('offers.reject')}</button>` : ''}
          ${mode === 'sent' && o.status === 'pending' ? `
            <button class="btn btn-ghost btn-small" data-withdraw="${o.id}">${t('offers.withdraw')}</button>` : ''}
          ${mode === 'received' && o.status === 'accepted' ? `
            <button class="btn btn-ghost btn-small" data-chatbuyer="${o.listing_id}" data-buyer="${o.buyer_id}">${t('offers.messageBuyer')}</button>` : ''}
        </div>
      </div>
    </div>`;
}

async function renderOffersReceived(body) {
  const rows = await api('/api/offers/received').catch(() => []);
  body.innerHTML = rows.length
    ? rows.map(o => offerCardHTML(o, 'received')).join('')
    : `<div class="empty-state"><span class="serif">—</span>${t('offers.received.empty')}</div>`;
  bindOfferActions(body, () => renderOffersReceived(body));
}

async function renderOffersSent(body) {
  const rows = await api('/api/offers/sent').catch(() => []);
  body.innerHTML = rows.length
    ? rows.map(o => offerCardHTML(o, 'sent')).join('')
    : `<div class="empty-state"><span class="serif">—</span>${t('offers.sent.empty')}</div>`;
  bindOfferActions(body, () => renderOffersSent(body));
}

function bindOfferActions(body, reload) {
  const act = async (id, action) => {
    try {
      await api('/api/offers/' + id, { method: 'PATCH', body: JSON.stringify({ action }) });
      toast(t('offers.status.' + (action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'withdrawn')));
      await refreshMe();
      reload();
    } catch (e) { toast(e.message, true); }
  };
  body.querySelectorAll('[data-accept]').forEach(b => b.addEventListener('click', () => act(b.dataset.accept, 'accept')));
  body.querySelectorAll('[data-reject]').forEach(b => b.addEventListener('click', () => act(b.dataset.reject, 'reject')));
  body.querySelectorAll('[data-withdraw]').forEach(b => b.addEventListener('click', () => act(b.dataset.withdraw, 'withdraw')));
  body.querySelectorAll('[data-chatbuyer]').forEach(b => b.addEventListener('click', async () => {
    // seller opening chat with buyer: conversation keyed by listing+buyer already exists if buyer started it;
    // otherwise messages are only buyer-initiated — so just go to messages tab.
    location.hash = '#/account/messages';
  }));
}

async function renderConversations(body) {
  const rows = await api('/api/conversations').catch(() => []);
  if (!rows.length) {
    body.innerHTML = `<div class="empty-state"><span class="serif">—</span>${t('conv.empty')}</div>`;
    return;
  }
  body.innerHTML = rows.map(c => `
    <a class="conv-item" href="#/chat/${c.id}">
      <img src="${esc((c.listing_photos && c.listing_photos[0]) || '/images/wh-logo.png')}" alt="">
      <div>
        <div class="cv-name">${esc(c.other_name)} <span class="cond-badge">${t('conv.role.' + (c.my_role === 'buyer' ? 'buying' : 'selling'))}</span></div>
        <div class="cv-listing">${esc(c.listing_title)}</div>
        <div class="cv-last">${esc(c.last_message)}</div>
      </div>
      <div class="cv-time">
        ${fmtDate(c.last_message_at)}<br>
        ${c.unread ? `<span class="mini-badge" style="margin-top:6px">${c.unread}</span>` : ''}
      </div>
    </a>`).join('');
}

/* ---------------- chat thread ---------------- */
let chatTimer = null;

async function renderChat(root, convId) {
  if (!state.user) {
    root.innerHTML = `<div class="section"><div class="empty-state"><span class="serif">${t('err.login')}</span></div></div>`;
    return;
  }
  root.innerHTML = `
    <section class="section"><div class="chat-wrap">
      <a class="back-link" href="#/account/messages"><span class="${state.lang === 'ar' ? 'flip-rtl' : ''}">←</span> ${t('tab.messages')}</a>
      <div id="chatHead"></div>
      <div class="thread" id="thread"></div>
      <form class="chat-box" id="chatBox">
        <input id="chatMsg" maxlength="1000" placeholder="${t('chat.placeholder')}" autocomplete="off">
        <button class="btn btn-solid btn-small" type="submit">${state.lang === 'ar' ? 'إرسال' : 'Send'}</button>
      </form>
    </div></section>`;

  let lastId = 0;
  const thread = document.getElementById('thread');

  async function poll() {
    let data;
    try { data = await api(`/api/conversations/${convId}/messages?after=${lastId}`); }
    catch (e) { if (e.status === 404 || e.status === 403) { stopPolling(); root.innerHTML = `<div class="section"><div class="empty-state"><span class="serif">404</span></div></div>`; } return; }

    if (data.listing) {
      document.getElementById('chatHead').innerHTML = `
        <a class="chat-listing-bar" href="#/listing/${data.listing.id}">
          <img src="${esc((data.listing.photos && data.listing.photos[0]) || '/images/wh-logo.png')}" alt="">
          <div>
            <div class="clb-title">${esc(data.listing.title)}</div>
            <div class="clb-price">${fmtPrice(data.listing.price, data.listing.currency)} · ${esc(data.other_name)}</div>
          </div>
        </a>
        ${data.listing.status === 'sold' ? `<div class="sold-banner">${t('chat.soldwarn')}</div>` : ''}`;
    }
    if (data.messages.length) {
      const nearBottom = thread.scrollTop + thread.clientHeight >= thread.scrollHeight - 80;
      for (const m of data.messages) {
        const mine = m.sender_id === data.me;
        const row = document.createElement('div');
        row.className = 'msg-row' + (mine ? ' me' : '');
        row.innerHTML = `<div class="bubble">${esc(m.body)}<span class="b-time">${fmtTime(m.created_at)}</span></div>`;
        thread.appendChild(row);
        lastId = Math.max(lastId, m.id);
      }
      if (nearBottom || lastId === data.messages[data.messages.length - 1].id) thread.scrollTop = thread.scrollHeight;
      refreshMe(); // update header badge
    }
  }
  await poll();
  thread.scrollTop = thread.scrollHeight;
  chatTimer = setInterval(poll, 4000);

  document.getElementById('chatBox').addEventListener('submit', async e => {
    e.preventDefault();
    const input = document.getElementById('chatMsg');
    const body = input.value.trim();
    if (!body) return;
    input.value = '';
    try {
      await api(`/api/conversations/${convId}/messages`, { method: 'POST', body: JSON.stringify({ body }) });
      poll();
    } catch (err) { toast(err.message, true); }
  });
}
function stopPolling() { if (chatTimer) { clearInterval(chatTimer); chatTimer = null; } }

/* ---------------- about ---------------- */
function renderAbout(root) {
  root.innerHTML = `
    <section class="section">
      <div class="about-wrap">
        <span class="label">${t('about.kicker')}</span>
        <h1 style="font-size:clamp(34px,5vw,60px);margin-top:16px">${t('about.title')}</h1>
        <p class="hero-sub" style="margin-inline:auto;margin-top:22px">${t('about.body')}</p>
        <div class="about-facts">
          <div><span class="num">${t('about.f1.num')}</span><span class="lbl">${t('about.f1.lbl')}</span></div>
          <div><span class="num">${t('about.f2.num')}</span><span class="lbl">${t('about.f2.lbl')}</span></div>
          <div><span class="num">${t('about.f3.num')}</span><span class="lbl">${t('about.f3.lbl')}</span></div>
        </div>
        <div class="hero-cta" style="justify-content:center;margin-top:44px">
          <a class="btn btn-solid" href="#/sell">${t('hero.cta.sell')}<span class="arrow">→</span></a>
          <a class="btn btn-ghost" href="#/browse">${t('hero.cta.browse')}</a>
        </div>
      </div>
    </section>`;
}

/* ---------------- router ---------------- */
function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const qIndex = h.indexOf('?');
  const path = qIndex > -1 ? h.slice(0, qIndex) : h;
  const query = qIndex > -1 ? h.slice(qIndex + 1) : '';
  return { parts: path.split('/').filter(Boolean), query };
}

async function route() {
  stopPolling();
  stopAuctionTimers();
  const { parts, query } = parseHash();
  const root = document.getElementById('app');

  if (parts[0] === 'admin') {
    if (window.Admin && window.Admin.render) { window.Admin.render(root, parts.slice(1)); return; }
  }

  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active',
      (href === '#/' && parts.length === 0) ||
      (href === '#/browse' && (parts[0] === 'browse' || parts[0] === 'listing')) ||
      (href === '#/sell' && parts[0] === 'sell') ||
      (href === '#/about' && parts[0] === 'about'));
  });

  window.scrollTo({ top: 0, behavior: 'instant' });
  try {
    if (parts.length === 0) await renderHome(root);
    else if (parts[0] === 'browse') await renderBrowse(root, query);
    else if (parts[0] === 'listing') await renderListing(root, Number(parts[1]));
    else if (parts[0] === 'sell' && parts[1] === 'edit') await renderSell(root, Number(parts[2]));
    else if (parts[0] === 'sell') await renderSell(root, null);
    else if (parts[0] === 'login') renderLogin(root);
    else if (parts[0] === 'register') renderRegister(root);
    else if (parts[0] === 'account') await renderAccount(root, parts[1] || 'listings');
    else if (parts[0] === 'chat') await renderChat(root, Number(parts[1]));
    else if (parts[0] === 'about') renderAbout(root);
    else await renderHome(root);
  } catch (e) {
    console.error(e);
    root.innerHTML = `<div class="section"><div class="empty-state"><span class="serif">!</span>${esc(e.message || t('err.generic'))}</div></div>`;
  }
}

/* ---------------- init ---------------- */
async function init() {
  try { state.config = await api('/api/config'); } catch { state.config = { brands: [], conditions: [], currencies: [] }; }
  applyLang();
  await refreshMe();

  document.getElementById('langToggle').addEventListener('click', () => {
    setLang(state.lang === 'en' ? 'ar' : 'en');
    toast(t('toast.lang'));
  });

  window.OrgLux = { t, esc, api, fmtPrice, fmtNum, fmtDate, toast, state, refreshMe, cover };

  window.addEventListener('hashchange', route);
  await route();

  // light polling for header badges while logged in
  setInterval(() => { if (state.user) refreshMe(); }, 30000);
}
document.addEventListener('DOMContentLoaded', init);
