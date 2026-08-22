import {
  useEffect,
} from "react";

import {
  useI18n,
} from "./i18n";

import type {
  ResolvedLanguage,
} from "./i18n";

type PhraseTranslations =
  Partial<
    Record<
      ResolvedLanguage,
      string
    >
  >;

const PHRASES:
  Record<
    string,
    PhraseTranslations
  > = {
  /* Common */
  "Stats": { fr: "Statistiques", de: "Statistiken", es: "Estadísticas", "pt-BR": "Estatísticas", ko: "통계", ja: "統計", "zh-CN": "统计", ru: "Статистика" },
  "Players": { fr: "Joueurs", de: "Spieler", es: "Jugadores", "pt-BR": "Jogadores", ko: "플레이어", ja: "プレイヤー", "zh-CN": "玩家", ru: "Игроки" },
  "Heroes": { fr: "Héros", de: "Helden", es: "Héroes", "pt-BR": "Heróis", ko: "영웅", ja: "ヒーロー", "zh-CN": "英雄", ru: "Герои" },
  "Counters": { fr: "Contres", de: "Konter", es: "Counters", "pt-BR": "Counters", ko: "카운터", ja: "カウンター", "zh-CN": "克制", ru: "Контрпики" },
  "Perks": { fr: "Atouts", de: "Perks", es: "Ventajas", "pt-BR": "Vantagens", ko: "특전", ja: "パーク", "zh-CN": "特长", ru: "Перки" },
  "Settings": { fr: "Paramètres", de: "Einstellungen", es: "Ajustes", "pt-BR": "Configurações", ko: "설정", ja: "設定", "zh-CN": "设置", ru: "Настройки" },
  "Search": { fr: "Rechercher", de: "Suchen", es: "Buscar", "pt-BR": "Buscar", ko: "검색", ja: "検索", "zh-CN": "搜索", ru: "Поиск" },
  "Apply": { fr: "Appliquer", de: "Anwenden", es: "Aplicar", "pt-BR": "Aplicar", ko: "적용", ja: "適用", "zh-CN": "应用", ru: "Применить" },
  "Applying...": { fr: "Application...", de: "Wird angewendet...", es: "Aplicando...", "pt-BR": "Aplicando...", ko: "적용 중...", ja: "適用中...", "zh-CN": "正在应用...", ru: "Применение..." },
  "Refresh": { fr: "Actualiser", de: "Aktualisieren", es: "Actualizar", "pt-BR": "Atualizar", ko: "새로고침", ja: "更新", "zh-CN": "刷新", ru: "Обновить" },
  "Refresh data": { fr: "Actualiser les données", de: "Daten aktualisieren", es: "Actualizar datos", "pt-BR": "Atualizar dados", ko: "데이터 새로고침", ja: "データを更新", "zh-CN": "刷新数据", ru: "Обновить данные" },
  "Refreshing...": { fr: "Actualisation...", de: "Aktualisierung...", es: "Actualizando...", "pt-BR": "Atualizando...", ko: "새로고침 중...", ja: "更新中...", "zh-CN": "正在刷新...", ru: "Обновление..." },
  "Try again": { fr: "Réessayer", de: "Erneut versuchen", es: "Reintentar", "pt-BR": "Tentar novamente", ko: "다시 시도", ja: "再試行", "zh-CN": "重试", ru: "Повторить" },
  "No data": { fr: "Aucune donnée", de: "Keine Daten", es: "Sin datos", "pt-BR": "Sem dados", ko: "데이터 없음", ja: "データなし", "zh-CN": "无数据", ru: "Нет данных" },
  "All": { fr: "Tous", de: "Alle", es: "Todos", "pt-BR": "Todos", ko: "전체", ja: "すべて", "zh-CN": "全部", ru: "Все" },
  "All ranks": { fr: "Tous les rangs", de: "Alle Ränge", es: "Todos los rangos", "pt-BR": "Todos os ranks", ko: "모든 등급", ja: "すべてのランク", "zh-CN": "所有段位", ru: "Все ранги" },
  "All roles": { fr: "Tous les rôles", de: "Alle Rollen", es: "Todos los roles", "pt-BR": "Todas as funções", ko: "모든 역할", ja: "すべてのロール", "zh-CN": "所有职责", ru: "Все роли" },
  "All modes": { fr: "Tous les modes", de: "Alle Modi", es: "Todos los modos", "pt-BR": "Todos os modos", ko: "모든 모드", ja: "すべてのモード", "zh-CN": "所有模式", ru: "Все режимы" },
  "Region": { fr: "Région", de: "Region", es: "Región", "pt-BR": "Região", ko: "지역", ja: "地域", "zh-CN": "地区", ru: "Регион" },
  "Rank": { fr: "Rang", de: "Rang", es: "Rango", "pt-BR": "Rank", ko: "등급", ja: "ランク", "zh-CN": "段位", ru: "Ранг" },
  "Role": { fr: "Rôle", de: "Rolle", es: "Rol", "pt-BR": "Função", ko: "역할", ja: "ロール", "zh-CN": "职责", ru: "Роль" },
  "Tank": { fr: "Tank", de: "Tank", es: "Tanque", "pt-BR": "Tanque", ko: "돌격", ja: "タンク", "zh-CN": "重装", ru: "Танк" },
  "Damage": { fr: "Dégâts", de: "Schaden", es: "Daño", "pt-BR": "Dano", ko: "공격", ja: "ダメージ", "zh-CN": "输出", ru: "Урон" },
  "Support": { fr: "Soutien", de: "Support", es: "Apoyo", "pt-BR": "Suporte", ko: "지원", ja: "サポート", "zh-CN": "支援", ru: "Поддержка" },
  "Win Rate": { fr: "Taux de victoire", de: "Siegrate", es: "Tasa de victoria", "pt-BR": "Taxa de vitória", ko: "승률", ja: "勝率", "zh-CN": "胜率", ru: "Винрейт" },
  "Win rate": { fr: "Taux de victoire", de: "Siegrate", es: "Tasa de victoria", "pt-BR": "Taxa de vitória", ko: "승률", ja: "勝率", "zh-CN": "胜率", ru: "Винрейт" },
  "Pick Rate": { fr: "Taux de sélection", de: "Pickrate", es: "Tasa de selección", "pt-BR": "Taxa de escolha", ko: "픽률", ja: "ピック率", "zh-CN": "选取率", ru: "Пикрейт" },
  "Pick rate": { fr: "Taux de sélection", de: "Pickrate", es: "Tasa de selección", "pt-BR": "Taxa de escolha", ko: "픽률", ja: "ピック率", "zh-CN": "选取率", ru: "Пикрейт" },
  "Ban Rate": { fr: "Taux de bannissement", de: "Banrate", es: "Tasa de veto", "pt-BR": "Taxa de banimento", ko: "밴률", ja: "BAN率", "zh-CN": "禁用率", ru: "Банрейт" },
  "Ban rate": { fr: "Taux de bannissement", de: "Banrate", es: "Tasa de veto", "pt-BR": "Taxa de banimento", ko: "밴률", ja: "BAN率", "zh-CN": "禁用率", ru: "Банрейт" },
  "Meta Score": { fr: "Score Meta", de: "Meta-Score", es: "Puntuación Meta", "pt-BR": "Pontuação Meta", ko: "메타 점수", ja: "メタスコア", "zh-CN": "Meta 分数", ru: "Мета-оценка" },
  "Meta score": { fr: "Score Meta", de: "Meta-Score", es: "Puntuación Meta", "pt-BR": "Pontuação Meta", ko: "메타 점수", ja: "メタスコア", "zh-CN": "Meta 分数", ru: "Мета-оценка" },
  "Score": { fr: "Score", de: "Punktzahl", es: "Puntuación", "pt-BR": "Pontuação", ko: "점수", ja: "スコア", "zh-CN": "分数", ru: "Оценка" },
  "Tier": { fr: "Tier", de: "Tier", es: "Tier", "pt-BR": "Tier", ko: "티어", ja: "ティア", "zh-CN": "梯队", ru: "Тир" },
  "Updated": { fr: "Mis à jour", de: "Aktualisiert", es: "Actualizado", "pt-BR": "Atualizado", ko: "업데이트됨", ja: "更新済み", "zh-CN": "已更新", ru: "Обновлено" },

  /* SEO intro */
  "OVERWATCH STATS": { fr: "STATISTIQUES OVERWATCH", de: "OVERWATCH-STATISTIKEN", es: "ESTADÍSTICAS DE OVERWATCH", "pt-BR": "ESTATÍSTICAS DE OVERWATCH", ko: "오버워치 통계", ja: "オーバーウォッチ統計", "zh-CN": "守望先锋统计", ru: "СТАТИСТИКА OVERWATCH" },
  "Overwatch hero stats and meta.": { fr: "Statistiques et meta des héros Overwatch.", de: "Overwatch-Heldenstatistiken und Meta.", es: "Estadísticas y meta de héroes de Overwatch.", "pt-BR": "Estatísticas e meta dos heróis de Overwatch.", ko: "오버워치 영웅 통계와 메타.", ja: "オーバーウォッチのヒーロー統計とメタ。", "zh-CN": "守望先锋英雄统计与环境。", ru: "Статистика героев Overwatch и мета." },
  "Compare hero win rates, pick rates and ban rates, then explore OWTracker meta rankings by region, competitive rank and role.": { fr: "Comparez les taux de victoire, de sélection et de bannissement des héros, puis explorez le classement meta OWTracker par région, rang compétitif et rôle.", de: "Vergleiche Sieg-, Pick- und Banraten und erkunde das OWTracker-Meta-Ranking nach Region, Rang und Rolle.", es: "Compara tasas de victoria, selección y veto y explora el ranking meta de OWTracker por región, rango y rol.", "pt-BR": "Compare taxas de vitória, escolha e banimento e explore o ranking meta do OWTracker por região, rank e função.", ko: "영웅 승률, 픽률, 밴률을 비교하고 지역, 경쟁 등급, 역할별 OWTracker 메타 랭킹을 확인하세요.", ja: "ヒーローの勝率・ピック率・BAN率を比較し、地域、ランク、ロール別のOWTrackerメタランキングを確認できます。", "zh-CN": "比较英雄胜率、选取率和禁用率，并按地区、竞技段位和职责查看 OWTracker Meta 排名。", ru: "Сравнивайте винрейт, пикрейт и банрейт героев и изучайте мета-рейтинг OWTracker по региону, рангу и роли." },
  "HERO DATABASE": { fr: "BASE DES HÉROS", de: "HELDENDATENBANK", es: "BASE DE HÉROES", "pt-BR": "BASE DE HERÓIS", ko: "영웅 데이터베이스", ja: "ヒーローデータベース", "zh-CN": "英雄数据库", ru: "БАЗА ГЕРОЕВ" },
  "Explore Overwatch hero performance.": { fr: "Explorez les performances des héros Overwatch.", de: "Erkunde die Leistung der Overwatch-Helden.", es: "Explora el rendimiento de los héroes de Overwatch.", "pt-BR": "Explore o desempenho dos heróis de Overwatch.", ko: "오버워치 영웅 성능을 살펴보세요.", ja: "オーバーウォッチのヒーロー性能を確認。", "zh-CN": "查看守望先锋英雄表现。", ru: "Изучайте показатели героев Overwatch." },
  "Browse every hero and compare meta score, win rate, pick rate, ban rate, role ranking and recommended perks.": { fr: "Parcourez tous les héros et comparez Score Meta, taux de victoire, sélection, bannissement, classement par rôle et atouts recommandés.", de: "Durchsuche alle Helden und vergleiche Meta-Score, Sieg-, Pick- und Banrate, Rollenrang und empfohlene Perks.", es: "Explora todos los héroes y compara puntuación Meta, tasas de victoria, selección y veto, rango por rol y ventajas recomendadas.", "pt-BR": "Veja todos os heróis e compare pontuação Meta, taxas de vitória, escolha e banimento, ranking por função e vantagens recomendadas.", ko: "모든 영웅의 메타 점수, 승률, 픽률, 밴률, 역할 순위와 추천 특전을 비교하세요.", ja: "全ヒーローのメタスコア、勝率、ピック率、BAN率、ロール順位、推奨パークを比較できます。", "zh-CN": "浏览所有英雄并比较 Meta 分数、胜率、选取率、禁用率、职责排名和推荐特长。", ru: "Просматривайте всех героев и сравнивайте мета-оценку, винрейт, пикрейт, банрейт, рейтинг роли и рекомендуемые перки." },
  "PLAYER STATS": { fr: "STATISTIQUES JOUEURS", de: "SPIELERSTATISTIKEN", es: "ESTADÍSTICAS DE JUGADORES", "pt-BR": "ESTATÍSTICAS DE JOGADORES", ko: "플레이어 통계", ja: "プレイヤー統計", "zh-CN": "玩家统计", ru: "СТАТИСТИКА ИГРОКОВ" },
  "Search and compare Overwatch players.": { fr: "Recherchez et comparez des joueurs Overwatch.", de: "Suche und vergleiche Overwatch-Spieler.", es: "Busca y compara jugadores de Overwatch.", "pt-BR": "Pesquise e compare jogadores de Overwatch.", ko: "오버워치 플레이어를 검색하고 비교하세요.", ja: "オーバーウォッチのプレイヤーを検索・比較。", "zh-CN": "搜索并比较守望先锋玩家。", ru: "Ищите и сравнивайте игроков Overwatch." },
  "Review competitive ranks, hero performance and role statistics, then compare player profiles side by side.": { fr: "Consultez les rangs compétitifs, performances des héros et statistiques par rôle, puis comparez les profils côte à côte.", de: "Prüfe Wettbewerbsränge, Heldenleistung und Rollenstatistiken und vergleiche Profile nebeneinander.", es: "Consulta rangos competitivos, rendimiento de héroes y estadísticas por rol, y compara perfiles lado a lado.", "pt-BR": "Veja ranks competitivos, desempenho de heróis e estatísticas por função e compare perfis lado a lado.", ko: "경쟁 등급, 영웅 성능, 역할 통계를 확인하고 플레이어 프로필을 나란히 비교하세요.", ja: "ランク、ヒーロー性能、ロール統計を確認し、プレイヤープロフィールを並べて比較できます。", "zh-CN": "查看竞技段位、英雄表现和职责统计，并并排比较玩家资料。", ru: "Просматривайте соревновательные ранги, показатели героев и статистику ролей, затем сравнивайте профили игроков." },
  "HERO PERKS": { fr: "ATOUTS DES HÉROS", de: "HELDEN-PERKS", es: "VENTAJAS DE HÉROES", "pt-BR": "VANTAGENS DOS HERÓIS", ko: "영웅 특전", ja: "ヒーローパーク", "zh-CN": "英雄特长", ru: "ПЕРКИ ГЕРОЕВ" },
  "Overwatch perk popularity and choices.": { fr: "Popularité et choix des atouts Overwatch.", de: "Beliebtheit und Auswahl der Overwatch-Perks.", es: "Popularidad y elecciones de ventajas de Overwatch.", "pt-BR": "Popularidade e escolhas de vantagens no Overwatch.", ko: "오버워치 특전 인기와 선택.", ja: "オーバーウォッチのパーク人気と選択。", "zh-CN": "守望先锋特长热度与选择。", ru: "Популярность и выбор перков Overwatch." },
  "Explore Minor and Major hero perks, community popularity and recommended choices by hero and role.": { fr: "Explorez les atouts mineurs et majeurs, leur popularité communautaire et les choix recommandés par héros et rôle.", de: "Erkunde kleine und große Helden-Perks, Community-Beliebtheit und Empfehlungen nach Held und Rolle.", es: "Explora ventajas menores y mayores, popularidad de la comunidad y opciones recomendadas por héroe y rol.", "pt-BR": "Explore vantagens menores e maiores, popularidade na comunidade e escolhas recomendadas por herói e função.", ko: "영웅별 소형/대형 특전, 커뮤니티 인기와 역할별 추천 선택을 확인하세요.", ja: "小・大パーク、コミュニティ人気、ヒーローとロール別の推奨選択を確認できます。", "zh-CN": "查看英雄小型/大型特长、社区热度以及按英雄和职责推荐的选择。", ru: "Изучайте малые и большие перки, популярность в сообществе и рекомендации по герою и роли." },

  /* Stats */
  "HERO STATISTICS": { fr: "STATISTIQUES DES HÉROS", de: "HELDENSTATISTIKEN", es: "ESTADÍSTICAS DE HÉROES", "pt-BR": "ESTATÍSTICAS DE HERÓIS", ko: "영웅 통계", ja: "ヒーロー統計", "zh-CN": "英雄统计", ru: "СТАТИСТИКА ГЕРОЕВ" },
  "META OVERVIEW": { fr: "APERÇU META", de: "META-ÜBERSICHT", es: "RESUMEN META", "pt-BR": "VISÃO GERAL META", ko: "메타 개요", ja: "メタ概要", "zh-CN": "META 概览", ru: "ОБЗОР МЕТЫ" },
  "Role leaders": { fr: "Leaders par rôle", de: "Rollenführer", es: "Líderes por rol", "pt-BR": "Líderes por função", ko: "역할별 리더", ja: "ロール別トップ", "zh-CN": "职责领先英雄", ru: "Лидеры по ролям" },
  "Best performing heroes in the active Blizzard dataset.": { fr: "Héros les plus performants dans le dataset Blizzard actif.", de: "Beste Helden im aktiven Blizzard-Datensatz.", es: "Héroes con mejor rendimiento en el conjunto de datos activo de Blizzard.", "pt-BR": "Heróis com melhor desempenho no conjunto de dados ativo da Blizzard.", ko: "현재 Blizzard 데이터셋에서 가장 성능이 좋은 영웅.", ja: "現在のBlizzardデータセットで最も好成績のヒーロー。", "zh-CN": "当前 Blizzard 数据集中表现最佳的英雄。", ru: "Лучшие герои в активном наборе данных Blizzard." },
  "Best overall": { fr: "Meilleur global", de: "Bester insgesamt", es: "Mejor general", "pt-BR": "Melhor geral", ko: "전체 1위", ja: "総合トップ", "zh-CN": "综合最佳", ru: "Лучший в целом" },
  "Best Tank": { fr: "Meilleur Tank", de: "Bester Tank", es: "Mejor Tanque", "pt-BR": "Melhor Tanque", ko: "최고 돌격", ja: "トップタンク", "zh-CN": "最佳重装", ru: "Лучший танк" },
  "Best Damage": { fr: "Meilleur Dégâts", de: "Bester Schaden", es: "Mejor Daño", "pt-BR": "Melhor Dano", ko: "최고 공격", ja: "トップダメージ", "zh-CN": "最佳输出", ru: "Лучший урон" },
  "Best Support": { fr: "Meilleur Soutien", de: "Bester Support", es: "Mejor Apoyo", "pt-BR": "Melhor Suporte", ko: "최고 지원", ja: "トップサポート", "zh-CN": "最佳支援", ru: "Лучшая поддержка" },
  "Current meta": { fr: "Meta actuelle", de: "Aktuelle Meta", es: "Meta actual", "pt-BR": "Meta atual", ko: "현재 메타", ja: "現在のメタ", "zh-CN": "当前 Meta", ru: "Текущая мета" },
  "META TIER LIST": { fr: "TIER LIST META", de: "META-TIERLISTE", es: "TIER LIST META", "pt-BR": "TIER LIST META", ko: "메타 티어 리스트", ja: "メタティアリスト", "zh-CN": "META 梯队榜", ru: "МЕТА ТИР-ЛИСТ" },
  "Statistical tier list based on the active Blizzard dataset.": { fr: "Tier list statistique basée sur le dataset Blizzard actif.", de: "Statistische Tierliste basierend auf dem aktiven Blizzard-Datensatz.", es: "Tier list estadística basada en el conjunto de datos activo de Blizzard.", "pt-BR": "Tier list estatística baseada no conjunto de dados ativo da Blizzard.", ko: "현재 Blizzard 데이터셋을 기반으로 한 통계 티어 리스트.", ja: "現在のBlizzardデータセットに基づく統計ティアリスト。", "zh-CN": "基于当前 Blizzard 数据集的统计梯队榜。", ru: "Статистический тир-лист на основе активного набора данных Blizzard." },
  "No heroes": { fr: "Aucun héros", de: "Keine Helden", es: "Sin héroes", "pt-BR": "Sem heróis", ko: "영웅 없음", ja: "ヒーローなし", "zh-CN": "无英雄", ru: "Нет героев" },

  /* Heroes */
  "Current hero roster": { fr: "Roster actuel des héros", de: "Aktueller Heldenkader", es: "Plantilla actual de héroes", "pt-BR": "Elenco atual de heróis", ko: "현재 영웅 명단", ja: "現在のヒーロー一覧", "zh-CN": "当前英雄阵容", ru: "Текущий состав героев" },
  "Heroes tracked": { fr: "Héros suivis", de: "Erfasste Helden", es: "Héroes seguidos", "pt-BR": "Heróis monitorados", ko: "추적 영웅", ja: "追跡ヒーロー", "zh-CN": "已追踪英雄", ru: "Отслеживаемые герои" },
  "Explore heroes and compare their Blizzard statistics.": { fr: "Explorez les héros et comparez leurs statistiques Blizzard.", de: "Erkunde Helden und vergleiche ihre Blizzard-Statistiken.", es: "Explora héroes y compara sus estadísticas de Blizzard.", "pt-BR": "Explore heróis e compare suas estatísticas da Blizzard.", ko: "영웅을 살펴보고 Blizzard 통계를 비교하세요.", ja: "ヒーローを調べてBlizzard統計を比較できます。", "zh-CN": "浏览英雄并比较其 Blizzard 统计数据。", ru: "Изучайте героев и сравнивайте их статистику Blizzard." },
  "Search a hero...": { fr: "Rechercher un héros...", de: "Held suchen...", es: "Buscar un héroe...", "pt-BR": "Buscar herói...", ko: "영웅 검색...", ja: "ヒーローを検索...", "zh-CN": "搜索英雄...", ru: "Найти героя..." },
  "Sort heroes by": { fr: "Trier les héros par", de: "Helden sortieren nach", es: "Ordenar héroes por", "pt-BR": "Ordenar heróis por", ko: "영웅 정렬 기준", ja: "ヒーローの並び順", "zh-CN": "英雄排序方式", ru: "Сортировать героев по" },
  "Clear filters": { fr: "Effacer les filtres", de: "Filter löschen", es: "Limpiar filtros", "pt-BR": "Limpar filtros", ko: "필터 초기화", ja: "フィルターをクリア", "zh-CN": "清除筛选", ru: "Сбросить фильтры" },
  "No hero found": { fr: "Aucun héros trouvé", de: "Kein Held gefunden", es: "No se encontró ningún héroe", "pt-BR": "Nenhum herói encontrado", ko: "영웅을 찾을 수 없음", ja: "ヒーローが見つかりません", "zh-CN": "未找到英雄", ru: "Герой не найден" },
  "No hero matches the current search and role filters.": { fr: "Aucun héros ne correspond à la recherche et aux filtres de rôle actuels.", de: "Kein Held entspricht der aktuellen Suche und den Rollenfiltern.", es: "Ningún héroe coincide con la búsqueda y los filtros de rol actuales.", "pt-BR": "Nenhum herói corresponde à busca e aos filtros de função atuais.", ko: "현재 검색 및 역할 필터와 일치하는 영웅이 없습니다.", ja: "現在の検索とロールフィルターに一致するヒーローはいません。", "zh-CN": "没有英雄符合当前搜索和职责筛选条件。", ru: "Нет героев, соответствующих текущему поиску и фильтрам ролей." },
  "Competitive": { fr: "Compétitif", de: "Wettkampf", es: "Competitivo", "pt-BR": "Competitivo", ko: "경쟁전", ja: "ライバル・プレイ", "zh-CN": "竞技", ru: "Соревновательный" },

  /* Counters */
  "HERO COUNTERS": { fr: "CONTRES DES HÉROS", de: "HELDEN-KONTER", es: "COUNTERS DE HÉROES", "pt-BR": "COUNTERS DE HERÓIS", ko: "영웅 카운터", ja: "ヒーローカウンター", "zh-CN": "英雄克制", ru: "КОНТРПИКИ ГЕРОЕВ" },
  "Live community matchup data sourced from Counterwatch hero pages.": { fr: "Données communautaires de matchup en direct provenant des pages de héros Counterwatch.", de: "Live-Community-Matchup-Daten aus Counterwatch-Heldenseiten.", es: "Datos comunitarios de enfrentamientos en vivo obtenidos de las páginas de Counterwatch.", "pt-BR": "Dados comunitários de matchups ao vivo das páginas de heróis do Counterwatch.", ko: "Counterwatch 영웅 페이지에서 가져온 실시간 커뮤니티 상성 데이터.", ja: "Counterwatchのヒーローページから取得したライブコミュニティ相性データ。", "zh-CN": "来自 Counterwatch 英雄页面的实时社区对局数据。", ru: "Актуальные данные сообщества о матчапах со страниц героев Counterwatch." },
  "Matchup data": { fr: "Données de matchup", de: "Matchup-Daten", es: "Datos de enfrentamientos", "pt-BR": "Dados de matchup", ko: "상성 데이터", ja: "相性データ", "zh-CN": "对局数据", ru: "Данные матчапов" },
  "Counter rating": { fr: "Note de contre", de: "Konterwertung", es: "Valoración de counter", "pt-BR": "Nota de counter", ko: "카운터 점수", ja: "カウンター評価", "zh-CN": "克制评分", ru: "Рейтинг контрпика" },
  "Relative matchup score from duel and teamfight outcomes. Higher is stronger.": { fr: "Score relatif de matchup basé sur les résultats de duels et teamfights. Plus il est élevé, plus le contre est fort.", de: "Relativer Matchup-Score aus Duell- und Teamfight-Ergebnissen. Höher ist stärker.", es: "Puntuación relativa del enfrentamiento según duelos y peleas de equipo. Más alto es mejor.", "pt-BR": "Pontuação relativa de matchup baseada em duelos e lutas de equipe. Quanto maior, mais forte.", ko: "1대1과 팀 전투 결과를 기반으로 한 상대적 상성 점수입니다. 높을수록 강합니다.", ja: "デュエルとチームファイト結果による相対的な相性スコア。高いほど強力です。", "zh-CN": "基于单挑和团战结果的相对克制评分，越高越强。", ru: "Относительная оценка матчапа по дуэлям и командным боям. Чем выше, тем сильнее." },
  "Fight swing": { fr: "Impact en combat", de: "Fight-Swing", es: "Impacto en combate", "pt-BR": "Impacto na luta", ko: "전투 영향", ja: "戦闘影響", "zh-CN": "战斗影响", ru: "Влияние на бой" },
  "Approximate effect versus an otherwise even fight when Counterwatch provides it.": { fr: "Effet approximatif sur un combat autrement équilibré lorsque Counterwatch le fournit.", de: "Ungefährer Effekt in einem sonst ausgeglichenen Kampf, sofern Counterwatch ihn angibt.", es: "Efecto aproximado en una pelea equilibrada cuando Counterwatch lo proporciona.", "pt-BR": "Efeito aproximado em uma luta equilibrada quando o Counterwatch fornece o dado.", ko: "Counterwatch가 제공하는 경우 균형 잡힌 전투에서의 대략적인 영향입니다.", ja: "Counterwatchが提供する場合の、互角の戦闘に対するおおよその影響。", "zh-CN": "Counterwatch 提供时，表示对原本势均力敌战斗的大致影响。", ru: "Примерный эффект в равном бою, когда Counterwatch предоставляет это значение." },
  "Confidence": { fr: "Confiance", de: "Konfidenz", es: "Confianza", "pt-BR": "Confiança", ko: "신뢰도", ja: "信頼度", "zh-CN": "可信度", ru: "Достоверность" },
  "Based on contributing community players. This is not Blizzard data.": { fr: "Basé sur les joueurs contributeurs de la communauté. Ce ne sont pas des données Blizzard.", de: "Basiert auf beitragenden Community-Spielern. Keine Blizzard-Daten.", es: "Basado en jugadores colaboradores de la comunidad. No son datos de Blizzard.", "pt-BR": "Baseado em jogadores contribuintes da comunidade. Não são dados da Blizzard.", ko: "커뮤니티 기여 플레이어를 기반으로 하며 Blizzard 데이터가 아닙니다.", ja: "コミュニティの提供プレイヤーに基づくデータで、Blizzard公式データではありません。", "zh-CN": "基于社区贡献玩家，并非 Blizzard 官方数据。", ru: "Основано на данных игроков сообщества. Это не данные Blizzard." },
  "SELECT HERO": { fr: "SÉLECTIONNER UN HÉROS", de: "HELD AUSWÄHLEN", es: "SELECCIONAR HÉROE", "pt-BR": "SELECIONAR HERÓI", ko: "영웅 선택", ja: "ヒーロー選択", "zh-CN": "选择英雄", ru: "ВЫБРАТЬ ГЕРОЯ" },
  "Hero matchup": { fr: "Matchup du héros", de: "Helden-Matchup", es: "Enfrentamiento del héroe", "pt-BR": "Matchup do herói", ko: "영웅 상성", ja: "ヒーロー相性", "zh-CN": "英雄对局", ru: "Матчап героя" },
  "Search hero...": { fr: "Rechercher un héros...", de: "Held suchen...", es: "Buscar héroe...", "pt-BR": "Buscar herói...", ko: "영웅 검색...", ja: "ヒーローを検索...", "zh-CN": "搜索英雄...", ru: "Найти героя..." },
  "SELECTED HERO": { fr: "HÉROS SÉLECTIONNÉ", de: "AUSGEWÄHLTER HELD", es: "HÉROE SELECCIONADO", "pt-BR": "HERÓI SELECIONADO", ko: "선택한 영웅", ja: "選択中のヒーロー", "zh-CN": "已选英雄", ru: "ВЫБРАННЫЙ ГЕРОЙ" },
  "Open hero": { fr: "Ouvrir le héros", de: "Held öffnen", es: "Abrir héroe", "pt-BR": "Abrir herói", ko: "영웅 열기", ja: "ヒーローを開く", "zh-CN": "打开英雄", ru: "Открыть героя" },
  "Loading Counterwatch data": { fr: "Chargement des données Counterwatch", de: "Counterwatch-Daten werden geladen", es: "Cargando datos de Counterwatch", "pt-BR": "Carregando dados do Counterwatch", ko: "Counterwatch 데이터 로드 중", ja: "Counterwatchデータを読み込み中", "zh-CN": "正在加载 Counterwatch 数据", ru: "Загрузка данных Counterwatch" },
  "Matchup data unavailable": { fr: "Données de matchup indisponibles", de: "Matchup-Daten nicht verfügbar", es: "Datos de enfrentamiento no disponibles", "pt-BR": "Dados de matchup indisponíveis", ko: "상성 데이터 사용 불가", ja: "相性データを利用できません", "zh-CN": "对局数据不可用", ru: "Данные матчапа недоступны" },
  "Countered by": { fr: "Contré par", de: "Gekontert von", es: "Contrarrestado por", "pt-BR": "Counterado por", ko: "카운터 당함", ja: "苦手な相手", "zh-CN": "被克制", ru: "Контрится" },
  "Strong against": { fr: "Fort contre", de: "Stark gegen", es: "Fuerte contra", "pt-BR": "Forte contra", ko: "상대하기 좋음", ja: "有利な相手", "zh-CN": "克制对象", ru: "Силен против" },
  "HARDEST MATCHUPS": { fr: "MATCHUPS LES PLUS DIFFICILES", de: "SCHWIERIGSTE MATCHUPS", es: "ENFRENTAMIENTOS MÁS DIFÍCILES", "pt-BR": "MATCHUPS MAIS DIFÍCEIS", ko: "가장 어려운 상성", ja: "最も厳しい相性", "zh-CN": "最难对局", ru: "САМЫЕ СЛОЖНЫЕ МАТЧАПЫ" },
  "EASIEST MATCHUPS": { fr: "MATCHUPS LES PLUS FAVORABLES", de: "EINFACHSTE MATCHUPS", es: "ENFRENTAMIENTOS MÁS FAVORABLES", "pt-BR": "MATCHUPS MAIS FAVORÁVEIS", ko: "가장 유리한 상성", ja: "最も有利な相性", "zh-CN": "最有利对局", ru: "САМЫЕ ЛЁГКИЕ МАТЧАПЫ" },
  "How to read this page": { fr: "Comment lire cette page", de: "So liest du diese Seite", es: "Cómo leer esta página", "pt-BR": "Como ler esta página", ko: "이 페이지 읽는 법", ja: "このページの見方", "zh-CN": "如何阅读此页面", ru: "Как читать эту страницу" },
  "No matchup entries.": { fr: "Aucune entrée de matchup.", de: "Keine Matchup-Einträge.", es: "No hay enfrentamientos.", "pt-BR": "Nenhuma entrada de matchup.", ko: "상성 항목이 없습니다.", ja: "相性データがありません。", "zh-CN": "没有对局条目。", ru: "Нет данных матчапов." },
  "Very high": { fr: "Très élevée", de: "Sehr hoch", es: "Muy alta", "pt-BR": "Muito alta", ko: "매우 높음", ja: "非常に高い", "zh-CN": "非常高", ru: "Очень высокая" },
  "High": { fr: "Élevée", de: "Hoch", es: "Alta", "pt-BR": "Alta", ko: "높음", ja: "高い", "zh-CN": "高", ru: "Высокая" },
  "Good": { fr: "Bonne", de: "Gut", es: "Buena", "pt-BR": "Boa", ko: "좋음", ja: "良好", "zh-CN": "良好", ru: "Хорошая" },
  "Medium": { fr: "Moyenne", de: "Mittel", es: "Media", "pt-BR": "Média", ko: "보통", ja: "中", "zh-CN": "中", ru: "Средняя" },
  "Low": { fr: "Faible", de: "Niedrig", es: "Baja", "pt-BR": "Baixa", ko: "낮음", ja: "低い", "zh-CN": "低", ru: "Низкая" },

  /* Players */
  "Player lookup": { fr: "Recherche joueur", de: "Spielersuche", es: "Búsqueda de jugador", "pt-BR": "Busca de jogador", ko: "플레이어 조회", ja: "プレイヤー検索", "zh-CN": "玩家查询", ru: "Поиск игрока" },
  "Compare players": { fr: "Comparer les joueurs", de: "Spieler vergleichen", es: "Comparar jugadores", "pt-BR": "Comparar jogadores", ko: "플레이어 비교", ja: "プレイヤー比較", "zh-CN": "比较玩家", ru: "Сравнить игроков" },
  "PLAYER LOOKUP": { fr: "RECHERCHE JOUEUR", de: "SPIELERSUCHE", es: "BÚSQUEDA DE JUGADOR", "pt-BR": "BUSCA DE JOGADOR", ko: "플레이어 조회", ja: "プレイヤー検索", "zh-CN": "玩家查询", ru: "ПОИСК ИГРОКА" },
  "Search for a player": { fr: "Rechercher un joueur", de: "Spieler suchen", es: "Buscar un jugador", "pt-BR": "Buscar um jogador", ko: "플레이어 검색", ja: "プレイヤーを検索", "zh-CN": "搜索玩家", ru: "Найти игрока" },
  "Search an Overwatch player and explore their public career statistics.": { fr: "Recherchez un joueur Overwatch et explorez ses statistiques de carrière publiques.", de: "Suche einen Overwatch-Spieler und sieh dir seine öffentlichen Karrierestatistiken an.", es: "Busca un jugador de Overwatch y explora sus estadísticas públicas de carrera.", "pt-BR": "Busque um jogador de Overwatch e veja suas estatísticas públicas de carreira.", ko: "오버워치 플레이어를 검색하고 공개 커리어 통계를 확인하세요.", ja: "オーバーウォッチのプレイヤーを検索し、公開キャリア統計を確認できます。", "zh-CN": "搜索守望先锋玩家并查看其公开生涯统计。", ru: "Найдите игрока Overwatch и изучите его открытую статистику карьеры." },
  "Find a player": { fr: "Trouver un joueur", de: "Spieler finden", es: "Buscar jugador", "pt-BR": "Encontrar jogador", ko: "플레이어 찾기", ja: "プレイヤーを探す", "zh-CN": "查找玩家", ru: "Найти игрока" },
  "Enter a BattleTag.": { fr: "Saisissez un BattleTag.", de: "BattleTag eingeben.", es: "Introduce un BattleTag.", "pt-BR": "Digite uma BattleTag.", ko: "BattleTag를 입력하세요.", ja: "BattleTagを入力してください。", "zh-CN": "输入 BattleTag。", ru: "Введите BattleTag." },
  "Enter a complete BattleTag.": { fr: "Saisissez un BattleTag complet.", de: "Vollständigen BattleTag eingeben.", es: "Introduce un BattleTag completo.", "pt-BR": "Digite uma BattleTag completa.", ko: "전체 BattleTag를 입력하세요.", ja: "完全なBattleTagを入力してください。", "zh-CN": "输入完整 BattleTag。", ru: "Введите полный BattleTag." },
  "Example: Player#1234": { fr: "Exemple : Player#1234", de: "Beispiel: Player#1234", es: "Ejemplo: Player#1234", "pt-BR": "Exemplo: Player#1234", ko: "예: Player#1234", ja: "例: Player#1234", "zh-CN": "示例：Player#1234", ru: "Пример: Player#1234" },
  "Searching...": { fr: "Recherche...", de: "Suche...", es: "Buscando...", "pt-BR": "Buscando...", ko: "검색 중...", ja: "検索中...", "zh-CN": "正在搜索...", ru: "Поиск..." },
  "Player data": { fr: "Données joueur", de: "Spielerdaten", es: "Datos del jugador", "pt-BR": "Dados do jogador", ko: "플레이어 데이터", ja: "プレイヤーデータ", "zh-CN": "玩家数据", ru: "Данные игрока" },
  "Saved players": { fr: "Joueurs enregistrés", de: "Gespeicherte Spieler", es: "Jugadores guardados", "pt-BR": "Jogadores salvos", ko: "저장된 플레이어", ja: "保存済みプレイヤー", "zh-CN": "已保存玩家", ru: "Сохранённые игроки" },
  "Add to favorites": { fr: "Ajouter aux favoris", de: "Zu Favoriten hinzufügen", es: "Añadir a favoritos", "pt-BR": "Adicionar aos favoritos", ko: "즐겨찾기에 추가", ja: "お気に入りに追加", "zh-CN": "添加到收藏", ru: "Добавить в избранное" },
  "Favorited": { fr: "En favori", de: "Favorisiert", es: "En favoritos", "pt-BR": "Favoritado", ko: "즐겨찾기됨", ja: "お気に入り済み", "zh-CN": "已收藏", ru: "В избранном" },
  "OVERVIEW": { fr: "APERÇU", de: "ÜBERSICHT", es: "RESUMEN", "pt-BR": "VISÃO GERAL", ko: "개요", ja: "概要", "zh-CN": "概览", ru: "ОБЗОР" },
  "CAREER STATS": { fr: "STATISTIQUES DE CARRIÈRE", de: "KARRIERESTATISTIKEN", es: "ESTADÍSTICAS DE CARRERA", "pt-BR": "ESTATÍSTICAS DE CARREIRA", ko: "커리어 통계", ja: "キャリア統計", "zh-CN": "生涯统计", ru: "СТАТИСТИКА КАРЬЕРЫ" },
  "ROLE PERFORMANCE": { fr: "PERFORMANCE PAR RÔLE", de: "ROLLENLEISTUNG", es: "RENDIMIENTO POR ROL", "pt-BR": "DESEMPENHO POR FUNÇÃO", ko: "역할별 성능", ja: "ロール別成績", "zh-CN": "职责表现", ru: "ЭФФЕКТИВНОСТЬ ПО РОЛЯМ" },
  "Performance by role": { fr: "Performance par rôle", de: "Leistung nach Rolle", es: "Rendimiento por rol", "pt-BR": "Desempenho por função", ko: "역할별 성능", ja: "ロール別成績", "zh-CN": "职责表现", ru: "Эффективность по ролям" },
  "HERO PERFORMANCE": { fr: "PERFORMANCE DES HÉROS", de: "HELDENLEISTUNG", es: "RENDIMIENTO DE HÉROES", "pt-BR": "DESEMPENHO DE HERÓIS", ko: "영웅 성능", ja: "ヒーロー成績", "zh-CN": "英雄表现", ru: "ЭФФЕКТИВНОСТЬ ГЕРОЕВ" },
  "Most played heroes": { fr: "Héros les plus joués", de: "Meistgespielte Helden", es: "Héroes más jugados", "pt-BR": "Heróis mais jogados", ko: "가장 많이 플레이한 영웅", ja: "最もプレイしたヒーロー", "zh-CN": "最常使用英雄", ru: "Самые популярные герои" },
  "Games played": { fr: "Parties jouées", de: "Gespielte Spiele", es: "Partidas jugadas", "pt-BR": "Partidas jogadas", ko: "플레이한 게임", ja: "プレイ試合数", "zh-CN": "对局数", ru: "Сыграно матчей" },
  "Games won": { fr: "Parties gagnées", de: "Gewonnene Spiele", es: "Partidas ganadas", "pt-BR": "Partidas vencidas", ko: "승리 게임", ja: "勝利数", "zh-CN": "胜场", ru: "Побед" },
  "Time played": { fr: "Temps joué", de: "Spielzeit", es: "Tiempo jugado", "pt-BR": "Tempo jogado", ko: "플레이 시간", ja: "プレイ時間", "zh-CN": "游戏时间", ru: "Время игры" },
  "Eliminations": { fr: "Éliminations", de: "Eliminierungen", es: "Eliminaciones", "pt-BR": "Eliminações", ko: "처치", ja: "キル", "zh-CN": "消灭", ru: "Устранения" },
  "Deaths": { fr: "Morts", de: "Tode", es: "Muertes", "pt-BR": "Mortes", ko: "죽음", ja: "デス", "zh-CN": "死亡", ru: "Смерти" },
  "Assists": { fr: "Assistances", de: "Assists", es: "Asistencias", "pt-BR": "Assistências", ko: "도움", ja: "アシスト", "zh-CN": "助攻", ru: "Помощь" },
  "Healing": { fr: "Soins", de: "Heilung", es: "Curación", "pt-BR": "Cura", ko: "치유", ja: "回復", "zh-CN": "治疗", ru: "Лечение" },
  "Quick Play": { fr: "Partie rapide", de: "Schnellsuche", es: "Partida rápida", "pt-BR": "Jogo rápido", ko: "빠른 대전", ja: "クイック・プレイ", "zh-CN": "快速游戏", ru: "Быстрая игра" },
  "PC ranks": { fr: "Rangs PC", de: "PC-Ränge", es: "Rangos de PC", "pt-BR": "Ranks de PC", ko: "PC 등급", ja: "PCランク", "zh-CN": "PC 段位", ru: "Ранги PC" },
  "Unranked": { fr: "Non classé", de: "Ohne Rang", es: "Sin rango", "pt-BR": "Sem rank", ko: "배치 전", ja: "ランクなし", "zh-CN": "未定级", ru: "Без ранга" },
  "Unable to load this player.": { fr: "Impossible de charger ce joueur.", de: "Dieser Spieler konnte nicht geladen werden.", es: "No se pudo cargar este jugador.", "pt-BR": "Não foi possível carregar este jogador.", ko: "이 플레이어를 불러올 수 없습니다.", ja: "このプレイヤーを読み込めません。", "zh-CN": "无法加载该玩家。", ru: "Не удалось загрузить игрока." },

  /* Player compare */
  "PLAYER COMPARISON": { fr: "COMPARAISON DE JOUEURS", de: "SPIELERVERGLEICH", es: "COMPARACIÓN DE JUGADORES", "pt-BR": "COMPARAÇÃO DE JOGADORES", ko: "플레이어 비교", ja: "プレイヤー比較", "zh-CN": "玩家比较", ru: "СРАВНЕНИЕ ИГРОКОВ" },
  "Compare two players": { fr: "Comparer deux joueurs", de: "Zwei Spieler vergleichen", es: "Comparar dos jugadores", "pt-BR": "Comparar dois jogadores", ko: "두 플레이어 비교", ja: "2人のプレイヤーを比較", "zh-CN": "比较两名玩家", ru: "Сравнить двух игроков" },
  "Compare two Overwatch players using the same game mode.": { fr: "Comparez deux joueurs Overwatch avec le même mode de jeu.", de: "Vergleiche zwei Overwatch-Spieler im selben Spielmodus.", es: "Compara dos jugadores de Overwatch usando el mismo modo de juego.", "pt-BR": "Compare dois jogadores de Overwatch usando o mesmo modo de jogo.", ko: "같은 게임 모드에서 두 오버워치 플레이어를 비교하세요.", ja: "同じゲームモードで2人のオーバーウォッチプレイヤーを比較します。", "zh-CN": "使用相同游戏模式比较两名守望先锋玩家。", ru: "Сравните двух игроков Overwatch в одном игровом режиме." },
  "Enter both BattleTags.": { fr: "Saisissez les deux BattleTags.", de: "Beide BattleTags eingeben.", es: "Introduce ambos BattleTags.", "pt-BR": "Digite as duas BattleTags.", ko: "두 BattleTag를 입력하세요.", ja: "両方のBattleTagを入力してください。", "zh-CN": "输入两个 BattleTag。", ru: "Введите оба BattleTag." },
  "Compare": { fr: "Comparer", de: "Vergleichen", es: "Comparar", "pt-BR": "Comparar", ko: "비교", ja: "比較", "zh-CN": "比较", ru: "Сравнить" },
  "Comparing...": { fr: "Comparaison...", de: "Vergleich...", es: "Comparando...", "pt-BR": "Comparando...", ko: "비교 중...", ja: "比較中...", "zh-CN": "正在比较...", ru: "Сравнение..." },
  "Career comparison": { fr: "Comparaison de carrière", de: "Karrierevergleich", es: "Comparación de carrera", "pt-BR": "Comparação de carreira", ko: "커리어 비교", ja: "キャリア比較", "zh-CN": "生涯比较", ru: "Сравнение карьеры" },
  "SHARED HEROES": { fr: "HÉROS EN COMMUN", de: "GEMEINSAME HELDEN", es: "HÉROES COMPARTIDOS", "pt-BR": "HERÓIS EM COMUM", ko: "공통 영웅", ja: "共通ヒーロー", "zh-CN": "共同英雄", ru: "ОБЩИЕ ГЕРОИ" },
  "Shared heroes": { fr: "Héros en commun", de: "Gemeinsame Helden", es: "Héroes compartidos", "pt-BR": "Heróis em comum", ko: "공통 영웅", ja: "共通ヒーロー", "zh-CN": "共同英雄", ru: "Общие герои" },
  "Heroes played by both": { fr: "Héros joués par les deux", de: "Von beiden gespielte Helden", es: "Héroes jugados por ambos", "pt-BR": "Heróis jogados por ambos", ko: "둘 다 플레이한 영웅", ja: "両方がプレイしたヒーロー", "zh-CN": "双方都使用的英雄", ru: "Герои, которыми играли оба" },
  "Most played together": { fr: "Les plus joués en commun", de: "Am häufigsten gemeinsam gespielt", es: "Más jugados en común", "pt-BR": "Mais jogados em comum", ko: "가장 많이 겹치는 영웅", ja: "共通プレイ最多", "zh-CN": "共同使用最多", ru: "Чаще всего играли оба" },
  "WIN RATE GAP": { fr: "ÉCART DE TAUX DE VICTOIRE", de: "SIEGRATEN-ABSTAND", es: "DIFERENCIA DE VICTORIAS", "pt-BR": "DIFERENÇA DE TAXA DE VITÓRIA", ko: "승률 차이", ja: "勝率差", "zh-CN": "胜率差", ru: "РАЗНИЦА ВИНРЕЙТА" },
  "Combined time": { fr: "Temps cumulé", de: "Gesamtzeit", es: "Tiempo combinado", "pt-BR": "Tempo combinado", ko: "합산 시간", ja: "合計時間", "zh-CN": "总时间", ru: "Общее время" },
  "Combined playtime": { fr: "Temps de jeu cumulé", de: "Gesamte Spielzeit", es: "Tiempo de juego combinado", "pt-BR": "Tempo de jogo combinado", ko: "합산 플레이 시간", ja: "合計プレイ時間", "zh-CN": "总游戏时间", ru: "Общее игровое время" },
  "No shared hero data available.": { fr: "Aucune donnée de héros en commun disponible.", de: "Keine Daten zu gemeinsamen Helden verfügbar.", es: "No hay datos de héroes compartidos.", "pt-BR": "Sem dados de heróis em comum.", ko: "공통 영웅 데이터가 없습니다.", ja: "共通ヒーローデータがありません。", "zh-CN": "没有共同英雄数据。", ru: "Нет данных об общих героях." },
  "Comparison unavailable": { fr: "Comparaison indisponible", de: "Vergleich nicht verfügbar", es: "Comparación no disponible", "pt-BR": "Comparação indisponível", ko: "비교 불가", ja: "比較できません", "zh-CN": "无法比较", ru: "Сравнение недоступно" },

  /* Perks */
  "COMMUNITY PERKS": { fr: "ATOUTS COMMUNAUTAIRES", de: "COMMUNITY-PERKS", es: "VENTAJAS DE LA COMUNIDAD", "pt-BR": "VANTAGENS DA COMUNIDADE", ko: "커뮤니티 특전", ja: "コミュニティパーク", "zh-CN": "社区特长", ru: "ПЕРКИ СООБЩЕСТВА" },
  "Compare perk popularity across every hero.": { fr: "Comparez la popularité des atouts pour tous les héros.", de: "Vergleiche die Beliebtheit von Perks über alle Helden.", es: "Compara la popularidad de las ventajas entre todos los héroes.", "pt-BR": "Compare a popularidade das vantagens entre todos os heróis.", ko: "모든 영웅의 특전 인기를 비교하세요.", ja: "全ヒーローのパーク人気を比較できます。", "zh-CN": "比较所有英雄的特长热度。", ru: "Сравнивайте популярность перков у всех героев." },
  "Community data": { fr: "Données communautaires", de: "Community-Daten", es: "Datos de la comunidad", "pt-BR": "Dados da comunidade", ko: "커뮤니티 데이터", ja: "コミュニティデータ", "zh-CN": "社区数据", ru: "Данные сообщества" },
  "Search hero or perk...": { fr: "Rechercher un héros ou un atout...", de: "Held oder Perk suchen...", es: "Buscar héroe o ventaja...", "pt-BR": "Buscar herói ou vantagem...", ko: "영웅 또는 특전 검색...", ja: "ヒーローまたはパークを検索...", "zh-CN": "搜索英雄或特长...", ru: "Найти героя или перк..." },
  "Minor": { fr: "Mineur", de: "Klein", es: "Menor", "pt-BR": "Menor", ko: "소형", ja: "小", "zh-CN": "小型", ru: "Малый" },
  "Major": { fr: "Majeur", de: "Groß", es: "Mayor", "pt-BR": "Maior", ko: "대형", ja: "大", "zh-CN": "大型", ru: "Большой" },
  "Most picked": { fr: "Le plus choisi", de: "Am häufigsten gewählt", es: "Más elegido", "pt-BR": "Mais escolhido", ko: "최다 선택", ja: "最多選択", "zh-CN": "最常选择", ru: "Самый популярный" },
  "Community preference": { fr: "Préférence communautaire", de: "Community-Präferenz", es: "Preferencia de la comunidad", "pt-BR": "Preferência da comunidade", ko: "커뮤니티 선호도", ja: "コミュニティ支持率", "zh-CN": "社区偏好", ru: "Предпочтение сообщества" },
  "View hero": { fr: "Voir le héros", de: "Held ansehen", es: "Ver héroe", "pt-BR": "Ver herói", ko: "영웅 보기", ja: "ヒーローを見る", "zh-CN": "查看英雄", ru: "Посмотреть героя" },
  "No hero or perk found.": { fr: "Aucun héros ou atout trouvé.", de: "Kein Held oder Perk gefunden.", es: "No se encontró héroe ni ventaja.", "pt-BR": "Nenhum herói ou vantagem encontrado.", ko: "영웅 또는 특전을 찾을 수 없습니다.", ja: "ヒーローまたはパークが見つかりません。", "zh-CN": "未找到英雄或特长。", ru: "Герой или перк не найден." },

  /* Hero detail */
  "Overview": { fr: "Aperçu", de: "Übersicht", es: "Resumen", "pt-BR": "Visão geral", ko: "개요", ja: "概要", "zh-CN": "概览", ru: "Обзор" },
  "Global performance": { fr: "Performance globale", de: "Globale Leistung", es: "Rendimiento global", "pt-BR": "Desempenho global", ko: "전체 성능", ja: "全体成績", "zh-CN": "整体表现", ru: "Общая эффективность" },
  "META PERFORMANCE": { fr: "PERFORMANCE META", de: "META-LEISTUNG", es: "RENDIMIENTO META", "pt-BR": "DESEMPENHO META", ko: "메타 성능", ja: "メタ成績", "zh-CN": "META 表现", ru: "МЕТА-ЭФФЕКТИВНОСТЬ" },
  "Current position": { fr: "Position actuelle", de: "Aktuelle Position", es: "Posición actual", "pt-BR": "Posição atual", ko: "현재 위치", ja: "現在の順位", "zh-CN": "当前排名", ru: "Текущая позиция" },
  "Overall rank": { fr: "Rang global", de: "Gesamtrang", es: "Rango general", "pt-BR": "Ranking geral", ko: "전체 순위", ja: "総合順位", "zh-CN": "总排名", ru: "Общий ранг" },
  "Role rank": { fr: "Rang du rôle", de: "Rollenrang", es: "Rango del rol", "pt-BR": "Ranking da função", ko: "역할 순위", ja: "ロール順位", "zh-CN": "职责排名", ru: "Ранг роли" },
  "Trend": { fr: "Tendance", de: "Trend", es: "Tendencia", "pt-BR": "Tendência", ko: "추세", ja: "推移", "zh-CN": "趋势", ru: "Тренд" },
  "Collecting data": { fr: "Collecte des données", de: "Daten werden gesammelt", es: "Recopilando datos", "pt-BR": "Coletando dados", ko: "데이터 수집 중", ja: "データ収集中", "zh-CN": "正在收集数据", ru: "Сбор данных" },
  "RECOMMENDED PERKS": { fr: "ATOUTS RECOMMANDÉS", de: "EMPFOHLENE PERKS", es: "VENTAJAS RECOMENDADAS", "pt-BR": "VANTAGENS RECOMENDADAS", ko: "추천 특전", ja: "推奨パーク", "zh-CN": "推荐特长", ru: "РЕКОМЕНДУЕМЫЕ ПЕРКИ" },
  "Community picks": { fr: "Choix de la communauté", de: "Community-Auswahl", es: "Elecciones de la comunidad", "pt-BR": "Escolhas da comunidade", ko: "커뮤니티 선택", ja: "コミュニティの選択", "zh-CN": "社区选择", ru: "Выбор сообщества" },
  "Competitive stats": { fr: "Statistiques compétitives", de: "Wettkampfstatistiken", es: "Estadísticas competitivas", "pt-BR": "Estatísticas competitivas", ko: "경쟁전 통계", ja: "ライバル統計", "zh-CN": "竞技统计", ru: "Соревновательная статистика" },
  "POSITIONING": { fr: "POSITIONNEMENT", de: "POSITIONIERUNG", es: "POSICIONAMIENTO", "pt-BR": "POSICIONAMENTO", ko: "포지셔닝", ja: "ポジショニング", "zh-CN": "定位", ru: "ПОЗИЦИОНИРОВАНИЕ" },
  "Roster comparison": { fr: "Comparaison au roster", de: "Kadervergleich", es: "Comparación con la plantilla", "pt-BR": "Comparação com o elenco", ko: "영웅군 비교", ja: "ロスター比較", "zh-CN": "阵容比较", ru: "Сравнение состава" },
  "Win rate vs roster": { fr: "Taux de victoire vs roster", de: "Siegrate vs. Kader", es: "Tasa de victoria vs plantilla", "pt-BR": "Taxa de vitória vs elenco", ko: "전체 영웅 대비 승률", ja: "ロスター比の勝率", "zh-CN": "相对阵容胜率", ru: "Винрейт против состава" },
  "Meta standing": { fr: "Position meta", de: "Meta-Position", es: "Posición meta", "pt-BR": "Posição meta", ko: "메타 위치", ja: "メタ位置", "zh-CN": "Meta 地位", ru: "Позиция в мете" },
  "Community matchup": { fr: "Matchup communautaire", de: "Community-Matchup", es: "Enfrentamiento comunitario", "pt-BR": "Matchup da comunidade", ko: "커뮤니티 상성", ja: "コミュニティ相性", "zh-CN": "社区对局", ru: "Матчап сообщества" },
  "Community matchup overview": { fr: "Aperçu des matchups communautaires", de: "Übersicht der Community-Matchups", es: "Resumen de enfrentamientos comunitarios", "pt-BR": "Visão geral dos matchups da comunidade", ko: "커뮤니티 상성 개요", ja: "コミュニティ相性概要", "zh-CN": "社区对局概览", ru: "Обзор матчапов сообщества" },
  "Counterwatch tier": { fr: "Tier Counterwatch", de: "Counterwatch-Tier", es: "Tier de Counterwatch", "pt-BR": "Tier do Counterwatch", ko: "Counterwatch 티어", ja: "Counterwatchティア", "zh-CN": "Counterwatch 梯队", ru: "Тир Counterwatch" },
  "Tracked matches": { fr: "Matchs suivis", de: "Erfasste Matches", es: "Partidas registradas", "pt-BR": "Partidas monitoradas", ko: "추적 경기", ja: "追跡試合", "zh-CN": "追踪对局", ru: "Отслеженных матчей" },
  "Counter rating is not matchup win rate.": { fr: "La note de contre n’est pas le taux de victoire du matchup.", de: "Die Konterwertung ist nicht die Matchup-Siegrate.", es: "La valoración de counter no es la tasa de victoria del enfrentamiento.", "pt-BR": "A nota de counter não é a taxa de vitória do matchup.", ko: "카운터 점수는 상성 승률이 아닙니다.", ja: "カウンター評価は相性勝率ではありません。", "zh-CN": "克制评分并不是对局胜率。", ru: "Рейтинг контрпика — это не винрейт матчапа." },
  "No matchup data available": { fr: "Aucune donnée de matchup disponible", de: "Keine Matchup-Daten verfügbar", es: "No hay datos de enfrentamiento", "pt-BR": "Sem dados de matchup", ko: "상성 데이터 없음", ja: "相性データなし", "zh-CN": "无对局数据", ru: "Нет данных матчапа" },
  "No perk data available": { fr: "Aucune donnée d’atout disponible", de: "Keine Perk-Daten verfügbar", es: "No hay datos de ventajas", "pt-BR": "Sem dados de vantagens", ko: "특전 데이터 없음", ja: "パークデータなし", "zh-CN": "无特长数据", ru: "Нет данных перков" },
  "Minor perks": { fr: "Atouts mineurs", de: "Kleine Perks", es: "Ventajas menores", "pt-BR": "Vantagens menores", ko: "소형 특전", ja: "小パーク", "zh-CN": "小型特长", ru: "Малые перки" },
  "Major perks": { fr: "Atouts majeurs", de: "Große Perks", es: "Ventajas mayores", "pt-BR": "Vantagens maiores", ko: "대형 특전", ja: "大パーク", "zh-CN": "大型特长", ru: "Большие перки" },
  "Choose one minor perk": { fr: "Choisissez un atout mineur", de: "Wähle einen kleinen Perk", es: "Elige una ventaja menor", "pt-BR": "Escolha uma vantagem menor", ko: "소형 특전 하나 선택", ja: "小パークを1つ選択", "zh-CN": "选择一个小型特长", ru: "Выберите малый перк" },
  "Choose one major perk": { fr: "Choisissez un atout majeur", de: "Wähle einen großen Perk", es: "Elige una ventaja mayor", "pt-BR": "Escolha uma vantagem maior", ko: "대형 특전 하나 선택", ja: "大パークを1つ選択", "zh-CN": "选择一个大型特长", ru: "Выберите большой перк" },
  "Recommended": { fr: "Recommandé", de: "Empfohlen", es: "Recomendado", "pt-BR": "Recomendado", ko: "추천", ja: "推奨", "zh-CN": "推荐", ru: "Рекомендуется" },
  "PLAYER VS GLOBAL": { fr: "JOUEUR VS GLOBAL", de: "SPIELER VS GLOBAL", es: "JUGADOR VS GLOBAL", "pt-BR": "JOGADOR VS GLOBAL", ko: "플레이어 VS 전체", ja: "プレイヤー VS 全体", "zh-CN": "玩家 VS 全局", ru: "ИГРОК VS ОБЩИЕ ДАННЫЕ" },
  "Above global": { fr: "Au-dessus du global", de: "Über global", es: "Por encima del global", "pt-BR": "Acima do global", ko: "전체 평균 이상", ja: "全体平均以上", "zh-CN": "高于全局", ru: "Выше общего" },
  "Below global": { fr: "Sous le global", de: "Unter global", es: "Por debajo del global", "pt-BR": "Abaixo do global", ko: "전체 평균 이하", ja: "全体平均以下", "zh-CN": "低于全局", ru: "Ниже общего" },

  /* Landing */
  "OVERWATCH DATA COMPANION": { fr: "COMPAGNON DE DONNÉES OVERWATCH", de: "OVERWATCH-DATENBEGLEITER", es: "COMPAÑERO DE DATOS DE OVERWATCH", "pt-BR": "COMPANHEIRO DE DADOS DO OVERWATCH", ko: "오버워치 데이터 컴패니언", ja: "OVERWATCH データコンパニオン", "zh-CN": "守望先锋数据助手", ru: "ПОМОЩНИК ПО ДАННЫМ OVERWATCH" },
  "Understand the": { fr: "Comprenez la", de: "Verstehe die", es: "Entiende el", "pt-BR": "Entenda o", ko: "메타를", ja: "メタを", "zh-CN": "理解", ru: "Пойми" },
  "Explore hero statistics, live Counterwatch matchups, meta rankings, perks and player comparisons in one focused interface.": { fr: "Explorez les statistiques des héros, matchups Counterwatch en direct, classements meta, atouts et comparaisons de joueurs dans une interface unique.", de: "Erkunde Heldenstatistiken, Live-Counterwatch-Matchups, Meta-Rankings, Perks und Spielervergleiche in einer fokussierten Oberfläche.", es: "Explora estadísticas de héroes, enfrentamientos Counterwatch en vivo, rankings meta, ventajas y comparaciones de jugadores en una sola interfaz.", "pt-BR": "Explore estatísticas de heróis, matchups do Counterwatch ao vivo, rankings meta, vantagens e comparações de jogadores em uma interface focada.", ko: "영웅 통계, 실시간 Counterwatch 상성, 메타 랭킹, 특전과 플레이어 비교를 하나의 인터페이스에서 확인하세요.", ja: "ヒーロー統計、Counterwatchのライブ相性、メタランキング、パーク、プレイヤー比較を1つの画面で確認できます。", "zh-CN": "在一个专注的界面中查看英雄统计、Counterwatch 实时对局、Meta 排名、特长和玩家比较。", ru: "Изучайте статистику героев, актуальные матчапы Counterwatch, мета-рейтинги, перки и сравнения игроков в одном интерфейсе." },
  "Open OWTracker": { fr: "Ouvrir OWTracker", de: "OWTracker öffnen", es: "Abrir OWTracker", "pt-BR": "Abrir OWTracker", ko: "OWTracker 열기", ja: "OWTrackerを開く", "zh-CN": "打开 OWTracker", ru: "Открыть OWTracker" },
  "Current leaders": { fr: "Leaders actuels", de: "Aktuelle Spitzenreiter", es: "Líderes actuales", "pt-BR": "Líderes atuais", ko: "현재 상위 영웅", ja: "現在のトップ", "zh-CN": "当前领先", ru: "Текущие лидеры" },
  "Top hero": { fr: "Meilleur héros", de: "Top-Held", es: "Mejor héroe", "pt-BR": "Melhor herói", ko: "최고 영웅", ja: "トップヒーロー", "zh-CN": "顶级英雄", ru: "Лучший герой" },
  "Meta contender": { fr: "Prétendant meta", de: "Meta-Anwärter", es: "Candidato meta", "pt-BR": "Candidato meta", ko: "메타 경쟁자", ja: "メタ候補", "zh-CN": "Meta 竞争者", ru: "Претендент меты" },
  "Strong pick": { fr: "Choix solide", de: "Starker Pick", es: "Elección sólida", "pt-BR": "Escolha forte", ko: "강력한 선택", ja: "強力なピック", "zh-CN": "强势选择", ru: "Сильный выбор" },
  "STATISTICS": { fr: "STATISTIQUES", de: "STATISTIKEN", es: "ESTADÍSTICAS", "pt-BR": "ESTATÍSTICAS", ko: "통계", ja: "統計", "zh-CN": "统计", ru: "СТАТИСТИКА" },
  "Blizzard data": { fr: "Données Blizzard", de: "Blizzard-Daten", es: "Datos de Blizzard", "pt-BR": "Dados da Blizzard", ko: "Blizzard 데이터", ja: "Blizzardデータ", "zh-CN": "Blizzard 数据", ru: "Данные Blizzard" },
  "Win, pick and ban rates with filters for region, rank and role.": { fr: "Taux de victoire, sélection et bannissement avec filtres par région, rang et rôle.", de: "Sieg-, Pick- und Banraten mit Filtern für Region, Rang und Rolle.", es: "Tasas de victoria, selección y veto con filtros por región, rango y rol.", "pt-BR": "Taxas de vitória, escolha e banimento com filtros por região, rank e função.", ko: "지역, 등급, 역할 필터가 있는 승률, 픽률, 밴률.", ja: "地域、ランク、ロールで絞り込める勝率・ピック率・BAN率。", "zh-CN": "可按地区、段位和职责筛选的胜率、选取率和禁用率。", ru: "Винрейт, пикрейт и банрейт с фильтрами по региону, рангу и роли." },
  "Live hero matchups": { fr: "Matchups de héros en direct", de: "Live-Helden-Matchups", es: "Enfrentamientos de héroes en vivo", "pt-BR": "Matchups de heróis ao vivo", ko: "실시간 영웅 상성", ja: "ライブヒーロー相性", "zh-CN": "实时英雄对局", ru: "Актуальные матчапы героев" },
  "Counter rating, fight swing and confidence sourced on demand from Counterwatch.": { fr: "Note de contre, impact en combat et confiance récupérés à la demande depuis Counterwatch.", de: "Konterwertung, Fight-Swing und Konfidenz werden bei Bedarf von Counterwatch geladen.", es: "Valoración de counter, impacto en combate y confianza obtenidos bajo demanda de Counterwatch.", "pt-BR": "Nota de counter, impacto na luta e confiança obtidos sob demanda do Counterwatch.", ko: "Counterwatch에서 요청 시 카운터 점수, 전투 영향과 신뢰도를 가져옵니다.", ja: "Counterwatchからオンデマンドでカウンター評価、戦闘影響、信頼度を取得します。", "zh-CN": "按需从 Counterwatch 获取克制评分、战斗影响和可信度。", ru: "Рейтинг контрпика, влияние на бой и достоверность загружаются по запросу из Counterwatch." },
  "Player comparison": { fr: "Comparaison de joueurs", de: "Spielervergleich", es: "Comparación de jugadores", "pt-BR": "Comparação de jogadores", ko: "플레이어 비교", ja: "プレイヤー比較", "zh-CN": "玩家比较", ru: "Сравнение игроков" },
  "Search profiles, compare ranks and inspect shared hero performance.": { fr: "Recherchez des profils, comparez les rangs et analysez les performances sur les héros en commun.", de: "Suche Profile, vergleiche Ränge und prüfe die Leistung gemeinsamer Helden.", es: "Busca perfiles, compara rangos y revisa el rendimiento de héroes compartidos.", "pt-BR": "Pesquise perfis, compare ranks e analise o desempenho em heróis em comum.", ko: "프로필을 검색하고 등급을 비교하며 공통 영웅 성능을 확인하세요.", ja: "プロフィール検索、ランク比較、共通ヒーローの成績確認ができます。", "zh-CN": "搜索资料、比较段位并查看共同英雄表现。", ru: "Ищите профили, сравнивайте ранги и анализируйте общих героев." },
  "Hero explorer": { fr: "Explorateur de héros", de: "Helden-Explorer", es: "Explorador de héroes", "pt-BR": "Explorador de heróis", ko: "영웅 탐색", ja: "ヒーローエクスプローラー", "zh-CN": "英雄浏览器", ru: "Обзор героев" },
  "BUILT FOR QUICK READING": { fr: "CONÇU POUR UNE LECTURE RAPIDE", de: "FÜR SCHNELLES LESEN", es: "DISEÑADO PARA LECTURA RÁPIDA", "pt-BR": "FEITO PARA LEITURA RÁPIDA", ko: "빠른 확인을 위해 설계", ja: "素早く確認できる設計", "zh-CN": "为快速阅读而设计", ru: "ДЛЯ БЫСТРОГО ПРОСМОТРА" },
  "Data without the clutter.": { fr: "Les données sans le superflu.", de: "Daten ohne Ballast.", es: "Datos sin ruido.", "pt-BR": "Dados sem excesso.", ko: "불필요함 없는 데이터.", ja: "余計なもののないデータ。", "zh-CN": "数据，拒绝杂乱。", ru: "Данные без лишнего." },
  "OWTracker keeps Blizzard statistics, community matchup data and player information in a single responsive interface.": { fr: "OWTracker réunit les statistiques Blizzard, les données communautaires de matchup et les informations joueurs dans une seule interface responsive.", de: "OWTracker bündelt Blizzard-Statistiken, Community-Matchups und Spielerinformationen in einer responsiven Oberfläche.", es: "OWTracker reúne estadísticas de Blizzard, datos comunitarios de enfrentamientos e información de jugadores en una interfaz adaptable.", "pt-BR": "OWTracker reúne estatísticas da Blizzard, dados comunitários de matchups e informações de jogadores em uma única interface responsiva.", ko: "OWTracker는 Blizzard 통계, 커뮤니티 상성 데이터와 플레이어 정보를 하나의 반응형 인터페이스에 모읍니다.", ja: "OWTrackerはBlizzard統計、コミュニティ相性データ、プレイヤー情報を1つのレスポンシブ画面にまとめます。", "zh-CN": "OWTracker 将 Blizzard 统计、社区对局数据和玩家信息整合到一个响应式界面中。", ru: "OWTracker объединяет статистику Blizzard, данные матчапов сообщества и информацию об игроках в одном адаптивном интерфейсе." },

  /* UI states */
  "Loading companion": { fr: "Chargement du compagnon", de: "Begleiter wird geladen", es: "Cargando compañero", "pt-BR": "Carregando companion", ko: "컴패니언 로드 중", ja: "コンパニオンを読み込み中", "zh-CN": "正在加载助手", ru: "Загрузка помощника" },
  "OVERWATCH COMPANION": { fr: "COMPAGNON OVERWATCH", de: "OVERWATCH-BEGLEITER", es: "COMPAÑERO OVERWATCH", "pt-BR": "COMPANHEIRO OVERWATCH", ko: "오버워치 컴패니언", ja: "OVERWATCH コンパニオン", "zh-CN": "守望先锋助手", ru: "ПОМОЩНИК OVERWATCH" },
  "APPLICATION ERROR": { fr: "ERREUR DE L’APPLICATION", de: "ANWENDUNGSFEHLER", es: "ERROR DE APLICACIÓN", "pt-BR": "ERRO DO APLICATIVO", ko: "애플리케이션 오류", ja: "アプリケーションエラー", "zh-CN": "应用错误", ru: "ОШИБКА ПРИЛОЖЕНИЯ" },
  "Something went wrong": { fr: "Une erreur est survenue", de: "Etwas ist schiefgelaufen", es: "Algo salió mal", "pt-BR": "Algo deu errado", ko: "문제가 발생했습니다", ja: "問題が発生しました", "zh-CN": "出现了问题", ru: "Что-то пошло не так" },
  "OWTracker encountered an unexpected interface error.": { fr: "OWTracker a rencontré une erreur d’interface inattendue.", de: "OWTracker hat einen unerwarteten Oberflächenfehler festgestellt.", es: "OWTracker encontró un error inesperado de interfaz.", "pt-BR": "OWTracker encontrou um erro inesperado de interface.", ko: "OWTracker에서 예기치 않은 인터페이스 오류가 발생했습니다.", ja: "OWTrackerで予期しないインターフェースエラーが発生しました。", "zh-CN": "OWTracker 遇到了意外的界面错误。", ru: "OWTracker столкнулся с неожиданной ошибкой интерфейса." },
  "Reload app": { fr: "Recharger l’application", de: "App neu laden", es: "Recargar aplicación", "pt-BR": "Recarregar aplicativo", ko: "앱 새로고침", ja: "アプリを再読み込み", "zh-CN": "重新加载应用", ru: "Перезагрузить приложение" },
};

