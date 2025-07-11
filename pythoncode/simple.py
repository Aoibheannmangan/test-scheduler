from datetime import datetime, date, timedelta
import pandas as pd

today = date.today()

visitnum = input("Enter todays visit number:")

if visitnum == "1":
    next_visit_min = today + timedelta(weeks=15)
    next_visit_max = today + timedelta(weeks=18)

elif visitnum == "2":
    next_visit_min = today + timedelta(weeks= 21)
    next_visit_max = today + timedelta(weeks= 34)
    
    
elif visitnum == "3":
    next_visit_min = today + timedelta(weeks=20)
    next_visit_max = today + timedelta(weeks=30)

elif visitnum == "4":
    next_visit_min = today + timedelta(weeks=17)
    next_visit_max = today + timedelta(weeks=26)

elif visitnum == "5":
    next_visit_min = today + timedelta(weeks=17)
    next_visit_max = today + timedelta(weeks=26)
else:
    print("Invalid visit number. Please enter a number between 1 and 5.")
    next_visit_min = None
    next_visit_max = None

print(f"Next visit should be between {next_visit_min} and {next_visit_max}")
