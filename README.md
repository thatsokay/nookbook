# Animal Crossing Fish Viewer

Displays the fish in Animal Crossing: New Horizons and allows for filtering and
sorting by active time, location, price, and size.

https://thatsokay.gitlab.io/animal-crossing

## Install and run

### Install dependencies

```bash
# Python dependencies
virtualenv venv
. venv/bin/activate
pip install scrapy

# Node dependencies
npm install
```

### Run scraper

```bash
cd scraper
scrapy crawl fish
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
