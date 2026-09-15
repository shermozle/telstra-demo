# TurboDemo dataset for the Telstra demo site

Two files for [TurboDemo](https://analytics.amplitude.com/admin-v2/turbodemo):

- `telstra-demo-taxonomy.csv` — 52 lines, the header plus the template's 51 property rows
- `telstra-demo-data-patterns.csv` — 7 lines, the header plus 6 conversion drivers

They rename the AmpliForce golden-dataset template so its synthetic history uses
the same event and property names this site sends live. 19 of the 20 renameable
slots map to events in [src/](../src); a person clicking through the site and the
generated history land on the same names in the same charts.

## Setting it up

1. In the destination project's tracking plan, create an event property called
   `Products`. In its drawer set Type to `Array` and Item Type to `Any`, then open
   the Splitting tab and click Start Splitting. Splitting only applies to
   net-new data, so do this before generating or before anyone uses the site.
2. Create the TurboDemo config and **enable the object arrays toggle**. Without
   it the generator emits no `Products` array at all.
3. Import `telstra-demo-taxonomy.csv`, then the data patterns file.
4. Set the project name, project ID and API key. The site's default key is in
   [src/lib/amplitude.ts](../src/lib/amplitude.ts).
5. Set the start date about a month back.

## Event mapping

Template slot order drives the funnel drop-off, so the order below is fixed.

| Template slot | Site event | Array |
|---|---|---|
| Create Account | Product List Viewed | |
| Add Integrations | Product Viewed | |
| Create Opportunity | Plan Selected | |
| Follow Opportunity | Add to Cart | yes |
| View Campaign | Checkout Started | yes |
| Add Report | Checkout Step Completed | |
| Request Premium Subscription | Add-On Toggled | |
| Renew Subscription | Order Placed | yes |
| View Home Page | View Home Page (kept) | |
| Contact Sales | Login Completed | |
| Request Demo | Trade-In Started | |
| Sign Up Free Trial | Address Checked | |
| Complete Free Trial | Plan Viewed | |
| View Pop-up Window | Promo Code Applied | |
| Close Pop-up Window | Points Redemption Toggled | |
| Custom Event 1 | Cart Viewed | |
| Custom Event 2 | Product Filter Applied | |
| Custom Event 3 | Remove from Cart | |
| Receive Account Alert | Bill Viewed | |
| View Account Alert | Usage Checked | |
| Page View | Page View (kept) | |
| Daily Ad Metric | Daily Ad Metrics (kept) | |
| Lead Form Completed | Lead Form Completed (kept) | |

TurboDemo attaches its `Products` array to slots 4, 5 and 8 only, and that is
hardcoded. The site also sends the array on `Checkout Step Completed`, which has
no TurboDemo equivalent, so that event will have live data but no history.

## Where synthetic and live data diverge

Worth knowing before anyone builds a chart in front of an audience.

The array contents are hardcoded in TurboDemo's Java source and cannot be
configured. Generated line items carry the AmpliShop catalog (Fossil 25%,
Michael Kors 21%, Nike 18%, Ralph Lauren 15%, Apple 10%, Levi's 6%, Coach 3%,
Adidas 2%) with `categories` and `department` values to match. Live events from
the site carry Telstra devices and plans. Apple is the only brand in both.

TurboDemo spells the discount field `dicount_applied`; the site spells it
`discount_applied` (see [src/lib/products.ts](../src/lib/products.ts)). Those
split into two child properties. The other six line up: `brand`, `categories`,
`department`, `item_id`, `price`, `quantity`.

`$revenue` in a golden dataset is sampled independently of the line items, so
synthetic revenue will not reconcile against synthetic `Products`.

`Add-On Toggled.product_category` is the one generated property the site never
sends. Every other property name in the taxonomy matches a property the site
sends on that same event.

`service_types` is an array on the site's user properties and TurboDemo only
generates single-value strings, so it is not in the taxonomy.

## Regenerating

`gen_turbodemo.py` built these from the AmpliForce template sheet
(`1PgGgC9EZ9LNcddIjAGCPxkOmCcXbetwrUallj7j2PHI`), copying columns A, C, I, K, M,
O, Q, S and U verbatim and filling only the New columns.

Two things the template does that TurboDemo rejects on import, both handled by
the generator:

**Inherited old values.** The sheet fills columns E and G only on a property's
first occurrence and leaves them blank afterwards, since `Product Line` on
Create Account and on View Campaign are the same property. Import that as CSV
and TurboDemo fails with "Old Event Property Values is not defined. Row: 10,
Event Name: View Campaign". The generator forward-fills every occurrence from
the first. 26 rows need it, including Lead Form Completed's `campaign_name`.

**Trailing newline.** Neither file ends in one. A trailing blank line makes
TurboDemo read a phantom row 53 and fail with "Old Event Property Name is not
defined."
