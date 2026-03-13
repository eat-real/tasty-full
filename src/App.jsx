import { useState, useRef, useCallback, useEffect } from "react";

function useMedia(query) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const h = e => setM(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [query]);
  return m;
}

/* ══════════════════════════════════════════════════════
   TRANSLATIONS  (6 languages, all strings)
══════════════════════════════════════════════════════ */
const LANGS = [
  { code:"en", flag:"🇬🇧", label:"EN" },
  { code:"pt", flag:"🇵🇹", label:"PT" },
  { code:"es", flag:"🇪🇸", label:"ES" },
  { code:"fr", flag:"🇫🇷", label:"FR" },
  { code:"uk", flag:"🇺🇦", label:"UK" },
  { code:"ru", flag:"🇷🇺", label:"RU" },
];

const T = {
  en:{
    brand:"Tasty & Full",
    nav_home:"Home", nav_menu:"Menu", nav_planner:"Planner", nav_orders:"My Orders", logout:"Sign Out",
    login:"Sign In", register:"Sign Up",
    hero_badge:"Orders open · Delivery Mon, Wed, Fri",
    hero_h:"Home-cooked food\nfor the whole week",
    hero_sub:"Build your weekly menu — breakfasts, soups, mains with sides of your choice.",
    hero_cta:"Build my menu →",
    feat1_h:"Home cooking", feat1_t:"No preservatives — only natural ingredients.",
    feat2_h:"Week plan",    feat2_t:"Plan 7 days with exact nutrition facts.",
    feat3_h:"3 deliveries", feat3_t:"Mon, Wed, Fri before noon. Fresh — 2 days.",
    cta_h:"Try it now", cta_sub:"Building a menu takes 3 minutes", cta_btn:"Open planner →",
    plan_title:"Weekly Planner", plan_sub:"Deliveries Mon · Wed · Fri before noon",
    plan_f:"👩 2000 kcal", plan_m:"👨 2500 kcal",
    auto:"✨ Auto-fill", save_cart:"🛒 Save", checkout_btn:"Checkout",
    slot_b:"Breakfast", slot_l:"Lunch", slot_d:"Dinner", slot_bonus:"Extra",
    days:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    delivery:"Delivery", free_delivery:"Free delivery!",
    delivery_note:"Free from 50€ · Under 50€ — 5€",
    comment_lbl:"💬 Comment", comment_ph:"Allergies, delivery notes…",
    how_title:"How to add:", how1:"① Click dish — it expands & highlights",
    how2:"② Click an empty cell", how3:"🖱 Or drag & drop",
    how4:"⚡ Fresh dishes — delivery day + next day only",
    menu_title:"Menu", menu_sub:"Updated weekly · Natural ingredients",
    orders_title:"Order History", orders_sub:"Your past orders",
    repeat:"Repeat order",
    auth_name:"Name", auth_email:"Email", auth_phone:"Phone", auth_pwd:"Password",
    auth_no_acc:"No account?", auth_create:"Create one",
    co_title:"Checkout", co_sub:"Where to deliver?",
    co_street:"Street & building", co_apt:"Apt / floor",
    co_time:"Delivery time", co_pay:"Payment",
    co_mbway:"MBway transfer", co_cash:"Cash to courier", co_usdt:"USDT crypto",
    co_total:"Total", co_delivery:"Delivery",
    co_btn:"Pay", co_note:"Secure payment",
    co_ok_h:"Order placed!", co_ok_sub:"We'll start cooking right away.\nConfirmation sent to your email.",
    co_tg:"Admin notified via Telegram",
    personal:"👤 Personal", office:"🏢 Office",
    office_hint:"Each row = 1 person / portion",
    portions_left:"left", sold_out:"Sold out",
    fresh_ok:"fresh ✓", delivery_day:"delivery",
    diet_title:"Dietary preferences",
    diet_lactose:"No lactose", diet_gluten:"No gluten", diet_vegan:"Full vegan",
    tag_vegan:"Vegan", tag_gf:"Gluten-free", tag_lf:"Dairy-free",
    tag_has_gluten:"Contains gluten", tag_has_lactose:"Contains dairy",
    blocked_vegan:"Not vegan", blocked_gluten:"Contains gluten", blocked_lactose:"Contains dairy",
    profile:"My Profile", cart_label:"Cart:",
    welcome:"👋 Welcome,",
    locked_h:"Sign in to build your order",
    locked_sub:"Login required to save orders and delivery details.",
    locked_acc:"Create account",
    cat_breakfast:"Breakfasts", cat_soup:"Soups", cat_main:"Mains", cat_special:"This week",
    kcal_norm:"norm", nutrition_lbl:"Cal·P·F·C",
    block_delivery:"Delivery block", block_free:"Free!", block_lbl:["Mon block","Wed block","Fri block"],
  },
  pt:{
    brand:"Gostoso & Farto",
    nav_home:"Início", nav_menu:"Menu", nav_planner:"Planeador", nav_orders:"Pedidos", logout:"Sair",
    login:"Entrar", register:"Registar",
    hero_badge:"Pedidos abertos · Entrega Seg, Qua, Sex",
    hero_h:"Comida caseira\npara a semana toda",
    hero_sub:"Crie o seu menu semanal — pequenos-almoços, sopas e pratos principais à escolha.",
    hero_cta:"Criar o meu menu →",
    feat1_h:"Cozinha caseira", feat1_t:"Sem conservantes — só ingredientes naturais.",
    feat2_h:"Plano semanal",   feat2_t:"Planeie 7 dias com valores nutricionais exactos.",
    feat3_h:"3 entregas",      feat3_t:"Seg, Qua, Sex antes do meio-dia. Fresco — 2 dias.",
    cta_h:"Experimente agora", cta_sub:"Criar um menu demora 3 minutos", cta_btn:"Abrir planeador →",
    plan_title:"Planeador semanal", plan_sub:"Entregas Seg · Qua · Sex antes do meio-dia",
    plan_f:"👩 2000 kcal", plan_m:"👨 2500 kcal",
    auto:"✨ Auto-preencher", save_cart:"🛒 Guardar", checkout_btn:"Finalizar",
    slot_b:"Peq.-almoço", slot_l:"Almoço", slot_d:"Jantar", slot_bonus:"Extra",
    days:["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
    delivery:"Entrega", free_delivery:"Entrega gratuita!",
    delivery_note:"Grátis a partir de 50€ · Abaixo de 50€ — 5€",
    comment_lbl:"💬 Comentário", comment_ph:"Alergias, notas de entrega…",
    how_title:"Como adicionar:", how1:"① Clique no prato — expande e destaca",
    how2:"② Clique numa célula vazia", how3:"🖱 Ou arraste e solte",
    how4:"⚡ Pratos frescos — só no dia de entrega + dia seguinte",
    menu_title:"Menu", menu_sub:"Atualizado semanalmente · Ingredientes naturais",
    orders_title:"Histórico de Pedidos", orders_sub:"Os seus pedidos anteriores",
    repeat:"Repetir pedido",
    auth_name:"Nome", auth_email:"Email", auth_phone:"Telemóvel", auth_pwd:"Palavra-passe",
    auth_no_acc:"Sem conta?", auth_create:"Criar",
    co_title:"Finalizar pedido", co_sub:"Onde entregar?",
    co_street:"Rua e número", co_apt:"Andar / apartamento",
    co_time:"Hora de entrega", co_pay:"Pagamento",
    co_mbway:"MBway", co_cash:"Dinheiro ao estafeta", co_usdt:"USDT cripto",
    co_total:"Total", co_delivery:"Entrega",
    co_btn:"Pagar", co_note:"Pagamento seguro",
    co_ok_h:"Pedido recebido!", co_ok_sub:"Vamos começar a cozinhar.\nConfirmação enviada ao email.",
    co_tg:"Administrador notificado via Telegram",
    personal:"👤 Pessoal", office:"🏢 Escritório",
    office_hint:"Cada linha = 1 pessoa / porção",
    portions_left:"disponíveis", sold_out:"Esgotado",
    fresh_ok:"fresco ✓", delivery_day:"entrega",
    diet_title:"Preferências alimentares",
    diet_lactose:"Sem lactose", diet_gluten:"Sem glúten", diet_vegan:"Vegano completo",
    tag_vegan:"Vegano", tag_gf:"Sem glúten", tag_lf:"Sem lactose",
    tag_has_gluten:"Contém glúten", tag_has_lactose:"Contém lactose",
    blocked_vegan:"Não vegano", blocked_gluten:"Contém glúten", blocked_lactose:"Contém lactose",
    profile:"Perfil", cart_label:"Carrinho:",
    welcome:"👋 Bem-vindo,",
    locked_h:"Entre para criar o seu pedido",
    locked_sub:"Autenticação necessária para guardar pedidos.",
    locked_acc:"Criar conta",
    cat_breakfast:"Pequenos-almoços", cat_soup:"Sopas", cat_main:"Pratos Pricipais", cat_special:"Esta semana",
    kcal_norm:"meta", nutrition_lbl:"Cal·P·G·HC",
    block_delivery:"Bloco entrega", block_free:"Grátis!", block_lbl:["Bloco Seg","Bloco Qua","Bloco Sex"],
  },
  es:{
    brand:"Rico & Lleno",
    nav_home:"Inicio", nav_menu:"Menú", nav_planner:"Planificador", nav_orders:"Pedidos", logout:"Salir",
    login:"Entrar", register:"Registrarse",
    hero_badge:"Pedidos abiertos · Entrega Lun, Mié, Vie",
    hero_h:"Comida casera\npara toda la semana",
    hero_sub:"Crea tu menú semanal — desayunos, sopas y platos principales a tu gusto.",
    hero_cta:"Crear mi menú →",
    feat1_h:"Cocina casera",  feat1_t:"Sin conservantes — solo ingredientes naturales.",
    feat2_h:"Plan semanal",   feat2_t:"Planifica 7 días con valores nutricionales exactos.",
    feat3_h:"3 entregas",     feat3_t:"Lun, Mié, Vie antes del mediodía. Fresco — 2 días.",
    cta_h:"Pruébalo ahora", cta_sub:"Crear un menú lleva 3 minutos", cta_btn:"Abrir planificador →",
    plan_title:"Planificador semanal", plan_sub:"Entregas Lun · Mié · Vie antes del mediodía",
    plan_f:"👩 2000 kcal", plan_m:"👨 2500 kcal",
    auto:"✨ Autocompletar", save_cart:"🛒 Guardar", checkout_btn:"Finalizar",
    slot_b:"Desayuno", slot_l:"Almuerzo", slot_d:"Cena", slot_bonus:"Extra",
    days:["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
    delivery:"Entrega", free_delivery:"¡Entrega gratuita!",
    delivery_note:"Gratis desde 50€ · Menos de 50€ — 5€",
    comment_lbl:"💬 Comentario", comment_ph:"Alergias, notas de entrega…",
    how_title:"Cómo añadir:", how1:"① Haz clic en el plato — se expande",
    how2:"② Haz clic en una celda vacía", how3:"🖱 O arrastra y suelta",
    how4:"⚡ Platos frescos — solo el día de entrega + día siguiente",
    menu_title:"Menú", menu_sub:"Actualizado semanalmente · Solo ingredientes naturales",
    orders_title:"Historial de Pedidos", orders_sub:"Todos tus pedidos anteriores",
    repeat:"Repetir pedido",
    auth_name:"Nombre", auth_email:"Email", auth_phone:"Teléfono", auth_pwd:"Contraseña",
    auth_no_acc:"¿Sin cuenta?", auth_create:"Créala",
    co_title:"Finalizar pedido", co_sub:"¿Dónde entregar?",
    co_street:"Calle y número", co_apt:"Piso / portal",
    co_time:"Hora de entrega", co_pay:"Método de pago",
    co_mbway:"MBway", co_cash:"Efectivo al repartidor", co_usdt:"USDT cripto",
    co_total:"Total", co_delivery:"Entrega",
    co_btn:"Pagar", co_note:"Pago seguro",
    co_ok_h:"¡Pedido confirmado!", co_ok_sub:"Empezamos a cocinar enseguida.\nConfirmación enviada a tu email.",
    co_tg:"Admin notificado vía Telegram",
    personal:"👤 Personal", office:"🏢 Oficina",
    office_hint:"Cada fila = 1 persona / porción",
    portions_left:"disponibles", sold_out:"Agotado",
    fresh_ok:"fresco ✓", delivery_day:"entrega",
    diet_title:"Preferencias alimentarias",
    diet_lactose:"Sin lactosa", diet_gluten:"Sin gluten", diet_vegan:"Vegano completo",
    tag_vegan:"Vegano", tag_gf:"Sin gluten", tag_lf:"Sin lactosa",
    tag_has_gluten:"Contiene gluten", tag_has_lactose:"Contiene lactosa",
    blocked_vegan:"No vegano", blocked_gluten:"Contiene gluten", blocked_lactose:"Contiene lactosa",
    profile:"Mi perfil", cart_label:"Carrito:",
    welcome:"👋 ¡Bienvenido,",
    locked_h:"Inicia sesión para crear tu pedido",
    locked_sub:"Autenticación requerida para guardar pedidos.",
    locked_acc:"Crear cuenta",
    cat_breakfast:"Desayunos", cat_soup:"Sopas", cat_main:"Platos Principales", cat_special:"Esta semana",
    kcal_norm:"meta", nutrition_lbl:"Cal·P·G·HC",
    block_delivery:"Bloque entrega", block_free:"¡Gratis!", block_lbl:["Bloque Lun","Bloque Mié","Bloque Vie"],
  },
  fr:{
    brand:"Bon & Rassasié",
    nav_home:"Accueil", nav_menu:"Menu", nav_planner:"Planificateur", nav_orders:"Commandes", logout:"Déconnexion",
    login:"Connexion", register:"S'inscrire",
    hero_badge:"Commandes ouvertes · Livraison Lun, Mer, Ven",
    hero_h:"Cuisine maison\npour toute la semaine",
    hero_sub:"Créez votre menu hebdomadaire — petits-déjeuners, soupes et plats principaux au choix.",
    hero_cta:"Créer mon menu →",
    feat1_h:"Cuisine maison",   feat1_t:"Sans conservateurs — uniquement des ingrédients naturels.",
    feat2_h:"Plan hebdomadaire", feat2_t:"Planifiez 7 jours avec les valeurs nutritionnelles exactes.",
    feat3_h:"3 livraisons",     feat3_t:"Lun, Mer, Ven avant midi. Frais — 2 jours.",
    cta_h:"Essayez maintenant", cta_sub:"Créer un menu prend 3 minutes", cta_btn:"Ouvrir le planificateur →",
    plan_title:"Planificateur hebdomadaire", plan_sub:"Livraisons Lun · Mer · Ven avant midi",
    plan_f:"👩 2000 kcal", plan_m:"👨 2500 kcal",
    auto:"✨ Auto-remplir", save_cart:"🛒 Sauvegarder", checkout_btn:"Commander",
    slot_b:"Petit-déjeuner", slot_l:"Déjeuner", slot_d:"Dîner", slot_bonus:"Bonus",
    days:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],
    delivery:"Livraison", free_delivery:"Livraison gratuite !",
    delivery_note:"Gratuit à partir de 50€ · Moins de 50€ — 5€",
    comment_lbl:"💬 Commentaire", comment_ph:"Allergies, notes de livraison…",
    how_title:"Comment ajouter :", how1:"① Cliquez sur un plat — il s'agrandit",
    how2:"② Cliquez sur une cellule vide", how3:"🖱 Ou faites glisser",
    how4:"⚡ Plats frais — jour de livraison + lendemain uniquement",
    menu_title:"Menu", menu_sub:"Mis à jour chaque semaine · Ingrédients naturels",
    orders_title:"Historique des Commandes", orders_sub:"Vos commandes passées",
    repeat:"Répéter la commande",
    auth_name:"Nom", auth_email:"Email", auth_phone:"Téléphone", auth_pwd:"Mot de passe",
    auth_no_acc:"Pas de compte ?", auth_create:"Créer",
    co_title:"Finaliser la commande", co_sub:"Où livrer ?",
    co_street:"Rue et numéro", co_apt:"Appartement / étage",
    co_time:"Heure de livraison", co_pay:"Mode de paiement",
    co_mbway:"MBway", co_cash:"Espèces au livreur", co_usdt:"USDT crypto",
    co_total:"Total", co_delivery:"Livraison",
    co_btn:"Payer", co_note:"Paiement sécurisé",
    co_ok_h:"Commande reçue !", co_ok_sub:"Nous commençons à cuisiner.\nConfirmation envoyée à votre email.",
    co_tg:"Admin notifié via Telegram",
    personal:"👤 Personnel", office:"🏢 Bureau",
    office_hint:"Chaque ligne = 1 personne / portion",
    portions_left:"disponibles", sold_out:"Épuisé",
    fresh_ok:"frais ✓", delivery_day:"livraison",
    diet_title:"Préférences alimentaires",
    diet_lactose:"Sans lactose", diet_gluten:"Sans gluten", diet_vegan:"Végétalien complet",
    tag_vegan:"Végétalien", tag_gf:"Sans gluten", tag_lf:"Sans lactose",
    tag_has_gluten:"Contient du gluten", tag_has_lactose:"Contient du lactose",
    blocked_vegan:"Non végétalien", blocked_gluten:"Contient du gluten", blocked_lactose:"Contient du lactose",
    profile:"Mon profil", cart_label:"Panier :",
    welcome:"👋 Bienvenue,",
    locked_h:"Connectez-vous pour créer votre commande",
    locked_sub:"Authentification requise pour sauvegarder les commandes.",
    locked_acc:"Créer un compte",
    cat_breakfast:"Petits-déjeuners", cat_soup:"Soupes", cat_main:"Plats Principaux", cat_special:"Cette semaine",
    kcal_norm:"objectif", nutrition_lbl:"Cal·P·L·G",
    block_delivery:"Bloc livraison", block_free:"Gratuit !", block_lbl:["Bloc Lun","Bloc Mer","Bloc Ven"],
  },
  uk:{
    brand:"Смачно & Ситно",
    nav_home:"Головна", nav_menu:"Меню", nav_planner:"Планувальник", nav_orders:"Замовлення", logout:"Вийти",
    login:"Увійти", register:"Реєстрація",
    hero_badge:"Замовлення відкриті · Доставка Пн, Ср, Пт",
    hero_h:"Домашня їжа\nна весь тиждень",
    hero_sub:"Склади меню на тиждень — сніданки, супи та гарячі страви на вибір.",
    hero_cta:"Скласти меню →",
    feat1_h:"Домашня кухня",     feat1_t:"Без консервантів — лише натуральні продукти.",
    feat2_h:"Замовлення на тиждень", feat2_t:"Плануй 7 днів наперед з точними КБЖУ.",
    feat3_h:"3 доставки",        feat3_t:"Пн, Ср, Пт до обіду. Свіже — 2 дні.",
    cta_h:"Спробуй зараз", cta_sub:"Скласти меню — 3 хвилини", cta_btn:"Відкрити планувальник →",
    plan_title:"Планувальник на тиждень", plan_sub:"Доставки Пн · Ср · Пт до обіду",
    plan_f:"👩 2000 ккал", plan_m:"👨 2500 ккал",
    auto:"✨ Авто-меню", save_cart:"🛒 У кошик", checkout_btn:"Оформити",
    slot_b:"Сніданок", slot_l:"Обід", slot_d:"Вечеря", slot_bonus:"Бонус",
    days:["Нд","Пн","Вт","Ср","Чт","Пт","Сб"],
    delivery:"Доставка", free_delivery:"Безкоштовна доставка!",
    delivery_note:"Безкоштовно від 50€ · До 50€ — 5€",
    comment_lbl:"💬 Коментар", comment_ph:"Алергії, побажання…",
    how_title:"Як додати:", how1:"① Натисни на страву — вона розгорнеться",
    how2:"② Натисни на порожню клітинку", how3:"🖱 Або перетягни мишею",
    how4:"⚡ Свіжі страви — тільки в день доставки + наступний",
    menu_title:"Меню", menu_sub:"Оновлюється щотижня · Натуральні продукти",
    orders_title:"Історія замовлень", orders_sub:"Ваші попередні замовлення",
    repeat:"Повторити замовлення",
    auth_name:"Ім'я", auth_email:"Email", auth_phone:"Телефон", auth_pwd:"Пароль",
    auth_no_acc:"Немає акаунту?", auth_create:"Створити",
    co_title:"Оформлення замовлення", co_sub:"Куди доставити?",
    co_street:"Вулиця та будинок", co_apt:"Квартира / поверх",
    co_time:"Час доставки", co_pay:"Оплата",
    co_mbway:"MBway переказ", co_cash:"Готівка кур'єру", co_usdt:"USDT крипто",
    co_total:"Разом", co_delivery:"Доставка",
    co_btn:"Оплатити", co_note:"Безпечна оплата",
    co_ok_h:"Замовлення прийнято!", co_ok_sub:"Ми вже починаємо готувати.\nПідтвердження надіслано на email.",
    co_tg:"Адміністратор отримав сповіщення в Telegram",
    personal:"👤 Особистий", office:"🏢 Офіс",
    office_hint:"Кожен рядок = 1 людина / порція",
    portions_left:"залишилось", sold_out:"Нема",
    fresh_ok:"свіже ✓", delivery_day:"доставка",
    diet_title:"Дієтичні уподобання",
    diet_lactose:"Без лактози", diet_gluten:"Без глютену", diet_vegan:"Повний веган",
    tag_vegan:"Веган", tag_gf:"Без глютену", tag_lf:"Без молочного",
    tag_has_gluten:"Містить глютен", tag_has_lactose:"Містить лактозу",
    blocked_vegan:"Не веганське", blocked_gluten:"Містить глютен", blocked_lactose:"Містить лактозу",
    profile:"Профіль", cart_label:"Кошик:",
    welcome:"👋 Ласкаво просимо,",
    locked_h:"Увійдіть, щоб скласти замовлення",
    locked_sub:"Потрібна авторизація для збереження замовлень.",
    locked_acc:"Створити акаунт",
    cat_breakfast:"Сніданки", cat_soup:"Супи", cat_main:"Гаряче", cat_special:"Цього тижня",
    kcal_norm:"норми", nutrition_lbl:"Ккал·Б·Ж·В",
    block_delivery:"Блок доставки", block_free:"Безкоштовно!", block_lbl:["Блок Пн","Блок Ср","Блок Пт"],
  },
  ru:{
    brand:"Вкусно & Сыто",
    nav_home:"Главная", nav_menu:"Меню", nav_planner:"Планировщик", nav_orders:"Заказы", logout:"Выйти",
    login:"Войти", register:"Регистрация",
    hero_badge:"Приём заказов открыт · Доставка Пн, Ср, Пт",
    hero_h:"Домашняя еда\nна всю неделю",
    hero_sub:"Составь меню — завтраки, супы и горячее с гарниром на выбор.",
    hero_cta:"Составить меню →",
    feat1_h:"Домашняя кухня",    feat1_t:"Без консервантов — только натуральные продукты.",
    feat2_h:"Заказ на неделю",   feat2_t:"Планируй 7 дней вперёд с точными КБЖУ.",
    feat3_h:"3 доставки",        feat3_t:"Пн, Ср, Пт до обеда. Свежее — 2 суток.",
    cta_h:"Попробуй сейчас", cta_sub:"Составить меню — 3 минуты", cta_btn:"Открыть планировщик →",
    plan_title:"Планировщик на неделю", plan_sub:"Доставки Пн · Ср · Пт до обеда",
    plan_f:"👩 2000 ккал", plan_m:"👨 2500 ккал",
    auto:"✨ Авто-меню", save_cart:"🛒 В корзину", checkout_btn:"Оформить",
    slot_b:"Завтрак", slot_l:"Обед", slot_d:"Ужин", slot_bonus:"Бонус",
    days:["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],
    delivery:"Доставка", free_delivery:"Бесплатная доставка!",
    delivery_note:"Бесплатно от 50€ · До 50€ — 5€",
    comment_lbl:"💬 Комментарий", comment_ph:"Аллергии, пожелания по доставке…",
    how_title:"Как добавить:", how1:"① Нажми на блюдо — оно развернётся",
    how2:"② Нажми на пустую ячейку", how3:"🖱 Или перетащи мышью",
    how4:"⚡ Свежие блюда — только в день доставки + следующий",
    menu_title:"Меню", menu_sub:"Обновляется каждую неделю · Натуральные продукты",
    orders_title:"История заказов", orders_sub:"Ваши прошлые заказы",
    repeat:"Повторить заказ",
    auth_name:"Имя", auth_email:"Email", auth_phone:"Телефон", auth_pwd:"Пароль",
    auth_no_acc:"Нет аккаунта?", auth_create:"Создать",
    co_title:"Оформление заказа", co_sub:"Куда доставить?",
    co_street:"Улица и дом", co_apt:"Квартира / этаж",
    co_time:"Время доставки", co_pay:"Оплата",
    co_mbway:"MBway перевод", co_cash:"Наличные курьеру", co_usdt:"USDT крипто",
    co_total:"Итого", co_delivery:"Доставка",
    co_btn:"Оплатить", co_note:"Безопасная оплата",
    co_ok_h:"Заказ принят!", co_ok_sub:"Мы уже начинаем готовить.\nПодтверждение придёт на email.",
    co_tg:"Администратор получил уведомление в Telegram",
    personal:"👤 Личный", office:"🏢 Офис",
    office_hint:"Каждая строка = 1 человек / порция",
    portions_left:"осталось", sold_out:"Нет",
    fresh_ok:"свежее ✓", delivery_day:"доставка",
    diet_title:"Диетические предпочтения",
    diet_lactose:"Без лактозы", diet_gluten:"Без глютена", diet_vegan:"Полный веган",
    tag_vegan:"Веган", tag_gf:"Без глютена", tag_lf:"Без молочного",
    tag_has_gluten:"Содержит глютен", tag_has_lactose:"Содержит лактозу",
    blocked_vegan:"Не веганское", blocked_gluten:"Содержит глютен", blocked_lactose:"Содержит лактозу",
    profile:"Мой профиль", cart_label:"Корзина:",
    welcome:"👋 Добро пожаловать,",
    locked_h:"Войдите, чтобы составить заказ",
    locked_sub:"Нужна авторизация для сохранения истории заказов.",
    locked_acc:"Создать аккаунт",
    cat_breakfast:"Завтраки", cat_soup:"Супы", cat_main:"Горячее", cat_special:"Блюда недели",
    kcal_norm:"нормы", nutrition_lbl:"Ккал·Б·Ж·У",
    block_delivery:"Блок доставки", block_free:"Бесплатно!", block_lbl:["Блок Пн","Блок Ср","Блок Пт"],
  },
};

/* ══════════════════════════════════════════════════════
   MENU DATA
   diet: { vegan, gf (gluten-free), lf (lactose-free) }
   img: Unsplash photo URL
   portions: initial stock (simulates Google Sheets)
══════════════════════════════════════════════════════ */
const IMG = id => `https://images.unsplash.com/${id}?w=400&h=260&fit=crop&auto=format`;

const ALL_DISHES = [
  // ── Breakfasts ──────────────────────────────────────────────────
  { id:1,  cat:"breakfast",
    name:{en:"Oatmeal with berries",pt:"Aveia com frutos vermelhos",es:"Avena con frutos rojos",fr:"Porridge aux baies",uk:"Вівсянка з ягодами",ru:"Овсянка с ягодами"},
    desc:{en:"Oats, milk, blueberries, raspberry, honey",ru:"Овсянка на молоке, черника, малина, мёд"},
    kcal:320,p:8,f:6,c:58, price:5, fresh:false,
    diet:{vegan:false,gf:true,lf:false},  // oats = gluten disputed; marked gf for simplicity
    img:IMG("photo-1517673400267-0251440c45dc"), portions:18 },
  { id:2,  cat:"breakfast",
    name:{en:"Cottage cheese pancakes",pt:"Panquecas de requeijão",es:"Tortitas de requesón",fr:"Blinis au fromage blanc",uk:"Сирники зі сметаною",ru:"Сырники со сметаной"},
    desc:{en:"Farmer's cheese, jam, sour cream",ru:"Фермерский творог, джем, сметана"},
    kcal:410,p:18,f:14,c:48, price:5, fresh:false,
    diet:{vegan:false,gf:false,lf:false},
    img:IMG("photo-1558961363-fa8fdf82db35"), portions:14 },
  { id:3,  cat:"breakfast",
    name:{en:"Fried eggs & tomatoes",pt:"Ovos fritos com tomates",es:"Huevos con tomates",fr:"Œufs aux tomates",uk:"Яєчня з томатами",ru:"Яичница с томатами"},
    desc:{en:"Fried eggs, cherry tomatoes, butter, herbs",ru:"Глазунья, черри, сливочное масло, зелень"},
    kcal:280,p:14,f:18,c:8, price:4, fresh:true,
    diet:{vegan:false,gf:true,lf:false},
    img:IMG("photo-1525351484163-7529414344d8"), portions:10 },
  { id:4,  cat:"breakfast",
    name:{en:"Granola & yoghurt",pt:"Granola com iogurte",es:"Granola con yogur",fr:"Granola au yaourt",uk:"Гранола з йогуртом",ru:"Гранола с йогуртом"},
    desc:{en:"Crunchy granola, Greek yoghurt, seasonal fruit",ru:"Хрустящая гранола, греческий йогурт, фрукты"},
    kcal:380,p:12,f:10,c:62, price:5, fresh:false,
    diet:{vegan:false,gf:false,lf:false},
    img:IMG("photo-1517093157656-b9eccef91cb1"), portions:16 },
  { id:5,  cat:"breakfast",
    name:{en:"Avocado toast",pt:"Torrada de abacate",es:"Tostada de aguacate",fr:"Toast à l'avocat",uk:"Тости з авокадо",ru:"Тосты с авокадо"},
    desc:{en:"Sourdough, avocado, poached egg, microgreens",ru:"Ремесленный хлеб, авокадо, яйцо пашот, зелень"},
    kcal:360,p:14,f:20,c:34, price:6, fresh:true,
    diet:{vegan:false,gf:false,lf:true},
    img:IMG("photo-1603046891744-1f0ab27f1a5e"), portions:12 },
  { id:6,  cat:"breakfast",
    name:{en:"Cottage cheese & fruit",pt:"Queijo fresco com fruta",es:"Requesón con frutas",fr:"Fromage blanc aux fruits",uk:"Сир з фруктами",ru:"Творог с фруктами"},
    desc:{en:"Farmer's cheese, strawberry, banana, honey",ru:"Деревенский творог, клубника, банан, мёд"},
    kcal:290,p:16,f:6,c:38, price:4, fresh:false,
    diet:{vegan:false,gf:true,lf:false},
    img:IMG("photo-1488477181228-c463d729e45d"), portions:15 },
  // ── Soups ──────────────────────────────────────────────────────
  { id:7,  cat:"soup",
    name:{en:"Pumpkin cream soup",pt:"Creme de abóbora",es:"Crema de calabaza",fr:"Velouté de potiron",uk:"Крем-суп із гарбуза",ru:"Крем-суп из тыквы"},
    desc:{en:"Pumpkin, cream, seeds, nutmeg",ru:"Тыква, сливки, семечки, мускатный орех"},
    kcal:185,p:4,f:10,c:20, price:8, fresh:false,
    diet:{vegan:false,gf:true,lf:false},
    img:IMG("photo-1547592180-85f173990554"), portions:20 },
  { id:8,  cat:"soup",
    name:{en:"Classic borscht",pt:"Borscht clássico",es:"Borscht clásico",fr:"Bortsch classique",uk:"Борщ класичний",ru:"Борщ классический"},
    desc:{en:"Beet, beef, cabbage, sour cream, pampushky",ru:"Свёкла, говядина, капуста, сметана, пампушки"},
    kcal:220,p:12,f:8,c:28, price:8, fresh:false,
    diet:{vegan:false,gf:false,lf:false},
    img:IMG("photo-1534939561126-855b8675edd7"), portions:18 },
  { id:9,  cat:"soup",
    name:{en:"Chicken noodle soup",pt:"Sopa de frango com massa",es:"Sopa de pollo con fideos",fr:"Soupe poulet aux nouilles",uk:"Курячий суп з локшиною",ru:"Куриный суп с лапшой"},
    desc:{en:"Clear broth, homemade noodles, dill",ru:"Прозрачный бульон, домашняя лапша, укроп"},
    kcal:160,p:12,f:5,c:18, price:7, fresh:false,
    diet:{vegan:false,gf:false,lf:true},
    img:IMG("photo-1547592166-23ac45744acd"), portions:22 },
  { id:10, cat:"soup",
    name:{en:"Tom Yum",pt:"Tom Yum",es:"Tom Yum",fr:"Tom Yum",uk:"Том Ям",ru:"Том Ям"},
    desc:{en:"Shrimp, coconut milk, lemongrass, galangal",ru:"Креветки, кокосовое молоко, лемонграсс"},
    kcal:210,p:16,f:12,c:14, price:9, fresh:false,
    diet:{vegan:false,gf:true,lf:true},
    img:IMG("photo-1562802378-063ec186a863"), portions:14 },
  { id:11, cat:"soup",
    name:{en:"Minestrone",pt:"Minestrone",es:"Minestrone",fr:"Minestrone",uk:"Мінестроне",ru:"Минестроне"},
    desc:{en:"Italian vegetable soup, pasta, parmesan",ru:"Итальянский овощной суп с пастой и пармезаном"},
    kcal:140,p:6,f:4,c:20, price:7, fresh:false,
    diet:{vegan:false,gf:false,lf:false},
    img:IMG("photo-1584269600464-37b1b58a9fe9"), portions:16 },
  // ── Mains ──────────────────────────────────────────────────────
  { id:12, cat:"main",
    name:{en:"Chicken in cream sauce",pt:"Frango em natas",es:"Pollo en salsa de nata",fr:"Poulet à la crème",uk:"Куряче філе в соусі",ru:"Куриное филе в соусе"},
    desc:{en:"Chicken breast, cream sauce, Provençal herbs",ru:"Куриное филе, сливочный соус, прованские травы"},
    kcal:980,p:52,f:38,c:86, price:11, fresh:false,
    diet:{vegan:false,gf:true,lf:false},
    garnishes:{en:["Rice","Buckwheat","Mash"],pt:["Arroz","Trigo sarraceno","Puré"],es:["Arroz","Alforfón","Puré"],fr:["Riz","Sarrasin","Purée"],uk:["Рис","Гречка","Пюре"],ru:["Рис","Гречка","Пюре"]},
    img:IMG("photo-1604908176997-125f25cc6f3d"), portions:20 },
  { id:13, cat:"main",
    name:{en:"Braised beef",pt:"Vaca estufada",es:"Ternera estofada",fr:"Bœuf braisé",uk:"Яловичина тушкована",ru:"Говядина тушёная"},
    desc:{en:"Slow-braised beef, vegetables, tomato sauce",ru:"Тушёная говядина с овощами в томатном соусе"},
    kcal:1050,p:55,f:48,c:88, price:12, fresh:false,
    diet:{vegan:false,gf:true,lf:true},
    garnishes:{en:["Rice","Buckwheat","Mash","Pasta"],pt:["Arroz","Trigo sarraceno","Puré","Massa"],es:["Arroz","Alforfón","Puré","Pasta"],fr:["Riz","Sarrasin","Purée","Pâtes"],uk:["Рис","Гречка","Пюре","Паста"],ru:["Рис","Гречка","Пюре","Паста"]},
    img:IMG("photo-1476718406336-bb5a9690ee2a"), portions:16 },
  { id:14, cat:"main",
    name:{en:"Caesar salad",pt:"Salada César",es:"Ensalada César",fr:"Salade César",uk:"Салат Цезар",ru:"Салат Цезарь"},
    desc:{en:"Romaine, grilled chicken, croutons, Caesar dressing",ru:"Ромэн, курица гриль, крутоны, соус"},
    kcal:310,p:24,f:18,c:14, price:10, fresh:true,
    diet:{vegan:false,gf:false,lf:false},
    garnishes:{en:[],pt:[],es:[],fr:[],uk:[],ru:[]},
    img:IMG("photo-1546793665-c74683f339c1"), portions:12 },
  { id:15, cat:"main",
    name:{en:"Grilled salmon",pt:"Salmão grelhado",es:"Salmón a la plancha",fr:"Saumon grillé",uk:"Лосось на грилі",ru:"Лосось на гриле"},
    desc:{en:"Salmon steak, lemon, capers, green butter",ru:"Стейк лосося, лимон, каперсы, зелёное масло"},
    kcal:1020,p:58,f:42,c:80, price:13, fresh:false,
    diet:{vegan:false,gf:true,lf:true},
    garnishes:{en:["Rice","Grilled veg","Mash"],pt:["Arroz","Legumes grelhados","Puré"],es:["Arroz","Verduras","Puré"],fr:["Riz","Légumes grillés","Purée"],uk:["Рис","Овочі гриль","Пюре"],ru:["Рис","Овощи гриль","Пюре"]},
    img:IMG("photo-1467003909585-2f8a72700288"), portions:14 },
  { id:16, cat:"main",
    name:{en:"Pasta carbonara",pt:"Massa carbonara",es:"Pasta carbonara",fr:"Pâtes carbonara",uk:"Паста карбонара",ru:"Паста карбонара"},
    desc:{en:"Spaghetti, guanciale, Pecorino, egg yolk",ru:"Спагетти, гуанчале, Пекорино, яичный желток"},
    kcal:460,p:20,f:20,c:52, price:11, fresh:false,
    diet:{vegan:false,gf:false,lf:false},
    garnishes:{en:[],pt:[],es:[],fr:[],uk:[],ru:[]},
    img:IMG("photo-1612874742237-6526221588e3"), portions:18 },
  { id:17, cat:"main",
    name:{en:"Meatballs in tomato",pt:"Almôndegas em tomate",es:"Albóndigas en tomate",fr:"Boulettes sauce tomate",uk:"Тефтелі в томаті",ru:"Тефтели в томате"},
    desc:{en:"Beef meatballs, tomato sauce",ru:"Говяжьи тефтели, томатный соус"},
    kcal:960,p:42,f:38,c:90, price:11, fresh:false,
    diet:{vegan:false,gf:false,lf:true},
    garnishes:{en:["Rice","Mash","Buckwheat"],pt:["Arroz","Puré","Trigo sarraceno"],es:["Arroz","Puré","Alforfón"],fr:["Riz","Purée","Sarrasin"],uk:["Рис","Пюре","Гречка"],ru:["Рис","Пюре","Гречка"]},
    img:IMG("photo-1529042410759-befb1204b468"), portions:20 },
  // ── Specials ───────────────────────────────────────────────────
  { id:101, cat:"special",
    name:{en:"Salmon & Asparagus Quiche",pt:"Quiche de salmão e espargos",es:"Quiche de salmón y espárragos",fr:"Quiche saumon & asperges",uk:"Кіш з лососем і спаржею",ru:"Киш с лососем и спаржей"},
    desc:{en:"Butter pastry, salmon, asparagus, crème fraîche",ru:"Слоёное тесто, лосось, спаржа, крем-фреш"},
    kcal:680,p:34,f:42,c:42, price:13, fresh:false,
    diet:{vegan:false,gf:false,lf:false},
    img:IMG("photo-1565299507177-0e6f8d2e17e6"), portions:12 },
  { id:102, cat:"special",
    name:{en:"Chili con Carne Soup",pt:"Sopa chili con carne",es:"Sopa chili con carne",fr:"Soupe chili con carne",uk:"Суп Чілі кон карне",ru:"Суп Чили кон карне"},
    desc:{en:"Beef, kidney beans, tomato, jalapeño, spices",ru:"Говядина, фасоль, томат, халапеньо, специи"},
    kcal:310,p:22,f:12,c:28, price:9, fresh:false,
    diet:{vegan:false,gf:true,lf:true},
    img:IMG("photo-1455619452474-d73d3d1ef19f"), portions:15 },
  { id:103, cat:"special",
    name:{en:"Salmon Wellington",pt:"Wellington de salmão",es:"Wellington de salmón",fr:"Wellington au saumon",uk:"Веллінгтон з лососем",ru:"Веллингтон с лососем"},
    desc:{en:"Puff pastry, salmon, spinach, cream cheese",ru:"Слоёное тесто, лосось, шпинат, сливочный сыр"},
    kcal:820,p:46,f:44,c:58, price:14, fresh:false,
    diet:{vegan:false,gf:false,lf:false},
    img:IMG("photo-1544025162-d76538d80e30"), portions:10 },
  { id:104, cat:"special",
    name:{en:"Blinis with pâté & pickles",pt:"Blinis com paté e picles",es:"Blinis con paté y pepinillos",fr:"Blinis au pâté et cornichons",uk:"Млинці з паштетом",ru:"Блинчики с паштетом"},
    desc:{en:"Thin crêpes, liver pâté, mini pickles, herbs",ru:"Тонкие блинчики, паштет из печени, огурцы"},
    kcal:420,p:18,f:22,c:38, price:7, fresh:true,
    diet:{vegan:false,gf:false,lf:false},
    img:IMG("photo-1519864600265-abb23847ef2a"), portions:8 },
];

const CATEGORIES = ["breakfast","soup","main","special"];

// Delivery: Mon=1, Wed=3, Fri=5
const DELIVERY_DAYS = new Set([1,3,5]);
const MON_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DELIVERY_FEE = 5, FREE_THRESHOLD = 50;

// Delivery BLOCKS:
//  Block 0 (Mon delivery): Mon lunch → Tue dinner + Wed breakfast
//  Block 1 (Wed delivery): Wed lunch → Thu dinner + Fri breakfast
//  Block 2 (Fri delivery): Fri lunch → Sat dinner + Sun breakfast
// For slot-level tracking, a day's "ownerBlock" is determined by:
//   - delivery days: new block starts at LUNCH (breakfast = previous block)
//   - non-delivery days: same block as previous delivery
// For simplicity in the cost calc we assign the WHOLE delivery day to the new block,
// with the understanding that breakfast on delivery day can eat from either.
function dayToBlock(dow) {
  if(dow===1||dow===2) return 0;  // Mon, Tue  → Mon delivery
  if(dow===3||dow===4) return 1;  // Wed, Thu  → Wed delivery
  return 2;                        // Fri, Sat, Sun → Fri delivery
}

function buildDays(t) {
  const today = new Date(2026,2,6);
  const start = new Date(today); start.setDate(start.getDate()+1);
  while(!DELIVERY_DAYS.has(start.getDay())) start.setDate(start.getDate()+1);
  return Array.from({length:7},(_,i)=>{
    const d = new Date(start); d.setDate(start.getDate()+i);
    const dow = d.getDay();
    // freshOk: ONLY on the delivery day itself (arrives before noon → can be fresh for lunch/dinner)
    const isDelivery = DELIVERY_DAYS.has(dow);
    const freshOk = isDelivery;
    // Breakfast on a delivery day belongs to the PREVIOUS block —
    // delivery arrives before noon, so breakfast has already been eaten.
    const blockedSlots = isDelivery ? new Set(['breakfast']) : new Set();
    return { key:`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`,
      name:t.days[dow], num:d.getDate(), mon:MON_SHORT[d.getMonth()],
      isDelivery, freshOk, block:dayToBlock(dow), blockedSlots };
  });
}


// ── dietary helpers ──
function dietBlock(dish, userDiet) {
  if(userDiet.vegan && !dish.diet.vegan)    return "vegan";
  if(userDiet.noLactose && !dish.diet.lf)   return "lactose";
  if(userDiet.noGluten  && !dish.diet.gf)   return "gluten";
  return false;
}
const dn = (dish, lang) => (dish.name[lang]||dish.name.en);
const dg = (dish, lang) => (dish.garnishes ? (dish.garnishes[lang]||dish.garnishes.en||[]) : []);

/* ══════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#f5f2ed;--surf:#fff;--surf2:#eeebe5;--surf3:#e5e1da;
    --ink:#1c1a17;--ink2:#6b6459;--ink3:#a89f94;
    --g:#2a5c24;--gm:#3d7a35;--gl:#5a9e50;--gp:#e8f2e7;--gxp:#f2f8f1;
    --a:#b5711f;--al:#d4903a;--ap:#fdf0e0;
    --rose:#b84c3c;--rose-p:#fdf2f1;
    --bd:#e0dbd4;--bd2:#cbc5bd;
    --col:110px;--lbl:66px;--gap:4px;--r:10px;
  }
  body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--ink)}
  h1,h2,h3,h4{font-family:'Playfair Display',serif}
  button,input,select,textarea{font-family:'DM Sans',sans-serif}
  ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:10px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes glow{0%,100%{box-shadow:0 0 0 2px rgba(61,122,53,.15)}50%{box-shadow:0 0 0 5px rgba(61,122,53,.28)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pop{0%{transform:scale(.88)}60%{transform:scale(1.06)}100%{transform:scale(1)}}
  .fu{animation:fadeUp .36s cubic-bezier(.4,0,.2,1) both}
  .fi{animation:fadeIn .2s ease both}
  /* nav */
  .nav{height:56px;background:var(--surf);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:200}
  .navi{max-width:1480px;margin:0 auto;padding:0 14px;height:100%;display:flex;align-items:center;gap:6px}
  .logo{display:flex;align-items:center;gap:7px;cursor:pointer;flex-shrink:0}
  .logo-t{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--g)}
  .nt{padding:5px 11px;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;background:transparent;border:none;color:var(--ink2);transition:all .12s;white-space:nowrap}
  .nt:hover{background:var(--surf2);color:var(--ink)}.nt.on{background:var(--gp);color:var(--g);font-weight:600}
  .lang-btn{padding:4px 8px;border-radius:6px;border:1.5px solid var(--bd2);background:transparent;cursor:pointer;font-size:12px;font-weight:600;color:var(--ink2);display:flex;align-items:center;gap:3px}
  .lang-btn:hover{background:var(--surf2)}.lang-btn.on{border-color:var(--gm);color:var(--g);background:var(--gp)}
  /* buttons */
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:none;border-radius:var(--r);cursor:pointer;font-weight:600;transition:all .14s;white-space:nowrap;font-family:'DM Sans',sans-serif}
  .sm{padding:6px 12px;font-size:12px}.md{padding:9px 18px;font-size:13px}.lg{padding:12px 26px;font-size:14px}
  .bp{background:var(--g);color:#fff}.bp:hover{background:var(--gm);transform:translateY(-1px);box-shadow:0 4px 14px rgba(42,92,36,.25)}
  .ba{background:var(--a);color:#fff}.ba:hover{background:var(--al);transform:translateY(-1px);box-shadow:0 4px 14px rgba(181,113,31,.25)}
  .bg{background:transparent;color:var(--ink);border:1.5px solid var(--bd2)}.bg:hover{background:var(--surf2)}
  .inp{width:100%;padding:9px 12px;border:1.5px solid var(--bd);border-radius:var(--r);font-size:13px;background:var(--surf);color:var(--ink);outline:none;transition:border-color .14s}
  .inp:focus{border-color:var(--gm)}
  .ov{position:fixed;inset:0;background:rgba(28,26,23,.52);backdrop-filter:blur(6px);z-index:900;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s}
  .modal{background:var(--surf);border-radius:18px;padding:30px;width:400px;max-width:92vw;animation:fadeUp .24s;box-shadow:0 16px 52px rgba(0,0,0,.18);position:relative}
  .toast{position:fixed;bottom:16px;right:16px;z-index:999;max-width:300px;border-radius:11px;padding:10px 15px;font-size:13px;font-weight:500;box-shadow:0 4px 18px rgba(0,0,0,.16);animation:fadeUp .24s;line-height:1.5}
  .tok{background:#1a3517;color:#fff}.ter{background:#4a1a15;color:#fff}.twn{background:#3d2808;color:#fff}.tin{background:#0f2244;color:#fff}
  /* planner grid */
  .pg{display:grid;grid-template-columns:var(--lbl) repeat(7,var(--col));gap:var(--gap);width:max-content}
  .dh{width:var(--col);height:60px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
  .sll{width:var(--lbl);display:flex;flex-direction:column;align-items:flex-end;justify-content:center;padding-right:8px;flex-shrink:0}
  .ps{width:var(--col);height:90px;border-radius:var(--r);border:1.5px solid var(--bd);background:var(--surf);position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all .13s;overflow:hidden;flex-shrink:0}
  .ps.avl{border-color:var(--gm);background:var(--gxp);cursor:pointer;animation:glow 1.4s ease infinite}
  .ps.ovy{border-color:var(--gl);background:var(--gp);border-style:dashed}
  .ps.ovn{border-color:var(--rose);background:var(--rose-p);border-style:dashed}
  .ps.fld{border-color:#bddcbc;background:var(--gxp);justify-content:flex-start;padding:5px 4px 3px}
  .ps.blk{border-color:#e8cdc8;background:#fdf7f6}
  .bonus-cell{width:var(--col);min-height:56px;border-radius:var(--r);border:1.5px dashed var(--bd);background:var(--surf);display:flex;flex-direction:column;gap:2px;padding:3px;transition:all .13s;flex-shrink:0}
  .bonus-cell.avl{border-color:var(--gm);background:var(--gxp);animation:glow 1.3s ease infinite;cursor:pointer}
  .bonus-cell.ovy{border-color:var(--gl);background:var(--gp)}
  .bonus-chip{border-radius:6px;background:var(--gp);border:1px solid #bddcbc;padding:2px 5px;font-size:9px;font-weight:600;color:var(--g);display:flex;align-items:center;gap:3px}
  .kc{width:var(--col);border-radius:var(--r);border:1.5px solid var(--bd);background:var(--surf);padding:6px 4px;text-align:center;flex-shrink:0}
  .kb{height:4px;border-radius:4px;background:var(--surf3);overflow:hidden;margin:2px 1px}
  .kbf{height:100%;border-radius:4px;transition:width .5s}
  .dlv{width:var(--col);border-radius:var(--r);border:1.5px solid var(--bd);background:var(--surf);padding:5px 4px;text-align:center;flex-shrink:0;font-size:9px}
  /* dish thumb in sidebar */
  .dt{border-radius:var(--r);border:1.5px solid var(--bd);background:var(--surf);cursor:pointer;transition:all .15s;user-select:none;position:relative;overflow:hidden}
  .dt:hover:not(.grayed){border-color:var(--bd2);box-shadow:0 2px 8px rgba(0,0,0,.06)}
  .dt.sel{border-color:var(--gm);animation:glow 1.3s ease infinite}
  .dt.grayed{opacity:.42;cursor:not-allowed;filter:grayscale(.5)}
  /* diet badges */
  .dbadge{display:inline-flex;align-items:center;gap:2px;padding:2px 6px;border-radius:20px;font-size:9px;font-weight:700}
  .dv{background:#e8f5e9;color:#2e7d32}.dgf{background:#e3f2fd;color:#1565c0}.dlf{background:#fce4ec;color:#c62828}
  .dhg{background:#fff3e0;color:#e65100}.dhl{background:#fce4ec;color:#880e4f}
  /* menu cards */
  .mc{background:var(--surf);border-radius:13px;border:1.5px solid var(--bd);overflow:hidden;transition:all .16s}
  .mc:hover{box-shadow:0 7px 24px rgba(0,0,0,.08);transform:translateY(-2px)}
  /* hero */
  .hero{background:linear-gradient(148deg,#192b16 0%,#2a5c24 48%,#3d7a35 100%);min-height:84vh;display:flex;align-items:center;position:relative;overflow:hidden}
  .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 13% 87%,rgba(90,158,80,.2),transparent 50%),radial-gradient(ellipse at 87% 13%,rgba(212,144,58,.1),transparent 48%)}
  .ct{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid var(--bd);background:var(--surf);color:var(--ink2);transition:all .12s}
  .ct.on{background:var(--gp);color:var(--g);border-color:var(--gp);font-weight:600}
  .ct:not(.on):hover{border-color:var(--bd2);background:var(--surf2)}
  .pay-opt{border:1.5px solid var(--bd);border-radius:var(--r);padding:10px 13px;cursor:pointer;transition:all .13s;display:flex;align-items:center;gap:9px;font-size:13px}
  .pay-opt:hover{border-color:var(--bd2);background:var(--surf2)}.pay-opt.sel{border-color:var(--gm);background:var(--gxp)}
  .office-cell{width:var(--col);min-height:40px;border-radius:8px;border:1.5px dashed var(--bd);background:var(--surf);padding:3px;display:flex;flex-direction:column;gap:2px;flex-shrink:0;transition:all .12s}
  .office-cell.avl{border-color:var(--gm);background:var(--gxp);animation:glow 1.3s ease infinite;cursor:pointer}
  .office-cell.ovy{border-color:var(--gl);background:var(--gp)}
  /* ── MOBILE ── */
  @media(max-width:700px){
    .nav{display:none}
    .mob-nav{display:flex}
    footer{padding-bottom:80px}
    .hero{min-height:auto;padding:0}
    .mc:hover{transform:none}
  }
  @media(min-width:701px){.mob-nav{display:none !important}}
  .mob-nav{
    position:fixed;bottom:0;left:0;right:0;height:62px;
    background:var(--surf);border-top:1px solid var(--bd);
    z-index:500;align-items:stretch;justify-content:space-around;
    padding:0 4px;padding-bottom:env(safe-area-inset-bottom,0px);
  }
  .mnb{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
    background:transparent;border:none;cursor:pointer;padding:6px 2px;font-family:'DM Sans',sans-serif;
    font-size:10px;color:var(--ink3);font-weight:500;transition:color .12s}
  .mnb.on{color:var(--g);font-weight:700}
  .mnb .mi{font-size:21px;line-height:1}
  /* mobile planner */
  .day-strip{display:flex;gap:6px;padding:10px 14px;overflow-x:auto;background:var(--surf);
    border-bottom:1px solid var(--bd);scrollbar-width:none}
  .day-strip::-webkit-scrollbar{display:none}
  .dpill{flex-shrink:0;border-radius:22px;padding:6px 12px;border:1.5px solid var(--bd);
    background:var(--surf);cursor:pointer;text-align:center;transition:all .13s;min-width:54px}
  .dpill.on{background:linear-gradient(160deg,#192b16,#2a5c24);border-color:transparent;color:white}
  .dpill.del{border-color:var(--gm)}
  .dpill.has{background:var(--gxp);border-color:var(--gm)}
  .mslot{border-radius:14px;border:1.5px solid var(--bd);background:var(--surf);overflow:hidden;
    display:flex;align-items:stretch;min-height:68px;transition:all .13s;cursor:pointer}
  .mslot.avl{border-color:var(--gm);background:var(--gxp);animation:glow 1.5s ease infinite}
  .mslot.fld{border-color:#bddcbc;background:var(--gxp)}
  .mslot.blk{border-color:#e8cdc8;opacity:.6}
  .mdish-row{display:flex;gap:8px;overflow-x:auto;padding:8px 14px;scrollbar-width:none}
  .mdish-row::-webkit-scrollbar{display:none}
  .mdish-card{flex-shrink:0;width:130px;border-radius:11px;border:1.5px solid var(--bd);
    background:var(--surf);overflow:hidden;cursor:pointer;transition:all .13s}
  .mdish-card.sel{border-color:var(--gm);box-shadow:0 0 0 3px rgba(61,122,53,.2)}
  .mdish-card.grayed{opacity:.4;pointer-events:none}
`;


/* ══════════════════════════════════════════════════════
   DIETARY BADGE COMPONENT
══════════════════════════════════════════════════════ */
function DietBadges({ dish, userDiet, t }) {
  const badges = [];
  if(dish.diet.vegan)  badges.push(<span key="v"  className="dbadge dv"> 🌱 {t.tag_vegan}</span>);
  if(dish.diet.gf)     badges.push(<span key="gf" className="dbadge dgf">🌾 {t.tag_gf}</span>);
  if(dish.diet.lf)     badges.push(<span key="lf" className="dbadge dlf">🥛 {t.tag_lf}</span>);
  if(!dish.diet.gf)    badges.push(<span key="hg" className="dbadge dhg">🌾 {t.tag_has_gluten}</span>);
  if(!dish.diet.lf && !dish.diet.vegan) badges.push(<span key="hl" className="dbadge dhl">🥛 {t.tag_has_lactose}</span>);
  return <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>{badges}</div>;
}

/* ══════════════════════════════════════════════════════
   SIDEBAR DISH CARD (with expand on click)
══════════════════════════════════════════════════════ */
function SidebarDish({ dish, selected, userDiet, inventory, t, lang, onSelect, onDragStart, onDragEnd }) {
  const blocked  = dietBlock(dish, userDiet);
  const portLeft = (inventory[dish.id] || 0);
  const soldOut  = portLeft <= 0;
  const grayed   = !!blocked || soldOut;
  const isSel    = selected?.id === dish.id;

  return (
    <div className={`dt${isSel?" sel":""}${grayed?" grayed":""}`}
      draggable={!grayed}
      onClick={() => !grayed && onSelect(dish)}
      onDragStart={e=>{if(grayed)return;e.dataTransfer.effectAllowed="copy";onDragStart(dish);}}
      onDragEnd={onDragEnd}
    >
      {/* Image shown when selected */}
      {isSel && (
        <div style={{position:"relative",overflow:"hidden",height:80}}>
          <img src={dish.img} alt={dn(dish,lang)} style={{width:"100%",height:80,objectFit:"cover",display:"block"}}
            onError={e=>{e.target.parentElement.style.display="none";}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.35))"}}/>
          <span style={{position:"absolute",bottom:4,right:5,fontSize:10,color:"white",fontWeight:700}}>{dish.price}€</span>
          {dish.fresh&&<span style={{position:"absolute",top:4,left:4,background:"rgba(181,113,31,.9)",color:"white",fontSize:8,fontWeight:700,borderRadius:20,padding:"1px 6px"}}>⚡ fresh</span>}
        </div>
      )}

      <div style={{padding: isSel?"8px 9px":"8px 9px"}}>
        {/* Compact row (always visible) */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {!isSel && <span style={{fontSize:20,lineHeight:1,flexShrink:0}}>{dish.emoji||"🍽️"}</span>}
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,fontWeight:isSel?700:600,color:grayed?"var(--ink3)":"var(--ink)",lineHeight:1.3,marginBottom:1}}>
              {dn(dish,lang)}
            </div>
            {!isSel && (
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10}}>
                <span style={{color:"var(--a)",fontWeight:600}}>{dish.kcal} kcal</span>
                <span style={{color:"var(--g)",fontWeight:600}}>{dish.price}€</span>
              </div>
            )}
          </div>
          {isSel && <span style={{fontSize:11,color:"var(--g)",fontWeight:700,flexShrink:0}}>✓</span>}
        </div>

        {/* Expanded content */}
        {isSel && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",background:"var(--surf2)",borderRadius:7,padding:"5px 6px",margin:"6px 0",gap:1}}>
            {[["Kcal",dish.kcal,"var(--a)"],["P",`${dish.p}g`,"#3b82f6"],["F",`${dish.f}g`,"var(--a)"],["C",`${dish.c}g`,"var(--gm)"]].map(([l,v,c])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontWeight:700,fontSize:11,color:c}}>{v}</div>
                <div style={{fontSize:8,color:"var(--ink3)"}}>{l}</div>
              </div>
            ))}
          </div>
          <DietBadges dish={dish} userDiet={userDiet} t={t}/>
          {dg(dish,lang).length>0 && <div style={{fontSize:9,color:"var(--ink2)",marginTop:4}}>🍚 {dg(dish,lang).join(" · ")}</div>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
            <span style={{fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:700,color:"var(--g)"}}>{dish.price}€</span>
            <span style={{fontSize:9,color:portLeft>5?"var(--g)":portLeft>0?"var(--a)":"var(--rose)",fontWeight:700}}>
              {soldOut ? t.sold_out : `${portLeft} ${t.portions_left}`}
            </span>
          </div>
          {blocked && <div style={{marginTop:4,fontSize:9,color:"var(--rose)",fontWeight:700}}>🚫 {t["blocked_"+blocked]}</div>}
          <div style={{marginTop:5,fontSize:9,color:"var(--g)",textAlign:"center",background:"var(--gp)",borderRadius:7,padding:"3px 0",fontWeight:600}}>
            Tap a cell to place →
          </div>
        </>}

        {/* Sold out / blocked badge (compact, not selected) */}
        {!isSel && (soldOut || blocked) && (
          <div style={{fontSize:8,color:soldOut?"var(--rose)":"var(--a)",fontWeight:700,marginTop:2}}>
            {soldOut ? t.sold_out : `🚫 ${t["blocked_"+blocked]}`}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PLANNER SLOT
══════════════════════════════════════════════════════ */
function PSlot({ entry, slotKey, dayKey, day, selected, dragging, onPlace, onDrop, onRemove, onGarnish, lang }) {
  const [over, setOver] = useState(false);
  const slotBlocked = day.blockedSlots?.has(slotKey);
  const freshBlock = d => d?.fresh && !day.freshOk;
  const isAvail   = !slotBlocked && selected && !entry && !freshBlock(selected);
  const isBlocked = !slotBlocked && selected && !entry && freshBlock(selected);
  const overOk    = over && dragging && !freshBlock(dragging) && !slotBlocked;
  const overNo    = over && dragging && (freshBlock(dragging) || slotBlocked);
  const cls = ["ps",isAvail?"avl":"",isBlocked?"blk":"",entry?"fld":"",overOk?"ovy":"",overNo?"ovn":""].join(" ");

  if(slotBlocked) return (
    <div className="ps blk" style={{cursor:"default",opacity:.35}}>
      <div style={{fontSize:11,opacity:.5}}>—</div>
      <div style={{fontSize:8,color:"var(--rose)",textAlign:"center",lineHeight:1.3,padding:"0 3px"}}>prev<br/>delivery</div>
    </div>
  );
  return (
    <div className={cls} style={{cursor:isAvail?"pointer":"default"}}
      onClick={()=>isAvail&&onPlace(dayKey,slotKey)}
      onDragOver={e=>{e.preventDefault();setOver(true);}} onDragLeave={()=>setOver(false)}
      onDrop={()=>{setOver(false);if(!freshBlock(dragging))onDrop(dayKey,slotKey);}}>
      {entry?<>
        <button onClick={e=>{e.stopPropagation();onRemove(dayKey,slotKey);}} style={{position:"absolute",top:3,right:3,width:14,height:14,background:"var(--rose)",color:"white",border:"none",borderRadius:"50%",cursor:"pointer",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>×</button>
        <img src={entry.dish.img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.18,pointerEvents:"none"}}
          onError={e=>e.target.style.display="none"}/>
        <div style={{fontSize:20,lineHeight:1,marginBottom:2,position:"relative",zIndex:1}}>{entry.dish.emoji||"🍽️"}</div>
        <div style={{fontSize:8.5,fontWeight:600,color:"var(--g)",textAlign:"center",lineHeight:1.25,padding:"0 3px",width:"100%",position:"relative",zIndex:1}}>
          {dn(entry.dish,lang).slice(0,18)}{dn(entry.dish,lang).length>18?"…":""}
        </div>
        {dg(entry.dish,lang).length>0&&(
          <select value={entry.garnish||""} onChange={e=>onGarnish(dayKey,slotKey,e.target.value)}
            onClick={e=>e.stopPropagation()}
            style={{fontSize:8,marginTop:2,border:"1px solid var(--bd)",borderRadius:5,padding:"1px 3px",background:"rgba(255,255,255,.9)",maxWidth:"calc(100% - 4px)",cursor:"pointer",position:"relative",zIndex:1}}>
            {dg(entry.dish,lang).map(g=><option key={g}>{g}</option>)}
          </select>
        )}
        <div style={{fontSize:8,color:"var(--a)",fontWeight:700,marginTop:1,position:"relative",zIndex:1}}>{entry.dish.price}€</div>
      </>:isAvail?<>
        <div style={{fontSize:14,opacity:.3}}>✦</div>
        <div style={{fontSize:9,color:"var(--g)",fontWeight:600}}>here</div>
      </>:isBlocked?<>
        <div style={{fontSize:10,opacity:.25}}>🚫</div>
        <div style={{fontSize:8,color:"var(--rose)",textAlign:"center",padding:"0 2px",lineHeight:1.3}}>fresh<br/>only</div>
      </>:<div style={{fontSize:14,opacity:.1}}>+</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   BONUS CELL  (multi-dish, any category)
══════════════════════════════════════════════════════ */
function BonusCell({ items, dayKey, selected, dragging, onPlace, onDrop, onRemove, lang, t }) {
  const [over, setOver] = useState(false);
  const isAvail = !!selected && !selected.fresh;
  const cls = ["bonus-cell", isAvail?"avl":"", over&&dragging?"ovy":""].join(" ");
  return (
    <div className={cls}
      onClick={() => isAvail && onPlace(dayKey, "bonus")}
      onDragOver={e=>{e.preventDefault();setOver(true);}} onDragLeave={()=>setOver(false)}
      onDrop={()=>{setOver(false);if(dragging&&!dragging.fresh)onDrop(dayKey,"bonus");}}>
      {items.length===0 && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",flex:1,opacity:.35,padding:"4px 0"}}>
          <span style={{fontSize:11,color:"var(--a)",fontWeight:700}}>★ {t.slot_bonus}</span>
        </div>
      )}
      {items.map((entry,i)=>(
        <div key={i} className="bonus-chip">
          <span style={{fontSize:12}}>{entry.dish.emoji||"🍽️"}</span>
          <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dn(entry.dish,lang).slice(0,14)}</span>
          <span style={{color:"var(--a)",flexShrink:0}}>{entry.dish.price}€</span>
          <button onClick={e=>{e.stopPropagation();onRemove(dayKey,i);}} style={{width:12,height:12,background:"var(--rose)",color:"white",border:"none",borderRadius:"50%",cursor:"pointer",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
        </div>
      ))}
      {isAvail && <div style={{fontSize:9,color:"var(--g)",textAlign:"center",fontWeight:600}}>+ tap here</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   OFFICE CELL
══════════════════════════════════════════════════════ */
function OfficeCell({ items, dayKey, selected, dragging, onAdd, onDrop, onRemove, lang, t }) {
  const [over, setOver] = useState(false);
  const isAvail = !!selected;
  return (
    <div className={`office-cell${isAvail?" avl":""}${over&&dragging?" ovy":""}`}
      style={{minHeight:Math.max(44,items.length*28+14)}}
      onClick={()=>isAvail&&onAdd(dayKey)}
      onDragOver={e=>{e.preventDefault();setOver(true);}} onDragLeave={()=>setOver(false)}
      onDrop={()=>{setOver(false);if(dragging)onDrop(dayKey);}}>
      {items.map((e,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:3,background:"var(--gp)",borderRadius:6,padding:"2px 5px",border:"1px solid #bddcbc"}}>
          <span style={{fontSize:13}}>{e.dish.emoji||"🍽️"}</span>
          <span style={{fontSize:9,fontWeight:600,color:"var(--g)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dn(e.dish,lang)}</span>
          <span style={{fontSize:9,color:"var(--a)",fontWeight:700,flexShrink:0}}>{e.dish.price}€</span>
          <button onClick={ev=>{ev.stopPropagation();onRemove(dayKey,i);}} style={{width:12,height:12,background:"var(--rose)",color:"white",border:"none",borderRadius:"50%",cursor:"pointer",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
        </div>
      ))}
      {items.length===0&&<div style={{fontSize:9,color:"var(--ink3)",textAlign:"center",padding:"5px 0"}}>{t.office_hint}</div>}
      {isAvail&&<div style={{fontSize:9,color:"var(--g)",textAlign:"center",fontWeight:600}}>+ tap here</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   AUTH MODAL
══════════════════════════════════════════════════════ */
function AuthModal({ mode, onClose, onAuth, t }) {
  const [tab,setTab]=useState(mode);
  const [f,setF]=useState({name:"",email:"",phone:"",password:""});
  const [loading,setL]=useState(false);
  const go=()=>{if(!f.email||!f.password)return;setL(true);setTimeout(()=>{onAuth({name:f.name||f.email.split("@")[0],email:f.email});setL(false);},700);};
  return (
    <div className="ov" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:13,right:14,background:"none",border:"none",fontSize:18,cursor:"pointer",color:"var(--ink2)"}}>✕</button>
        <h3 style={{fontSize:22,marginBottom:16}}>{tab==="login"?t.login:t.register}</h3>
        <div style={{display:"flex",gap:3,background:"var(--surf2)",borderRadius:9,padding:3,marginBottom:18}}>
          {[["login",t.login],["register",t.register]].map(([v,l])=>(
            <button key={v} onClick={()=>setTab(v)} className="btn sm" style={{flex:1,border:"none",borderRadius:7,background:tab===v?"var(--surf)":"transparent",color:tab===v?"var(--g)":"var(--ink2)",fontWeight:tab===v?600:400,boxShadow:tab===v?"0 1px 4px rgba(0,0,0,.07)":"none"}}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {tab==="register"&&<input className="inp" placeholder={t.auth_name} value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/>}
          <input className="inp" type="email" placeholder={t.auth_email} value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))}/>
          {tab==="register"&&<input className="inp" type="tel" placeholder={t.auth_phone} value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))}/>}
          <input className="inp" type="password" placeholder={t.auth_pwd} value={f.password} onChange={e=>setF(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>
        <button className="btn bp md" style={{width:"100%",marginTop:14,height:40}} onClick={go}>
          {loading?<span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/>:tab==="login"?t.login+" →":t.register+" →"}
        </button>
        {tab==="login"&&<p style={{textAlign:"center",marginTop:11,fontSize:12,color:"var(--ink3)"}}>{t.auth_no_acc} <span style={{color:"var(--g)",cursor:"pointer",fontWeight:600}} onClick={()=>setTab("register")}>{t.auth_create}</span></p>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PROFILE MODAL (dietary prefs)
══════════════════════════════════════════════════════ */
function ProfileModal({ user, userDiet, onSave, onClose, t }) {
  const [d, setD] = useState({...userDiet});
  return (
    <div className="ov" onClick={onClose}>
      <div className="modal" style={{width:380}} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:13,right:14,background:"none",border:"none",fontSize:18,cursor:"pointer",color:"var(--ink2)"}}>✕</button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{width:40,height:40,background:"var(--g)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:18,fontWeight:700}}>{user.name[0].toUpperCase()}</div>
          <div><div style={{fontFamily:"Playfair Display,serif",fontSize:18,fontWeight:700}}>{user.name}</div><div style={{fontSize:12,color:"var(--ink3)"}}>{user.email}</div></div>
        </div>
        <div style={{fontWeight:600,fontSize:13,marginBottom:12,color:"var(--ink2)"}}>{t.diet_title}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {[["noLactose","🥛",t.diet_lactose,"Hides dishes with dairy"],
            ["noGluten", "🌾",t.diet_gluten, "Hides dishes with gluten"],
            ["vegan",    "🌱",t.diet_vegan,  "Shows only vegan dishes"]].map(([key,ico,lbl,sub])=>(
            <label key={key} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 13px",borderRadius:var_r,border:`1.5px solid ${d[key]?"var(--gm)":"var(--bd)"}`,background:d[key]?"var(--gxp)":"var(--surf)",cursor:"pointer",transition:"all .14s"}}>
              <span style={{fontSize:22}}>{ico}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{lbl}</div>
                <div style={{fontSize:11,color:"var(--ink3)"}}>{sub}</div>
              </div>
              <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${d[key]?"var(--gm)":"var(--bd2)"}`,background:d[key]?"var(--gm)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .14s"}}>
                {d[key]&&<span style={{color:"white",fontSize:13,fontWeight:900}}>✓</span>}
              </div>
              <input type="checkbox" checked={d[key]} onChange={e=>setD(p=>({...p,[key]:e.target.checked}))} style={{display:"none"}}/>
            </label>
          ))}
        </div>
        <button className="btn bp md" style={{width:"100%"}} onClick={()=>onSave(d)}>Save preferences →</button>
      </div>
    </div>
  );
}
const var_r = "var(--r)";

/* ══════════════════════════════════════════════════════
   CHECKOUT
══════════════════════════════════════════════════════ */
function Checkout({ cart, onClose, t }) {
  const [step,setStep]=useState(1);
  const [addr,setAddr]=useState({street:"",apt:"",time:"10:00–13:00"});
  const [pay,setPay]=useState("mbway");
  const subtotal=cart.reduce((s,c)=>s+c.total,0);
  const delivery=subtotal>=FREE_THRESHOLD?0:DELIVERY_FEE;
  const total=subtotal+delivery;
  const dishes=cart.reduce((s,c)=>s+c.dishCount,0);
  const opts=[{k:"mbway",ico:"📱",l:t.co_mbway},{k:"cash",ico:"💵",l:t.co_cash},{k:"usdt",ico:"₿",l:t.co_usdt}];
  return (
    <div className="ov" onClick={step===1?onClose:undefined}>
      <div className="modal" style={{width:450,maxHeight:"92vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        {step===1?<>
          <h3 style={{fontSize:22,marginBottom:4}}>{t.co_title}</h3>
          <p style={{color:"var(--ink2)",fontSize:13,marginBottom:14}}>{t.co_sub}</p>
          <div style={{background:"var(--gxp)",borderRadius:10,padding:"10px 14px",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,color:"var(--ink2)"}}><span>{dishes} dishes · {cart.length} person(s)</span><span style={{color:delivery===0?"var(--g)":"var(--ink)",fontWeight:600}}>{delivery===0?t.free_delivery:`${t.co_delivery}: ${DELIVERY_FEE}€`}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:7,borderTop:"1px solid var(--bd)",alignItems:"center"}}>
              <span style={{fontWeight:600,fontSize:13}}>{t.co_total}</span>
              <span style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:700,color:"var(--g)"}}>{total.toFixed(2)}€</span>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:13}}>
            <input className="inp" placeholder={t.co_street} value={addr.street} onChange={e=>setAddr(p=>({...p,street:e.target.value}))}/>
            <input className="inp" placeholder={t.co_apt} value={addr.apt} onChange={e=>setAddr(p=>({...p,apt:e.target.value}))}/>
            <select className="inp" value={addr.time} onChange={e=>setAddr(p=>({...p,time:e.target.value}))}>
              <option>08:00–11:00</option><option>10:00–13:00</option><option>11:00–14:00</option>
            </select>
          </div>
          <div style={{marginBottom:13}}>
            <div style={{fontSize:12,fontWeight:600,color:"var(--ink2)",marginBottom:7}}>{t.co_pay}</div>
            {opts.map(o=>(
              <div key={o.k} className={`pay-opt${pay===o.k?" sel":""}`} style={{marginBottom:6}} onClick={()=>setPay(o.k)}>
                <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid",borderColor:pay===o.k?"var(--gm)":"var(--bd2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {pay===o.k&&<div style={{width:9,height:9,borderRadius:"50%",background:"var(--gm)"}}/>}
                </div>
                <span style={{fontSize:15}}>{o.ico}</span><span style={{fontWeight:500}}>{o.l}</span>
                {o.k==="usdt"&&<span style={{marginLeft:"auto",fontSize:10,color:"var(--ink3)"}}>TRC-20</span>}
              </div>
            ))}
          </div>
          {pay==="mbway"&&<div style={{background:"var(--ap)",borderRadius:8,padding:"7px 11px",marginBottom:12,fontSize:12,color:"var(--a)"}}>📱 MBway: <strong>+351 912 345 678</strong></div>}
          {pay==="usdt"&&<div style={{background:"#f0f9ff",borderRadius:8,padding:"7px 11px",marginBottom:12,fontSize:11,color:"#0369a1",wordBreak:"break-all"}}>₿ TRC-20: <strong>TJj2zKqr9Lm7Xp4wYvNs8Bq1CdFgHiKoP</strong></div>}
          <button className="btn bp md" style={{width:"100%",height:42}} onClick={()=>setStep(2)}>{t.co_btn} {total.toFixed(2)}€ →</button>
          <p style={{textAlign:"center",fontSize:11,color:"var(--ink3)",marginTop:7}}>{t.co_note}</p>
        </>:<>
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:54,marginBottom:12,animation:"pop .3s"}}>🎉</div>
            <h3 style={{fontSize:24,marginBottom:6}}>{t.co_ok_h}</h3>
            <p style={{color:"var(--ink2)",fontSize:13,lineHeight:1.7,marginBottom:14,whiteSpace:"pre-line"}}>{t.co_ok_sub}</p>
            <div style={{background:"var(--gxp)",borderRadius:10,padding:"10px 12px",display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
              <span style={{fontSize:22}}>📱</span>
              <div style={{textAlign:"left",fontSize:12}}><div style={{fontWeight:600,color:"var(--g)"}}>{t.co_tg}</div></div>
            </div>
            <button className="btn bp md" style={{width:"100%"}} onClick={onClose}>OK</button>
          </div>
        </>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PLANNER PAGE
══════════════════════════════════════════════════════ */
function PlannerPage({ showToast, onCheckout, t, lang, userDiet }) {
  const days = buildDays(t);

  // Inventory: portions remaining (simulates Google Sheets data)
  // In production this would come from Sheets API
  const [inventory, setInventory] = useState(() =>
    Object.fromEntries(ALL_DISHES.map(d=>[d.id, d.portions]))
  );

  const [plan, setPlan]           = useState({});
  const [officePlan, setOPlan]    = useState({});
  const [cart, setCart]           = useState([]);
  const [gender, setGender]       = useState("female");
  const [activeCat, setActiveCat] = useState("breakfast");
  const [selected, setSelected]   = useState(null);
  const [dragging, setDragging]   = useState(null);
  const [comment, setComment]     = useState("");
  const [officeMode, setOfficeMode] = useState(false);

  // Use refs to avoid stale closures in event handlers
  const selectedRef = useRef(null);
  const draggingRef = useRef(null);
  useEffect(()=>{selectedRef.current=selected;},[selected]);
  useEffect(()=>{draggingRef.current=dragging;},[dragging]);

  const catItems = ALL_DISHES.filter(d=>d.cat===activeCat);
  const target   = officeMode ? 0 : (gender==="female"?2000:2500);

  // Compute used portions from current plan
  const usedPortions = useCallback(() => {
    const used = {};
    const countDish = (dish) => { used[dish.id] = (used[dish.id]||0)+1; };
    Object.values(plan).forEach(day => {
      Object.entries(day||{}).forEach(([sk,e]) => {
        if(sk==="bonus") (e||[]).forEach(b=>countDish(b.dish));
        else if(e?.dish) countDish(e.dish);
      });
    });
    Object.values(officePlan).forEach(arr => (arr||[]).forEach(e=>countDish(e.dish)));
    return used;
  },[plan,officePlan]);

  const availableInventory = useCallback(() => {
    const used = usedPortions();
    return Object.fromEntries(Object.entries(inventory).map(([id,total])=>[id, total-(used[id]||0)]));
  },[inventory,usedPortions]);

  const avInv = availableInventory();

  const selectDish = (d) => {
    if((avInv[d.id]||0) <= 0) return;
    setSelected(p => p?.id===d.id ? null : d);
  };

  const placeDish = useCallback((dk, sk) => {
    const sel = selectedRef.current;
    if(!sel) return;
    const day = days.find(d=>d.key===dk);
    if(day.blockedSlots?.has(sk)) return; // breakfast on delivery day = previous block
    if(sk !== "bonus") {
      if(sel.fresh && !day.freshOk) { showToast("⚡ "+t.how4.slice(2),"error"); return; }
      setPlan(p => ({...p, [dk]:{...(p[dk]||{}), [sk]:{dish:sel, garnish:dg(sel,lang)[0]||null}}}));
    } else {
      setPlan(p => {
        const dayPlan = p[dk] || {};
        const oldBonus = Array.isArray(dayPlan.bonus) ? dayPlan.bonus : [];
        return {...p, [dk]:{...dayPlan, bonus:[...oldBonus, {dish:sel, garnish:null}]}};
      });
    }
    setSelected(null);
  },[days, lang, showToast, t]);

  const dropDish = useCallback((dk, sk) => {
    const dr = draggingRef.current;
    if(!dr) return;
    const day = days.find(d=>d.key===dk);
    if(day.blockedSlots?.has(sk)) return;
    if(sk !== "bonus") {
      if(dr.fresh && !day.freshOk) { showToast("⚡ "+t.how4.slice(2),"error"); return; }
      setPlan(p => ({...p, [dk]:{...(p[dk]||{}), [sk]:{dish:dr, garnish:dg(dr,lang)[0]||null}}}));
    } else {
      setPlan(p => {
        const dayPlan = p[dk] || {};
        const oldBonus = Array.isArray(dayPlan.bonus) ? dayPlan.bonus : [];
        return {...p, [dk]:{...dayPlan, bonus:[...oldBonus, {dish:dr, garnish:null}]}};
      });
    }
  },[days, lang, showToast, t]);

  const removeDish  = (dk,sk) => setPlan(p=>{const d={...(p[dk]||{})};delete d[sk];return{...p,[dk]:d};});
  const removeBonus = (dk,i)  => setPlan(p=>({...p,[dk]:{...(p[dk]||{}),bonus:(p[dk]?.bonus||[]).filter((_,j)=>j!==i)}}));
  const setGarnish  = (dk,sk,g)=> setPlan(p=>({...p,[dk]:{...(p[dk]||{}),[sk]:{...(p[dk]?.[sk]||{}),garnish:g}}}));

  const officeAdd = (dk) => { const sel=selectedRef.current; if(!sel) return; setOPlan(p=>({...p,[dk]:[...(p[dk]||[]),{dish:sel}]})); setSelected(null); };
  const officeDrop = (dk) => { const dr=draggingRef.current; if(!dr) return; setOPlan(p=>({...p,[dk]:[...(p[dk]||[]),{dish:dr}]})); };
  const officeRm  = (dk,i)=> setOPlan(p=>({...p,[dk]:(p[dk]||[]).filter((_,j)=>j!==i)}));

  const dayTotals = (dk) => {
    if(officeMode) {
      const arr=officePlan[dk]||[];
      return {kcal:0,p:0,f:0,c:0,price:arr.reduce((s,e)=>s+e.dish.price,0),count:arr.length};
    }
    return Object.entries(plan[dk]||{}).reduce((a,[sk,e])=>{
      if(sk==="bonus")(e||[]).forEach(b=>{a.kcal+=b.dish.kcal;a.p+=b.dish.p;a.f+=b.dish.f;a.c+=b.dish.c;a.price+=b.dish.price;});
      else if(e?.dish){a.kcal+=e.dish.kcal;a.p+=e.dish.p;a.f+=e.dish.f;a.c+=e.dish.c;a.price+=e.dish.price;}
      return a;
    },{kcal:0,p:0,f:0,c:0,price:0});
  };

  const grandTotal = days.reduce((s,d)=>s+dayTotals(d.key).price,0) + cart.reduce((s,c)=>s+c.total,0);
  // Count delivery fee per block (0, 1, 2)
  const blockDeliveryCost = [0,1,2].reduce((total,bi)=>{
    const blockSum=days.filter(d=>d.block===bi).reduce((s,d)=>s+dayTotals(d.key).price,0);
    return total + (blockSum>0&&blockSum<FREE_THRESHOLD ? DELIVERY_FEE : 0);
  },0);
  const delCost = blockDeliveryCost;

  const SLOTS = [{key:"breakfast",label:t.slot_b,icon:"☀️"},{key:"lunch",label:t.slot_l,icon:"🌤"},{key:"dinner",label:t.slot_d,icon:"🌙"}];

  const autoOrder = () => {
    const np={};
    days.slice(0,5).forEach((day,i)=>{
      const avail=ALL_DISHES.filter(d=>(!d.fresh||day.freshOk)&&!dietBlock(d,userDiet)&&(avInv[d.id]||0)>0);
      const bl=avail.filter(d=>d.cat==="breakfast"),sl=avail.filter(d=>d.cat==="soup"||d.cat==="special"),ml=avail.filter(d=>d.cat==="main"||d.cat==="special");
      np[day.key]={};
      if(bl.length&&!day.blockedSlots?.has("breakfast"))np[day.key]["breakfast"]={dish:bl[i%bl.length],garnish:null};
      if(sl.length)np[day.key]["lunch"]={dish:sl[(i+2)%sl.length],garnish:null};
      if(ml.length){const m=ml[(i+1)%ml.length];np[day.key]["dinner"]={dish:m,garnish:dg(m,lang)[0]||null};}
    });
    setPlan(np);
    showToast("✨ Auto-filled for 5 days","success");
  };

  const addToCart = () => {
    const src=officeMode?officePlan:plan;
    const filled=Object.values(src).some(d=>officeMode?(d||[]).length>0:Object.entries(d||{}).some(([sk,e])=>sk==="bonus"?(e||[]).length>0:e?.dish));
    if(!filled){showToast("Add at least one dish","warn");return;}
    let total=0,dishCount=0;
    days.forEach(day=>{const t2=dayTotals(day.key);total+=t2.price||0;dishCount+=officeMode?t2.count||0:1;});
    setCart(p=>[...p,{id:Date.now(),plan:JSON.parse(JSON.stringify(src)),total,dishCount,gender,officeMode}]);
    if(officeMode)setOPlan({});else setPlan({});
    showToast("✅ Saved! You can add another person now 🎁","success");
  };

  const cartTotal = cart.reduce((s,c)=>s+c.total,0);
  const cartDishes = cart.reduce((s,c)=>s+c.dishCount,0);

  const catLabel = { breakfast:t.cat_breakfast, soup:"Soups", main:"Mains", special:t.cat_special };

  return (
    <div style={{background:"var(--bg)",minHeight:"calc(100vh - 56px)"}}>
      {/* Toolbar */}
      <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bd)",padding:"9px 14px"}}>
        <div style={{maxWidth:1480,margin:"0 auto",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:17,lineHeight:1.1}}>{t.plan_title}</div>
            <div style={{color:"var(--ink3)",fontSize:11,marginTop:1}}>{t.plan_sub}</div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{display:"flex",gap:2,background:"var(--surf2)",borderRadius:9,padding:2}}>
              {[[false,t.personal],[true,t.office]].map(([om,l])=>(
                <button key={String(om)} onClick={()=>setOfficeMode(om)} className="btn sm" style={{border:"none",borderRadius:7,background:officeMode===om?"var(--surf)":"transparent",color:officeMode===om?"var(--g)":"var(--ink2)",fontWeight:officeMode===om?600:400,boxShadow:officeMode===om?"0 1px 4px rgba(0,0,0,.07)":"none"}}>{l}</button>
              ))}
            </div>
            {!officeMode&&<div style={{display:"flex",gap:2,background:"var(--surf2)",borderRadius:9,padding:2}}>
              {[["female",t.plan_f],["male",t.plan_m]].map(([g,l])=>(
                <button key={g} onClick={()=>setGender(g)} className="btn sm" style={{border:"none",borderRadius:7,background:gender===g?"var(--surf)":"transparent",color:gender===g?"var(--g)":"var(--ink2)",fontWeight:gender===g?600:400,boxShadow:gender===g?"0 1px 4px rgba(0,0,0,.07)":"none"}}>{l}</button>
              ))}
            </div>}
            {!officeMode&&<button className="btn ba sm" onClick={autoOrder}>{t.auto}</button>}
            <button className="btn bp sm" onClick={addToCart}>
              {t.save_cart}
              {cart.length>0&&<span style={{background:"rgba(255,255,255,.22)",borderRadius:20,padding:"1px 6px",fontSize:11}}>{cart.length}</span>}
            </button>
            {cart.length>0&&<button className="btn ba md" onClick={()=>onCheckout(cart)}>{t.checkout_btn} {(cartTotal+delCost).toFixed(2)}€ →</button>}
          </div>
        </div>
      </div>

      {cart.length>0&&<div style={{background:"var(--ap)",borderBottom:"1px solid #e8d8b8",padding:"7px 14px"}}>
        <div style={{maxWidth:1480,margin:"0 auto",display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:12,fontWeight:600,color:"var(--a)"}}>{t.cart_label}</span>
          {cart.map(c=>(
            <div key={c.id} style={{background:"white",borderRadius:7,padding:"2px 10px",border:"1px solid #e8d8b8",fontSize:12,display:"flex",gap:6}}>
              <span>{c.officeMode?"🏢":(c.gender==="female"?"👩":"👨")}</span>
              <span style={{fontWeight:700,color:"var(--g)"}}>{c.total.toFixed(2)}€</span>
              <span style={{color:"var(--ink3)"}}>{c.dishCount} dishes</span>
            </div>
          ))}
          <span style={{marginLeft:"auto",fontWeight:700,color:"var(--g)",fontSize:13}}>{(cartTotal+delCost).toFixed(2)}€ · {cartDishes} dishes</span>
        </div>
      </div>}

      <div style={{maxWidth:1480,margin:"0 auto",padding:"10px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
        {/* Sidebar */}
        <div style={{width:196,flexShrink:0,background:"var(--surf)",borderRadius:12,border:"1px solid var(--bd)",overflow:"hidden",position:"sticky",top:70}}>
          <div style={{borderBottom:"1px solid var(--bd)"}}>
            {CATEGORIES.map(cat=>(
              <button key={cat} onClick={()=>{setActiveCat(cat);setSelected(null);}} style={{
                display:"block",width:"100%",padding:"8px 11px",border:"none",cursor:"pointer",
                fontFamily:"DM Sans,sans-serif",fontSize:11,fontWeight:activeCat===cat?700:400,textAlign:"left",
                background:activeCat===cat?"var(--gxp)":"transparent",color:activeCat===cat?"var(--g)":"var(--ink2)",
                borderLeft:activeCat===cat?"3px solid var(--gm)":"3px solid transparent",transition:"all .12s",
              }}>
                {cat==="breakfast"?"☀️ ":cat==="soup"?"🍲 ":cat==="main"?"🍖 ":"⭐ "}{catLabel[cat]||cat}
              </button>
            ))}
          </div>
          <div style={{padding:6,display:"flex",flexDirection:"column",gap:5,maxHeight:"calc(100vh - 290px)",overflowY:"auto"}}>
            {catItems.map(dish=>(
              <SidebarDish key={dish.id} dish={dish}
                selected={selected} userDiet={userDiet} inventory={avInv}
                t={t} lang={lang}
                onSelect={selectDish}
                onDragStart={d=>{setSelected(null);setDragging(d);}}
                onDragEnd={()=>setDragging(null)}/>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{flex:1,minWidth:0,overflowX:"auto",paddingBottom:12}}>
          {officeMode ? (
            <div className="pg">
              <div style={{width:"var(--lbl)"}}/>
              {days.map(day=>(
                <div key={day.key} className="dh" style={{background:day.isDelivery?"linear-gradient(160deg,#192b16,#2a5c24)":"var(--surf2)",color:day.isDelivery?"white":"var(--ink2)",boxShadow:day.isDelivery?"0 3px 10px rgba(42,92,36,.2)":"none"}}>
                  {day.isDelivery&&<div style={{fontSize:9,opacity:.7}}>🚚</div>}
                  <div style={{fontSize:11,fontWeight:600}}>{day.name}</div>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:20,fontWeight:700,lineHeight:1}}>{day.num}</div>
                  <div style={{fontSize:9,opacity:.55}}>{day.mon}</div>
                </div>
              ))}
              <div style={{width:"var(--lbl)",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:7}}><span style={{fontSize:10,color:"var(--ink3)",fontWeight:600}}>🏢</span></div>
              {days.map(day=>(
                <OfficeCell key={day.key} items={officePlan[day.key]||[]} dayKey={day.key}
                  selected={selected} dragging={dragging}
                  onAdd={officeAdd} onDrop={()=>officeDrop(day.key)} onRemove={officeRm} lang={lang} t={t}/>
              ))}
              <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:7}}><span style={{fontSize:9,color:"var(--ink3)",fontWeight:600}}>{t.office_hint.slice(0,6)}</span></div>
              {days.map(day=>{const items=officePlan[day.key]||[];const price=items.reduce((s,e)=>s+e.dish.price,0);return(
                <div key={day.key+"ot"} className="kc">{items.length>0?<>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:15,fontWeight:700,color:"var(--g)",lineHeight:1}}>{price.toFixed(2)}€</div>
                  <div style={{fontSize:8,color:"var(--ink3)",marginTop:2}}>{items.length} portions</div>
                </>:<div style={{color:"var(--bd2)",fontSize:14}}>—</div>}</div>
              );
              })}
            </div>
          ) : (
            <div className="pg">
              {/* headers */}
              <div style={{width:"var(--lbl)"}}/>
              {days.map(day=>(
                <div key={day.key} className="dh" style={{background:day.isDelivery?"linear-gradient(160deg,#192b16,#2a5c24)":"var(--surf2)",color:day.isDelivery?"white":"var(--ink2)",boxShadow:day.isDelivery?"0 3px 10px rgba(42,92,36,.2)":"none"}}>
                  {day.isDelivery&&<div style={{fontSize:8,opacity:.75}}>🚚 from lunch</div>}
                  <div style={{fontSize:11,fontWeight:600}}>{day.name}</div>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:20,fontWeight:700,lineHeight:1}}>{day.num}</div>
                  <div style={{fontSize:9,opacity:.55}}>{day.mon}</div>
                  {day.freshOk&&<div style={{fontSize:8,color:day.isDelivery?"rgba(255,255,255,.65)":"var(--al)",marginTop:1}}>⚡ fresh</div>}
                </div>
              ))}
              {/* personal slots */}
              {SLOTS.map(slot=>(
                <>
                  <div key={slot.key+"-l"} className="sll" style={{height:90}}>
                    <span style={{fontSize:13}}>{slot.icon}</span>
                    <span style={{fontSize:10,fontWeight:600,color:"var(--ink2)"}}>{slot.label}</span>
                  </div>
                  {days.map(day=>(
                    <PSlot key={day.key+slot.key}
                      entry={plan[day.key]?.[slot.key]} slotKey={slot.key} dayKey={day.key} day={day}
                      selected={selected} dragging={dragging}
                      onPlace={placeDish} onDrop={dropDish} onRemove={removeDish} onGarnish={setGarnish} lang={lang}/>
                  ))}
                </>
              ))}
              {/* bonus row */}
              <div className="sll" style={{height:"auto",alignItems:"flex-end",paddingTop:6,paddingBottom:6}}>
                <span style={{fontSize:12}}>★</span>
                <span style={{fontSize:10,fontWeight:600,color:"var(--a)"}}>{t.slot_bonus}</span>
              </div>
              {days.map(day=>(
                <BonusCell key={day.key+"bonus"}
                  items={plan[day.key]?.bonus||[]} dayKey={day.key}
                  selected={selected} dragging={dragging}
                  onPlace={placeDish} onDrop={dropDish} onRemoveBonus={removeBonus} lang={lang} t={t}/>
              ))}
              {/* kcal row */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",justifyContent:"center",paddingRight:7}}>
                <span style={{fontSize:9,color:"var(--ink3)",fontWeight:600}}>{t.nutrition_lbl}</span>
              </div>
              {days.map(day=>{
                const tt=dayTotals(day.key);
                const pct=target>0?Math.min(112,Math.round(tt.kcal/target*100)):0;
                const bc=pct>105?"var(--rose)":pct>=70?"var(--gm)":"var(--a)";
                return(
                  <div key={day.key+"k"} className="kc">
                    {tt.kcal>0?<>
                      <div style={{fontFamily:"Playfair Display,serif",fontSize:15,fontWeight:700,color:bc,lineHeight:1}}>{tt.kcal}</div>
                      <div style={{fontSize:8,color:"var(--ink3)",marginBottom:2}}>kcal</div>
                      <div className="kb"><div className="kbf" style={{width:`${pct}%`,background:bc}}/></div>
                      <div style={{fontSize:8,color:"var(--ink3)",margin:"1px 0 2px"}}>{pct}% {t.kcal_norm}</div>
                      <div style={{fontSize:8,color:"var(--ink3)",lineHeight:1.6}}>
                        <span style={{color:"#3b82f6"}}>P{tt.p}</span>·<span style={{color:"var(--a)"}}>F{tt.f}</span>·<span style={{color:"var(--gm)"}}>C{tt.c}</span>
                      </div>
                    </>:<div style={{color:"var(--bd2)",fontSize:14}}>—</div>}
                  </div>
                );
              })}
              {/* delivery row — per block (Mon/Wed/Fri) */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",justifyContent:"center",paddingRight:7}}>
                <span style={{fontSize:9,color:"var(--ink3)",fontWeight:600}}>{t.delivery}</span>
              </div>
              {days.map((day)=>{
                const tt=dayTotals(day.key);
                const dayPrice=tt.price||0;
                // sum price for all days in same block
                const blockTotal=days.filter(d=>d.block===day.block).reduce((s,d)=>s+dayTotals(d.key).price,0)
                  + cart.filter(c=>!c.officeMode).reduce((s,c)=>s+c.total,0)/3; // rough cart split
                const free=blockTotal>=FREE_THRESHOLD;
                const isFirstOfBlock=days.find(d=>d.block===day.block)?.key===day.key;
                return(
                  <div key={day.key+"dlv"} className="dlv" style={{
                    borderLeft: isFirstOfBlock?"3px solid var(--gm)":"none",
                    borderTopLeftRadius: isFirstOfBlock?0:"var(--r)",
                    borderBottomLeftRadius: isFirstOfBlock?0:"var(--r)",
                  }}>
                    {dayPrice>0?<>
                      <div style={{fontFamily:"Playfair Display,serif",fontSize:13,fontWeight:700,color:"var(--g)",lineHeight:1}}>{dayPrice.toFixed(2)}€</div>
                      <div style={{height:3,borderRadius:3,background:"var(--surf3)",overflow:"hidden",margin:"2px 1px"}}>
                        <div style={{height:"100%",borderRadius:3,background:free?"var(--gm)":"var(--a)",width:`${Math.min(100,blockTotal/FREE_THRESHOLD*100)}%`,transition:"width .5s"}}/>
                      </div>
                      <div style={{fontSize:8,color:free?"var(--g)":"var(--ink3)",fontWeight:free?700:400}}>
                        {free?t.block_free:`${blockTotal.toFixed(0)}/50€`}
                      </div>
                    </>:<>
                      {isFirstOfBlock&&<div style={{fontSize:8,color:"var(--ink3)",opacity:.6}}>{t.block_lbl[day.block]}</div>}
                      <div style={{color:"var(--bd2)",fontSize:13}}>—</div>
                    </>}
                  </div>
                );
              })}
            </div>
          )}

          {/* bottom bar */}
          <div style={{marginTop:9,display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <div style={{background:"var(--surf)",borderRadius:10,padding:"10px 12px",border:"1px solid var(--bd)"}}>
              <div style={{fontSize:12,fontWeight:600,color:"var(--ink2)",marginBottom:8}}>🚚 {t.delivery}</div>
              {/* Per-block delivery cost */}
              <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:9}}>
                {[0,1,2].map(bi=>{
                  const blockDays=days.filter(d=>d.block===bi);
                  const blockTotal=blockDays.reduce((s,d)=>s+dayTotals(d.key).price,0);
                  const free=blockTotal>=FREE_THRESHOLD;
                  const pct=Math.min(100,blockTotal/FREE_THRESHOLD*100);
                  return(
                    <div key={bi} style={{background:blockTotal>0?free?"var(--gxp)":"var(--surf2)":"var(--surf2)",borderRadius:8,padding:"6px 9px",border:`1px solid ${blockTotal>0?free?"var(--gm)":"var(--bd)":"var(--bd)"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                        <span style={{fontSize:11,fontWeight:600,color:"var(--ink2)"}}>{t.block_lbl[bi]}</span>
                        <span style={{fontSize:12,fontWeight:700,color:blockTotal>0?(free?"var(--g)":"var(--a)"):"var(--ink3)"}}>
                          {blockTotal>0?(free?t.block_free:`+${DELIVERY_FEE}€`):"—"}
                        </span>
                      </div>
                      {blockTotal>0&&!free&&<>
                        <div style={{height:3,borderRadius:3,background:"var(--surf3)",overflow:"hidden"}}>
                          <div style={{height:"100%",borderRadius:3,background:"var(--a)",width:`${pct}%`,transition:"width .5s"}}/>
                        </div>
                        <div style={{fontSize:9,color:"var(--ink3)",marginTop:2}}>{blockTotal.toFixed(0)}€ / 50€ {t.delivery_note.split("·")[0].trim()}</div>
                      </>}
                    </div>
                  );
                })}
              </div>
              <label style={{fontSize:12,fontWeight:600,color:"var(--ink2)",display:"block",marginBottom:4}}>{t.comment_lbl}</label>
              <textarea className="inp" rows={2} placeholder={t.comment_ph} value={comment} onChange={e=>setComment(e.target.value)} style={{resize:"vertical",fontSize:12}}/>
            </div>
            <div style={{background:"var(--surf)",borderRadius:10,padding:"10px 12px",border:"1px solid var(--bd)",fontSize:11,color:"var(--ink2)",lineHeight:2.1}}>
              <div><strong style={{color:"var(--ink)"}}>{t.how_title}</strong></div>
              <div>{t.how1}</div><div>{t.how2}</div><div>{t.how3}</div><div>{t.how4}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MENU PAGE
══════════════════════════════════════════════════════ */
function MenuPage({ t, lang, userDiet }) {
  const [cat,setCat]=useState("breakfast");
  const items=ALL_DISHES.filter(d=>d.cat===cat);
  const catLabel={breakfast:t.cat_breakfast,soup:"Soups",main:"Mains",special:t.cat_special};
  return(
    <div style={{maxWidth:1060,margin:"0 auto",padding:"30px 14px"}} className="fu">
      <h2 style={{fontSize:30,marginBottom:3}}>{t.menu_title}</h2>
      <p style={{color:"var(--ink2)",fontSize:13,marginBottom:18}}>{t.menu_sub}</p>
      <div style={{display:"flex",gap:7,marginBottom:18,flexWrap:"wrap"}}>
        {CATEGORIES.map(c=>(
          <button key={c} className={`ct${cat===c?" on":""}`} onClick={()=>setCat(c)}>
            {c==="breakfast"?"☀️ ":c==="soup"?"🍲 ":c==="main"?"🍖 ":"⭐ "}{catLabel[c]}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:13}}>
        {items.map((dish,i)=>{
          const blocked=dietBlock(dish,userDiet);
          return(
            <div key={dish.id} className="mc fu" style={{animationDelay:`${i*.06}s`,opacity:blocked?0.55:1}}>
              <div style={{position:"relative",height:160,overflow:"hidden"}}>
                <img src={dish.img} alt={dn(dish,lang)} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                  onError={e=>{e.target.parentElement.style.background="var(--gxp)";e.target.style.display="none";}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.4))"}}/>
                {cat==="special"&&<div style={{position:"absolute",top:8,right:8,background:"var(--a)",color:"white",fontSize:9,fontWeight:800,borderRadius:20,padding:"2px 8px"}}>★ SPECIAL</div>}
                {dish.fresh&&<div style={{position:"absolute",top:8,left:8,background:"rgba(181,113,31,.9)",color:"white",fontSize:9,fontWeight:700,borderRadius:20,padding:"2px 8px"}}>⚡ fresh</div>}
                <div style={{position:"absolute",bottom:8,left:10,right:10,display:"flex",flexWrap:"wrap",gap:3}}>
                  {dish.diet.vegan&&<span className="dbadge dv" style={{fontSize:8}}>🌱</span>}
                  {dish.diet.gf&&<span className="dbadge dgf" style={{fontSize:8}}>GF</span>}
                  {dish.diet.lf&&<span className="dbadge dlf" style={{fontSize:8}}>DF</span>}
                  {blocked&&<span style={{background:"rgba(184,76,60,.85)",color:"white",fontSize:8,fontWeight:700,borderRadius:20,padding:"2px 6px"}}>🚫 {t["blocked_"+blocked]}</span>}
                </div>
              </div>
              <div style={{padding:"11px 14px 14px"}}>
                <h3 style={{fontSize:15,marginBottom:3,lineHeight:1.3}}>{dn(dish,lang)}</h3>
                <p style={{fontSize:11,color:"var(--ink2)",marginBottom:8,lineHeight:1.5}}>{dish.desc[lang]||dish.desc.en}</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",background:"var(--surf2)",borderRadius:8,padding:"5px 6px",marginBottom:8,gap:1}}>
                  {[["Kcal",dish.kcal,"var(--a)"],["P",`${dish.p}g`,"#3b82f6"],["F",`${dish.f}g`,"var(--a)"],["C",`${dish.c}g`,"var(--gm)"]].map(([l,v,c])=>(
                    <div key={l} style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:11,color:c}}>{v}</div><div style={{fontSize:9,color:"var(--ink3)"}}>{l}</div></div>
                  ))}
                </div>
                {dg(dish,lang).length>0&&<p style={{fontSize:11,color:"var(--ink2)",marginBottom:8}}>🍚 {dg(dish,lang).join(" · ")}</p>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:20,fontWeight:700,color:"var(--g)"}}>{dish.price}€</div>
                  <div style={{fontSize:10,color:"var(--ink3)"}}>{dish.portions} portions/week</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════ */
function HeroPage({ onStart, user, onAuth, t, lang }) {
  return(
    <>
      <div className="hero">
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse at 13% 87%,rgba(90,158,80,.2),transparent 50%),radial-gradient(ellipse at 87% 13%,rgba(212,144,58,.1),transparent 48%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1180,margin:"0 auto",padding:"50px 28px",position:"relative",zIndex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:46,alignItems:"center"}}>
          <div className="fu">
            <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.1)",borderRadius:30,padding:"5px 13px",marginBottom:20}}>
              <span style={{width:7,height:7,background:"#86efac",borderRadius:"50%",display:"inline-block"}}/>
              <span style={{color:"rgba(255,255,255,.78)",fontSize:12}}>{t.hero_badge}</span>
            </div>
            <h1 style={{fontSize:"clamp(32px,3.8vw,54px)",color:"white",lineHeight:1.1,marginBottom:14,fontStyle:"italic",whiteSpace:"pre-line"}}>{t.hero_h}</h1>
            <p style={{color:"rgba(255,255,255,.62)",fontSize:14,lineHeight:1.8,marginBottom:26,maxWidth:420}}>{t.hero_sub}</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button className="btn ba lg" onClick={onStart}>{t.hero_cta}</button>
              {!user&&<button className="btn bg lg" style={{color:"white",borderColor:"rgba(255,255,255,.28)"}} onClick={onAuth}>{t.login}</button>}
            </div>
            <div style={{display:"flex",gap:24,marginTop:28}}>
              {[["🚚","Mon · Wed · Fri"],["🥗","Natural\ningredients"],["🧮","Nutrition\ntracking"]].map(([ico,txt])=>(
                <div key={txt} style={{color:"rgba(255,255,255,.55)",fontSize:11,textAlign:"center"}}>
                  <div style={{fontSize:18,marginBottom:4}}>{ico}</div>
                  <div style={{lineHeight:1.5,whiteSpace:"pre-line"}}>{txt}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="fu" style={{animationDelay:".1s",display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {ALL_DISHES.slice(0,4).map((dish,i)=>(
              <div key={dish.id} className="fu" style={{animationDelay:`${i*.07}s`,borderRadius:13,overflow:"hidden",background:"rgba(255,255,255,.09)",border:"1px solid rgba(255,255,255,.12)"}}>
                <div style={{height:90,overflow:"hidden",position:"relative"}}>
                  <img src={dish.img} alt={dn(dish,lang)} style={{width:"100%",height:"100%",objectFit:"cover"}}
                    onError={e=>{e.target.parentElement.style.background="rgba(255,255,255,.06)";e.target.style.display="none";}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent,rgba(0,0,0,.4))"}}/>
                </div>
                <div style={{padding:"8px 10px"}}>
                  <div style={{color:"white",fontSize:11,fontWeight:600,lineHeight:1.3,marginBottom:2}}>{dn(dish,lang)}</div>
                  <div style={{color:"rgba(255,255,255,.5)",fontSize:10}}>{dish.kcal} kcal · {dish.price}€</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{background:"var(--surf)",borderTop:"1px solid var(--bd)",padding:"38px 14px"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:30,textAlign:"center"}}>
          {[[t.feat1_h,t.feat1_t,"🧑‍🍳"],[t.feat2_h,t.feat2_t,"📅"],[t.feat3_h,t.feat3_t,"🚚"]].map(([h,tx,ico])=>(
            <div key={h}><div style={{fontSize:32,marginBottom:9}}>{ico}</div><h3 style={{fontSize:16,marginBottom:6}}>{h}</h3><p style={{color:"var(--ink2)",fontSize:13,lineHeight:1.7}}>{tx}</p></div>
          ))}
        </div>
      </div>
      <div style={{background:"var(--gxp)",padding:"42px 14px",textAlign:"center",borderTop:"1px solid var(--bd)"}}>
        <h2 style={{fontSize:30,marginBottom:8,fontStyle:"italic"}}>{t.cta_h}</h2>
        <p style={{color:"var(--ink2)",fontSize:14,marginBottom:20}}>{t.cta_sub}</p>
        <button className="btn bp lg" onClick={onStart}>{t.cta_btn}</button>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   ORDERS PAGE
══════════════════════════════════════════════════════ */
const MOCK_ORDERS=[
  {id:"ORD-1042",date:"28 Feb 2026",status:"delivered",total:28.50,items:["🫐 Oatmeal · Mon","🍲 Borscht · Mon","🍗 Chicken+Rice · Mon"]},
];
function OrdersPage({t}){
  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"30px 14px"}} className="fu">
      <h2 style={{fontSize:30,marginBottom:3}}>{t.orders_title}</h2>
      <p style={{color:"var(--ink2)",fontSize:13,marginBottom:20}}>{t.orders_sub}</p>
      {MOCK_ORDERS.map(o=>(
        <div key={o.id} style={{background:"var(--surf)",borderRadius:12,border:"1px solid var(--bd)",padding:"15px 17px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <div><div style={{fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:700}}>{o.id}</div><div style={{color:"var(--ink3)",fontSize:12,marginTop:1}}>{o.date}</div></div>
            <div style={{textAlign:"right"}}><div style={{color:"var(--g)",fontWeight:600,fontSize:12}}>✅</div><div style={{fontFamily:"Playfair Display,serif",fontSize:19,fontWeight:700,color:"var(--g)",marginTop:2}}>{o.total.toFixed(2)}€</div></div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
            {o.items.map((it,i)=><span key={i} style={{background:"var(--surf2)",borderRadius:7,padding:"3px 9px",fontSize:11,color:"var(--ink2)"}}>{it}</span>)}
          </div>
          <button className="btn bg sm">{t.repeat}</button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE NAV (bottom tab bar)
══════════════════════════════════════════════════════ */
function MobileNav({ page, setPage, user, onProfile, onAuth, t }) {
  const tabs = [
    { key:"home",    icon:"🏠", label:t.nav_home },
    { key:"menu",    icon:"🍽️", label:t.nav_menu },
    { key:"planner", icon:"📅", label:t.nav_planner },
    { key:"orders",  icon:"📦", label:t.nav_orders },
  ];
  return (
    <nav className="mob-nav">
      {tabs.map(tb => (
        <button key={tb.key} className={`mnb${page===tb.key?" on":""}`}
          onClick={() => {
            if(tb.key==="orders"&&!user) { onAuth(); return; }
            setPage(tb.key);
          }}>
          <span className="mi">{tb.icon}</span>
          {tb.label}
        </button>
      ))}
      <button className="mnb" onClick={user ? onProfile : onAuth}>
        <span className="mi">{user ? "👤" : "🔑"}</span>
        {user ? user.name.split(" ")[0] : t.login}
      </button>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE PLANNER  (day-by-day, no grid)
══════════════════════════════════════════════════════ */
function MobilePlannerPage({ showToast, onCheckout, t, lang, userDiet }) {
  const days = buildDays(t);
  const [inventory]    = useState(() => Object.fromEntries(ALL_DISHES.map(d=>[d.id,d.portions])));
  const [plan, setPlan] = useState({});
  const [cart, setCart] = useState([]);
  const [selDay, setSelDay] = useState(days[0].key);
  const [activeCat, setActiveCat] = useState("breakfast");
  const [selected, setSelected] = useState(null);

  const usedPortions = () => {
    const u={};
    Object.values(plan).forEach(day=>Object.entries(day||{}).forEach(([sk,e])=>{
      if(sk==="bonus")(e||[]).forEach(b=>{u[b.dish.id]=(u[b.dish.id]||0)+1;});
      else if(e?.dish)u[e.dish.id]=(u[e.dish.id]||0)+1;
    }));
    return u;
  };
  const avInv = () => { const u=usedPortions(); return Object.fromEntries(Object.entries(inventory).map(([id,tot])=>[id,tot-(u[id]||0)])); };
  const inv = avInv();

  const day = days.find(d=>d.key===selDay);
  const catItems = ALL_DISHES.filter(d=>d.cat===activeCat && (inv[d.id]||0)>0 && !dietBlock(d,userDiet));

  const SLOTS = [
    {key:"breakfast",label:t.slot_b,icon:"☀️"},
    {key:"lunch",    label:t.slot_l,icon:"🌤"},
    {key:"dinner",   label:t.slot_d,icon:"🌙"},
  ];

  const placeInSlot = (sk) => {
    if(!selected) return;
    if(day.blockedSlots?.has(sk)) return;
    if(selected.fresh && !day.freshOk) { showToast("⚡ "+t.how4.slice(2),"error"); return; }
    if(sk==="bonus") {
      setPlan(p=>({...p,[selDay]:{...(p[selDay]||{}),bonus:[...(p[selDay]?.bonus||[]),{dish:selected,garnish:null}]}}));
    } else {
      setPlan(p=>({...p,[selDay]:{...(p[selDay]||{}),[sk]:{dish:selected,garnish:dg(selected,lang)[0]||null}}}));
    }
    setSelected(null);
  };

  const removeSlot = (sk) => setPlan(p=>{const d={...(p[selDay]||{})};delete d[sk];return{...p,[selDay]:d};});
  const removeBonus = (i) => setPlan(p=>({...p,[selDay]:{...(p[selDay]||{}),bonus:(p[selDay]?.bonus||[]).filter((_,j)=>j!==i)}}));

  const dayTotals = (dk) => Object.entries(plan[dk]||{}).reduce((a,[sk,e])=>{
    if(sk==="bonus")(e||[]).forEach(b=>{a.kcal+=b.dish.kcal;a.price+=b.dish.price;});
    else if(e?.dish){a.kcal+=e.dish.kcal;a.price+=e.dish.price;}
    return a;
  },{kcal:0,price:0});

  const grandTotal = days.reduce((s,d)=>s+dayTotals(d.key).price,0)+cart.reduce((s,c)=>s+c.total,0);
  const delCost = grandTotal>=FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const {kcal:dayKcal,price:dayPrice} = dayTotals(selDay);
  const target = 2000;
  const pct = Math.min(100,Math.round(dayKcal/target*100));

  const dayEntry = plan[selDay]||{};
  const hasContent = Object.values(plan).some(d=>Object.entries(d||{}).some(([sk,e])=>sk==="bonus"?(e||[]).length>0:e?.dish));

  const addToCart = () => {
    if(!hasContent){showToast("Add at least one dish","warn");return;}
    const total=days.reduce((s,d)=>s+dayTotals(d.key).price,0);
    setCart(p=>[...p,{id:Date.now(),plan:JSON.parse(JSON.stringify(plan)),total,dishCount:1}]);
    setPlan({});
    showToast("✅ Saved to cart!","success");
  };

  const catLabel={breakfast:t.cat_breakfast,soup:"Soups",main:"Mains",special:t.cat_special};

  return (
    <div style={{background:"var(--bg)",paddingBottom:140}}>
      {/* Planner header */}
      <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bd)",padding:"12px 14px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:700}}>{t.plan_title}</div>
            <div style={{fontSize:11,color:"var(--ink3)"}}>{t.plan_sub}</div>
          </div>
          <div style={{display:"flex",gap:6}}>
            {hasContent&&<button className="btn ba sm" onClick={addToCart}>{t.save_cart}</button>}
            {cart.length>0&&<button className="btn bp sm" onClick={()=>onCheckout(cart)}>{(grandTotal+delCost).toFixed(0)}€ →</button>}
          </div>
        </div>
        {/* Day strip */}
        <div className="day-strip" style={{padding:"0 0 10px",margin:"0 -14px",paddingLeft:14}}>
          {days.map(d=>{
            const hasDishes=Object.entries(plan[d.key]||{}).some(([sk,e])=>sk==="bonus"?(e||[]).length>0:e?.dish);
            return(
              <button key={d.key} className={`dpill${selDay===d.key?" on":""}${d.isDelivery&&selDay!==d.key?" del":""}${hasDishes&&selDay!==d.key?" has":""}`}
                onClick={()=>{setSelDay(d.key);setSelected(null);}}>
                <div style={{fontSize:10,fontWeight:600,opacity:.7}}>{d.name}</div>
                <div style={{fontFamily:"Playfair Display,serif",fontSize:17,fontWeight:700,lineHeight:1}}>{d.num}</div>
                {hasDishes&&<div style={{width:5,height:5,borderRadius:"50%",background:selDay===d.key?"rgba(255,255,255,.7)":"var(--g)",margin:"2px auto 0"}}/>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{padding:"12px 14px"}}>
        {/* Day delivery badge */}
        {day.isDelivery&&<div style={{background:"linear-gradient(90deg,#192b16,#2a5c24)",color:"white",borderRadius:10,padding:"7px 13px",marginBottom:10,fontSize:12,fontWeight:600}}>🚚 {t.delivery_day} · {day.name} {day.num} {day.mon}</div>}
        {!day.isDelivery&&day.freshOk&&<div style={{background:"var(--ap)",borderRadius:10,padding:"7px 13px",marginBottom:10,fontSize:12,fontWeight:600,color:"var(--a)"}}>⚡ {t.fresh_ok} (+1 day after delivery)</div>}
        {!day.isDelivery&&!day.freshOk&&<div style={{background:"var(--surf2)",borderRadius:10,padding:"7px 13px",marginBottom:10,fontSize:12,color:"var(--ink3)"}}>📦 Dishes from Mon / Wed / Fri delivery</div>}

        {/* Slots */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {SLOTS.map(slot=>{
            const entry=dayEntry[slot.key];
            const slotBlocked=day.blockedSlots?.has(slot.key);
            const isAvail=!slotBlocked&&selected&&!entry&&!(selected.fresh&&!day.freshOk);
            const isBlocked=!slotBlocked&&selected&&!entry&&selected.fresh&&!day.freshOk;
            return(
              <div key={slot.key} className={`mslot${isAvail?" avl":""}${entry?" fld":""}${isBlocked||slotBlocked?" blk":""}`}
                onClick={()=>isAvail&&placeInSlot(slot.key)} style={{opacity:slotBlocked?.35:1}}>
                <div style={{width:46,background:slotBlocked?"var(--surf3)":entry?"var(--gp)":"var(--surf2)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,flexShrink:0}}>
                  <span style={{fontSize:16}}>{slot.icon}</span>
                  <span style={{fontSize:8,fontWeight:700,color:"var(--ink3)",textAlign:"center",lineHeight:1.2}}>{slot.label}</span>
                </div>
                {slotBlocked?(
                  <div style={{flex:1,display:"flex",alignItems:"center",padding:"0 12px"}}>
                    <span style={{fontSize:11,color:"var(--ink3)"}}>— prev. delivery block</span>
                  </div>
                ):entry?(
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:10,padding:"8px 10px",position:"relative"}}>
                    <img src={entry.dish.img} alt="" style={{width:44,height:44,borderRadius:8,objectFit:"cover",flexShrink:0}}
                      onError={e=>e.target.style.display="none"}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,lineHeight:1.3,marginBottom:2}}>{dn(entry.dish,lang)}</div>
                      {dg(entry.dish,lang).length>0&&(
                        <select value={entry.garnish||""} onChange={e=>{setPlan(p=>({...p,[selDay]:{...(p[selDay]||{}),[slot.key]:{...entry,garnish:e.target.value}}}));}} onClick={ev=>ev.stopPropagation()}
                          style={{fontSize:11,border:"1px solid var(--bd)",borderRadius:6,padding:"1px 6px",background:"white",color:"var(--ink2)"}}>
                          {dg(entry.dish,lang).map(g=><option key={g}>{g}</option>)}
                        </select>
                      )}
                      <div style={{fontSize:11,color:"var(--a)",fontWeight:700,marginTop:2}}>{entry.dish.kcal} kcal · {entry.dish.price}€</div>
                    </div>
                    <button onClick={e=>{e.stopPropagation();removeSlot(slot.key);}} style={{width:22,height:22,background:"var(--rose)",color:"white",border:"none",borderRadius:"50%",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>×</button>
                  </div>
                ):(
                  <div style={{flex:1,display:"flex",alignItems:"center",padding:"0 12px",gap:8}}>
                    {isBlocked?(
                      <span style={{fontSize:12,color:"var(--rose)"}}>🚫 Fresh only on delivery day</span>
                    ):isAvail?(
                      <span style={{fontSize:12,color:"var(--g)",fontWeight:600}}>Tap to place {selected.emoji||"🍽️"} here</span>
                    ):(
                      <span style={{fontSize:12,color:"var(--ink3)"}}>Tap a dish below first</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Bonus row */}
          <div style={{borderRadius:14,border:"1.5px dashed var(--bd)",background:selected&&!selected.fresh?"var(--gxp)":"var(--surf)",padding:"8px 10px",transition:"all .13s",cursor:selected&&!selected.fresh?"pointer":"default"}}
            onClick={()=>selected&&!selected.fresh&&placeInSlot("bonus")}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--a)",marginBottom:5}}>★ {t.slot_bonus}</div>
            {(dayEntry.bonus||[]).length===0&&(
              <div style={{fontSize:11,color:"var(--ink3)"}}>
                {selected&&!selected.fresh?"Tap to add extra":"Extra dishes, snacks…"}
              </div>
            )}
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {(dayEntry.bonus||[]).map((e,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:5,background:"var(--gp)",borderRadius:8,padding:"4px 8px 4px 6px",border:"1px solid #bddcbc"}}>
                  <img src={e.dish.img} alt="" style={{width:24,height:24,borderRadius:5,objectFit:"cover"}} onError={ev=>ev.target.style.display="none"}/>
                  <span style={{fontSize:11,fontWeight:600,color:"var(--g)"}}>{dn(e.dish,lang)}</span>
                  <span style={{fontSize:11,color:"var(--a)",fontWeight:700}}>{e.dish.price}€</span>
                  <button onClick={ev=>{ev.stopPropagation();removeBonus(i);}} style={{width:16,height:16,background:"var(--rose)",color:"white",border:"none",borderRadius:"50%",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dish picker */}
        <div style={{background:"var(--surf)",borderRadius:14,border:"1px solid var(--bd)",overflow:"hidden",marginBottom:10}}>
          {/* Category tabs */}
          <div style={{display:"flex",borderBottom:"1px solid var(--bd)",overflowX:"auto"}}>
            {["breakfast","soup","main","special"].map(cat=>(
              <button key={cat} onClick={()=>{setActiveCat(cat);setSelected(null);}}
                style={{flex:1,minWidth:68,padding:"9px 4px",border:"none",cursor:"pointer",fontSize:10,fontWeight:activeCat===cat?700:400,
                  background:activeCat===cat?"var(--gxp)":"transparent",color:activeCat===cat?"var(--g)":"var(--ink2)",
                  borderBottom:activeCat===cat?"2px solid var(--gm)":"2px solid transparent",whiteSpace:"nowrap",fontFamily:"DM Sans,sans-serif"}}>
                {cat==="breakfast"?"☀️":cat==="soup"?"🍲":cat==="main"?"🍖":"⭐"}<br/>{catLabel[cat].split(" ")[0]}
              </button>
            ))}
          </div>
          {/* Dish horizontal scroll */}
          <div className="mdish-row">
            {catItems.length===0&&<div style={{fontSize:12,color:"var(--ink3)",padding:"16px 0"}}>No dishes available</div>}
            {catItems.map(dish=>{
              const blocked=dietBlock(dish,userDiet);
              const avl=!blocked&&(inv[dish.id]||0)>0;
              return(
                <div key={dish.id} className={`mdish-card${selected?.id===dish.id?" sel":""}${!avl?" grayed":""}`}
                  onClick={()=>avl&&setSelected(p=>p?.id===dish.id?null:dish)}>
                  <div style={{height:75,overflow:"hidden",position:"relative"}}>
                    <img src={dish.img} alt={dn(dish,lang)} style={{width:"100%",height:"100%",objectFit:"cover"}}
                      onError={e=>{e.target.parentElement.style.background="var(--gxp)";e.target.style.display="none";}}/>
                    {dish.fresh&&<div style={{position:"absolute",top:3,left:3,background:"rgba(181,113,31,.9)",color:"white",fontSize:8,fontWeight:700,borderRadius:20,padding:"1px 5px"}}>⚡</div>}
                    {selected?.id===dish.id&&<div style={{position:"absolute",inset:0,background:"rgba(61,122,53,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:22,color:"var(--g)",background:"white",borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>✓</span></div>}
                  </div>
                  <div style={{padding:"6px 7px"}}>
                    <div style={{fontSize:10,fontWeight:600,lineHeight:1.3,marginBottom:2,color:"var(--ink)"}}>{dn(dish,lang).slice(0,20)}</div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:9,color:"var(--a)",fontWeight:600}}>{dish.kcal} kcal</span>
                      <span style={{fontSize:9,color:"var(--g)",fontWeight:700}}>{dish.price}€</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kcal + delivery summary for selected day */}
        {(dayKcal>0||dayPrice>0)&&(
          <div style={{background:"var(--surf)",borderRadius:12,border:"1px solid var(--bd)",padding:"10px 13px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <span style={{fontSize:12,color:"var(--ink2)"}}>{day.name} · {dayKcal} kcal</span>
              <span style={{fontFamily:"Playfair Display,serif",fontSize:17,fontWeight:700,color:"var(--g)"}}>{dayPrice.toFixed(2)}€</span>
            </div>
            <div className="kb"><div className="kbf" style={{width:`${pct}%`,background:pct>105?"var(--rose)":pct>=70?"var(--gm)":"var(--a)"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--ink3)",marginTop:3}}>
              <span>{pct}% of {target} kcal</span>
              <span style={{color:grandTotal>=FREE_THRESHOLD?"var(--g)":"var(--a)",fontWeight:600}}>{grandTotal>=FREE_THRESHOLD?t.free_delivery:`${grandTotal.toFixed(0)}€ / 50€ for free delivery`}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE HERO (compact single-column)
══════════════════════════════════════════════════════ */
function MobileHero({ onStart, t, lang }) {
  return (
    <div style={{paddingBottom:14}}>
      <div style={{background:"linear-gradient(160deg,#192b16,#2a5c24)",padding:"32px 20px 28px"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.1)",borderRadius:30,padding:"4px 12px",marginBottom:14}}>
          <span style={{width:6,height:6,background:"#86efac",borderRadius:"50%",display:"inline-block"}}/>
          <span style={{color:"rgba(255,255,255,.75)",fontSize:11}}>{t.hero_badge}</span>
        </div>
        <h1 style={{fontFamily:"Playfair Display,serif",fontSize:28,color:"white",lineHeight:1.15,marginBottom:10,fontStyle:"italic",whiteSpace:"pre-line"}}>{t.hero_h}</h1>
        <p style={{color:"rgba(255,255,255,.6)",fontSize:13,lineHeight:1.7,marginBottom:20}}>{t.hero_sub}</p>
        <button className="btn ba lg" style={{width:"100%",justifyContent:"center"}} onClick={onStart}>{t.hero_cta}</button>
        {/* Mini food grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:18}}>
          {ALL_DISHES.slice(0,4).map(dish=>(
            <div key={dish.id} style={{borderRadius:10,overflow:"hidden",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)"}}>
              <div style={{height:68,overflow:"hidden"}}>
                <img src={dish.img} alt={dn(dish,lang)} style={{width:"100%",height:"100%",objectFit:"cover"}}
                  onError={e=>{e.target.parentElement.style.background="rgba(255,255,255,.06)";e.target.style.display="none";}}/>
              </div>
              <div style={{padding:"6px 8px"}}>
                <div style={{color:"white",fontSize:10,fontWeight:600,lineHeight:1.3}}>{dn(dish,lang).slice(0,22)}</div>
                <div style={{color:"rgba(255,255,255,.5)",fontSize:9,marginTop:1}}>{dish.price}€</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"20px 16px 0",display:"flex",flexDirection:"column",gap:12}}>
        {[[t.feat1_h,t.feat1_t,"🧑‍🍳"],[t.feat2_h,t.feat2_t,"📅"],[t.feat3_h,t.feat3_t,"🚚"]].map(([h,tx,ico])=>(
          <div key={h} style={{display:"flex",gap:13,alignItems:"flex-start",background:"var(--surf)",borderRadius:12,padding:"12px 14px",border:"1px solid var(--bd)"}}>
            <span style={{fontSize:24,flexShrink:0}}>{ico}</span>
            <div><div style={{fontFamily:"Playfair Display,serif",fontSize:15,marginBottom:3}}>{h}</div><div style={{fontSize:12,color:"var(--ink2)",lineHeight:1.6}}>{tx}</div></div>
          </div>
        ))}
        <button className="btn bp lg" style={{width:"100%",justifyContent:"center",marginTop:4}} onClick={onStart}>{t.cta_btn}</button>
      </div>
    </div>
  );
}


export default function App() {
  const [lang,setLang]       = useState("en");
  const [page,setPage]       = useState("home");
  const [user,setUser]       = useState(null);
  const [userDiet,setUserDiet] = useState({noLactose:false,noGluten:false,vegan:false});
  const [authM,setAuthM]     = useState(null);
  const [profileOpen,setProfileOpen] = useState(false);
  const [checkout,setChk]    = useState(null);
  const [toast,setToast]     = useState(null);
  const [langOpen,setLangOpen] = useState(false);
  const tRef = useRef(null);
  const t = T[lang]||T.en;
  const isMobile = useMedia("(max-width: 700px)");

  const showToast = useCallback((msg,type="info")=>{
    clearTimeout(tRef.current);
    setToast({msg,type});
    tRef.current = setTimeout(()=>setToast(null),3400);
  },[]);

  const handleAuth = u => { setUser(u); setAuthM(null); showToast(`${t.welcome} ${u.name}!`,"success"); };
  const goPlanner  = () => { if(!user){setAuthM("login");return;} setPage("planner"); };
  const tc = toast ? `toast ${{success:"tok",error:"ter",warn:"twn",info:"tin"}[toast.type]||"tin"}` : "";

  const activeDietCount = Object.values(userDiet).filter(Boolean).length;

  return(
    <>
      <style>{CSS}</style>

      {/* Mobile top bar (logo + lang only) */}
      {isMobile&&(
        <div style={{height:50,background:"var(--surf)",borderBottom:"1px solid var(--bd)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 14px",position:"sticky",top:0,zIndex:200}}>
          <div className="logo" onClick={()=>setPage("home")}><span style={{fontSize:20}}>🍽️</span><span className="logo-t">{t.brand}</span></div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{position:"relative"}}>
              <button className={`lang-btn${langOpen?" on":""}`} onClick={()=>setLangOpen(p=>!p)}>{LANGS.find(l=>l.code===lang)?.flag} {lang.toUpperCase()} ▾</button>
              {langOpen&&<div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:"var(--surf)",border:"1px solid var(--bd2)",borderRadius:10,boxShadow:"0 6px 20px rgba(0,0,0,.12)",zIndex:300,overflow:"hidden",minWidth:130}} className="fi">
                {LANGS.map(l=><button key={l.code} onClick={()=>{setLang(l.code);setLangOpen(false);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 13px",border:"none",background:lang===l.code?"var(--gp)":"transparent",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:lang===l.code?600:400,color:lang===l.code?"var(--g)":"var(--ink)"}}><span style={{fontSize:16}}>{l.flag}</span>{l.label}</button>)}
              </div>}
            </div>
          </div>
        </div>
      )}

      {/* Desktop nav */}
      <nav className="nav">
        <div className="navi">
          <div className="logo" onClick={()=>setPage("home")}>
            <span style={{fontSize:20}}>🍽️</span>
            <span className="logo-t">{t.brand}</span>
          </div>
          <div style={{display:"flex",gap:1,flex:1,justifyContent:"center",flexWrap:"wrap"}}>
            {[["home",t.nav_home],["menu",t.nav_menu],["planner",t.nav_planner]].map(([p,l])=>(
              <button key={p} className={`nt${page===p?" on":""}`} onClick={()=>p==="planner"?goPlanner():setPage(p)}>{l}</button>
            ))}
            {user&&<button className={`nt${page==="orders"?" on":""}`} onClick={()=>setPage("orders")}>{t.nav_orders}</button>}
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
            {/* Language dropdown */}
            <div style={{position:"relative"}}>
              <button className={`lang-btn${langOpen?" on":""}`} onClick={()=>setLangOpen(p=>!p)}>
                {LANGS.find(l=>l.code===lang)?.flag} {lang.toUpperCase()} ▾
              </button>
              {langOpen&&(
                <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:"var(--surf)",border:"1px solid var(--bd2)",borderRadius:10,boxShadow:"0 6px 20px rgba(0,0,0,.12)",zIndex:300,overflow:"hidden",minWidth:130}} className="fi">
                  {LANGS.map(l=>(
                    <button key={l.code} onClick={()=>{setLang(l.code);setLangOpen(false);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 13px",border:"none",background:lang===l.code?"var(--gp)":"transparent",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:lang===l.code?600:400,color:lang===l.code?"var(--g)":"var(--ink)",transition:"background .11s"}}>
                      <span style={{fontSize:16}}>{l.flag}</span>{l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user?(
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <button onClick={()=>setProfileOpen(true)} style={{background:"var(--gp)",borderRadius:8,padding:"5px 11px",display:"flex",alignItems:"center",gap:6,border:"none",cursor:"pointer"}}>
                  <div style={{width:22,height:22,background:"var(--g)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:10,fontWeight:700}}>{user.name[0].toUpperCase()}</div>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--g)"}}>{user.name}</span>
                  {activeDietCount>0&&<span style={{background:"var(--a)",color:"white",fontSize:9,fontWeight:800,borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center"}}>{activeDietCount}</span>}
                </button>
                <button className="btn bg sm" onClick={()=>setUser(null)}>{t.logout}</button>
              </div>
            ):(
              <>
                <button className="btn bg sm" onClick={()=>setAuthM("login")}>{t.login}</button>
                <button className="btn bp sm" onClick={()=>setAuthM("register")}>{t.register}</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {langOpen&&<div style={{position:"fixed",inset:0,zIndex:290}} onClick={()=>setLangOpen(false)}/>}

      <main style={{minHeight:isMobile?"calc(100vh - 50px - 62px)":"calc(100vh - 56px)"}}>
        {/* HOME */}
        {page==="home" && (isMobile
          ? <MobileHero onStart={goPlanner} t={t} lang={lang}/>
          : <HeroPage onStart={goPlanner} user={user} onAuth={()=>setAuthM("login")} t={t} lang={lang}/>
        )}
        {/* MENU */}
        {page==="menu" && <MenuPage t={t} lang={lang} userDiet={userDiet}/>}
        {/* ORDERS */}
        {page==="orders" && user && <OrdersPage t={t}/>}
        {/* PLANNER */}
        {page==="planner" && (user
          ? (isMobile
              ? <MobilePlannerPage showToast={showToast} onCheckout={c=>setChk(c)} t={t} lang={lang} userDiet={userDiet}/>
              : <PlannerPage showToast={showToast} onCheckout={c=>setChk(c)} t={t} lang={lang} userDiet={userDiet}/>
            )
          : <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"56vh",gap:14,padding:32,textAlign:"center"}}>
              <span style={{fontSize:50}}>🔐</span>
              <h2 style={{fontSize:isMobile?22:27,fontStyle:"italic"}}>{t.locked_h}</h2>
              <p style={{color:"var(--ink2)",fontSize:13,maxWidth:340}}>{t.locked_sub}</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
                <button className="btn bp md" onClick={()=>setAuthM("register")}>{t.locked_acc}</button>
                <button className="btn bg md" onClick={()=>setAuthM("login")}>{t.login}</button>
              </div>
            </div>
        )}
      </main>

      {!isMobile&&(
        <footer style={{background:"var(--ink)",color:"rgba(255,255,255,.35)",padding:"20px 14px",textAlign:"center",fontSize:12}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:16,color:"rgba(255,255,255,.7)",marginBottom:4,fontStyle:"italic"}}>🍽️ {t.brand}</div>
          <p>Lisbon · Mon, Wed, Fri before noon · {t.delivery_note}</p>
        </footer>
      )}

      {/* Mobile bottom nav */}
      <MobileNav page={page} setPage={p=>{ if(p==="planner")goPlanner(); else setPage(p); }}
        user={user} onProfile={()=>setProfileOpen(true)} onAuth={()=>setAuthM("login")} t={t}/>

      {authM&&<AuthModal mode={authM} onClose={()=>setAuthM(null)} onAuth={handleAuth} t={t}/>}
      {profileOpen&&user&&<ProfileModal user={user} userDiet={userDiet} onSave={d=>{setUserDiet(d);setProfileOpen(false);showToast("✅ Preferences saved","success");}} onClose={()=>setProfileOpen(false)} t={t}/>}
      {checkout&&<Checkout cart={checkout} onClose={()=>setChk(null)} t={t}/>}
      {toast&&<div className={tc}>{toast.msg}</div>}
    </>
  );
}
