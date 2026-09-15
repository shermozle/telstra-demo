import json, csv, os

SRC = "/Users/simon/.claude/projects/-Users-simon-dev-telstra-demo/21eada57-c6f2-4f98-b1fd-801deedb6bb0/tool-results/mcp-claude_ai_Google_Drive-read_file_content-1789465209102.txt"
OUT = "/Users/simon/dev/telstra-demo/turbodemo"

t = json.load(open(SRC))["fileContent"]
lines = [l for l in t.split("\n") if l.startswith("|")]
rows = []
for l in lines:
    cells = [c.strip().replace("\\", "").replace("[merged]", "").strip()
             for c in l.strip().strip("|").split("|")]
    rows.append(cells)
rows = [r for r in rows if not all(c in ("", ":-:") for c in r)]
header, tmpl = rows[0], rows[1:52]
assert len(tmpl) == 51, len(tmpl)

# Old event name -> new event name. Order is fixed by the template.
EVENTS = {
    "Create Account": "Product List Viewed",
    "Add Integrations": "Product Viewed",
    "Create Opportunity": "Plan Selected",
    "Follow Opportunity": "Add to Cart",
    "View Campaign": "Checkout Started",
    "Add Report": "Checkout Step Completed",
    "Request Premium Subscription": "Add-On Toggled",
    "Renew Subscription": "Order Placed",
    "View Home Page": "View Home Page",
    "Contact Sales": "Login Completed",
    "Request Demo": "Trade-In Started",
    "Sign Up Free Trial": "Address Checked",
    "Complete Free Trial": "Plan Viewed",
    "View Pop-up Window": "Promo Code Applied",
    "Close Pop-up Window": "Points Redemption Toggled",
    "Custom Event 1": "Cart Viewed",
    "Custom Event 2": "Product Filter Applied",
    "Custom Event 3": "Remove from Cart",
    "Receive Account Alert": "Bill Viewed",
    "View Account Alert": "Usage Checked",
    "Page View": "Page View",
    "Daily Ad Metric": "Daily Ad Metrics",
    "Lead Form Completed": "Lead Form Completed",
}

