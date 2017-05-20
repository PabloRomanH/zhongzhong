#!/usr/bin/python

def utf8len(s):
    return len(s.decode('utf-8'))

cedict = open('cedict_ts.u8')

line = cedict.readline()

byte = 0

dictionary = {}

def saveToDict(key, value):
    dictionary.setdefault(key, [])
    dictionary[key].append(str(value))

while line:
    while line[0] == '#':
        byte += utf8len(line)
        line = cedict.readline()

    spacepos = line.find(' ')
    firstentry = line[0:spacepos]
    spacepos2 = line.find(' ', spacepos + 1)
    secondentry = line[spacepos + 1: spacepos2]
    if firstentry == secondentry:
        saveToDict(firstentry, byte)
    else:
        saveToDict(firstentry, byte)
        saveToDict(secondentry, byte)

    byte += utf8len(line)
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

index = open('cedict.idx', 'w')
index.writelines(outputlist)

index.close()
