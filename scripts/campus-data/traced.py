"""Building roofs hand-traced from z19 satellite imagery.

Coordinates are pixels in the mosaic described by MOSAIC (z19 tiles, 0.266 m/px).
Each part: (landmark id or None, display name, style, floors, outer ring, holes).
"""
import math

MOSAIC = {'z': 19, 'x0': 372708, 'y0': 221382, 'w': 3328, 'h': 3840}


def rect(x0, y0, x1, y1):
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]


def circle(cx, cy, r, n=48, a0=0.0, a1=360.0):
    return [
        (
            cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
            cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n)),
        )
        for i in range(n)
    ]


def sector(cx, cy, r0, r1, a0, a1, n=44):
    outer = [
        (
            cx + r1 * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
            cy + r1 * math.sin(math.radians(a0 + (a1 - a0) * i / n)),
        )
        for i in range(n + 1)
    ]
    inner = [
        (
            cx + r0 * math.cos(math.radians(a1 - (a1 - a0) * i / n)),
            cy + r0 * math.sin(math.radians(a1 - (a1 - a0) * i / n)),
        )
        for i in range(n + 1)
    ]
    return outer + inner


PLAZA = {'cx': 1951, 'cy': 672, 'r0': 134, 'r1': 148, 'a0': -37, 'a1': 117}

