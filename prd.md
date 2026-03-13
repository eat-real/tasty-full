Фокус: **MVP, 2–3 недели разработки**, стек **Supabase + веб-app + встроенная админка**.

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
* оформлять заказ (оплата при доставке)
* отслеживать порог бесплатной доставки
* видеть историю заказов
* указать адрес доставки
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
* управлять доставками

---

# 3. Основные сценарии (User Flows)

## 3.1 Регистрация и вход

1. Клиент заходит на `/login`
2. Вход по **email + пароль** (Supabase Auth)
3. При первом входе — указание адреса доставки и пищевых ограничений
4. Профиль доступен для редактирования в `/profile`

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

1. нажимает на блюдо в плане
2. видит список доступных замен (с учётом meal_type и остатков)
3. выбирает новое блюдо, КБЖУ и цена пересчитываются

Замена доступна **до cutoff_time** соответствующего delivery_slot.

---

## 3.4 Фильтры и ограничения

Пользователь задаёт в профиле:

```
Аллергены:    gluten, nuts, eggs, soy, sesame, shellfish
Продукты:     no_lactose, no_meat, no_fish, no_pork
Предпочтения: vegetarian, vegan
Стоп-лист:    конкретные блюда, которые клиент не хочет видеть
```

Система автоматически **скрывает блюда**, не подходящие под ограничения.

---

## 3.5 Проверка склада

При выборе блюда система проверяет:

```
available_portions > 0 AND expires_at > delivery_date
```

Конкурентный доступ (atomic):

```sql
UPDATE dish_batches
SET portions_remaining = portions_remaining - 1
WHERE id = :batch_id AND portions_remaining > 0
RETURNING portions_remaining
```

Если `RETURNING` пуст — порция недоступна.

---

## 3.6 Объединение заказов по доставке

Доставка **3 раза в неделю** (Пн / Ср / Пт).

```
Mon delivery → Tue breakfast, Tue lunch, Wed breakfast
Wed delivery → Wed dinner, Thu meals
Fri delivery → Fri dinner, Sat–Sun meals
```

---

## 3.7 Бесплатная доставка

```
Free delivery from: 60€
Your order: 47€ → Add 13€ more for free delivery
```

Стоимость доставки если порог не достигнут: **5€**.

---

## 3.8 Оформление заказа

1. Клиент нажимает «Оформить заказ»
2. Видит: список блюд по доставкам, итог, адрес
3. Выбирает способ оплаты: **наличные** или **перевод при доставке**
4. Подтверждает → заказ в статусе `pending`
5. Админ подтверждает → `confirmed`
6. Курьер доставляет, клиент оплачивает → `delivered`

---

## 3.9 Отмена заказа

* Отмена возможна до `cutoff_time` (за 24ч до доставки)
* При отмене — порции возвращаются на склад
* После cutoff — отмена невозможна

---

# 4. Основные функции

## 4.1 Меню блюд

Каждое блюдо:

```
name, description, photo
calories, protein, fat, carbs, weight_grams
price
category (breakfast / lunch / dinner / snack / drink)
tags[]       — vegetarian, vegan, lactose_free, gluten_free, high_protein, low_carb, spicy
allergens[]  — gluten, nuts, eggs, soy, sesame, shellfish
```

---

## 4.2 Партии блюд (Batch system)

Админ фиксирует приход:

```
Borscht — 20 portions — expires: 3 days — cost: 3.50€/portion
```

### Автосписание (cron ежедневно):

```sql
UPDATE dish_batches SET status = 'expired'
WHERE expires_at < NOW() AND status = 'active'
```

---

## 4.3 Планировщик

```
Week Planner

Mon
Breakfast  [ Egg Omelette ]      409 kcal, 175g    8.50€
Lunch      [ Chicken Bowl ]      476 kcal, 280g    12.00€
Dinner     [ Salmon + Rice ]     186 kcal, 250g    11.50€

Day total: 1071 kcal | P: 75g | F: 44g | C: 94g | 32€
```

---

## 4.4 Подсчёт КБЖУ

```
Per day:   sum(calories, protein, fat, carbs, weight)
Per week:  avg(daily_calories)
Per order: sum(price) + delivery_fee
```

---

# 5. Ценообразование

Каждое блюдо имеет фиксированную цену, устанавливаемую админом.

```
order_total  = sum(item.price * item.quantity)
delivery_fee = order_total >= 60€ ? 0 : 5€
final_total  = order_total + delivery_fee
```

---

# 6. Оплата

**Только при доставке:**

