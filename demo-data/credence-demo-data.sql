-- Credence website — demo/sample content for MySQL / MariaDB (import in phpMyAdmin → Import).
-- Generated 2026-10-18 from the project database. Contains NO users — run  npm run create-admin  afterwards.
-- IMPORT INTO AN EXISTING DATABASE WHOSE TABLES WERE ALREADY CREATED BY THE SITE (run  npm run db:check  once first).
-- WARNING: each content table is emptied (DELETE) before its rows are inserted.

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- careers (3 rows)
DELETE FROM `careers`;
INSERT INTO `careers` (`id`, `slug`, `employment_type`, `open`, `deadline`, `updated_at`, `created_at`, `_status`) VALUES
(1, 'demo-site-engineer', 'full-time', 1, '2026-11-17 20:51:38.985', '2026-10-18 10:51:38.986', '2026-10-18 10:51:38.986', 'published'),
(2, 'demo-sales-executive', 'full-time', 1, '2026-11-17 20:51:39.000', '2026-10-18 10:51:39.000', '2026-10-18 10:51:39.000', 'published'),
(3, 'demo-architect-intern', 'internship', 1, '2026-11-17 20:51:39.011', '2026-10-18 10:51:39.011', '2026-10-18 10:51:39.011', 'published');

-- leads (30 rows)
DELETE FROM `leads`;
INSERT INTO `leads` (`id`, `name`, `phone`, `email`, `message`, `kind`, `job_id`, `campaign`, `variant`, `details`, `project_id`, `page`, `status`, `assigned_to_id`, `notes`, `source_utm_source`, `source_utm_medium`, `source_utm_campaign`, `source_utm_term`, `source_utm_content`, `source_gclid`, `source_fbclid`, `source_ttclid`, `source_referrer`, `source_landing`, `duplicate_of_id`, `updated_at`, `created_at`) VALUES
(1, 'Demo Farhana 1', '01700001000', 'demo0@example.com', 'Demo lead — sample message.', 'buyer', NULL, NULL, NULL, NULL, 10, '/buyer', 'lost', NULL, 'DEMO', 'google', 'cpc', 'brand', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.051', '2026-09-20 22:51:39.048'),
(2, 'Demo Tanvir 2', '01700001001', NULL, 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 10, '/projects/demo-business-plaza', 'new', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, 'demo-gclid', NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.060', '2026-09-27 02:51:39.059'),
(3, 'Demo Arif 3', '01700001002', NULL, 'Demo lead — sample message.', 'career', NULL, NULL, NULL, NULL, NULL, '/career', 'new', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, 'demo-gclid', NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.069', '2026-09-20 21:51:39.068'),
(4, 'Demo Rahim 4', '01700001003', 'demo3@example.com', 'Demo lead — sample message.', 'campaign', NULL, 'Demo Eid Offer', 'B', NULL, 8, '/campaign', 'contacted', NULL, 'DEMO', 'facebook', 'cpc', 'eid-offer', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.077', '2026-10-01 21:51:39.075'),
(5, 'Demo Arif 5', '01700001004', NULL, 'Demo lead — sample message.', 'landowner', NULL, NULL, NULL, NULL, NULL, '/landowner', 'visit', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'https://example.com/', '/', NULL, '2026-10-18 10:51:39.086', '2026-10-09 00:51:39.083'),
(6, 'Demo Mitu 6', '01700001005', NULL, 'Demo lead — sample message.', 'landowner', NULL, NULL, NULL, NULL, NULL, '/landowner', 'contacted', NULL, 'DEMO', 'google', 'cpc', 'brand', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.092', '2026-10-11 20:51:39.092'),
(7, 'Demo Sumon 7', '01700001006', 'demo6@example.com', 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 8, '/projects/demo-skyline-residence', 'lost', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, NULL, 'demo-fbclid', NULL, NULL, '/', NULL, '2026-10-18 10:51:39.097', '2026-10-11 18:51:39.096'),
(8, 'Demo Karim 8', '01700001007', NULL, 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 9, '/projects/demo-green-court', 'contacted', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, 'demo-gclid', NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.108', '2026-10-18 19:51:39.107'),
(9, 'Demo Tanvir 9', '01700001008', NULL, 'Demo lead — sample message.', 'landowner', NULL, NULL, NULL, NULL, NULL, '/landowner', 'negotiation', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, 'demo-gclid', NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.117', '2026-10-04 22:51:39.116'),
(10, 'Demo Karim 10', '01700001009', 'demo9@example.com', 'Demo lead — sample message.', 'landowner', NULL, NULL, NULL, NULL, NULL, '/landowner', 'new', NULL, 'DEMO', 'facebook', 'cpc', 'eid-offer', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.121', '2026-10-17 22:51:39.120'),
(11, 'Demo Shirin 11', '01700001010', NULL, 'Demo lead — sample message.', 'landowner', NULL, NULL, NULL, NULL, NULL, '/landowner', 'negotiation', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, 'demo-gclid', NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.125', '2026-10-15 01:51:39.124'),
(12, 'Demo Imran 12', '01700001011', NULL, 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 10, '/projects/demo-business-plaza', 'new', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'https://example.com/', '/', NULL, '2026-10-18 10:51:39.130', '2026-10-09 02:51:39.129'),
(13, 'Demo Nasrin 13', '01700001012', 'demo12@example.com', 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 8, '/projects/demo-skyline-residence', 'negotiation', NULL, 'DEMO', 'facebook', 'cpc', 'eid-offer', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.136', '2026-10-06 01:51:39.135'),
(14, 'Demo Mitu 14', '01700001013', NULL, 'Demo lead — sample message.', 'campaign', NULL, 'Demo Eid Offer', 'B', NULL, 10, '/campaign', 'new', NULL, 'DEMO', 'facebook', 'cpc', 'eid-offer', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.143', '2026-10-01 18:51:39.142'),
(15, 'Demo Rahim 15', '01700001014', NULL, 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 8, '/projects/demo-skyline-residence', 'lost', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.149', '2026-10-17 18:51:39.148'),
(16, 'Demo Mitu 16', '01700001015', 'demo15@example.com', 'Demo lead — sample message.', 'buyer', NULL, NULL, NULL, NULL, 8, '/buyer', 'contacted', NULL, 'DEMO', 'google', 'cpc', 'brand', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.157', '2026-10-14 23:51:39.156'),
(17, 'Demo Rahim 17', '01700001016', NULL, 'Demo lead — sample message.', 'buyer', NULL, NULL, NULL, NULL, 8, '/buyer', 'negotiation', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, 'demo-gclid', NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.166', '2026-10-17 03:51:39.165'),
(18, 'Demo Imran 18', '01700001017', NULL, 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 9, '/projects/demo-green-court', 'new', NULL, 'DEMO', 'facebook', 'cpc', 'eid-offer', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.173', '2026-09-30 22:51:39.172'),
(19, 'Demo Arif 19', '01700001018', 'demo18@example.com', 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 8, '/projects/demo-skyline-residence', 'lost', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'https://example.com/', '/', NULL, '2026-10-18 10:51:39.182', '2026-10-14 20:51:39.181'),
(20, 'Demo Shirin 20', '01700001019', NULL, 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 8, '/projects/demo-skyline-residence', 'negotiation', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, 'demo-gclid', NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.193', '2026-09-19 18:51:39.192'),
(21, 'Demo Rahim 21', '01700001020', NULL, 'Demo lead — sample message.', 'campaign', NULL, 'Demo Eid Offer', 'A', NULL, 10, '/campaign', 'lost', NULL, 'DEMO', 'facebook', 'cpc', 'eid-offer', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.200', '2026-09-22 01:51:39.199'),
(22, 'Demo Shirin 22', '01700001021', 'demo21@example.com', 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 10, '/projects/demo-business-plaza', 'new', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.207', '2026-10-08 01:51:39.206'),
(23, 'Demo Karim 23', '01700001022', NULL, 'Demo lead — sample message.', 'buyer', NULL, NULL, NULL, NULL, 10, '/buyer', 'new', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.217', '2026-09-20 19:51:39.215'),
(24, 'Demo Mitu 24', '01700001023', NULL, 'Demo lead — sample message.', 'buyer', NULL, NULL, NULL, NULL, 9, '/buyer', 'negotiation', NULL, 'DEMO', 'google', 'cpc', 'brand', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.223', '2026-10-13 21:51:39.222'),
(25, 'Demo Nasrin 25', '01700001024', 'demo24@example.com', 'Demo lead — sample message.', 'buyer', NULL, NULL, NULL, NULL, 9, '/buyer', 'booked', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.230', '2026-09-24 20:51:39.229');
INSERT INTO `leads` (`id`, `name`, `phone`, `email`, `message`, `kind`, `job_id`, `campaign`, `variant`, `details`, `project_id`, `page`, `status`, `assigned_to_id`, `notes`, `source_utm_source`, `source_utm_medium`, `source_utm_campaign`, `source_utm_term`, `source_utm_content`, `source_gclid`, `source_fbclid`, `source_ttclid`, `source_referrer`, `source_landing`, `duplicate_of_id`, `updated_at`, `created_at`) VALUES
(26, 'Demo Farhana 26', '01700001025', NULL, 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 10, '/projects/demo-business-plaza', 'lost', NULL, 'DEMO', 'google', 'cpc', 'brand', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.237', '2026-10-01 03:51:39.236'),
(27, 'Demo Imran 27', '01700001026', NULL, 'Demo lead — sample message.', 'career', NULL, NULL, NULL, NULL, NULL, '/career', 'contacted', NULL, 'DEMO', 'facebook', 'cpc', 'eid-offer', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.244', '2026-09-25 02:51:39.243'),
(28, 'Demo Arif 28', '01700001027', 'demo27@example.com', 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 9, '/projects/demo-green-court', 'contacted', NULL, 'DEMO', 'facebook', 'cpc', 'eid-offer', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.250', '2026-10-15 00:51:39.249'),
(29, 'Demo Rahim 29', '01700001028', NULL, 'Demo lead — sample message.', 'enquiry', NULL, NULL, NULL, NULL, 10, '/projects/demo-business-plaza', 'new', NULL, 'DEMO', 'google', 'cpc', 'brand', NULL, NULL, NULL, NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.258', '2026-09-29 03:51:39.257'),
(30, 'Demo Arif 30', '01700001029', NULL, 'Demo lead — sample message.', 'career', NULL, NULL, NULL, NULL, NULL, '/career', 'new', NULL, 'DEMO', NULL, NULL, NULL, NULL, NULL, 'demo-gclid', NULL, NULL, NULL, '/', NULL, '2026-10-18 10:51:39.266', '2026-10-16 02:51:39.265');

-- media (0 rows)
DELETE FROM `media`;

-- posts (4 rows)
DELETE FROM `posts`;
INSERT INTO `posts` (`id`, `slug`, `kind`, `published_at`, `author`, `event_date`, `cover_id`, `related_project_id`, `updated_at`, `created_at`, `_status`) VALUES
(1, 'demo-buying-guide', 'blog', '2026-10-09 20:51:38.836', 'Demo Editor', NULL, NULL, NULL, '2026-10-18 10:51:38.926', '2026-10-18 10:51:38.844', 'published'),
(2, 'demo-interior-trends', 'blog', '2026-09-28 20:51:38.836', 'Demo Editor', NULL, NULL, NULL, '2026-10-18 10:51:38.864', '2026-10-18 10:51:38.863', 'published'),
(3, 'demo-handover-news', 'news', '2026-10-15 20:51:38.836', 'Demo Editor', NULL, NULL, NULL, '2026-10-18 10:51:38.881', '2026-10-18 10:51:38.881', 'published'),
(4, 'demo-open-house', 'event', '2026-10-17 20:51:38.836', 'Demo Editor', '2026-10-30 10:51:38.836', NULL, 8, '2026-10-18 10:51:38.905', '2026-10-18 10:51:38.905', 'published');

-- projects (10 rows)
DELETE FROM `projects`;
INSERT INTO `projects` (`id`, `name`, `slug`, `status`, `type`, `order`, `area`, `map_query`, `image_id`, `hue`, `floors`, `brochure_id`, `og_image_id`, `updated_at`, `created_at`, `_status`) VALUES
(1, 'Arkology', 'arkology', 'Ongoing', 'Apartment', 20, 'Gulshan', 'Road 13, Block SW(D), Gulshan 1, Dhaka', NULL, 340, 18, NULL, NULL, '2026-10-18 10:51:34.579', '2026-10-18 10:51:34.579', 'published'),
(2, 'Park Snowflake', 'park-snowflake', 'Ongoing', 'Apartment', 30, 'Dhanmondi', 'Kalabagan, North Dhanmondi, Dhaka', NULL, 208, 16, NULL, NULL, '2026-10-18 10:51:34.627', '2026-10-18 10:51:34.627', 'published'),
(3, 'Bella Vista', 'bella-vista', 'Ongoing', 'Apartment', 40, 'Dhanmondi', 'Road 9/A, Dhanmondi, Dhaka', NULL, 28, 16, NULL, NULL, '2026-10-18 10:51:34.656', '2026-10-18 10:51:34.656', 'published'),
(4, 'Helena Sparta', 'helena-sparta', 'Ongoing', 'Apartment', 50, 'Banani', 'Road 7, Block G, Banani, Dhaka', NULL, 190, 16, NULL, NULL, '2026-10-18 10:51:34.674', '2026-10-18 10:51:34.674', 'published'),
(5, 'Paramount Residences', 'paramount-residences', 'Completed', 'Apartment', 60, 'Dhanmondi', 'Dhaka', NULL, 240, 16, NULL, NULL, '2026-10-18 10:51:34.699', '2026-10-18 10:51:34.699', 'published'),
(6, 'Platinum', 'platinum', 'Completed', 'Apartment', 70, 'Dhanmondi', 'Dhaka', NULL, 160, 16, NULL, NULL, '2026-10-18 10:51:34.720', '2026-10-18 10:51:34.720', 'published'),
(7, 'Cynosure', 'cynosure', 'Completed', 'Apartment', 80, 'Dhanmondi', 'Dhaka', NULL, 20, 16, NULL, NULL, '2026-10-18 10:51:34.740', '2026-10-18 10:51:34.740', 'published'),
(8, 'Demo Skyline Residence', 'demo-skyline-residence', 'Upcoming', 'Apartment', 910, 'Uttara', 'Sector 7, Uttara, Dhaka (sample address)', NULL, 200, 14, NULL, NULL, '2026-10-18 10:51:38.782', '2026-10-18 10:51:38.643', 'published'),
(9, 'Demo Green Court', 'demo-green-court', 'Ongoing', 'Apartment', 920, 'Bashundhara', 'Block D, Bashundhara R/A, Dhaka (sample address)', NULL, 150, 10, NULL, NULL, '2026-10-18 10:51:38.705', '2026-10-18 10:51:38.704', 'published'),
(10, 'Demo Business Plaza', 'demo-business-plaza', 'Completed', 'Commercial', 930, 'Gulshan', 'Gulshan Avenue, Dhaka (sample address)', NULL, 270, 16, NULL, NULL, '2026-10-18 10:51:38.737', '2026-10-18 10:51:38.737', 'published');

-- redirects (2 rows)
DELETE FROM `redirects`;
INSERT INTO `redirects` (`id`, `from`, `to`, `type`, `updated_at`, `created_at`) VALUES
(1, '/demo-old-project-page', '/projects/demo-skyline-residence', '301', '2026-10-18 10:51:39.042', '2026-10-18 10:51:39.042'),
(2, '/demo-old-blog', '/blog', '302', '2026-10-18 10:51:39.045', '2026-10-18 10:51:39.045');

-- team (6 rows)
DELETE FROM `team`;
INSERT INTO `team` (`id`, `group`, `order`, `photo_id`, `updated_at`, `created_at`) VALUES
(1, 'management', 901, NULL, '2026-10-18 10:51:38.954', '2026-10-18 10:51:38.954'),
(2, 'management', 902, NULL, '2026-10-18 10:51:38.960', '2026-10-18 10:51:38.960'),
(3, 'team', 903, NULL, '2026-10-18 10:51:38.965', '2026-10-18 10:51:38.965'),
(4, 'team', 904, NULL, '2026-10-18 10:51:38.970', '2026-10-18 10:51:38.970'),
(5, 'team', 905, NULL, '2026-10-18 10:51:38.975', '2026-10-18 10:51:38.975'),
(6, 'team', 906, NULL, '2026-10-18 10:51:38.980', '2026-10-18 10:51:38.980');

-- careers_locales (3 rows)
DELETE FROM `careers_locales`;
INSERT INTO `careers_locales` (`title`, `department`, `location`, `description`, `id`, `_locale`, `_parent_id`) VALUES
('[Demo] Site Engineer', 'Engineering', 'Dhaka', '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"heading","tag":"h2","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Responsibilities","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample responsibilities text.","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"heading","tag":"h2","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Requirements","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample requirements text.","format":0,"detail":0,"mode":"normal","style":"","version":1}]}]}}', 1, 'en', 1),
('[Demo] Sales Executive', 'Sales', 'Dhaka', '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"heading","tag":"h2","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Responsibilities","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample responsibilities text.","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"heading","tag":"h2","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Requirements","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample requirements text.","format":0,"detail":0,"mode":"normal","style":"","version":1}]}]}}', 2, 'en', 2),
('[Demo] Architecture Intern', 'Design', 'Dhaka', '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"heading","tag":"h2","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Responsibilities","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample responsibilities text.","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"heading","tag":"h2","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Requirements","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample requirements text.","format":0,"detail":0,"mode":"normal","style":"","version":1}]}]}}', 3, 'en', 3);

-- landing_pages (1 rows)
DELETE FROM `landing_pages`;
INSERT INTO `landing_pages` (`id`, `title`, `slug`, `language`, `noindex`, `project_id`, `image_id`, `headline`, `subheading`, `button_text`, `phone`, `ab_test`, `headline_b`, `button_text_b`, `updated_at`, `created_at`, `_status`) VALUES
(1, 'Demo Eid Offer', 'demo-eid-offer', 'en', 1, 8, NULL, 'Book your dream home this Eid', 'Sample campaign page for testing the form, tracking and A/B headline.', 'Request a call back', NULL, 1, 'Eid special: easy instalments on selected flats', 'Get the offer', '2026-10-18 10:51:39.027', '2026-10-18 10:51:39.026', 'published');

-- landing_pages_bullets (3 rows)
DELETE FROM `landing_pages_bullets`;
INSERT INTO `landing_pages_bullets` (`_order`, `_parent_id`, `id`, `text`) VALUES
(1, 1, '6ad4a4bbe8bfa406aa46d649', 'Ready and ongoing flats'),
(2, 1, '6ad4a4bbe8bfa406aa46d64a', 'Flexible payment plan (sample)'),
(3, 1, '6ad4a4bbe8bfa406aa46d64b', 'Free site visit');

-- posts_locales (5 rows)
DELETE FROM `posts_locales`;
INSERT INTO `posts_locales` (`title`, `event_location`, `excerpt`, `body`, `seo_title`, `seo_description`, `id`, `_locale`, `_parent_id`) VALUES
('[Demo] Light, space and ventilation: a modern home checklist', NULL, 'Second sample article so the list shows more than one card.', '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample article body. Replace with real content.","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Second sample paragraph to check line length and spacing.","format":0,"detail":0,"mode":"normal","style":"","version":1}]}]}}', NULL, NULL, 2, 'en', 2),
('[Demo] Sample project handed over to owners', NULL, 'A sample news item.', '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample news text. This is demo content and not a real announcement.","format":0,"detail":0,"mode":"normal","style":"","version":1}]}]}}', NULL, NULL, 3, 'en', 3),
('[Demo] Open house weekend', 'Dhanmondi site office (sample)', 'A sample event with a date and a place.', '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample event description. Visit, meet the counsellors and walk through a model flat.","format":0,"detail":0,"mode":"normal","style":"","version":1}]}]}}', NULL, NULL, 4, 'en', 4),
('[Demo] 7 things to check before buying an apartment', NULL, 'A sample article with headings and paragraphs to test the blog layout.', '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"heading","tag":"h2","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"1. Land documents","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample paragraph. Always verify the land title and mutation records with a lawyer.","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"heading","tag":"h2","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"2. Approvals and layout","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample paragraph. Check the approved plan, number of storeys and parking.","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"heading","tag":"h2","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"3. Handover date","format":0,"detail":0,"mode":"normal","style":"","version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"Sample paragraph. Ask for the handover schedule in writing.","format":0,"detail":0,"mode":"normal","style":"","version":1}]}]}}', NULL, NULL, 5, 'en', 1),
('[ডেমো] অ্যাপার্টমেন্ট কেনার আগে ৭টি বিষয় দেখুন', NULL, 'ব্লগের নকশা পরীক্ষার জন্য একটি নমুনা লেখা।', NULL, NULL, NULL, 6, 'bn', 1);

-- projects_facts (14 rows)
DELETE FROM `projects_facts`;
INSERT INTO `projects_facts` (`_order`, `_parent_id`, `_locale`, `id`, `v`, `l`) VALUES
(1, 1, 'en', '6ad4a4b6918464067354b2e2', '15', 'Storeys (B2+B1+G+M+14)'),
(2, 1, 'en', '6ad4a4b6918464067354b2e3', '1', 'Apartment per floor'),
(3, 1, 'en', '6ad4a4b6918464067354b2e4', '3,366', 'sq. ft. each (approx.)'),
(4, 1, 'en', '6ad4a4b6918464067354b2e5', '24', 'Car parking spaces'),
(5, 1, 'en', '6ad4a4b6918464067354b2e6', 'Aug 2029', 'Expected handover'),
(1, 9, 'en', '6ad4a4bae8bfa406aa46d63f', '9', 'Storeys'),
(2, 9, 'en', '6ad4a4bae8bfa406aa46d640', '36', 'Apartments'),
(3, 9, 'en', '6ad4a4bae8bfa406aa46d641', '1,350', 'sq. ft. (sample)'),
(1, 10, 'en', '6ad4a4bae8bfa406aa46d645', '16', 'Floors'),
(2, 10, 'en', '6ad4a4bae8bfa406aa46d646', '2019', 'Handed over'),
(1, 8, 'en', '6ad4a4bae8bfa406aa46d634', '12', 'Storeys'),
(2, 8, 'en', '6ad4a4bae8bfa406aa46d635', '2', 'Apartments per floor'),
(3, 8, 'en', '6ad4a4bae8bfa406aa46d636', '1,850', 'sq. ft. (sample)'),
(4, 8, 'en', '6ad4a4bae8bfa406aa46d637', '2028', 'Expected handover');

-- projects_gallery (0 rows)
DELETE FROM `projects_gallery`;

-- projects_locales (11 rows)
DELETE FROM `projects_locales`;
INSERT INTO `projects_locales` (`addr`, `tagline`, `story_title`, `seo_title`, `seo_description`, `id`, `_locale`, `_parent_id`) VALUES
('Plot-1/B, Road-13, Block-SW(D), Gulshan-1, Dhaka', 'An exclusive residence beside Gulshan Lake — luxury, privacy and spacious living, with lake breezes and greenery at your doorstep.', 'A luxury apartment beside Gulshan Lake', 'Arkology — Luxury Apartments Beside Gulshan Lake | Credence', 'Credence Arkology: 15-storey luxury residence beside Gulshan Lake, Gulshan-1, Dhaka. One apartment per floor, ~3,366 sq. ft. Handover August 2029.', 1, 'en', 1),
('Plot-72, Kalabagan, North Dhanmondi, Dhaka', NULL, NULL, NULL, NULL, 2, 'en', 2),
('Plot-92, Road-9/A, Dhanmondi, Dhaka', NULL, NULL, NULL, NULL, 3, 'en', 3),
('Plot-39, Road-07, Block-G, Banani, Dhaka', NULL, NULL, NULL, NULL, 4, 'en', 4),
('Dhaka', NULL, NULL, NULL, NULL, 5, 'en', 5),
('Dhaka', NULL, NULL, NULL, NULL, 6, 'en', 6),
('Dhaka', NULL, NULL, NULL, NULL, 7, 'en', 7),
('Block D, Bashundhara R/A, Dhaka (sample address)', 'Sample project with a courtyard, EV charging and a community hall.', NULL, NULL, NULL, 9, 'en', 9),
('Gulshan Avenue, Dhaka (sample address)', 'Sample commercial building (shows the Commercial filter).', NULL, NULL, NULL, 10, 'en', 10),
('Sector 7, Uttara, Dhaka (sample address)', 'A sample 12-storey residence with lake-facing balconies and a rooftop garden.', NULL, NULL, NULL, 11, 'en', 8),
(NULL, 'হ্রদমুখী বারান্দা ও ছাদবাগানসহ একটি নমুনা ১২ তলা আবাসন (ডেমো)।', NULL, NULL, NULL, 12, 'bn', 8);

-- projects_spec (21 rows)
DELETE FROM `projects_spec`;
INSERT INTO `projects_spec` (`_order`, `_parent_id`, `_locale`, `id`, `k`, `v`) VALUES
(1, 1, 'en', '6ad4a4b6918464067354b2ea', 'Address', 'Plot-1/B, Road-13, Block-SW(D), Gulshan-1, Dhaka'),
(2, 1, 'en', '6ad4a4b6918464067354b2eb', 'Land area', '10.53 Katha'),
(3, 1, 'en', '6ad4a4b6918464067354b2ec', 'Height', '(B2+B1+G+M+14) 15 storied'),
(4, 1, 'en', '6ad4a4b6918464067354b2ed', 'Building type', 'Residential'),
(5, 1, 'en', '6ad4a4b6918464067354b2ee', 'Facing', 'North'),
(6, 1, 'en', '6ad4a4b6918464067354b2ef', 'Number of apartments', '14'),
(7, 1, 'en', '6ad4a4b6918464067354b2f0', 'Units per floor', '1'),
(8, 1, 'en', '6ad4a4b6918464067354b2f1', 'Size of each apartment', 'Type-A: 3,366 sq. ft. (approx.) + planter 27 sq. ft. (approx.)'),
(9, 1, 'en', '6ad4a4b6918464067354b2f2', 'Car parking', '24'),
(10, 1, 'en', '6ad4a4b6918464067354b2f3', 'Handover date', 'August, 2029'),
(1, 2, 'en', '6ad4a4b6918464067354b2f4', 'Address', 'Plot-72, Kalabagan, North Dhanmondi, Dhaka'),
(1, 3, 'en', '6ad4a4b6918464067354b2f5', 'Address', 'Plot-92, Road-9/A, Dhanmondi, Dhaka'),
(1, 4, 'en', '6ad4a4b6918464067354b2f6', 'Address', 'Plot-39, Road-07, Block-G, Banani, Dhaka'),
(1, 9, 'en', '6ad4a4bae8bfa406aa46d643', 'Building type', 'Residential'),
(2, 9, 'en', '6ad4a4bae8bfa406aa46d644', 'Facing', 'East'),
(1, 10, 'en', '6ad4a4bae8bfa406aa46d648', 'Building type', 'Commercial'),
(1, 8, 'en', '6ad4a4bae8bfa406aa46d63a', 'Land area', '8 Katha (sample)'),
(2, 8, 'en', '6ad4a4bae8bfa406aa46d63b', 'Building type', 'Residential'),
(3, 8, 'en', '6ad4a4bae8bfa406aa46d63c', 'Facing', 'South'),
(4, 8, 'en', '6ad4a4bae8bfa406aa46d63d', 'Car parking', '20'),
(5, 8, 'en', '6ad4a4bae8bfa406aa46d63e', 'Handover', 'December 2028');

-- projects_story (7 rows)
DELETE FROM `projects_story`;
INSERT INTO `projects_story` (`_order`, `_parent_id`, `_locale`, `id`, `paragraph`) VALUES
(1, 1, 'en', '6ad4a4b6918464067354b2e7', 'Credence Arkology by Credence Housing Ltd. is an exclusive residential project beside Gulshan Lake in Gulshan‑1, Dhaka. Designed for those who value luxury, privacy, spaciousness and a peaceful lifestyle, it combines the beauty of nature with the convenience of modern city living.'),
(2, 1, 'en', '6ad4a4b6918464067354b2e8', 'Built on 10.53 kathas of land, this 15‑storey building features only one apartment per floor. Each apartment offers approximately 3,366 sq. ft. of living space plus an approximately 27 sq. ft. planter area. With 14 apartments and 24 car parking spaces, the project is planned for comfortable, spacious family living.'),
(3, 1, 'en', '6ad4a4b6918464067354b2e9', 'Surrounded by lush greenery and refreshing lake views, Arkology offers a serene environment away from the city’s bustle, while shopping malls, fine dining and business districts stay within easy reach.'),
(1, 9, 'en', '6ad4a4bae8bfa406aa46d642', 'Another sample project so the project grid, filters and location chips have more than one entry.'),
(1, 10, 'en', '6ad4a4bae8bfa406aa46d647', 'Sample commercial project.'),
(1, 8, 'en', '6ad4a4bae8bfa406aa46d638', 'This is sample text for a demo project. Replace it with the real description before launch.'),
(2, 8, 'en', '6ad4a4bae8bfa406aa46d639', 'Use this project to check how long text, the facts strip and the specification table look on desktop and mobile.');

-- site_settings (1 rows)
DELETE FROM `site_settings`;
INSERT INTO `site_settings` (`id`, `name`, `email`, `hotline`, `whatsapp`, `site_url`, `og_image_id`, `consent_required`, `tracking_gtm`, `tracking_ga4`, `tracking_meta_pixel`, `tracking_tiktok_pixel`, `notify_email`, `updated_at`, `created_at`) VALUES
(1, 'Credence Housing Limited', 'info@credencehousinglimited.com', '16769', '', 'http://localhost:3000', NULL, 1, '', '', '', '', NULL, '2026-10-18 10:51:34.554', '2026-10-18 10:51:34.554');

-- site_settings_locales (1 rows)
DELETE FROM `site_settings_locales`;
INSERT INTO `site_settings_locales` (`address`, `home_title`, `home_description`, `id`, `_locale`, `_parent_id`) VALUES
('House-15, Road-13/A, Dhanmondi R/A, Dhaka-1209', 'Credence Housing Limited — Live Above the Ordinary', 'Credence Housing Limited — a leading real estate developer in Dhaka, Bangladesh. 50+ completed projects, 700+ homes handed over.', 1, 'en', 1);

-- site_settings_phones (2 rows)
DELETE FROM `site_settings_phones`;
INSERT INTO `site_settings_phones` (`_order`, `_parent_id`, `id`, `number`) VALUES
(1, 1, '6ad4a4b6918464067354b2e0', '+880241021375'),
(2, 1, '6ad4a4b6918464067354b2e1', '+880241021378');

-- team_locales (6 rows)
DELETE FROM `team_locales`;
INSERT INTO `team_locales` (`name`, `role`, `bio`, `id`, `_locale`, `_parent_id`) VALUES
('Demo Director One (Demo)', 'Managing Director', 'Sample biography text for layout testing.', 1, 'en', 1),
('Demo Director Two (Demo)', 'Director, Projects', 'Sample biography text for layout testing.', 2, 'en', 2),
('Demo Architect (Demo)', 'Head of Design', NULL, 3, 'en', 3),
('Demo Engineer (Demo)', 'Chief Engineer', NULL, 4, 'en', 4),
('Demo Counsellor (Demo)', 'Sales Counsellor', NULL, 5, 'en', 5),
('Demo Manager (Demo)', 'Customer Care Manager', NULL, 6, 'en', 6);

SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = 1;