# Row index (1-based, matching the 51 template property rows) ->
# (new property name, new values, new distribution)
PROPS = {
    1:  ("category", "mobiles-on-a-plan; accessories; internet; prepaid", "0.55; 0.2; 0.18; 0.07"),
    2:  ("sort_by", "featured; price-asc; price-desc; newest", "0.55; 0.2; 0.15; 0.1"),
    3:  ("product_category", "mobiles-on-a-plan; accessory; nbn; 5g-home", "0.6; 0.18; 0.15; 0.07"),
    4:  ("product_brand", "Apple; Samsung; Google; Nokia; Telstra", "0.45; 0.3; 0.15; 0.06; 0.04"),
    5:  ("plan_name", "Basic; Essential; Premium", "0.3; 0.45; 0.25"),
    6:  ("plan_type", "mobile; nbn; 5g-home", "0.7; 0.22; 0.08"),
    7:  ("product_category", "mobiles-on-a-plan; accessory; nbn; 5g-home", "0.6; 0.18; 0.15; 0.07"),
    8:  ("plan_name", "Basic; Essential; Premium; n/a", "0.28; 0.4; 0.22; 0.1"),
    9:  ("cart_items_count", "1; 2; 3", "0.68; 0.24; 0.08"),
    10: ("cart_value", "58; 68; 88; 120.04; 145.79", "0.2; 0.3; 0.2; 0.2; 0.1"),
    11: ("step_name", "Your details; Delivery; Payment; Review", "0.34; 0.28; 0.22; 0.16"),
    12: ("step_number", "1; 2; 3; 4", "0.34; 0.28; 0.22; 0.16"),
    13: ("addon_name", "International Calling Pack; International Roaming (from $5/day); Device Security by McAfee", "0.4; 0.25; 0.35"),
    14: ("action", "added; removed", "0.72; 0.28"),
    15: ("addon_price", "0; 10", "0.25; 0.75"),
    16: ("product_category", "mobiles-on-a-plan; accessory", "0.85; 0.15"),
    17: ("items_count", "1; 2; 3", "0.7; 0.23; 0.07"),
    18: ("promo_code", "ONLINE50; PROMO20; none", "0.22; 0.15; 0.63"),
    19: ("points_used", "0; 5000", "0.72; 0.28"),
    20: ("trade_in_credit", "0; 180; 340; 520", "0.62; 0.15; 0.14; 0.09"),
    21: ("N/A", "N/A", "N/A"),
    22: ("N/A", "N/A", "N/A"),
    23: ("device_type", "phone; tablet; watch", "0.78; 0.14; 0.08"),
    24: ("technology_type", "FTTP; HFC; FTTN; 5G", "0.38; 0.22; 0.25; 0.15"),
    25: ("state", "NSW; VIC; QLD; WA; SA", "0.33; 0.26; 0.19; 0.13; 0.09"),
    26: ("result", "available; not available", "0.88; 0.12"),
    27: ("plan_name", "Basic; Standard; Fast; Superfast", "0.18; 0.34; 0.33; 0.15"),
    28: ("plan_type", "nbn; 5g-home; mobile", "0.6; 0.15; 0.25"),
    29: ("plan_price", "80; 90; 110; 140", "0.18; 0.34; 0.33; 0.15"),
    30: ("promo_code", "ONLINE50; PROMO20; INVALID", "0.45; 0.35; 0.2"),
    31: ("action", "applied; removed", "0.68; 0.32"),
    32: ("cart_items_count", "1; 2; 3", "0.68; 0.24; 0.08"),
    33: ("cart_monthly_value", "58; 68; 88; 120.04; 145.79", "0.2; 0.3; 0.2; 0.2; 0.1"),
    34: ("filter_type", "brand; connectivity; price", "0.5; 0.28; 0.22"),
    35: ("filter_value", "Apple; Samsung; Google; 5G; eSIM", "0.35; 0.25; 0.15; 0.15; 0.1"),
    36: ("product_name", "iPhone 17 Pro; Galaxy S26 Ultra; Pixel 10 Pro; AirPods Pro (3rd gen)", "0.4; 0.25; 0.2; 0.15"),
    37: ("reason", "user_removed; replaced_with_other_device", "0.82; 0.18"),
    38: ("bill_period", "August 2026; July 2026; June 2026", "0.5; 0.3; 0.2"),
    39: ("bill_amount", "68; 88; 110; 145.79", "0.3; 0.3; 0.25; 0.15"),
    40: ("service_type", "postpaid-mobile; prepaid-mobile; nbn; 5g-internet", "0.55; 0.15; 0.22; 0.08"),
    41: ("data_used_pct", "25; 50; 75; 90; 100", "0.2; 0.25; 0.25; 0.2; 0.1"),
    # Kept events: property names stay as they are.
    42: ("Page Title", "home page; mobile phones; cart; checkout; my telstra; support", "0.3; 0.25; 0.15; 0.1; 0.12; 0.08"),
    43: ("Page URL", "shermozle.github.io/telstra-demo/; shermozle.github.io/telstra-demo/mobile-phones/mobiles-on-a-plan/; others", "0.5; 0.35; 0.15"),
    44: ("Page Path", "/; /mobile-phones/mobiles-on-a-plan/; /shop/cart/", "0.5; 0.3; 0.2"),
    45: ("ad_group_id", "6320759775352; 6319411029952; 6316479011352; 6313096363952; 6322597376152", "0.25; 0.25; 0.25; 0.125; 0.125"),
    46: ("ad_metrics.clicks", "0; 1; 2; 3; 4", "0.25; 0.23; 0.23; 0.2; 0.09"),
    47: ("ad_metrics.cost", "250; 748.67; 1600; 1234; 633", "0.25; 0.125; 0.125; 0.25; 0.25"),
    48: ("ad_metrics.impressions", "6; 339; 3; 18; 5", "0.2; 0.3; 0.2; 0.1; 0.2"),
    49: ("ad_name", "iPhone 17 Launch; Family Plan Offer; nbn Switch Offer; Trade-In Bonus", "0.3; 0.25; 0.25; 0.2"),
    50: ("campaign_name", "AU - Mobile - iPhone 17 Launch; AU - Internet - nbn Acquisition; AU - Retargeting - Abandoned Cart; AU - Telstra Plus - Upgrade", "0.35; 0.25; 0.25; 0.15"),
    51: ("campaign_name", "AU - Mobile - iPhone 17 Launch; AU - Internet - nbn Acquisition; AU - Retargeting - Abandoned Cart; AU - Telstra Plus - Upgrade", "0.35; 0.25; 0.25; 0.15"),
}

