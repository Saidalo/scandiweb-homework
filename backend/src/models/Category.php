<?php
namespace App\models;
use App\core\Model;
use \PDO;
class Category extends Model {
    public static function all() {
        $db = Category::getConnection();
        $stmt = $db->prepare("SELECT * FROM categories;");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}