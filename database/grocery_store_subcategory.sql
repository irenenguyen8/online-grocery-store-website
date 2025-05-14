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
-- Table structure for table `subcategory`
--

DROP TABLE IF EXISTS `subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `category_id` int DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subcategory_ibfk_1` (`category_id`),
  CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategory`
--

LOCK TABLES `subcategory` WRITE;
/*!40000 ALTER TABLE `subcategory` DISABLE KEYS */;
INSERT INTO `subcategory` VALUES (1,'Coffee & Tea',1,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(2,'Juices',1,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(3,'Soda & Soft Drinks',1,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(4,'Fruits',2,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(5,'Vegetables',2,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(6,'Dairy & Eggs',2,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(7,'Meat & Poultry',2,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(8,'Ice Cream',3,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(9,'Frozen Meals',3,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(10,'Frozen Vegetables',3,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(11,'Cleaning Supplies',5,1,'2025-04-17 00:53:36','2025-04-17 01:02:51'),(12,'Kitchenware',5,1,'2025-04-17 00:53:36','2025-04-17 01:02:51'),(13,'Dog Food',6,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(14,'Cat Food',6,1,'2025-04-17 00:53:36','2025-04-17 00:53:36'),(15,'Medicine',4,1,'2025-04-17 01:02:51','2025-04-17 01:02:51'),(16,'Personal Care',4,1,'2025-04-17 01:02:51','2025-04-17 01:02:51'),(17,'Bird Food',6,1,'2025-04-17 01:05:09','2025-04-17 01:05:09'),(18,'Fish Food',6,1,'2025-04-17 01:08:46','2025-04-17 01:08:46');
/*!40000 ALTER TABLE `subcategory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-21 18:45:13
