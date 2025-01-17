<?php
namespace App\Models;
use App\Core\Model;
use \PDO;
class Category extends Model {
    public static function all() {
        $db = Category::getConnection();
        $stmt = $db->prepare("SELECT * FROM categories;");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}