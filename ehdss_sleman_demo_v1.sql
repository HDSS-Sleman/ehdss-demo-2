-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2022 at 09:02 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ehdss_sleman_demo_v1`
--

-- --------------------------------------------------------

--
-- Table structure for table `hl2022_data_result`
--

CREATE TABLE `hl2022_data_result` (
  `id_data_result` int(11) NOT NULL,
  `idrt` text NOT NULL,
  `tanggal` timestamp NOT NULL DEFAULT current_timestamp(),
  `hash` varchar(64) NOT NULL,
  `data` text NOT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Hasil upload data client';

--
-- Dumping data for table `hl2022_data_result`
--

INSERT INTO `hl2022_data_result` (`id_data_result`, `idrt`, `tanggal`, `hash`, `data`, `keterangan`) VALUES
(10, 'IDl8wj6e89l1mmd84rjbYb6ms', '2022-10-06 04:04:37', 'd17985b719a9e7c4e24a3d099323e2cf', '{\"ir\":{\"idrt\":\"IDl8wj6e89l1mmd84rjbYb6ms\",\"ir01\":\"joko\",\"ir02\":89,\"ir03\":\"1\",\"ir04\":\"12\",\"ir05\":\"3\",\"ir06\":\"sleman\",\"ir07\":\"2\",\"ir08\":\"4\",\"ir09\":\"mancing\",\"ir10\":\"arisan\"},\"klk\":{\"klk1\":\"1\",\"klk2\":\"2\",\"klk3\":\"3\",\"klk4\":\"4\",\"klk5\":\"1\",\"klk6\":\"2\",\"klk7\":\"3\",\"klk8\":\"4\",\"klk9\":\"1\",\"klk10\":\"2\",\"klk11\":\"3\",\"klk12\":\"4\",\"klk13\":\"1\",\"klk14\":\"2\",\"klk15\":\"3\",\"klk16\":\"4\"},\"lkf\":{\"lkf1\":\"d\",\"lkf2\":\"b\"},\"lkm\":{\"lkm1\":\"1\",\"lkm2\":\"2\",\"lkm3\":\"3\"},\"pkl\":{\"pkl1\":1,\"pkl2\":2,\"pkl3\":3,\"pkl4\":4},\"pss\":{\"pss1\":\"a\",\"pss2\":\"c\"},\"pst\":{\"pst1\":1,\"pst2\":2,\"pst3\":3,\"pst4\":4},\"kmt\":{\"kmt1\":4,\"kmt2\":2,\"kmt3\":1},\"kbt\":{\"kbt1\":3,\"kbt2\":2,\"kbt3\":4}}', NULL),
(11, 'IDl8wlxprd5khhzau8apx8Yywl', '2022-10-06 05:19:13', '286d4cb9761c16f256645afa36cb74b1', '{\"ir\":{\"idrt\":\"IDl8wlxprd5khhzau8apx8Yywl\",\"ir01\":\"april\",\"ir02\":89,\"ir03\":\"2\",\"ir04\":\"3\",\"ir05\":\"3\",\"ir06\":\"magelang\",\"ir07\":\"3\",\"ir08\":\"6\",\"ir09\":\"membaca\",\"ir10\":\"kerja bakti\"},\"klk\":{\"klk1\":\"4\",\"klk2\":\"4\",\"klk3\":\"4\",\"klk4\":\"4\",\"klk5\":\"4\",\"klk6\":\"4\",\"klk7\":\"4\",\"klk8\":\"4\",\"klk9\":\"4\",\"klk10\":\"4\",\"klk11\":\"4\",\"klk12\":\"4\",\"klk13\":\"4\",\"klk14\":\"4\",\"klk15\":\"4\",\"klk16\":\"4\"},\"lkf\":{\"lkf1\":\"d\",\"lkf2\":\"a\"},\"lkm\":{\"lkm1\":\"1\",\"lkm2\":\"3\",\"lkm3\":\"4\"},\"pkl\":{\"pkl1\":1,\"pkl2\":2,\"pkl3\":3,\"pkl4\":4},\"pss\":{\"pss1\":\"b\",\"pss2\":\"d\"},\"pst\":{\"pst1\":3,\"pst3\":3,\"pst4\":3,\"pst2\":3},\"kmt\":{\"kmt1\":1,\"kmt2\":1,\"kmt3\":1},\"kbt\":{\"kbt1\":2,\"kbt2\":2,\"kbt3\":2}}', NULL),
(12, 'IDla9ko3k023e9rgasiboE2MTO', '2022-11-09 11:44:06', '4af2a746511b00b9aa2f8d47fc131fc4', '{\"ir\":{\"idrt\":\"IDla9ko3k023e9rgasiboE2MTO\",\"ir01\":\"ini coba\",\"ir02\":23,\"ir03\":\"1\",\"ir04\":\"49\",\"ir04lain\":\"unit lain\",\"ir05\":\"2\",\"ir07\":\"1\",\"ir11\":\"0891231231231\",\"ir08\":\"7\",\"ir08a\":\"info lain\"},\"klk\":{\"klk1\":\"4\",\"klk2\":\"4\",\"klk3\":\"4\",\"klk4\":\"4\",\"klk5\":\"4\",\"klk6\":\"4\",\"klk7\":\"4\",\"klk8\":\"4\",\"klk9\":\"4\",\"klk10\":\"4\",\"klk11\":\"4\",\"klk12\":\"4\",\"klk13\":\"4\",\"klk14\":\"4\",\"klk15\":\"4\",\"klk16\":\"4\"},\"lkf\":{\"lkf1\":\"b\",\"lkf2\":\"b\"},\"lkm\":{\"lkm1\":\"1\",\"lkm2\":\"1\",\"lkm3\":\"2\"},\"pkl\":{\"pkl1\":1,\"pkl2\":2,\"pkl3\":3,\"pkl4\":1},\"pss\":{\"pss1\":\"a\",\"pss2\":\"b\"},\"pst\":{\"pst1\":1,\"pst2\":2,\"pst3\":3,\"pst4\":3},\"kmt\":{\"kmt1\":4,\"kmt2\":3,\"kmt3\":1},\"kbt\":{\"kbt1\":2,\"kbt2\":2,\"kbt3\":1}}', NULL),
(13, 'IDla9l4969zhqx7dvr97bGbfWU', '2022-11-09 11:56:32', '3fc7eeb05ef190e7f80475c007a40558', '{\"ir\":{\"idrt\":\"IDla9l4969zhqx7dvr97bGbfWU\",\"ir01\":\"coba coba\",\"ir02\":23,\"ir03\":\"1\",\"ir04\":\"49\",\"ir04lain\":\"fakultas lain\",\"ir05\":\"1\",\"ir07\":\"2\",\"ir11\":\"089123123123\",\"ir08\":\"6\"},\"klk\":{\"klk1\":\"3\",\"klk2\":\"3\",\"klk3\":\"3\",\"klk5\":\"3\",\"klk4\":\"2\",\"klk6\":\"3\",\"klk7\":\"3\",\"klk8\":\"3\",\"klk9\":\"3\",\"klk10\":\"3\",\"klk11\":\"3\",\"klk13\":\"3\",\"klk14\":\"3\",\"klk15\":\"3\",\"klk16\":\"3\",\"klk12\":\"3\"},\"lkf\":{\"lkf1\":\"b\",\"lkf2\":\"b\"},\"lkm\":{\"lkm1\":\"1\",\"lkm2\":\"3\",\"lkm3\":\"2\"},\"pkl\":{\"pkl2\":3,\"pkl3\":1,\"pkl1\":2,\"pkl4\":3},\"pss\":{\"pss1\":\"a\",\"pss2\":\"b\"},\"pst\":{\"pst1\":3,\"pst2\":2,\"pst3\":2,\"pst4\":3},\"kmt\":{\"kmt1\":2,\"kmt3\":3,\"kmt2\":1},\"kbt\":{\"kbt1\":3,\"kbt2\":2,\"kbt3\":3}}', NULL),
(14, 'IDlag7p0mqxe9e4tlz1geFbiau', '2022-11-14 03:15:03', 'd52ba19d35fe8105af6a6009626aa387', '{\"ir\":{\"idrt\":\"IDlag7p0mqxe9e4tlz1geFbiau\",\"ir01\":\"cobaa\",\"ir02\":99,\"ir03\":\"1\",\"ir04\":\"1\",\"ir05\":\"1\",\"ir07\":\"1\",\"ir11\":\"089123123123\",\"ir08\":\"6\"},\"klk\":{\"klk1\":\"1\",\"klk2\":\"1\",\"klk3\":\"1\",\"klk4\":\"1\",\"klk5\":\"1\",\"klk6\":\"1\",\"klk7\":\"1\",\"klk8\":\"1\",\"klk9\":\"1\",\"klk10\":\"1\",\"klk11\":\"1\",\"klk12\":\"1\",\"klk13\":\"1\",\"klk14\":\"1\",\"klk15\":\"1\",\"klk16\":\"1\"},\"lkf\":{\"lkf1\":\"b\",\"lkf2\":\"b\"},\"lkm\":{\"lkm1\":\"1\",\"lkm2\":\"1\",\"lkm3\":\"1\"},\"pkl\":{\"pkl1\":2,\"pkl2\":2,\"pkl3\":2,\"pkl4\":2},\"pss\":{\"pss1\":\"a\",\"pss2\":\"b\"},\"pst\":{\"pst1\":2,\"pst2\":3,\"pst4\":1,\"pst3\":3},\"kmt\":{\"kmt1\":2,\"kmt2\":3,\"kmt3\":3},\"kbt\":{\"kbt1\":3,\"kbt2\":1,\"kbt3\":4}}', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hl2022_users`
--

