-- Run once in phpMyAdmin: select your database → "SQL" tab → paste → Go.
-- Stores every enquiry sent from the website forms (enquiry.php).
CREATE TABLE IF NOT EXISTS leads (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  created_at   DATETIME     NOT NULL,
  name         VARCHAR(120) NOT NULL,
  phone        VARCHAR(40)  NOT NULL,
  email        VARCHAR(160) NULL,
  message      TEXT         NULL,
  kind         VARCHAR(20)  NOT NULL DEFAULT 'enquiry',   -- enquiry | landowner | buyer | career | campaign
  project      VARCHAR(120) NULL,                          -- project slug
  job          VARCHAR(120) NULL,                          -- job slug
  campaign     VARCHAR(160) NULL,
  variant      VARCHAR(4)   NULL,                          -- A/B version shown
  details      TEXT         NULL,
  page         VARCHAR(200) NULL,
  utm_source   VARCHAR(300) NULL,
  utm_medium   VARCHAR(300) NULL,
  utm_campaign VARCHAR(300) NULL,
  utm_term     VARCHAR(300) NULL,
  utm_content  VARCHAR(300) NULL,
  gclid        VARCHAR(300) NULL,
  fbclid       VARCHAR(300) NULL,
  ttclid       VARCHAR(300) NULL,
  referrer     VARCHAR(300) NULL,
  landing      VARCHAR(300) NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'new',        -- new | contacted | visit | negotiation | booked | lost
  notes        TEXT         NULL,
  duplicate_of INT UNSIGNED NULL,
  ip_hash      CHAR(64)     NOT NULL,
  KEY idx_phone (phone),
  KEY idx_created (created_at),
  KEY idx_status (status),
  KEY idx_ip (ip_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
