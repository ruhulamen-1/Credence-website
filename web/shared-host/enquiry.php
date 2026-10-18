<?php
// Receives the website forms (JSON), stores them in MySQL (view/export in phpMyAdmin) and optionally e-mails you.
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function out(int $code, array $data): void { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
function clean($v, int $max = 500): string { return is_string($v) ? mb_substr(trim($v), 0, $max) : ''; }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') out(405, ['error' => 'POST only']);

// Same-site requests only (blocks forms posted from other websites)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $oh = (string) parse_url($origin, PHP_URL_HOST);
    $hh = preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? ''));
    if (strcasecmp($oh, $hh) !== 0) out(403, ['error' => 'Forbidden']);
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$b = json_decode($raw ?: '', true);
if (!is_array($b)) out(400, ['error' => 'Invalid request']);

if (clean($b['website'] ?? '') !== '') out(200, ['ok' => true]);          // honeypot: pretend success to bots

$name  = clean($b['name'] ?? '', 120);
$phone = clean($b['phone'] ?? '', 40);
$email = clean($b['email'] ?? '', 160);
if ($name === '' || !preg_match('/^[+\d০-৯][\d০-৯\s()-]{5,}$/u', $phone)) out(422, ['error' => 'Name and a valid phone number are required.']);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) out(422, ['error' => 'Invalid email.']);

$kinds = ['enquiry', 'landowner', 'buyer', 'career', 'campaign'];
$kind  = in_array($b['kind'] ?? '', $kinds, true) ? $b['kind'] : 'enquiry';
$src   = is_array($b['source'] ?? null) ? $b['source'] : [];

$cfgFile = __DIR__ . '/config.php';
if (!is_file($cfgFile)) { error_log('enquiry.php: config.php missing'); out(500, ['error' => 'Server not configured']); }
$cfg = require $cfgFile;

try {
    $pdo = new PDO($cfg['dsn'], $cfg['user'] ?? null, $cfg['pass'] ?? null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);

    $ipHash = hash('sha256', ($cfg['salt'] ?? '') . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $since  = gmdate('Y-m-d H:i:s', time() - 600);
    $q = $pdo->prepare('SELECT COUNT(*) AS c FROM leads WHERE ip_hash = :h AND created_at > :s');
    $q->execute([':h' => $ipHash, ':s' => $since]);
    if ((int) $q->fetch()['c'] >= 5) out(429, ['error' => 'Too many requests. Please call 16769.']);

    $q = $pdo->prepare('SELECT id FROM leads WHERE phone = :p ORDER BY id LIMIT 1');
    $q->execute([':p' => $phone]);
    $dup = $q->fetch();

    $s = fn(string $k, int $m = 300) => ($v = clean($src[$k] ?? '', $m)) !== '' ? $v : null;
    $n = fn($v) => ($v === '' ? null : $v);
    $ins = $pdo->prepare(
        'INSERT INTO leads (created_at, name, phone, email, message, kind, project, job, campaign, variant, details, page,
                            utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, ttclid, referrer, landing,
                            status, duplicate_of, ip_hash)
         VALUES (:created, :name, :phone, :email, :message, :kind, :project, :job, :campaign, :variant, :details, :page,
                 :utm_source, :utm_medium, :utm_campaign, :utm_term, :utm_content, :gclid, :fbclid, :ttclid, :referrer, :landing,
                 :status, :dup, :ip)'
    );
    $ins->execute([
        ':created' => gmdate('Y-m-d H:i:s'), ':name' => $name, ':phone' => $phone, ':email' => $n($email),
        ':message' => $n(clean($b['msg'] ?? '', 2000)), ':kind' => $kind, ':project' => $n(clean($b['project'] ?? '', 120)),
        ':job' => $n(clean($b['job'] ?? '', 120)), ':campaign' => $n(clean($b['campaign'] ?? '', 160)), ':variant' => $n(clean($b['variant'] ?? '', 4)),
        ':details' => $n(clean($b['details'] ?? '', 2000)), ':page' => $n(clean($b['page'] ?? '', 200)),
        ':utm_source' => $s('utm_source'), ':utm_medium' => $s('utm_medium'), ':utm_campaign' => $s('utm_campaign'), ':utm_term' => $s('utm_term'),
        ':utm_content' => $s('utm_content'), ':gclid' => $s('gclid'), ':fbclid' => $s('fbclid'), ':ttclid' => $s('ttclid'),
        ':referrer' => $s('referrer'), ':landing' => $s('landing'), ':status' => 'new', ':dup' => $dup['id'] ?? null, ':ip' => $ipHash,
    ]);
    $id = (int) $pdo->lastInsertId();
} catch (Throwable $e) {
    error_log('enquiry.php: ' . $e->getMessage());
    out(500, ['error' => 'Could not save your message. Please call 16769.']);
}

// Optional e-mail alert (never blocks the visitor)
if (!empty($cfg['notify_to'])) {
    $subject = 'New ' . $kind . ' lead: ' . str_replace(["\r", "\n"], ' ', $name) . ' (' . $phone . ')';
    $body = "Name: $name\nPhone: $phone\nEmail: $email\nType: $kind\nMessage: " . clean($b['msg'] ?? '', 2000) . "\nPage: " . clean($b['page'] ?? '', 200) . "\nLead #$id";
    $from = str_replace(["\r", "\n"], '', (string) ($cfg['notify_from'] ?? ''));
    @mail((string) $cfg['notify_to'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, "From: $from\r\nContent-Type: text/plain; charset=UTF-8");
}

out(200, ['ok' => true, 'id' => $id]);
