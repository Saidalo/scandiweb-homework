<?php
namespace App\models;
use App\core\Model;
use \PDO;
class Product extends Model {
    public static function getAll($category = "all", $id = null) {
        $db = Product::getConnection();
        $where = $category != 'all' ? " WHERE p.category = '$category'" : "";
        if($category == "id" && $id != null) {
            $where = " WHERE p.id = '$id'";
        }
        
        
        $stmt = $db->prepare(
            "SELECT 
	            p.id,
	            p.name,
	            p.in_stock,
	            p.description,
	            p.brand, 
	            p.category, 
	            pa.attribute_id,
	            pr.amount,
	            pr.currency,
	            a.name as attr_name, 
	            a.type, 
	            a.items, 
	            g.image_url 
            FROM products p 
            LEFT JOIN gallery g ON g.product_id=p.id 
            LEFT JOIN prices pr ON pr.product_id=p.id 
            LEFT JOIN product_attributes pa ON p.id=pa.product_id 
            LEFT JOIN attributes a ON pa.attribute_id=a.id
            $where;");
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getProductAttributeItems($items = null) {
        if($items) {
            $db = Product::getConnection();
            $stmt = $db->prepare("SELECT * FROM items WHERE item_id IN ($items);");
            $stmt->execute();
            //Need to close connection;
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } 
        return [];
    }

    public static function find($id = null) {
        if($id != null) {
            return Product::getAll("id", $id);
        }
        return $id;
    }

}