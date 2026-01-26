<?php
namespace App\Core;
use \PDO;
class Database {
    private static $pdo = null;

    public static function getConnection() {
        if (self::$pdo === null) {
            $config = include(__DIR__ . '/../config.php');
            $dbConfig = $config['db'];

            $dsn = sprintf(
              'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
              $dbConfig['host'],
              $dbConfig['port'] ?? 3306,
              $dbConfig['dbname']
            );

            $options = [
              PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ];
            if (!empty($dbConfig['ssl_ca']) && defined('PDO::MYSQL_ATTR_SSL_CA')) {
              $options[PDO::MYSQL_ATTR_SSL_CA] = $dbConfig['ssl_ca'];
              $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = true;
            }
            
            try {
                self::$pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['password'], $options);
            } catch (PDOException $e) {
                die("Database connection failed: " . $e->getMessage());
            }
        }
        return self::$pdo;
    }
}
