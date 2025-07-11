from datetime import datetime, date, timedelta
import pandas as pd

today = date.today()

baby_early = int(input("How many weeks early was the baby born?"))

#Aim High dates
today = date.today()
visit2_min = today + timedelta(weeks = (13 + baby_early))
visit2_max = today + timedelta(weeks = (17 + baby_early))
print(f"Visit 2 should be between {visit2_min} and {visit2_max}")

visit3_min = visit2_min + timedelta(weeks = (9 + baby_early))
visit3_max = visit2_max + timedelta(weeks = (30 + baby_early))
print(f"Visit 3 should be between {visit3_min} and {visit3_max}")

visit4_min = visit3_min + timedelta(weeks = (13 + baby_early))
visit4_max = visit3_max + timedelta(weeks = (26 + baby_early))
print(f"Visit 4 should be between {visit4_min} and {visit4_max}")

visit5_min = visit4_min + timedelta(weeks = (17 + baby_early))
visit5_max = visit4_max + timedelta(weeks = (26 + baby_early))
print(f"Visit 5 should be between {visit5_min} and {visit5_max}")

visit6_min = visit5_min + timedelta(weeks = (52 + baby_early))
visit6_max = visit5_max + timedelta(weeks = (61 + baby_early))
print(f"Visit 6 should be between {visit6_min} and {visit6_max}")