type TextTranslationState = {
  original: string;
  lastTranslated: string;
};

const textStates =
  new WeakMap<
    Text,
    TextTranslationState
  >();

const attrOriginals =
  new WeakMap<
    Element,
    Map<string, string>
  >();

export function I18nDomBridge() {
  const {
    language,
  } = useI18n();

  useEffect(() => {
    const root =
      document.body;

    translateTree(
      root,
      language,
    );

    const observer =
      new MutationObserver(
        (mutations) => {
          for (
            const mutation of mutations
          ) {
            if (
              mutation.type ===
                "characterData" &&
              mutation.target
                .nodeType ===
                Node.TEXT_NODE
            ) {
              const node =
                mutation.target as Text;

              const state =
                textStates.get(
                  node,
                );

              if (
                state &&
                node.data !==
                  state.lastTranslated
              ) {
                state.original =
                  node.data;
              }

              translateTextNode(
                node,
                language,
              );
            }

            for (
              const added of Array.from(
                mutation.addedNodes,
              )
            ) {
              translateTree(
                added,
                language,
              );
            }
          }
        },
      );

    observer.observe(
      root,
      {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: [
          "placeholder",
          "title",
          "aria-label",
        ],
      },
    );

    return () =>
      observer.disconnect();
  }, [
    language,
  ]);

  return null;
}

