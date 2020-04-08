# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import json


class JsonWriterPipeline(object):
    def open_spider(self, spider):
        self.items = []

    def close_spider(self, spider):
        with open('../public/fish.json', 'w') as f:
            f.write(json.dumps(self.items))

    def process_item(self, item, spider):
        image = item['images'][0]
        item['image'] = image
        del item['images']
        del item['image_urls']
        self.items.append(item)
        return item
