from itertools import tee
from time import strftime, strptime
from re import sub
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
                'file_urls': [image_url],
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

        # End url after file name
        data['image_url'] = sub(
            r'/revision/latest\?.*$',
            '',
            data['image_url']
        )
        data['price'] = int(data['price'])

        if data['shadow_size'] == 'Narrow':
            shadow = {
                'shadow_size': 4,
                'shadow_comment': '(narrow)',
            }
        else:
            # Handle shadow size '6 (fin)'
            shadow_split = data['shadow_size'].split(maxsplit=1)
            shadow_size = int(shadow_split[0])
            shadow = {
                'shadow_size': shadow_size,
            }
            if (len(shadow_split) > 1):
                shadow['shadow_comments'] = shadow_split[1]

        # Parse start and end time. Assumes end time is exclusive.
        if data['time'] == 'All day':
            times = [{
                'start_time': 0,
                'end_time': 0,
            }]
        elif '&' in data['time']:
            # Handle piranha case
            times = [
                self.parse_time_range(time_range)
                for time_range in data['time'].split(' & ')
            ]
        else:
            times = [self.parse_time_range(data['time'])]
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
            'shadow': shadow,
            'times': times,
            'start_month': start_month,
            'end_month': end_month,
        }

    def parse_time_range(self, time_range):
        start_time, end_time = (
            # Convert 12-hour to 24-hour time
            int(strftime('%H', strptime(time, '%I %p')))
            for time in time_range.split(' - ')
        )
        return {
            'start_time': start_time,
            'end_time': end_time,
        }
