Фокус: **MVP, 3–4 недели разработки**, стек **Supabase + веб-app + встроенная админка**.

---

# PRD — Meal Planning & Ordering System

## 1. Overview

**Product name:** Meal Planner (working title)

**Goal:**
Создать веб-приложение, позволяющее клиентам планировать рацион питания на неделю, видеть КБЖУ, оформлять заказы с учётом складских остатков и объединения заказов в доставочные блоки.

Система должна:

* позволять клиентам **планировать завтрак / обед / ужин**
* автоматически считать **калории и КБЖУ**
* учитывать **складские остатки**
* группировать заказы по **окнам доставки**
* предоставлять **админку для управления блюдами, партиями и заказами**

---

# 2. Основные роли

### Customer

Клиент планирует питание и оформляет заказ.

Может:

* просматривать меню
* фильтровать блюда по категориям и ограничениям
* составлять рацион на неделю
* видеть КБЖУ (на блюдо и итог за день)
* оформлять заказ
* отслеживать порог бесплатной доставки
* видеть историю заказов
* управлять адресами доставки
* менять блюда в плане до cutoff-времени

---

### Admin

Владелец сервиса.

Может:

* добавлять и редактировать блюда
* фиксировать приход блюд (партии)
* редактировать КБЖУ и цены
* управлять остатками
* видеть все заказы, менять статусы
* управлять доставками и зонами
* управлять промокодами
* видеть аналитику (выручка, food waste, заказы)

---

# 3. Основные сценарии (User Flows)

## 3.1 Регистрация и вход

1. Клиент заходит на `/login`
2. Вход по **email + пароль** (Supabase Auth)
3. При первом входе — онбординг:
   * указание адреса доставки
   * выбор пищевых ограничений (аллергены, предпочтения)
4. Профиль сохраняется и доступен для редактирования в `/profile`

---

## 3.2 Планирование рациона

Клиент:

1. открывает план недели (`/planner`)
2. выбирает день
3. выбирает:

   * завтрак
   * обед
   * ужин
   * допы (снэки, напитки)
4. система показывает итог за день:

```
Calories: 2100 kcal
Protein: 140g
Fat: 60g
Carbs: 210g
Weight: 850g
Price: 32€
```

5. система показывает итог за неделю и прогресс к бесплатной доставке

---

## 3.3 Замена блюд в плане

Клиент может заменить блюдо в плане:

1. нажимает на блюдо в плане
2. видит список доступных замен (с учётом meal_type и остатков)
3. выбирает новое блюдо
4. КБЖУ и цена пересчитываются автоматически

Ограничение: замена доступна **до cutoff_time** соответствующего delivery_slot.

---

## 3.4 Проверка ограничений (фильтры)

Пользователь задаёт в профиле пищевые ограничения.

Категории фильтров:

```
Аллергены:
  gluten, nuts, eggs, soy, sesame, shellfish

Продукты:
  no_lactose, no_meat, no_fish, no_pork

Предпочтения:
  vegetarian, vegan

Исключения (стоп-лист):
  конкретные блюда или ингредиенты, которые клиент не хочет видеть
```

Система автоматически **скрывает блюда**, не подходящие под ограничения.

---

## 3.5 Проверка склада

При выборе блюда:

система проверяет

```
available_portions > 0
AND expires_at > delivery_date
```

и резервирует порцию (soft reserve до оформления заказа).

Конкурентный доступ:

```
UPDATE dish_batches
SET portions_remaining = portions_remaining - 1
WHERE id = :batch_id
AND portions_remaining > 0
RETURNING portions_remaining
```

Если `RETURNING` пуст — порция недоступна, показать клиенту сообщение.

---

## 3.6 Объединение заказов по доставке

Доставка происходит **3 раза в неделю**.

Например:

```
Monday delivery
Wednesday delivery
Friday delivery
```

Система автоматически объединяет блюда.

Пример:

```
Mon delivery:
  Tue breakfast
  Tue lunch
  Wed breakfast

Wed delivery:
  Wed dinner
  Thu meals
```

---

## 3.7 Бесплатная доставка

Система показывает индикатор:

```
Free delivery from: 60€
Your order: 47€

Add 13€ more for free delivery
```

Стоимость доставки (если порог не достигнут): **5€**.

---

## 3.8 Оформление заказа