* Наличные
* Перевод (MBWay / банковский перевод)

Онлайн-оплата (Stripe) — в V2.

---

# 7. Доставка

**MVP:** одна зона доставки (город + окрестности).

Окна доставки:

```
delivery_slots:
  date, cutoff_time, delivery_day, max_orders
```

Доставка в течение дня (без выбора часового окна). Выбор слота (утро/день/вечер) — V2.

---

# 8. Админка

Встроена в веб-приложение, доступ по роли `admin`.

### Блюда

```
CRUD блюд (name, description, macros, price, weight, tags, allergens, category)
upload photo (max 2MB, jpg/png/webp)
archive dish (soft delete)
```

### Приход блюд

```
dish, portions, date, expiry, cost_per_portion
```

### Заказы

```
Delivery Monday 17.03

John — 3 meals — 35€ — confirmed
Anna — 5 meals — 52€ — pending
```

Статусы:

```
pending → confirmed → delivering → delivered
                                 → cancelled
```

### Склад

```
Borscht — Batch #42: 12/20, expires 19.03
Chicken bowl — Batch #45: 7/10, expires 20.03
```

### Dashboard

```
Orders today / this week
Revenue today / this week
Food waste %
Popular dishes (top 10)
```

---

# 9. Техническая архитектура

## Frontend

Vite + React (SPA, статика на GitHub Pages)

Роутинг: react-router-dom (hash или browser с 404.html fallback)

```
/login
/register
/profile          — настройки, адрес, ограничения
/planner          — недельный планировщик
/menu             — каталог блюд
/orders           — история заказов
/orders/:id       — детали заказа
/admin            — dashboard
/admin/dishes     — управление блюдами
/admin/inventory  — склад и партии
/admin/orders     — управление заказами
/admin/deliveries — слоты доставки
```

## Backend

Supabase:

```
Postgres       — основная БД
Auth           — email + password
Storage        — фото блюд (bucket: dish-photos, public read)
RLS            — разграничение доступа
Edge Functions — cron (списание партий)
```

---

# 10. Database Schema

## profiles

```sql
id          uuid PK REFERENCES auth.users(id)
email       text NOT NULL
full_name   text
phone       text
role        text NOT NULL DEFAULT 'customer'  -- 'customer' | 'admin'
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

## user_preferences

```sql
id            uuid PK DEFAULT gen_random_uuid()
user_id       uuid FK → profiles(id) ON DELETE CASCADE
allergens     text[]    -- ['gluten', 'nuts']
excluded_tags text[]    -- ['meat', 'fish']
stop_list     uuid[]    -- dish IDs
created_at    timestamptz DEFAULT now()
updated_at    timestamptz DEFAULT now()
```

## addresses

```sql
id          uuid PK DEFAULT gen_random_uuid()
user_id     uuid FK → profiles(id) ON DELETE CASCADE
label       text      -- 'Home', 'Work'
street      text NOT NULL
city        text NOT NULL
postal_code text
country     text NOT NULL DEFAULT 'PT'
is_default  boolean DEFAULT false
created_at  timestamptz DEFAULT now()
```

## dishes

```sql
id           uuid PK DEFAULT gen_random_uuid()
name         text NOT NULL
description  text
photo_url    text
calories     integer NOT NULL DEFAULT 0
protein      numeric(5,1) NOT NULL DEFAULT 0
fat          numeric(5,1) NOT NULL DEFAULT 0
carbs        numeric(5,1) NOT NULL DEFAULT 0
weight_grams integer NOT NULL DEFAULT 0
price        numeric(8,2) NOT NULL
category     text NOT NULL  -- 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink'
tags         text[]
allergens    text[]
is_active    boolean DEFAULT true
created_at   timestamptz DEFAULT now()
updated_at   timestamptz DEFAULT now()
```

## dish_batches

```sql
id                 uuid PK DEFAULT gen_random_uuid()
dish_id            uuid FK → dishes(id) ON DELETE CASCADE
portions_total     integer NOT NULL
portions_remaining integer NOT NULL
cost_per_portion   numeric(8,2)
status             text NOT NULL DEFAULT 'active'  -- 'active' | 'expired' | 'depleted'
prepared_at        timestamptz NOT NULL DEFAULT now()
expires_at         timestamptz NOT NULL
created_at         timestamptz DEFAULT now()
```

## meal_plans

```sql
id         uuid PK DEFAULT gen_random_uuid()
user_id    uuid FK → profiles(id) ON DELETE CASCADE
week_start date NOT NULL  -- always Monday
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
UNIQUE(user_id, week_start)
```

## meal_plan_items

```sql
id           uuid PK DEFAULT gen_random_uuid()
meal_plan_id uuid FK → meal_plans(id) ON DELETE CASCADE
dish_id      uuid FK → dishes(id)
day          date NOT NULL
meal_type    text NOT NULL  -- 'breakfast' | 'lunch' | 'dinner' | 'extra'
batch_id     uuid FK → dish_batches(id)
created_at   timestamptz DEFAULT now()
UNIQUE(meal_plan_id, day, meal_type)
```

## orders

```sql
id               uuid PK DEFAULT gen_random_uuid()
user_id          uuid FK → profiles(id)
delivery_slot_id uuid FK → delivery_slots(id)
address_id       uuid FK → addresses(id)
status           text NOT NULL DEFAULT 'pending'
                 -- 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled'
