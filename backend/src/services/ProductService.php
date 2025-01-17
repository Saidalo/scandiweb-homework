<?php
namespace App\services;
use App\models\Product;
use stdClass;

class ProductService {
    public static function assertProductProperties($products) {
        $productsReduced = [];
        
        foreach($products as $key => $product) {
            $product_id = $product['id'];
            $filtered = array_filter($products, function($pr) use ($product_id){
                return $pr['id'] == $product_id;
            });
            $productAttributes = new stdClass();
            $priceObj = new stdClass();
            $priceObj->currency = $product['currency'];
            $priceObj->amount = $product['amount'];
            $prices = [$priceObj]; 
            $attributes = [];
            foreach($filtered as $forAttr) {
                if(!array_key_exists($forAttr['attribute_id'], $attributes) && $forAttr['attribute_id'] != null) {
                    $attributeObject = new stdClass();
                    $attributeObject->id = $product['attribute_id'];
                    $attributeObject->name = $product['attr_name'];
                    $attributeObject->type = $product['type'];
                    $attributeObject->items = Product::getProductAttributeItems($product['items']);
                    $attributes[$forAttr['attribute_id']] = $attributeObject;
                }
            }

            $productAttributes->id = $product['id'];
            $productAttributes->name = $product['name'];
            $productAttributes->inStock = $product['in_stock'] == 1;
            $productAttributes->gallery = array_map(function($item){return $item['image_url'];}, $filtered);
            $productAttributes->description = $product['description'];
            $productAttributes->category = $product['category'];
            $productAttributes->attributes = $attributes;
            $productAttributes->prices = [$priceObj];
            $productAttributes->brand = $product['brand'];
            $productsReduced[$product['id']] = $productAttributes;
            
            $product = array_filter($products, function($pr) use ($product_id){
                return $pr['id'] != $product_id;
            });

        }
        // print_r(count($productsReduced));
        // die();
        return $productsReduced;
    }
}