1. Клиент нажимает «Оформить заказ» в планировщике
2. Система показывает:
   * список блюд по доставкам
   * итоговую сумму
   * адрес доставки (можно сменить)
   * промокод (опционально)
3. Клиент нажимает «Оплатить»
4. Редирект на Stripe Checkout
5. После успешной оплаты — заказ переходит в `confirmed`
6. Клиент видит подтверждение и может перейти в историю заказов

---

## 3.9 Отмена и изменение заказа

* Отмена возможна до `cutoff_time` delivery_slot (например, за 24ч до доставки)
* При отмене — порции возвращаются на склад, деньги возвращаются
* После cutoff — отмена невозможна

---

# 4. Основные функции

## 4.1 Меню блюд

Каждое блюдо содержит:

```
name
description
photo
calories
protein
fat
carbs
weight_grams
price
tags[]
allergens[]
category (breakfast / lunch / dinner / snack / drink)
```

Теги:

```
vegetarian
vegan
lactose_free
gluten_free
high_protein
low_carb
spicy
```

---

## 4.2 Партии блюд (Batch system)

Админ добавляет партии.

Пример:

```
Borscht
20 portions
prepared: today
expires: 3 days
cost_per_portion: 3.50€
```

Система уменьшает остаток при заказах.

### Списание просроченных партий

Cron job (ежедневно в 00:00):

```
UPDATE dish_batches
SET status = 'expired'
WHERE expires_at < NOW()
AND status = 'active'
```

Просроченные партии не показываются в меню. Админ видит их в отчёте food waste.

---

## 4.3 Склад

Система хранит:

```
dish_batch
portions_total
portions_remaining
status (active / expired / depleted)
```

---

## 4.4 Ограничения блюд

Можно задать условия:

```
available_only_after_delivery
available_for_lunch_only
available_for_breakfast_only
min_order_quantity
max_per_order
```

---

## 4.5 Планировщик

UI:

```
Week Planner

Mon
Breakfast  [ Egg Omelette ]      409 kcal, 175g
Lunch      [ Chicken Bowl ]      476 kcal, 280g
Dinner     [ Salmon + Rice ]     186 kcal, 250g

Day total: 1071 kcal | P: 75g | F: 44g | C: 94g | 32€

Tue
Breakfast
Lunch
Dinner
```

---

## 4.6 Подсчёт КБЖУ

Система автоматически считает:

```
Per day:
  sum(calories), sum(protein), sum(fat), sum(carbs), sum(weight_grams)

Per week:
  avg(daily_calories)

Per order:
  sum(price)
```

---

# 5. Ценообразование

## 5.1 Цена блюда

Каждое блюдо имеет фиксированную цену (`price`), устанавливаемую админом.

```
Egg Omelette — 8.50€
Chicken Bowl — 12.00€
Salmon + Rice — 14.50€
```

## 5.2 Стоимость заказа

```
order_total = sum(item.price * item.quantity)
delivery_fee = order_total >= 60€ ? 0 : 5€
final_total = order_total + delivery_fee - discount
```

## 5.3 Промокоды

```
type: percentage (10%) или fixed (5€)
min_order_amount
max_uses
valid_from / valid_until
```

---

# 6. Оплата

## 6.1 Способ оплаты

Интеграция с **Stripe**:

* Stripe Checkout для разовых заказов
* Карты (Visa, Mastercard)
* Apple Pay / Google Pay

## 6.2 Flow

```
Client → POST /orders → create order (status: pending)
       → redirect to Stripe Checkout
Stripe webhook → order status: confirmed
               → portions reserved permanently
```

## 6.3 Возвраты

При отмене до cutoff:

```
Stripe Refund API → full refund
order status → cancelled
portions → returned to batch
```

---

# 7. Доставка

## 7.1 Зоны доставки

MVP: одна зона (город + область).

```
delivery_zones:
  id
  name
  polygon (GeoJSON)
  delivery_fee
  min_order_amount
  is_active
```

Адрес клиента проверяется на принадлежность зоне при оформлении.

## 7.2 Окна доставки

```
delivery_slots:
  id
  date
  cutoff_time (дедлайн изменения заказа)
  delivery_day
  zone_id
  max_orders (опционально)
```

## 7.3 Временные слоты

MVP: доставка в течение дня (без выбора часового окна).

V2: выбор утро / день / вечер.

---

# 8. Уведомления

MVP — email через Supabase Edge Functions + Resend/SendGrid:

