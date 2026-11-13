/*
# Seed Default Roles and Scenarios

1. Default Roles
Inserts built-in mafia game roles with is_default=true.

2. Default Scenarios
Inserts common game configurations.

3. Security
No security changes — uses existing RLS policies.
*/

-- Default roles: Mafia side
INSERT INTO roles (name, side, description, is_default) VALUES
('مافیا', 'mafia', 'رهبر گروه مافیا. هر شب یک نفر را ترور می‌کند.', true),
('قاتل', 'mafia', 'عضو مافیا که شب‌ها همراه مافیا عمل می‌کند.', true),
('نجات‌دهنده مافیا', 'mafia', 'می‌تواند یک عضو مافیا را از مرگ نجات دهد.', true),
('جاسوس', 'mafia', 'اطلاعات شهروندان را برای مافیا جمع‌آوری می‌کند.', true)
ON CONFLICT DO NOTHING;

-- Default roles: Citizen side
INSERT INTO roles (name, side, description, is_default) VALUES
('شهروند', 'citizen', 'شهروند عادی بدون توانایی خاص. در روز رای می‌دهد.', true),
('کارآگاه', 'citizen', 'هر شب می‌تواند هویت یک نفر را بررسی کند.', true),
('دکتر', 'citizen', 'هر شب می‌تواند یک نفر را نجات دهد.', true),
('نگهبان', 'citizen', 'هر شب از یک نفر محافظت می‌کند.', true),
('تک‌تیرانداز', 'citizen', 'می‌تواند مافیا را ترور کند اما اگر اشتباه کند از بازی خارج می‌شود.', true),
('رئیس شهر', 'citizen', 'در روز رای او دو برابر محاسبه می‌شود.', true),
('معمار', 'citizen', 'می‌تواند خانه‌ها را باز و بسته کند.', true)
ON CONFLICT DO NOTHING;

-- Default scenarios
INSERT INTO scenarios (name, description, role_ids, is_default)
SELECT
  'بازی کلاسیک ۸ نفره',
  'تنظیمات استاندارد برای ۸ بازیکن',
  jsonb_build_array(
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'مافیا' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'قاتل' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'کارآگاه' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'دکتر' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'شهروند' LIMIT 1), 'count', 4)
  ),
  true
WHERE NOT EXISTS (SELECT 1 FROM scenarios WHERE name = 'بازی کلاسیک ۸ نفره');

INSERT INTO scenarios (name, description, role_ids, is_default)
SELECT
  'بازی استاندارد ۱۲ نفره',
  'تنظیمات کامل برای ۱۲ بازیکن',
  jsonb_build_array(
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'مافیا' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'قاتل' LIMIT 1), 'count', 2),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'نجات‌دهنده مافیا' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'کارآگاه' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'دکتر' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'نگهبان' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'تک‌تیرانداز' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'رئیس شهر' LIMIT 1), 'count', 1),
    jsonb_build_object('role_id', (SELECT id FROM roles WHERE name = 'شهروند' LIMIT 1), 'count', 3)
  ),
  true
WHERE NOT EXISTS (SELECT 1 FROM scenarios WHERE name = 'بازی استاندارد ۱۲ نفره');
