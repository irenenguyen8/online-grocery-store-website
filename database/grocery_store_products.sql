-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: grocery_store
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) DEFAULT NULL,
  `unit_price` float(8,2) NOT NULL,
  `unit_quantity` varchar(255) NOT NULL,
  `category_id` int DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `in_stock` int DEFAULT '1',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subcategory_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_ibfk_1` (`category_id`),
  KEY `products_ibfk_2` (`subcategory_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Apples',1.99,'1kg',2,'/images/apples.jpg',6,1,'2025-04-10 13:09:22','2025-04-19 11:57:33',4),(2,'Bananas',1.49,'1kg',2,'/images/bananas.jpg',50,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',4),(3,'Bath Soap',2.60,'6 packs',4,'/images/bath-soap.jpg',10,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',16),(4,'Bird Food',3.99,'500g',6,'/images/bird-food.jpg',15,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',17),(5,'Cat Food',2.00,'500g',6,'/images/cat-food.jpg',18,1,'2025-04-10 13:09:22','2025-04-19 09:27:09',14),(6,'Cheddar Cheese',15.00,'1kg',2,'/images/cheddar-cheese-1000.jpg',5,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',6),(7,'Cheddar Cheese',8.00,'500g',2,'/images/cheddar-cheese-500.jpg',10,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',6),(8,'Chocolate Bar',2.50,'500g',7,'/images/chocolate-bar.jpg',30,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',NULL),(9,'Dry Dog Food',1.95,'1kg',6,'/images/dry-dog-food-1.jpg',25,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',13),(10,'Dry Dog Food',5.95,'5kg',6,'/images/dry-dog-food-5.jpg',10,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',13),(11,'Earl Grey Tea Bags',7.25,'100 packs',1,'/images/earl-grey-tea-100.jpg',10,1,'2025-04-10 13:09:22','2025-04-19 11:18:21',1),(12,'Earl Grey Tea Bags',13.00,'200 packs',1,'/images/earl-grey-tea-200.jpg',8,1,'2025-04-10 13:09:22','2025-04-19 11:18:28',1),(13,'Earl Grey Tea Bags',2.49,'25 packs',1,'/images/earl-grey-tea-25.jpg',15,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',1),(14,'Fish Fingers',5.00,'1kg',3,'/images/fish-fingers-1000.jpg',30,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',9),(15,'Fish Fingers',2.55,'500g',3,'/images/fish-fingers-500.jpg',10,1,'2025-04-10 13:09:22','2025-04-19 07:25:51',9),(16,'Fish Food',3.00,'500g',6,'/images/fish-food.jpg',30,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',18),(17,'Garbage Bags Large',5.00,'50 packs',5,'/images/garbage-bags-large.jpg',15,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',12),(18,'Garbage Bags Small',1.50,'10 packs',5,'/images/garbage-bags-small.jpg',30,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',12),(19,'Grapes',3.50,'1kg',2,'/images/grapes.jpg',20,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',4),(20,'Hamburger Patties',2.35,'10 packs',2,'/images/hamburger.jpg',0,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',7),(21,'Instant Coffee',2.89,'200g',1,'/images/instant-coffee-200.jpg',20,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',1),(22,'Instant Coffee ',5.10,'500g',1,'/images/instant-coffee-500.jpg',15,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',1),(23,'Laundry Bleach',3.55,'2L',5,'/images/laundry-bleach.jpg',50,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',11),(24,'Navel Oranges',3.99,'1 bag',2,'/images/navel-oranges.jpg',20,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',4),(25,'Panadol',5.50,'1 bottle',4,'/images/panadol.jpg',40,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',15),(26,'Panadol',3.00,'24 pack',4,'/images/panadol-pack.jpg',25,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',15),(27,'Peaches ',2.99,'1kg',2,'/images/peaches.jpg',30,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',4),(28,'Shelled Prawns',6.90,'250g',2,'/images/prawns.jpg',0,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',7),(29,'T Bone Steak',7.00,'1kg',2,'/images/t-bone-steak.jpg',10,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',7),(30,'Tub Ice Cream',1.80,'1L',3,'/images/ice-cream-1.jpg',20,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',8),(31,'Tub Ice Cream',3.40,'2L',3,'/images/ice-cream-2.jpg',15,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',8),(32,'Washing Powder',4.00,'1kg',5,'/images/washing-powder.jpg',50,1,'2025-04-10 13:09:22','2025-04-19 07:26:56',11),(33,'Orange Juice',7.00,'1 bottle',1,'/images/orange-juice-1l.jpg',2,1,'2025-04-10 13:09:22','2025-04-10 13:09:22',2),(34,'Coke',3.00,'235ml',1,'/images/coke.jpg',4,1,'2025-04-10 13:09:22','2025-04-10 13:09:22',3),(35,'Tomatoes',7.00,'1 kg',2,'/images/tomatoes.jpg',50,1,'2025-04-10 13:09:22','2025-04-10 13:09:22',5),(36,'Frozen vegetables',6.00,'1 kg',3,'/images/frozen-vegetables.jpg',10,1,'2025-04-10 13:09:22','2025-04-19 12:08:56',10);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-21 18:45:12
