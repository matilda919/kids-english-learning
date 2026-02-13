#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量为vocabulary.js添加Unsplash图片URL
"""

import re

# 定义单词到图片URL的映射
IMAGE_URL_MAPPING = {
    # 数字类
    'one': 'https://images.unsplash.com/photo-1591191485459-36b9ef850d2c?w=400&q=80',
    'two': 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80',
    'three': 'https://images.unsplash.com/photo-1533614346686-a3bb02d66e8e?w=400&q=80',
    'four': 'https://images.unsplash.com/photo-1541522165085-c4dc0f3e7cbe?w=400&q=80',
    'five': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&q=80',
    'six': 'https://images.unsplash.com/photo-1554189097-ffe88e998a96?w=400&q=80',
    'seven': 'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=400&q=80',
    'eight': 'https://images.unsplash.com/photo-1553181808-896b4f3ed8ea?w=400&q=80',
    'nine': 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=400&q=80',
    'ten': 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400&q=80',

    # 动物类补充
    'chicken': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80',
    'rabbit': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&q=80',
    'sheep': 'https://images.unsplash.com/photo-1583961717228-045546be8513?w=400&q=80',
    'horse': 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=80',
    'butterfly': 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&q=80',
    'bee': 'https://images.unsplash.com/photo-1558408143-d691301ae5bc?w=400&q=80',
    'ant': 'https://images.unsplash.com/photo-1542332213-a2df8df67fc0?w=400&q=80',
    'spider': 'https://images.unsplash.com/photo-1591127134281-e9c988f498f8?w=400&q=80',
    'frog': 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&q=80',
    'turtle': 'https://images.unsplash.com/photo-1568409938619-12e139227838?w=400&q=80',
    'snail': 'https://images.unsplash.com/photo-1567498362933-5fd26ba4a63e?w=400&q=80',
    'lion': 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&q=80',
    'tiger': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&q=80',
    'bear': 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&q=80',
    'elephant': 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&q=80',
    'giraffe': 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&q=80',
    'zebra': 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&q=80',
    'monkey': 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&q=80',
    'kangaroo': 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&q=80',
    'panda': 'https://images.unsplash.com/photo-1525382455947-f319bc05fb35?w=400&q=80',
    'koala': 'https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?w=400&q=80',
    'penguin': 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400&q=80',
    'whale': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    'dolphin': 'https://images.unsplash.com/photo-1607153333879-c174e265b1d5?w=400&q=80',
    'shark': 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=400&q=80',
    'octopus': 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=400&q=80',
    'starfish': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    'crab': 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&q=80',
    'seahorse': 'https://images.unsplash.com/photo-1591371111849-cc601a7c0ee9?w=400&q=80',

    # 水果类补充
    'pear': 'https://images.unsplash.com/photo-1568969384119-081b35ad781f?w=400&q=80',
    'peach': 'https://images.unsplash.com/photo-1629828874514-44f0b9cddf9f?w=400&q=80',
    'cherry': 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&q=80',
    'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80',
    'pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&q=80',
    'kiwi': 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&q=80',
    'blueberry': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80',
    'raspberry': 'https://images.unsplash.com/photo-1577003833154-a9e8e98d2400?w=400&q=80',
    'lemon': 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&q=80',
    'coconut': 'https://images.unsplash.com/photo-1589965716319-4a041b58fa8a?w=400&q=80',

    # 食物类补充
    'juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80',
    'cheese': 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80',
    'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
    'noodles': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&q=80',
    'ice cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80',
    'candy': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&q=80',
    'chocolate': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80',
    'hamburger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
    'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    'hotdog': 'https://images.unsplash.com/photo-1612392062798-2fa88ce61c9f?w=400&q=80',

    # 蔬菜类补充
    'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
    'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80',
    'broccoli': 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&q=80',
    'cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&q=80',
    'lettuce': 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=400&q=80',
    'onion': 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80',
    'pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',

    # 家居物品类
    'table': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80',
    'chair': 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80',
    'bed': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80',
    'door': 'https://images.unsplash.com/photo-1542629425-87172f57e537?w=400&q=80',
    'window': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
    'house': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80',
    'school': 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80',
    'park': 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&q=80',
    'hospital': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80',
    'library': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80',

    # 形容词
    'big': 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&q=80',
    'small': 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&q=80',
    'happy': 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=400&q=80',
    'sad': 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=400&q=80',
    'hot': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&q=80',
    'cold': 'https://images.unsplash.com/photo-1517166357932-b3a5b29d2555?w=400&q=80',
    'fast': 'https://images.unsplash.com/photo-1580894908361-967195033215?w=400&q=80',
    'slow': 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&q=80',
    'tall': 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=400&q=80',
    'short': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    'clean': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80',
    'dirty': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80',

    # 天气
    'sun': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&q=80',
    'moon': 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=400&q=80',
    'star': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80',
    'rain': 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=400&q=80',
    'snow': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&q=80',
    'cloud': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&q=80',
    'wind': 'https://images.unsplash.com/photo-1606768666853-403c90a981ad?w=400&q=80',

    # 玩具
    'toy': 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&q=80',
    'ball': 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
    'doll': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    'teddy bear': 'https://images.unsplash.com/photo-1560582861-45078880e48e?w=400&q=80',
    'kite': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    'puzzle': 'https://images.unsplash.com/photo-1495364037436-fed1ba81ad3e?w=400&q=80',

    # 乐器
    'guitar': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80',
    'piano': 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=400&q=80',
    'drum': 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80',

    # 运动
    'soccer': 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400&q=80',
    'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
    'baseball': 'https://images.unsplash.com/photo-1508949750751-d1e7e675e01e?w=400&q=80',
}

def add_image_urls(file_path):
    """为vocabulary.js文件中的单词添加图片URL"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 计数器
    replaced_count = 0

    # 对每个单词进行替换
    for word, url in IMAGE_URL_MAPPING.items():
        # 使用正则表达式查找并替换
        pattern = rf"(id: '{re.escape(word)}',[^{{]+imageUrl: ''),"
        if re.search(pattern, content):
            replacement = rf"\1{url}'"
            content = re.sub(pattern, replacement, content)
            replaced_count += 1
            print(f"已为单词 '{word}' 添加图片URL")

    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\n总共为 {replaced_count} 个单词添加了图片URL")

if __name__ == '__main__':
    file_path = '/Users/yangmiao/kids-english-learning/src/data/vocabulary.js'
    add_image_urls(file_path)
