# Labhair art brief

The app ships with simple SVG placeholder characters. To replace them with real art, generate the images below and save them with these exact names. The app picks up any image that exists and keeps the placeholder for any that doesn't. Run `node tools/check-art.mjs` to see what's missing.

## Style (the same for every image)
Bold comic line art: clean, confident black outlines, flat colours with one soft shadow tone, and expressive faces with big readable eyes. The palette leans on slate blue-grey `#1C2B35`, bog green `#2E6A4F` and gorse yellow `#E2AE2F`, with natural skin and hair colours. Friendly and warm, not cutesy (except the animals, which can be cuter).

## Specs
- PNG or WebP with a **transparent background**, 1024×1024, character centred.
- People: **waist-up**, facing about three-quarters towards the viewer, with the same camera distance and framing in every image.
- Animals: full body, sitting or standing, the same framing in every image.
- The same outfit, hair and colours in every expression. Only the face, arms and pose change.
- Save as `art/cast/<id>/<expression>.webp`, ideally under 60 KB each (export at 80% quality).

## Expressions (11 per character)
| file | what it looks like |
|---|---|
| `neutral` | relaxed, mouth closed, hands down |
| `talking` | mouth open mid-word, one hand slightly raised |
| `happy` | warm smile |
| `laughing` | eyes closed, big open laugh |
| `surprised` | eyebrows up, mouth in an "o" |
| `confused` | head tilted, one eyebrow up |
| `thinking` | looking up, finger on chin |
| `shrug` | both palms up, small smile |
| `wave` | one hand waving hello |
| `embarrassed` | sheepish grin, hand behind head, sweat drop |
| `listening` | slight lean in, attentive, soft smile |

## Base prompt (put this first in every request)
> Character expression sheet image, bold comic line art, clean black outlines, flat colours with one soft shadow tone, transparent background, waist-up, three-quarter view, consistent design, single character, no text.

Then add the character line and one expression, for example: "… Gráinne … expression: laughing, eyes closed, big open laugh". Generate the **neutral** image first, then use it as the reference image for the other 10 so the character stays consistent.

## Cast
| id | Who | Look |
|---|---|---|
| `grainne` | Gráinne, 30s, from Gaoth Dobhair (Ulster tutor) | wavy dark-brown shoulder-length hair, green knitted jumper, small silver earrings, freckles |
| `nora` | Nóra, 50s, from Conamara (Connacht tutor) | short grey curly hair, navy fisherman's gansey, reading glasses on a cord |
| `maire` | Máire, 20s, from Corca Dhuibhne (Munster tutor) | long red hair in a plait, yellow rain jacket |
| `ella` | Ella, shopkeeper (Ulster) | blonde bob, gorse-yellow cardigan, name badge |
| `donall` | Dónall, neighbour (Ulster) | 60s, flat cap, white beard, tweed jacket |
| `seoirse` | Seoirse, GAA coach (Ulster) | 40s, tracksuit top in green and gold, whistle, short dark hair |
| `padraig` | Pádraig, fisherman (Connacht) | 50s, weathered face, beanie hat, orange oilskins |
| `brid` | Bríd, café owner (Connacht, Mayo) | 40s, dark bun, apron, warm smile |
| `colm` | Colm, farmer (Munster) | 60s, wellies, wax jacket, grey stubble |
| `danny` | Danny, student (Munster) | 20, curly hair, hoodie, headphones round his neck |
| `fianait` | Fianait, bus driver (Munster, An Rinn) | 30s, short black hair, uniform shirt and tie |
| `puifin` | Puifín the puffin (kids) | round puffin, bright orange beak and feet, tiny sailor scarf |
| `giorria` | Giorria the hare (kids) | brown hare, long ears, big feet, sporty headband |
| `madra-rua` | Madra Rua the fox (kids) | red fox, bushy white-tipped tail, little satchel |
| `broc` | Broc the badger (kids) | black-and-white-striped badger, apron, wooden spoon |
| `spideog` | An Spideog the robin (advisor) | small round robin, red breast, tiny round glasses |

## Backdrops (optional)
Save as `art/scenes/<id>.webp`, 1080×1350 (portrait), the same line-art style, with no people and a clear area at the bottom where characters stand.

`shop` (a village shop in Gaoth Dobhair) · `bus-stop` (a rural bus shelter) · `gaa` (a GAA pitch and clubhouse) · `cafe` (a café in Belfast) · `kitchen` (a farmhouse kitchen) · `beach` (Machaire Rabhartaigh beach)

## Rights
The repo is public, so these images will be public. Use a tool whose terms let you publish what it makes, and note the tool here once you've chosen one.