# Row index -> (new user property name, new values, new distribution). Rows 1-16.
USER_PROPS = {
    1:  ("Age", "18; 24; 29; 34; 39; 44; 49; 54; 59; 64; 69; 74", "0.03; 0.09; 0.13; 0.15; 0.14; 0.12; 0.1; 0.08; 0.06; 0.05; 0.03; 0.02"),
    2:  ("Gender", "Male; Female; Unknown", "0.44; 0.46; 0.1"),
    3:  ("account_type", "postpaid; prepaid; business", "0.62; 0.26; 0.12"),
    4:  ("telstra_plus_tier", "Member; Silver; Gold; VIP", "0.4; 0.3; 0.22; 0.08"),
    5:  ("customer_since", "07-03-2019; 01-15-2021; 08-27-2022; 11-09-2023; 06-30-2025", "0.18; 0.22; 0.24; 0.21; 0.15"),
    6:  ("monthly_spend", "45; 68; 95; 140; 210", "0.18; 0.3; 0.26; 0.16; 0.1"),
    7:  ("services_count", "1; 2; 3; 4", "0.42; 0.31; 0.18; 0.09"),
    8:  ("utm_campaign", "iPhone 17 Launch; nbn Acquisition; Abandoned Cart; Telstra Plus Upgrade", "0.35; 0.25; 0.25; 0.15"),
    9:  ("utm_source", "google; facebook; instagram; direct; email", "0.3; 0.2; 0.1; 0.25; 0.15"),
    10: ("utm_medium", "cpc; social; email; organic", "0.35; 0.2; 0.15; 0.3"),
    11: ("utm_term", "iphone 17; samsung galaxy; nbn plans; mobile plans", "0.35; 0.2; 0.25; 0.2"),
    12: ("utm_content", "hero_banner; sidebar; footer; inline", "0.4; 0.25; 0.15; 0.2"),
    13: ("A/B Testing", "Control; Treatment A; Treatment B", "0.5; 0.25; 0.25"),
    14: ("plan_name", "Basic; Essential; Premium", "0.3; 0.45; 0.25"),
    15: ("active_device", "iPhone 17 Pro; iPhone 16; Galaxy S26; Pixel 10; Other", "0.3; 0.22; 0.2; 0.13; 0.15"),
    16: ("telstra_plus_points", "0; 2500; 5000; 12000; 30000", "0.2; 0.27; 0.25; 0.18; 0.1"),
}

# Row index -> (new group property name, new values, new distribution). Rows 1-17.
GROUP_TYPES = {"Org Id": "Telstra Account", "Opportunity Id": "Service Order"}
GROUP_PROPS = {
    1:  ("Account Name", "Telstra Consumer; Telstra Business; Telstra Enterprise; Belong; Boost Mobile", "0.45; 0.25; 0.12; 0.1; 0.08"),
    2:  ("Services on Account", "1; 2-3; 4-5; 6-10; 10+", "0.3; 0.35; 0.2; 0.1; 0.05"),
    3:  ("Account Segment", "Consumer; Small Business; Enterprise; Government; Wholesale", "0.55; 0.22; 0.13; 0.06; 0.04"),
    4:  ("Account Tier", "Member; Silver; Gold; VIP; Platinum", "0.36; 0.27; 0.2; 0.11; 0.06"),
    5:  ("Account Health", "Red; Yellow; Green", "0.07; 0.28; 0.65"),
    6:  ("Account Manager", "Priya N; Jack T; Mei L; Tom R; Sarah K", "0.32; 0.12; 0.29; 0.17; 0.1"),
    7:  ("Annual Contract Value", "$1200; $2400; $4800; $9600; $24000", "0.13; 0.08; 0.41; 0.23; 0.15"),
    8:  ("Account Created Date", "07-03-2020; 01-15-2021; 08-27-2020; 11-09-2022; 06-30-2023", "0.17; 0.1; 0.12; 0.29; 0.32"),
    9:  ("Contract Type", "Month to Month; 12 Month; 24 Month; 36 Month", "0.3; 0.15; 0.45; 0.1"),
    10: ("Service Start Date", "09-12-2020; 03-07-2021; 10-22-2020; 02-16-2023; 10-05-2024", "0.17; 0.34; 0.05; 0.26; 0.18"),
    11: ("Order Name", "Mobile Upgrade; nbn Connection; New Service; Accessory Purchase; Plan Change", "0.09; 0.14; 0.51; 0.2; 0.06"),
    12: ("Order Owner", "Priya N; Jack T; Mei L; Tom R; Sarah K", "0.21; 0.41; 0.04; 0.13; 0.21"),
    13: ("Order Account Name", "Telstra Consumer; Telstra Business; Telstra Enterprise; Belong; Boost Mobile", "0.05; 0.18; 0.34; 0.26; 0.17"),
    14: ("Order Segment", "Consumer; Small Business; Enterprise; Government; Wholesale", "0.51; 0.09; 0.06; 0.14; 0.2"),
    15: ("Order Channel", "Online; Retail Store; Call Centre; Partner; Field Sales", "0.04; 0.41; 0.21; 0.21; 0.13"),
    16: ("Order Stage", "Cart; Checkout; Submitted; Provisioning; Activated", "0.18; 0.26; 0.17; 0.34; 0.05"),
    17: ("Likelihood To Activate", "10%; 25%; 50%; 75%; 100%", "0.06; 0.14; 0.2; 0.51; 0.09"),
}