function translateTree(
  root: Node,
  language: ResolvedLanguage,
) {
  if (
    root.nodeType ===
    Node.TEXT_NODE
  ) {
    translateTextNode(
      root as Text,
      language,
    );

    return;
  }

  if (
    root.nodeType !==
      Node.ELEMENT_NODE &&
    root.nodeType !==
      Node.DOCUMENT_FRAGMENT_NODE
  ) {
    return;
  }

  const walker =
    document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
    );

  let current =
    walker.nextNode();

  while (current) {
    translateTextNode(
      current as Text,
      language,
    );

    current =
      walker.nextNode();
  }

  if (
    root.nodeType ===
    Node.ELEMENT_NODE
  ) {
    translateElementAttributes(
      root as Element,
      language,
    );
  }

  if (
    "querySelectorAll" in root
  ) {
    (
      root as
        Element | DocumentFragment
    )
      .querySelectorAll(
        "[placeholder],[title],[aria-label]",
      )
      .forEach(
        (element) =>
          translateElementAttributes(
            element,
            language,
          ),
      );
  }
}

function translateTextNode(
  node: Text,
  language: ResolvedLanguage,
) {
  const parent =
    node.parentElement;

  if (
    !parent ||
    parent.closest(
      "script, style, code, pre",
    )
  ) {
    return;
  }

  let state =
    textStates.get(
      node,
    );

  if (!state) {
    state = {
      original:
        node.data,
      lastTranslated:
        node.data,
    };

    textStates.set(
      node,
      state,
    );
  }

  const translated =
    translatePreservingSpace(
      state.original,
      language,
    );

  state.lastTranslated =
    translated;

  if (
    node.data !==
    translated
  ) {
    node.data =
      translated;
  }
}

