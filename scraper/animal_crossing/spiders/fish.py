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
                'size': 4,
                'comment': '(Narrow)',
            }
        else:
            # Handle shadow size '6 (fin)'
            shadow_split = data['shadow_size'].split(maxsplit=1)
            shadow_size = int(shadow_split[0])
            shadow = {
                'size': shadow_size,
            }
            if (len(shadow_split) > 1):
                shadow['comment'] = shadow_split[1]
        del data['shadow_size']

        # Parse start and end time. Assumes end time is exclusive.
        if data['time'] == 'All day':
            hours = [{'start': 0, 'end': 0,}]
        elif '&' in data['time']:
            # Handle piranha case
            hours = [
                self.parse_time_range(time_range)
                for time_range in data['time'].split(' & ')
            ]
        else:
            hours = [self.parse_time_range(data['time'])]
        del data['time']

        # Find start and end months. Look for rising or falling edges in
        # `months`. Start and end months are 0-indexed, inclusive start and
        # exclusive end.
        months = [
            month.strip() == '✓'
            for month in cells[6:].css(selectors['text']).getall()
        ]
        start_months = []
        end_months = []
        for i, (prev, current) in enumerate(zip(months, months[1:])):
            if prev == current:
                continue
            if current:
                # Rising edge. `current` is start month.
                start_months.append(i + 1) # +1 from `prev` to `current` index
                continue
            # Falling edge. `prev` is end month
            end_months.append(i + 1) # +1 from `prev` to `current` index
        if start_months == []:
            months = [{'start': 0, 'end': 0}]
        else:
            if months[0] == months[-1] == '✓':
                # Rotate `start_months` to match last start month with first end month
                start_months = start_months[-1] + start_months[:-1]
            months = [
                {'start': start, 'end': end}
                for start, end in zip(start_months, end_months)
            ]

        return {
            **data,
            'shadow': shadow,
            'hours': hours,
            'months': months,
        }

    def parse_time_range(self, time_range):
        """
        Takes a time range string (eg. '9 AM - 4 PM') and returns a dict with
        the start and end times as 24-hour integers.
        """
        start, end = (
            # Convert 12-hour to 24-hour time
            int(strftime('%H', strptime(time, '%I %p')))
            for time in time_range.split(' - ')
        )
        return {
            'start': start,
            'end': end,
        }
