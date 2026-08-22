use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
struct BlizzardCells {
    name: String,
    winrate: Option<f64>,
    pickrate: Option<f64>,
    banrate: Option<f64>,
}

#[derive(Debug, Deserialize)]
struct BlizzardHero {
    role: String,
}

#[derive(Debug, Deserialize)]
struct BlizzardRow {
    id: String,
    cells: BlizzardCells,
    hero: BlizzardHero,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct HeroStats {
    hero_id: String,
    hero_name: String,
    role: String,
    win_rate: Option<f64>,
    pick_rate: Option<f64>,
    ban_rate: Option<f64>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct BlizzardStatsResponse {
    heroes: Vec<HeroStats>,
    rq: u8,
    region: String,
    tier: String,
    role: String,
    map: String,
    updated_at: u64,
}

/* ========================================
   HTML
======================================== */

fn decode_html_entities(
    value: &str,
) -> String {
    value
        .replace("&quot;", "\"")
        .replace("&amp;", "&")
        .replace("&#39;", "'")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
}

fn extract_all_rows(
    html: &str,
) -> Result<Vec<BlizzardRow>, String> {
    let marker = "allrows=\"";

    let start = html
        .find(marker)
        .ok_or(
            "Unable to find Blizzard allrows data.",
        )?
        + marker.len();

    let remaining =
        &html[start..];

    let end = remaining
        .find('"')
        .ok_or(
            "Unable to determine the end of Blizzard data.",
        )?;

    let encoded =
        &remaining[..end];

    let decoded =
        decode_html_entities(
            encoded,
        );

    serde_json::from_str::<Vec<BlizzardRow>>(
        &decoded,
    )
    .map_err(
        |error| {
            format!(
                "Unable to parse Blizzard data: {error}"
            )
        },
    )
}

/* ========================================
   NORMALIZATION
======================================== */

fn normalize_role(
    role: &str,
) -> String {
    match role {
        "TANK" => "Tank".to_string(),

        "DAMAGE" =>
            "Damage".to_string(),

        "SUPPORT" =>
            "Support".to_string(),

        other =>
            other.to_string(),
    }
}

fn blizzard_role_value(
    role: &str,
) -> &str {
    match role {
        "Tank" => "Tank",

        "Damage" =>
            "Damage",

        "Support" =>
            "Support",

        _ =>
            "All",
    }
}

fn blizzard_tier_value(
    tier: &str,
) -> &str {
    match tier {
        "Bronze" =>
            "Bronze",

        "Silver" =>
            "Silver",

        "Gold" =>
            "Gold",

        "Platinum" =>
            "Platinum",

        "Diamond" =>
            "Diamond",

        "Master" =>
            "Master",

        "Grandmaster" =>
            "Grandmaster",

        "Champion" =>
            "Champion",

        _ =>
            "All",
    }
}

/* ========================================
   CONVERSION
======================================== */

fn convert_rows(
    rows: Vec<BlizzardRow>,
) -> Vec<HeroStats> {
    rows
        .into_iter()
        .map(
            |row| HeroStats {
                hero_id:
                    row.id,

                hero_name:
                    row.cells.name,

                role:
                    normalize_role(
                        &row.hero.role,
                    ),

                win_rate:
                    row.cells.winrate,

                pick_rate:
                    row.cells.pickrate,

                ban_rate:
                    row.cells.banrate,
            },
        )
        .collect()
}

/* ========================================
   DATASET SCORE
======================================== */

fn get_ban_score(
    heroes: &[HeroStats],
) -> (usize, f64) {
    let non_zero_bans =
        heroes
            .iter()
            .filter(
                |hero| {
                    hero.ban_rate
                        .unwrap_or(0.0)
                        > 0.0
                },
            )
            .count();

    let total_ban_rate =
        heroes
            .iter()
            .map(
                |hero| {
                    hero.ban_rate
                        .unwrap_or(0.0)
                },
            )
            .sum();

    (
        non_zero_bans,
        total_ban_rate,
    )
}

/* ========================================
   BLIZZARD FETCH
======================================== */

async fn fetch_blizzard_dataset(
    client: &reqwest::Client,

    rq: u8,

    region: &str,

    tier: &str,

    role: &str,

    map: &str,
) -> Result<Vec<HeroStats>, String> {
    let blizzard_tier =
        blizzard_tier_value(
            tier,
        );

    let blizzard_role =
        blizzard_role_value(
            role,
        );

    let url = format!(
        "https://overwatch.blizzard.com/en-us/rates/?input=PC&map={}&region={}&role={}&rq={}&tier={}",
        map,
        region,
        blizzard_role,
        rq,
        blizzard_tier,
    );

    println!(
        "Fetching Blizzard:"
    );

    println!(
        "{}",
        url,
    );

    let response = client
        .get(&url)
        .header(
            "User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) OWtracker/0.1",
        )
        .header(
            "Accept",
            "text/html,application/xhtml+xml",
        )
        .header(
            "Accept-Language",
            "en-US,en;q=0.9",
        )
        .send()
        .await
        .map_err(
            |error| {
                format!(
                    "Unable to contact Blizzard: {error}"
                )
            },
        )?;

    if !response
        .status()
        .is_success()
    {
        return Err(
            format!(
                "Blizzard returned HTTP {}",
                response.status(),
            ),
        );
    }

    let html = response
        .text()
        .await
        .map_err(
            |error| {
                format!(
                    "Unable to read Blizzard response: {error}"
                )
            },
        )?;

    let rows =
        extract_all_rows(
            &html,
        )?;

    let mut heroes =
        convert_rows(
            rows,
        );

    /*
        Blizzard may still return all roles
        in the HTML dataset.

        We filter locally too so OWtracker
        always respects the selected role.
    */

    if role != "All" {
        heroes.retain(
            |hero| {
                hero.role == role
            },
        );
    }

    Ok(
        heroes,
    )
}

/* ========================================
   TAURI COMMAND
======================================== */

#[tauri::command]
async fn refresh_blizzard_stats(
    region: String,

    tier: String,

    role: String,

    map: String,

    rq: Option<u8>,
) -> Result<BlizzardStatsResponse, String> {
    let client =
        reqwest::Client::new();

    let mut datasets: Vec<(
        u8,
        Vec<HeroStats>,
        usize,
        f64,
    )> = Vec::new();

    /*
        We test rq 0 / 1 / 2.

        Then we select the dataset
        containing the most meaningful
        ban-rate information.
    */

    let rq_values: Vec<u8> =
        match rq {
            Some(value)
                if value == 1 ||
                   value == 2 =>
            {
                vec![value]
            }

            _ => vec![
                0_u8,
                1_u8,
                2_u8,
            ],
        };

    for rq in rq_values {
        match fetch_blizzard_dataset(
            &client,
            rq,
            &region,
            &tier,
            &role,
            &map,
        )
        .await
        {
            Ok(heroes) => {
                let (
                    non_zero_bans,
                    ban_score,
                ) =
                    get_ban_score(
                        &heroes,
                    );

                println!(
                    "rq={} -> {} heroes, {} non-zero bans",
                    rq,
                    heroes.len(),
                    non_zero_bans,
                );

                datasets.push((
                    rq,
                    heroes,
                    non_zero_bans,
                    ban_score,
                ));
            }

            Err(error) => {
                eprintln!(
                    "rq={} failed: {}",
                    rq,
                    error,
                );
            }
        }
    }

    if datasets.is_empty() {
        return Err(
            "Unable to retrieve Blizzard statistics."
                .to_string(),
        );
    }

    datasets.sort_by(
        |a, b| {
            b.2
                .cmp(&a.2)
                .then_with(
                    || {
                        b.3
                            .partial_cmp(
                                &a.3,
                            )
                            .unwrap_or(
                                std::cmp::Ordering::Equal,
                            )
                    },
                )
        },
    );

    let (
        selected_rq,
        heroes,
        _,
        _,
    ) =
        datasets.remove(0);

    let updated_at =
        std::time::SystemTime::now()
            .duration_since(
                std::time::UNIX_EPOCH,
            )
            .map_err(
                |error| {
                    error.to_string()
                },
            )?
            .as_secs();

    println!(
        "Selected Blizzard dataset:"
    );

    println!(
        "Region={} Tier={} Role={} rq={} Heroes={}",
        region,
        tier,
        role,
        selected_rq,
        heroes.len(),
    );

    Ok(
        BlizzardStatsResponse {
            heroes,
            rq:
                selected_rq,

            region,

            tier,

            role,

            map,

            updated_at,
        },
    )
}

/* ========================================
   DEFAULT TAURI
======================================== */

#[tauri::command]
fn greet(
    name: &str,
) -> String {
    format!(
        "Hello, {}! You've been greeted from Rust!",
        name,
    )
}

#[cfg_attr(
    mobile,
    tauri::mobile_entry_point,
)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_opener::init(),
        )
        .invoke_handler(
            tauri::generate_handler![
                greet,
                refresh_blizzard_stats,
            ],
        )
        .run(
            tauri::generate_context!(),
        )
        .expect(
            "error while running tauri application",
        );
}