function translateElementAttributes(
  element: Element,
  language: ResolvedLanguage,
) {
  const names = [
    "placeholder",
    "title",
    "aria-label",
  ];

  let originals =
    attrOriginals.get(
      element,
    );

  if (!originals) {
    originals =
      new Map<
        string,
        string
      >();

    attrOriginals.set(
      element,
      originals,
    );
  }

  for (
    const name of names
  ) {
    const current =
      element.getAttribute(
        name,
      );

    if (
      current === null
    ) {
      continue;
    }

    if (
      !originals.has(
        name,
      )
    ) {
      originals.set(
        name,
        current,
      );
    }

    const original =
      originals.get(
        name,
      ) ?? current;

    const translated =
      translatePhrase(
        original,
        language,
      );

    if (
      current !== translated
    ) {
      element.setAttribute(
        name,
        translated,
      );
    }
  }
}

function translatePreservingSpace(
  value: string,
  language: ResolvedLanguage,
) {
  const start =
    value.match(
      /^\s*/,
    )?.[0] ?? "";

  const end =
    value.match(
      /\s*$/,
    )?.[0] ?? "";

  const core =
    value.trim();

  if (!core) {
    return value;
  }

  return (
    start +
    translatePhrase(
      core,
      language,
    ) +
    end
  );
}

