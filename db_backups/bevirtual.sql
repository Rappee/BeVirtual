-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bevirtual
-- ------------------------------------------------------
-- Server version	5.7.17-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `persons` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `StoreId` int(11) DEFAULT NULL,
  `CustomerId` int(11) DEFAULT NULL,
  `PaymentId` int(11) DEFAULT NULL,
  `ProductId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Bookings_StoreId_foreign_idx` (`StoreId`),
  KEY `Bookings_CustomerId_foreign_idx` (`CustomerId`),
  KEY `Bookings_PaymentId_foreign_idx` (`PaymentId`),
  KEY `Bookings_ProductId_foreign_idx` (`ProductId`),
  CONSTRAINT `Bookings_CustomerId_foreign_idx` FOREIGN KEY (`CustomerId`) REFERENCES `customers` (`id`),
  CONSTRAINT `Bookings_PaymentId_foreign_idx` FOREIGN KEY (`PaymentId`) REFERENCES `payments` (`id`),
  CONSTRAINT `Bookings_ProductId_foreign_idx` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`),
  CONSTRAINT `Bookings_StoreId_foreign_idx` FOREIGN KEY (`StoreId`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `closingperiods`
--

DROP TABLE IF EXISTS `closingperiods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `closingperiods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `validFrom` date DEFAULT NULL,
  `validTill` date DEFAULT NULL,
  `closedFrom` datetime DEFAULT NULL,
  `closedTill` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `StoreId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ClosingPeriods_StoreId_foreign_idx` (`StoreId`),
  CONSTRAINT `ClosingPeriods_StoreId_foreign_idx` FOREIGN KEY (`StoreId`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `closingperiods`
--

LOCK TABLES `closingperiods` WRITE;
/*!40000 ALTER TABLE `closingperiods` DISABLE KEYS */;
/*!40000 ALTER TABLE `closingperiods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zipcode` int(11) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `open`
--

DROP TABLE IF EXISTS `open`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `open` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `validFrom` date NOT NULL,
  `validTill` date NOT NULL,
  `weekday` varchar(2) NOT NULL,
  `openFrom` varchar(5) NOT NULL,
  `duration` int(11) NOT NULL,
  `StoreId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Open_StoreId_foreign_idx` (`StoreId`),
  CONSTRAINT `Open_StoreId_foreign_idx` FOREIGN KEY (`StoreId`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `open`
--

LOCK TABLES `open` WRITE;
/*!40000 ALTER TABLE `open` DISABLE KEYS */;
INSERT INTO `open` VALUES (25,'2018-01-01','2018-12-31','Wo','14:00',30,7),(26,'2018-01-01','2018-12-31','Wo','14:30',30,7),(27,'2018-01-01','2018-12-31','Wo','15:00',30,7),(28,'2018-01-01','2018-12-31','Wo','15:30',30,7),(29,'2018-01-01','2018-12-31','Wo','16:00',30,7),(30,'2018-01-01','2018-12-31','Wo','16:30',30,7),(31,'2018-01-01','2018-12-31','Wo','17:00',30,7),(32,'2018-01-01','2018-12-31','Wo','17:30',30,7),(33,'2018-01-01','2018-12-31','Wo','18:00',30,7),(34,'2018-01-01','2018-12-31','Wo','18:30',30,7),(35,'2018-01-01','2018-12-31','Wo','19:00',30,7),(36,'2018-01-01','2018-12-31','Wo','19:30',30,7),(37,'2019-01-01','2019-01-01','Za','16:00',30,7),(38,'2019-01-01','2019-01-01','Za','16:30',30,7),(39,'2019-01-01','2019-01-01','Za','17:00',30,7),(40,'2019-01-01','2019-01-01','Za','17:30',30,7),(41,'2019-01-01','2019-01-01','Za','18:00',30,7),(42,'2019-01-01','2019-01-01','Za','18:30',30,7),(43,'2019-01-01','2019-01-01','Za','19:00',30,7),(44,'2019-01-01','2019-01-01','Za','19:30',30,7),(45,'2019-01-01','2019-01-01','Za','20:00',30,7),(46,'2019-01-01','2019-01-01','Za','20:30',30,7),(47,'2019-01-01','2019-01-01','Za','21:00',30,7),(48,'2019-01-01','2019-01-01','Za','21:30',30,7),(49,'2019-01-01','2019-01-01','Za','22:00',30,7),(50,'2019-01-01','2019-01-01','Za','22:30',30,7);
/*!40000 ALTER TABLE `open` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` int(11) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `available` int(11) DEFAULT NULL,
  `price1` int(11) DEFAULT NULL,
  `price2` int(11) DEFAULT NULL,
  `price3` int(11) DEFAULT NULL,
  `price4` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `StoreId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Products_StoreId_foreign_idx` (`StoreId`),
  CONSTRAINT `Products_StoreId_foreign_idx` FOREIGN KEY (`StoreId`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20180730114602-create-store.js'),('20180730115438-create-product.js'),('20180730115619-create-booking.js'),('20180730115834-create-customers.js'),('20180730115920-create-open.js'),('20180730115931-create-closing-period.js'),('20180731115050-create-associations.js'),('20180801075158-create-payment.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `zipcode` int(11) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `availableSlots` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (7,'Ene Straat 53',9000,'Gent',4,'2018-08-13 12:47:16','2018-08-13 12:47:16'),(8,'Andere Straat 18',2000,'Antwerpen',8,'2018-08-13 12:47:16','2018-08-13 12:47:16');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-13 20:03:45
