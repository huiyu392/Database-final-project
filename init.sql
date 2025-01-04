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
-- Current Database: `DBproject`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `003` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `003`;

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
  `ambassador` varchar(14) DEFAULT NULL,
  `is_assign` int(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`e_id`,`code`),
  KEY `assignment_ibfk_1` (`code`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`code`) REFERENCES `country` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assignment_ibfk_2` FOREIGN KEY (`e_id`) REFERENCES `employee` (`e_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-03 16:24:20