function translatePhrase(
  value: string,
  language: ResolvedLanguage,
) {
  if (
    language === "en"
  ) {
    return value;
  }

  const exact =
    PHRASES[value]?.[
      language
    ];

  if (exact) {
    return exact;
  }

  return translateDynamic(
    value,
    language,
  );
}

function translateDynamic(
  value: string,
  language: ResolvedLanguage,
) {
  const updated =
    value.match(
      /^Updated\s+(.+)$/,
    );

  if (updated) {
    return `${word(
      "Updated",
      language,
    )} ${updated[1]}`;
  }

  const tracked =
    value.match(
      /^([\d,.]+)\s+tracked matches\s+·\s+(.+)$/,
    );

  if (tracked) {
    const label:
      Record<
        ResolvedLanguage,
        string
      > = {
        en: "tracked matches",
        fr: "matchs suivis",
        de: "erfasste Matches",
        es: "partidas registradas",
        "pt-BR": "partidas monitoradas",
        ko: "추적 경기",
        ja: "追跡試合",
        "zh-CN": "追踪对局",
        ru: "отслеженных матчей",
      };

    return `${tracked[1]} ${label[language]} · ${tracked[2]}`;
  }

  const players =
    value.match(
      /^([\d,.]+)\s+players$/,
    );

  if (players) {
    const label:
      Record<
        ResolvedLanguage,
        string
      > = {
        en: "players",
        fr: "joueurs",
        de: "Spieler",
        es: "jugadores",
        "pt-BR": "jogadores",
        ko: "플레이어",
        ja: "プレイヤー",
        "zh-CN": "玩家",
        ru: "игроков",
      };

    return `${players[1]} ${label[language]}`;
  }

  const sourceUpdated =
    value.match(
      /^Source updated\s+(.+)\.$/,
    );

  if (sourceUpdated) {
    const prefix:
      Record<
        ResolvedLanguage,
        string
      > = {
        en: "Source updated",
        fr: "Source mise à jour",
        de: "Quelle aktualisiert",
        es: "Fuente actualizada",
        "pt-BR": "Fonte atualizada",
        ko: "소스 업데이트",
        ja: "ソース更新",
        "zh-CN": "来源更新于",
        ru: "Источник обновлён",
      };

    return `${prefix[language]} ${sourceUpdated[1]}.`;
  }

  return value;
}

function word(
  english: string,
  language: ResolvedLanguage,
) {
  return (
    PHRASES[english]?.[
      language
    ] ??
    english
  );
}

export default I18nDomBridge;