CREATE TABLE `hl2022_users` (
  `id_user` int(11) NOT NULL,
  `user` varchar(50) NOT NULL DEFAULT '0',
  `password` varchar(255) NOT NULL DEFAULT '0' COMMENT 'md5(md5(password))',
  `role` varchar(255) NOT NULL DEFAULT '0' COMMENT 'enum, manajer, admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hl2022_users`
--

INSERT INTO `hl2022_users` (`id_user`, `user`, `password`, `role`) VALUES
(140, 'riyan', '59cf8e8a53c0c81c742b87c52a89d24f', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `hl2022_user_enum`
--

CREATE TABLE `hl2022_user_enum` (
  `id_user_enum` int(11) NOT NULL,
  `user` varchar(50) NOT NULL DEFAULT '0',
  `enum` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='User supervisor has enum';

--
-- Dumping data for table `hl2022_user_enum`
--

INSERT INTO `hl2022_user_enum` (`id_user_enum`, `user`, `enum`) VALUES
(6, 'spv', 'enum'),
(7, 'spv', 'enum1'),
(8, 'spv', 'enum2');

-- --------------------------------------------------------

--
-- Table structure for table `hl2022_user_rt`
--

CREATE TABLE `hl2022_user_rt` (
  `id_user_rt` int(11) NOT NULL,
  `user` varchar(50) NOT NULL DEFAULT '0',
  `idrt` int(11) NOT NULL DEFAULT 0,
  `tgl` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hl2022_data_result`
--
ALTER TABLE `hl2022_data_result`
  ADD PRIMARY KEY (`id_data_result`),
  ADD KEY `hash` (`hash`),
  ADD KEY `idrt` (`idrt`(255)),
  ADD KEY `tanggal` (`tanggal`);

--
-- Indexes for table `hl2022_users`
--
ALTER TABLE `hl2022_users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `IdxUser` (`user`);

--
-- Indexes for table `hl2022_user_enum`
--
ALTER TABLE `hl2022_user_enum`
  ADD PRIMARY KEY (`id_user_enum`);

--
-- Indexes for table `hl2022_user_rt`
--
ALTER TABLE `hl2022_user_rt`
  ADD PRIMARY KEY (`id_user_rt`),
  ADD UNIQUE KEY `idx_idrt_rt` (`idrt`),
  ADD KEY `idx_user_rt` (`user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hl2022_data_result`
--
ALTER TABLE `hl2022_data_result`
  MODIFY `id_data_result` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `hl2022_users`
--
ALTER TABLE `hl2022_users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=192;

--
-- AUTO_INCREMENT for table `hl2022_user_enum`
--
ALTER TABLE `hl2022_user_enum`
  MODIFY `id_user_enum` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `hl2022_user_rt`
--
ALTER TABLE `hl2022_user_rt`
  MODIFY `id_user_rt` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
