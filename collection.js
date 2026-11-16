// The paintings in the game. All images: The Metropolitan Museum of Art, Open Access
// (CC0 / public domain). The id is the Met object id; the image is paintings/<id>.jpg.
'use strict';
var OLD_MASTERS = 0, IMPRESSIONISM = 1, POST_IMPRESSIONISM = 2;

var monet = { name: "Клод Моне", period: IMPRESSIONISM };
var renoir = { name: "Огюст Ренуар", period: IMPRESSIONISM };
var degas = { name: "Эдгар Дега", period: IMPRESSIONISM };
var pissarro = { name: "Камиль Писсарро", period: IMPRESSIONISM };
var vanGogh = { name: "Винсент Ван Гог", period: POST_IMPRESSIONISM };
var cezanne = { name: "Поль Сезанн", period: POST_IMPRESSIONISM };
var gauguin = { name: "Поль Гоген", period: POST_IMPRESSIONISM };
var rembrandt = { name: "Рембрандт", period: OLD_MASTERS };
var vermeer = { name: "Ян Вермеер", period: OLD_MASTERS };
var elGreco = { name: "Эль Греко", period: OLD_MASTERS };
var rubens = { name: "Питер Пауль Рубенс", period: OLD_MASTERS };
var goya = { name: "Франсиско Гойя", period: OLD_MASTERS };

var PAINTINGS = [
  { id: "437133", artist: monet, title: "Сад в Сент-Адрессе", date: "1867" },
  { id: "437127", artist: monet, title: "Мостик над прудом с кувшинками", date: "1899" },
  { id: "437122", artist: monet, title: "Стога. Эффект снега и солнца", date: "1891" },
  { id: "437124", artist: monet, title: "Руанский собор. Портал в солнечном свете", date: "1894" },
  { id: "437135", artist: monet, title: "Лягушатник", date: "1869" },
  { id: "438815", artist: renoir, title: "Мадам Шарпантье с детьми", date: "1878" },
  { id: "459112", artist: renoir, title: "Две девушки за фортепиано", date: "1892" },
  { id: "438014", artist: renoir, title: "Дочери Катюля Мендеса", date: "1888" },
  { id: "437439", artist: renoir, title: "Девушка с ромашками", date: "1889" },
  { id: "437430", artist: renoir, title: "На берегу моря", date: "1883" },
  { id: "438817", artist: degas, title: "Урок танца", date: "1874" },
  { id: "436140", artist: degas, title: "Танцовщицы в розовом и зелёном", date: "около 1890" },
  { id: "436174", artist: degas, title: "Гладильщица", date: "1873" },
  { id: "436121", artist: degas, title: "Женщина у вазы с цветами", date: "1865" },
  { id: "436139", artist: degas, title: "Танцовщицы у станка", date: "1877" },
  { id: "437310", artist: pissarro, title: "Бульвар Монмартр зимним утром", date: "1897" },
  { id: "437312", artist: pissarro, title: "Сад Тюильри зимним днём", date: "1899" },
  { id: "437307", artist: pissarro, title: "Тополя. Эраньи", date: "1895" },
  { id: "438738", artist: pissarro, title: "Стога. Утро. Эраньи", date: "1899" },
  { id: "437301", artist: pissarro, title: "Городской сад в Понтуазе", date: "1874" },
  { id: "436535", artist: vanGogh, title: "Пшеничное поле с кипарисами", date: "1889" },
  { id: "436532", artist: vanGogh, title: "Автопортрет в соломенной шляпе", date: "1887" },
  { id: "436528", artist: vanGogh, title: "Ирисы", date: "1890" },
  { id: "437980", artist: vanGogh, title: "Кипарисы", date: "1889" },
  { id: "436529", artist: vanGogh, title: "Арлезианка", date: "1888–1889" },
  { id: "435868", artist: cezanne, title: "Игроки в карты", date: "1890–1892" },
  { id: "435878", artist: cezanne, title: "Гора Сент-Виктуар", date: "около 1902–1906" },
  { id: "435882", artist: cezanne, title: "Натюрморт с яблоками и горшком примул", date: "около 1890" },
  { id: "435876", artist: cezanne, title: "Мадам Сезанн в красном платье", date: "1888–1890" },
  { id: "435872", artist: cezanne, title: "Марсельский залив. Вид из Эстака", date: "около 1885" },
  { id: "438821", artist: gauguin, title: "Ia Orana Maria (Радуйся, Мария)", date: "1891" },
  { id: "436446", artist: gauguin, title: "Две таитянки", date: "1899" },
  { id: "436451", artist: gauguin, title: "Таитянский пейзаж", date: "1892" },
  { id: "436449", artist: gauguin, title: "Сиеста", date: "около 1892–1894" },
  { id: "437999", artist: gauguin, title: "Натюрморт с чайником и фруктами", date: "1896" },
  { id: "437394", artist: rembrandt, title: "Аристотель с бюстом Гомера", date: "1653" },
  { id: "437397", artist: rembrandt, title: "Автопортрет", date: "1660" },
  { id: "437398", artist: rembrandt, title: "Флора", date: "около 1654" },
  { id: "437395", artist: rembrandt, title: "Знаменосец", date: "1654" },
  { id: "437391", artist: rembrandt, title: "Портрет молодой женщины с веером", date: "1633" },
  { id: "437881", artist: vermeer, title: "Молодая женщина с кувшином", date: "около 1662" },
  { id: "437878", artist: vermeer, title: "Спящая служанка", date: "около 1656–1657" },
  { id: "437880", artist: vermeer, title: "Женщина с лютней", date: "около 1662–1663" },
  { id: "437879", artist: vermeer, title: "Этюд головы молодой женщины", date: "около 1665–1667" },
  { id: "437877", artist: vermeer, title: "Аллегория веры", date: "около 1670–1672" },
  { id: "436575", artist: elGreco, title: "Вид Толедо", date: "около 1598–1599" },
  { id: "436573", artist: elGreco, title: "Кардинал Ниньо де Гевара", date: "около 1600" },
  { id: "436570", artist: elGreco, title: "Поклонение пастухов", date: "около 1605–1610" },
  { id: "436574", artist: elGreco, title: "Портрет старика", date: "около 1595–1600" },
  { id: "459088", artist: elGreco, title: "Святой Иероним", date: "около 1610" },
  { id: "437532", artist: rubens, title: "Рубенс с женой Еленой Фоурмен и сыном", date: "около 1635" },
  { id: "437530", artist: rubens, title: "Портрет мужчины", date: "1597" },
  { id: "437526", artist: rubens, title: "Лес на рассвете с охотой на оленя", date: "около 1635" },
  { id: "437529", artist: rubens, title: "Святое семейство со святой Елизаветой", date: "около 1608–1609" },
  { id: "437531", artist: rubens, title: "Женский портрет", date: "около 1625–1627" },
  { id: "436545", artist: goya, title: "Мальчик в красном (Мануэль Осорио)", date: "1787–1788" },
  { id: "459090", artist: goya, title: "Графиня Альтамира с дочерью", date: "1787–1788" },
  { id: "436541", artist: goya, title: "Себастьян Мартинес", date: "1792" },
  { id: "436544", artist: goya, title: "Архитектор Тибурсио Перес", date: "1820" },
  { id: "436546", artist: goya, title: "Пепито Коста-и-Бонельс", date: "около 1810" },
];