```
order_confirmed     — "Ваш заказ подтверждён"
order_delivering    — "Заказ передан курьеру"
order_delivered     — "Заказ доставлен"
order_cancelled     — "Заказ отменён, средства возвращены"
plan_cutoff_reminder — "До дедлайна изменения заказа осталось 3 часа"
```

---

# 9. Админка

Админка встроена в веб-приложение.

Доступ только для роли `admin`.

---

## 9.1 Управление блюдами

Admin может:

```
create dish
edit dish (name, description, macros, price, weight, tags, allergens, category)
upload photo (max 2MB, jpg/png/webp, auto-resize to 800px)
archive dish (soft delete)
```

---

## 9.2 Приход блюд

Admin фиксирует:

```
dish
portions
date
expiry
cost_per_portion (себестоимость)
```

---

## 9.3 Управление заказами

Admin видит:

```
orders grouped by delivery slot
```

Пример:

```
Delivery Monday 17.03

John — 3 meals — 35€ — confirmed
Anna — 5 meals — 52€ — confirmed
Mike — 2 meals — 22€ — pending payment
```

Admin может менять статус:

```
pending → confirmed → preparing → delivering → delivered
                                              → cancelled
```

---

## 9.4 Склад

Admin видит:

```
Borscht
  Batch #42: remaining 12 / 20, expires 19.03
  Batch #38: remaining 0 / 15, expired 16.03

Chicken bowl
  Batch #45: remaining 7 / 10, expires 20.03
```

---

## 9.5 Аналитика (dashboard)

```
Orders today / this week
Revenue today / this week
Food waste % (expired portions / total portions)
Popular dishes (top 10)
Active customers
```

---

## 9.6 Промокоды

```
create / edit / deactivate promo codes
view usage stats
```

---

# 10. Техническая архитектура

## Frontend

Vite + React (SPA, статика на GitHub Pages)

Роутинг: react-router-dom (client-side, hash или browser с fallback на 404.html → index.html)

Routes:

```
/login
/register
/profile          — настройки, адреса, ограничения
/planner          — недельный планировщик
/menu             — каталог блюд
/orders           — история заказов
/orders/:id       — детали заказа
/checkout         — оформление
/admin            — dashboard
/admin/dishes     — управление блюдами
/admin/inventory  — склад и партии
/admin/orders     — управление заказами
/admin/deliveries — слоты доставки
/admin/promos     — промокоды
/admin/users      — пользователи
```

---

## Backend

Supabase

Используется:

```
Postgres — основная БД
Auth — аутентификация (email + password)
Storage — фото блюд (bucket: dish-photos, public read)
Row Level Security — разграничение доступа
Edge Functions — webhooks (Stripe), cron jobs (списание), email
Realtime — обновление остатков в реальном времени (опционально)
```

---

# 11. Database Schema

## profiles

```sql
id              uuid PRIMARY KEY REFERENCES auth.users(id)
email           text NOT NULL
full_name       text
phone           text
role            text NOT NULL DEFAULT 'customer'  -- 'customer' | 'admin'
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

---

## user_preferences

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE
allergens       text[]    -- ['gluten', 'nuts', 'eggs']
excluded_tags   text[]    -- ['meat', 'fish']
stop_list       uuid[]    -- dish IDs to exclude
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

---

## addresses

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE
label           text      -- 'Home', 'Work'
street          text NOT NULL
city            text NOT NULL
postal_code     text
country         text NOT NULL DEFAULT 'DE'
lat             numeric
lng             numeric
is_default      boolean DEFAULT false
created_at      timestamptz DEFAULT now()
```

---

## dishes

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
description     text
photo_url       text
calories        integer NOT NULL DEFAULT 0
protein         numeric(5,1) NOT NULL DEFAULT 0
fat             numeric(5,1) NOT NULL DEFAULT 0
carbs           numeric(5,1) NOT NULL DEFAULT 0
weight_grams    integer NOT NULL DEFAULT 0
price           numeric(8,2) NOT NULL
category        text NOT NULL  -- 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink'
tags            text[]         -- ['vegetarian', 'high_protein', ...]
allergens       text[]         -- ['gluten', 'nuts', ...]
is_active       boolean DEFAULT true
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

---

## dish_batches

