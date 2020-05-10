# NookBook

Displays the fish in Animal Crossing: New Horizons and allows for filtering and
sorting by active time, location, price, and size.

https://nookbook.thatsok.xyz

## Install and run

### Install dependencies

```bash
npm install
```

### Update data

1. Open [data spreadsheet](https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4/htmlview#)
1. Download the fish and bugs sheets as `data/fish.csv` and `data/bugs.csv`
1. Parse data
    ```bash
    npm run parse
    ```

### Start dev server

```bash
npm start
```

### Production build

```bash
npm run build
```

Serve from `./build`
