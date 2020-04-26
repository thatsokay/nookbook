# Animal Crossing Fish Viewer

Displays the fish in Animal Crossing: New Horizons and allows for filtering and
sorting by active time, location, price, and size.

https://thatsokay.gitlab.io/animal-crossing

## Install and run

### Install dependencies

```bash
npm install
```

### Update data

1. Download [data spreadsheet](https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4/htmlview#)
1. Save the fish sheet as `data/fish.csv`
1. Parse data
    ```bash
    npm run parse-fish
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