```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
dish_id             uuid REFERENCES dishes(id) ON DELETE CASCADE
portions_total      integer NOT NULL
portions_remaining  integer NOT NULL
cost_per_portion    numeric(8,2)    -- себестоимость
status              text NOT NULL DEFAULT 'active'  -- 'active' | 'expired' | 'depleted'
prepared_at         timestamptz NOT NULL DEFAULT now()
expires_at          timestamptz NOT NULL
created_at          timestamptz DEFAULT now()
```

---

## meal_plans

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE
week_start      date NOT NULL    -- всегда понедельник
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()

UNIQUE(user_id, week_start)
```

---

## meal_plan_items

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
meal_plan_id    uuid REFERENCES meal_plans(id) ON DELETE CASCADE
dish_id         uuid REFERENCES dishes(id)
day             date NOT NULL
meal_type       text NOT NULL    -- 'breakfast' | 'lunch' | 'dinner' | 'extra'
batch_id        uuid REFERENCES dish_batches(id)
created_at      timestamptz DEFAULT now()

UNIQUE(meal_plan_id, day, meal_type)
```

---

## orders

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id)
delivery_slot_id uuid REFERENCES delivery_slots(id)
address_id      uuid REFERENCES addresses(id)
status          text NOT NULL DEFAULT 'pending'
                -- 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'
subtotal        numeric(8,2) NOT NULL   -- сумма блюд
delivery_fee    numeric(8,2) NOT NULL DEFAULT 0
discount        numeric(8,2) NOT NULL DEFAULT 0
total_price     numeric(8,2) NOT NULL   -- subtotal + delivery_fee - discount
promo_code_id   uuid REFERENCES promo_codes(id)
stripe_session_id text
stripe_payment_id text
cancelled_at    timestamptz
cancel_reason   text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

---

## order_items

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
order_id        uuid REFERENCES orders(id) ON DELETE CASCADE
dish_id         uuid REFERENCES dishes(id)
batch_id        uuid REFERENCES dish_batches(id)
quantity        integer NOT NULL DEFAULT 1
unit_price      numeric(8,2) NOT NULL   -- цена на момент заказа
created_at      timestamptz DEFAULT now()
```

---

## delivery_slots

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
date            date NOT NULL
cutoff_time     timestamptz NOT NULL    -- дедлайн на изменения
delivery_day    date NOT NULL
max_orders      integer                 -- лимит заказов (null = без лимита)
created_at      timestamptz DEFAULT now()
```

---

## delivery_zones

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
polygon         jsonb                   -- GeoJSON для проверки адреса
delivery_fee    numeric(8,2) NOT NULL DEFAULT 5.00
min_free_delivery numeric(8,2) NOT NULL DEFAULT 60.00
is_active       boolean DEFAULT true
created_at      timestamptz DEFAULT now()
```

---

## promo_codes

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
code            text NOT NULL UNIQUE
type            text NOT NULL           -- 'percentage' | 'fixed'
value           numeric(8,2) NOT NULL   -- 10 (%) или 5.00 (€)
min_order_amount numeric(8,2)
max_uses        integer
current_uses    integer DEFAULT 0
valid_from      timestamptz NOT NULL
valid_until     timestamptz NOT NULL
is_active       boolean DEFAULT true
created_at      timestamptz DEFAULT now()
```

---

## order_status_history

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
order_id        uuid REFERENCES orders(id) ON DELETE CASCADE
status          text NOT NULL
changed_by      uuid REFERENCES profiles(id)
note            text
created_at      timestamptz DEFAULT now()
```

---

# 12. Row Level Security

```sql
-- profiles: users see only own profile, admins see all
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id OR is_admin());

-- dishes: everyone can read active dishes, admins can modify
CREATE POLICY "dishes_read" ON dishes
  FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "dishes_write" ON dishes
  FOR ALL USING (is_admin());

-- orders: users see own orders, admins see all
CREATE POLICY "orders_own" ON orders
  FOR ALL USING (auth.uid() = user_id OR is_admin());

-- meal_plans: users see only own plans
CREATE POLICY "plans_own" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);

-- dish_batches: everyone reads, admins write
CREATE POLICY "batches_read" ON dish_batches
  FOR SELECT USING (true);
CREATE POLICY "batches_write" ON dish_batches
  FOR ALL USING (is_admin());
```

Helper function:

```sql
CREATE FUNCTION is_admin() RETURNS boolean AS $$
  SELECT role = 'admin' FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;
