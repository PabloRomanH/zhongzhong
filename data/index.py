#!/usr/bin/env python3

# Offsets stored in cedict.idx must match JS string index positions, since
# dict.js indexes into cedict_ts.u8 as a JS string decoded from UTF-8 by
# fetch().text(). JS strings are UTF-16, so characters outside the Basic
# Multilingual Plane (rare CJK Ext. B+ characters, codepoint > 0xFFFF) count
# as 2 units (a surrogate pair), not 1 - Python's len() counts codepoints,
# which undercounts those. Counting UTF-16 code units directly avoids that
# mismatch.
def entrylen(s):
    return len(s.encode('utf-16-le')) // 2

cedict = open('cedict_ts.u8', encoding='utf-8', newline='')

line = cedict.readline()

offset = 0

dictionary = {}

def saveToDict(key, value):
    dictionary.setdefault(key, [])
    dictionary[key].append(str(value))

while line:
    while line[0] == '#':
        offset += entrylen(line)
        line = cedict.readline()

    spacepos = line.find(' ')
    firstentry = line[0:spacepos]
    spacepos2 = line.find(' ', spacepos + 1)
    secondentry = line[spacepos + 1: spacepos2]
    if firstentry == secondentry:
        saveToDict(firstentry, offset)
    else:
        saveToDict(firstentry, offset)
        saveToDict(secondentry, offset)

    offset += entrylen(line)
    line = cedict.readline()

cedict.close()


outputlist = []

for key in dictionary:
    newline = key
    for entry in dictionary[key]:
        newline += ',' + entry
    newline += '\n'
    outputlist.append(newline)

outputlist.sort()

index = open('cedict.idx', 'w', encoding='utf-8', newline='')
index.writelines(outputlist)

index.close()
