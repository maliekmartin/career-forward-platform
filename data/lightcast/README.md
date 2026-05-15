# Lightcast Data Directory

## Folder Structure

```
/data/lightcast/
├── raw/                    # Place Lightcast CSV exports here
│   ├── salary-us.csv
│   ├── salary-wa.csv
│   └── salary-spokane.csv
└── README.md              # This file
```

## Data Files

### Salary Data (6-digit SOC codes)

**Files to place in `/raw/`:**
- `salary-us.csv` - United States salary data
- `salary-wa.csv` - Washington State salary data
- `salary-spokane.csv` - Spokane County salary data

**Expected CSV Columns:**
- SOC Code (6-digit)
- Occupation Title
- Median Salary
- Mean Salary (optional)
- 10th Percentile Salary (optional)
- 25th Percentile Salary (optional)
- 75th Percentile Salary (optional)
- 90th Percentile Salary (optional)
- Employment Count (optional)
- Location Quotient (optional)

## Processing

After placing CSVs in `/raw/`, run:

```bash
npm run import-lightcast
```

This will:
1. Read CSVs from `/raw/`
2. Validate and clean data
3. Generate `/public/data/market-data.json`

## Update Schedule

- **Frequency:** Quarterly
- **Last Updated:** TBD
- **Next Update:** TBD

## Notes

- Lightcast updates their data regularly - recommend quarterly refreshes
- Keep raw CSVs for reference
- Processed JSON in `/public/data/` is what the app uses
