<?php
namespace App\Core;

use \PDO;
use App\Core\Database;
class Model {
    protected $db;

    public function __construct() {
        $retries = 5;
        while ($retries > 0) {
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
            $this->db = new PDO($dsn, $dbConfig['user'], $dbConfig['password'], $options);
            return;
          } catch (PDOException $e) {
            $retries--;
            if ($retries == 0) {
              die("Database connection failed: " . $e->getMessage());
            }
            sleep(2);  // Wait for 2 seconds before retrying
          }
        }
    }

    public static function getConnection() {
        $connection = null;

        try {
            return Database::getConnection();
        } catch (PDOException $e) {
            if ($retries == 0) {
                die("Database connection failed: " . $e->getMessage());
            }
            sleep(2);  // Wait for 2 seconds before retrying
        }
    }
}
