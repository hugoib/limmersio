import pandas as pd
import numpy as np
from textblob import TextBlob
import textwrap
from googletrans import Translator
import nltk
import random
import re
from nltk.collocations import *
import time

def limmersify(args):
    print(args)
    text = text_cleaning(args.text) 

    translator = Translator()
    phrases = extract_all_nouns_and_phrases(text, translator)
    nouns = extract_all_nouns_from_remaining_corpus(translator, phrases, text)

    word_dict, word_label_dic = create_word_label_dic()
    pairs = check_nouns_in_dataset(nouns, word_label_dic, word_dict)
    levelA, levelB, levelC = find_word_levels(pairs)

    final_text = limmersify_by_level(args.level, translator, text, phrases, levelA, levelB, levelC)
    
    return final_text


def text_cleaning(args):
    txt = args.lower()
    txt = re.sub(r'[\(\)\"#\/@;:\'<>\{\}\=~|\.\?]', '', txt)
    return txt

def extract_all_nouns_and_phrases(args, translator):
    blob = TextBlob(args)
    phrases = list(blob.noun_phrases)
    phrases = [i for i in phrases if len(i)>8]
    print('Extracted phrases:', phrases)
    #translated_phrases = [translator.translate(w, src='en', dest='de').text for w in phrases]
    #print('Translated phrases:', translated_phrases)
    print('*********************************************************************')
    return phrases

def extract_all_nouns_from_remaining_corpus(translator, phrases, txt):
    for i in phrases:
        txt_rm_phrase = txt.replace(i, '')
    is_noun = lambda pos: pos[:2] == 'NN'
    tokenized = nltk.word_tokenize(txt_rm_phrase)
    nouns = [word for (word, pos) in nltk.pos_tag(tokenized) if is_noun(pos)]
    nouns = [i for i in nouns if len(i) >2] # to remove some special characters
    print('Extracted nouns:', nouns)
    #translated_nouns = [translator.translate(w, src='en', dest='de').text for w in nouns]
    #print('Translated nouns:', translated_nouns)
    print('*********************************************************************')
    return nouns

def create_word_label_dic():
    import sys
    print(sys.path)
    word_label_dic = pd.read_csv("data/en_50k.csv", sep = ',', encoding= 'utf8')
    label = [0]*10000+[1]*20000+[2]*20000
    word_label_dic['label'] = label
    word_dict = dict(zip(word_label_dic.word, word_label_dic.label))
    return word_dict, word_label_dic

def check_nouns_in_dataset(nouns, word_label_dic, word_dict):
    text = list(set(nouns) & set(word_label_dic.word.to_list())) 
    l = [word_dict[i] for i in text]
    pairs = [(k, v) for (k, v) in zip(text, l)]
    return pairs

def find_word_levels(pairs):
    levelA = []
    levelB = []
    levelC = []
    for i in range(len(pairs)):
        if pairs[i][1] == 0:
            levelA.append(pairs[i][0])
        if pairs[i][1] == 1:
            levelB.append(pairs[i][0])
        if pairs[i][1] == 2:
            levelC.append(pairs[i][0])
    print('Level A words:', levelA)
    print('Level B words:', levelB)
    print('Level C words:', levelC)
    print('*********************************************************************')
    return levelA, levelB, levelC

def replace_all(text, dic):
    for i, j in dic.items():
        text = text.replace(i, j)
    return text

def wrap(string, max_width):
    return '\n'.join(textwrap.wrap(string, max_width))

def limmersify_by_level(level, translator, text, phrases, levelA, levelB, levelC):
    
    article_length = len(nltk.word_tokenize(text))
    final_text = ''
    if(level == "a"):
        selected_A = random.choices(levelA, k=round(0.15 * article_length))

        bold_A = []
        for w in selected_A:
            temp = translator.translate(w, src='en', dest='de').text
            bold_A.append("<span class='translated-word'>" + temp + "</span>")

        dictA= {k:v for k,v in zip(selected_A, bold_A)}
        final_text = replace_all(text, dictA)
    if(level == "b"):
        if len(random.choices(text, k=round(0.3 * article_length))) < len(levelA):
            selected_B = random.choices(levelA, k=round(0.3*article_length))
        else:
            selected_B = random.choices(levelA + levelB + phrases, k=round(0.15 * article_length))

        bold_B = []
        for w in selected_B:
            temp = translator.translate(w, src='en', dest='de').text
            bold_B.append("<span class='translated-word'>" + temp + "</span>")

        dictB= {k:v for k,v in zip(selected_B, bold_B)}
        final_text = replace_all(text, dictB)
    if(level == "c"):
        if len(random.choices(text, k=round(0.7 * article_length))) < len(levelA):
            selected_C = random.choices(levelA, k=round(0.3*article_length))
        else:
            selected_C = random.choices(levelA + levelB + levelC + phrases, k=round(0.15 * article_length))

        bold_C = []
        for w in selected_C:
            temp = translator.translate(w, src='en', dest='de').text
            bold_C.append("<span class='translated-word'>" + temp + "</span>")

        dictC = {k:v for k,v in zip(selected_C, bold_C)}
        final_text = replace_all(text, dictC)

    print("Final display for user level: " + level + " Text: " + final_text)
    return final_text