payment_method   text NOT NULL DEFAULT 'cash'  -- 'cash' | 'transfer'
subtotal         numeric(8,2) NOT NULL
delivery_fee     numeric(8,2) NOT NULL DEFAULT 0
total_price      numeric(8,2) NOT NULL
note             text          -- комментарий клиента
cancelled_at     timestamptz
cancel_reason    text
created_at       timestamptz DEFAULT now()
updated_at       timestamptz DEFAULT now()
```

## order_items

```sql
id         uuid PK DEFAULT gen_random_uuid()
order_id   uuid FK → orders(id) ON DELETE CASCADE
dish_id    uuid FK → dishes(id)
batch_id   uuid FK → dish_batches(id)
quantity   integer NOT NULL DEFAULT 1
unit_price numeric(8,2) NOT NULL
created_at timestamptz DEFAULT now()
```

## delivery_slots

```sql
id           uuid PK DEFAULT gen_random_uuid()
date         date NOT NULL
cutoff_time  timestamptz NOT NULL
delivery_day date NOT NULL
max_orders   integer  -- null = no limit
created_at   timestamptz DEFAULT now()
```

---

# 11. Row Level Security

```sql
CREATE FUNCTION is_admin() RETURNS boolean AS $$
  SELECT role = 'admin' FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- profiles: own or admin
CREATE POLICY "profiles_access" ON profiles
  FOR ALL USING (auth.uid() = id OR is_admin());

-- dishes: public read, admin write
CREATE POLICY "dishes_read" ON dishes
  FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "dishes_write" ON dishes
  FOR ALL USING (is_admin());

-- orders: own or admin
CREATE POLICY "orders_access" ON orders
  FOR ALL USING (auth.uid() = user_id OR is_admin());

-- meal_plans: own only
CREATE POLICY "plans_access" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);

-- batches: public read, admin write
CREATE POLICY "batches_read" ON dish_batches FOR SELECT USING (true);
CREATE POLICY "batches_write" ON dish_batches FOR ALL USING (is_admin());
```

---

# 12. API

Supabase auto-generates REST. Дополнительные Edge Functions:

```
POST /functions/v1/place-order   — создаёт order, резервирует порции
POST /functions/v1/cancel-order  — отмена, возврат порций
```

Всё остальное — через Supabase JS SDK + RLS.

---

# 13. MVP Scope

### Входит

* меню блюд с ценами, КБЖУ, весом
* планирование рациона на неделю
* фильтры (аллергены, стоп-лист, dietary preferences)
* склад и партии с автосписанием
* заказы с оплатой при доставке (наличные / перевод)
* доставка 3 раза в неделю, порог бесплатной доставки
* статусы заказов и история
* адрес доставки
* админка (блюда, склад, заказы, доставки, dashboard)

### Не входит (V2)

* онлайн-оплата (Stripe)
* промокоды и скидки
* email/push-уведомления
* подписки (recurring)
* мобильное приложение
* выбор часового окна доставки
* несколько зон доставки
* программа лояльности
* отзывы и рейтинги
* чат поддержки

---

# 14. Стек разработки

```
Frontend:   Vite + React (SPA), Tailwind CSS
Routing:    react-router-dom
State:      React Query (@tanstack/react-query)
Backend:    Supabase (Postgres, Auth, Storage, Edge Functions)
Hosting:    GitHub Pages (статика), Supabase (backend)
CI/CD:      GitHub Actions → vite build → deploy to gh-pages
```

---

# 15. Безопасность

```
Auth:       Supabase Auth (email + password, JWT)
RLS:        на всех таблицах
Input:      валидация через Zod
Uploads:    max 2MB, jpg/png/webp
CORS:       ограничен доменом
```
