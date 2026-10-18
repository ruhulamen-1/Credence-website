<?php
// Copy this file to config.php (same folder as enquiry.php) and fill in your cPanel database details.
// cPanel → "MySQL Databases": create a database + user, add the user to the database (ALL PRIVILEGES).
return [
    'dsn'         => 'mysql:host=localhost;dbname=CPANELUSER_credence;charset=utf8mb4',
    'user'        => 'CPANELUSER_dbuser',
    'pass'        => 'PUT-THE-DB-PASSWORD-HERE',
    'salt'        => 'type-any-long-random-text-here',   // used to hash visitor IPs (rate limit); not stored in plain text
    'notify_to'   => '',                                  // e-mail to alert on every new enquiry (leave empty to disable)
    'notify_from' => 'no-reply@yourdomain.com',           // must be an address on your own domain
];
