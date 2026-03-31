-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 31-03-2026 a las 19:07:37
-- Versión del servidor: 11.8.6-MariaDB-log
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `u976451970_personal_data`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `translation`
--

CREATE TABLE `translation` (
  `id` int(12) NOT NULL COMMENT 'Id traducción',
  `title` varchar(50) NOT NULL COMMENT 'Título',
  `author` varchar(80) DEFAULT NULL COMMENT 'Autores separados por comas',
  `publisher` int(11) DEFAULT NULL COMMENT 'Editorial',
  `genre` set('Juvenil','Fantasía','Ciencia ficción','Infantil','Novela negra','Romántica','Clásico','No ficción','Viajes','Young adult','Aventuras','Manual de yoga','Manual de pilates','Empresarial','Esoterismo','Psicología') DEFAULT NULL COMMENT 'Géneros',
  `year` year(4) DEFAULT 2023 COMMENT 'Año de publicación',
  `history` longtext DEFAULT NULL COMMENT 'Historia con la traducción',
  `img_cover` longblob DEFAULT NULL COMMENT 'Imagen portada',
  `img_end` longblob DEFAULT NULL COMMENT 'Imagen contraportada',
  `link` varchar(200) DEFAULT NULL COMMENT 'Link a la página donde se vende'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `translation`
--

INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(1, 'Franco. Unidos en la distancia', 'Kim Holden', 1, 'Romántica', '2018', 'Este libro es muy especial para mí porque, gracias a él, firmé mi primer contrato editorial', NULL, NULL, 'https://ozeditorial.com/index.php?id_product=92&controller=product');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(4, 'La amiga', 'Teresa Driscoll', 3, 'Novela negra', '2019', 'Este libro me enganchó desde el principio por su intriga, presente desde la primera página.', NULL, NULL, 'https://principaldeloslibros.com/index.php?id_product=210&controller=product');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(5, 'Transformacion exponencial', 'Francisco Palao, Michelle Lapierre y Salim Ismail', 9, 'Empresarial', '2019', 'Con esta obra me introduje en el mundo empresarial. Muy recomendable para tranformar un negocio tradicional en una organización exponencial.', NULL, NULL, 'https://www.bubok.es/libros/260962/Transformacion-exponencial');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(6, 'Rutina diaria de yoga', 'Maurizio Morelli', 4, 'Manual de yoga', '2020', 'Con este libro descubrí que la excusa de no tener tiempo para hacer deporte no era válida porque bastan 20 minutos diarios para mantenerte en forma física y mentalmente.', NULL, NULL, 'http://www.edimat.es/edimat_libros.php?codigoISBN=9788497944977&categoria=Divulgaci%C3%B3n');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(7, 'Técnicas de respiración en el yoga', 'Maurizio Morelli', 4, 'Manual de yoga', '2020', 'Esta obra me enseñó el arte del Pranayama, que ayuda a entender los errores que cometemos en nuestra manera de respirar y a controlarla para conectarnos con el universo.', NULL, NULL, 'http://www.edimat.es/edimat_libros.php?codigoISBN=9788497944984&categoria=Divulgaci%C3%B3n');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(8, 'El método pilates', 'Anna Maria Cova', 4, 'Manual de pilates', '2020', 'Este manual muestra los beneficios del método Pilates para nuestro cuerpo a través de ejercicios asequibles para realizar en casa.', NULL, NULL, 'http://www.edimat.es/edimat_libros.php?codigoISBN=9788497944991&categoria=Divulgaci%C3%B3n');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(9, 'La naturaleza en el yoga', 'Sonia Pippinato', 4, 'Manual de yoga', '2020', 'Este libro nos acerca a la naturaleza a través del yoga con un lenguaje claro que nos informa de los beneficios de cada asana.', NULL, NULL, 'http://www.edimat.es/edimat_libros.php?codigoISBN=9788497944960&categoria=Divulgaci%C3%B3n');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(10, 'Asesinato en el campo de golf', 'Agatha Christie', 9, 'Novela negra,Clásico', '2020', 'Para mí fue un placer traducir a una autora tan importante como Agatha Christie y darle voz a un gran personaje como Poirot.', NULL, NULL, 'https://www.bubok.es/libros/265837/Asesinato-en-el-campo-de-golf-Edicion-en-letra-grande');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(11, 'El hombre del traje marrón', 'Agatha Christie', 9, 'Novela negra,Clásico', '2020', 'Otra fantástica obra de la diosa del misterio, Agatha Christie. La protagonista, Anne Beddingfeld, una mujer adelantada a su época, vive múltiples aventuras y se sumerge en una intriga tras otra.', NULL, NULL, 'https://www.bubok.es/libros/264579/El-hombre-del-traje-marron-Edicion-en-letra-grande');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(12, 'El maravilloso viaje subterráneo de Baron Trump', 'Ingersoll Lockwood', 11, 'Juvenil,Clásico,Aventuras', '2020', 'Esta novela, protagonizada por un variopinto personaje y su fiel mascota, recuerda a Los viajes de Gulliver. En ella, el Pequeño Baron Trump visita diversos pueblos subterráneos donde descubre una nueva visión de su propio mundo.', NULL, NULL, 'https://laisladesiltola.es/catalogo/narrativa/el-maravilloso-viaje-subterraneo-de-baron-trump/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(13, 'Érase una vez... ¡la música!', 'Paola Venturi', 8, 'Juvenil,Infantil', '2021', 'De la mano de Papageno, los niños se sumergirán en la historia de la música clásica, visitando artistas importantes como Mozart y acontecimientos revolucionarios como la caída del Imperio Romano.', NULL, NULL, 'https://redbookediciones.com/producto/musica/erase-una-vez-la-musica/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(14, 'Tierra de clanes', 'Sam Heughan, Graham McTavish', 3, 'No ficción,Viajes', '2021', 'Es la traducción que más compleja me ha resultado porque este libro está repleto de juegos de palabras, rimas y humor. Aun así, es el que más me ha dado a conocer porque ha tenido una gran acogida entre los fans de Outlander.', NULL, NULL, 'https://principaldeloslibros.com/index.php?id_product=248&controller=product&search_query=tierra+de+clanes+&results=2&');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(15, 'Un hombre llamado Muñeca', 'Jonathan Ames', 3, 'Novela negra', '2021', 'Recuerdo el nerviosismo que me produjo esta novela mientras la traducía al ver a su protagonista envuelto en situaciones que escapaban de su control. Una obra que te tiene en tensión desde la primera a la última página.', NULL, NULL, 'https://principaldeloslibros.com/index.php?id_product=257&controller=product&search_query=+un+hombre+llamado+muneca&results=1&');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(16, 'Juvenilia', 'Jane Austen', 4, 'Romántica,Clásico', '2021', 'Para este volumen, me encargaron la traducción de Juvenilia, un conjunto de pequeñas obras de una Jane Austen muy joven, aunque con su característico humor. ¡Las risas están aseguradas!', NULL, NULL, 'https://www.edimat.es/edimat_libros.php?codigoISBN=9788497945189&categoria=Literatura');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(18, 'Lady Susan/Los Watson', 'Jane Austen', 4, 'Romántica,Clásico', '2021', 'Para este volumen, me encargaron la traducción de Lady Susan y Los Watson. La primera es una novela epistolar con la que reirás a carcajadas por los ardides de la protagonista. La segunda tiene como curiosidad que Jane Austen no llegó a terminarla, aunque los estudiosos piensan que podría haber llegado a ser una de sus grandes obras.', NULL, NULL, 'https://www.edimat.es/edimat_libros.php?codigoISBN=9788497945196&categoria=Literatura');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(19, 'Tal vez somos eléctricos', 'Val Emmich', 14, 'Romántica,Young adult', '2021', 'Este libro me mantuvo enganchada desde la primera página. Con él, volví a mis años de instituto, al amor adolescente y a esa magia que hace feliz a mi niña interior. Tegan y Mac siempre tendrán un huequito en mi corazón.', NULL, NULL, 'https://wonderbooks.es/inicio/8-tal-vez-somo-electricos.html');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(20, 'Tierra de clanes. El almanaque', 'Sam Heughan, Graham McTavish', 3, 'No ficción,Viajes', '2021', 'Este almanaque me trasladó una vez más a Escocia de la mano de dos grandes actores y amigos.  Junto a ellos, se rememoran batallas, se visitan nuevos lugares y, sobre todo, se bebe mucho whisky.', NULL, NULL, 'https://principaldeloslibros.com/index.php?id_product=263&controller=product');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(21, 'Sentido y sensibilidad', 'Jane Austen', 10, 'Romántica,Clásico', '2021', 'Una vez más, Jane Austen volvió a mi vida, esta vez con una de sus obras más conocidas. Durante los meses que duró la traducción, acompañé a las hermanas Dashwood en sus fiestas, enamoramientos y desengaños. Publicado en la revista Mía.', NULL, NULL, 'https://suscripciones.zinetmedia.es/mz/femeninas/mia/mia-1842-sentidosensibilidad');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(22, 'Agnes Grey', 'Anne Brontë', 2021, 'Romántica,Clásico', '2021', 'Mientras traducía este maravilloso clásico de la hermana más pequeña de las Brontë, pude disfrutar de su estupenda prosa y ponerme en la piel de una protagonista decidida y firme que tiene que lidiar con niños, adolescentes y padres, a la vez que busca su sitio en el mundo. Publicado en la revista Mía.', NULL, NULL, 'https://suscripciones.zinetmedia.es/mz/femeninas/mia/mia-1833-agnesgrey');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(23, 'El creador de sueños', 'Igor Bedê', NULL, 'Ciencia ficción', '2021', 'Este libro supone mi primera colaboración con un escritor autopublicado y la verdad es que ha sido una experiencia fantástica por el mimo y el cariño con el que ha cuidado cada paso de la traducción. ¡Disfrutad de Lucius y sus aventuras!', NULL, NULL, 'https://www.amazon.es/El-Creador-Sue%C3%B1os-Igor-Bed%C3%AA/dp/B09NH3V7SW');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(24, 'Perro malo', 'Alex Smith', 3, 'Novela negra', '2022', 'El detective Kett me enamoró desde la primera página. Aparte de ser un detective fantástico que siempre quiere llegar al final de los casos, tiene una faceta de padre y marido preocupado por su mujer desaparecida que hizo que le cogiera mucho cariño.', NULL, NULL, 'https://principaldeloslibros.com/index.php?id_product=279&controller=product');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(25, 'La calavera de cristal', 'Eleonora Barsotti', 4, 'Infantil', '2022', 'Este encargo es especial para mí porque tuve que esperar dos años para verlo en formato físico debido a la pandemia del coronavirus. Sin embargo, Ágata y Arturo siempre tuvieron un lugar en mi corazón porque fueron los primeros personajes infantiles a los que di «voz» en español.', NULL, NULL, 'https://www.edimat.es/estudio_didactico.php?codigoISBN=9788497869584&categoria=Interactivos');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(27, 'El robo del Louvre', 'Eleonora Barsotti', 4, 'Infantil', '2022', 'Como el otro libro de esta colección, esta obra es especial para mí. Me encanta traducir literatura infantil y Ágata y Arturo me metieron de lleno en el mundillo con sus aventuras y retos. \r\n¡A disfrutar de París de su mano!', NULL, NULL, 'https://www.edimat.es/estudio_didactico.php?codigoISBN=9788497869577&categoria=Interactivos');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(28, 'El otro lado del cielo', 'Amie Kaufman, Meagan Spooner', 15, 'Juvenil,FantasÃ­a,Ciencia ficciÃ³n', '2023', 'Mi primera colaboraciÃ³n con Hidra me llevÃ³ a conocer a Nimh, North y su precioso universo. La conexiÃ³n entre ellos me hizo disfrutar como una niÃ±a de  la traducciÃ³n y espero que a vosotros os haga soÃ±ar al leer su historia.', NULL, NULL, 'https://www.editorialhidra.com/libro/el-otro-lado-del-cielo_136357/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(29, 'Dioses despiadados', 'Emily A. Duncan', 15, 'Juvenil,FantasÃ­a', '2022', 'Este libro representÃ³ un reto particular al tratarse de la segunda parte de una trilogÃ­a, por lo que debÃ­a prestar especial atenciÃ³n a aquellas traducciones que ya estuvieran incluidas en el primer tomo. Aun asÃ­, adentrarme en este mundo oscuro y misterioso fue un regalo.', NULL, NULL, 'https://www.editorialhidra.com/libro/dioses-despiadados_136374/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(30, 'Coronas gemelas', 'Catherine Doyle, Katherine Webber', 15, 'Juvenil,FantasÃ­a', '2022', 'Rose y Wren son dos personajes entraÃ±ables a los que rÃ¡pidamente cogÃ­ cariÃ±o. AdemÃ¡s, la historia es tan dinÃ¡mica que se convirtiÃ³ en el libro que mÃ¡s rÃ¡pido he traducido.  Si querÃ©is saber si pertenecerÃ­ais al aquelarre o a la realeza, haced el test en: https://take.quiz-maker.com/results527453-cf7D4347-CUQPI8OX', NULL, NULL, 'https://www.editorialhidra.com/libro/coronas-gemelas_142355/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(31, 'Benditos monstruos', 'Emily A. Duncan', 15, 'Juvenil,FantasÃ­a', '2023', 'Con este libro, di por concluida una trilogÃ­a que llegÃ³ a mÃ­ por casualidad. AsÃ­, tuve que despedirme de unos personajes a los que aprendÃ­ a querer al heredarlos de otra traductora en la segunda parte. Me parece que la autora les dedica un adiÃ³s maravilloso en esta obra.', NULL, NULL, 'https://www.editorialhidra.com/libro/benditos-monstruos_145772/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(32, 'Waypoints. Mi viaje escocÃ©s', 'Sam Heughan', 3, 'No ficciÃ³n,Viajes', '2023', 'En esta obra, acompaÃ±Ã© a Sam Heughan en su trabajo mÃ¡s personal. Con un tono mÃ¡s serio, el autor nos acerca a su carrera, repasando fracasos y Ã©xitos, al mismo tiempo que recorremos junto a Ã©l uno de los caminos mÃ¡s bonitos de Escocia. Como siempre, fue un placer darle voz en espaÃ±ol.', NULL, NULL, 'https://principaldeloslibros.com/index.php?id_product=299&controller=product');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(33, 'Los luminarios', 'Susan Dennard', 15, 'Juvenil,FantasÃ­a', '2023', 'La historia de cÃ³mo surgiÃ³ este libro me fascinÃ³. Al parecer, al personaje de Winnie lo crearon cientos de fans de la autora, quienes, a travÃ©s de encuestas en Twitter, dieron vida a un relato fascinante. Tiempo despuÃ©s, Susan Dennard tomÃ³ a la protagonista y sus amigos y creÃ³ una historia totalmente distinta, pero igual de emocionante.', NULL, NULL, 'https://www.editorialhidra.com/libro/los-luminarios_145803/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(34, 'MÃ¡s allÃ¡ del fin del mundo', 'Amie Kaufman, Meagan Spooner', 15, 'Juvenil,FantasÃ­a,Ciencia ficciÃ³n', '2023', 'La traducciÃ³n de este libro supuso la conclusiÃ³n de mi primera bilogÃ­a  completa. Es bonito poder darle un buen final a unos personajes a los que tienes tanto cariÃ±o.', NULL, NULL, 'https://www.editorialhidra.com/libro/mas-alla-del-fin-del-mundo_145774/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(35, 'Â¿CÃ³mo hacer enfadar a mamÃ¡ y a papÃ¡?', 'Gabriella Ballin, Anna Aparicio CatalÃ ', 16, 'Infantil', '2023', 'Un libro de niÃ±os muy gamberro que tus hijos no podrÃ¡n dejar de leer. O, mejor dicho, los hijos de tus amigos porque no creo que quieras que los tuyos tengan este manual. Â¡Es demasiado eficaz!', NULL, NULL, 'https://www.picarona.net/producto/como-hacer-enfadar-a-mama-y-a-papa/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(36, 'Mujercitas', 'Louisa May Alcott, Elisa Delucchi', 16, 'Infantil,ClÃ¡sico', '2023', 'Traducir clÃ¡sicos es volver a mis inicios. Sin embargo, en este caso, lo especial es que la autora lo enfoca desde una perspectiva infantil que me encanta.\r\nÂ¡Con mil actividades y pruebas!', NULL, NULL, 'https://www.picarona.net/producto/mujercitas/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(37, 'Alicia en el PaÃ­s de las Maravillas', 'Lewis Carroll, Elisa Delucchi', 16, 'Infantil,ClÃ¡sico', '2023', 'Lo mÃ¡s difÃ­cil de este libro fue la traducciÃ³n de una de las actividades en la que habÃ­a que adivinar una frase con un cÃ³digo secreto. Tuve que adaptar la soluciÃ³n en espaÃ±ol al nÃºmero de dibujos del cÃ³digo y a la longitud del original.\r\nÂ¡Reto superado!', NULL, NULL, 'https://www.picarona.net/producto/alicia-en-el-pais-de-las-maravillas/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(38, 'Coronas malditas', 'Catherine Doyle, Kaherine Webber', 15, 'Juvenil,FantasÃ­a', '2023', 'Pocas veces la segunda parte es mejor que la primera. En este caso, a pesar de que el principio de la saga no estuvo mal, este libro me dejÃ³ sin aliento mientras lo traducÃ­a. Â¡QuÃ© maravilla de trama!', NULL, NULL, 'https://www.editorialhidra.com/libro/coronas-malditas_148062/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(39, 'Dublineses + Retrato del artista adolescente', 'James Joyce', 4, 'ClÃ¡sico', '2023', 'Posiblemente el clÃ¡sico mÃ¡s complicado que he traducido hasta la fecha. James Joyce tiene una manera peculiar de contar historias que suele dejar con ganas de mÃ¡s al terminar sus relatos.', NULL, NULL, 'https://www.edimat.es/edimat_libros.php?codigoISBN=9788497945547&categoria=Literatura');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(40, 'Marcada por las estrellas', 'Roshani Chokshi', 15, 'Juvenil,FantasÃ­a', '2023', 'No tengo palabras para describir el estilo de esta autora. Su prosa juega a convertirse en poesÃ­a con un sinfÃ­n de giros, metÃ¡foras y sÃ­miles. Desde este libro, es una de mis autoras favoritas.', NULL, NULL, 'https://www.editorialhidra.com/libro/marcada-por-las-estrellas_148110/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(41, 'La magia del gato', 'Alessandro Montagnana', 16, 'Infantil', '2023', 'Los cuentos infantiles siguen produciÃ©ndome una sensaciÃ³n muy cÃ¡lida cada vez que llegan a mis manos. Por eso, yo tambiÃ©n me enamorÃ© de este gato tan adorable.', NULL, NULL, 'https://www.picarona.net/producto/la-magia-del-gato/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(42, 'Colmillo blanco', 'Jack London, Elisa Delucchi', 16, 'Infantil,ClÃ¡sico', '2023', 'Colmillo blanco fue una de mis historias favoritas durante mi adolescencia. Fue un placer reencontrarme con los protagonistas, un viaje en el tiempo.', NULL, NULL, 'https://www.picarona.net/producto/colmillo-blanco/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(43, 'Pinocho', 'Carlo Collodi, Elisa Delucchi', 16, 'Infantil,ClÃ¡sico', '2023', 'Â¿A quiÃ©n no le va a gustar traducir un clÃ¡sico como Pinocho? MÃ¡s si viene acompaÃ±ado de rompecabezas que hacen que me estruje el cerebro mientras traduzco. Â¡A todos nos gusta un buen reto!', NULL, NULL, 'https://www.picarona.net/producto/pinocho/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(44, 'PrÃ¡cticas empoderadoras para las personas altament', 'Bertold Keinar', 17, 'No ficciÃ³n,PsicologÃ­a', '2023', 'Este libro me empujÃ³ a considerar otro tipo de sensibilidades y me abriÃ³ los ojos sobre comportamientos de personas cercanas a mÃ­. Â¡Fue todo un descubrimiento!', NULL, NULL, 'https://www.edicionesobelisco.com/libros-de-psicologia/3743-practicas-empoderadoras-para-las-personas-altamente-sensibles.html?search_query=bertold+keinar&results=4');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(45, 'Una corona de deseos', 'Roshani Chokshi', 15, 'FantasÃ­a', '2024', 'No te puedes imaginar la emociÃ³n que sentÃ­ al saber que volvÃ­an a contar conmigo para traducir a esta autora. AdemÃ¡s, hay cameos muy esperados que estÃ¡bamos esperando todos los que leÃ­mos la primera parte de la bilogÃ­a.', NULL, NULL, 'https://www.editorialhidra.com/libro/una-corona-de-deseos_150315/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(46, 'MerlÃ­n moderno', 'Lon Art', 17, 'No ficciÃ³n,Esoterismo', '2024', 'Â¿Y si todo lo que nos pasa se debe a nuestra mentalidad? Â¿Y si, en lugar de volvernos pesimistas ante los fracasos, los convirtiÃ©ramos en una oportunidad para que el mundo nos ofreciera algo mejor? Espero seguir atrayendo traducciones tan interesantes como esta.', NULL, NULL, 'https://www.edicionesobelisco.com/libros-de-esoterismo/3774-merlin-moderno.html?search_query=merlin+moderno&results=35');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(47, 'La luna del cazador', 'Susan Dennard', 15, 'Juvenil,FantasÃ­a', '2024', 'La segunda parte de esta trilogÃ­a tiene todo lo que se necesita para disfrutar de una buena novela: hombres lobo, magia, romance y amistad. Su traducciÃ³n me dejÃ³ deseando sumergirme en la tercera parte. Â¡No digo mÃ¡s!', NULL, NULL, 'https://www.editorialhidra.com/libro/la-luna-del-cazador_150317/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(48, 'Los piratas cuatropatas - Una vida muy perra', 'Jack Henseleit, Chris Kennet', 18, 'Infantil', '2024', 'Â¿Juegos de palabras, humor y piratas con un rabo muy peludo? Â¡Me apunto! Una de las traducciones mÃ¡s difÃ­ciles de mi carrera, con dobles sentidos constantes y referencias animales a tutiplÃ©n. Para los mÃ¡s peques... y no tan peques.', NULL, NULL, 'https://www.penguinlibros.com/es/libros-ninos-7-anos/343309-ebook-los-piratas-cuatropatas-1-una-vida-muy-perra-9788419910318');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(49, 'Faebound', 'Saara El-Arifi', 19, 'FantasÃ­a', '2024', 'Mi primera traducciÃ³n para Faeris (Grupo Anaya) fue un regalo de Navidad anticipado. Â¿QuÃ© mejor manera de celebrar las fiestas que traduciendo sobre elfos y faes entre polvorones?', NULL, NULL, NULL);
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(50, 'El diario de Phoebe', 'Phoebe Wahl', 15, 'Juvenil', '2024', 'Â¿QuÃ© pasarÃ­a si tu yo adolescente volcara sus sentimientos en un diario? Lo mÃ¡s probable es que sus palabras se parecieran mucho a las de Phoebe. Vuelve a tu juventud con este libro lleno de humor y romance.', NULL, NULL, 'https://www.editorialhidra.com/libro/el-diario-de-phoebe_150312/');
INSERT INTO `translation` (`id`, `title`, `author`, `publisher`, `genre`, `year`, `history`, `img_cover`, `img_end`, `link`) VALUES
(51, 'FÃ¡bulas de Esopo', 'Esopo', 4, 'ClÃ¡sico', '2024', 'Las ediciones de Edimat son tan bonitas que da gusto contar con uno de sus libros en la biblioteca. Estas fÃ¡bulas no son la excepciÃ³n. AdemÃ¡s, en mi caso, tuve la suerte de llevÃ¡rmelas a casa directamente desde la caseta de la editorial en la Feria del Libro de Madrid.', NULL, NULL, 'https://www.qproquo.com/es/libro/fabulas-ilustradas-de-esopo_M770670051');

--
-- Ãndices para tablas volcadas
--

--
-- Indices de la tabla `translation`
--
ALTER TABLE `translation`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `Id` (`id`) USING BTREE,
  ADD KEY `publisher` (`publisher`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `translation`
--
ALTER TABLE `translation`
  MODIFY `id` int(12) NOT NULL AUTO_INCREMENT COMMENT 'Id traduccion', AUTO_INCREMENT=52;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
