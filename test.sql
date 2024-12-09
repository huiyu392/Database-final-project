/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.18-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: DBproject
-- ------------------------------------------------------
-- Server version	10.6.18-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assignment` (
  `e_id` char(10) NOT NULL,
  `assign_date` date NOT NULL,
  `code` char(6) NOT NULL,
  `ambassador` varchar(14) NOT NULL,
  `is_assign` int(1) DEFAULT 1,
  PRIMARY KEY (`e_id`,`code`),
  KEY `assignment_ibfk_1` (`code`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`code`) REFERENCES `country` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assignment_ibfk_2` FOREIGN KEY (`e_id`) REFERENCES `employee` (`e_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country` (
  `code` char(6) NOT NULL CHECK (`code` regexp '^[A-Z]{2}[0-9]{4}+$'),
  `name` varchar(14) NOT NULL,
  `continent` varchar(6) DEFAULT NULL,
  `headman` varchar(14) DEFAULT NULL,
  `foreign_minister` varchar(14) DEFAULT NULL,
  `contact_person` varchar(14) DEFAULT NULL,
  `population` bigint(14) DEFAULT NULL CHECK (`population` > 0),
  `area` bigint(14) DEFAULT NULL CHECK (`area` > 0),
  `phone` varchar(14) DEFAULT NULL,
  `is_ally` tinyint(1) DEFAULT 0,
  `is_exit` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES ('AA4322','美麗國','北美洲','李四王','王武','趙六',200000000,9630000,'01919171234567',0,0),('BB2345','幸福國','亞洲','張三','李四','王五',150000000,8500000,'01023456667389',1,1),('CC6789','奇蹟國','歐洲','李美麗','陳大明','王小明',50000000,450000,'03312345600378',1,0),('DD5678','和平國','非洲','馬克·杜布','彼得·華盛頓','艾瑪·劉',30000000,2500000,'07551234565437',0,1),('EE8765','快樂國','南美洲','安東尼·羅德','瑪麗亞·佩雷斯','瑪麗·查理',120000000,1200000,'04012324355678',1,1),('FF1234','奇幻國','非洲','保羅·托馬斯','瑪利亞·金','傑克·林',25000000,500000,'06771234567890',0,1),('GG5678','探險國','歐洲','安娜·莉莉','蘇珊·張','艾米·高',60000000,800000,'07123456788950',1,0),('HH9101','寧靜國','大洋洲','羅伯特·李','湯姆·高爾','珍·史密斯',35000000,700000,'08123456789220',1,1),('LL3424','fd','亞洲','dd','ss','ff',33342,2424,'01234567891234',1,1),('RR8888','西瓜國','非洲','西瓜籽','大冬瓜','菜瓜',3333,50,'45555555555555',1,1);
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dependent`
--

DROP TABLE IF EXISTS `dependent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dependent` (
  `e_id` char(10) NOT NULL,
  `d_id` char(10) NOT NULL,
  `name` varchar(14) NOT NULL,
  `gender` char(1) DEFAULT NULL CHECK (`gender` in ('M','F')),
  `relationship` varchar(6) NOT NULL,
  `birth` date DEFAULT NULL,
  `is_relation` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`e_id`,`d_id`),
  CONSTRAINT `dependent_ibfk_1` FOREIGN KEY (`e_id`) REFERENCES `employee` (`e_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dependent`
--

LOCK TABLES `dependent` WRITE;
/*!40000 ALTER TABLE `dependent` DISABLE KEYS */;
INSERT INTO `dependent` VALUES ('B123456789','A122454000','呂東萊','M','關係消滅','1980-10-31',0),('B123456789','A122454444','呂東萊','M','關係消滅','1980-10-31',0),('B123456789','G444444444','asd','F','離婚','2024-12-30',0),('E100000001','A123454321','李翠萍','F','被人收養','1985-05-10',0),('E100000001','H544444444','ewr','M','配偶','2024-12-08',1),('E100000001','P645555646','u7u','F','手足','2025-01-06',1),('E100000001','R342432431','dsf','M','父母','2025-01-07',1),('E123456789','N234444444','Eerwrwr4t4t4','F','配偶','2025-01-07',1),('L188888889','Q244454444','JOJO','M','子女','1985-12-10',0),('R444444444','g444444444','etr','M','父母','2024-12-31',1),('R444444444','J777777777','sad','M','其他','2025-01-11',1),('T543444444','B111111111','kkkkkk','M','配偶','2024-12-08',1),('w222222222','F222454444','三嗎','F','被人收養','1985-05-12',0);
/*!40000 ALTER TABLE `dependent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee` (
  `e_id` char(10) NOT NULL,
  `name` varchar(14) NOT NULL,
  `grade` varchar(10) DEFAULT NULL,
  `salary` int(8) DEFAULT NULL CHECK (`salary` > 0),
  `phone` varchar(14) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL CHECK (`gender` in ('M','F')),
  `birth` date DEFAULT NULL,
  `hire_date` date NOT NULL,
  `address` varchar(30) DEFAULT NULL,
  `photo` blob DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`e_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('A98765432','林美華','簡任三等',40000,'8860922223333','F','2024-12-09','2024-12-09','高雄市前鎮區中山路三段四五六號',NULL,0),('B123456789','呂溪東','簡任三等',80000,'3333333333333','M','1970-11-02','2012-11-03','台中市台灣大道四段一七二七號',NULL,0),('E100000001','dddde Doe','B',6000,'6666666666666','F','1990-02-02','2024-02-01','456 ',NULL,1),('E123456789','John Doe','A',5000,'7777777777777','M','1990-01-01','2024-01-01','123 Street, City, Country',NULL,1),('L188888889','test3','A',700,'123-456-7890','M','1990-01-01','2024-01-01','123 Main Street',NULL,1),('L787878787','koko','薦任五等',5000,'6547897897985','M','1984-06-13','2024-02-14','qwe qwe',NULL,0),('O123456789','廖玉米','員任十等',100,'8860962145798','F','2004-06-28','2024-12-09','新竹市米粉村貢丸路四段',NULL,0),('P224684986','sdfd','sdfdsf',666,'9999999999999','M','2024-12-07','2024-12-07','5dsf',NULL,1),('Q987654321','Bamboo','簡任一等',99999999,'8860914888888','F','2004-02-09','2024-12-09','新竹市米粉村貢丸路三段',NULL,0),('R444444444','dg','rg',5554,'4555555555555','F','2024-12-08','2024-12-08','gdddddddddd',NULL,1),('T543444444','df','treter',5436356,'2453533333333','F','2024-12-08','2024-12-08','treeee',NULL,1),('w222222222','dsf','ds',88888888,'5555555555555','M','2024-12-07','2024-12-07','sfdsf',NULL,1);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-09 22:41:31