PARTS = [
    # Academic Blocks: the complex wrapped around the plaza.
    ('academic', 'Academic Blocks', 'academic', 3, [
        (2059, 594), (2086, 555), (2127, 555), (2127, 577), (2102, 577),
        (2102, 619), (2134, 619), (2134, 698), (2142, 732), (2121, 750),
        (2119, 828), (2100, 812), (2058, 768), (2083, 727), (2093, 690),
        (2094, 640), (2082, 612),
    ], []),
    ('academic', 'Academic Blocks', 'academic', 3, [
        (2180, 458), (2237, 458), (2237, 485), (2204, 485), (2204, 525),
        (2244, 525), (2244, 550), (2180, 550),
    ], []),
    ('academic', 'Academic Blocks', 'academic', 3, rect(2135, 507, 2180, 548), []),
    ('academic', 'Academic Blocks', 'academic', 3, rect(2133, 548, 2158, 627), []),
    ('academic', 'Academic Blocks', 'academic', 3, [
        (2165, 615), (2207, 615), (2207, 586), (2275, 586), (2275, 606),
        (2305, 606), (2305, 623), (2286, 632), (2165, 632),
    ], []),
    ('academic', 'Academic Blocks', 'academic', 3, rect(2163, 632, 2205, 732), []),
    ('academic', 'Academic Blocks', 'academic', 3, [
        (2273, 645), (2336, 650), (2336, 662), (2307, 662), (2307, 713),
        (2276, 713),
    ], []),
    ('academic', 'Academic Blocks', 'academic', 3, rect(2205, 707, 2311, 730), []),
    ('academic', 'Academic Blocks', 'academic', 3, rect(2272, 730, 2294, 778), []),
    ('academic', 'Academic Blocks', 'academic', 3, rect(2146, 740, 2240, 832), []),
    ('academic', 'Academic Blocks', 'academic', 2, rect(2184, 832, 2209, 878), []),
    ('academic', 'Academic Blocks', 'academic', 2, rect(2119, 832, 2184, 846), []),
    ('academic', 'Academic Blocks', 'academic', 1, [
        (2113, 828), (2140, 828), (2140, 860), (2126, 860), (2126, 900),
        (2113, 900),
    ], []),
    # Central library: two solar-roofed blocks south-west of the plaza.
    ('library', 'Central Library', 'academic', 3, rect(1815, 790, 1890, 860), []),
    ('library', 'Central Library', 'academic', 3, rect(1732, 830, 1805, 900), []),
    ('library', 'Central Library', 'academic', 2, rect(1805, 842, 1815, 860), []),
    # Terracotta-roofed hall south of the academic complex.
    ('academic', 'Academic Blocks', 'academic', 2, rect(2235, 806, 2310, 902), []),
    ('academic', 'Academic Blocks', 'academic', 1, rect(2209, 828, 2235, 846), []),
    # Academic Blocks continued: the wings south of the main complex.
    ('academic', 'Academic Blocks', 'academic', 3, [
        (2052, 915), (2100, 915), (2100, 1045), (2052, 1045), (2052, 1000),
        (2005, 1000), (2005, 960), (2052, 960),
    ], [rect(2057, 965, 2090, 998)]),
    ('academic', 'Academic Blocks', 'academic', 3, [
        (2100, 895), (2130, 895), (2130, 930), (2188, 930), (2188, 1050),
        (2100, 1050),
    ], []),
    ('academic', 'Academic Blocks', 'academic', 3, rect(2110, 1075, 2135, 1235), []),
    ('academic', 'Academic Blocks', 'academic', 3, rect(2135, 1095, 2192, 1235), []),
    # East of the academic complex.
    ('mme', 'MME block', 'academic', 3, rect(2490, 650, 2590, 800), []),
    ('mme', 'MME block', 'academic', 2, [
        (2365, 655), (2480, 655), (2480, 770), (2430, 770), (2430, 795),
        (2400, 795), (2400, 770), (2365, 770),
    ], []),
    ('incubation', 'Incubation block', 'hostel', 4, rect(2700, 695, 2805, 850), []),
    ('incubation', 'Incubation block', 'hostel', 3, rect(2660, 730, 2700, 850), []),
    (None, None, 'academic', 1, rect(2430, 825, 2460, 850), []),
    # GH Extension: the long white-roofed block, named by the project owner.
    ('girls-west', 'GH Extension', 'hangar', 3, [
        (2900, 775), (3145, 910), (3100, 990), (2855, 850),
    ], []),
    # GH and neighbours.
    ('girls-courtyard', 'GH', 'hostel', 4, rect(1497, 1050, 1795, 1195), [
        rect(1555, 1075, 1605, 1160), rect(1700, 1085, 1765, 1150),
    ]),
    ('directors-house', "Director's House", 'bungalow', 2, rect(1315, 1100, 1385, 1160), []),
    ('guest-house', 'Guest House', 'bungalow', 2, rect(1205, 1345, 1370, 1435), []),
    ('mess-central', 'Mess A', 'academic', 2, [
        (1645, 1325), (1700, 1325), (1700, 1300), (1770, 1300), (1770, 1430),
        (1700, 1430), (1700, 1400), (1645, 1400),
    ], []),
    # Canteen Area: OpenStreetMap places Amul Cafe, Food Barn and Bazingaa on this court.
    ('canteen', 'Canteen Area', 'bungalow', 1, rect(1870, 1280, 1955, 1325), []),
    ('canteen', 'Canteen Area', 'bungalow', 1, rect(1885, 1365, 1905, 1385), []),
    ('canteen', 'Canteen Area', 'bungalow', 1, rect(1870, 1410, 1935, 1440), []),
    # Open-air theatre: the retaining wall fits an arc centred on (1992, 1372), and the
    # paved pad at that focus is the stage. Heights and the backdrop are representative.
    ('oat', 'OAT stage', 'stage', 1, rect(2004, 1345, 2024, 1405), []),
    ('oat', 'OAT stage', 'stage', 4, rect(1998, 1345, 2004, 1405), []),
    ('oat', 'OAT retaining wall', 'stage', 1, sector(1992, 1372, 146, 153, -42, 42), []),
    # Boys' hostels 1 and 2: outer square, inner rotated square of wings.
    ('boys-lower', 'BH1', 'hostel', 4, rect(1547, 1565, 1788, 1862), [
        [(1640, 1640), (1688, 1690), (1640, 1742), (1592, 1690)],
        [(1562, 1608), (1625, 1608), (1562, 1665)],
        [(1682, 1608), (1738, 1608), (1738, 1665)],
        [(1562, 1718), (1562, 1790), (1622, 1790)],
        [(1738, 1718), (1738, 1790), (1680, 1790)],
        rect(1572, 1808, 1640, 1826),
        rect(1668, 1808, 1732, 1826),
    ]),
    ('boys-lower', 'BH1', 'hostel', 5, rect(1640, 1553, 1680, 1570), []),
    ('boys-upper', 'BH2', 'hostel', 4, rect(1900, 1565, 2130, 1818), [
        [(2010, 1650), (2052, 1695), (2010, 1745), (1968, 1695)],
        [(1918, 1608), (1975, 1608), (1918, 1665)],
        [(2045, 1608), (2108, 1608), (2108, 1665)],
        [(1918, 1725), (1918, 1790), (1975, 1790)],
        [(2108, 1725), (2108, 1790), (2045, 1790)],
    ]),
    ('boys-upper', 'BH2', 'hostel', 5, rect(1985, 1550, 2025, 1567), []),
    # BH3: the tall hostel tower by Mess B.
    ('boys-west', 'BH3', 'hostel', 8, rect(2418, 1312, 2615, 1345), []),
    ('boys-west', 'BH3', 'hostel', 8, rect(2410, 1378, 2615, 1420), []),
    ('boys-west', 'BH3', 'hostel', 9, rect(2478, 1345, 2530, 1378), []),
    ('mess-west', 'Mess B', 'academic', 2, rect(2575, 1185, 2650, 1265), []),
    ('wtp', 'Water treatment plant', 'bungalow', 1, rect(2245, 1580, 2310, 1640), []),
    # BH4: two rotated courtyard blocks and a connector.
    ('bh4', 'BH4', 'bh4', 7, [
        (1868, 2655), (1982, 2700), (1945, 2785), (1838, 2735),
    ], [[(1897, 2675), (1947, 2697), (1925, 2744), (1878, 2722)]]),
    ('bh4', 'BH4', 'bh4', 7, [
        (1819, 2775), (1900, 2825), (1869, 2925), (1781, 2875),
    ], [[(1831, 2819), (1878, 2837), (1853, 2891), (1809, 2866)]]),
    ('bh4', 'BH4', 'bh4', 7, [
        (1845, 2733), (1880, 2748), (1860, 2787), (1825, 2772),
    ], []),
    # Faculty housing.
    ('faculty-b', 'Faculty residences, B', 'bungalow', 2, rect(1195, 1700, 1245, 1760), []),
    ('faculty-b', 'Faculty residences, B', 'bungalow', 2, rect(1255, 1700, 1295, 1755), []),
    ('faculty-b', 'Faculty residences, B', 'bungalow', 2, rect(1320, 1685, 1362, 1760), []),
    ('faculty-b', 'Faculty residences, B', 'bungalow', 2, rect(1365, 1690, 1410, 1745), []),
    ('faculty-d', 'Faculty residences, D', 'bungalow', 2, rect(1350, 1990, 1395, 2040), []),
    ('faculty-d', 'Faculty residences, D', 'bungalow', 2, rect(1400, 1990, 1450, 2040), []),
    ('faculty-d', 'Faculty residences, D', 'bungalow', 2, rect(1190, 2090, 1235, 2130), []),
    ('faculty-d', 'Faculty residences, D', 'bungalow', 2, rect(1245, 2090, 1280, 2130), []),
    ('faculty-d', 'Faculty residences, D', 'bungalow', 2, rect(1300, 2090, 1345, 2135), []),
    ('faculty-d', 'Faculty residences, D', 'bungalow', 2, rect(1350, 2090, 1395, 2135), []),
    ('faculty-d', 'Faculty residences, D', 'bungalow', 2, rect(1255, 2200, 1300, 2240), []),
    ('faculty-d', 'Faculty residences, D', 'bungalow', 2, rect(1305, 2200, 1350, 2240), []),
    ('faculty-east', 'Faculty residences, east', 'bungalow', 3, [
        (1700, 2300), (1750, 2320), (1735, 2352), (1686, 2330),
    ], []),
    ('faculty-east', 'Faculty residences, east', 'bungalow', 3, [
        (1680, 2350), (1735, 2370), (1720, 2402), (1668, 2378),
    ], []),
    ('faculty-east', 'Faculty residences, east', 'bungalow', 3, [
        (1770, 2345), (1815, 2360), (1800, 2402), (1758, 2386),
    ], []),
    ('faculty-upper', 'Faculty residences, upper', 'hostel', 6, [
        (1566, 2352), (1648, 2400), (1632, 2435), (1550, 2385),
    ], []),
    ('faculty-upper', 'Faculty residences, upper', 'hostel', 6, [
        (1545, 2420), (1625, 2465), (1608, 2490), (1530, 2445),
    ], []),
    ('faculty-upper', 'Faculty residences, upper', 'hostel', 6, [
        (1590, 2412), (1622, 2430), (1606, 2458), (1574, 2440),
    ], []),
    # Student activity centre and neighbours.
    ('sac', 'Student Activity Centre', 'hangar', 3, rect(1810, 2050, 1885, 2145), []),
    ('sac', 'Student Activity Centre', 'bungalow', 2, rect(1780, 2020, 1905, 2052), []),
    ('medical', 'Medical unit', 'bungalow', 1, rect(1880, 1955, 1935, 2000), []),
    # Inside OpenStreetMap way 1158876420, under the canopy north of the medical unit.
    ('temple', 'Hanuman Temple', 'bungalow', 1, rect(1823, 1913, 1843, 1932), []),
    (None, None, 'bungalow', 1, rect(1780, 1985, 1797, 2005), []),
    # Centre for AI: a large active construction site.
    ('ai', 'Centre for AI', 'construction', 8, [
        (930, 1962), (950, 1940), (1030, 1936), (1040, 1950), (1040, 2000),
        (1044, 2000), (1044, 2470), (1050, 2470), (1050, 2572), (703, 2572),
        (703, 2490), (730, 2462), (922, 2462), (922, 2000),
    ], []),
    ('ai', 'Centre for AI', 'construction', 3, circle(1044, 1783, 72), [circle(1044, 1783, 46)]),
    # Service buildings on the southern edge.
    (None, None, 'bungalow', 2, [(1143, 2650), (1205, 2680), (1150, 2805), (1085, 2765)], []),
    (None, None, 'bungalow', 1, [(1050, 2865), (1095, 2895), (1070, 2935), (1028, 2905)], []),
    (None, None, 'bungalow', 1, [(1270, 2610), (1295, 2620), (1283, 2648), (1260, 2640)], []),
    (None, None, 'bungalow', 1, [(1455, 2925), (1495, 2950), (1475, 2985), (1425, 2960)], []),
    (None, None, 'bungalow', 1, rect(1510, 2945, 1550, 2990), []),
    (None, None, 'bungalow', 2, [(1500, 3050), (1550, 3070), (1470, 3170), (1415, 3135)], []),
]
