import type { Payload } from 'payload'
import { sql } from 'payload-db-mysql'

/* XAMPP ships MariaDB 10.4, which has no JSON_ARRAYAGG (added in MariaDB 10.5). The MySQL adapter uses it to load
   nested data (arrays, locales). MariaDB 10.3+ supports aggregate functions written in SQL, so on an old MariaDB we
   create a compatible JSON_ARRAYAGG in the site's own database, once. Newer MariaDB / MySQL are left untouched. */
const DDL = `
CREATE AGGREGATE FUNCTION IF NOT EXISTS json_arrayagg(x LONGTEXT) RETURNS LONGTEXT
BEGIN
  DECLARE acc LONGTEXT DEFAULT '';
  DECLARE n INT DEFAULT 0;
  DECLARE CONTINUE HANDLER FOR NOT FOUND RETURN CONCAT('[', acc, ']');
  LOOP
    FETCH GROUP NEXT ROW;
    IF n > 0 THEN SET acc = CONCAT(acc, ','); END IF;
    SET acc = CONCAT(acc, IFNULL(x, 'null'));
    SET n = n + 1;
  END LOOP;
END`

export async function installJsonArrayAggShim(payload: Payload) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = (payload.db as any).drizzle
    const raw = JSON.stringify(await db.execute(sql`select version() as v`))
    const m = raw.match(/(\d+)\.(\d+)\.(\d+)/)
    const isMaria = /maria/i.test(raw)
    const major = parseInt(m?.[1] ?? '0', 10)
    const minor = parseInt(m?.[2] ?? '0', 10)
    if (!isMaria || major > 10 || (major === 10 && minor >= 5)) return
    await db.execute(sql.raw(DDL))
    payload.logger.info('MariaDB < 10.5 detected: JSON_ARRAYAGG compatibility function is installed.')
  } catch (e) {
    payload.logger.warn(`Could not install the JSON_ARRAYAGG compatibility function (${(e as Error).message}). If pages fail with "json_arrayagg does not exist", upgrade MariaDB to 10.6+ (see MYSQL_SETUP.md).`)
  }
}