# The template leaves columns E and G blank on the second and later occurrence
# of a property name, inheriting from the first. TurboDemo does not honour that
# through a CSV import and rejects the file with "Old Event Property Values is
# not defined", so make every occurrence explicit.
first_seen = {}
for r in tmpl:
    name, vals, dist = r[2], r[4].strip(), r[6].strip()
    if name != "N/A" and vals and dist and name not in first_seen:
        first_seen[name] = (vals, dist)

out = [header]
for i, r in enumerate(tmpl, 1):
    row = list(r)
    if row[2] != "N/A" and (not row[4].strip() or not row[6].strip()):
        row[4], row[6] = first_seen[row[2]]
    old_event = row[0]
    row[1] = EVENTS[old_event]
    new_prop, new_vals, new_dist = PROPS[i]
    row[3], row[5], row[7] = new_prop, new_vals, new_dist
    # The two events with no properties need N/A across C-H, not blanks.
    if old_event in ("View Home Page", "Contact Sales"):
        for c in range(2, 8):
            row[c] = "N/A"
    if i in USER_PROPS:
        row[9], row[11], row[13] = USER_PROPS[i]
    if i in GROUP_PROPS:
        row[15] = GROUP_TYPES[row[14]]
        row[17], row[19], row[21] = GROUP_PROPS[i]
    out.append(row)

os.makedirs(OUT, exist_ok=True)
path = os.path.join(OUT, "telstra-demo-taxonomy.csv")
with open(path, "w", newline="") as f:
    csv.writer(f).writerows(out)
# TurboDemo reads a phantom row from a trailing blank line.
with open(path, "rb+") as f:
    f.seek(-2, 2)
    tail = f.read()
    if tail.endswith(b"\r\n"):
        f.seek(-2, 2)
        f.truncate()

patterns = [
    ["Events with higher dropoff and a conversion driver", "Conversion Rate", "Conversion Driver", "Correlation"],
    ["Create Account", "Add Integrations", "64%", "Custom Event 2", "Strong Positive"],
    ["Add Integrations", "Create Opportunity", "41%", "Request Demo", "Medium Positive"],
    ["Follow Opportunity", "View Campaign", "58%", "Custom Event 1", "Strong Positive"],
    ["View Campaign", "Add Report", "44%", "Contact Sales", "Medium Positive"],
    ["Add Report", "Renew Subscription", "37%", "Request Premium Subscription", "Strong Positive"],
    ["Sign Up Free Trial", "Complete Free Trial", "29%", "View Pop-up Window", "Medium Positive"],
]
ppath = os.path.join(OUT, "telstra-demo-data-patterns.csv")
with open(ppath, "w", newline="") as f:
    csv.writer(f).writerows(patterns)
with open(ppath, "rb+") as f:
    f.seek(-2, 2)
    if f.read().endswith(b"\r\n"):
        f.seek(-2, 2)
        f.truncate()

print("wrote", path, "and", ppath)
