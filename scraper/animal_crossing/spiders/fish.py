from itertools import tee
from time import strftime, strptime
import scrapy


class FishSpider(scrapy.Spider):
    name = "fish"
    start_urls = [
        'https://animalcrossing.fandom.com/wiki/Fish_(New_Horizons)'
    ]

    def parse(self, response):
        table = response.css(
            'div.tabbertab[title="Northern Hemisphere"] table table'
        )
        rows = table.css('tr')
        # headings = rows[0].css('th::text').getall()
        data_rows = rows[1:]
        for data in map(self.parse_data_row, data_rows):
            image_url = data['image_url']
            del data['image_url']
            yield {
                **data,
                'image_urls': [image_url],
            }

    def parse_data_row(self, selector):
        cells = selector.css('td')
        selectors = {
            'link_text': 'a::text',
            'link_href': 'a::attr(href)',
            'text': '::text',
            'small_text': 'small::text',
        }
        cell_selectors = [
            ('name', selectors['link_text']),
            ('image_url', selectors['link_href']),
            ('price', selectors['text']),
            ('location', selectors['text']),
            ('shadow_size', selectors['text']),
            ('time', selectors['small_text']),
        ]
        data = {
            name: cell.css(selector).get().strip()
            for (name, selector), cell in zip(cell_selectors, cells)
        }

        data['price'] = int(data['price'])
        data['shadow_size'] = int(data['shadow_size'])

        # Parse start and end time. Assumes end time is exclusive.
        if data['time'] == 'All day':
            start_time, end_time = 0, 0
        else:
            times = data['time'].split(' - ')
            start_time, end_time = (
                # Convert 12-hour to 24-hour time
                int(strftime('%H', strptime(time, '%I %p')))
                for time in times
            )
        del data['time']

        # Find start and end months. Look for rising or falling edges in
        # `months`. Start and end months are 1-indexed and inclusive on both
        # ends.
        months = [
            month.strip() == '✓'
            for month in cells[6:].css(selectors['text']).getall()
        ]
        start_month, end_month = 1, 12
        for i, (prev, current) in enumerate(zip(months, months[1:])):
            if prev == current:
                continue
            if current:
                # Rising edge. `current` is start month.
                start_month = i + 2 # +1 for 1-indexing, +1 from `prev` to `current` index
                continue
            # Falling edge. `prev` is end month
            end_month = i + 1 # +1 for 1-indexing

        return {
            **data,
            'start_time': start_time,
            'end_time': end_time,
            'start_month': start_month,
            'end_month': end_month,
        }
