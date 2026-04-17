#!/usr/bin/env bash
# Downloads publicly referenced Telstra CDN assets for local demo use.
# Source: https://www.telstra.com.au — device paths match their storefront HTML.
set -euo pipefail
BASE="https://www.telstra.com.au"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/images/telstra"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

mkdir -p "$OUT/devices" "$OUT/accessories" "$OUT/marketing" "$OUT/brand"

fetch() {
  local rel="$1"
  local dest="$2"
  echo "Fetching $rel -> $dest"
  curl -fsL -A "$UA" "$BASE/$rel" -o "$dest"
}

# Brand
fetch "content/dam/tcom/lego/logo/telstra-logo-656x370.png" "$OUT/brand/telstra-logo.png"

# Marketing (mobile + internet hubs — from live page HTML)
fetch "content/dam/tcom/lego/2022/mobile-phones/mobile/content-bundles-family-in-car-656x370-2x.jpg" "$OUT/marketing/mobile-hub-family.jpg"
fetch "content/dam/tcom/lego/2025/internet/headerDesktopShort-internet-banner-v2-692x400-2x.jpg" "$OUT/marketing/internet-hero-desktop.jpg"
fetch "content/dam/tcom/lego/2025/internet/article-ATL-Offer-nbn50-824-464.jpg" "$OUT/marketing/nbn-offer.jpg"

# Phones (landscape-front preferred for catalog cards)
fetch "content/dam/tcom/devices/mobile/mhdwhst-16pm/deserttitanium/landscape-front.png" "$OUT/devices/iphone-17-pro-max.png"
fetch "content/dam/tcom/devices/mobile/mhdwhst-16pr/deserttitanium/landscape-front.png" "$OUT/devices/iphone-17-pro.png"
fetch "content/dam/tcom/devices/mobile/mhdwhst-16pl/ultramarine/landscape-front.png" "$OUT/devices/iphone-17.png"
fetch "content/dam/tcom/devices/mobile/mhdwhst-16pl/teal/front.png" "$OUT/devices/iphone-air.png"

fetch "content/dam/tcom/devices/mobile/mhdwhst-gsu/titaniumsilverblue/landscape-front.png" "$OUT/devices/galaxy-s26-ultra.png"
fetch "content/dam/tcom/devices/mobile/mhdwhst-gas23/cobaltviolet/landscape-front.png" "$OUT/devices/galaxy-s26-plus.png"
fetch "content/dam/tcom/devices/mobile/mhdwhst-gas22/cobaltviolet/landscape-front.png" "$OUT/devices/galaxy-s26.png"

fetch "content/dam/tcom/devices/mobile/mhdwhst-gxp/black/landscape-front.png" "$OUT/devices/pixel-10-pro-xl.png"
fetch "content/dam/tcom/devices/mobile/mhdwhst-gxc7/black/landscape-front.png" "$OUT/devices/pixel-10-pro.png"
fetch "content/dam/tcom/devices/mobile/mhdwhst-gsf/blue/landscape-front.png" "$OUT/devices/pixel-10.png"

fetch "content/dam/tcom/devices/mobile/mhdwhst-e70/lilypad/landscape-front.png" "$OUT/devices/nokia-g42.png"
fetch "content/dam/tcom/devices/mobile/mhdwhst-a21s/black/front.png" "$OUT/devices/telstra-essential-smart-4.png"

# Accessories (headphones category page asset paths)
fetch "content/dam/tcom/devices/general/hardware/earbuds/ghdwerb-ap4anc/white/landscape-front.png" "$OUT/accessories/airpods-pro-3.png"
fetch "content/dam/tcom/devices/general/hardware/earbuds/ghdwerb-gabu1/black/landscape-front.png" "$OUT/accessories/samsung-galaxy-buds3.png"
fetch "content/dam/tcom/devices/general/hardware/earbuds/ghdwerb-gabu/violet/landscape-front.png" "$OUT/accessories/pixel-buds-pro.png"
fetch "content/dam/tcom/devices/general/hardware/earbuds/ghdwerb-clte/white/landscape-front.png" "$OUT/accessories/magsafe-charger.png"
fetch "content/dam/tcom/devices/general/hardware/earbuds/ghdwerb-e4eb/gray/landscape-front.png" "$OUT/accessories/screen-protector-bundle.png"

# Modem case placeholder — small hardware icon from general (mesh/wifi)
fetch "content/dam/tcom/devices/general/hardware/earbuds/ghdwerb-c20t/black/landscape-front.png" "$OUT/accessories/smart-modem-case.png"

echo "Done. Assets in $OUT"