```

---

# 13. API

Supabase auto-generates REST API. Дополнительно — Edge Functions:

```
-- Client API (через Supabase client SDK + RLS)
GET    /rest/v1/dishes?is_active=eq.true&select=*
GET    /rest/v1/meal_plans?user_id=eq.:uid
POST   /rest/v1/meal_plan_items
DELETE /rest/v1/meal_plan_items?id=eq.:id
GET    /rest/v1/orders?user_id=eq.:uid&order=created_at.desc
GET    /rest/v1/delivery_slots?date=gte.:today

-- Supabase Edge Functions (serverless, т.к. SPA не имеет серверной части)
POST   /functions/v1/checkout        — создаёт order + Stripe session
POST   /functions/v1/stripe-webhook  — обработка Stripe events
POST   /functions/v1/apply-promo     — валидация и применение промокода
POST   /functions/v1/cancel-order    — отмена с возвратом

-- Admin (через Supabase client SDK + RLS)
POST   /rest/v1/dishes
PATCH  /rest/v1/dishes?id=eq.:id
POST   /rest/v1/dish_batches
GET    /rest/v1/dish_batches?status=eq.active&order=expires_at.asc
GET    /rest/v1/orders?order=created_at.desc
PATCH  /rest/v1/orders?id=eq.:id
```

---

# 14. Админский UI

Страницы:

```
Admin Dashboard     — метрики, графики
Dishes              — CRUD блюд с фото, фильтрация
Inventory           — партии, остатки, food waste отчёт
Orders              — все заказы, фильтр по статусу и доставке
Deliveries          — управление слотами доставки
Promo Codes         — создание и управление промокодами
Users               — список клиентов, роли
```

---

# 15. MVP Scope

### Входит

* меню блюд с ценами, КБЖУ, весом
* планирование рациона на неделю
* пищевые ограничения и фильтры (аллергены, стоп-лист)
* склад и партии с автосписанием
* заказы с оплатой через Stripe
* доставка 3 раза в неделю, порог бесплатной доставки
* статусы заказов и история
* адреса доставки
* админка (блюда, склад, заказы, доставки)
* email-уведомления (подтверждение, доставка)
* промокоды

---

### Не входит (V2)

* рекомендации и AI подбор рациона
* подписки (recurring billing)
* мобильное приложение
* выбор часового окна доставки
* несколько зон доставки с разными ценами
* программа лояльности / бонусы
* отзывы и рейтинги блюд
* чат поддержки

---

# 16. Метрики успеха

```
weekly active users
orders per week
average order value (€)
conversion rate (planner → order)
food waste % (expired portions / total portions)
delivery on-time rate
customer retention (repeat orders)
```

---

# 17. Пример пользовательского интерфейса

Planner:

```
MONDAY                                          Day total: 1071 kcal | 32€

Breakfast
[ Круассан с семгой ]         409 kcal, 175g    8.50€

Lunch
[ Митболы и брусничный соус ] 476 kcal, 280g    12.00€

Dinner
[ Стейк из курицы с овощами ] 186 kcal, 250g    11.50€

P: 75g | F: 44g | C: 94g

──────────────────────────
Week total: 7490 kcal | 224€
Free delivery ✓
```

---

# 18. Пример админского workflow

Админ приготовил блюда.

Добавляет:

```
Dish: Borscht
Portions: 20
Expiry: 3 days
Cost: 3.50€/portion
```

Система:

```
→ inventory updated
→ available in menu
→ auto-expires in 3 days
→ appears in food waste report if unsold
```

---

# 19. Стек разработки

```
Frontend:       Vite + React (SPA), Tailwind CSS
Routing:        react-router-dom
State:          React Query (@tanstack/react-query)
Backend:        Supabase (Postgres, Auth, Storage, Edge Functions, Realtime)
Payments:       Stripe (Checkout, Webhooks, Refunds)
Email:          Resend (transactional emails)
Hosting:        GitHub Pages (статика), Supabase (backend)
CI/CD:          GitHub Actions → vite build → deploy to gh-pages
Monitoring:     Sentry (errors)
```

---

# 20. Безопасность

```
Auth:           Supabase Auth (email + password, JWT tokens)
RLS:            на всех таблицах (см. раздел 12)
Input:          валидация через Zod на клиенте и в Edge Functions
Uploads:        max 2MB, only jpg/png/webp, sanitize filenames
Payments:       Stripe webhook signature verification
CORS:           ограничен доменом приложения
Rate limiting:  Supabase built-in + Edge Function limits
```
